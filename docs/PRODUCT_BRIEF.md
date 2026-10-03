BUILD A COMPLETE, POLISHED MOBILE-FIRST WELLNESS APP CALLED “MOSAIC”

You are building the final submission for a product-builder challenge.

Do not treat this as a generic dashboard project.

Do not add random wellness features.

Do not turn it into a Fitbit clone, meditation library, social network, calendar app, workout app, AI chatbot, or productivity tool.

The product concept, UX philosophy, interactions, visual hierarchy, feature scope, and demo story below are intentional. Follow them closely.

==================================================
1. PRODUCT IDEA
==================================================

Mosaic is a context-aware behaviour intervention app.

Its purpose is:

“Small actions for your body and mind, fitted around your actual day.”

The deeper product philosophy is:

“Don’t just show me my health. Help me do something about it.”

Most wellness apps track health and show users what already happened:

- steps
- sleep
- inactivity
- stress
- missed goals

Mosaic uses those signals as INPUTS.

Its actual OUTPUT is a small action the user can realistically take right now.

Example:

The user:
- slept 5h 42m
- has only 2,180 steps
- has been sitting for 86 minutes
- has had 3 meetings
- has 14 minutes before the next meeting

Mosaic should not show a giant analytics dashboard.

Instead it interprets this:

“Movement has been light and your afternoon has been packed.”

Then recommends:

“2-minute energiser?”

The app should feel like it understands the user’s real life.

==================================================
2. CORE PRODUCT LOOP
==================================================

Everything in Mosaic follows:

UNDERSTAND
→ INTERPRET
→ FIND A MOMENT
→ ACT
→ FEEL
→ LEARN
→ ADAPT

UNDERSTAND:
Use contextual signals.

INTERPRET:
Determine what may benefit from attention.

FIND A MOMENT:
Decide whether now is actually an appropriate time.

ACT:
Offer one small, manageable action.

FEEL:
Optionally ask how the user feels afterwards.

LEARN:
Record what happened.

ADAPT:
Change future suggestions accordingly.

The product’s success metric is actions completed outside the app.

Do not optimise the experience around screen time.

==================================================
3. SCIENTIFIC / BEHAVIOURAL FOUNDATION
==================================================

The product is informed by:

A. JUST-IN-TIME ADAPTIVE INTERVENTIONS (JITAI)

Every intervention should conceptually consider:

1. NEED
Does the user appear to need movement or recharge?

2. OPPORTUNITY
Is there actually enough time and appropriate context?

3. RECEPTIVITY
Is the user likely to respond positively now?

Sometimes Mosaic should deliberately do nothing.

That is a feature.

B. BEHAVIOUR CHANGE TECHNIQUES

Use these implicitly within features:

- prompts / cues
- graded tasks
- action planning
- self-monitoring
- feedback
- reinforcement
- social support
- social modelling
- habit formation
- focus on past success

Do NOT display academic terminology to users.

The science should exist underneath the UX.

==================================================
4. PRODUCT SCOPE
==================================================

The app has TWO wellbeing families only:

1. MOVE
2. RECHARGE

MOVE = small physical behaviours.

RECHARGE = small restorative behaviours for mental wellbeing.

Do not add Food as a full domain.

Do not add sleep as a full domain.

Sleep and steps are contextual signals.

==================================================
5. MOVE MUST NOT MEAN “WALKING APP”
==================================================

Mosaic should offer a varied movement library.

Create the following movement categories:

WALK
- 3-minute walk
- 5-minute outdoor walk
- quick lap around building
- walk while calling someone

MOBILITY
- shoulder rolls
- neck / upper-back mobility
- standing stretch
- hip mobility
- wrist / forearm reset
- simple desk mobility sequence

ENERGISE
- march in place
- short movement burst
- move to one song
- stairs
- jumping jacks where appropriate

STRENGTH MICRO-ACTIONS
- bodyweight squats
- wall push-ups
- calf raises
- sit-to-stand repetitions

OUTDOOR MOVEMENT
- step outside
- walk around the block
- take the stairs downstairs
- get sunlight
- stand outside briefly

Do not turn these into workouts.

They are movement snacks.

