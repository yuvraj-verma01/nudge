import { expect, test } from '@playwright/test';

test('each open and refresh clears the previous evaluator and starts empty onboarding', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('mosaic-onboarded-v3', 'true');
    localStorage.setItem('mosaic-v2-personal', JSON.stringify({ preferences: { name: 'Previous evaluator', interests: ['Gaming'] } }));
    localStorage.setItem('mosaic-setup-v3', JSON.stringify({ step: 2, name: 'Previous evaluator', interests: ['Gaming'] }));
    localStorage.setItem('mosaic-calendar-v1', JSON.stringify({ version: 1, events: [{ title: 'Previous evaluator event' }] }));
    localStorage.setItem('mosaic-active-v2', JSON.stringify({ previous: true }));
    localStorage.setItem('unrelated-app', 'keep me');
    sessionStorage.setItem('nudge-entered-session-v1', 'true');
  });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Set up Nudge', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close introduction', exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('mosaic-calendar-v1'))).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem('unrelated-app'))).toBe('keep me');
  await page.getByRole('button', { name: 'Set up Nudge', exact: true }).click();
  await expect(page.getByLabel(/Your first name/)).toHaveValue('');
  await page.getByLabel(/Your first name/).fill('New evaluator');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Gaming', exact: true })).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: 'Reading', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Set up Nudge', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Set up Nudge', exact: true }).click();
  await expect(page.getByLabel(/Your first name/)).toHaveValue('');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Reading', exact: true })).toHaveAttribute('aria-pressed', 'false');
});

test('choices and learning still work during an uninterrupted sample walkthrough', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Try sample day', exact: true }).click();
  await page.getByRole('button', { name: 'Make it easier', exact: true }).click();
  await page.getByRole('button', { name: 'I can do that', exact: true }).click();
  await page.getByRole('button', { name: /^Complete demo action/ }).click();
  await page.getByRole('button', { name: 'Better', exact: true }).click();
  await page.getByRole('button', { name: 'Keep private & back to my day', exact: true }).click();
  await page.getByRole('navigation').getByRole('button', { name: 'Rhythm', exact: true }).click();
  await expect(page.locator('.weekly-reflection')).toContainText('10 moments');
  await page.reload();
  await expect(page.getByRole('button', { name: 'Set up Nudge', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Try sample day', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Move for 2?', exact: true })).toBeVisible();
  await page.getByRole('navigation').getByRole('button', { name: 'Rhythm', exact: true }).click();
  await expect(page.locator('.weekly-reflection')).toContainText('9 moments');
});
