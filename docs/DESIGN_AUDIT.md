# Nudge redesign and product audit

The October 3, 2026 rebuild follows the complete user brief in PRODUCT_BRIEF.md. It preserves the original purpose: use context to help someone take a small physical or restorative action in real life. The prototype remains local.

## Decisions and fixes

| Area | Problem in the previous prototype | Result |
| --- | --- | --- |
| First impression | Wellness purpose was hidden behind a generic activity invitation. | Welcome explicitly names body and mind. Today shows restrained health/schedule inputs, Body/Mind interpretation and one dominant action. |
| Hierarchy | Blank space and similar cards competed with the main purpose. | One recommendation surface; context is compact, secondary sections use typography and dividers. The causal explanation and sample social cue precede Start. Learning leads Rhythm, with a small weekly action mosaic below it. |
| Navigation | An agenda occupied an entire destination. | Exactly Today, Rhythm and You. Rhythm explains behaviour and learning; calendar supplies context. |
| Adaptation | Accept/decline dominated the interaction. | One smaller fallback and a separate activity swap. Their responses are stored separately and influence future effort and selection. |
| Action | A timer gave little guidance. | Varied movement snacks and personalised recharge activities have concrete instructions. Multi-step actions show the current step and sequence. |
| Completion | “Done” and “moments protected” failed to show what happened. | Name the completed action, collect neutral optional feedback, explain learning and preview optional sharing. Early completion never claims the entire planned duration elapsed. |
| Quiet states | Quiet could be the accidental opening demonstration. | Sample entry and reset are deterministic. Busy, cooldown and pause explain why there is no automatic suggestion. Deliberate Move/Recharge remains available. |
| Demo state | Sample responses could leave the pitch stuck or overwrite personal choices. | Sample and personal states have separate persistence. Reset restores the sample persona and context only. |
| Learning | Example history risked looking like a proven personal pattern. | Example actions remain labelled and excluded from learning. Observations come from new choices and completions. |
| Vocabulary | Guitar/calling labels were narrow; hobbies overlapped creative time. | Playing musical instruments, Talking to a friend and a single Creative hobbies preference. Legacy preferences and history migrate. |
| Sharing | Context and sharing boundaries were unclear. | Default private; exact named action preview; each share is explicit and local. Health context is excluded. |
| Consistency | Screens had separate styles and modal implementations. | Shared font, palette, spacing, controls and a native sheet shell. Remove obsolete calendar and dashboard UI. |
| Accessibility | Focus could escape a sheet; enlarged text could overflow. | Inert modal background, explicit Tab containment, Escape and focus restoration. Wrap flexible rows, retain 44px controls and allow the narrow weekly strip to scroll within its own region. |

## Presentation refinements

The follow-up [presentation brief](PRESENTATION_BRIEF.md) is implemented without adding new product families. Today explicitly connects the observations to the action. The relevant Circle cue appears inside the recommendation before Start; the cue, main action and adaptation controls fit the initial 390 × 844 viewport. Movement swaps make the activity range visible. Sample completion is explicitly simulated, and a later busy-afternoon scenario uses the saved easier completion to change the default. Optional feedback is neutral and negative responses reduce relevance. “Already moved” records missing context without adding a completion. Rhythm leads with real saved-choice observations; tiles are history, not points.

The previous full source is preserved in the version archive, with checksum and instructions for running it separately. Personal history, preferences and busy times remain intact.

## Final submission pass

- Added a return from demo exploration to the saved personal day. Replaying the introduction now has an exit and starts with saved personal choices; closing it discards only the unfinished replay draft.
- Chosen actions, their voluntary time windows, the current destination and completion feedback screens survive reload. A decline or skip clears the pending action. Active sessions stay associated with the correct mode.
- Back buttons let people revise on-demand intent and return from installation instructions. The guide's “Back to my day” actually opens Today. Circle uses “See activity,” matching what the sheet offers.
- “Why this fits” describes the current action. Joining a music activity remains relevant even when saved preferences differ. Shared Circle entries match the minimal action preview and omit private feedback, durations and timing.
- The optional connection example now takes place at 8:10 PM, clear of the cooldown after evening recharge. Reloading an evening keeps the next-calendar-event value unknown instead of restoring a sample afternoon meeting.
- Notification failures appear inside the settings dialog. Expired installation prompts fall back to instructions. Native sheets restore focus after action changes; malformed setup drafts and personal records recover safely.