==================================================
6. RECHARGE LIBRARY
==================================================

Recharge should reflect what actually restores the user.

Create categories:

QUIET
- breathing
- screen-free pause
- stillness
- mindfulness

CONNECTION
- talking to a friend
- messaging someone
- coffee with someone
- calling someone

CREATIVE
- playing musical instruments
- drawing
- writing
- photography
- creative hobbies

ENTERTAINMENT / ENJOYMENT
- listen to music
- reading
- watch something
- gaming

OUTDOORS
- sit outside
- slow walk
- get fresh air

The key principle:

Mosaic does NOT assume that meditation is everybody’s solution.

If someone prefers music, friends, guitar, reading, gaming, or going outside, use those.

==================================================
7. INFORMATION ARCHITECTURE
==================================================

Use exactly THREE bottom navigation destinations:

TODAY
RHYTHM
YOU

Do NOT create separate tabs for:

- Move
- Recharge
- Calendar
- Social
- Health data
- Insights

Focused action sessions open as full-screen or modal experiences.

==================================================
8. TAB 1 — TODAY
==================================================

Today is the most important screen.

It must communicate the whole product in seconds.

The user should understand:

1. Mosaic knows something about my day.
2. Mosaic understands what that might mean.
3. Mosaic has found a realistic moment.
4. Mosaic is giving me one small action.
5. I have control.
6. Social support exists but is not competitive.

------------------------------------------
TODAY SCREEN STRUCTURE
------------------------------------------

TOP

Logo / Mosaic wordmark.

Greeting:

“Good afternoon, Yuvraj”

Small subtle profile/settings access optional.

------------------------------------------
SECTION: YOUR DAY SO FAR
------------------------------------------

Show compact contextual chips.

Example:

🌙 5h 42m sleep
👟 2.1k steps
🪑 86m sitting
📅 3 meetings

These MUST be visibly contextual information.

Do not create giant graphs.

Do not create scores.

Do not create rings.

Do not create a “wellness score”.

The purpose is to make it obvious that Mosaic understands real health and schedule context.

Unknown data must stay unknown.

In demo mode, clearly label sample/demo data where necessary.

------------------------------------------
SECTION: BODY / MIND INTERPRETATION
------------------------------------------

Use two compact cards or two small sections.

BODY

Example:

“Could use a little movement”

Supporting line:

“Movement has been light today.”

Optional contextual line:

“2.1k steps · 86m sitting”

MIND

Example:

“Packed afternoon”

Supporting line:

“Three meetings since lunch.”

Or:

“You said you’re feeling tired.”

Do not use mental-health diagnoses.

Do not assign body or mind scores.

These are contextual observations.

------------------------------------------
SECTION: MAIN RECOMMENDATION
------------------------------------------

This is the dominant element on the screen.

Example:

small eyebrow:
“14 MINUTES OPEN”

headline:
“Move for 2?”

description:
“A short indoor energiser fits before your next meeting.”

Show action preview:

30 sec shoulder rolls
30 sec mobility
60 sec brisk movement

PRIMARY BUTTON:
“Start”

SECONDARY:
“Make it easier”

TERTIARY:
“Swap activity”

SMALL TEXT:
“Not now”

Another example:

“5 minutes outside?”

“A little movement may help after three back-to-back meetings.”

Another example:

“You’ve finally got some room.”

“You said music helps you switch off.”

“Take one song to yourself?”

The card must explain WHY the action fits.

Add a small expandable link:

“Why this fits”

When opened, show something like:

- movement has been light
- 86 minutes sitting
- 14 minutes before next meeting
- short movement has worked well for you before

This is important.

Mosaic must visibly interpret context, not magically produce suggestions.

------------------------------------------
SOCIAL CUE INSIDE MAIN ACTION
------------------------------------------

Social support should appear naturally inside or immediately beneath the recommendation.

Example:

small avatar cluster

“Jay, Maya + 2 moved today”

or:

“Jay and Vijay took a reset this morning.”

or:

“3 people in your Circle made time to recharge today.”

DO NOT show:

- rankings
- steps comparison
- leaderboards
- percentages against friends
- public health scores
- shame-based messaging

The social philosophy is:

“Come with us.”

