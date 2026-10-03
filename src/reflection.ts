import { actions, learningInsights, stateDate } from './engine';
import type { Completion, State } from './engine';
export interface WeeklyReflection { totalMoments: number; totalMinutes: number; moveMoments: number; moveMinutes: number; rechargeMoments: number; rechargeMinutes: number; activityBreakdown: Record<string, number>; learningInsights: ReturnType<typeof learningInsights>; exampleMoments: number; newMoments: number; musicMinutes: number }
export function completedSeconds(completion: Completion) { return typeof completion.elapsedSeconds === 'number' && Number.isFinite(completion.elapsedSeconds) ? Math.min(completion.duration * 60, Math.max(0, completion.elapsedSeconds)) : completion.duration * 60; }
export function reflectionTime(minutes: number) { const seconds = Math.round(minutes * 60); if (seconds < 60) return `${seconds} sec`; const whole = Math.floor(seconds / 60); return seconds % 60 ? `${whole} min ${seconds % 60} sec` : `${whole} min`; }
function category(completion: Completion) {
  const action = actions.find(action => action.id === completion.actionId);
  if (action?.interest === 'Music') return 'Music';
  if (action?.interest === 'Talking to a friend') return 'Talking to a friend';
  if (action?.interest === 'Quiet / mindfulness') return 'Quiet break';
  if (action?.category === 'Mobility') return 'Mobility';
  if (action && ['Walk', 'Outdoors'].includes(action.category)) return 'Outdoors';
  if (completion.domain === 'move') return 'Active movement';
  return action?.interest ?? 'Recharge';
}
export function weeklyReflection(state: State): WeeklyReflection {
  const monday = new Date(`${stateDate(state)}T12:00:00`); monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7);
  const key = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const end = new Date(monday); end.setDate(end.getDate() + 6);
  const week = state.completions.filter(item => item.date >= key(monday) && item.date <= key(end));
  const moves = week.filter(item => item.domain === 'move');
  const resets = week.filter(item => item.domain === 'recharge');
  const minutes = (items: Completion[]) => items.reduce((total, item) => total + completedSeconds(item), 0) / 60;
  const activityBreakdown: Record<string, number> = {};
  for (const item of week) { const label = category(item); activityBreakdown[label] = (activityBreakdown[label] ?? 0) + 1; }
  return { totalMoments: week.length, totalMinutes: minutes(week), moveMoments: moves.length, moveMinutes: minutes(moves), rechargeMoments: resets.length, rechargeMinutes: minutes(resets), activityBreakdown, learningInsights: learningInsights(state), exampleMoments: week.filter(item => item.demo).length, newMoments: week.filter(item => !item.demo).length, musicMinutes: minutes(week.filter(item => category(item) === 'Music')) };
}
