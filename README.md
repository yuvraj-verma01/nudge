# Nudge

**Small actions for your body and mind, fitted around your actual day.**

Nudge interprets health signals, available time, personal preferences and saved choices into one realistic Move or Recharge action. The prototype demonstrates context → opportunity → action → feedback → learning → adaptation.

This mobile-first React / TypeScript / Vite PWA supports local use and public GitHub Pages hosting. The user has authorised public hosting under their GitHub account. There is no backend or authentication; personal preferences and history remain in each visitor’s browser. The latest presentation refinements are preserved in [docs/PRESENTATION_BRIEF.md](docs/PRESENTATION_BRIEF.md). The full submission brief is preserved in [docs/PRODUCT_BRIEF.md](docs/PRODUCT_BRIEF.md); the durable product direction is in [docs/VISION.md](docs/VISION.md).

## GitHub Pages

The deployment workflow at `.github/workflows/pages.yml` builds the app with the repository's Pages base path and publishes it through GitHub Actions. In repository Settings → Pages, select **GitHub Actions** as the source. Push to `main` to deploy, or run the deployment workflow manually.

Artwork, fonts, the manifest and the offline worker support a repository subdirectory such as `/nudge/`. Personal browser data is not part of the published source.

## Run

```sh
npm install
npm run dev
```

Open the local address printed by Vite. To revisit welcome, append `?intro=1`.

```sh
npm run build
npm test
```

Browser tests require Playwright Chromium (`npx playwright install chromium`). A repeatable screenshot, text-contrast and touch-target review is available with `node scripts/visual-audit.mjs` while the development server is running. Screenshots default to `/private/tmp/mosaic-design-audit`; set `MOSAIC_AUDIT_OUTPUT` to change the directory.

## The two-minute demo

1. Welcome → **Try sample day** opens directly on Today.
2. Sleep, steps, sitting and meetings flow into **Nudge noticed**. **So right now** connects that context to one realistic action.
3. **Move for 2?** shows “Jay did this 2-minute reset. Maya moved too.” before Start. The cue supports taking your own break; it opens the same Circle activity shown elsewhere.
4. **Make it easier → I can do that** offers one ninety-second fallback and a focused guide.
5. **Complete demo action** records an explicitly simulated completion without waiting. **Done early** remains a separate manual completion, using actual elapsed time.
6. **How was that? → Better** is optional. The learning statement explains the shorter future default. Sharing remains private unless chosen.
7. Return → **Demo → Later busy afternoon**. With another fourteen-minute opening, Nudge now starts with ninety seconds rather than two minutes and says **Based on the smaller break you completed earlier**. This change comes from the completed choice, not a hard-coded scenario.
8. **Evening recharge** offers ten minutes with an instrument, based on the sample person’s preferences, with Vijay’s sample music cue. **Connection recharge** at 8:10 PM demonstrates talking to a friend without inventing their availability.
9. **Rhythm** reflects moments and intentional time, then explains supported learning. Complete the evening demo action to see an observation about that choice. Each recorded action adds one muted Move or warm Recharge tile to the week.
10. **Demo → Reset sample day** restores the original persona and opening, preserving personal preferences, history and busy times.

**Swap activity** shows outside movement, mobility, an energy burst, strength micro-actions and movement to music. Choices respect the available window and gentleness after short sleep. **Not now** stops; it does not negotiate. **Already moved** updates context without claiming a completion or requesting a rating. **I need something now** asks for Move my body, Clear my head or Do something I enjoy, followed by a time window. Circle encouragement and sharing stay local.

## Spotify, heart rate and weekly reflection

You → Connections offers optional **Spotify · Demo connection**. Recently played, playlist and listening-based source labels are sample data, never live account history. **Demo → Evening music recharge** opens a 22-minute window with Welcome To The Jungle by Guns N’ Roses. **Take one song** starts a focused break matched to the song’s length; **Open in Spotify** opens the verified track separately. Nudge does not play or measure listening. The three sample sources feature Guns N’ Roses, Lana Del Rey and Lifafa. Album artwork is local and cached for offline presentation.

Today adds recent **76 bpm · 12m · sample** health context. Heart rate never produces a diagnosis or a mood inference. Personal unconnected data remains unknown.