NOT:

“Look how much better everyone else is.”

------------------------------------------
SECTION: I NEED SOMETHING NOW
------------------------------------------

Mosaic should remain useful when users open it deliberately.

Add:

“I need something now”

Buttons:

“Move”
“Recharge”

If Move tapped:

Ask:

“How much time do you have?”

1–2 min
5 min
10+ min

Then recommend one activity based on preferences.

If Recharge tapped:

Same idea.

Do not expose a giant activity library immediately.

==================================================
9. MAKE IT EASIER
==================================================

This is one of Mosaic’s signature interactions.

If Mosaic says:

“5-minute walk?”

and user taps:

“Make it easier”

DO NOT navigate away.

Animate the recommendation card into a smaller version.

Example:

“Let’s make it tiny.”

“90-second movement break?”

- stand
- shoulder roll
- stretch
- back to your day

Button:

“I can do that”

Secondary:

“Skip”

Only allow ONE fallback.

Do not endlessly negotiate.

Mosaic must learn from this.

Example interpretation:

The user did not reject movement.
The user rejected the effort level.

This behaviour should be stored separately.

==================================================
10. SWAP ACTIVITY
==================================================

This is different from “Make it easier”.

When user taps:

“Swap activity”

Open a bottom sheet:

“What would fit better?”

Options:

“Stay indoors”
“Something quieter”
“Something more active”
“Only have 2 minutes”
“Something else”

Example:

Primary:
5-minute outdoor walk

User taps:
Stay indoors

Mosaic swaps to:
2-minute mobility sequence

Example:

Primary:
slow stretch

User taps:
Something more active

Mosaic swaps to:
60-second energiser

This visually demonstrates adaptation.

==================================================
11. RESPONSE TYPES
==================================================

Do not model every response as yes/no.

Internally distinguish:

accepted
fallback_requested
fallback_accepted
swapped
declined
ignored
already_done
completed
abandoned

These mean different things.

This should affect what Mosaic learns.

==================================================
12. FOCUSED ACTION EXPERIENCE
==================================================

When a user starts an activity, open a focused full-screen experience.

Remove distractions.

Example:

“2-minute energiser”

Large timer:
2:00

Step 1:
Shoulder rolls — 30 sec

Step 2:
Standing mobility — 30 sec

Step 3:
Brisk march — 60 sec

Buttons:

“Done early”
“End”

For Recharge:

Example:

“Take one song”

Instruction:

“Put on something you love.
No scrolling. No work.
Just listen.”

Timer:
4:00

For “Talking to a friend”:

“Take five minutes to call or message someone you actually want to hear from.”

Do not attempt invasive verification.

Manual completion is fine.

==================================================
13. COMPLETION EXPERIENCE
==================================================

This MUST be strong.

Do not end with vague copy like:

“Three moments protected.”

Show exactly what happened.

Example:

“You moved for 2 minutes.”

Then:

“How does your body feel?”

Options:

“Looser”
“About the same”
“More tired”

Optional.

For Recharge:

“You took 10 minutes to play music.”

Question:

“How’s your headspace?”

“Lighter”
“About the same”
“Not better”

Optional.

Then show Mosaic’s learning when appropriate.

Example:

“Got it.”

“We’ll keep afternoon movement shorter next time.”

Or:

“Short indoor movement seems to work well on meeting-heavy afternoons.”

Or:

“Music seems to work well for you in the evening.”

Button:

“Back to my day”

The completion screen must demonstrate:

ACT → FEEDBACK → LEARN.

==================================================
14. TODAY AFTER COMPLETION
==================================================

Today should update after an action.

Example small section:

“Today”

✓ 2-minute mobility
✓ Took time for music

Do not over-gamify.

Do not show XP.

Do not show coins.

Do not show giant streaks.

==================================================
15. “DO NOTHING” STATE
==================================================

Mosaic must sometimes deliberately NOT intervene.

Example:

User currently in a meeting.

Today screen:

“Nothing from us right now.”

“You’re in the middle of something.”

“We’ll look for a better moment.”

Optional:

“Next open window around 4:10 PM”

This is important.

It demonstrates that Mosaic respects attention.

