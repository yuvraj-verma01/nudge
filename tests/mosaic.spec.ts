import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
async function openDemo(page: Page) { await page.goto('/?intro=1'); await page.getByRole('button', { name: 'Try sample day', exact: true }).click(); }
async function goTo(page: Page, name: string) { await page.getByRole('navigation').getByRole('button', { name, exact: true }).click(); }
async function preview(page: Page, name: string) { await page.getByRole('button', { name: 'Demo: preview a moment' }).click(); await page.getByRole('dialog').getByRole('button', { name: new RegExp(`^${name}`) }).click(); }
async function stored(page: Page, key = 'mosaic-v2-demo') { return page.evaluate(key => JSON.parse(localStorage.getItem(key)!), key); }

test('sample entry immediately communicates body, mind, context and one action', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Care for your body.*Make room for your mind/ })).toBeVisible();
  await page.getByRole('button', { name: 'Try sample day' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Move for 2?', exact: true })).toBeVisible();
  await expect(page.getByText('5h 42m', { exact: true })).toBeVisible();
  await expect(page.getByText('2,180', { exact: true })).toBeVisible();
  await expect(page.getByText('86 min', { exact: true })).toBeVisible();
  await expect(page.getByText('Sample context', { exact: true })).toBeVisible();
  await expect(page.getByRole('navigation').getByRole('button')).toHaveCount(3);
  await expect(page.getByRole('heading', { name: 'Nudge noticed', exact: true })).toBeVisible();
  await expect(page.locator('.recommendation-copy')).toContainText('So right now:');
  await expect.poll(async () => {
    const navigationTop = await page.getByRole('navigation').evaluate(element => element.getBoundingClientRect().top);
    return page.locator('.action-social, .recommendation .primary, .adapt-options').evaluateAll((elements, top) => elements.every(element => element.getBoundingClientRect().bottom <= top), navigationTop);
  }).toBe(true);
  await expect(page.locator('.action-social')).toContainText('Jay did this 2-minute reset. Maya moved too.');
  await page.getByText('Why this fits', { exact: true }).click();
  await expect(page.getByText('86 minutes sitting', { exact: true })).toBeVisible();
  await expect(page.getByText('14 minutes before your next commitment', { exact: true })).toBeVisible();
});

