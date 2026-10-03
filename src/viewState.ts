import { actions, decide, getFallback, resolveAction, stateDate } from './engine';
import type { Action, Mood, State } from './engine';

export type Page = 'Today' | 'Rhythm' | 'You';
export type Offer = { action: Action; fallback: boolean; note?: string; availableLabel?: string; availableMax?: number; checkIn?: Mood };
type ViewState = { page: Page; offer: Offer | null; completionId: string | null };
const empty = (): ViewState => ({ page: 'Today', offer: null, completionId: null });
const key = (state: State) => `mosaic-view-v1-${state.demoMode ? 'demo' : 'personal'}`;

export function readView(state: State): ViewState {
  try {
    const raw = localStorage.getItem(key(state));
    if (raw) {
      const saved = JSON.parse(raw);
      if (saved?.date !== stateDate(state) || saved?.sessionStarted !== state.context.sessionStarted) return empty();
      const known = actions.find(action => action.id === saved.offer?.actionId);
      const action = known ? resolveAction(state, known) : undefined;
      const max = saved.offer?.availableMax;
      const offer: Offer | null = action && typeof saved.offer?.fallback === 'boolean' ? {
        action, fallback: saved.offer.fallback,
        checkIn: ['Good', 'Fine', 'Tired', 'Stressed', 'Overwhelmed'].includes(saved.offer.checkIn) ? saved.offer.checkIn : undefined,
        note: typeof saved.offer.note === 'string' ? saved.offer.note : undefined,
        availableMax: [2, 5, 15].includes(max) || saved.offer.checkIn && typeof max === 'number' && max >= 1 && max <= 2 ? max : undefined,
        availableLabel: [2, 5, 15].includes(max) ? ({ 2: '1–2 minutes', 5: '5 minutes', 15: '10+ minutes' } as Record<number, string>)[max] : undefined,
      } : null;
      return {
        page: ['Today', 'Rhythm', 'You'].includes(saved.page) ? saved.page : 'Today',
        offer,
        completionId: state.completions.some(item => item.id === saved.completionId && !item.demo) ? saved.completionId : null,
      };
    }
    // Preserve a choice made in the build before view persistence was added.
    const response = state.responses.at(-1);
    const decision = decide(state);
    if (response && response.at >= state.context.sessionStarted && decision.action) {
      const original = actions.find(action => action.id === response.actionId);
      const action = response.outcome === 'fallback_requested' && original ? getFallback(original) : response.outcome === 'swapped' ? original : null;
      if (action?.domain === decision.action.domain) return { ...empty(), offer: { action, fallback: response.outcome === 'fallback_requested', note: response.swapReason } };
    }
  } catch { /* An unavailable or old view never blocks the app. */ }
  return empty();
}

export function saveView(state: State, view: ViewState) {
  try {
    const offer = view.offer ? { ...view.offer, actionId: view.offer.action.id, action: undefined } : null;
    localStorage.setItem(key(state), JSON.stringify({ ...view, offer, date: stateDate(state), sessionStarted: state.context.sessionStarted }));
  } catch { /* The current interaction can continue in memory. */ }
}
