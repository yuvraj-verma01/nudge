import { expect, test } from '@playwright/test';
import { actions, canSwap, decide, getFallback, initialState, learningInsights, migrateState, personalState, promptCount, readModeState, recommend, sampleCircleActivities, scenarioState, socialCue, swapAction } from '../src/engine';
import type { Response, State } from '../src/engine';
const response = (state: State, outcome: Response['outcome'], extra: Partial<Response> = {}): Response => ({ actionId: 'energiser', outcome, at: Date.now(), duration: 2, domain: 'move', date: '2026-10-03', contextHour: state.context.hour, contextMinute: state.context.minute, ...extra });
test('the opening interprets health and opportunity into one gentle physical action', () => {
  const state = initialState();
  const decision = decide(state);
  expect(decision.action?.id).toBe('energiser');
  expect(decision.action?.gentle).toBe(true);
  expect(decision.reasons.join(' ')).toContain('86 minutes sitting');
  expect(decision.reasons.join(' ')).toContain('14 minutes');
  expect(decision.reasons.join(' ')).toContain('short night');
});
test('busy, quiet hours, pause and snooze protect attention', () => {
  const state = initialState();
  expect(decide(scenarioState(state, 'Busy / no intervention')).action).toBeNull();
  expect(decide({ ...state, context: { ...state.context, hour: 23 } }).action).toBeNull();
  expect(decide({ ...state, preferences: { ...state.preferences, pausedUntil: Date.now() + 10000 } }).action).toBeNull();
  expect(decide({ ...state, snoozedUntil: Date.now() + 10000 }).action).toBeNull();
});
test('unknown personal context stays unknown and voluntary actions still work', () => {
  const state = personalState();
  expect(state.context.steps).toBeNull();
  expect(state.context.sleepMinutes).toBeNull();
  expect(state.completions).toHaveLength(0);
  const action = recommend(state, 'move', 2);
  expect(action.duration).toBeLessThanOrEqual(2);
});
test('every action has a complete guide and every fallback is strictly smaller', () => {
  for (const action of actions) {
    expect(action.steps.reduce((sum, s) => sum + s.seconds, 0)).toBe(action.duration * 60);
    expect(action.steps.every(s => !!s.instruction && s.seconds > 0)).toBe(true);
    const fallback = getFallback(action);
    if (fallback) expect(fallback.duration).toBeLessThan(action.duration);
    expect(getFallback(action, true)).toBeNull();
  }
  expect(new Set(actions.filter(a => a.domain === 'move').map(a => a.category)).size).toBe(5);
});
test('a tiny available window never produces an action longer than the window', () => {
  const state = initialState();
  for (const freeMinutes of [1, 2, 3, 5]) {
    const action = decide({ ...state, context: { ...state.context, freeMinutes } }).action;
    expect(action?.duration).toBeLessThanOrEqual(freeMinutes);
  }
});
test('requesting easier differs from declining, and fallback acceptance counts once', () => {
  const state = initialState();
  expect(decide({ ...state, responses: [response(state, 'fallback_requested')] }).action).not.toBeNull();
  expect(decide({ ...state, responses: [response(state, 'declined')] }).action).toBeNull();
  expect(promptCount([response(state, 'fallback_requested'), response(state, 'fallback_accepted', { fromFallback: true }), response(state, 'completed', { fromFallback: true })])).toBe(1);
});
test('completing a smaller break changes future effort; merely requesting it does not', () => {
  const state = initialState();
  const withChoice = { ...state, responses: [response(state, 'fallback_requested')] };
  expect(decide(scenarioState(withChoice, 'Quick movement opportunity')).action?.id).toBe('energiser');
  const completed: State = { ...state, completions: [...state.completions, { id: 'own', actionId: 'mobility-90', title: '90-second movement break', duration: 1.5, domain: 'move', time: '2:46 PM', date: '2026-10-03', fromFallback: true }] };
  expect(decide(scenarioState(completed, 'Quick movement opportunity')).action?.id).toBe('mobility-90');
  expect(learningInsights(completed)[0].detail).toContain('keep the next movement suggestion short');
});
test('swaps respect indoor, duration and gentle constraints and influence later selection', () => {
  const state = initialState();
  const walk = actions.find(a => a.id === 'walk')!;
  const inside = swapAction(state, walk, 'Stay indoors');
  expect(inside.indoor).toBe(true);
  expect(inside.id).not.toBe(walk.id);
  expect(swapAction(state, walk, 'Only have 2 minutes').duration).toBeLessThanOrEqual(2);
  expect(swapAction(state, walk, 'Something more active').gentle).toBe(true);
  const withSwap = { ...state, responses: [response(state, 'swapped', { actionId: inside.id, swapReason: 'Stay indoors' })] };
  expect(decide(scenarioState(withSwap, 'Quick movement opportunity')).action?.category).toBe('Mobility');
});
test('evening recharge follows interests and completion changes later relevance', () => {
  const state = scenarioState(initialState(), 'Evening recharge');
  expect(decide(state).action?.id).toBe('instrument');
  const reading = { ...state, preferences: { ...state.preferences, interests: ['Reading' as const] } };
  expect(decide(reading).action?.id).toBe('read');
  expect(decide({ ...state, completions: [...state.completions, { id: 'real-music', actionId: 'music', title: 'Music', duration: 4, domain: 'recharge', time: '7:10 PM', date: '2026-10-03' }] }).action?.interest).toBe('Music');
});
test('negative feedback reduces an activity’s relevance without diagnosing the user', () => {
  const state = scenarioState(initialState(), 'Evening recharge');
  const completion = { id: 'feedback', actionId: 'instrument', title: 'Instrument', duration: 10, domain: 'recharge' as const, time: '7:10 PM', date: '2026-10-03', feedback: 'Not better' };
  const withFeedback = { ...state, completions: [...state.completions, completion] };
  expect(recommend(withFeedback, 'recharge', 20).id).not.toBe('instrument');
});
test('sample history never creates a claimed learning pattern', () => {
  const insights = learningInsights(initialState());
  expect(insights[0].title).toBe('Finding your movement rhythm');
  expect(insights[1].title).toBe('Recharge, in your own way');
  expect(insights.some(i => /You completed/.test(i.detail))).toBe(false);
});
test('cooldown, fatigue and rejected mornings stay independent of need', () => {
  const state = initialState();
  expect(decide({ ...state, responses: [response(state, 'completed')] }).action).toBeNull();
  expect(decide(scenarioState({ ...state, responses: [response(state, 'completed')] }, 'Quick movement opportunity')).action).not.toBeNull();
  const responses = [1, 2, 3].map(() => response(state, 'accepted', { contextHour: 9 }));
  expect(decide({ ...state, responses }).action).toBeNull();
  const morning: State = { ...state, context: { ...state.context, hour: 11 }, responses: [1, 2].map(() => response(state, 'declined', { contextHour: 9 })) };
  expect(decide(morning).action).toBeNull();
});
test('legacy state keeps history, busy-time settings and renamed preferences', () => {
  const old = { version: 1, demoMode: false, preferences: { name: 'Alex', interests: ['Guitar', 'Creative time', 'Hobbies', 'Friends'], calendar: false }, context: { hour: 14, minute: 37, freeMinutes: 17, sittingMinutes: 82 }, completions: [{ id: 'past', actionId: 'guitar', title: 'Played an instrument', duration: 15, domain: 'recharge', time: '6:00 PM', at: Date.now() }], responses: [{ actionId: 'walk', outcome: 'rejected', duration: 7, domain: 'move', at: Date.now() }] };
  const migrated = migrateState(old);
  expect(migrated.preferences.interests).toEqual(['Playing musical instruments', 'Creative hobbies', 'Talking to a friend']);
  expect(migrated.completions[0].actionId).toBe('instrument');
  expect(migrated.responses[0].outcome).toBe('declined');
  expect(migrated.preferences.calendar).toBe(false);
  expect(migrated.preferences.name).toBe('Alex');
  expect(migrated.demoMode).toBe(false);
});
test('the later busy afternoon visibly reflects a completed easier action, including an explicit demo completion', () => {
  const state = initialState();
  const later = scenarioState(state, 'Later busy afternoon');
  expect(later.context).toMatchObject({ freeMinutes: 14, sittingMinutes: 75, meetings: 4, lowSleep: true });
  expect(decide(later).action?.id).toBe('energiser');
  const learned: State = { ...state, completions: [...state.completions, { id: 'presented', actionId: 'mobility-90', title: '90-second movement break', duration: 1.5, domain: 'move', date: '2026-10-03', time: '2:46 PM', fromFallback: true, simulated: true }] };
  const next = decide(scenarioState(learned, 'Later busy afternoon'));
  expect(next.action?.id).toBe('mobility-90');
  expect(next.reasons).toContain('You completed a smaller break, so we lowered the effort');
  expect(learningInsights(learned)[0].title).toBe('Smaller movement fits');
  expect(migrateState(scenarioState(learned, 'Later busy afternoon')).scenario).toBe('Later busy afternoon');
});
test('movement swaps demonstrate distinct categories without dropping fit or gentleness', () => {
  const state = initialState();
  const action = actions.find(a => a.id === 'energiser')!;
  const categories: [string, string][] = [['Go outside', 'Outdoors'], ['Stretch / mobility', 'Mobility'], ['Wake me up', 'Energise'], ['Move a little stronger', 'Strength'], ['Move to music', 'Energise']];
  for (const [reason, category] of categories) {
    expect(canSwap(state, action, reason)).toBe(true);
    const swapped = swapAction(state, action, reason);
    expect(swapped.id).not.toBe(action.id);
    expect(swapped.category).toBe(category);
    expect(swapped.gentle).toBe(true);
    expect(swapped.duration).toBeLessThanOrEqual(state.context.freeMinutes! - 1);
  }
  expect(swapAction(state, action, 'Wake me up').steps.map(step => step.seconds)).toEqual([20, 20, 20]);
  expect(swapAction(state, action, 'Move a little stronger').id).toBe('sit-stand');
  expect(swapAction(state, action, 'Move to music').movement).toBe('Moving to music');
  const music = swapAction(state, action, 'Move to music');
  const narrow: State = { ...state, context: { ...state.context, freeMinutes: 1 } };
  expect(canSwap(narrow, music, 'Move to music')).toBe(false);
  expect(swapAction(narrow, music, 'Move to music').id).toBe(music.id);
});
test('on demand mental intents are distinct and do not fabricate a longer available window', () => {
  const state = initialState();
  expect(recommend(state, 'recharge', 2, undefined, 'Clear my head').category).toBe('Quiet');
  const enjoyable = recommend(state, 'recharge', 1, undefined, 'Do something I enjoy');
  expect(enjoyable.category).not.toBe('Quiet');
  expect(enjoyable.interest).toBe('Music');
  expect(enjoyable.duration).toBeLessThanOrEqual(1);
  const reading = { ...state, preferences: { ...state.preferences, interests: ['Reading' as const] } };
  expect(recommend(reading, 'recharge', 10, undefined, 'Do something I enjoy').interest).toBe('Reading');
});
test('the connection example uses an actual interest without claiming a friend is available', () => {
  const state = scenarioState(initialState(), 'Connection recharge');
  expect(decide(state).action?.id).toBe('friend');
  expect(socialCue(decide(state).action!)).toBeNull();
  const noConnection = { ...state, preferences: { ...state.preferences, interests: ['Music' as const] } };
  expect(decide(noConnection).action?.interest).toBe('Music');
});
test('social modelling reflects labelled Circle examples and remains relevant to the action', () => {
  const moveCue = socialCue(actions.find(a => a.id === 'squats')!);
  expect(moveCue?.people).toEqual(['Jay', 'Maya']);
  expect(moveCue?.text).toContain('movement breaks');
  expect(moveCue?.text).not.toContain('squat');
  const musicians = socialCue(actions.find(a => a.id === 'instrument')!);
  expect(musicians?.people).toEqual(['Vijay']);
  expect(sampleCircleActivities.find(activity => activity.person === 'Vijay')?.actionId).toBe('instrument');
  expect(socialCue(actions.find(a => a.id === 'music')!, { hour: 11, minute: 0 })).toBeNull();
  expect(socialCue(actions.find(a => a.id === 'music')!, initialState().context)?.people).toEqual(['Vijay']);
  expect(socialCue(actions.find(a => a.id === 'music')!, { hour: 19, minute: 0 })?.people).toEqual(['Vijay']);
  expect(socialCue(actions.find(a => a.id === 'energiser')!, { hour: 13, minute: 50 })?.people).toEqual(['Jay']);
  expect(socialCue(actions.find(a => a.id === 'read')!)).toBeNull();
});
test('busy explanations include recent movement only when actual saved context supports it', () => {
  const state = initialState();
  const busy = scenarioState(state, 'Busy / no intervention');
  expect(decide(busy).reason).not.toContain('already took');
  const moved = { ...state, responses: [response(state, 'completed')] };
  expect(decide(scenarioState(moved, 'Busy / no intervention')).reason).toContain('already took a movement break recently');
  const alreadyMoved = { ...state, responses: [response(state, 'already_done')] };
  expect(decide(scenarioState(alreadyMoved, 'Busy / no intervention')).reason).toContain('already took');
  expect(learningInsights(alreadyMoved)[0].title).toBe('Finding your movement rhythm');
});
test('neutral negative feedback lowers relevance while older saved feedback still works', () => {
  const state = scenarioState(initialState(), 'Evening recharge');
  for (const feedback of ['Not for me', 'Not better']) {
    const updated = { ...state, completions: [...state.completions, { id: 'feedback', actionId: 'instrument', title: 'Instrument', duration: 10, domain: 'recharge' as const, date: '2026-10-03', time: '7:10 PM', feedback }] };
    expect(recommend(updated, 'recharge', 20).id).not.toBe('instrument');
    expect(learningInsights(updated)[1].detail).toContain('give it less weight');
  }
});
test('a smaller completed action can teach effort without overriding negative activity feedback', () => {
  const state = initialState();
  for (const feedback of ["Didn't feel right", 'Didn’t feel right', 'More tired']) {
    const updated: State = { ...state, smallerMove: true, completions: [...state.completions, { id: 'small-feedback', actionId: 'mobility-90', title: '90-second movement break', duration: 1.5, domain: 'move', date: '2026-10-03', time: '2:46 PM', fromFallback: true, feedback }] };
    const later = decide(scenarioState(updated, 'Later busy afternoon'));
    expect(later.action?.id).not.toBe('mobility-90');
    expect(later.action?.duration).toBeLessThanOrEqual(1.5);
    expect(learningInsights(updated)[0].detail).toContain('completed');
    expect(learningInsights(updated)[0].detail).not.toContain('worked');
  }
});

