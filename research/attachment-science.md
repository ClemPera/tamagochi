# Attachment science for a browser pet: claims, evidence strength, design rules

Scope: standalone Tamagotchi-like virtual-friend website, rebuilt from zero.
Sources: `virtual_attachment.md` (54-citation corpus, 4 reading lanes, all sections done),
`papers/*.md` records, `papers/evidence/*.txt` primary-source excerpts,
plus full-text fetch of OA sources (Glocker Ethology PMC3260535, Glocker PNAS PMC2690007,
Norton HBS 11-091 working paper, Ratajska PsyArXiv doi:10.31234/osf.io/2d9xj).
At least these records re-read for this doc: Bowlby (11), Solomon & George (12),
Nagasawa (23), Epley (24), Bartz (25), Hooley (27), Small/Loewenstein/Slovic (35),
Aronson & Mills (20), Lewis/Weber/Bowman (21), Glocker Ethology (14) + Glocker PNAS (15),
Heider & Simmel (00), Ratajska (07), plus Gray (09), Gray & Wegner (10),
Slovic (33), Lane (38), Leng & Ludwig (39).

Evidence labels used below:

- **Strong**: replicated and/or OA full text verified locally, large effect, convergent.
- **Moderate**: single well-powered study, paywalled but abstract + citations converge.
- **Weak / prior-knowledge**: no abstract in any API, book/chapter, or single old small-N study.
- **Contested**: failed or weak replication, file-drawer / methods critique on record.

No study in the corpus tests a virtual pet directly. Nearest instruments are
game-character attachment (Lewis et al.) and human-dog bonds (Nagasawa).
Everything mapped to a web pet is inference. That is stated once and applies everywhere.

---

## 1. Animacy: motion alone buys agenthood

**Exact claim (Heider & Simmel 1944, AJP).**
College students shown a ~2.5-min silent film of two triangles + circle around
a rectangle described it in human-like terms: Exp I all but 1 of 34,
reversed-film Exp III 42 of 44. Viewers then infer stable personalities
to explain motion.

**Strength: Strong for the core counts, Weak for the details.**
Core counts verified against Ratajska preprint excerpts
(`papers/evidence/ratajska2020-preprint-excerpts.txt`).
"19 gave a connected story", "Exp 2 n=36", "two as birds" NOT stored locally,
JSTOR-gated — do not cite them as facts.

**Replication (Ratajska, Brown & Chabris 2020, AJP, N=66).**
32 new colour shape videos, 13-23 s, varied social plots, evoked spontaneous
narrative attributions similar to Klin (2000) responses to the original.
**Strength: Strong** — OA abstract + preprint, within-corpus verification.
Effect survives 75 years and new media.

Supporting perceptual account (all **[abstract]**):
Scholl & Tremoulet (2000) — animacy/causality impressions are perceptual,
fast, automatic, irresistible; built in motion timing and contact, not lore.
Tremoulet & Feldman (2000) — single rigid object reads alive when speed-change
magnitude, direction-change magnitude, and axis-alignment-to-travel are large;
trajectory unlikely under inanimate physics forces a self-propelled cause.
Dasser et al. (1989) — preschoolers discriminate intentional vs. desynchronised
ball patterns, recover agent vs. recipient roles.
Gergely et al. (1995) — 12-month-olds read goal from equifinal paths
(different routes, same endpoint) and expect efficient means; rationality
violations drive looking time.
Haselton & Buss (2000, EMT) — under ambiguity the cheap error wins;
over-reading intent is the default. Barrett (2000) — agent detection is
promiscuous; cues that the pet sees/hears/knows you trigger default agent reasoning.

**Design rule.**
Motion before art. One rigid sprite with simultaneous large speed + direction
changes, body axis aligned to travel, equifinal paths to a visible goal
(food, bed, you), varying route each time. Never teleport or wander.
Short (10-20 s) clearly plotted social micro-scenes beat lore paragraphs.
Goal legibility is the cheapest attachment lever in the corpus.

