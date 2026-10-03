import { restoreSpotify, sampleSpotify, selectedTrack } from './spotify';
import type { SpotifyContext } from './spotify';
export type Domain = 'move' | 'recharge';
export type Mood = 'Good' | 'Fine' | 'Tired' | 'Stressed' | 'Overwhelmed';
export const rechargeInterests = ['Music', 'Talking to a friend', 'Playing musical instruments', 'Reading', 'Watching something', 'Gaming', 'Creative hobbies', 'Going outside', 'Quiet / mindfulness'] as const;
export type Interest = typeof rechargeInterests[number];
export const movementInterests = ['Walking', 'Stretching / mobility', 'Short active bursts', 'Stairs', 'Moving to music', 'Outdoor movement', 'Strength micro-actions'] as const;
export type MovementInterest = typeof movementInterests[number];
export type Step = { title: string; seconds: number; instruction: string };
export type Action = { id: string; title: string; description: string; duration: number; domain: Domain; category: string; interest?: Interest; movement?: MovementInterest; icon: string; indoor: boolean; portable?: boolean; gentle: boolean; fallbackId?: string; steps: Step[] };
export type ResponseOutcome = 'accepted' | 'fallback_requested' | 'fallback_accepted' | 'swapped' | 'declined' | 'ignored' | 'already_done' | 'completed' | 'abandoned' | 'snoozed';
export type Response = { actionId: string; outcome: ResponseOutcome; at: number; duration: number; domain: Domain; date: string; contextHour: number; contextMinute: number; fromFallback?: boolean; swapReason?: string; social?: boolean; swappedFrom?: string };
export type Completion = { id: string; actionId?: string; title: string; duration: number; domain: Domain; date: string; time: string; at?: number; contextHour?: number; contextMinute?: number; fromFallback?: boolean; demo?: boolean; simulated?: boolean; feedback?: string; shared?: boolean; elapsedSeconds?: number };
export type Preferences = { name: string; goals: string[]; interests: Interest[]; movementPreferences: MovementInterest[]; move: boolean; recharge: boolean; intensity: 'Light' | 'Balanced' | 'Active'; quietStart: string; quietEnd: string; calendar: boolean; movement: boolean; shareMove: boolean; shareRecharge: boolean; pausedUntil: number | null };
export type ActivitySetting = 'any' | 'indoor' | 'outdoor';
export type Context = { setting?: ActivitySetting; recentHeartRate?: number | null; heartRateTimestamp?: string | null; heartRateSource?: string | null; freeMinutes: number | null; sittingMinutes: number | null; inMeeting: boolean; hour: number; minute: number; lowSleep: boolean; sleepMinutes: number | null; steps: number | null; meetings: number | null; nextEvent: string | null; sessionStarted: number };
export const scenarios = ['Packed afternoon', 'Later busy afternoon', 'Quick movement opportunity', 'Busy / no intervention', 'Evening recharge', 'Evening music recharge', 'Connection recharge', 'Social prompt'] as const;
export type Scenario = typeof scenarios[number];
export type State = { spotify: SpotifyContext; version: 2; preferences: Preferences; context: Context; mood: Mood | null; responses: Response[]; completions: Completion[]; snoozedUntil: number | null; smallerMove: boolean; demoMode: boolean; scenario: Scenario };
export const SAMPLE_DATE = '2026-10-03';
const move = (id: string, title: string, duration: number, category: string, movement: MovementInterest, description: string, options: Partial<Action> = {}): Action => ({ id, title, duration, category, movement, description, domain: 'move', icon: category === 'Walk' || category === 'Outdoors' ? 'footprints' : 'move', indoor: true, gentle: true, steps: [{ title, seconds: duration * 60, instruction: description }], ...options });
const recharge = (id: string, title: string, duration: number, category: string, interest: Interest, icon: string, description: string): Action => ({ id, title, duration, category, interest, icon, description, domain: 'recharge', indoor: interest !== 'Going outside', portable: ['Music', 'Talking to a friend', 'Reading', 'Quiet / mindfulness'].includes(interest), gentle: true, fallbackId: 'quiet', steps: [{ title, seconds: duration * 60, instruction: description }] });
export const actions: Action[] = [
  move('energiser', '2-minute energiser', 2, 'Energise', 'Short active bursts', 'Roll your shoulders, stretch and march.', { fallbackId: 'mobility-90', steps: [
    { title: 'Shoulder rolls', seconds: 30, instruction: 'Relax your arms. Slowly roll your shoulders back.' },
    { title: 'Standing mobility', seconds: 30, instruction: 'Stand and reach upward, then release. Keep the reach comfortable.' },
    { title: 'Gentle march', seconds: 60, instruction: 'March at an easy pace, seated or standing. Keep your breathing comfortable.' },
  ] }),
  move('mobility-90', '90-second movement break', 1.5, 'Mobility', 'Stretching / mobility', 'Change position, roll your shoulders and stretch.', { steps: [
    { title: 'Change position', seconds: 30, instruction: 'Stand if comfortable, or sit upright with both feet supported.' },
    { title: 'Shoulder rolls', seconds: 30, instruction: 'Slowly roll your shoulders back. Keep it gentle.' },
    { title: 'Easy stretch', seconds: 30, instruction: 'Reach your arms up or forward, then relax.' },
  ] }),
  move('mobility', '2-minute desk mobility', 2, 'Mobility', 'Stretching / mobility', 'Roll your shoulders, reach and loosen your wrists.', { fallbackId: 'stand', steps: [
    { title: 'Shoulders', seconds: 40, instruction: 'Slowly roll your shoulders back. Keep your neck relaxed.' },
    { title: 'Gentle reach', seconds: 40, instruction: 'Reach your arms forward or up, within a comfortable range.' },
    { title: 'Wrist reset', seconds: 40, instruction: 'Open and close your hands, then gently circle your wrists.' },
  ] }),
  move('walk', '5-minute outdoor walk', 5, 'Walk', 'Walking', 'Step away from your screen and take an easy walk.', { indoor: false, fallbackId: 'outside-2' }),
  move('walk-3', '3-minute building lap', 3, 'Walk', 'Walking', 'Walk a lap around your building or room.', { fallbackId: 'stand' }),
  move('walk-friend', 'Walk and talk', 5, 'Walk', 'Walking', 'Take an easy walk while talking to a friend. Keep your attention on your surroundings.', { indoor: false, fallbackId: 'outside-2' }),
  move('shoulders', 'One minute for your shoulders', 1, 'Mobility', 'Stretching / mobility', 'Relax your arms and slowly roll your shoulders back.'),
  move('neck', 'Neck and upper-back reset', 1, 'Mobility', 'Stretching / mobility', 'Sit or stand comfortably. Gently turn your head from side to side, then relax your shoulders.'),
  move('hips', '2-minute hip mobility', 2, 'Mobility', 'Stretching / mobility', 'Hold a stable support if needed. Gently shift your weight from side to side.', { fallbackId: 'stand' }),
  move('wrists', 'Wrist and forearm reset', 1, 'Mobility', 'Stretching / mobility', 'Open your hands, softly circle your wrists and relax. Avoid pushing into discomfort.'),
  move('stand', 'One-minute standing stretch', 1, 'Mobility', 'Stretching / mobility', 'Stand if comfortable, or change your seated position. Reach gently and let your shoulders settle.'),
  move('march', 'One-minute movement burst', 1, 'Energise', 'Short active bursts', 'March in place at a comfortable pace, seated or standing. A minute is plenty.', { gentle: false }),
  move('energy-burst', '1-minute energy burst', 1, 'Energise', 'Short active bursts', 'Three easy movements, at your own pace. Seated versions count too.', { steps: [
    { title: 'Easy march', seconds: 20, instruction: 'March gently in place, seated or standing. Keep the pace comfortable.' },
    { title: 'Sit to stand', seconds: 20, instruction: 'Use a stable chair. Slowly stand and sit with support, or stay seated and gently lift each heel.' },
    { title: 'Step jacks', seconds: 20, instruction: 'Step one foot sideways and back, then the other. Stay seated and gently tap each foot outward if that fits better.' },
  ] }),
  move('move-song', 'Move to one song', 4, 'Energise', 'Moving to music', 'Put on a song you love and move however feels good. No choreography needed.', { gentle: false, fallbackId: 'stand', icon: 'music' }),
  move('music-move-minute', 'A minute moving to music', 1, 'Energise', 'Moving to music', 'Put on a song you like. Sway, tap your feet or move gently, seated or standing. Your pace is enough.', { icon: 'music' }),
  move('stairs', 'One easy flight of stairs', 3, 'Energise', 'Stairs', 'If stairs feel comfortable, take one easy flight and return. Use the handrail as needed.', { gentle: false, fallbackId: 'stand' }),
  move('strength', '2-minute strength break', 2, 'Strength', 'Strength micro-actions', 'A few comfortable sit-to-stands and calf raises. Keep a stable support nearby.', { gentle: false, fallbackId: 'calves', steps: [
    { title: 'Sit to stand', seconds: 60, instruction: 'From a stable chair, stand and sit slowly a few times. Use support as needed.' },
    { title: 'Calf raises', seconds: 60, instruction: 'Holding a stable support, gently rise onto your toes and lower.' },
  ] }),
  move('squats', 'A few easy squats', 1, 'Strength', 'Strength micro-actions', 'With a stable support nearby, bend your knees a little and stand back up. Keep the range comfortable.', { gentle: false }),
  move('wall-push', 'One-minute wall push-ups', 1, 'Strength', 'Strength micro-actions', 'Place your hands on a wall. Gently lean toward it and push back at an easy pace.', { gentle: false }),
  move('calves', 'One minute of calf raises', 1, 'Strength', 'Strength micro-actions', 'Hold a stable support. Slowly lift and lower your heels.'),
  move('sit-stand', 'A few sit-to-stands', 1, 'Strength', 'Strength micro-actions', 'Use a stable chair. Slowly stand and sit a few times, with support if needed.'),
  move('outside-2', '2 minutes outside', 2, 'Outdoors', 'Outdoor movement', 'Step outside and walk for two minutes.', { indoor: false, fallbackId: 'outside-minute' }),
  move('outside-minute', 'One minute outside', 1, 'Outdoors', 'Outdoor movement', 'Step outside nearby. Stand or take a few easy steps.', { indoor: false }),
  move('outside', 'A little fresh air', 3, 'Outdoors', 'Outdoor movement', 'Take a short walk outside.', { indoor: false, fallbackId: 'outside-2' }),
  recharge('instrument', '10 minutes with an instrument', 10, 'Creative', 'Playing musical instruments', 'music', 'Play something you enjoy on your instrument.'),
  recharge('music-song', 'One-song reset', 273 / 60, 'Enjoyment', 'Music', 'music', 'Put everything else down. No scrolling. No work. Just listen.'),
  recharge('music', 'Take one song to yourself', 4, 'Enjoyment', 'Music', 'music', 'Put on a song you enjoy and listen without working.'),
  // Retained for old history; never offered as a new Recharge action.
  recharge('music-minute', 'A minute of music', 1, 'Enjoyment', 'Music', 'music', 'A previously recorded music break.'),
  recharge('friend', 'Talk to a friend', 5, 'Connection', 'Talking to a friend', 'users', 'Call or message a friend you’d like to catch up with.'),
  recharge('read', 'A few pages, just for you', 10, 'Enjoyment', 'Reading', 'book', 'Read a few pages of something you enjoy.'),
  recharge('show', 'Watch something you enjoy', 15, 'Enjoyment', 'Watching something', 'film', 'Watch a short episode or video you’ve been looking forward to.'),
  recharge('movie', 'Make room for a movie', 90, 'Enjoyment', 'Watching something', 'film', 'Choose a film that fits your 90-minute opening.'),
  recharge('game', 'A little game break', 10, 'Enjoyment', 'Gaming', 'game', 'Play a game you can pause when your break ends.'),
  recharge('draw', 'Make something small', 5, 'Creative', 'Creative hobbies', 'palette', 'Draw, doodle or make something for five minutes.'),
  recharge('write', 'A few lines for yourself', 5, 'Creative', 'Creative hobbies', 'palette', 'Write a few lines—a thought, a story or whatever comes to mind.'),
  recharge('photo', 'Notice something worth a photo', 5, 'Creative', 'Creative hobbies', 'camera', 'Find a detail you like and photograph it.'),
  recharge('outdoor-recharge', 'Sit outside for a little while', 5, 'Outdoors', 'Going outside', 'tree', 'Sit outside and put your screen away.'),
  recharge('coffee', 'A little time with someone', 10, 'Connection', 'Talking to a friend', 'users', 'If a friend is nearby, take a coffee break together.'),
  recharge('quiet', 'One quiet minute', 1, 'Quiet', 'Quiet / mindfulness', 'wind', 'Look away from your screen and take a few comfortable breaths.'),
  recharge('screen-pause', 'A screen-free pause', 2, 'Quiet', 'Quiet / mindfulness', 'wind', 'Put your screen away for two minutes.'),
];