test('connection recharge remains available after completing the evening presentation action', () => {
  const evening = scenarioState(initialState(), 'Evening recharge');
  const completed: State = { ...evening, responses: [response(evening, 'accepted', { actionId: 'instrument', domain: 'recharge', duration: 10 }), response(evening, 'completed', { actionId: 'instrument', domain: 'recharge', duration: 10 })] };
  const connection = scenarioState(completed, 'Connection recharge');
  expect(connection.context).toMatchObject({ hour: 20, minute: 10, nextEvent: null });
  expect(decide(connection).action?.id).toBe('friend');
});
test('restoring an open evening preserves the absence of a next calendar commitment', () => {
  const evening = scenarioState(initialState(), 'Evening recharge');
  const restored = migrateState(JSON.parse(JSON.stringify(evening)));
  expect(restored.context.nextEvent).toBeNull();
  expect(decide(restored).reasons).toContain('30 minutes open');
  expect(decide(restored).reasons.join(' ')).not.toContain('next commitment');
});
test('missing or invalid personal state never turns sample context or history into personal data', () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  try {
    for (const saved of ['{}', JSON.stringify({ version: 2, preferences: {}, context: {} })]) {
      Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: (key: string) => key === 'mosaic-v2-personal' ? saved : null } });
      const personal = readModeState(false);
      expect(personal.demoMode).toBe(false);
      expect(personal.preferences.name).toBe('');
      expect(personal.context.steps).toBeNull();
      expect(personal.context.freeMinutes).toBeNull();
      expect(personal.completions).toEqual([]);
    }
  } finally {
    if (original) Object.defineProperty(globalThis, 'localStorage', original);
    else Reflect.deleteProperty(globalThis, 'localStorage');
  }
});
