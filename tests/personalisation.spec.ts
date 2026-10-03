import { expect, test } from '@playwright/test';
import { decide, initialState, migrateState, rechargeChoices, recommend, scenarioState } from '../src/engine';
import { currentFreeWindow } from '../src/calendar';
import { scheduleFor } from '../src/schedule';

test('Recharge respects selected interests, full songs and available time', () => {
  const state = scenarioState(initialState(), 'Evening recharge');
  for (const [interest, id, max] of [['Playing musical instruments', 'instrument', 12], ['Watching something', 'show', 20], ['Reading', 'read', 12], ['Gaming', 'game', 12]] as const) {
    const personal = { ...state, preferences: { ...state.preferences, interests: [interest] } };
    expect(recommend(personal, 'recharge', max).id).toBe(id);
    expect(rechargeChoices(personal, 2)).toEqual([]);
    expect(recommend(personal, 'recharge', 2).category).toBe('Quiet');
  }
  const music = { ...state, preferences: { ...state.preferences, interests: ['Music' as const] } };
  expect(rechargeChoices(music, 2)).toEqual([]);
  expect(recommend(music, 'recharge', 5).duration * 60).toBe(273);
  expect(recommend(music, 'recharge', 2).interest).not.toBe('Music');
  const watching = { ...state, context: { ...state.context, freeMinutes: 100 }, preferences: { ...state.preferences, interests: ['Watching something' as const] } };
  expect(decide(watching).action?.id).toBe('movie');
});

test('environment filters actions and survives storage and scenario changes', () => {
  const state = initialState();
  const outdoors = { ...state, context: { ...state.context, setting: 'outdoor' as const } };
  expect(decide(outdoors).action?.indoor).toBe(false);
  expect(rechargeChoices(outdoors, 15).some(a => a.id === 'instrument')).toBe(false);
  expect(rechargeChoices(outdoors, 15).some(a => a.interest === 'Music')).toBe(true);
  expect(migrateState(outdoors).context.setting).toBe('outdoor');
  expect(scenarioState(outdoors, 'Evening recharge').context.setting).toBe('outdoor');
  const indoors = { ...state, context: { ...state.context, setting: 'indoor' as const } };
  expect(rechargeChoices(indoors, 15).some(a => a.interest === 'Going outside')).toBe(false);
});

test('the richer sample calendar backs the afternoon and evening opportunities', () => {
  for (const [scenario, minutes] of [['Packed afternoon', 14], ['Later busy afternoon', 14], ['Quick movement opportunity', 3], ['Evening recharge', 30], ['Evening music recharge', 22], ['Connection recharge', 15]] as const) {
    const state = scenarioState(initialState(), scenario);
    const events = scheduleFor(state).events;
    expect(events.length).toBeGreaterThanOrEqual(10);
    expect(currentFreeWindow(events, '2026-10-03', state.context.hour * 60 + state.context.minute)?.minutes).toBe(minutes);
  }
});

test('Today exposes calendar openings, personal choices and a responsive setting control', async ({ page }) => {
  await page.goto('/?intro=1');
  await page.getByRole('button', { name: 'Try sample day', exact: true }).click();
  await expect(page.locator('.day-preview-rows')).toContainText('Planning meeting');
  await expect(page.locator('.day-preview-rows')).toContainText('24 minutes open');
  await expect(page.locator('.recharge-picks')).toContainText('Playing musical instruments');
  await expect(page.locator('.recharge-picks')).not.toContainText('Watching something');
  await page.getByRole('button', { name: /Indoors or outdoors\?/ }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Outdoors', exact: true }).click();
  await expect(page.locator('.recommendation h2')).toContainText('outside');
  await expect(page.locator('.recharge-picks')).not.toContainText('Playing musical instruments');
  await expect(page.locator('.setting-entry')).toContainText('Outdoors');
  await page.getByRole('button', { name: /Indoors or outdoors\?/ }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Indoors', exact: true }).click();
  await page.locator('.recharge-picks').getByRole('button', { name: /Playing musical instruments/ }).click();
  await expect(page.getByRole('heading', { name: '10 minutes with an instrument?', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: '10 minutes with an instrument?', exact: true })).toBeVisible();
});

test('watching preferences produce an episode or a full movie according to the chosen window', async ({ page }) => {
  await page.goto('/?intro=1');
  await page.getByRole('button', { name: 'Try sample day', exact: true }).click();
  await page.getByRole('button', { name: 'Demo: preview a moment' }).click();
  await page.getByRole('dialog').getByRole('button', { name: /^Evening recharge/ }).click();
  await expect(page.locator('.recharge-picks')).toContainText('Watching something');
  await page.locator('.recharge-picks').getByRole('button', { name: /Watching something/ }).click();
  await expect(page.getByRole('heading', { name: 'Watch something you enjoy?', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Edit interests', exact: true }).click();
  for (const interest of ['Music', 'Going outside', 'Talking to a friend', 'Playing musical instruments']) await page.getByRole('dialog').getByRole('button', { name: interest, exact: true }).click();
  await page.getByRole('button', { name: 'Save preferences', exact: true }).click();
  await page.getByRole('button', { name: /I need something now/ }).click();
  await page.getByRole('button', { name: 'Do something I enjoy', exact: true }).click();
  await page.getByRole('button', { name: '90 minutes', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Make room for a movie?', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Make room for a movie?', exact: true })).toBeVisible();
  await expect(page.locator('.opportunity')).toContainText('90 MINUTES YOU CHOSE');
});
