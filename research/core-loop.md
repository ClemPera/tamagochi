# v2 Core Loop — tension, mortality, progression, onboarding

Source: `virtual_attachment.md` levers 1-15 + guardrails 11-15. v1 reference: `site/engine.js`, `site/app.js`.

## Why v1 failed (fix list)

- `engine.js:203-206`: food -7/h, joy -5/h, rest -3.5/h. From ~78 start, first `hungry` takes ~8h. Sick needs `<20 for 360min` (`:232`), death needs `health<=15 for 1440min` (`:259-261`). With `OFFLINE_CAP_MIN=720` (`:2`), death needs 3-4 real days of zero care. Unreachable in practice.
- Decay is invisible: `getStatus()` returns only current word (`:459`), no trajectory, no "getting worse". Player clicks each button once and state recovers (+18 food, +16 joy).
- No onboarding: `app.js` boots straight to hold-button promise, never teaches hunger/night/illness. Night mode (`isNight`, `:117`) is a CSS class only, undiscoverable, no ritual attached.
- No stakes: bond never demotes stage (`:55`), excursions auto-succeed (`:96`), `cleanSick` cures instantly if stats >25 (`:372`).

## 1. Core loop — rituals, not buttons

### Needs (3 visible + 2 hidden)

Keep 3, rename to plain words. Never show numbers (lever 11, §12):

- **Belly** (was food): `content / peckish / hungry / starving`. Body cue: glances at snack corner, slow eating animation.
- **Heart** (was joy): `cheerful / okay / blue / lonely`. Cue: approaches then turns away, play invitation.
- **Sleep** (was rest): `rested / drowsy / tired / exhausted`. Cue: drooping eyes, seeks nest spot.

Hidden, inferred only through behavior:

- **Health**: never displayed. Surfaced as `sturdy / tender / fragile / ailing` only when asked or when sick.
- **Bond**: never a meter. Surfaced as relational words (`shy / fond / close / devoted`) in diary only.

### Decay in game-feel terms (tuned for 3x/day)

Target burden: 2 min, 3x/day. Life happening must be forgiven; sustained absence must matter.

- **Belly**: full → peckish in ~6h, hungry in ~10h, starving in ~16h. One missed day = hungry. Two missed meals in a row = visible trajectory ("hungrier than this morning").
- **Heart**: cheerful → okay in ~8h, blue in ~18h, lonely in ~30h. Decays slower; loneliness is about days, not hours.
- **Sleep**: follows real night. Awake 16h → tired. Tucked = restores overnight in ~8h real or 30s ritual. Untucked at night (21h-7h local) = rest drains 2x, creature looks exhausted by morning, explicitly links night mode to mechanic.
- **Stacking rule**: any one need at bottom = uncomfortable but stable. Two needs at bottom for >12h = slide begins (health drifts down, play refuses: "too sleepy to play"). This creates readable trajectory without numbers.

Offline: simulate max 12h per absence (keep v1 cap), but carry a `neglectDays` counter across sessions. Single absence never kills. Pattern kills.

### Minute-to-minute (30-90s visit)

1. **Arrive → noticed** (lever 10): creature stops, orients axis to player, gaze follows cursor 1s (lever 1). Greeting line names lowest need in words.
2. **Read → choose one ritual**: UI shows only the creature + 3 spots (snack/sun/nest). No dashboard. Player infers from posture + one sentence (`Mochi feels hungry and keeps glancing at the snack corner`).
3. **Complete ritual → payoff** (lever 7): animation *before* stat change. Bond + diary + possible keepsake. Incomplete = no benefit (lever 7, IKEA completion).
4. **Leave → secure base** (lever 6): tuck or wave. Creature settles, "will be here." 10s autosave.

### Day-to-day (reason to return 3x)

