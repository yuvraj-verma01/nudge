# Nudge: context, music Recharge and weekly reflection

These October 3, 2026 product updates follow the user's latest brief. The app remains Nudge, with exactly Today, Rhythm and You. Health data supplies context; Spotify enables one kind of action; reflection explains what happened and what changes next.

## Spotify enables a break

You → Connections has an optional Spotify demo connection. No authentication, account access, playback verification or Spotify listening analytics are implemented. The connection and every content card explicitly say demo. Three sample sourcing modes are supported: Recently played, From your Chill playlist, and Based on what you listen to. These labels describe sample content, not actual listening history.

Sample tracks are Welcome To The Jungle by Guns N’ Roses, Say Yes To Heaven by Lana Del Rey, and Nikamma by Lifafa. Its public track link and artwork were verified against [Spotify](https://open.spotify.com/track/0G21yYKMZoHa30cYVi1iA8); artwork is stored locally for offline presentation. No audio is bundled. Open in Spotify is a deliberate external link. Taking a song starts Nudge's own focused break timer; it does not claim that playback began. Timers match the selected sample song: 4:33, 3:29 and 3:32, respectively. Source selection changes the sample artist while keeping one content card. Ordinary music Recharge also remains available without Spotify.

Demo → Evening music recharge supplies a 22-minute opportunity. A Music preference and the optional connection make the one-song action eligible. Busy time, pauses, quiet hours, fatigue and available duration still apply. Something else can choose a non-music alternative. A single easier option remains available; Not now stops.

Completion asks Helped / No different / Not for me. New music completions improve listening-action relevance; Helped increases it more, and Not for me reduces it across music listening actions. Instrument interests remain separate. Repeated swaps away reduce the original activity's weight. Repeated short completions favour short movement; repeated Circle-supported completions modestly favour relevant shared activities. These rules are deterministic and visible through actual saved choices.

## Heart rate is recent context

The optional health model stores recentHeartRate, heartRateTimestamp and heartRateSource. The sample is 76 bpm, twelve minutes before the simulated moment, sourced from Sample Health Data. Today shows the age and sample label. Disconnecting sample Health clears it; unconnected personal mode does not fabricate a reading. Older stored preferences, busy times, completions and responses remain intact.

Heart rate does not independently change recommendation selection or infer stress, anxiety, recovery, fatigue or disease. There are no heart-rate graphs, zones, scores or history pages.

## Reflection stays inside Rhythm

Rhythm now leads with this week's moments and intentional time, then Move / Recharge totals, seven-day tiles, activity types and Nudge is learning. Time is a reflection, never a target or grade. Early completion contributes actual recorded elapsed time; legacy self-reported records retain their stored duration. A short completion counts as one moment. No playback or entertainment-consumption stats are used.

Reset sample day seeds nine explicitly example moments totalling 47 minutes: five Move moments / 22 minutes and four Recharge moments / 25 minutes. It shows two Mobility, two Outdoors, two Music, one Talking to a friend, one Active movement and one Quiet break. These are illustrative past breaks, not constrained by today's suggested-action durations. Old saved history is preserved until an explicit sample reset.

Seed examples never influence personal learning. An expandable illustration explains possible future patterns; the actual learning cards use only newly recorded choices and completions. The sample-week label distinguishes example moments from new demo choices. Personal mode has no seeded history.