## 2. Mind perception: two dials, and patiency wins sympathy

**Exact claim (Gray, Gray & Wegner 2007, Science).**
Factor analysis of mind judgments yields two independent dimensions:
**Experience** (hunger, fear, pain, pleasure, consciousness) and
**Agency** (self-control, planning, memory, morality, thought).
Both increase valuing mind, but predict different moral judgments.
**Strength: Strong-Moderate** — Science paper, 1891 citations, abstract-convergent,
no local full text.

**Exact claim (Gray & Wegner 2009, JPSP, 7 studies).**
Moral agency and moral patiency are inversely related (moral typecasting).
Good/evil-doers are seen as less vulnerable; recipients of good/evil as less
capable. People will inflict more pain on a known good-doer than on a neutral.
**Strength: Moderate** — 7-study package, Europe PMC abstract on file, paywalled full text.

**Design rule.**
Run Experience loud, Agency quiet. Pet signals hunger, tiredness, joy, fear,
loneliness in face/body, never in numbers. It chooses and remembers only in
brief, legible moments (one preference, one memory of you) because Agency
earns respect but invites blame when it misbehaves. Default casting is pure
**patient**: vulnerable, acted-upon, never competent manager of itself.
Do not make it a moral lecturer or a hyper-competent assistant; that
re-types it as agent and cuts protective sympathy.

## 3. Baby schema: a tunable, rewarding, abusable dial

**Exact claim chain: Lorenz (1943) -> Tinbergen (1951) -> Glocker (2009) x2 -> Barrett (2010).**

- Lorenz *Kindchenschema*: infantile proportions release caretaking.
  **Strength: Weak as primary source** — 1943 German book/article, prior knowledge,
  never directly tested until Glocker.
- Tinbergen releaser / innate releasing mechanism: small exaggerated cue set
  triggers whole stereotyped sequence, no learning required.
  **Strength: Weak here** — book, prior knowledge, used as mechanism gloss.
- Glocker et al. 2009 *Ethology* (OA full text PMC3260535, fetched and re-read):
  17 infants (8 boys, 9 girls) -> 51 faces; final n=62 cuteness / 44 caretaking.
  Parametric moves: face-width UP, forehead-length/face-length UP,
  eye-width/face-width UP; nose-length/head-length DOWN, nose-width/face-width DOWN,
  mouth-width/face-width DOWN (all within +/-2 SD, Table 1).
  High > unmanipulated > low for cuteness F(2,59)=137.3, p<0.001 and caretaking
  F(2,41)=40.0, p<0.001. Gender split: women high-vs-unmanipulated t=4.7, df=24,
  p<0.001; men t=0.8, df=18, p=0.42 ns. Cuteness ratings show no gender main effect.
  **Strength: Strong** — experimental, quantified, locally verified.
- Glocker et al. 2009 *PNAS* (OA full text PMC2690007, fetched and re-read):
  16 nulliparous women, 3T event-related BOLD. Right NAcc linear increase
  F(2,14)=12.96, p<0.001, high>unmanipulated>low; cuteness F(2,14)=60.00, p<0.001.
  Plus ACC, precuneus, fusiform; PPI fusiform<->bilateral NAcc covariation.
  Claim: caregiving motivation is appetitive/rewarding, not merely dutiful;
  fusiform encodes the features, NAcc assigns motivational value.
  **Strength: Moderate-Strong** — small N (16), women-only, but pre-registered-style
  parametric design, quadratic-manipulation control ns, converges with behaviour.
- Barrett *Supernormal Stimuli* (2010): response scales with cue intensity,
  so exaggerated artefacts (Mickey, teddy) pull harder than real infants.
  **Strength: Moderate** — TOC + prior knowledge, convergent with Gould/Mickey observation.