In DEMO MODE, this state should be intentionally selectable.

However:

The default sample-day opening should NEVER accidentally start here.

==================================================
16. SOCIAL — YOUR CIRCLE
==================================================

Social must exist clearly but lightly.

Do not build a social network.

A Circle is 3–8 close people.

Social appears in THREE places.

------------------------------------------
A. Inside interventions
------------------------------------------

Example:

“Jay and Maya moved today.”

“Join them with a five-minute movement break?”

------------------------------------------
B. Small Circle Pulse on Today
------------------------------------------

Below main recommendation:

YOUR CIRCLE

avatar row

“3 people moved today”

“Maya made time for music · Jay took a walk”

button:
“See activity”

------------------------------------------
C. After completion
------------------------------------------

Ask:

“Share with Circle?”

Preview exactly what friends will see:

“Yuvraj took a movement break ✓”

Buttons:

“Share”
“Keep private”

Never share:

- sleep
- stress
- calendar
- why Mosaic intervened
- private health data

unless explicitly chosen.

==================================================
17. CIRCLE ACTIVITY SHEET
==================================================

If user taps “See activity”:

Open bottom sheet.

Header:

“Today in your Circle”

Entries:

Jay
“5-minute walk” ✓

Maya
“Outside break” ✓

Vijay
“Played music for a bit” ✓

Possible reactions:

👏
❤️
“Join”

No:

comments
threads
followers
leaderboards
step rankings
competition

==================================================
18. TAB 2 — RHYTHM
==================================================

Rhythm is NOT a calendar app.

Do not recreate Google Calendar.

Rhythm shows behavioural patterns.

Header:

“Your rhythm”

Subtext:

“What Mosaic is learning about your days.”

------------------------------------------
WEEK OVERVIEW
------------------------------------------

Example:

“This week”

6 Move moments
4 Recharge moments

Show a simple seven-day visual.

Do not use scores.

Possible visual:

Mon
Move ••
Recharge •

Tue
Move •

Wed
Recharge ••

etc.

------------------------------------------
WHAT MOSAIC IS LEARNING
------------------------------------------

Cards:

“Short movement works in your afternoons”

“You completed 4 of 5 movement suggestions under five minutes.”

“Music works well in the evening”

“You’ve chosen it three times after busy days.”

“Friday mornings aren’t a good prompt window”

“Mosaic has started leaving them alone.”

This screen must show the product moat:

Mosaic learns when and how the user acts.

------------------------------------------
DAY DETAIL
------------------------------------------

If user taps a day:

Example:

Tuesday

Context:

🌙 6h 10m sleep
👟 5.4k steps
📅 4 meetings

Actions:

2:30 PM
3-minute mobility ✓

7:10 PM
Played musical instruments ✓

Optional contextual insight:

“Mosaic skipped two possible prompts during meetings.”

Again:

Calendar information = context.

NOT calendar UI.

==================================================
19. GOOGLE CALENDAR INTEGRATION CONCEPT
==================================================

For the prototype, do not build a full calendar product.

Calendar should feed intelligence into the app.

Examples:

“Three meetings down. Your body could use a change of scene.”

“You’ve got 18 minutes before the next thing.”

“Back-to-back morning. Take a breather?”

“Long class block ahead. Move for two minutes first?”

The app should interpret:

- meeting density
- free windows
- back-to-back commitments
- quiet periods
- next event timing

Do not expose raw event details unless useful.

Do not show a permanent agenda screen.

==================================================
20. HEALTH DATA
==================================================

Mosaic is not primarily a tracker.

But the prototype MUST visibly show that it can use tracking data.

Use:

- sleep duration
- step count
- sitting / inactivity duration
- recent activity
- optional energy/mood

For the demo, use sample seeded data.

Show these lightly on Today.

Use them again in Rhythm when explaining patterns.

Do NOT create:

- sleep charts
- step rings
- calorie charts
- heart-rate dashboards
- readiness score
- health score

The principle:

TRACK → INTERPRET → ACT.

Not:

TRACK → DISPLAY MORE TRACKING.

==================================================
21. TAB 3 — YOU
==================================================

Header:

“You”

Sections:

------------------------------------------
WHAT HELPS YOU MOVE
------------------------------------------

Selectable / editable preferences:

Walking
Stretching / mobility
Short active bursts
Stairs
Moving to music
Outdoor movement
Strength micro-actions

------------------------------------------
WHAT HELPS YOU RECHARGE
------------------------------------------

Music
Talking to a friend
Playing musical instruments
Reading
Watching something
Gaming
Creative hobbies
Going outside
Quiet / mindfulness

Use these exact vocabulary choices.

Do NOT use:

“Guitar”

Use:

“Playing musical instruments”

Do NOT use:

“Calling someone”

Use:

“Talking to a friend”

Combine Hobbies and Creative Time into:

“Creative hobbies”

with specific interests underneath if needed.

------------------------------------------
YOUR CIRCLE
------------------------------------------

Show:

Jay
Maya
Vijay

Button:

“Manage Circle”

------------------------------------------
CONNECTIONS
------------------------------------------

Google Calendar
Health Data

Use status:

Connected / Demo

Explain:

Calendar:
“Helps Mosaic find real openings between meetings and classes.”

Health:
“Helps Mosaic understand things like sleep, steps and movement.”

------------------------------------------
NOTIFICATIONS
------------------------------------------

Intervention intensity:

Light
Balanced
Active

Quiet hours.

Pause Mosaic.

------------------------------------------
PRIVACY
------------------------------------------

Simple controls.

Explain:

“Your health context stays private.”

“Circle members see only the actions you choose to share.”

==================================================
22. ONBOARDING
==================================================

Keep onboarding short.

Maximum four screens.

------------------------------------------
SCREEN 1
------------------------------------------

Logo.

Headline:

“Care for your body.
Make room for your mind.”

Subtext:

“Mosaic finds small ways to feel better at moments that actually fit your life.”

Primary:

“Get started”

Secondary:

“Try a sample day”

IMPORTANT:

“Try a sample day” should instantly seed a complete demo profile and take evaluator into Today.

------------------------------------------
SCREEN 2
------------------------------------------

Headline:

“What do you want more space for?”

Options:

Move regularly
Break up sitting
Feel more physically awake
Unwind
Make time for things I enjoy
Stay connected

Multi-select.

------------------------------------------
SCREEN 3
------------------------------------------

Headline:

“What actually works for you?”

Section:

MOVEMENT YOU DON’T MIND

Walking
Stretching / mobility
Short active bursts
Stairs
Moving to music
Outdoor movement

Section:

WHAT HELPS YOU RECHARGE

Music
Talking to a friend
Playing musical instruments
Reading
Watching something
Gaming
Creative hobbies
Going outside
Quiet / mindfulness

------------------------------------------
SCREEN 4
------------------------------------------

Headline:

“Make Mosaic smarter”

Cards:

GOOGLE CALENDAR

“Helps Mosaic spot real openings between meetings and classes.”

Button:
“Connect”

Secondary:
“Later”

HEALTH DATA

“Helps Mosaic understand sleep, steps and movement.”

Button:
“Connect”

Secondary:
“Later”

For this challenge prototype, connection can be simulated.

Do not request real browser/system permissions unless implementation is safe and stable.

Then:

“Start my day”

==================================================
23. SAMPLE DAY MODE
==================================================

THIS IS ESSENTIAL.

The company evaluator cannot wait hours for context.

Add demo/sample mode.

When selected, reset state to a deterministic sample persona.

Sample user:

Name:
Yuvraj

Recharge preferences:
Music
Outside
Talking to friends
Playing musical instruments

Movement preferences:
Mobility
Outdoor movement
Short active bursts

Circle:
Jay
Maya
Vijay

Health:

Sleep:
5h 42m

Steps:
2,180

Sitting:
86 min

Mood:
Tired

Calendar context:

3 meetings completed
14-minute free window now
next meeting at 3:00 PM

Seed Circle activity:

Jay:
5-minute walk

Maya:
outside break

Vijay:
played music

==================================================
24. DEMO CONTROLS
==================================================

Add a subtle “Demo” pill.

Tap it to open:

“Preview a moment”

Options:

Packed afternoon
Quick movement opportunity
Busy / no intervention
Evening recharge
Social prompt