export const sampleCircleActivities = [
  { person: 'Jay', actionId: 'energiser', time: '1:40 PM', hour: 13, minute: 40, description: 'Took a 2-minute energiser' },
  { person: 'Maya', actionId: 'mobility-90', time: '2:10 PM', hour: 14, minute: 10, description: 'Made time for a 90-second movement break' },
  { person: 'Vijay', actionId: 'instrument', time: '12:15 PM', hour: 12, minute: 15, description: 'Played a musical instrument for 10 minutes' },
] as const;
export function socialCue(action: Action, context?: Pick<Context, 'hour' | 'minute'>): { people: string[]; text: string; invitation: string } | null {
  const visible = sampleCircleActivities.filter(activity => !context || activity.hour * 60 + activity.minute <= context.hour * 60 + context.minute);
  if (action.domain === 'move') {
    const people = visible.filter(activity => actions.find(item => item.id === activity.actionId)?.domain === 'move').map(activity => activity.person);
    const sameAction = visible.find(activity => activity.actionId === action.id);
    const others = people.filter(person => person !== sameAction?.person);
    return people.length ? { people, text: sameAction ? `${sameAction.person} did this ${action.duration < 2 ? `${Math.round(action.duration * 60)}-second` : `${action.duration}-minute`} reset.${others.length ? ` ${others.join(' and ')} moved too.` : ''}` : `${people.join(' and ')} took ${people.length === 1 ? 'a movement break' : 'movement breaks'} today.`, invitation: 'Join them with this one?' } : null;
  }
  if ((action.interest === 'Music' || action.interest === 'Playing musical instruments') && visible.some(activity => activity.person === 'Vijay')) return { people: ['Vijay'], text: 'Vijay made time for music today.', invitation: 'Make a little room for yours?' };
  return null;
}

