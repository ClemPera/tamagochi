# Test round 1 — findings log

## Copy/guardrail auditor (fix-13) — PASS, no action
- Zero digits/percentages/bars/XP/streaks in UI; zero forbidden words in UI+source.
- No guilt/corpse-shaming/push; farewell absolves; break note sends user away well.
- Two borderline notes, compliant: hold-progress fills are momentary ritual affordances;
  stage label is categorical ("baby"), excursion cap expressed in prose.

## Impatient newcomer (fix-8) — 1 blocker, 5 annoyances, 3 nits
- BLOCKER: keyboard users cannot complete onboarding hold (#commit pointer-only);
  same root makes Breathe keyboard-inoperable.
- Newborn greets scowling + "quieter today" warning while toast says welcome
  (first impression: "I already did something wrong").
- Ritual taps during busy vanish silently; zero post-hatch guidance until +3min;
  tapping sleeping creature = silence; toast covers action buttons.
- Nits: tab title leaks default name pre-naming; feed copy/behavior mismatch;
  hold-cancel hint cold.
- Passed: pointer-proof onboarding, wrong-drag guidance, persistence, toggles.

## Devoted caregiver (fix-10) — 3 critical, 3 high, 1 medium
- CRITICAL: healthWord reads legacy stats.health, v2 stores top-level -> always
  tender, sick renders as critical (app.js:88-96, warnStage:113-121).
- CRITICAL: excursion gift flow unreachable in UI (engine exports never called,
  no button, tick never emits).
- CRITICAL: decay ~2x spec; 3x/day single-feed starves; excursion threshold
  unreachable from day 2.
- HIGH: growth never stalls on neglect (gates ignore needs).
- HIGH: onboarding chill demo cannot finish medicine (engine sick=false).
- HIGH: medicine needs heart>=25 but copy says food+rest.
- MEDIUM: trajectory unfelt in status line.
- Pass: mood/trust split, mortality ladder + newborn guard, words-never-numbers,
  immediate payoffs, kind returns, night/tuck engine.

## Mobile touch (fix-11) — PASS, 1 low + 1 info
- All touch flows pass (3s hold, snack drag, aimed taps, 5s breathe, layout).
- Low: toast overlaps Tuck/Night/Quiet buttons while visible (same as newcomer #6).
- Info: commit hint text not reset after successful hold (invisible in practice).

## Keyboard/access (fix-12) — 2 blockers, 2 major, 2 minor, 1 trivia
- BLOCKER: onboarding hold + Breathe hold pointer-only (app.js:299-306, :868-872).
- MAJOR: Play traps keyboard users in ~20s busy lock (canvas tabIndex -1, no
  cancel); breathe ring ignores prefers-reduced-motion.
- MINOR: snackDrag focus ring weak; guide/health/breathe text not aria-live,
  canvas lacks role=img, toggles lack pressed-state.
- TRIVIA: stale commit hint after valid input.
- Works: tab order, focus-visible on natives, Feed/Sit/Tuck/Enter+Space, toast live.

## Absent returner (fix-9) — all low, grief core holds
- Low-medium: critical-state creature renders happy closed-eye smile (petGlow
  overrides sick eyes/mouth; permanent center gaze on fresh load saturates glow).
- Low: welcome-back note doubled punctuation + triple "nothing is spoiled"
  (story.join('; ') vs sentence-cased lines + hardcoded suffix).
- Low: break note wall-clock-only; engine never writes breakSuggested.
- Pass: sized offline stories, 12h cap (absence alone cannot kill), full ladder
  ~12-69h with warnings gate, newborn protected, staged farewell, no shaming,
  no auto-reset, exact rebirth inheritance, single-session safe.

## Feel review round 2 (des-5) — 12 findings
1. Toast still covers action buttons (bottom:208px lands mid-grid).
2. Sit close = copy only, no visible nuzzle.
3. Emoji cookie clashes + gets stranded on head; needs painted snack + snap-back.
4. Pink square glow on cookie reads as bug; use radial glow.
5. Play guide = wall of text pushing layout, goes stale; needs overlay + miss ripple + give-up.
6. Day stage = white void; needs habitat whisper, bigger creature ratio, better nest.
7. Status line never echoes last ritual.
8. Tuck best ritual; stale UI while tucked (hide panel to Wake only).
9. Button monotony + orphaned Tuck cell; suggest next ritual, separate settings row.
10. Header nits: "· baby" pill, status/rhythm blur.
11. Onboarding text-only; show egg cracking with hold.
12. Night mode = visual peak, protect it.
Plus: wander is glide-only (needs hop/squash/blink), breathe overlay could be warmer.

## Attachment review round 2 (ora-2) — verdict: tugs, but pet has no memory voice
- Cure arc, return rush, farewell all land emotionally. Top-10: most rules land;
  secure-base + reliance tripwire are theater; excursion UI partial; play hard
  to complete; return-note punctuation bug persists; toast overlap persists.
- Headline spec for round 2: REMEMBERED-OWNER GREETINGS — persist lastNursedDay,
  lastGiftDay, breakfastStreak; getGreeting references shared history before
  need-lines (~30 lines, no new UI/meters).

## Regression round (fix-18 newcomer/keys) — 12/12 FIXED + 1 wart
- All keyboard/onboarding/newborn/toast/aria/feed-copy items pass live.
- Wart for round 3: cancelled Play (Escape/Give-up) still pays the "lights up"
  success toast ~1s later — cancel must not pay.

## Regression feel (des-7) — 10/12 pass, 1 partial, 1 fail
- Pass: toast dock, sit nuzzle, snack art, no pink box, habitat, echo,
  tuck-quiet, hierarchy, header pill, egg, night, wander charm, breathe warmth.
- FAIL: Give-up button dead to pointer (inside pointer-events:none overlay).
- Partial: miss dot tiny; no crumb-puff garnish; snack home overlaps creature.
- Confirmed wart: cancelled/give-up Play still pays full reward.

## Regression systems (fix-19) — 10/10 PASS
- Thriving never tender, excursion reachable, 3x/day sustains (minBelly 69),
  growth stalls when sick/bottomed, chill demo end-to-end, medicine names
  need, trajectory/echo live, memory voice once + downgrades, welcome-back
  clean, ladder + newborn guard + rebirth intact.

## Round 3 list (small)
1. Give-up button dead to pointer (overlay pointer-events:none).
2. Cancelled Give-up/Escape Play must not pay the success reward.
3. Polish: bigger miss ripple, crumb-puff garnish, snack home off the face.

## Cold-start playtest (fix-26) — stranger, no docs, 60s verdict
- Onboarding readable in 10s, hatches ~17s by cues alone. Cute, responsive.
- Friction: disabled hold button silent on click; promise threshold guesswork;
  quick-click on enabled commit does nothing (non-reader stuck, no press feedback).
- "Read the glance" copy references an unseen mechanic.
- Hide-and-find confusing: friend never hides, taps feel random, completes by accident.
- Game locks all buttons unexplained; "Sit close — always" not always.
- "EVERYONE WHO CAME BEFORE — No one yet" ominous, unexplained.
- Status-line away-explainer would not open via click/Enter/Space (needs check).
- Nothing in 5 min says it can die or invites return tomorrow.

## Longitudinal verdict B (ora-4) — PULL, not maintenance
- 3x/day rhythm holds; spark oscillates soft/sleepy, never binds; lapse forgiven;
  trajectory readable days ahead; anniversaries land as story.
- Top-10 all land in sustained play; weak: initiative/ambient invisible to
  short-visit players.
- Highest-leverage month-2 change: attach one pending want/gift to returnNote
  after 180min+ absence (max 1/day) — casuals currently never trigger
  initiative (3min-open gate) so bond is care-only.
- Secondary: cap "rushed over" diary repeats (3 identical lines/day).

## Ambient dream beat (vambient6) — VERIFIED live
- Chill demo treated end-to-end (sit/feed/breathe/tuck/wake/feed/medicine),
  pet tucked, dream diary fired on first check after tuck. Chain works.
- Earlier "missing beats" explained: guided demo legitimately blocks ambient
  while sick/untreated; deferral fix keeps beats retrying instead of skipping.
