# Nudge product vision

The app is now named **Nudge**, as requested by the user. The preserved original briefs call it **Mosaic**.

This reference preserves the user's original **MOSAIC** product specification and the later **Quiet Intelligence** prototype recommendations. Those user-provided notes are the source of the principles below; this document does not make independent research or clinical efficacy claims.

## Purpose and audience

Nudge is a context-aware behaviour intervention engine for students and young professionals with busy, sedentary, digitally mediated days. It bridges the intention–action gap: people know that movement, breaks, connection, and enjoyable activities help, but everyday obligations crowd them out.

The product asks: **Given this person's situation, what is the smallest useful action they are likely to take now?** Success happens outside the app. Intelligence appears through timing, selection, adaptation, and personal fit.

## The core loop

**SENSE → DECIDE → ACT → LEARN**

1. **Sense:** Understand enough context through time, available windows, inactivity, optional mood or energy, and previous choices. Context quality grows through optional integrations.
2. **Decide:** Check need, opportunity, and receptivity before selecting an action. A valid action must fit the available time and personal preferences. Quiet hours, pauses, recent declines, cooldowns, and an intervention budget protect attention. Low receptivity or an unsuitable moment means no intervention.
3. **Act:** Present one achievable action with a brief reason and clear choices. Get out of the way while the person acts. A busy state can simply say that Nudge will wait for a better moment.
4. **Learn:** Distinguish acceptance, easier requested, fallback accepted, decline, ignore, snooze, already done, completion, and abandonment. Use those signals to improve future timing, effort, and selection. Behaviour teaches more than repeated questionnaires.

Just-in-Time Adaptive Interventions inform timing; Behaviour Change Techniques provide the internal toolbox for prompts, graded tasks, feedback, past success, social support, and eventual habit formation. These labels belong in the architecture rather than the normal user interface.

## Two intervention families

**Move** creates small amounts of movement within everyday life: a brief walk, two minutes outside, a stretch, standing, or a lap around the building. The goal is easier activation, with an achievable effort threshold.

**Recharge** protects restorative behaviour the person actually enjoys: Music, Talking to a friend, Playing musical instruments, Reading, Watching something, Gaming, Creative hobbies, Going outside, and Quiet / mindfulness. Meditation is one preference among many. Micro and short resets are the focus; protecting longer hobby or relationship time is secondary.

Food is outside v1. Sleep can improve context and action fit without becoming a sleep section. Entertainment preferences create time to enjoy an activity; they do not require a media recommendation engine.

## Agency and adaptation

The follow-up notes refine fallback into an explicit choice:

- **Make it easier:** The behaviour may fit, but the effort is too much. Transform the same card into one smaller alternative.
- **Not now:** Leave this moment alone. Record the decline and stop; do not offer a fallback.
- **Skip the fallback:** Stop. There is a strict maximum of one fallback, with no further negotiation.

A completed smaller action can lower future effort. An already completed action reveals missing context rather than rejection. “Already moved” updates context and ends the intervention without claiming an in-app completion or asking for feedback. The action screen is quiet, completion takes little effort, and feedback acknowledges the action without confetti or forced ratings.

## Social support and privacy

Optional private Circles contain roughly 3–8 close people. Cooperative cues occasionally appear inside a relevant action: a friend took a walk or made time for a reset. Lightweight encouragement can support behaviour; a Circle is not a feed or destination.

Sharing defaults to minimal information and requires user choice. A completed action may be social; the mood, sleep, inactivity, schedule, location, and other context behind it stay private. There are no rankings, step comparisons, public health scores, follower mechanics, or shame-based streaks.

Collect context only when it materially improves an intervention. Explain the benefit before requesting calendar, health, location, or notification access. Integrations are optional; Nudge should remain useful with basic context and manual signals. Notification permission follows experienced value, and nudges respect quiet periods and budgets.

## Experience and honest learning

The [complete product brief](PRODUCT_BRIEF.md) and subsequent [presentation refinements](PRESENTATION_BRIEF.md) take precedence over earlier layout notes. The refinements make the existing loop visible rather than expand its scope. The rebuilt app has exactly **Today · Rhythm · You**: Today interprets context and offers one realistic action; Rhythm explains patterns through a week overview and day details; You holds preferences, connections, Circle and control. The previous Now/Day arrangement has been superseded. Calendar information supplies timing context. The latest user feedback asks to see the actual commitments and potential nudge windows: Today now opens a day timeline with busy blocks, the current opening and possible later moments, without adding a navigation destination. A deliberate Tired, Stressed or Overwhelmed check-in immediately chooses a small action when time is available; it can reopen help after an automatic cooldown, while a busy moment remains quiet.


The interface follows **one useful thing at a time**. The mobile-first web app presents both physical and mental wellbeing explicitly. Compact sleep, steps, inactivity and schedule inputs feed integrated body/mind observations and an explicit “Nudge noticed → So right now” causal bridge to a dominant recommendation. Relevant sample Circle support appears before Start inside the action. The latest [context, Recharge and reflection update](CONTEXT_RECHARGE_REFLECTION.md) puts weekly moments and intentional time first, followed by Move / Recharge totals, a weekly mosaic, activity types and supported learning. Spotify is an optional, explicitly simulated music-action enabler; recent heart rate is labelled context and never an inference about mental state. Why this fits reveals the reasoning. Unknown inputs stay unknown. Setup is brief, and a sample day makes the product's core interactions immediately available.

The long-term behaviour model learns what works, when and where it works, feasible duration, useful behavioural techniques, social response, and when to stay quiet. Show observations supported by actual stored choices. Label simulated context and example history; avoid presenting a sparse record as a proven personal pattern.

Exclude large health dashboards, calorie or hydration tracking, workout programmes, sleep scores, clinical assessment, AI chatbots, content libraries, public social feeds, competitive gamification, and points economies. Every feature must improve the probability of a useful real-world action.

## Success and prototype boundaries

The North Star is **helpful actions completed per active user per week**. Supporting measures include acceptance, completion, easier-option uptake, suggestion appropriateness, fatigue, repeated behaviour, and cooperative social uplift. App time, screen views, and notification opens are not the objective.

The rebuilt local prototype uses a transparent rules engine, separate demo/personal localStorage, varied movement snacks and personal recharge activities, persistent preferences and distinct responses, guided timers, self-reported completion, a clearly labelled sample-only demo completion shortcut, optional neutral feedback, per-action local sharing and derived learning observations. Existing personal busy times are preserved as context inputs. Sample time, inactivity, Circle activity, and example actions are labeled simulations. Notifications support a contextual browser-permission flow and an immediate local preview; background delivery is not connected. No personal context is sent to a Circle or uploaded. The user has now explicitly authorised public GitHub hosting of the prototype source and app; personal preferences and history remain browser-local.

Future calendar, movement, health/wearable, location, environmental, and background notification integrations require purposeful permissions and honest verification. They should strengthen the existing loop. Longer Recharge planning and observed habit support can follow evidence that the core intervention engine helps people act.

## Personalisation and setting refinement

Today makes selected Recharge activities visible when they fit the available opening. Music uses a whole song and optional Spotify deep link; no one-minute music Recharge is generated. Instruments and screen activities need appropriate time, with a full movie limited to a sufficiently long opening or an explicitly declared 90-minute choice. Indoor/outdoor/either is a saved, optional context input that filters activities immediately. Music, conversation, reading and quiet pauses may travel with the person. The sample calendar has a richer day of commitments and openings visible directly on Today, with one shared schedule providing current opportunities and the expanded timeline. Existing personal interests, health context, busy times and history survive updates.