Switching scenarios updates Today.

This allows the evaluator to experience the full product in two minutes.

Add:

“Reset sample day”

This must always restore clean seeded state.

==================================================
25. MAIN DEMO STORY
==================================================

The intended company demo should work in this exact sequence.

SCENE 1 — OPEN

Evaluator sees:

🌙 sleep
👟 steps
🪑 inactivity
📅 meeting density

Body:

“Could use a little movement.”

Mind:

“Packed afternoon.”

Mosaic recommendation:

“14 minutes open”

“2-minute energiser?”

Social cue:

“Jay, Maya + 2 moved today.”

Evaluator understands:

Mosaic knows my day.

------------------------------------------
SCENE 2 — ADAPTATION
------------------------------------------

Evaluator taps:

“Make it easier”

Mosaic changes:

“Let’s make it tiny.”

“90-second movement break?”

Evaluator understands:

Mosaic adapts effort.

------------------------------------------
SCENE 3 — ACT
------------------------------------------

Evaluator starts activity.

Timer / guided mini sequence.

------------------------------------------
SCENE 4 — FEEDBACK
------------------------------------------

Completion:

“You moved for 90 seconds.”

“How does your body feel?”

Evaluator:
“Looser”

Mosaic:

“Got it.”

“We’ll keep meeting-day movement short.”

Evaluator understands:

Mosaic learns.

------------------------------------------
SCENE 5 — EVENING
------------------------------------------

Switch demo scenario.

Now:

“Your evening is finally clear.”

“You said playing music helps you switch off.”

Social:

“Jay and Vijay made time to recharge today.”

Recommendation:

“Make 10 minutes for an instrument?”

Evaluator understands:

Mental wellness is personalized.

------------------------------------------
SCENE 6 — RHYTHM
------------------------------------------

Open Rhythm.

Show:

movement completion
recharge completion
Mosaic learning

Example:

“Short physical breaks work for you on busy afternoons.”

“Creative recharge works better in your evenings.”

That is the payoff.

==================================================
26. SMART EXAMPLE INTERVENTIONS
==================================================

Implement multiple realistic examples.

LOW MOVEMENT + FREE GAP

“Your body hasn’t moved much yet.”

“Two minutes of mobility before your next call?”

------------------------------------------

THREE MEETINGS

“Three meetings down.”

“Get away from the screen for five?”

Options:

Outside
Indoor movement

------------------------------------------

VERY SHORT GAP

“Tiny window. Tiny reset.”

“60 seconds of movement?”

------------------------------------------

POOR SLEEP

“Short night. Keep it gentle.”

“A two-minute stretch instead of something intense?”

Do not diagnose recovery.

------------------------------------------

USER MARKED TIRED

“Low energy?”

Buttons:

“Wake me up”
“Help me unwind”

------------------------------------------

EVENING RECHARGE

“You’ve finally got some room.”

“You said music helps you switch off.”

“Put on one song and do nothing else?”

------------------------------------------

SOCIAL

“Jay, Maya + 1 moved today.”

“You’ve got 15 minutes too.”

“Join them with a five-minute movement break?”

==================================================
27. MOOD / ENERGY INPUT
==================================================

Keep this optional and lightweight.

On Today show:

“How are you feeling?”

Options:

Good
Fine
Tired
Stressed
Overwhelmed

Use icons or emoji subtly.

This is contextual data.

Do NOT diagnose the user.

==================================================
28. INTERNAL DECISION ENGINE
==================================================

Do not use machine learning.

Use a transparent rules engine.

Inputs:

currentTime
sleep
steps
sittingDuration
meetingDensity
freeWindowMinutes
mood
rechargePreferences
movementPreferences
interventionHistory
recentRejections
recentCompletions
circleActivity
dailyPromptCount

Conceptually calculate:

needScore
opportunityScore
receptivityScore
preferenceFit
socialSupportBonus
interventionFatigue

Example:

actionScore =
needScore
+ opportunityScore
+ preferenceFit
+ historicalAcceptance
+ socialSupportBonus
- interventionFatigue

If receptivity below threshold:

NO INTERVENTION.