## Verification

- Production TypeScript/Vite build passed.
- 64 Playwright checks passed: recommendation rules, fit and gentle constraints, one fallback, swaps, session restoration, manual completion, feedback, sharing, voluntary-window adaptation, current personal time, personalised recharge, data migration, independent reset, onboarding, quiet states and saved busy-time inputs.
- Browser layouts checked at 320, 390, 768 and 1440 pixels; primary phone target 390 × 844.
- 200% text checked without horizontal page overflow.
- 33 rendered states inspected with the repeatable visual audit. Its text-contrast calculation found no remaining failures; checked controls meet 44px targets. Keyboard focus and reduced motion also have interaction coverage.
- Production offline check passed: reload without a network, restore a paused ninety-second session, complete it, reload the completion screen, save feedback and see the learning in Rhythm. The Manrope font was cached and no runtime errors were observed.
- Screens reviewed include four onboarding steps, Today, easier, swap, focused session, completion, after-completion, busy, evening recharge, Rhythm, day detail/empty state, You, preferences, connections, Circle, settings and the guide.

The visual script checks rendered text contrast and control dimensions; it is not a claim of complete WCAG certification or physical-device validation. Integrations and Circle remain explicitly simulated.


## Calendar and check-in follow-up

- Today exposes a labelled commitments-and-openings timeline through the meetings input and a dedicated day entry. The current moment leads; earlier commitments can be expanded. Future gaps are potential nudges, never promises or calendar appointments. Personal occupied intervals, including overlaps, supply the same timing context to the recommendation and the timeline.
- A deliberate Tired, Stressed or Overwhelmed check-in produces a short action when there is an opportunity, even after an automatic cooldown. The mood appears in the observation, card explanation and expanded reasons. Repeated selection updates the request instead of silently clearing it; clearing is explicit. Busy time and disabled families are acknowledged, and Not now still clears the intervention. The chosen action survives reload.
- The opening Circle cue identifies the friend who tried that exact activity, and distinguishes other friends' movement from an exact match. It uses the same labelled sample activity records as Circle, without implying that every friend did the offered action.
- Production build, 68 automated checks and 38 rendered-state checks passed. Added coverage includes a check-in after decline/completion, reload and subsequent decline, busy check-ins, distinct tired/stressed actions, clear check-in and calendar alignment across three scenarios.


## Spotify, recent heart rate and weekly reflection

- Optional Spotify demo connection supports three labelled source modes. Track artwork is stored locally and the public Spotify deep link is verified. No OAuth, account listening history, playback or listening verification is implied.
- The music recommendation keeps its main action and Circle cue on the initial 390 × 844 phone screen. The focused one-song action has only instructions, artwork, track details, a break timer and completion controls. It restores across reload.
- Today includes the recent heart-rate age and sample source, alongside sleep, steps, inactivity and schedule. Unknown personal inputs stay unknown. Heart rate does not independently change recommendations or produce diagnostic claims.
- Rhythm leads with intentional minutes and moments, Move / Recharge totals, seven-day tiles and activity types, followed by supported learning. The nine-moment / 47-minute sample is explicit example history and is excluded from learning. Actual elapsed time is used for early completions, consistently in history and reflection.
- Music completions, Helped / Not for me feedback, repeated swaps, short completions and repeated cooperative cues feed deterministic relevance rules.
- Production build and 75 automated checks passed. The expanded visual audit covers 44 states without reported text-contrast, tap-target or overflow issues. Final music presentation refinements and calculation/connection tests also passed.


The user's final music selection replaces the original example with Guns N’ Roses, Lana Del Rey and Lifafa. Sample source controls identify the artist, and each selected track supplies its own session duration. All 75 checks and 44 rendered-state checks passed after this change. Production offline recovery passed for a paused music session, all three cached album covers, completion feedback restoration and updated weekly totals.