Rhythm now shows weekly moments and time, a Move / Recharge breakdown, seven-day tiles, activity types and supported learning. Reset sample day previews **9 moments / 47 minutes**, clearly separated from new demo choices. Early completion counts actual recorded time. Music feedback changes future Recharge relevance. The [update notes](docs/CONTEXT_RECHARGE_REFLECTION.md) document the boundaries and data model.

## Calendar and responsive check-ins

Tap the meetings context or **Your day & openings** on Today. The day timeline shows commitments, the current free window and possible later openings. Busy blocks explain that Nudge stays quiet; openings are possibilities, not scheduled interventions. Demo commitments are explicitly labelled. Personal saved busy times take precedence and remain untouched.

A **Tired**, **Stressed** or **Overwhelmed** check-in immediately selects a brief, suitable action when there is time. The card names the feeling and explains the fit. This deliberate request can reopen help after a decline or completion; “Not now” still ends that interaction. Busy moments acknowledge the check-in without inventing available time. Selected check-ins can be updated or cleared.

The calendar/check-in checkpoint passed 68 automated checks and 38 rendered-state accessibility/layout checks.

## Presentation validation

Build, 75 automated checks, 44 visual states and production offline music recovery passed. Earlier source checkpoints are preserved locally by the owner. The detailed findings are in [docs/DESIGN_AUDIT.md](docs/DESIGN_AUDIT.md).

## Three destinations

- **Today:** compact context, integrated body/mind observations, a visible causal explanation and one primary action with contextual social support. Why this fits expands on demand. Completed actions remain visible below deliberate action choices and optional check-in.
- **Rhythm:** weekly moments and intentional time, Move / Recharge totals, the action mosaic, activity types and supported learning. It is not an agenda or a health dashboard. Sample history is explicitly labelled and never becomes evidence of personal learning.
- **You:** movement and recharge preferences, a sample Circle, connections, settings and the product guide. Exact preference vocabulary follows the brief; hobbies and creative time are consolidated.

Four-screen personal setup is optional and supports saved drafts. Replaying the introduction preserves existing personal choices and offers a close control. After exploring a sample day, Demo → Return to my personal day restores the saved personal mode. Calendar and health connections can be skipped or simulated, with explanatory labels and no system permission requests. Unconnected inputs remain unknown.

## Data and boundaries

The deterministic sample day is **Saturday, October 3, 2026**, at 2:46 PM: 5h 42m sleep, 2,180 steps, 86 minutes sitting, three meetings and fourteen minutes before the next commitment. Health, schedule and Circle inputs are simulations. Example history is marked separately from new choices.

Demo and personal states are stored independently in `mosaic-v2-demo` and `mosaic-v2-personal`; `mosaic-mode` remembers the current mode. `mosaic-active-v2` persists a paused or running session. Mode-specific `mosaic-view-v1-*` records restore the current destination, chosen action and completion screen. Version-one preferences, responses and completions are migrated, including the renamed interests. Original storage remains intact. Existing personal busy times in `mosaic-calendar-v1` are retained and still influence personal recommendations; there is no permanent agenda UI.

Feedback affects future activity relevance. Completed smaller actions lower the subsequent movement default. Negative feedback reduces the activity’s relevance, including an unsuitable easier option; later suggestions can stay short while choosing a different action. Indoor swaps increase the relevance of indoor mobility. Quiet hours, pauses, snoozes, cooldowns and prompt limits protect attention. Rules are deterministic and transparent, not a trained model or a clinical assessment.

Circle sharing persists the chosen action in this browser only. No contacts are accessed and nothing is sent to another person. Health context, mood and schedule are excluded from the sharing preview.

Notifications are optional, requested only through a deliberate settings action. The browser can display an immediate preview; background delivery and remote push are not connected.

## Phone and offline use

The primary layout is 390 × 844. Desktop centres a single column without a fake device frame. Shared native sheets make the background inert, contain keyboard focus and restore it when closed. Text contrast, 44px control targets, enlarged text and reduced motion are covered by the visual audit; interaction tests exercise 320, 390, 768 and 1440px layouts.

`npm run build` produces the manifest, icons and service worker. `npm run preview` serves the production bundle locally. After an initial online load, it can reload offline and retain preferences, choices and a session. Installation requires a secure address reachable by the phone. This is a web/PWA prototype, not an App Store package.
