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
