import { readCalendarEvents } from './calendar';
import type { CalendarEvent } from './calendar';
import { stateDate } from './engine';
import type { State } from './engine';

const hhmm = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
export function scheduleFor(state: State): { events: CalendarEvent[]; sample: boolean } {
  const date = stateDate(state);
  const personal = readCalendarEvents().filter(event => !event.sample && event.date === date);
  if (!state.demoMode && personal.length) return { events: personal, sample: false };
  if (!state.preferences.calendar) return { events: [], sample: false };
  const sample = (title: string, start: string, end: string, id: string): CalendarEvent => ({ id, title, start, end, date, sample: true });
  if (!state.demoMode) {
    const now = state.context.hour * 60 + state.context.minute;
    const next = now + (state.context.freeMinutes ?? 15);
    return { sample: true, events: next + 30 < 1440 ? [sample('Sample commitment', hhmm(next), hhmm(next + 30), 'sample-next')] : [] };
  }
  return { sample: true, events: [
    sample('Morning focus', '08:30', '09:15', 'sample-morning-focus'),
    sample('Team catch-up', '09:30', '10:00', 'sample-catchup'),
    sample('Class / project meeting', '11:00', '11:45', 'sample-class'),
    sample('Lunch away from the desk', '12:15', '13:00', 'sample-lunch'),
    sample('Project review', '13:30', '14:30', 'sample-review'),
    sample('Planning meeting', '15:00', '16:10', 'sample-planning'),
    sample('Focus time', state.scenario === 'Quick movement opportunity' ? '16:23' : '16:34', '17:00', 'sample-focus'),
    sample('Day wrap-up', '17:35', '18:10', 'sample-wrap'),
    sample('Errands', '18:30', '19:00', 'sample-errands'),
    sample('Dinner', state.scenario === 'Evening music recharge' ? '19:32' : '19:40', '20:00', 'sample-dinner'),
    sample('Personal project', '20:25', '20:45', 'sample-personal-project'),
    sample('Wind down', '21:40', '22:00', 'sample-wind-down'),
  ] };
}