**Design rule.**
Treat cuteness as a slider, not art direction: wide face, high forehead ratio,
large eyes, small nose/mouth. Go supernormal (push past realistic infant)
because the dial rewards exaggeration. Close the loop immediately —
care must pay out in visible delight within seconds — because NAcc is
anticipation/reward, and delayed payoffs do not condition the circuit.
Do not split-test on caretaking motivation by gender; expect universal cuteness
perception with stronger self-reported caretaking pull in some users.

**Guardrail inside this section (O'Neill et al. 2022, VetCompass, 905,544 dogs).**
Pugs 1.86x odds of >=1 disorder; BOAS OR 53.92, stenotic nares 51.25,
corneal ulcer 13.01. Same neoteny that sells causes suffering.
**Strength: Strong** — huge N, OA protocol, abstract on file.
**Design rule:** take the full baby-schema appeal without modelling
breathing-impaired / disease-coded anatomy as desirable. Never encode
disability as cute.

## 4. Attachment needs four criteria, not familiarity (Bowlby -> check-in loops)

**Exact claim (Bowlby 1969/1982, book).**
Attachment is a biologically based, goal-corrected behavioural system, distinct
from feeding/sex, whose set-goal is felt security. Criteria:
(1) proximity maintenance, (2) separation distress/protest,
(3) safe haven (seek comfort under threat), (4) secure base
(explore away and return). Threat -> approach -> comfort repetitions build an
internal working model: the figure becomes a conditioned source of safety.
**Strength: Weak-as-cited / Strong-as-field** — book, no abstract, prior knowledge
here; but the four-criteria operationalisation is the field standard via
Hazan & Zeifman and hundreds of replications. Do not cite Bowlby page numbers
from this corpus.

**Mirror claim (Solomon & George 1996, IMHJ, abstract on file).**
Caregiving is a separate goal-corrected system, reciprocal to attachment;
set-goal keep dependent close/safe; guided by internal caregiving model,
consolidated in adolescence, reshaped at parenthood. Critical asymmetry:
**when the caregiver's own attachment system is highly aroused, caregiving
disables** — helplessness disorganises it behaviourally and representationally.
**Strength: Moderate** — 157 citations, clear abstract, no local full text.

Sequence + safe-base evidence:
Hazan & Zeifman (1994, chapter, prior knowledge) — attachment functions appear
in order: proximity ~6-7y, safe haven ~8-14, secure base + separation protest
into late adolescence, then transferred to partner. Implication: do not demand
full attachment on day one.
Passman & Weisberg (1975, Dev Psych, N small, no abstract in any API) —
familiar blanket = mother in suppressing distress and enabling exploration
in a novel playroom; familiar nonsocial object works as secure base.
**Strength: Weak** — old, small, prior-knowledge-only; directionally useful,
do not overclaim.

**Design rule — the Bowlby-to-check-in mapping (load-bearing).**
Engineer all four, in order, as loops not screens:

1. Proximity maintenance -> ambient presence + return pull. Pet visible on
   return, orients to cursor/tab-focus, greets by name. No streak counters.
2. Separation distress (mild, recoverable) -> "missed you, glad you're back"
   on return after absence, proportional and brief, always repairable in one
   care act. Never punish absence with irreversible decline.
3. Safe haven -> when user is idle/stressed (long pause, late night),
   pet approaches, offers one calming interaction, then settles. It must
   down-regulate the user.
4. Secure base -> pet explicitly sends the user away: "go explore, I'll be here",
   then welcomes back. The job is partly to lower arousal so the user can do
   something else, not to monopolise attention.

Solomon & George corollary: the pet must also **soothe**. A pet that only
demands eventually triggers the exact state (aroused user attachment /
helplessness) that disables caregiving and breeds resentment. Alternate
need -> care -> relief/affection -> pet gratitude on every cycle.

## 5. Effort bonds, but only on completion; initiation needs real cost

**Exact claim (Norton, Mochon & Ariely 2012, JCP + OA HBS 11-091 working paper).**
Builders value self-made IKEA boxes +62.5% (WTP $0.78 vs $0.48, t(50)=2.12,
p<.05; liking 3.81 vs 2.50, t(50)=3.58, p<.001; Exp 1A N=52).
Boundary: labour leads to love **only on successful completion** —
build-then-unbuild or failure dissipates it (published Exp 2).
Prospective aversion: 92% of N=51 prefer pre-assembled, chi2(1)=36.26, p<.001.
People will not choose effort in advance.
**Strength: Strong for Exp 1A/liking/aversion** (working-paper excerpts verified
locally); **Moderate for completion boundary** (published abstract only,
Exp 2 not stored locally). Later gloss (Marsh et al. 2018, not in corpus):
effort amount does not moderate, self-concept account, emerges ~age 5 —
do not cite as corpus fact.

**Exact claim (Aronson & Mills 1959, JASP, N=63).**
Severe (embarrassing read-aloud) initiation -> higher group liking than mild
or control; mild ~= control. Effort-justification needs real cost; trivial
friction buys nothing. Condition means (severe 97.6 / mild 81.8 / control 80.2)
**figures not stored locally — APA-gated, need original**.
**Strength: Moderate-Weak today** — founding, small, old, paywalled; direction
replicates in the effort-justification literature but do not quote means.

**Design rule — care rituals.**
Make every care task completable and visibly succeed: feed -> satiation animation,
soothe -> sleep, play -> tired-happy. Never manufacture effort without payoff;
a pet that gets sicker with no route to recovery is worse than no mechanic
because it manufactures unredeemed effort. Sell effort retrospectively
("you built this bond"), never prospectively ("grind 10 tasks").
Onboarding must cost something real (name it, choose for it, stay one minute,
complete one care cycle) — a checkbox or "mild" tutorial buys nothing —
but cost is not suffering: no shame, no hazing, no pay-or-grief.

## 6. Character attachment: four levers (Lewis et al.)

**Exact claim (Lewis, Weber & Bowman 2008, CyberPsych & Behavior).**
17-item Character Attachment scale, four components:
identification/friendship, suspension of disbelief, control, responsibility.
Validated against self-esteem, addiction, enjoyment, playtime; RPG > non-RPG
(M=3.96 vs 3.70, t(270)=2.94, p=.004 — figure not stored locally, paywalled).
**Strength: Moderate** — best available instrument, 111 citations, structure
confirmed in stored abstract; stats need original. Correction from corpus:
this is game-character attachment, NOT a virtual-pet study.

**Design rule.**
Ship all four, scaffold the fragile one (suspension of disbelief):
identification (pet mirrors your rhythm/name, "yours"), control
(one meaningful choice that matters visibly), responsibility
(it needs you specifically, not anyone), and protect disbelief at all costs:
no stat sheets, no debug language, no fourth-wall breaks, no "optimise"
framing. One system message in optimiser voice can pop the bubble that
three days of care built.

## 7. Reciprocity and the gaze loop (Nagasawa) — build behaviour, not hormone

**Exact claim (Nagasawa et al. 2015, Science, abstract on file).**
Dog gazing (unlike wolf gazing) raised owner urinary oxytocin -> owner
affiliation -> dog oxytocin; intranasal oxytocin -> more dog gazing ->
more owner oxytocin. Interspecies positive feedback loop, argued as
coevolutionary.
**Strength: Moderate** — Science, 667 citations, but small samples,
urinary-OT assay era, no local full text, and see guardrail below.

**Design rule.**
The loop is the product: pet visibly notices you (gaze/orient on arrival,
tab-focus, idle return) and measurably reacts to being noticed
(approach, brighten, settle when watched/clicked gently). Two-way contingency
within ~1 s, not accumulated state. Do not implement as meter-fill;
implement as social contingency: I see you seeing me -> I change.

## 8. Anthropomorphism is motivated — opportunity and risk

**Exact claim (Epley, Akalis, Waytz & Cacioppo 2008, Psych Science).**
Loneliness motivates anthropomorphism of gadgets + supernatural belief;
fear-mood control rules out general negativity. Stored abstract confirms;
specific r/means **[not stored locally — paywalled]**.
**Strength: Contested** — see next.

**Correction (Elsherif/Xiao 2024-2025 registered replication).**
Large-N pre-registered partial replication + extension: weak-to-no support
for loneliness-anthropomorphism correlation; insufficient evidence of positive
association. Websearch-confirmed (Peer Community RR, Xiao 2024).
**Strength: Moderate-Strong as a dampener** — RR design beats 2008 small-N.

**Exact claim (Bartz, Tchalova & Fenerci 2016, Psych Science, N=178).**
Direct replication of loneliness-anthropomorphism link + causal move:
reminding participants of a close supportive relationship **reduced**
anthropomorphism. Attachment anxiety predicted anthropomorphism more strongly
than loneliness. Motivated search for connection that turns off once belonging
is satisfied.
**Strength: Moderate-Strong** — larger N than Epley, causal prime, abstract on file.

**Design rule.**
Design alongside human relationships, not as substitute. Target user includes
the anxious/lonely, so this is an ethically sensitive category: never position
pet as replacement for people ("no one else understands you"), always as
practice/bridge ("cared for here, carry it there"). Expect attachment to soften
when the user's life improves — that is success, not churn to fix with
escalating neediness. Instrument attachment anxiety, not just loneliness.

## 9. Identifiable victim + psychic numbing: one named creature, never numbers

**Exact claims.**
Slovic (2007, JDM, abstract): large death stats are "human beings with the
tears dried off" — no affect, no action. Fetherstonhaugh et al. (1997):
willingness-to-help does not scale with lives saved; proportion dominates
number; value-per-life falls with N **[prior knowledge, no abstract]**.
Small, Loewenstein & Slovic (2007, OBHDP, 698 citations):
donations higher for identifiable than statistical victim; prompting
deliberative/analytic thought **reduced compassion** and shrank the effect
**[prior knowledge here — title/DOI confirmed, no abstract retrieved;**
mechanism confirmed via CMU PDF/websearch but treat numbers as needing original].
Keating/Greenslade journalism: 4 local deaths move more than 80 distant —
commentary, not evidence.
**Strength: Strong as a convergent set** — most convergent finding in corpus
despite any single record being paywalled; replicated across labs, decades,
paradigms (donations, risk, news).

**Design rule (strongest guardrail in this doc).**
One named, singular, vivid creature. No aggregate meters, no stat dashboards,
no happiness/health/XP numbers, no "optimise your pet", no multi-pet grids,
no leaderboard. Asking the user to reason about numbers measurably cools the
exact compassion the product runs on. If you must persist state, show it as
embodied condition (posture, eyes, pace, nest), never as digits.

Naming corollary: let the user name it early (post-initiation, pre-care).
A name is the cheapest identifiability intervention; it converts "a pet"
into "this one" and recruits proportion-dominance (100% of my pet) for free.

## 10. Heavy reliance signals unmet need; empathy is parochial and weaponisable

**Exact claim (Hooley & Wilson-Murphy 2012, J Pers Disord, N=80 community).**
Intense current transitional-object attachment associated with meeting BPD
criteria, more childhood trauma, less supportive early caregivers, more adult
attachment problems. Heavy adult reliance is a symptom marker.
**Strength: Moderate** — small community N, correlational, Europe PMC abstract
on file; clinical-hospital link converges. Not causal, not predictive at
individual level — use as tripwire, not diagnosis.

**Group-boundary warning set (all [abstract]).**
Xu et al. 2009 / Avenanti et al. 2010 / Contreras-Huerta et al. 2013:
empathic resonance drops for categorised out-group, not for merely unfamiliar
(violet-hand) strangers; minimal team labels do not move it.
Trawalter et al. 2012: assumed pain tracks perceived status/hardship —
frame pet as vulnerable, never privileged.
Cikara 2011/2014: rival failure activates ventral striatum; bias is out-group
antipathy + entitativity; lowering perceived group-ness attenuates it.
Saucier et al. 2005 meta (48 tests, d=.03 ns overall): bias appears when
helping is costly/risky/effortful and rationalisable — easy care masks it,
demanding care exposes it. Bruneau et al. 2017: in-/out-group empathy have
independent opposite effects; pet-only empathy licenses passive harm elsewhere.
De Dreu / Buffone & Poulin / Fourie: oxytocin = tend-and-defend; "protect my
pet" motifs recruit defensive aggression; only reciprocal mutual engagement
mitigates.
de Waal / Ben-Ami Bartal: mammalian empathy/distress-recruitment is ancient
(rats free cagemates) — mechanism plausibly exists — but all with live
conspecifics; nothing shows a rendered artefact is granted in-group status
or that the state persists as attachment.
Bloom (2016): raw empathic spikes are fragile; deliberate durable compassion
is the robust build.
**Strength: Moderate-Strong collectively; Weak for any direct pet transfer**
(no study tests digital in-group grant — the load-bearing assumption).

**Design rules.**
No competing teams, no pet-vs-pet combat, no rival users, no "protect my pet
from them" quests. Keep group-ness low (no breeds-as-factions, no rarity
castes). Keep costly care fair and brief so bias has nowhere to hide.
Watch for heavy reliance (night-long sessions, distress at downtime,
inability to leave, self-harm language) — log, throttle neediness mechanics,
offer soft off-ramps and human resources, never dark-pattern retention around
distress. Do not diagnose; do route.