export function localDate(now = new Date()) { return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`; }
export function stateDate(state: State) { return state.demoMode ? SAMPLE_DATE : localDate(); }
export function demoTime(context: Pick<Context, 'hour' | 'minute'>) { return `${context.hour % 12 || 12}:${String(context.minute).padStart(2, '0')} ${context.hour >= 12 ? 'PM' : 'AM'}`; }
export function durationLabel(minutes: number) { const seconds = Math.round(minutes * 60); return minutes < 2 ? `${seconds} seconds` : seconds % 60 ? `${Math.floor(seconds / 60)} minutes ${seconds % 60} seconds` : `${minutes} minutes`; }
const prefs = (): Preferences => ({ name: 'Yuvraj', goals: ['Break up sitting', 'Unwind'], interests: ['Music', 'Going outside', 'Talking to a friend', 'Playing musical instruments', 'Watching something'], movementPreferences: ['Stretching / mobility', 'Outdoor movement', 'Short active bursts'], move: true, recharge: true, intensity: 'Balanced', quietStart: '22:00', quietEnd: '08:00', calendar: true, movement: true, shareMove: false, shareRecharge: false, pausedUntil: null });
const seedHistory = (): Completion[] => [
  ['2026-09-28', 'mobility', 5, 14, 20], ['2026-09-28', 'music', 12, 19, 10],
  ['2026-09-29', 'walk', 5, 13, 30], ['2026-09-30', 'mobility', 5, 15, 5],
  ['2026-09-30', 'friend', 5, 19, 30], ['2026-10-01', 'walk', 5, 12, 10],
  ['2026-10-02', 'energiser', 2, 14, 10], ['2026-10-03', 'music', 7, 12, 15],
  ['2026-10-03', 'quiet', 1, 9, 40],
].map(([date, actionId, duration, hour, minute], index) => {
  const action = actions.find(item => item.id === actionId)!;
  return { id: `sample-${index}`, actionId: action.id, title: action.interest === 'Music' ? 'Time for music' : action.id === 'mobility' ? 'Mobility break' : action.title, duration: Number(duration), elapsedSeconds: Number(duration) * 60, domain: action.domain, date: String(date), time: demoTime({ hour: Number(hour), minute: Number(minute) }), contextHour: Number(hour), contextMinute: Number(minute), demo: true };
});
export function sampleHeartRate(hour: number, minute: number) { return { recentHeartRate: 76, heartRateTimestamp: new Date(`${SAMPLE_DATE}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00+05:30`).toISOString(), heartRateSource: 'Sample Health Data' }; }
export const initialState = (): State => ({ spotify: sampleSpotify(), version: 2, preferences: prefs(), context: { ...sampleHeartRate(14, 34), hour: 14, minute: 46, freeMinutes: 14, sittingMinutes: 86, sleepMinutes: 342, lowSleep: true, steps: 2180, meetings: 3, nextEvent: '3:00 PM', inMeeting: false, sessionStarted: Date.now() }, mood: 'Tired', responses: [], completions: seedHistory(), snoozedUntil: null, smallerMove: false, demoMode: true, scenario: 'Packed afternoon' });
export function personalState(): State {
  const now = new Date();
  return { ...initialState(), demoMode: false, spotify: sampleSpotify(false), preferences: { ...prefs(), name: '', interests: [], movementPreferences: [], goals: [], calendar: false, movement: false }, context: { recentHeartRate: null, heartRateTimestamp: null, heartRateSource: null, hour: now.getHours(), minute: now.getMinutes(), freeMinutes: null, sittingMinutes: null, sleepMinutes: null, steps: null, meetings: null, nextEvent: null, lowSleep: false, inMeeting: false, sessionStarted: Date.now() }, mood: null, completions: [] };
}
export function scenarioState(current: State, scenario: Scenario): State {
  const context = { ...initialState().context, setting: current.context.setting, sessionStarted: Date.now() };
  if (scenario === 'Quick movement opportunity') Object.assign(context, { hour: 16, minute: 20, freeMinutes: 3, sittingMinutes: 75, nextEvent: '4:23 PM' });
  if (scenario === 'Later busy afternoon') Object.assign(context, { hour: 16, minute: 20, freeMinutes: 14, sittingMinutes: 75, meetings: 4, nextEvent: '4:34 PM' });
  if (scenario === 'Busy / no intervention') Object.assign(context, { hour: 15, minute: 5, freeMinutes: 0, inMeeting: true, nextEvent: '4:10 PM' });
  if (scenario === 'Evening recharge') Object.assign(context, { hour: 19, minute: 10, freeMinutes: 30, sittingMinutes: 25, steps: 5460, meetings: 4, nextEvent: null });
  if (scenario === 'Evening music recharge') Object.assign(context, { hour: 19, minute: 10, freeMinutes: 22, sittingMinutes: 25, steps: 5460, meetings: 4, nextEvent: null });
  if (scenario === 'Connection recharge') Object.assign(context, { hour: 20, minute: 10, freeMinutes: 15, sittingMinutes: 25, steps: 5460, meetings: 4, nextEvent: null });
  if (scenario === 'Social prompt') Object.assign(context, { hour: 17, minute: 20, freeMinutes: 15, sittingMinutes: 70, steps: 3900, lowSleep: false, nextEvent: '5:35 PM' });
  const sampleTimestamp = new Date(`${SAMPLE_DATE}T${String(context.hour).padStart(2, '0')}:${String(context.minute).padStart(2, '0')}:00+05:30`); sampleTimestamp.setMinutes(sampleTimestamp.getMinutes() - 12); context.heartRateTimestamp = sampleTimestamp.toISOString();
  if (!current.preferences.movement) Object.assign(context, { recentHeartRate: null, heartRateTimestamp: null, heartRateSource: null, sleepMinutes: null, steps: null, sittingMinutes: null, lowSleep: false });
  return { ...current, context, demoMode: true, scenario, snoozedUntil: null, mood: ['Evening recharge', 'Evening music recharge', 'Connection recharge'].includes(scenario) ? 'Fine' : scenario === 'Packed afternoon' ? 'Tired' : null };
}
export function isQuiet(p: Preferences, hour: number, minute: number) {
  const minutes = (time: string) => { const [h, m] = time.split(':').map(Number); return h * 60 + m; };
  const start = minutes(p.quietStart), end = minutes(p.quietEnd), now = hour * 60 + minute;
  return start === end ? false : start < end ? now >= start && now < end : now >= start || now < end;
}
export function getFallback(action: Action, alreadyFallback = false) { return alreadyFallback ? null : actions.find(candidate => candidate.id === action.fallbackId && candidate.domain === action.domain && candidate.duration < action.duration) ?? null; }
export function promptCount(responses: Response[]) { return responses.filter(r => ['accepted', 'declined', 'snoozed', 'fallback_requested'].includes(r.outcome) && !r.fromFallback).length; }
function elapsed(response: Response, state: State) {
  if (!state.demoMode) return (Date.now() - response.at) / 60000;
  const difference = state.context.hour * 60 + state.context.minute - (response.contextHour * 60 + response.contextMinute);
  return difference < 0 ? Infinity : difference;
}
export function learnedSmall(state: State) { return state.smallerMove || state.completions.some(c => !c.demo && c.domain === 'move' && c.fromFallback); }
const didNotFit = (feedback?: string) => ['More tired', 'Not better', "Didn't feel right", 'Didn’t feel right', 'Not for me'].includes(feedback ?? '');
function score(action: Action, state: State) {
  const music = action.domain === 'recharge' && action.interest === 'Music';
  const completions = state.completions.filter(c => !c.demo && (c.actionId === action.id || music && actions.find(a => a.id === c.actionId)?.interest === 'Music'));
  const declines = state.responses.filter(r => r.actionId === action.id && ['declined', 'ignored', 'abandoned'].includes(r.outcome));
  let result = completions.length * 3 - declines.length * 3;
  result -= completions.filter(c => didNotFit(c.feedback)).length * 9;
  result += completions.filter(c => c.feedback === 'Helped').length * 3;
  const supportedCompletions = state.responses.filter(r => r.outcome === 'completed' && r.social && r.domain === action.domain).length;
  if (supportedCompletions >= 2 && sampleCircleActivities.some(activity => activity.actionId === action.id)) result += 2;
  result -= state.responses.filter(r => r.outcome === 'swapped' && r.swappedFrom === action.id).length * 3;
  if (action.domain === 'move' && action.duration <= 2 && state.completions.filter(c => !c.demo && c.domain === 'move' && c.duration <= 2).length >= 3) result += 3;
  if (action.domain === 'move') {
    if (state.preferences.movementPreferences.includes(action.movement!)) result += 3;
    if (action.id === 'energiser') result += 2;
    if (learnedSmall(state) && action.id === 'mobility-90' && !didNotFit(completions.at(-1)?.feedback)) result += 8;
    if (state.responses.some(r => r.outcome === 'swapped' && r.swapReason === 'Stay indoors') && action.indoor && action.category === 'Mobility') result += 5;
    if (state.scenario === 'Social prompt' && action.id === 'walk') result += 6;
  } else {
    if (state.preferences.interests.includes(action.interest!)) result += 4;
    if (action.id === 'music') result += 1;
    if (action.id === 'music-song') result += 2;
    if (action.id === 'movie' && (state.context.freeMinutes ?? 0) >= 90) result += 4;
    if (state.scenario === 'Evening music recharge' && action.interest === 'Music' && state.preferences.interests.includes('Music') && !completions.some(c => didNotFit(c.feedback))) result += 8;
    if (state.context.hour >= 18 && action.id === 'instrument' && state.preferences.interests.includes('Playing musical instruments')) result += 3;
    if (state.scenario === 'Connection recharge' && action.id === 'friend' && state.preferences.interests.includes('Talking to a friend')) result += 8;
  }
  return result;
}
function matchesConstraint(action: Action, constraint?: string) {
  switch (constraint) {
    case 'Stay indoors': return action.indoor;
    case 'Something quieter': return action.domain === 'move' ? action.gentle : action.category === 'Quiet';
    case 'Something more active': return action.category === 'Energise' || action.category === 'Strength';
    case 'Go outside': return !action.indoor && ['Walk', 'Outdoors'].includes(action.category);
    case 'Stretch / mobility': return action.category === 'Mobility';
    case 'Wake me up': return action.category === 'Energise' && action.movement === 'Short active bursts';
    case 'Move a little stronger': return action.category === 'Strength';
    case 'Move to music': return action.movement === 'Moving to music';
    case 'Without music': return action.interest !== 'Music';
    case 'Clear my head': return action.category === 'Quiet' || action.interest === 'Going outside';
    case 'Do something I enjoy': return action.category !== 'Quiet';
    default: return true;
  }
}
export function resolveAction(state: State, action: Action): Action {
  if (action.id !== 'music-song') return action;
  const seconds = selectedTrack(state.spotify).durationSeconds;
  return { ...action, duration: seconds / 60, steps: action.steps.map(step => ({ ...step, seconds })) };
}
export function fitsSetting(action: Action, setting: ActivitySetting = 'any') {
  return setting === 'any' || action.portable || (setting === 'indoor' ? action.indoor : !action.indoor);
}
export function rechargeChoices(state: State, maximum: number): Action[] {
  return state.preferences.interests.flatMap(interest => {
    const choices = candidatesFor(state, 'recharge', maximum, undefined, interest);
    const best = choices.sort((a, b) => score(b, state) - score(a, state))[0];
    return best ? [best] : [];
  });
}
function candidatesFor(state: State, domain: Domain, maximum: number, exclude?: string, constraint?: string) {
  return actions.map(action => resolveAction(state, action)).filter(action => action.domain === domain && action.id !== 'music-minute' && !(action.id === 'music' && state.spotify.connected) && fitsSetting(action, state.context.setting) && (action.id !== 'music-song' || state.spotify.connected && state.preferences.interests.includes('Music')) && action.id !== exclude && action.duration <= maximum && !(domain === 'move' && state.context.lowSleep && !action.gentle) && matchesConstraint(action, constraint) && (!rechargeInterests.includes(constraint as Interest) || action.interest === constraint));
}
function constraintWeight(action: Action, constraint?: string) {
  if (constraint === 'Wake me up' && action.id === 'energy-burst') return 10;
  if (constraint === 'Move a little stronger' && action.id === 'sit-stand') return 10;
  if (constraint === 'Stretch / mobility' && action.id === 'mobility') return 10;
  if (constraint === 'Go outside' && action.id === 'outside-2') return 10;
  return 0;
}
export function recommend(state: State, domain: Domain, maximum: number, exclude?: string, constraint?: string): Action {
  let candidates = candidatesFor(state, domain, maximum, exclude, constraint);
  if (!candidates.length && exclude) candidates = candidatesFor(state, domain, maximum, undefined, constraint);
  // Personal interests guide enjoyable resets; an unavailable interest never creates a fake longer window.
  if (domain === 'recharge' && constraint !== 'Clear my head' && constraint !== 'Something quieter') {
    const preferred = candidates.filter(action => action.interest && state.preferences.interests.includes(action.interest));
    candidates = preferred.length ? preferred : candidates.filter(action => action.category === 'Quiet');
  }
  return candidates.sort((a, b) => score(b, state) + constraintWeight(b, constraint) - score(a, state) - constraintWeight(a, constraint))[0] ?? actions.find(a => a.id === (domain === 'move' ? state.context.setting === 'outdoor' ? 'outside-minute' : 'stand' : 'quiet'))!;
}
export type Decision = { action: Action | null; reason: string; reasons: string[] };
export function decide(state: State): Decision {
  const { context: c, preferences: p } = state;
  const quiet = (reason: string): Decision => ({ action: null, reason, reasons: [] });
  if (p.pausedUntil && p.pausedUntil > Date.now()) return quiet('Nudge is paused. Resume whenever you’re ready.');
  if (isQuiet(p, c.hour, c.minute)) return quiet('These are your quiet hours. We’ll leave this time clear.');
  if (state.snoozedUntil && state.snoozedUntil > Date.now()) return quiet('You asked for a little time. We’ll wait until your snooze ends.');
  if (c.inMeeting) {
    const recentMovement = state.responses.some(response => response.date === stateDate(state) && response.domain === 'move' && ['completed', 'already_done'].includes(response.outcome) && elapsed(response, state) < 45);
    return quiet(recentMovement ? 'You’re in a meeting, and you already took a movement break recently. We’ll wait for a better moment.' : 'You’re in a meeting with no open time. We’ll wait for a better moment.');
  }
  if (c.freeMinutes !== null && c.freeMinutes < 1) return quiet('Your next commitment is coming up. There’s no need to squeeze anything in.');
  const today = state.responses.filter(r => r.date === stateDate(state));
  const last = today.slice().reverse().find(r => ['completed', 'already_done', 'declined', 'ignored', 'abandoned', 'snoozed'].includes(r.outcome));
  if (last && elapsed(last, state) < 45) return quiet(['completed', 'already_done'].includes(last.outcome) ? 'You’ve already made some time for yourself. We’ll give your day room.' : 'This moment didn’t fit. We’ll leave it alone.');
  const pending = today.at(-1)?.outcome === 'fallback_requested' || today.at(-1)?.outcome === 'swapped';
  if (promptCount(today) >= { Light: 2, Balanced: 3, Active: 5 }[p.intensity] && !pending) return quiet('That’s enough suggestions for today. Your attention matters too.');
  const morningDeclines = today.filter(r => r.contextHour < 12 && ['declined', 'ignored'].includes(r.outcome));
  if (c.hour < 12 && morningDeclines.length >= 2) return quiet('Mornings haven’t been a good fit. We’re leaving this one clear.');
  const max = c.freeMinutes === null ? 5 : Math.max(1, c.freeMinutes - 1);
  const needsMove = (c.sittingMinutes ?? 0) >= 60 || ((c.steps ?? Infinity) < 3000 && (c.meetings ?? 0) >= 3);
  const needsRecharge = c.hour >= 18 || ['Tired', 'Stressed', 'Overwhelmed'].includes(state.mood ?? '');
  const domain = p.recharge && (c.hour >= 18 || ['Stressed', 'Overwhelmed'].includes(state.mood ?? '')) ? 'recharge' : p.move && needsMove ? 'move' : p.recharge && needsRecharge ? 'recharge' : null;
  if (!domain) return quiet(!p.move && !p.recharge ? 'Suggestions are turned off. You can change this in You.' : 'No suggestion needed right now. Choose a small action below whenever you want one.');
  const action = recommend(state, domain, domain === 'move' && learnedSmall(state) ? Math.min(max, 1.5) : max);
  const reasons = domain === 'move' ? [c.sittingMinutes !== null ? `${c.sittingMinutes} minutes sitting` : 'Movement has been light', c.lowSleep ? 'A short night, so we’re keeping it gentle' : 'A small movement break fits here'] : [action.interest && p.interests.includes(action.interest) ? `You chose ${action.interest.toLowerCase()} to recharge` : 'A little room to unwind'];
  if (c.freeMinutes !== null) reasons.push(c.nextEvent ? `${c.freeMinutes} minutes before your next commitment` : `${c.freeMinutes} minutes open`);
  if (domain === 'move' && learnedSmall(state)) reasons.push('You completed a smaller break, so we lowered the effort');
  return { action, reason: action.description, reasons };
}
function swapMaximum(state: State, domain: Domain, reason: string) {
  return reason === 'Only have 2 minutes' ? Math.min(2, state.context.freeMinutes === null ? 2 : Math.max(1, state.context.freeMinutes - 1)) : Math.min(domain === 'move' ? 5 : 15, state.context.freeMinutes === null ? 10 : Math.max(1, state.context.freeMinutes - 1));
}
export function canSwap(state: State, action: Action, reason: string) {
  return candidatesFor(state, action.domain, swapMaximum(state, action.domain, reason), action.id, reason === 'Something else' && action.interest === 'Music' ? 'Without music' : reason).length > 0;
}
export function swapAction(state: State, action: Action, reason: string): Action {
  const max = swapMaximum(state, action.domain, reason);
  return recommend(state, action.domain, max, action.id, reason === 'Something else' && action.interest === 'Music' ? 'Without music' : reason);
}
export function learningInsights(state: State) {
  const own = state.completions.filter(c => !c.demo);
  const small = own.filter(c => c.domain === 'move' && c.fromFallback);
  const moves = own.filter(c => c.domain === 'move');
  const resets = own.filter(c => c.domain === 'recharge');
  const indoor = state.responses.filter(r => r.outcome === 'swapped' && r.swapReason === 'Stay indoors').length;
  const favorite = [...new Set(resets.map(c => c.actionId))].map(id => {
    const completed = resets.filter(c => c.actionId === id);
    return { action: actions.find(a => a.id === id), count: completed.length, relevance: completed.length * 3 - completed.filter(c => didNotFit(c.feedback)).length * 6 };
  }).filter(item => item.relevance > 0).sort((a, b) => b.relevance - a.relevance)[0];
  const lastNotFit = resets.filter(c => didNotFit(c.feedback)).at(-1);
  const socialCompletions = state.responses.filter(response => response.outcome === 'completed' && response.social).length;
  return [
    { id: 'effort', title: small.length ? 'Smaller movement fits' : 'Finding your movement rhythm', detail: small.length ? `You completed ${small.length === 1 ? 'a smaller break' : `${small.length} smaller breaks`}. We’ll keep the next movement suggestion short.` : moves.length ? `${moves.length} movement ${moves.length === 1 ? 'break completed' : 'breaks completed'}. More choices will help us understand your timing.` : 'Try a small action. Your choices, rather than example history, shape the next suggestion.' },
    { id: 'recharge', title: favorite?.action ? `${favorite.action.interest} has a place in your day` : lastNotFit ? 'A different reset next time' : 'Recharge, in your own way', detail: favorite?.action ? `You completed ${favorite.count} ${favorite.action.category.toLowerCase()} ${favorite.count === 1 ? 'reset' : 'resets'}. We’ll give that activity more weight next time.` : lastNotFit ? 'You said that reset wasn’t a fit. We’ll give it less weight and try another activity.' : 'Music, company, creativity or quiet. We start with what you enjoy and learn from what you choose.' },
    ...(socialCompletions >= 2 ? [{ id: 'social', title: 'A little company in the moment', detail: `You completed ${socialCompletions} actions with a Circle cue. We’ll give relevant shared activities a little more weight.` }] : []),
    ...(indoor ? [{ id: 'setting', title: 'A little more room indoors', detail: `You chose an indoor alternative ${indoor === 1 ? 'once' : `${indoor} times`}. Indoor mobility will appear more often.` }] : []),
  ];
}
const legacyInterest: Record<string, Interest> = { Outdoors: 'Going outside', Outside: 'Going outside', Friends: 'Talking to a friend', Guitar: 'Playing musical instruments', Hobbies: 'Creative hobbies', 'Creative time': 'Creative hobbies', Mindfulness: 'Quiet / mindfulness', 'Movies & shows': 'Watching something', 'Going out': 'Going outside' };
const legacyGoal: Record<string, string> = { 'Feel more physically awake': 'Feel more energised', 'Make time for things I enjoy': 'Make time for what I enjoy' };
const legacyAction: Record<string, string> = { 'tiny-walk': 'outside-2', 'short-walk': 'walk-3', stretch: 'mobility-90', guitar: 'instrument', call: 'friend', creative: 'draw', hobby: 'draw', breathe: 'quiet', rest: 'quiet', outside: 'outdoor-recharge' };
const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const number = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
export function migrateState(value: unknown): State {
  if (!record(value) || ![1, 2].includes(Number(value.version)) || !record(value.preferences) || !record(value.context)) return initialState();
  const base = value.demoMode === false ? personalState() : initialState();
  const p = value.preferences;
  const preferences = { ...base.preferences };
  if (typeof p.name === 'string') preferences.name = p.name.slice(0, 24);
  if (Array.isArray(p.interests)) preferences.interests = [...new Set(p.interests.map(i => legacyInterest[String(i)] ?? String(i)).filter((i): i is Interest => rechargeInterests.includes(i as Interest)))];
  if (Array.isArray(p.movementPreferences)) preferences.movementPreferences = p.movementPreferences.filter((i): i is MovementInterest => movementInterests.includes(i as MovementInterest));
  if (Array.isArray(p.goals)) preferences.goals = [...new Set(p.goals.filter((g): g is string => typeof g === 'string').map(goal => legacyGoal[goal] ?? goal))];
  for (const key of ['move', 'recharge', 'calendar', 'movement', 'shareMove', 'shareRecharge'] as const) if (typeof p[key] === 'boolean') preferences[key] = p[key];
  if (['Light', 'Balanced', 'Active'].includes(String(p.intensity))) preferences.intensity = p.intensity as Preferences['intensity'];
  for (const key of ['quietStart', 'quietEnd'] as const) if (typeof p[key] === 'string' && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(p[key])) preferences[key] = p[key];
  if (number(p.pausedUntil)) preferences.pausedUntil = p.pausedUntil;
  const context = { ...base.context };
  if (['any', 'indoor', 'outdoor'].includes(String(value.context.setting))) context.setting = value.context.setting as ActivitySetting;
  if (!preferences.movement) Object.assign(context, { recentHeartRate: null, heartRateTimestamp: null, heartRateSource: null });
  if (value.context.recentHeartRate === null || number(value.context.recentHeartRate) && value.context.recentHeartRate > 0) context.recentHeartRate = value.context.recentHeartRate as number | null;
  if (value.context.heartRateTimestamp === null || typeof value.context.heartRateTimestamp === 'string' && Number.isFinite(Date.parse(value.context.heartRateTimestamp))) context.heartRateTimestamp = value.context.heartRateTimestamp as string | null;
  if (value.context.heartRateSource === null || typeof value.context.heartRateSource === 'string') context.heartRateSource = value.context.heartRateSource as string | null;
  for (const key of ['freeMinutes', 'sittingMinutes', 'sleepMinutes', 'steps', 'meetings'] as const) if (value.context[key] === null || number(value.context[key]) && Number(value.context[key]) >= 0) context[key] = value.context[key] as number | null;
  for (const key of ['hour', 'minute', 'sessionStarted'] as const) if (number(value.context[key])) context[key] = value.context[key];
  context.hour = Math.min(23, Math.max(0, Math.floor(context.hour)));
  context.minute = Math.min(59, Math.max(0, Math.floor(context.minute)));
  for (const key of ['inMeeting', 'lowSleep'] as const) if (typeof value.context[key] === 'boolean') context[key] = value.context[key];
  if (value.context.nextEvent === null || typeof value.context.nextEvent === 'string') context.nextEvent = value.context.nextEvent;
  const completions = Array.isArray(value.completions) ? value.completions.filter(c => record(c) && typeof c.id === 'string' && typeof c.title === 'string' && number(c.duration) && c.duration > 0 && ['move', 'recharge'].includes(String(c.domain))).map(c => ({ ...c, actionId: value.version === 1 ? legacyAction[c.actionId] ?? c.actionId : c.actionId, date: typeof c.date === 'string' ? c.date : c.demo ? '2026-10-02' : c.at ? localDate(new Date(c.at)) : localDate(), time: c.time || '', shared: c.shared === true })) as Completion[] : base.completions;
  const outcomes = ['accepted', 'fallback_requested', 'fallback_accepted', 'swapped', 'declined', 'ignored', 'already_done', 'completed', 'abandoned', 'snoozed'];
  const responses = Array.isArray(value.responses) ? value.responses.filter(r => record(r) && number(r.at) && number(r.duration) && ['move', 'recharge'].includes(String(r.domain))).map(r => ({ ...r, actionId: value.version === 1 ? legacyAction[r.actionId] ?? r.actionId : r.actionId, outcome: r.outcome === 'fallback' ? 'fallback_requested' : r.outcome === 'rejected' ? 'declined' : r.outcome, date: r.date || localDate(new Date(r.at)), contextHour: r.contextHour ?? context.hour, contextMinute: r.contextMinute ?? context.minute })).filter(r => outcomes.includes(r.outcome)) as Response[] : [];
  return { ...base, spotify: restoreSpotify(value.spotify, value.demoMode !== false), preferences, context, completions, responses, mood: value.mood === 'Okay' ? 'Fine' : ['Good', 'Fine', 'Tired', 'Stressed', 'Overwhelmed'].includes(String(value.mood)) ? value.mood as Mood : null, smallerMove: value.smallerMove === true, snoozedUntil: number(value.snoozedUntil) ? value.snoozedUntil : null, scenario: scenarios.includes(value.scenario as Scenario) ? value.scenario as Scenario : 'Packed afternoon' };
}
export function readModeState(demo: boolean): State {
  try {
    const saved = localStorage.getItem(demo ? 'mosaic-v2-demo' : 'mosaic-v2-personal');
    if (saved) {
      const parsed: unknown = JSON.parse(saved);
      if (!record(parsed) || ![1, 2].includes(Number(parsed.version)) || !record(parsed.preferences) || !record(parsed.context)) return demo ? initialState() : personalState();
      return migrateState({ ...parsed, demoMode: demo });
    }
    const legacy = localStorage.getItem('mosaic-v1');
    if (legacy) { const old = migrateState(JSON.parse(legacy)); if (old.demoMode === demo) return old; }
  } catch { /* Storage is optional. */ }
  return demo ? initialState() : personalState();
}
export function readState() { try { return readModeState(localStorage.getItem('mosaic-mode') !== 'personal'); } catch { return initialState(); } }
export function saveState(state: State) { try { localStorage.setItem(state.demoMode ? 'mosaic-v2-demo' : 'mosaic-v2-personal', JSON.stringify(state)); localStorage.setItem('mosaic-mode', state.demoMode ? 'demo' : 'personal'); } catch { /* Keep working in memory. */ } }
