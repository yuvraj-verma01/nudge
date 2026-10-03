import { expect, test } from '@playwright/test';
import { actions, decide, initialState, migrateState, personalState, recommend, scenarioState, swapAction } from '../src/engine';
import { musicFor, restoreSpotify } from '../src/spotify';
import { weeklyReflection } from '../src/reflection';

test('the sample reflection derives nine example moments and 47 minutes without fabricating learning', () => {
  const reflection = weeklyReflection(initialState());
  expect(reflection).toMatchObject({ totalMoments: 9, totalMinutes: 47, moveMoments: 5, moveMinutes: 22, rechargeMoments: 4, rechargeMinutes: 25, exampleMoments: 9, newMoments: 0 });
  expect(reflection.activityBreakdown).toEqual({ Mobility: 2, Music: 2, Outdoors: 2, 'Talking to a friend': 1, 'Active movement': 1, 'Quiet break': 1 });
  expect(reflection.learningInsights.some(item => item.detail.includes('You completed'))).toBe(false);
});

test('short and early actions count as moments while reflection counts only the actual recorded time', () => {
  const state = personalState();
  const date = new Date().toLocaleDateString('en-CA');
  state.completions = [0, 1, 2].map(index => ({ id: `short-${index}`, actionId: 'mobility-90', title: 'Short break', domain: 'move', duration: 1.5, elapsedSeconds: 90, date, time: '' }));
  expect(weeklyReflection(state)).toMatchObject({ totalMoments: 3, totalMinutes: 4.5 });
  state.completions.push({ id: 'early', title: 'Music break', actionId: 'music', domain: 'recharge', duration: 4, elapsedSeconds: 30, date, time: '' });
  expect(weeklyReflection(state)).toMatchObject({ totalMoments: 4, totalMinutes: 5, rechargeMinutes: .5 });
});

test('heart rate is recent context and never changes a decision or invents a personal reading', () => {
  const state = initialState();
  expect(decide({ ...state, context: { ...state.context, recentHeartRate: 150 } })).toEqual(decide(state));
  expect(personalState().context.recentHeartRate).toBeNull();
  const old = personalState();
  const restored = migrateState({ ...old, spotify: undefined, context: { ...old.context, recentHeartRate: undefined } });
  expect(restored.context.recentHeartRate).toBeNull();
  expect(restored.spotify.connected).toBe(false);
});

test('a Spotify song fits its window, requires the optional connection, and offers a different activity on swap', () => {
  const state = scenarioState(initialState(), 'Evening music recharge');
  const song = decide(state).action!;
  expect(song.id).toBe('music-song');
  expect(song.duration * 60).toBe(273);
  expect(musicFor(state, song)?.title).toBe('Welcome To The Jungle');
  expect(swapAction(state, song, 'Something else').interest).not.toBe('Music');
  expect(recommend(state, 'recharge', 2).id).not.toBe('music-song');
  const disconnected = { ...state, spotify: { ...state.spotify, connected: false } };
  expect(decide(disconnected).action?.id).not.toBe('music-song');
  expect(musicFor(disconnected, actions.find(action => action.id === 'music'))).toBeUndefined();
  expect(restoreSpotify({ connected: true, demoMode: false }, false).demoMode).toBe(true);
});

test('music completion and feedback change relevance across listening actions and repeated swaps lower priority', () => {
  const state = scenarioState(initialState(), 'Evening recharge');
  const completion = { id: 'song', actionId: 'music-song', title: 'Music', duration: 273 / 60, domain: 'recharge' as const, date: '2026-10-03', time: '7:10 PM' };
  const helped = { ...state, completions: [...state.completions, { ...completion, feedback: 'Helped' }] };
  expect(recommend(helped, 'recharge', 20).interest).toBe('Music');
  const disliked = { ...helped, completions: [...state.completions, { ...completion, feedback: 'Not for me' }] };
  expect(recommend(disliked, 'recharge', 20).interest).not.toBe('Music');
  const music = scenarioState(initialState(), 'Evening music recharge');
  music.responses = [0, 1, 2].map(index => ({ actionId: 'instrument', swappedFrom: 'music-song', outcome: 'swapped', duration: 10, domain: 'recharge', at: index, date: '2026-10-03', contextHour: 19, contextMinute: 10 }));
  expect(recommend(music, 'recharge', 20).id).not.toBe('music-song');
});