## 11. Guardrail: drop every oxytocin claim

**Exact claims.**
Lane et al. 2016 (J Neuroendocrinol, abstract): 8 studies, 453 subjects, one lab —
mostly unexpected results, only 5 papers published, 1 null reported.
File-drawer inflation demonstrated in own lab.
Leng & Ludwig 2016 (Biol Psychiatry, abstract): very little intranasal OT
reaches CSF; peripheral levels supraphysiologic (gut/heart/reproductive targets);
many assays discredited; need pre-reg, dose-response, peripheral controls.
**Strength: Strong as critique** — independent, convergent, high-citation (458).

**Design rule.**
Build reciprocal attention (Section 7) because the behavioural half
(gaze -> respond -> feedback) does not depend on pharmacology.
Market nothing on "oxytocin", "bonding hormone", "neuroscience-proven".
Copy review must flag those words as bugs. Same for "dopamine hits".

---

## 12. Why Minecraft-wolf-style attachment works (naming, vulnerability, shared history, permanence of loss)

Minecraft wolves are the corpus predictions composed by accident:

- **Naming (identifiability + Lewis responsibility + IKEA ownership).**
  A collar + name converts a spawned mob into *this one* (Section 9).
  Naming is effort-completed (Section 5) and responsibility-assigned (Section 6):
  "MY pixels" (Lewis title) outperforms "a wolf". Browser-pet rule: name once,
  early, irreversibly-ish; use the name in every greeting and distress cue;
  never allow bulk/unnamed pets.