- **Morning hello** (Belly): overnight fast always yields peckish. 60s feed ritual. Streaks never shown; instead diary notes "shared breakfast, three mornings running" as story.
- **Midday excursion** (Heart): if morning care done, creature leaves 30 min real, returns with gift + story. Miss the return window? Gift waits, no punishment — but you miss watching the return trot (lever 2 goal-legibility). One excursion/day max.
- **Night tuck** (Sleep): only ritual that fully restores Sleep. Discoverable: at 21h scene darkens, creature yawns, nest glows. Untucked nights accumulate tiredness visibly next morning. This fixes "night undiscoverable."

Something to lose: missed days stall growth, cancel that day's excursion gift, and move one step down the warning ladder (§2). Never take away past keepsakes or demote stage.

### Rituals (replace buttons)

Each takes 5-15s, requires completion, pays immediately (lever 4):

- **Share a meal**: drag snack to creature, watch it eat slowly, look up. Spam blocked: full creature refuses ("full and happy").
- **Small game**: hide-and-find at sun spot, 2 rounds. Costs a little Belly/Sleep (tradeoff, prevents grinding).
- **Tuck in / Wake**: night-only full effect. Day tuck = short nap, small effect.
- **Breathe together** (was soothe): 5s hold-to-breathe, ring scales. Only cure path when scared/sick + doubles bond gain (safe haven, lever 6). Also soothes *player*: slows UI, quiet line (Solomon & George arousal guardrail).
- **Sit close** (was pet): no cooldown, tiny gain, always available. The low-burden "I only have 10s" action. Prevents "nothing I can do" despair.

## 2. Mortality — reachable, never cheap

Principle: death must be *possible* to make care meaningful, *difficult* to avoid accident/grief-bait, and *witnessed* in stages (Bowlby separation protest → safe haven).

### Ladder (all in words + animation, never numbers)

1. **Thriving → Tender** (12-24h thin care): eats slower, plays less far. Diary: "a little quieter today." Reversible with one good visit.
2. **Unwell / chill** (one need bottomed ~24h, or two needs low ~12h): shivers, wants nearness. Medicine ritual unlocked. Explicit guidance: "food and rest will help the medicine along." Recovers with 2 good care sessions within 24h.
3. **Very weak / critical** (unwell ignored another 24h, i.e. ~48h total neglect): movement slows, axis droop, stays near nest, greeting becomes rush-then-fade. Diary + banner: "very weak. Staying close and keeping them fed and rested matters most now." One-tap "stay a while" (sit close x3) rallies.
4. **Farewell** (~72h sustained neglect *with* stage 2+3 having fired, or 48h if player dismissed warnings): no sudden death. 3-line farewell sequence — keep, slow to 3x2.4s. Creature settles, thanks, slips away. Keepsakes stay.

Hard rules:

- No death in first 7 days of life (newborn protection). No death in a single session or single 12h offline window. No random death, no age death (elder is a season, not a timer).
- Warnings must have been *shown* (diary + return note + critical event). If app was never opened to display them, death timer pauses — prevents "came back after holiday to corpse" dark pattern.
- Sleep pauses Belly/Heart decay 50%, so tucked + absence = forgiveness.

### Grief + inheritance

- Farewell → memorial screen, not game-over. Name, days lived, stage, keepsake shelf intact. Player must actively choose "welcome someone new" — never auto-reset.
- **Inheritance**: keepsakes + diary + lineage carry to next egg. New hatchling gets `first shell` + one inherited trait (accent hue or a named keepsake on the shelf, e.g. "Mochi's smooth pebble"). Lineage list shows names only, max 10. Past bond does *not* transfer as stats — fresh start, carried story (lever 9 responsibility without pay-to-win).
- Rebirth ritual repeats naming + promise, with old promise kept on the wall. Old name can never be reused accidentally (suggest new).

## 3. Progression without dashboards

No points, levels, bars, counts, streaks (§12 Small/Slovic: analytics kill affect).