==================================================
29. SAMPLE RULES
==================================================

If:

sitting > 60 minutes
AND freeWindow >= 5
AND no recent movement

prioritise Move.

If:

meetingCount >= 3
AND freeWindow >= 3

prioritise screen/outdoor/mobility break.

If:

sleep < 6 hours

prefer gentle movement over intense movement.

If:

mood == tired

offer:
Wake me up
OR
Help me unwind

If:

evening
AND freeWindow >= 10
AND rechargePreference available

prioritise Recharge.

If:

recent prompt rejected
OR dailyPromptCount high

reduce intervention probability.

If:

currently in meeting

do not intervene.

==================================================
30. LEARNING LOGIC
==================================================

Store locally.

Examples:

If user frequently requests smaller version:

reduce future default duration.

If user frequently swaps walks for indoor mobility:

increase indoor mobility preference.

If user completes music-based Recharge:

increase its relevance.

If user consistently rejects morning prompts:

reduce morning interventions.

If social cues are associated with action acceptance:

use them more often.

Keep behaviour understandable and deterministic.

==================================================
31. DATA MODEL
==================================================

Implement clean TypeScript interfaces.

Suggested:

UserProfile {
  name
  goals
  movementPreferences
  rechargePreferences
  mood
  interventionIntensity
  quietHours
  integrations
  circle
}

HealthContext {
  sleepMinutes
  steps
  sittingMinutes
  recentActivity
}

ScheduleContext {
  meetingsToday
  freeWindowMinutes
  nextEventTime
  currentlyBusy
}

Intervention {
  id
  family
  category
  title
  explanation
  duration
  minimumWindow
  intensity
  fallbackId
  bcts
  socialEligible
}

InterventionResponse {
  interventionId
  timestamp
  responseType
  completion
  postActionFeedback
}

LearningInsight {
  type
  title
  explanation
}

==================================================
32. TECH STACK
==================================================

Build as a polished mobile-first responsive web app / PWA.

Preferred:

Next.js
React
TypeScript
Tailwind CSS
Framer Motion
Lucide icons
localStorage

No backend required.

No authentication required.

No database required.

Everything should work locally in the browser.

Make deployment easy on Vercel.

==================================================
33. MOBILE-FIRST DESIGN
==================================================

Primary target viewport:

390 × 844

It must feel like a real native mobile product.

On desktop:

center the mobile content in a max-width container.

Do not place it inside a fake iPhone frame.

==================================================
34. VISUAL IDENTITY
==================================================

The app should feel:

calm
warm
premium
intelligent
human
non-clinical
non-judgmental
adult

Avoid:

generic SaaS
neon gradients
glassmorphism
AI glowing orb
heavy gamification
hospital aesthetics
meditation cliché visuals

Visual inspiration:

premium editorial wellness product.

==================================================
35. COLOURS
==================================================

Use a restrained palette.

Background:
#F7F6F1

Primary forest:
#173F35

Soft sage:
#E7EFEA

Mint accent:
#8ED8BD

Warm accent:
#F1C7A7

Primary text:
#17221F

Secondary text:
#66736E

Use distinct but restrained visual cues for Body and Mind.

Do not make them aggressively blue/pink.

==================================================
36. TYPOGRAPHY
==================================================

Use:

Manrope

Fallback:
Inter / system sans

Hierarchy approximately:

Hero action:
30–32px

Screen heading:
26px

Card heading:
19–21px

Body:
15–16px

Secondary:
13–14px

Micro labels:
11–12px

Use strong hierarchy and generous line-height.

==================================================
37. SPACING
==================================================

Use an 8px spacing system.

Mobile horizontal padding:
20px

Card padding:
20–24px

Card gap:
12–16px

Major vertical sections:
28–36px

Give the interface breathing room.

==================================================
38. CARDS
==================================================

Border radius:
20–24px

Use thin borders.

Use very light shadows only where useful.

Primary intervention card should visually dominate.

Other cards should remain quiet.

==================================================
39. BUTTONS
==================================================

Minimum height:
52px

Large tap targets.

Primary:
dark forest fill

Secondary:
soft sage / outline

Tertiary:
text only

Use specific labels.

Good:

