# v3 Design — mortality you can read, presence you can feel, depth you can keep

Source: `research/core-loop.md`, `research/attachment-science.md` top-10 + §12 wolf, `research/test-round1.md` incl. round-3 list.
Current systems (read-only skim `site/engine.js`, `site/app.js`):
- Needs belly/heart/sleep as words via `statWord`; trust `distant/shy/fond/close/devoted` + mood `faint/tender/okay/bright/glowing` split; trust only rises, never decays.
- Mortality ladder `warnStage 0-3`; gated by newborn 7d + `warningsShown[2]&&[3]`; 12h offline cap; farewell 3 lines + memorial + `rebirth` keeps keepsakes/diary/lineage.
- Memory voice `getGreeting` with one-shot guards.
- Excursion once/day, midday auto.
- Rituals with completion-only payoff; `trajectory()` steady/recovering/slipping.
- Constraints for v3: vanilla JS, zero deps, words-never-numbers, no guilt, no FOMO, no dark patterns.

Non-negotiables (do not regress): trust never decays, newborn guard, warnings-shown gate, 12h offline cap, farewell flow + inheritance. Round-3 fixes stay: give-up pointer, cancel-no-pay.

---

## 1. VISIBLE MORTALITY — learn the endpoint without fear

Principle: trajectory must be readable in body + one sentence before any banner. No numbers, countdowns, threats, or "neglect/abandon/die" verbs.