- **Growth** (keep `baby→child→teen→adult→elder`): gated by ageDays (2/5/9/15) *and* bond thresholds (10/30/55) *and* completed-ritual count. Never demotes. Each growth = new verb/animation (child wanders farther, teen excursion longer, adult brings bigger finds, elder slower but sits closer longer) + keepsake (`smooth pebble / soft feather / folded leaf / silver thread`). Announced as "grew into a new season of smallness."
- **Shared history**: diary capped 120, keepsakes capped 48. Every entry is a sentence with context ("came back from a little adventure with blue button"), never "+5 joy." Shelf shows last 12 as icons + names.
- **Keepsakes with stories**: excursion finds + growth tokens + illness recoveries ("warm speck — nursed back after the chill"). Hover/tap reveals one-line provenance: where, when, with whom. This is the IKEA payoff (lever 7): effort → visible completed object.
- **Lineage**: memorial list of names. No scores. Long-lived creatures earn `devoted` language and slower fear onset (secure base earned), not power.

Anti-optimization: sort shelves by recency, never rarity; no completion %, no "collect all"; bond word appears only in diary prose.

## 4. Onboarding — teach by doing (first 3 guided moments)

Keep v1 promise ritual (lever 8: mild initiation alone buys nothing, so pair 3s hold + written promise + immediate hatch payoff). Then script first 10 min with accelerated demo clock (first hour ticks 10x, then normal):

1. **First hunger (~3 min in)**: hatch → creature trots to snack spot, looks back (goal legibility, lever 2). Prompt: "looks peckish — try sharing a snack." Player drags, watches eat, gets first diary line + `first shell`. Teaches: read body → complete ritual → visible joy.
2. **First night (~6 min in, forced dusk demo)**: scene dims once regardless of clock, creature yawns, nest glows. Prompt: "tuck in for a pretend night?" Teaches tuck/wake + discovers night mode. After wake, note: "at real night-time it gets properly sleepy."
3. **First chill (~day 2, or triggered visit)**: after first 12h away (or scripted if player stays), creature shivers, medicine ritual appears. Prompt walks through: comfort → feed → rest → breathe together. Must *succeed* (lever 7): recovery guaranteed if steps completed, diary records "nursed back." Teaches illness is curable, warnings readable, neglect recoverable.

No tooltips list, no help page. Each lesson = need felt → action completed → creature visibly better + keepsake. Promise wall persists as commitment device.

## 5. Guardrails check

- **Words-not-numbers (lever 11, §12)**: no bars/percentages/streaks. Status = one sentence + posture + gaze. Lowest-stat only. Bond/health never numeric, never graphed.
- **No dark patterns**: no push threats, no streak loss, no premium cure, no random death, no corpse-shaming. Return after long absence = joyful reunion + "nothing is spoiled", not scolding. Separation protest is affectionate rush, never guilt.
- **Reliance safety (levers 6/15, Hooley/Bartz/Solomon-George)**: creature also soothes player (breathe together calms UI); break suggestion at 24 touches/hour and 30 min continuous — gentle, never blocking. Copy positions pet *alongside* human bonds, never as substitute. Heavy-use flag should only trigger softer tone + earlier break note, never diagnosis.
- **Low burden**: 3x/day x 2 min sustains thriving. Single daily visit sustains tender-but-alive indefinitely. Tucked sleep halves decay. Missed day = story pause + stalled growth, not spiral. Medicine never requires precision or timing.
- **Vulnerable framing (lever 12), no teams (lever 13), no oxytocin marketing (lever 14)**: copy calls it small/tired/needing-near, never special/chosen/best. No leaderboards, no pet-vs-pet, no shared stats. Reciprocal gaze loop described as "notices you," never neurochemical.
- **Disability guardrail (§5 O'Neill)**: baby-schema slider for cuteness (levers 3-4) must not model labored breathing, stenotic nares, or limping as cute. Sick animation = shiver/slow, not gasping; exhausted = droop, not collapse.