Start
Make it easier
Swap activity
I can do that
Join them
Take 5
Not now

Bad:

Submit
OK
Yes

==================================================
40. ICONOGRAPHY
==================================================

Use Lucide icons consistently.

Do not use dozens of unrelated emoji.

Emoji may appear sparingly in emotional/contextual moments.

Prefer polished icons for:

sleep
steps
sitting
calendar
body
mind
movement
social
music
outdoors

==================================================
41. MOTION
==================================================

Use subtle motion.

Recommendation → fallback:

180–220ms fade / slight translate.

Action start:

250ms transition.

Completion:

subtle check animation.

No confetti.

No bouncing trophies.

No distracting gradients.

Respect:

prefers-reduced-motion.

==================================================
42. ACCESSIBILITY
==================================================

Implement properly.

- WCAG-friendly colour contrast
- semantic HTML
- labelled icon buttons
- keyboard navigation
- visible focus states
- minimum 44px touch targets
- reduced-motion support
- no meaning through colour alone
- responsive text
- screen-reader-friendly labels

==================================================
43. DO NOT ADD
==================================================

Do NOT build:

food logging
calorie tracking
water tracker
full sleep tracker
step goals
fitness rings
workout plans
AI chatbot
generic motivational quotes
content library
social feed
leaderboards
step competition
coins
XP
badges
punitive streaks
medical diagnosis
therapy
clinical mental-health screening
complex health scores
full calendar product
event marketplace
coach marketplace
subscriptions
paywall
account creation
30-question onboarding

==================================================
44. PERSISTENCE
==================================================

Use localStorage.

Persist:

onboarding
preferences
demo state
completed actions
intervention responses
post-action feedback
learning insights
Circle sharing
settings

Add:

Reset sample day

which resets only demo state.

==================================================
45. FINAL ACCEPTANCE CRITERIA
==================================================

The final app must clearly communicate within 30–60 seconds:

“Mosaic understands my actual day.”

“Mosaic cares about both physical and mental wellbeing.”

“Mosaic uses sleep, movement and schedule data intelligently.”

“Mosaic is not just a tracker.”

“Mosaic gives me an achievable action.”

“Mosaic adapts when the action does not fit.”

“Mosaic learns from what I do.”

“Mosaic uses friends supportively, not competitively.”

“Mosaic sometimes leaves me alone.”

The app must look polished enough to submit directly to a company.

No placeholder lorem ipsum.

No unfinished screens.

No broken interactions.

No fake buttons.

No dead navigation.

No random extra features.

All demo interactions should function.

The sample day must reset reliably.

The opening demo state must always communicate the product clearly.

==================================================
46. FINAL PRODUCT MESSAGE
==================================================

Use this as the conceptual north star:

“Mosaic quietly combines health signals, your schedule, your preferences and what it learns about you to find realistic moments for small physical and restorative actions.”

And this as the user-facing essence:

“Small actions for your body and mind, fitted around your actual day.”

Every design or implementation decision should reinforce this idea.

If a feature does not help the user:

UNDERSTAND → ACT → FEEL → ADAPT

do not add it.

==================================================
47. IMPLEMENTATION PRIORITY
==================================================

Build in this order:

1. Design system
2. Sample-day data model
3. Onboarding
4. Today screen
5. Context chips
6. Body/Mind interpretation
7. Main intervention engine
8. Make-it-easier interaction
9. Swap activity
10. Guided Move action
11. Guided Recharge action
12. Completion + feedback
13. Learning logic
14. Circle social cues
15. Rhythm screen
16. You screen
17. Demo scenario switcher
18. Reset demo
19. LocalStorage persistence
20. Mobile polish
21. Accessibility
22. Responsive desktop behaviour
23. Test every flow end-to-end

Before finishing, manually test:

Onboarding → Today → Start Move → Complete → feedback → Today update → Rhythm update.

Today → Make it easier → Complete → future recommendation changes.

Today → Swap activity → new action shown.

Today → Social cue → complete → share to Circle.

Demo → busy scenario → “Nothing from us right now.”

Demo → evening → personalized Recharge.

Reset sample day → original clean demo restored.

The final result must be usable, coherent, polished and submission-ready.