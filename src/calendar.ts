export const CALENDAR_TODAY = '2026-10-02';
export const CALENDAR_NOW = 14 * 60 + 37;
export const CALENDAR_STORAGE_KEY = 'mosaic-calendar-v1';

export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  start: string;
  end: string;
  sample?: boolean;
};

export type FreeWindow = { minutes: number; end: number };
export type DayFreeWindow = { start: number; end: number; minutes: number };

export function timeToMinutes(value: string): number | null {
  if (!/^\d{2}:\d{2}$/.test(value)) return null;
  const [hour, minute] = value.split(':').map(Number);
  return hour <= 23 && minute <= 59 ? hour * 60 + minute : null;
}

export function dateFromKey(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (year < 100 || year > 9999) return null;
  const date = new Date(year, month - 1, day, 12);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
}

export function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function formatCalendarTime(value: string | number): string {
  const minutes = typeof value === 'number' ? value : timeToMinutes(value);
  if (minutes === null) return '';
  const hour = Math.floor(minutes / 60) % 24;
  return `${hour % 12 || 12}:${String(minutes % 60).padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
}

export function isCalendarEvent(value: unknown): value is CalendarEvent {
  if (!value || typeof value !== 'object') return false;
  const event = value as Partial<CalendarEvent>;
  if (typeof event.id !== 'string' || typeof event.title !== 'string' || !event.title.trim() || typeof event.date !== 'string' || !dateFromKey(event.date) || typeof event.start !== 'string' || typeof event.end !== 'string') return false;
  const start = timeToMinutes(event.start);
  const end = timeToMinutes(event.end);
  return start !== null && end !== null && end > start && (event.sample === undefined || typeof event.sample === 'boolean');
}

/** The actual free window beginning now; meeting boundaries are [start, end). */
export function currentFreeWindow(events: readonly CalendarEvent[], date: string, nowMinutes = CALENDAR_NOW, dayEnd = 24 * 60): FreeWindow | null {
  if (!dateFromKey(date) || !Number.isFinite(nowMinutes) || !Number.isFinite(dayEnd) || nowMinutes < 0 || nowMinutes >= dayEnd || dayEnd > 24 * 60) return null;
  let nextStart = dayEnd;
  for (const event of events) {
    if (event.date !== date || !isCalendarEvent(event)) continue;
    const start = timeToMinutes(event.start)!;
    const end = timeToMinutes(event.end)!;
    if (start <= nowMinutes && nowMinutes < end) return null;
    if (start > nowMinutes) nextStart = Math.min(nextStart, start);
  }
  return { minutes: nextStart - nowMinutes, end: nextStart };
}

export function sampleCalendarEvents(): CalendarEvent[] {
  return [
    { id: 'sample-oct2-class', title: 'Class', date: CALENDAR_TODAY, start: '09:00', end: '10:00', sample: true },
    { id: 'sample-oct2-work-morning', title: 'Work', date: CALENDAR_TODAY, start: '10:30', end: '12:30', sample: true },
    { id: 'sample-oct2-lunch', title: 'Lunch', date: CALENDAR_TODAY, start: '13:00', end: '14:00', sample: true },
    { id: 'sample-oct2-meeting', title: 'Meeting', date: CALENDAR_TODAY, start: '14:54', end: '16:00', sample: true },
    { id: 'sample-oct2-work-evening', title: 'Work', date: CALENDAR_TODAY, start: '17:00', end: '18:00', sample: true },
    { id: 'sample-oct2-evening', title: 'Evening plans', date: CALENDAR_TODAY, start: '18:36', end: '19:30', sample: true },
  ];
}

/** Open intervals in the visible day. Overlapping busy blocks occupy one interval. */
export function freeWindowsForDay(events: readonly CalendarEvent[], date: string, dayStart = 8 * 60, dayEnd = 21 * 60): DayFreeWindow[] {
  if (!dateFromKey(date) || !Number.isFinite(dayStart) || !Number.isFinite(dayEnd) || dayStart < 0 || dayEnd > 1440 || dayStart >= dayEnd) return [];
  const busy = events.filter(event => event.date === date && isCalendarEvent(event))
    .map(event => ({ start: Math.max(dayStart, timeToMinutes(event.start)!), end: Math.min(dayEnd, timeToMinutes(event.end)!) }))
    .filter(block => block.start < block.end)
    .sort((a, b) => a.start - b.start || a.end - b.end);
  const windows: DayFreeWindow[] = [];
  let cursor = dayStart;
  for (const block of busy) {
    if (block.start > cursor) windows.push({ start: cursor, end: block.start, minutes: block.start - cursor });
    cursor = Math.max(cursor, block.end);
  }
  if (cursor < dayEnd) windows.push({ start: cursor, end: dayEnd, minutes: dayEnd - cursor });
  return windows;
}

export function readCalendarEvents(): CalendarEvent[] {
  try {
    const stored = JSON.parse(localStorage.getItem(CALENDAR_STORAGE_KEY) || 'null');
    if (stored?.version === 1 && Array.isArray(stored.events)) {
      const events: CalendarEvent[] = stored.events.filter(isCalendarEvent);
      // Replace unchanged seeds from the earlier prototype while retaining personal edits.
      const legacy: Record<string, [string, string, string, string]> = {
        'sample-oct2-team': ['Team catch-up', CALENDAR_TODAY, '10:00', '10:30'],
        'sample-oct2-lunch': ['Lunch', CALENDAR_TODAY, '13:00', '14:00'],
        'sample-oct2-review': ['Design review', CALENDAR_TODAY, '15:30', '16:00'],
        'sample-oct3-coffee': ['Coffee with a friend', '2026-10-03', '11:00', '12:00'],
        'sample-oct5-team': ['Team catch-up', '2026-10-05', '10:00', '10:30'],
        'sample-oct5-project': ['Project time', '2026-10-05', '14:00', '15:00'],
        'sample-oct7-lunch': ['Lunch with a friend', '2026-10-07', '12:30', '13:30'],
      };
      const isUnchangedLegacy = (event: CalendarEvent) => {
        const original = legacy[event.id];
        return event.sample && original && original[0] === event.title && original[1] === event.date && original[2] === event.start && original[3] === event.end;
      };
      if (stored.sampleRevision !== 2 && events.some(event => event.id === 'sample-oct2-team' || event.id === 'sample-oct2-review')) {
        const retained = events.filter(event => !isUnchangedLegacy(event));
        const retainedIds = new Set(retained.map(event => event.id));
        const migrated = [...retained, ...sampleCalendarEvents().filter(event => !retainedIds.has(event.id))];
        writeCalendarEvents(migrated);
        return migrated;
      }
      return events;
    }
  } catch { /* Continue with a usable local calendar if storage is unavailable. */ }
  return sampleCalendarEvents();
}

export function writeCalendarEvents(events: CalendarEvent[]): boolean {
  try {
    localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify({ version: 1, sampleRevision: 2, events }));
    return true;
  } catch {
    return false;
  }
}

export function visibleCalendarEvents(events: readonly CalendarEvent[], enabled: boolean): CalendarEvent[] {
  return events.filter(event => enabled || !event.sample);
}
