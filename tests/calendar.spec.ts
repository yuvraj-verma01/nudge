import { expect, test } from '@playwright/test';
import { CALENDAR_NOW, CALENDAR_TODAY, currentFreeWindow, dateFromKey, dateKey, freeWindowsForDay, sampleCalendarEvents, timeToMinutes, visibleCalendarEvents } from '../src/calendar';
import type { CalendarEvent } from '../src/calendar';

const event = (start: string, end: string, date = CALENDAR_TODAY): CalendarEvent => ({ id: `${date}-${start}`, title: 'A plan', date, start, end });

test('sample opportunities match the afternoon and evening scenarios', () => {
  const schedule = sampleCalendarEvents();
  expect(CALENDAR_NOW).toBe(877);
  expect(currentFreeWindow(schedule, CALENDAR_TODAY)).toEqual({ minutes: 17, end: 894 });
  expect(currentFreeWindow(schedule, CALENDAR_TODAY, 15 * 60 + 5)).toBeNull();
  expect(currentFreeWindow(schedule, CALENDAR_TODAY, 18 * 60 + 12)).toEqual({ minutes: 24, end: 1116 });
  expect(currentFreeWindow([event('14:45', '16:00')], CALENDAR_TODAY)).toEqual({ minutes: 8, end: 885 });
});

test('events that overlap now never offer a break, regardless of ordering', () => {
  const events = [event('14:54', '16:00'), event('14:30', '14:50'), event('14:35', '15:40')];
  expect(currentFreeWindow(events, CALENDAR_TODAY)).toBeNull();
  expect(currentFreeWindow([...events].reverse(), CALENDAR_TODAY)).toBeNull();
});

test('a busy block starts busy and frees up exactly at its end', () => {
  const events = [event('14:37', '15:30'), event('16:00', '17:00')];
  expect(currentFreeWindow(events, CALENDAR_TODAY, 877)).toBeNull();
  expect(currentFreeWindow(events, CALENDAR_TODAY, 930)).toEqual({ minutes: 30, end: 960 });
  expect(currentFreeWindow(events, CALENDAR_TODAY, 1440)).toBeNull();
});

test('the gap ignores other dates and malformed events and respects the day boundary', () => {
  const events = [event('14:40', '16:00', '2026-10-03'), event('invalid', '16:00'), event('15:00', '14:00')];
  expect(currentFreeWindow(events, CALENDAR_TODAY)).toEqual({ minutes: 563, end: 1440 });
  expect(currentFreeWindow(events, CALENDAR_TODAY, 877, 1080)).toEqual({ minutes: 203, end: 1080 });
  expect(currentFreeWindow(events, CALENDAR_TODAY, -1)).toBeNull();
  expect(currentFreeWindow(events, CALENDAR_TODAY, NaN)).toBeNull();
  expect(currentFreeWindow(events, CALENDAR_TODAY, 877, 1500)).toBeNull();
});

test('the timeline merges overlapping and adjacent occupancy before finding gaps', () => {
  const events = [event('10:00', '11:00'), event('09:00', '10:00'), event('10:45', '12:00'), event('13:00', '14:00')];
  const expected = [{ start: 480, end: 540, minutes: 60 }, { start: 720, end: 780, minutes: 60 }, { start: 840, end: 900, minutes: 60 }];
  expect(freeWindowsForDay(events, CALENDAR_TODAY, 480, 900)).toEqual(expected);
  expect(freeWindowsForDay([...events].reverse(), CALENDAR_TODAY, 480, 900)).toEqual(expected);
  expect(freeWindowsForDay([event('07:00', '08:30'), event('14:30', '16:00')], CALENDAR_TODAY, 480, 900)).toEqual([{ start: 510, end: 870, minutes: 360 }]);
});

test('turning off samples preserves personal busy times', () => {
  const personal = event('14:35', '14:50');
  const events = [...sampleCalendarEvents(), personal];
  expect(visibleCalendarEvents(events, false)).toEqual([personal]);
  expect(currentFreeWindow(visibleCalendarEvents(events, false), CALENDAR_TODAY)).toBeNull();
});

test('date and time helpers reject impossible entries and preserve local dates', () => {
  expect(timeToMinutes('23:59')).toBe(1439);
  expect(timeToMinutes('24:00')).toBeNull();
  expect(timeToMinutes('15:60')).toBeNull();
  expect(dateFromKey('2026-02-30')).toBeNull();
  expect(dateFromKey('2024-02-29')).not.toBeNull();
  expect(dateKey(dateFromKey(CALENDAR_TODAY)!)).toBe(CALENDAR_TODAY);
  expect(freeWindowsForDay([], '2026-02-30')).toEqual([]);
  expect(freeWindowsForDay([], CALENDAR_TODAY, 900, 800)).toEqual([]);
});