test('the two-minute presentation shows context, social support and an actually changed later recommendation', async ({ page }) => {
  await openDemo(page);
  await expect(page.getByRole('heading', { name: 'Move for 2?', exact: true })).toBeVisible();
  await expect(page.locator('.action-social')).toContainText('Join them with this one?');
  await page.getByRole('button', { name: 'Make it easier', exact: true }).click();
  await page.getByRole('button', { name: 'I can do that', exact: true }).click();
  await page.getByRole('button', { name: /^Complete demo action/ }).click();
  await expect(page.getByText('DEMO ACTION COMPLETED', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: '90 seconds of movement.', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Better', exact: true }).click();
  await page.getByRole('button', { name: 'Keep private & back to my day', exact: true }).click();
  const completion = (await stored(page)).completions.at(-1);
  expect(completion.simulated).toBe(true);
  expect(completion.elapsedSeconds).toBe(90);
  expect(completion.demo).not.toBe(true);
  await preview(page, 'Later busy afternoon');
  await expect(page.getByRole('heading', { name: '90-second movement break?', exact: true })).toBeVisible();
  await expect(page.locator('.learned-reason')).toHaveText('Based on the smaller break you completed earlier.');
  await page.reload();
  await expect(page.locator('.learned-reason')).toBeVisible();
  await preview(page, 'Evening recharge');
  await expect(page.getByRole('heading', { name: '10 minutes with an instrument?', exact: true })).toBeVisible();
  await expect(page.locator('.action-social')).toContainText('Vijay');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.getByRole('button', { name: /^Complete demo action/ }).click();
  await page.getByRole('button', { name: 'No different', exact: true }).click();
  await page.getByRole('button', { name: 'Keep private & back to my day', exact: true }).click();
  await goTo(page, 'Rhythm');
  const learning = page.locator('.learning-section');
  await expect(learning).toContainText('Smaller movement fits');
  await expect(learning).toContainText('Playing musical instruments');
  expect(await learning.evaluate(element => element.compareDocumentPosition(document.querySelector('.week-section')!) & Node.DOCUMENT_POSITION_PRECEDING)).toBeTruthy();
  await expect(page.locator('.mosaic-tile')).toHaveCount(11);
});

test('movement swaps expose physical breadth and connection appears as a mental action', async ({ page }) => {
  await openDemo(page);
  await page.getByRole('button', { name: 'Swap activity', exact: true }).click();
  for (const name of ['Go outside', 'Stretch / mobility', 'Wake me up', 'Move a little stronger', 'Move to music']) await expect(page.getByRole('dialog').getByRole('button', { name, exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Wake me up', exact: true }).click();
  await expect(page.getByRole('heading', { name: '1-minute energy burst?', exact: true })).toBeVisible();
  await expect(page.locator('.action-preview')).toContainText('Sit to stand');
  await page.getByRole('button', { name: 'Swap activity', exact: true }).click();
  await page.getByRole('button', { name: 'Move a little stronger', exact: true }).click();
  expect((await stored(page)).responses.at(-1).swapReason).toBe('Move a little stronger');
  await expect(page.locator('.recommendation h2')).toContainText('sit-to-stands');
  await preview(page, 'Connection recharge');
  await expect(page.getByRole('heading', { name: 'Talk to a friend?', exact: true })).toBeVisible();
  await expect(page.locator('.family-label')).toContainText('RECHARGE');
  await expect(page.locator('.recommendation')).not.toContainText('Maya is free');
});

test('adapt → act → feedback → learn → share → Rhythm works across reload', async ({ page }) => {
  await openDemo(page);
  await page.getByRole('button', { name: 'Make it easier', exact: true }).click();
  await expect(page.getByRole('heading', { name: '90-second movement break?', exact: true })).toBeVisible();
  expect((await stored(page)).responses.at(-1).outcome).toBe('fallback_requested');
  await page.reload();
  await expect(page.getByRole('heading', { name: '90-second movement break?', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Make it easier', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'I can do that', exact: true }).click();
  await expect(page.getByRole('navigation')).toHaveCount(0);
  await expect(page.getByRole('timer')).toHaveText('1:30');
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Resume', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Done early', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'A movement break, complete.', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Better', exact: true }).click();
  await expect(page.getByText(/Your next movement suggestion will start smaller/)).toBeVisible();
  await page.getByRole('button', { name: 'Share this action', exact: true }).click();
  await page.getByRole('button', { name: 'Back to my day', exact: true }).click();
  const state = await stored(page);
  expect(state.completions.at(-1).feedback).toBe('Better');
  expect(state.completions.at(-1).shared).toBe(true);
  expect(state.responses.slice(-3).map((r: { outcome: string }) => r.outcome)).toEqual(['fallback_requested', 'fallback_accepted', 'completed']);
  await preview(page, 'Quick movement opportunity');
  await expect(page.getByRole('heading', { name: '90-second movement break?', exact: true })).toBeVisible();
  await goTo(page, 'Rhythm');
  await expect(page.getByRole('heading', { name: 'Smaller movement fits', exact: true })).toBeVisible();
  await expect(page.getByText('90-second movement break', { exact: true })).toBeVisible();
});

test('timer completion requires a human confirmation', async ({ page }) => {
  await openDemo(page);
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.evaluate(() => { const active = JSON.parse(localStorage.getItem('mosaic-active-v2')!); localStorage.setItem('mosaic-active-v2', JSON.stringify({ ...active, deadline: Date.now() - 1000, remaining: 0 })); });
  await page.reload();
  await expect(page.getByRole('timer')).toHaveText('0:00');
  expect((await stored(page)).completions.filter((c: { demo: boolean }) => !c.demo)).toHaveLength(0);
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'You moved for 2 minutes.', exact: true })).toBeVisible();
});

test('Not now and skipping the one fallback leave the moment alone', async ({ page }) => {
  await openDemo(page);
  await page.getByRole('button', { name: 'Not now', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Nothing from Nudge right now.', exact: true })).toBeVisible();
  expect((await stored(page)).responses.at(-1).outcome).toBe('declined');
  await page.getByRole('button', { name: 'Preview another moment', exact: true }).click();
  await page.getByRole('button', { name: 'Reset sample day', exact: true }).click();
  await page.getByRole('button', { name: 'Make it easier', exact: true }).click();
  await page.getByRole('button', { name: 'Skip', exact: true }).click();
  await expect(page.getByRole('button', { name: 'I can do that' })).toHaveCount(0);
});

test('swapping visibly changes the activity and records a different response', async ({ page }) => {
  await openDemo(page);
  await preview(page, 'Social prompt');
  await expect(page.getByRole('heading', { name: '5-minute outdoor walk?', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Swap activity', exact: true }).click();
  await page.getByRole('button', { name: 'Stretch / mobility', exact: true }).click();
  await expect(page.getByRole('heading', { name: '5-minute outdoor walk?', exact: true })).toHaveCount(0);
  await expect(page.locator('.recommendation-copy')).toContainText('So right now:');
  const state = await stored(page);
  expect(state.responses.at(-1).outcome).toBe('swapped');
  expect(state.responses.at(-1).swapReason).toBe('Stretch / mobility');
  await page.reload();
  await expect(page.getByRole('button', { name: 'Start', exact: true })).toBeVisible();
});

test('busy is intentional and evening demonstrates creative mental recharge', async ({ page }) => {
  await openDemo(page);
  await preview(page, 'Busy / no intervention');
  await expect(page.getByRole('heading', { name: 'Nothing from Nudge right now.', exact: true })).toBeVisible();
  await expect(page.getByText('Next opening around 4:10 PM', { exact: true })).toBeVisible();
  await preview(page, 'Evening recharge');
  await expect(page.getByRole('heading', { name: '10 minutes with an instrument?', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await expect(page.getByText(/Pick up an instrument and play/)).toBeVisible();
  await page.getByRole('button', { name: 'Done early', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'How was that?', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Helped', exact: true }).click();
  await page.getByRole('button', { name: 'Keep private & back to my day', exact: true }).click();
  expect((await stored(page)).completions.at(-1).shared).toBe(false);
  await goTo(page, 'Rhythm');
  await expect(page.getByRole('heading', { name: 'Playing musical instruments has a place in your day', exact: true })).toBeVisible();
});

test('a deliberate action remains available in a quiet state', async ({ page }) => {
  await openDemo(page);
  await page.getByRole('button', { name: 'Not now', exact: true }).click();
  await page.getByRole('button', { name: /I need something now/ }).click();
  await page.getByRole('button', { name: 'Clear my head', exact: true }).click();
  await page.getByRole('button', { name: '1–2 minutes', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Start', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'One quiet minute?', exact: true })).toBeVisible();
});

test('swapping respects a deliberately chosen window rather than the calendar window', async ({ page }) => {
  await openDemo(page);
  await preview(page, 'Social prompt');
  await page.getByRole('button', { name: /I need something now/ }).click();
  await page.getByRole('button', { name: 'Move my body', exact: true }).click();
  await page.getByRole('button', { name: '1–2 minutes', exact: true }).click();
  await page.getByRole('button', { name: 'Swap activity', exact: true }).click();
  await page.getByRole('button', { name: 'Move to music', exact: true }).click();
  expect((await stored(page)).responses.at(-1).duration).toBeLessThanOrEqual(2);
  await expect(page.locator('.opportunity')).toContainText('1–2 MINUTES YOU CHOSE');
  await preview(page, 'Busy / no intervention');
  await page.getByRole('button', { name: /I need something now/ }).click();
  await page.getByRole('button', { name: 'Move my body', exact: true }).click();
  await page.getByRole('button', { name: '5 minutes', exact: true }).click();
  await page.getByRole('button', { name: 'Swap activity', exact: true }).click();
  await page.getByRole('button', { name: 'Go outside', exact: true }).click();
  expect((await stored(page)).responses.at(-1).duration).toBe(2);
  await expect(page.locator('.opportunity')).toContainText('5 MINUTES YOU CHOSE');
});

test('ending and already done remain distinct from completion and decline', async ({ page }) => {
  await openDemo(page);
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.getByRole('button', { name: 'End this action', exact: true }).click();
  expect((await stored(page)).responses.at(-1).outcome).toBe('abandoned');
  await preview(page, 'Quick movement opportunity');
  await page.getByRole('button', { name: 'More action options' }).click();
  const completionsBefore = (await stored(page)).completions.length;
  await page.getByRole('button', { name: 'Already moved', exact: true }).click();
  const updated = await stored(page);
  expect(updated.responses.at(-1).outcome).toBe('already_done');
  expect(updated.completions).toHaveLength(completionsBefore);
  expect(updated.context.sittingMinutes).toBe(0);
  await expect(page.getByRole('heading', { name: 'How was that?', exact: true })).toHaveCount(0);
  await expect(page.getByRole('status')).toContainText('count that as context');
});

test('Circle encouragement, Join and per-action sharing work without exposing context', async ({ page }) => {
  await openDemo(page);
  await page.getByRole('button', { name: 'See activity', exact: true }).click();
  await page.getByRole('button', { name: 'Encourage Jay', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Encourage Jay', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Join Vijay', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'How much space do you have?' })).toBeVisible();
  await page.getByRole('button', { name: '5 minutes', exact: true }).click();
  await page.getByRole('button', { name: /^(Start|Take one song)$/ }).click();
  await page.getByRole('button', { name: 'Done early', exact: true }).click();
  await expect(page.locator('.share-preview')).not.toContainText('sleep');
  await expect(page.locator('.share-preview')).not.toContainText('meetings');
});

test('Rhythm day details and honest learning have useful empty states', async ({ page }) => {
  await openDemo(page);
  await goTo(page, 'Rhythm');
  await expect(page.getByRole('heading', { name: 'Finding your movement rhythm', exact: true })).toBeVisible();
  await page.getByRole('button', { name: /^Sun, 4/ }).click();
  await expect(page.getByRole('heading', { name: 'A little room to begin.', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: /^Sat, 3/ }).click();
  await expect(page.getByRole('dialog')).toContainText('example');
});

test('preferences persist and redundant hobby labels are absent', async ({ page }) => {
  await openDemo(page);
  await goTo(page, 'You');
  await page.getByRole('button', { name: 'Edit your preferences' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Your name', { exact: true }).fill('Alex');
  await expect(dialog.getByRole('button', { name: 'Playing musical instruments', exact: true })).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Talking to a friend', exact: true })).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Creative hobbies', exact: true })).toHaveCount(1);
  await expect(dialog.getByRole('button', { name: 'Guitar', exact: true })).toHaveCount(0);
  await dialog.getByRole('button', { name: 'Save preferences' }).click();
  await page.reload();
  expect((await stored(page)).preferences.name).toBe('Alex');
});

test('reset is deterministic and never deletes saved personal state or busy times', async ({ page }) => {
  await openDemo(page);
  await page.evaluate(() => { localStorage.setItem('mosaic-v2-personal', JSON.stringify({ sentinel: 'personal saved' })); localStorage.setItem('mosaic-calendar-v1', JSON.stringify([{ id: 'personal', title: 'My class' }])); });
  await page.getByRole('button', { name: 'Not now', exact: true }).click();
  await preview(page, 'Evening recharge');
  await page.getByRole('button', { name: 'Demo: preview a moment' }).click();
  await page.getByRole('button', { name: 'Reset sample day', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Move for 2?', exact: true })).toBeVisible();
  expect((await stored(page)).responses).toHaveLength(0);
  expect((await stored(page)).preferences.name).toBe('Yuvraj');
  expect(await stored(page, 'mosaic-v2-personal')).toEqual({ sentinel: 'personal saved' });
  expect(await stored(page, 'mosaic-calendar-v1')).toEqual([{ id: 'personal', title: 'My class' }]);
  await page.goto('/?intro=1');
  await page.getByRole('button', { name: 'Try sample day', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Move for 2?', exact: true })).toBeVisible();
});

test('four-screen setup saves choices, resumes drafts and skips optional connections', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Set up Nudge', exact: true }).click();
  await page.getByRole('button', { name: 'Unwind', exact: true }).click();
  await page.getByLabel(/Your first name/).fill('Alex');
  await page.reload();
  await expect(page.getByLabel(/Your first name/)).toHaveValue('Alex');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: 'Walking', exact: true }).click();
  await page.getByRole('button', { name: 'Reading', exact: true }).click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: 'Start my day', exact: true }).click();
  const state = await stored(page, 'mosaic-v2-personal');
  expect(state.preferences.interests).toEqual(['Reading']);
  expect(state.preferences.movementPreferences).toEqual(['Walking']);
  expect(state.context.sleepMinutes).toBeNull();
  expect(state.context.steps).toBeNull();
  expect(state.demoMode).toBe(false);
  await expect(page.getByText('Not connected', { exact: true })).toHaveCount(5);
});

test('no system permissions are requested on onboarding or action completion', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(window, '__requests', { value: 0, writable: true }); Object.defineProperty(Notification, 'requestPermission', { configurable: true, value: () => { (window as unknown as { __requests: number }).__requests += 1; return Promise.resolve('granted'); } }); });
  await openDemo(page);
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.getByRole('button', { name: 'Done early', exact: true }).click();
  expect(await page.evaluate(() => (window as unknown as { __requests: number }).__requests)).toBe(0);
});

for (const width of [320, 390, 768, 1440]) {
  test(`all destinations, sheets and sessions fit ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 320 ? 667 : 844 });
    await openDemo(page);
    const noOverflow = () => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && [...document.querySelectorAll('.phone-app, .app-content, dialog')].every(e => e.scrollWidth <= e.clientWidth + 1));
    for (const name of ['Today', 'Rhythm', 'You']) { await goTo(page, name); expect(await noOverflow()).toBe(true); }
    await page.getByRole('button', { name: 'Edit your preferences' }).click();
    expect(await noOverflow()).toBe(true);
    await page.keyboard.press('Escape');
    await goTo(page, 'Today');
    await page.getByRole('button', { name: 'Start', exact: true }).click();
    expect(await noOverflow()).toBe(true);
    await page.getByRole('button', { name: 'Done early', exact: true }).click();
    expect(await noOverflow()).toBe(true);
  });
}

test('native sheets trap focus, restore it, and provide reduced-motion support', async ({ page }) => {
  await openDemo(page);
  const trigger = page.getByRole('button', { name: 'Swap activity', exact: true });
  await trigger.focus();
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  for (let i = 0; i < 9; i++) { await page.keyboard.press('Tab'); expect(await page.evaluate(() => !!document.activeElement?.closest('dialog'))).toBe(true); }
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await trigger.click();
  expect(await page.getByRole('dialog').evaluate(e => getComputedStyle(e).animationName)).toBe('none');
});

test('200% text remains readable without horizontal page overflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await openDemo(page);
  await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
  for (const name of ['Today', 'Rhythm', 'You']) { await goTo(page, name); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.querySelector('.app-content')!.scrollWidth <= document.querySelector('.app-content')!.clientWidth)).toBe(true); }
});

test('saved personal busy times still suppress automatic recommendations after the redesign', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('mosaic-onboarded-v3', 'true');
    localStorage.setItem('mosaic-mode', 'personal');
    const now = new Date();
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    localStorage.setItem('mosaic-calendar-v1', JSON.stringify({ version: 1, events: [{ id: 'personal', title: 'My class', date, start: '00:00', end: '23:59' }] }));
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Nothing from Nudge right now.', exact: true })).toBeVisible();
  expect((await stored(page, 'mosaic-calendar-v1')).events[0].title).toBe('My class');
  await expect(page.getByRole('button', { name: /I need something now/ })).toBeVisible();
});

test('disconnecting sample connections makes health and schedule unknown', async ({ page }) => {
  await openDemo(page);
  await goTo(page, 'You');
  await page.getByRole('button', { name: /^Connections/ }).click();
  await page.getByRole('button', { name: 'Disconnect demo', exact: true }).first().click();
  await page.getByRole('button', { name: 'Disconnect demo', exact: true }).first().click();
  await page.keyboard.press('Escape');
  await goTo(page, 'Today');
  await expect(page.getByText('Not connected', { exact: true })).toHaveCount(5);
  const state = await stored(page);
  expect(state.context.sleepMinutes).toBeNull();
  expect(state.context.steps).toBeNull();
  expect(state.context.meetings).toBeNull();
});

test('returning to personal mode uses the current time immediately and preserves saved choices', async ({ page }) => {
  await openDemo(page);
  await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('mosaic-v2-demo')!);
    const now = new Date();
    const time = (hour: number) => `${String(hour % 24).padStart(2, '0')}:00`;
    state.demoMode = false;
    state.preferences.name = 'Asha';
    state.preferences.quietStart = time(now.getHours());
    state.preferences.quietEnd = time(now.getHours() + 2);
    state.context.hour = (now.getHours() + 12) % 24;
    localStorage.setItem('mosaic-v2-personal', JSON.stringify(state));
    localStorage.setItem('mosaic-mode', 'personal');
  });
  await page.reload();
  await expect(page.getByText('These are your quiet hours. We’ll leave this time clear.', { exact: true })).toBeVisible();
  const state = await stored(page, 'mosaic-v2-personal');
  expect(state.context.hour).toBe(await page.evaluate(() => new Date().getHours()));
  expect(state.preferences.name).toBe('Asha');
  expect(state.preferences.interests).toContain('Playing musical instruments');
  expect(state.completions).toHaveLength(9);
});

test('a chosen action and its time window survive reload, and skipping never restores it', async ({ page }) => {
  await openDemo(page);
  await preview(page, 'Busy / no intervention');
  await page.getByRole('button', { name: /I need something now/ }).click();
  await page.getByRole('button', { name: 'Move my body', exact: true }).click();
  await page.getByRole('button', { name: '5 minutes', exact: true }).click();
  await page.getByRole('button', { name: 'Swap activity', exact: true }).click();
  await page.getByRole('button', { name: 'Go outside', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('heading', { name: '2 minutes outside?', exact: true })).toBeVisible();
  await expect(page.locator('.opportunity')).toContainText('5 MINUTES YOU CHOSE');
  await page.getByRole('button', { name: 'Make it easier', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'I can do that', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Make it easier', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Skip', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Nothing from Nudge right now.', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'I can do that', exact: true })).toHaveCount(0);
});

test('completion survives reload without recording the action twice', async ({ page }) => {
  await openDemo(page);
  await page.getByRole('button', { name: 'Make it easier', exact: true }).click();
  await page.getByRole('button', { name: 'I can do that', exact: true }).click();
  await page.getByRole('button', { name: /^Complete demo action/ }).click();
  const completionId = (await stored(page)).completions.at(-1).id;
  await page.reload();
  await expect(page.getByRole('heading', { name: 'How was that?', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Better', exact: true }).click();
  await page.getByRole('button', { name: 'Share this action', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Better', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('heading', { name: 'Shared in your sample Circle', exact: true })).toBeVisible();
  expect((await stored(page)).completions.filter((item: { demo: boolean }) => !item.demo)).toHaveLength(1);
  expect((await stored(page)).completions.at(-1).id).toBe(completionId);
  await page.getByRole('button', { name: 'Back to my day', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'How was that?', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'See activity', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('Yuvraj took a movement break');
  await expect(page.getByRole('dialog').locator('.action-history')).not.toContainText('Better');
  await expect(page.getByRole('dialog').locator('.action-history')).not.toContainText('90 seconds');
});

test('personal setup, demo exploration, introduction replay and guide all have a way back', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Set up Nudge', exact: true }).click();
  await page.getByLabel(/Your first name/).fill('Alex');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: 'Reading', exact: true }).click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: 'Start my day', exact: true }).click();
  await page.getByRole('button', { name: 'Open settings', exact: true }).click();
  await page.getByRole('button', { name: 'Explore the sample day', exact: true }).click();
  await page.getByRole('button', { name: /^Packed afternoon/ }).click();
  await page.getByRole('button', { name: 'Demo: preview a moment' }).click();
  await page.getByRole('button', { name: 'Return to my personal day', exact: true }).click();
  expect(await page.evaluate(() => localStorage.getItem('mosaic-mode'))).toBe('personal');
  await goTo(page, 'You');
  await expect(page.getByRole('heading', { name: 'Alex', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Open settings', exact: true }).click();
  await page.getByRole('button', { name: 'Replay introduction', exact: true }).click();
  await page.getByRole('button', { name: 'Set up Nudge', exact: true }).click();
  await expect(page.getByLabel(/Your first name/)).toHaveValue('Alex');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Reading', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Close introduction', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'You', exact: true })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('mosaic-setup-v3'))).toBeNull();
  await page.getByRole('button', { name: /^How Nudge works/ }).click();
  await page.getByRole('button', { name: 'Back to my day', exact: true }).click();
  await expect(page.getByRole('navigation').getByRole('button', { name: 'Today', exact: true })).toHaveAttribute('aria-current', 'page');
  expect((await stored(page, 'mosaic-v2-personal')).preferences.interests).toEqual(['Reading']);
});

test('notification and installation fallbacks stay visible and offer a return path', async ({ page }) => {
  await page.addInitScript(() => {
    class BlockedNotification {
      static permission = 'granted';
      constructor() { throw new Error('Notification preview unavailable'); }
    }
    Object.defineProperty(window, 'Notification', { configurable: true, value: BlockedNotification });
  });
  await openDemo(page);
  await page.getByRole('button', { name: 'Open settings', exact: true }).click();
  await page.getByRole('button', { name: 'Preview a nudge', exact: true }).click();
  await expect(page.getByRole('dialog').getByRole('status')).toHaveText('This browser couldn’t display the preview.');
  await page.getByRole('button', { name: 'Add to home screen', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Nudge, on your home screen', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Back to Settings', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'On your terms', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Move for 2?', exact: true })).toBeVisible();
});

test('pause dismisses an automatic alternative and voluntary sheets let you change your mind', async ({ page }) => {
  await openDemo(page);
  await page.getByRole('button', { name: 'Make it easier', exact: true }).click();
  await page.getByRole('button', { name: 'Open settings', exact: true }).click();
  await page.getByRole('switch', { name: 'Pause Nudge', exact: true }).click();
  await page.getByRole('button', { name: 'Close dialog', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'On your own time.', exact: true })).toBeVisible();
  await page.getByRole('button', { name: /I need something now/ }).click();
  await page.getByRole('button', { name: 'Clear my head', exact: true }).click();
  await page.getByRole('button', { name: 'Back to what you need', exact: true }).click();
  await page.getByRole('button', { name: 'Do something I enjoy', exact: true }).click();
  await page.getByRole('button', { name: '1–2 minutes', exact: true }).click();
  await page.getByText('Why this fits', { exact: true }).click();
  await expect(page.locator('.why-fits')).toContainText('You made 1–2 minutes available');
  await expect(page.locator('.why-fits')).not.toContainText('86 minutes sitting');
});

test('evening completion can continue into the connection example', async ({ page }) => {
  await openDemo(page);
  await preview(page, 'Evening recharge');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.getByRole('button', { name: /^Complete demo action/ }).click();
  await page.getByRole('button', { name: 'Keep private & back to my day', exact: true }).click();
  await preview(page, 'Connection recharge');
  await expect(page.getByRole('heading', { name: 'Talk to a friend?', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.locator('.opportunity')).not.toContainText('3:00 PM');
});

test('joining a friend keeps the activity relevant when preferences differ', async ({ page }) => {
  await openDemo(page);
  await goTo(page, 'You');
  await page.getByRole('button', { name: 'Edit your preferences' }).click();
  for (const name of ['Music', 'Talking to a friend', 'Playing musical instruments', 'Watching something']) await page.getByRole('button', { name, exact: true }).click();
  await page.getByRole('button', { name: 'Save preferences', exact: true }).click();
  await page.getByRole('button', { name: 'See activity', exact: true }).click();
  await page.getByRole('button', { name: 'Join Vijay', exact: true }).click();
  await expect(page.getByRole('button', { name: '1–2 minutes', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: '5 minutes', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Take one song', exact: true })).toBeVisible();
  expect((await stored(page)).preferences.interests).toEqual(['Going outside']);
});

test('an overwhelmed check-in immediately offers a realistic reset after a decline and survives reload', async ({ page }) => {
  await openDemo(page);
  await page.getByRole('button', { name: 'Not now', exact: true }).click();
  await expect(page.locator('.recommendation')).toHaveCount(0);
  await page.getByRole('button', { name: /^How are you feeling/ }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Overwhelmed', exact: true }).click();
  await expect(page.locator('.recommendation')).toContainText('RECHARGE · MIND');
  await expect(page.locator('.recommendation-copy')).toContainText('You’re feeling overwhelmed');
  await expect(page.locator('.noticed')).toContainText('You’re feeling overwhelmed');
  await expect(page.getByRole('button', { name: 'Start', exact: true })).toBeInViewport();
  const before = await stored(page);
  expect(before.responses.at(-1).outcome).toBe('declined');
  await page.reload();
  await expect(page.locator('.recommendation-copy')).toContainText('You’re feeling overwhelmed');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await expect(page.locator('.active-session')).toBeVisible();
  await page.getByRole('button', { name: /^Complete demo action/ }).click();
  await page.getByRole('button', { name: 'Keep private & back to my day', exact: true }).click();
  await page.getByRole('button', { name: /^How are you feeling/ }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Overwhelmed', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Start', exact: true })).toBeInViewport();
  await page.getByRole('button', { name: 'Not now', exact: true }).click();
  await page.reload();
  await expect(page.locator('.recommendation')).toHaveCount(0);
});

test('calendar shows the commitments behind the current opening and future possible nudges', async ({ page }) => {
  await openDemo(page);
  await page.getByRole('button', { name: 'See calendar and openings', exact: true }).click();
  const calendar = page.getByRole('dialog', { name: 'Your day & openings' });
  await expect(calendar).toContainText('Sample calendar · simulated commitments');
  await expect(calendar.getByRole('heading', { name: 'Planning meeting', exact: true })).toBeVisible();
  await expect(calendar.locator('.schedule-current')).toContainText('14 minutes open now');
  await expect(calendar.locator('.schedule-current')).toContainText('2:46 PM–3:00 PM');
  await expect(calendar).toContainText('24-minute opening');
  await expect(calendar).toContainText('Possible nudge · only if it fits how you feel then');
  await calendar.getByRole('button', { name: 'Back to my day', exact: true }).click();
  await preview(page, 'Quick movement opportunity');
  await page.getByRole('button', { name: 'See your calendar and nudge opportunities', exact: true }).click();
  await expect(calendar.locator('.schedule-current')).toContainText('3 minutes open now');
  await expect(calendar.locator('.schedule-current')).toContainText('4:20 PM–4:23 PM');
  await calendar.getByRole('button', { name: 'Close dialog', exact: true }).click();
  await preview(page, 'Busy / no intervention');
  await page.getByRole('button', { name: 'See calendar and openings', exact: true }).click();
  await expect(calendar.locator('.schedule-current')).toContainText('Planning meeting');
  await expect(calendar.locator('.schedule-current')).toContainText('Nudge stays quiet');
});

test('a check-in acknowledges a busy moment rather than claiming there is free time', async ({ page }) => {
  await openDemo(page);
  await preview(page, 'Busy / no intervention');
  await page.getByRole('button', { name: /^How are you feeling/ }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Overwhelmed', exact: true }).click();
  await expect(page.locator('.recommendation')).toHaveCount(0);
  await expect(page.getByRole('status')).toContainText('Your time is committed until 4:10 PM');
  await expect(page.getByRole('button', { name: /^I need something now/ })).toBeVisible();
});

test('choosing tired and overwhelmed leads to different types of small action and clearing restores context', async ({ page }) => {
  await openDemo(page);
  await page.getByRole('button', { name: /^How are you feeling/ }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Tired', exact: true }).click();
  await expect(page.locator('.recommendation')).toContainText('MOVE · BODY');
  await expect(page.locator('.recommendation-copy')).toContainText('feeling tired');
  await page.getByRole('button', { name: /^How are you feeling/ }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Stressed', exact: true }).click();
  await expect(page.locator('.recommendation')).toContainText('RECHARGE · MIND');
  await expect(page.locator('.recommendation-copy')).toContainText('feeling stressed');
  await page.getByRole('button', { name: /^How are you feeling/ }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Clear check-in', exact: true }).click();
  expect((await stored(page)).mood).toBeNull();
  await expect(page.getByRole('heading', { name: 'Move for 2?', exact: true })).toBeVisible();
});

test('Spotify enables a focused one-song break and the completion feeds weekly reflection', async ({ page }) => {
  await openDemo(page);
  await expect(page.getByText('76 bpm', { exact: true })).toBeVisible();
  await expect(page.getByText('12m · sample', { exact: true })).toBeVisible();
  await preview(page, 'Evening music recharge');
  await expect(page.locator('.opportunity')).toContainText('22 MINUTES OPEN');
  await expect(page.getByRole('heading', { name: 'You finally have a little room.', exact: true })).toBeVisible();
  await expect(page.locator('.music-card')).toContainText('Welcome To The Jungle');
  await expect(page.locator('.music-card')).toContainText('Guns N’ Roses');
  await expect(page.locator('.music-card')).toContainText('Spotify · Demo connection');
  await expect(page.getByRole('link', { name: 'Open Welcome To The Jungle in Spotify' })).toHaveAttribute('href', 'https://open.spotify.com/track/0G21yYKMZoHa30cYVi1iA8');
  await expect.poll(() => page.locator('.music-card img').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  await expect(page.getByRole('button', { name: 'Take one song', exact: true })).toBeInViewport();
  await page.getByRole('button', { name: 'Take one song', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'One-song reset', exact: true })).toBeVisible();
  await expect(page.locator('.music-instruction')).toContainText('No scrolling. No work. Just listen.');
  await expect(page.locator('.context-chips')).toHaveCount(0);
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  await page.reload();
  await expect(page.locator('.music-card')).toContainText('Welcome To The Jungle');
  await expect(page.getByRole('button', { name: 'Resume', exact: true })).toBeVisible();
  await page.getByRole('button', { name: /^Complete demo action/ }).click();
  await expect(page.getByRole('heading', { name: 'You took 4 minutes 33 seconds for yourself.', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Helped', exact: true }).click();
  await page.getByRole('button', { name: 'Keep private & back to my day', exact: true }).click();
  await goTo(page, 'Rhythm');
  await expect(page.locator('.weekly-reflection')).toContainText('51 minutes 33 seconds for yourself');
  await expect(page.locator('.weekly-reflection')).toContainText('10 moments');
  await expect(page.locator('.activity-breakdown')).toContainText('Music× 3');
  await expect(page.locator('.weekly-reflection')).toContainText('9 example moments · 1 new demo choice');
  await expect(page.locator('.learning-section')).toContainText('Music has a place in your day');
});

test('Spotify demo connection and all three music-source labels persist without changing preferences', async ({ page }) => {
  await openDemo(page);
  const originalInterests = (await stored(page)).preferences.interests;
  await goTo(page, 'You');
  await page.getByRole('button', { name: /^Connections/ }).click();
  const spotify = page.locator('.connection').filter({ has: page.getByRole('heading', { name: /^Spotify/ }) });
  await expect(spotify).toContainText('Demo connection');
  for (const label of ['From your Chill playlist', 'Based on what you listen to', 'Recently played']) {
    await spotify.getByRole('button', { name: label, exact: true }).click();
    await page.keyboard.press('Escape');
    await preview(page, 'Evening music recharge');
    await expect(page.locator('.music-source')).toHaveText(label);
    await page.reload();
    await expect(page.locator('.music-source')).toHaveText(label);
    await goTo(page, 'You');
    await page.getByRole('button', { name: /^Connections/ }).click();
  }
  await spotify.getByRole('button', { name: 'Disconnect demo', exact: true }).click();
  await page.keyboard.press('Escape');
  await preview(page, 'Evening music recharge');
  await expect(page.locator('.music-card')).toHaveCount(0);
  expect((await stored(page)).preferences.interests).toEqual(originalInterests);
  await goTo(page, 'You');
  await page.getByRole('button', { name: /^Connections/ }).click();
  await spotify.getByRole('button', { name: 'Try demo connection', exact: true }).click();
  await page.keyboard.press('Escape');
  await preview(page, 'Evening music recharge');
  await expect(page.getByRole('button', { name: 'Take one song', exact: true })).toBeVisible();
});