### Posture ladder
- Thriving: normal wander, gaze follows cursor, trots to goals.
- Tender: pause longer between trots, eats slower, lonely-leaning mood.
- Unwell/sick: shiver (small x-jitter, not gasp — O'Neill guardrail), seeks nest, nest glows, refuses play/excursion with kind copy.
- Critical: axis droop, stays near nest, greeting rush-then-fade, sick mood.
- Add `trajectory` echo for all non-top states: `and a little weaker than yesterday` when slipping, `and mending softly` when recovering.

### Copy beats
1. Settled: `{N} feels settled and glad to be near you.`
2. Tender: `{N} is a little quieter today. Small meals and naps help most.`
3. Unwell: `{N} has a little chill and wants nearness. Warmth and patience will see it through.`
4. Critical: `{N} is very weak and staying near the nest. Staying close, with food and rest, matters most now. A quiet sit-together helps more than anything.`
5. Rally: `Stayed a while. Breathing a touch easier now.` / `{N} seems brighter after your time together.`
6. Farewell (keep verbatim): `{N} is very tired now.` → `Stay a moment. There is nowhere else to be.` → `Thank you for staying. They felt safe with you.` + memorial `Nothing you did wrong brought this — some lives are just short.`

### "What if I leave" — discoverable, never pushed
- Where: (a) tuck toast when tucked while well, (b) `healthText` expansion when tapping `statusLine` while well, (c) `returnNote` footer after any absence. No modal, no settings page.
- Copy (rotate, never all at once):
  - Tuck: `Curled up small. Short whiles only soften — the little home keeps warm.`
  - Ask: `Away a while? One missed day only pauses the story — no scolding, nothing spoiled. You would see quieter, then shivery, then very weak first, each with time to mend together.`
  - Return footer (append once per week max): `Even long whiles pause before any goodbye.`
- Rule: never name hours/days as countdown. Relative story words only.

### Escalating warnings (no silent slides)
- Every `warnStage` rise must emit all three: diary + toast/returnNote + posture change. Warnings gate stays on shown warnings, never on tick alone.
- Critical adds one-tap rally path (sit close ×3); breathe doubles comfort. Medicine alone never cures critical.

---

## 2. COOLDOWN MINI-GAME + TAB-OPEN PRESENCE

### A. Sun-fleck game (one ritual-game, appointment-not-FOMO)
- What: 30–45s, 2 rounds. Light flecks shimmer at the sun spot; tap a fleck, creature pounces. No fail state — missed tap = miss ripple, fleck drifts, try again.
- Window: local 10h–17h, once per calendar day (`lastSunFleckDay`). Requires awake + not sick + belly not starving + sleep not exhausted. Outside window or after played: button hidden; if tapped via sun spot: `Sun-flecks rest now. Back with daylight tomorrow — nothing missed.` No countdown, no streak.
- Payout (delight/story/keepsake, never currency): always diary `Chased sun-flecks with {N} in the warm spot.` + greeting echo `Still humming from the sun-flecks.`; trust +2 same as play; keepsake `sun fleck` only if no game keepsake in last 3 days. No score, recency sort only.
- Anti-grind: busy lock like play; cancel/Escape/Give-up pays nothing; costs one spark step; refuses when spark spent with `Too sleepy for flecks. Sitting close is plenty.`

### B. Ambient accrual while tab is open (pauses when closed)
- What: slow life, not income. While main visible + document visible + alive + not busy + not egg: every 9–14min jittered (never displayed), one beat:
  - Sleeping: dream — emote + nest glow pulse, diary (max 1/day).
  - Awake + well: hum — approaches cursor side, emote, no diary.
  - Awake + well + trust fond or closer: find — leaves tiny non-excursion gift at sun spot to tap (never excursion-find names), tap → keepsake + diary.
- Pause rules: hidden tab → persist + stop timer; no offline accrual beyond existing 12h sim.
- Anti-grind caps: max 3 ambient diary lines/day, max 1 ambient keepsake/week, zero trust/stat gain, zero need restore. Break suggestion still fires.

---

## 3. DEPTH — choice, initiative, anniversaries

### A. Shared daily spark (one energy, in words)
- Name: `spark` — `bright / soft / sleepy / spent`. Never metered, never numbered. Surfaced only as posture + decline copy + status suffix when not bright.
- Costs: feed 1 step, play 1, excursion 1, sun-fleck 1. Sit-close, breathe, tuck/wake, medicine cost nothing (safe haven always available).
- Restore: full on wake after tucked night; half (to `soft`) on daylight nap; slow +1 step per calm morning hour when steady.
- When sleepy/spent: buttons stay enabled but decline kindly on tap (no lockout shame). Feed still works when hungry even if spent (need beats spark).
- Copy: bright → no mention. soft → `{N} is glowing a touch softer now.` sleepy → `{N} feels sleepy and curls a little smaller.` spent → `{N} feels spent and wants only nearness.`

### B. Creature initiative (its schedule, not yours)
- Wants: after 3+min open + last ritual >5min ago + spark not spent + max 2/day: trots unprompted to a spot + looks back + one line (`Seems to be asking — glancing at the snack corner.` etc).
- Gifts (unprompted, rare): only when trust fond or closer + morning care done + max 1/day, 2/week: trots in with item, keepsake + diary `Brought you {item} for no reason — just wanted you to have it.` Items distinct from excursion finds.
- No pressure: never pings, never badges, never waits — if tab closed, told as reunion story (max 1).

### C. Anniversary lines (real shared events only)
- Events: hatch-day +7/+30, nursed-back +7, breakfast streak 3+ (extend to 7), growth season +7, excursion gift +1.
- Copy patterns: `This time last week, you stayed through the shivers together until they eased. {N} still leans in a touch closer for it.` / `Shared breakfast, {n} mornings running now…` / `A week since {N} grew into a new season of smallness — a little braver since.` / `Still pleased about the {item}…` / `A week with you now. Tiny at hatching, looking straight at you — still does.`
- Guards (mirror memory voice): one-shot per event per day, max 1 anniversary line per greeting, priority missedYou > sick/critical > sleeping > anniversary > need.

---

## 4. INTEGRATION

### Engine touches (new fields with defaults + deserialize)
- `spark`, `lastSunFleckDay`, ambient counters, initiative counters, `lastGrewDay`, `annivMentioned`. Costs applied on ritual completion only. `trajectory()` stays the single source.
- New keepsakes use distinct names so provenance never collides. Diary cap 120, keepsakes 48 unchanged.

### App touches (reuse existing runners)
- `renderStatus`: spark suffix + trajectory words; sun-fleck shares play affordance; suggestions never pick spent-cost actions when spark spent.
- `showWelcomeBack`: at most one initiative/anniversary line; keep `Nothing is spoiled` closer.
- Ambient loop inside existing 1s frame accumulator. Play cancel-no-pay + give-up fix apply to sun-fleck identically.

### MUST NOT CHANGE
1. Trust never decays; only rises on completed rituals.
2. Newborn guard: no death first 7 days.
3. Warnings gate: death requires shown warnings + critical + sustained time.
4. 12h offline cap; single absence never kills; joyful reunion.
5. Farewell flow + opt-in rebirth with inheritance; never auto-reset.

### Guardrail compliance per system
- Words-never-numbers: no bars/%, counts, streak digits, timers.
- No dark patterns / guilt / FOMO: missed windows wait guilt-free; no push threats, streak loss, premium cure, corpse-shaming.
- Bowlby order: proximity → mild recoverable separation → safe haven (sit/breathe always free) → secure base.
- Experience loud/Agency quiet; sick = shiver/slow, never gasp/collapse.
- IKEA completion: every ritual pays only on completion; cancel pays nothing.
- Gaze loop, no hormone copy. Alongside-people bridge copy. No teams/combat.
