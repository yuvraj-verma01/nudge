// Presentation prototype: each document load starts a new walkthrough.
// Clear only Nudge's keys, leaving other sites/apps on this origin alone.
export function resetPrototypeEntry() {
  const keys = [
    'mosaic-v1', 'mosaic-v2-demo', 'mosaic-v2-personal', 'mosaic-mode',
    'mosaic-active-v2', 'mosaic-setup-v3', 'mosaic-onboarded-v2',
    'mosaic-onboarded-v3', 'mosaic-calendar-v1',
    'mosaic-view-v1-demo', 'mosaic-view-v1-personal',
  ];
  try {
    for (const key of keys) localStorage.removeItem(key);
    localStorage.setItem('mosaic-mode', 'personal');
  } catch { /* Empty in-memory defaults still allow setup. */ }
  try { sessionStorage.removeItem('nudge-entered-session-v1'); } catch { /* Optional storage. */ }
}
