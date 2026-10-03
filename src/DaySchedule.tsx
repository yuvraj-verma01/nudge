import { CalendarDays, ChevronRight, Clock3, Leaf } from 'lucide-react';
import { formatCalendarTime, freeWindowsForDay, timeToMinutes } from './calendar';
import { stateDate } from './engine';
import type { State } from './engine';
import './day-schedule.css';
import { scheduleFor } from './schedule';
export { scheduleFor } from './schedule';

export function DayPeek({ state, onOpen }: { state: State; onOpen: () => void }) {
  const { events, sample } = scheduleFor(state);
  const now = state.context.hour * 60 + state.context.minute;
  const next = events.filter(event => timeToMinutes(event.end)! > now).sort((a, b) => timeToMinutes(a.start)! - timeToMinutes(b.start)!)[0];
  const windows = freeWindowsForDay(events, stateDate(state), now, 22 * 60);
  const preview = [
    ...events.filter(event => timeToMinutes(event.end)! > now).map(event => ({ id: event.id, start: timeToMinutes(event.start)!, end: timeToMinutes(event.end)!, title: event.title, opening: false })),
    ...windows.filter(window => window.minutes >= 2).map(window => ({ id: `open-${window.start}`, ...window, title: `${window.minutes} minutes open${window.start === now ? ' now' : ''}`, opening: true })),
  ].sort((a, b) => a.start - b.start).slice(0, 4);
  return <section className="day-preview" aria-label="Calendar context"><button className="day-peek" onClick={onOpen} aria-label="See your calendar and nudge opportunities"><CalendarDays size={20} aria-hidden="true" /><span><strong>Your day & openings</strong><small>{state.context.inMeeting ? `${next?.title ?? 'Busy now'} · Nudge waits` : state.context.freeMinutes !== null ? `${state.context.freeMinutes} minutes open now${next ? ` · ${next.title} at ${formatCalendarTime(next.start)}` : ''}` : 'See how your calendar helps Nudge find a moment'}</small><em>{sample ? 'Sample calendar' : events.length ? 'Saved busy times' : 'Calendar optional'}</em></span><ChevronRight size={18} aria-hidden="true" /></button>{events.length > 0 && <ol className="day-preview-rows">{preview.map(row => <li key={row.id} className={row.opening ? 'preview-opening' : ''}><span>{formatCalendarTime(row.start)}</span><div><strong>{row.title}</strong><small>{row.opening ? row.start === now ? 'Room for your next small action' : 'Possible nudge · not an appointment' : 'Busy time · your commitments come first'}</small></div></li>)}</ol>}</section>;
}

export function DaySchedule({ state, onConnections }: { state: State; onConnections: () => void }) {
  const { events, sample } = scheduleFor(state);
  const now = state.context.hour * 60 + state.context.minute;
  const gap = state.context.freeMinutes;
  const rows: { id: string; start: number; end: number; title: string; copy: string; opportunity: boolean; current?: boolean }[] = events.map(event => ({ id: event.id, start: timeToMinutes(event.start)!, end: timeToMinutes(event.end)!, title: event.title, opportunity: false, current: timeToMinutes(event.start)! <= now && timeToMinutes(event.end)! > now, copy: timeToMinutes(event.end)! <= now ? 'Earlier today' : 'Busy time · Nudge stays quiet' }));
  if (!state.context.inMeeting && gap !== null && gap >= 2) rows.push({ id: 'now', start: now, end: Math.min(now + gap, 1440), title: `${gap} minutes open now`, copy: state.mood === 'Overwhelmed' || state.mood === 'Stressed' ? 'Room for a short Recharge reset' : 'Room for one small Move or Recharge action', opportunity: true, current: true });
  for (const window of freeWindowsForDay(events, stateDate(state), now, 21 * 60)) {
    // An opening is a possibility, not a scheduled or promised intervention.
    if (window.start <= now || window.minutes < 2 || !events.some(event => timeToMinutes(event.start) === window.end)) continue;
    rows.push({ id: `gap-${window.start}`, start: window.start, end: window.end, title: `${window.minutes}-minute opening`, copy: 'Possible nudge · only if it fits how you feel then', opportunity: true });
  }
  rows.sort((a, b) => a.start - b.start);
  const timeline = (items: typeof rows) => <ol className="schedule-timeline">{items.map(row => <li key={row.id} className={`${row.opportunity ? 'schedule-opening' : 'schedule-busy'} ${row.current ? 'schedule-current' : ''}`}><span className="schedule-marker">{row.opportunity ? <Leaf size={16} aria-hidden="true" /> : <CalendarDays size={16} aria-hidden="true" />}</span><div><p className="schedule-time">{row.current && <strong>NOW · </strong>}{formatCalendarTime(row.start)}–{formatCalendarTime(row.end)}</p><h3>{row.title}</h3><p>{row.copy}</p></div></li>)}</ol>;
  const earlier = rows.filter(row => row.end <= now);
  const upcoming = rows.filter(row => row.end > now);
  return <><p className="sheet-description">Your commitments come first. Nudge looks for space between them, then checks what you need.</p><p className="schedule-source">{sample ? 'Sample calendar · simulated commitments' : events.length ? 'Your saved busy times · no live calendar connection' : 'No calendar connected'}</p>{rows.length ? <>{timeline(upcoming)}{earlier.length > 0 && <details className="schedule-earlier"><summary>Earlier today · {earlier.length} commitments</summary>{timeline(earlier)}</details>}</> : <div className="schedule-empty"><Clock3 size={24} /><h3>Your day, on your terms.</h3><p>Without a calendar, Nudge won’t guess when you’re free. Use “I need something now” to choose the time you have.</p><button className="secondary" onClick={onConnections}>See calendar options</button></div>}<p className="source-note">Openings aren’t appointments. Pauses, quiet hours and your recent choices still decide whether Nudge suggests anything.</p></>;
}