- **Vulnerability (moral patiency + baby-schema-lite + status).**
  Wolf whimpers, tilts, shows low HP tail, can die. That is Experience dial up,
  Agency down (Section 2) + hardship/vulnerability framing (Trawalter) +
  neoteny-without-pathology (Section 3). It recruits care because it can suffer
  and cannot fully save itself. Browser-pet rule: legible need states with
  audible/visible patiency (shiver, droop, seek), always paired with a
  within-reach remedy; never invulnerable mascot, never privileged boss-pet.

- **Shared history (Bowlby working model + equifinal goals + Lewis control).**
  Wolf follows, teleports-to-you (controversial but proximity-maintaining),
  fights beside you, sits/stands on command (control lever), takes one
  remembered owner. Repetition of threat->approach->comfort builds the internal
  working model (Section 4); varying routes to the same you = equifinal goal
  legibility (Section 1). Browser-pet rule: persistent memory of 2-3 facts
  (name, one preference, one shared event) + visible control (one command that
  always works) + check-in history that changes greeting tone. Continuity is
  the feature.

- **Permanence of loss (separation distress made real).**
  Wolf death is permanent; that is why protection matters and why grief posts
  exist. The corpus never tests pet death (ethics), but Bowlby criterion 2
  plus IKEA completion predict exactly this: irrevocable loss retroactively
  prices all prior effort as love, while revocable/resettable loss prices it
  as grinding. Browser-pet rule for a humane web product: **do not kill the pet**,
  but preserve *weight* without cruelty — e.g. one persistent biography with
  scars/mementos of neglect that heal but do not erase; long absence yields
  poignant reunion, not deletion; offer "farewell/restart" only as explicit,
  mourned, user-chosen ritual with memorial, never as punishment or surprise.
  Weight without harm is the adaptation of permanence the ethics sections
  (Hooley, Bartz) require.

In short: wolf = one named patient + controllable + remembered + losable.
Remove any leg and attachment collapses to amusement. The browser pet should
copy the legs, soften the last one.

---

## Ranked top-10 load-bearing design rules

Ordered by evidence strength x attachment leverage x reversibility if wrong.
Later rules still matter; these ten carry the product.

1. **One named creature, never numbers.** No dashboards, meters, XP, aggregates,
   optimisation prompts. Show state as body, never digits.
   *Why: strongest convergent set (Slovic; Small/Loewenstein/Slovic; Fetherstonhaugh).*
2. **Motion before art: goal-legible, equifinal movement.** Simultaneous
   speed+direction changes, axis-aligned, varying routes to same visible goal.
   *Why: Heider & Simmel + Ratajska replication; cheapest agenthood.*
3. **Engineer the four Bowlby criteria as check-in loops** (proximity, mild
   recoverable separation distress, safe haven that soothes, secure base that
   sends away) in that developmental order. Pet must also soothe the user
   (Solomon & George) or caregiving disables.
4. **Experience loud, Agency quiet; default to moral patient.** Hunger/fear/joy
   recruit care; choosing/remembering brief only. Vulnerable, never privileged.
   *Why: Gray 2-D + typecasting + Trawalter status.*
5. **Tune baby schema as a slider and pay out immediately.** Wide face, high
   forehead, big eyes, small nose/mouth; supernormal push; care -> visible
   delight in seconds (NAcc anticipation). No disease-coded cuteness (O'Neill).
6. **Make every care task complete visibly; onboard with real cost.**
   Effort bonds only on success (IKEA completion boundary); trivial friction
   buys nothing (Aronson & Mills threshold). Retrospective pride, never
   prospective grind.
7. **Reciprocal gaze/contingency loop, no hormone marketing.** Pet notices you
   and reacts to being noticed within ~1 s. Behavioural loop only; Lane/Leng
   forbid oxytocin copy.
8. **Protect suspension of disbelief (Lewis fourth lever).** Identification +
   one real control + assigned responsibility scaffold it; one optimiser-voiced
   system message pops it. No debug language, no fourth-wall breaks.
9. **Design alongside people, expect to be displaced.** Anthropomorphism is
   motivated and turns off when belonging is met (Bartz > Epley per 2024 RR).
   Bridge copy, never substitute copy; improvement-then-distance is success.
10. **Weight without harm + reliance tripwire.** Persistent biography/scars/
    mementos and mourned-only farewell give Minecraft-wolf permanence weight
    without killing; instrument heavy reliance (Hooley BPD/trauma marker),
    throttle neediness mechanics, offer human off-ramps, no distress-based
    retention. No teams/combat (parochial-empathy guardrail).

What is still not established (do not promise): that a browser sprite is
granted in-group status at all; that lonelinessàngthropomorphism transfers
(2024 RR weakens it); that digital mediation does not drain affect
independently; that any gaze-OT pharmacology applies to pixels. Build the
behavioural loops; claim only the behaviour.
