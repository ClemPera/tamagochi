# Virtual attachment: what the literature says about why humans attach to animals (and virtual ones)

Corpus built from `documents.md`. One file per citation in `papers/`, with resolved metadata, DOI, citation count and abstract where one exists. Claims are labelled by evidence base: **[full text]**, **[abstract]**, **[prior knowledge]**.

**Corpus provenance.** 54 citations parsed; 43 resolved to a verified record (title overlap, first author, and year within ±2 all checked) and 37 carry a verified abstract. Records came from Crossref, Europe PMC and OpenAlex, with Semantic Scholar as fallback. The 11 unresolved are books, news pieces, one NASA page and one 1943 German-language article, none of which any of those APIs index; their findings are recorded here from prior knowledge and labelled as such.

**Three resolver bugs worth knowing about**, because each produced confidently wrong data rather than an obvious failure: title-only search matched Haselton & Buss's *Error management theory* to a Baumeister & Vohs encyclopedia entry of the same name, and matched two monographs (Bowlby, Tinbergen) to journal *reviews* of them; and an unvalidated Semantic Scholar fallback attached a modern retrospective on the Heider–Simmel film to two different papers, plus an exoplanet-photometry abstract to the giant-impact Moon paper. Every record in `papers/` was re-validated against its citation and every stored abstract scanned for out-of-domain contamination. (One false alarm in that process: the Ratajska et al. abstract *is* genuine — it opens by describing Heider & Simmel before reporting the new study. Only the copies pasted onto papers 00 and 40 were wrong. Paper 07's abstract has been restored from Crossref and checked against its preprint.)

**Which numbers are locally checkable.** `papers/evidence/` holds primary-source excerpts for every number cited from an openly available text: both Glocker papers (PMC full texts), the IKEA working paper (HBS 11-091), Ratajska's preprint (which also verifies the Heider & Simmel counts it reports), plus Bartz N=178, Hooley N=80, Saucier's *d*, O'Neill's 905,544 dogs and OR 53.92, and Lane's 453 subjects in stored abstracts. Five papers' papers carry a `## Verification` section pointing at the exact excerpt. Numbers that live behind paywalls are flagged inline **[figure not stored locally — needs the original]**: Aronson & Mills' condition means, Lewis et al.'s correlations and *t*, Epley's *r* values and condition means, and the Heider & Simmel details beyond what Ratajska reports (connected-story count, Experiment 2 *n*, "two as birds").

## Read so far

All 54 citations processed across four reading lanes.

| Lane | Papers | Sections | Status |
|---|---|---|---|
| 1 | 00-08 | Animacy, perceptual causality, intentional stance, error management | done |
| 2 | 09-18 | Mind perception, moral typecasting, Bowlby, caregiving, imprinting, baby schema, supernormal stimuli | done |
| 3 | 19-27 | IKEA effect, effort justification, virtual pet ownership, psychological tether, human-dog oxytocin/gaze loop, transitional objects | done |
| 4 | 28-53 | In-group empathy bias, psychic numbing, parochial altruism, oxytocin methodology critique, animal empathy, off-topic items | done |

## Corpus map (54 citations parsed, 19 section headers)

The bibliography is a chapter outline, not a flat list. Six headers group the material by a French noun, and the grouping itself is informative: each group is a mechanism the author thinks explains attachment.

- **L'agent** (00-12): what makes an object read as an intentional agent. Animacy cues (Scholl & Tremoulet), infant intentional stance (Gergely), attribution of intention to shapes (Dasser), mind perception dimensions (Gray, Gray & Wegner), moral typecasting, Bowlby's attachment theory, Solomon & George's caregiving system.
- **La projection** (09-12): overlap with L'agent; mind perception and moral typecasting are listed under both.
- **Les boutons** (13-27): the push factors. Imprinting (Lorenz), baby schema and the caregiving reward system (Glocker), Tinbergen's sign stimuli, supernormal stimuli (Barrett), effort-based valuation (IKEA effect, Aronson & Mills), ownership of a virtual pet (Lewis et al.), Hazan & Zeifman's psychological tether, human-dog oxytocin-gaze loop (Nagasawa).
- **Seul** (24-27): being alone. Inferential reproduction (Epley), reminders of real social connection attenuating anthropomorphism (Bartz), blankets as transitional agents (Passman & Weisberg), adult transitional-object attachment (Hooley).
- **Les autres** (28-53): everything else, with its own sub-blocks: **Le tri** (in-group/out-group empathy), **Le cercle** (Bloom's rational compassion), **Le nombre** (psychic numbing, proximity rule), **L'arme** (parochial altruism, weaponised empathy), **Ocytocine litterature méthodologique** (publication-bias critique).
- **So what (La lune)** (40-43): giant-impact Moon formation, lunar laser ranging, eclipse article. Off-topic for attachment; presumably a worked example the author reused for another section.
- **Désenchantement / réenchantement du monde** (52-53): Weber's Protestant ethic, Dawkins against science-as-disenchantment. Off-topic, same suspicion.

## Findings

### 1. Animacy: motion alone buys the right to be treated as an agent

**Heider & Simmel (1944), *AJP*.** College students watched a ~2.5 min silent film of a large triangle, small triangle and circle moving around a rectangle. In Experiment I, **all but one of the 34 participants** described the movements in human-like terms; in the reversed-film condition (Experiment III), **42 of 44** did the same. **[verified: papers/00 `## Verification`, via Ratajska et al.'s reporting of the original; the 1944 paper itself is JSTOR-gated]** The "19 gave a connected story", "Experiment 2 (n=36)" and "two as birds" details are **not** in the verifying source **[figures not stored locally — need the JSTOR original]**.

This is the founding result for the whole project: minimal motion is parsed as goal-directed social behaviour, and viewers then infer stable personalities to explain it.

**Scholl & Tremoulet (2000), *TiCS*.** Review inheriting from Michotte and Heider-Simmel: causality and animacy impressions from moving 2-D shapes are largely **perceptual**, fast, automatic and irresistible, even though they feel like high-level inference. The visual system recovers causal and social structure much as it recovers 3-D shape. **[abstract]**
Design reading: the illusion is built into **motion timing and contact**, not into text or lore.

**Tremoulet & Feldman (2000), *Perception*.** A single rigid object crossing a uniform field can look alive. Animacy ratings rose significantly with magnitude of speed change, angular magnitude of direction change, shape, and **alignment of the object's principal axis with its direction of motion**. Objects read as animate when their trajectory is otherwise unlikely in the setting. **[abstract]**
Design reading: **simultaneous, large changes in speed and direction** violate inanimate physics and force the system to posit a self-propelled cause.

**Dasser, Ulbaek & Premack (1989), *Science*.** Preschoolers discriminated intentional from nonintentional movement patterns of two balls in habituation tests, with the same movements desynchronized as control. Reversing the balls' roles produced more attention recovery in the intentional case, so children are sensitive to **agent versus recipient** roles. **[abstract]**

**Gergely, Nádasdy, Csibra & Bíró (1995), *Cognition*.** 12-month-olds identified a goal from the **equifinal structure** of a path (different routes, same endpoint) and expected a "rational agent" to choose the efficient means in a new situation. Rationality violations drive looking time. **[abstract]**
Design reading: **goal legibility beats realism.** A pet that reaches the same goal by varying routes reads as having wants; one that teleports or wanders reads as a scripted object.

**Haselton & Buss (2000), *JPSP*.** Error management theory: biases evolve where false-positive and false-negative costs are asymmetric. Study 1 (N=217) documented women's underperception of men's commitment; Study 2 (N=289) replicated it. **[abstract]**
Design reading: under ambiguity, humans adopt the inference whose error is cheaper. Over-reading intent is the cheap error, so **ambiguous pet behaviour is filled with intent by default**. Agency is nearly free.

**Barrett (2000), *TiCS*.** Cognitive science of religion: concepts supported by ordinary agent and causal reasoning are natural, memorable and culturally transmissible. Agent detection is promiscuous. **[abstract]**
Design reading: cues implying the pet **sees, hears, or knows you** (gaze, response to its name) activate default agent reasoning.

**Ratajska, Brown & Chabris (2020), *AJP*, OA, N=66.** 32 short animated-shape videos (13-23 s) depicting social plots produced spontaneous narrative attributions similar to Klin's (2000) responses to the original Heider-Simmel film, with attribution counts varying by participant and video. **[abstract]**
Design reading: the Heider-Simmel effect **survives 75 years and new media**. You do not need fidelity to the original film; you need short, clearly plotted social micro-scenes.

**Morris & Peng (1994), *JPSP*.** Social (not physical) events were explained more dispositionally in English-language newspapers and more situationally in Chinese-language ones; Chinese respondents weighted situational factors more and judged murders more avertible. **[finding as reported during reading; no abstract is exposed by any API and the full text is paywalled — treat as prior knowledge until checked]**
Design reading: whether the pet's behaviour is read as personality or as circumstance is culturally tuned. Backstory and framing change it.

---

### 11. Group boundaries decide whether care is felt at all

The empathy literature is almost entirely a warning. Empathy is not automatic and it is parochial.

- **Xu et al. (2009), *J Neurosci*.** Painful stimulation of same-race faces raised ACC/insula empathic activation in both Caucasian and Chinese participants; the ACC response **dropped for other-race faces**. **[abstract]**
- **Avenanti et al. (2010), *Current Biology*, TMS.** Observers showed sensorimotor resonance for own-race faces and for **highly unfamiliar "violet-hand" strangers**, but not for other-race faces. Suppression was stronger in participants with stronger implicit bias. **[abstract]**
  Together these two say: **unfamiliarity does not kill empathy, categorisation does.** An alien or exotic-looking pet is not automatically disadvantaged; a group-marked "other" is.
- **Contreras-Huerta et al. (2013), *PLOS ONE*.** Neural empathic responses were greater for own-race targets, but a **minimal group manipulation did not modulate them**. **[abstract]** Arbitrary "team" labels are weak levers; salient racialised appearance silently dominates.
- **Trawalter et al. (2012), *PLOS ONE*.** Including nurses, people assumed Black targets feel less pain. The bias tracked perceived **status and hardship**, not race per se; archival NFL data showed injured Black players judged more likely to play on. **[abstract]**
  Design reading: perceived status changes assumed capacity to suffer. Frame the pet as vulnerable and hardship-bearing, never privileged.
- **Cikara et al. (2011), *Psychological Science*.** Rival-team failure activated **ventral striatum** (pleasure), correlating with self-reported likelihood of aggressing against rival fans. **[abstract]**
- **Cikara et al. (2014), *JESP*.** Intergroup empathy bias includes schadenfreude and Glückschmerz, is better explained by **out-group antipathy** than by extra in-group love, and was attenuated by **reducing perceived group entitativity**. **[abstract]**
  Design reading: do not set pets up as competing teams, and lower the perceived "group-ness" of anything.
- **Saucier et al. (2005), *PSR*, meta-analysis of 48 tests.** No universal discrimination in helping (d=.03, ns); bias against Black victims appeared when helping was **costlier, riskier, effortful and rationalisable**. **[abstract]**
  Design reading: bias surfaces under costly care, not baseline affect. Easy care can mask it; demanding care exposes it.
- **Bruneau et al. (2017), *SPPS*.** In-group and out-group empathy had **independent, opposite** effects across three intergroup contexts: out-group empathy inhibited harm, in-group empathy increased passive harm. **[abstract]**
  Design reading: empathy trained only toward your own pet licenses passive harm toward everything else.
- **Buffone & Poulin (2014); De Dreu et al. (2010), *Science*; De Dreu (2012).** Empathy plus target distress and OXTR/AVPR1a variants predicted aggression on a close other's behalf; intranasal oxytocin promoted in-group trust and **defensive, not offensive**, out-group aggression. The 2012 review frames oxytocin's core function as parochial **"tend-and-defend."** **[abstracts]**
  Design reading: a "protect my pet" motif is a lever toward hostility against rival pets and rival users. Caregiving is weaponisable.
- **Fourie et al. (2017), IntechOpen review.** Empathy has three components, is not automatic, and is modulated by intergroup factors. Mitigation works best through **reciprocal, mutual engagement**. **[abstract]**
  Design reading: one-way "look at the cute pet" exposure is unlikely to generalise to anything. Two-way interaction is the only bias-reducing lever identified here.
- **De Dreu et al. (2011), *PNAS*.** Intranasal oxytocin increased **in-group favouritism** and out-group derogation. **[abstract]** There is no indiscriminate "cuddle chemical"; a creature coded as out-group will not recruit the same care.

### 12. Guardrail: affect is per-entity, and analytics kill it

- **Slovic (2007), *Judgment and Decision Making*.** Large death statistics are "human beings with the tears dried off": no affect, therefore no motivation to act. **[abstract]**
- **Fetherstonhaugh et al. (1997), *J. Risk & Uncertainty*.** Willingness to help did not scale with the number of lives saved; people preferred saving a larger **proportion** even when that saved fewer people, and value per life fell as the number at risk grew. **[prior knowledge; title/DOI confirmed, no abstract retrieved]**
- **Small, Loewenstein & Slovic (2007), *OBHDP*.** Donations were higher for an **identifiable** victim than a statistical one, and prompting **deliberative, analytic thought reduced compassion** and shrank the identifiable-victim effect. **[prior knowledge; title/DOI confirmed, no abstract retrieved]**
- **Keating (2013), *Foreign Policy*; Greenslade (2007), *The Guardian*.** The same logic applied to news: 4 local deaths moved the public more than 80 distant ones. **[news commentary, not primary evidence]**

This is the strongest convergent set of findings in the corpus, and it is the clearest design mandate: **one named, singular, vivid creature; no aggregate meters; no stat dashboards; no "optimise your pet's happiness" framing.** Asking a user to reason about numbers is the fastest way to remove the feeling that motivates the whole product.

### 13. Guardrail: drop every oxytocin claim

Two independent critiques of the intranasal oxytocin literature, and they matter because the corpus leans on the Nagasawa gaze loop:

- **Lane et al. (2016), *J. Neuroendocrinology*.** In one lab, 8 studies with 453 subjects produced mostly unexpected results, yet only 5 papers were published and only 1 reported a null. Clear **file-drawer inflation**. **[abstract]**
- **Leng & Ludwig (2016), *Biological Psychiatry*.** Very little intranasal oxytocin reaches CSF, peripheral levels become supraphysiologic, and many oxytocin assays use discredited methods. Effects require pre-registration, dose-response curves and peripheral controls. **[abstract]**

Consequence: the gaze loop is worth building as **reciprocal attention**, because the behavioural half of it (dogs gaze, owners respond, behaviour feeds back) does not depend on the pharmacology. But nothing may be marketed on an "oxytocin" mechanism.

### 14. How far does animal empathy transfer? The honest answer

**de Waal (2008), *Annual Review of Psychology*; de Waal (2012), *Science*; Ben-Ami Bartal, Decety & Mason (2011), *Science*.** Empathy is phylogenetically ancient, multilayered, with shared representations across species. Rats freed trapped cagemates, discriminated an empty restrainer from a trapped cagemate, and shared chocolate. Empathy can be a main motivator of prosociality. **[abstracts]**

Strongest case for us: the mammalian caregiving and empathy system is old and is triggered by another's distress, so a pet's distress can genuinely recruit care.

Strongest objection: all of this involves live, physically present conspecifics. The work establishes that the **mechanism** plausibly exists. It does not show that humans grant a rendered artifact in-group status or perceived mind, and it does not show the resulting state persists as attachment.

**Bloom (2016), *Against Empathy*.** Empathy is capricious, parochial, and can motivate inequality and immorality; reasoned compassion is the more reliable basis. **[abstract-level, jacket summary]**
Design reading: designs that harvest raw empathic spikes are fragile. Deliberate, named, durable compassion is the more robust thing to build.

### 15. Off-topic documents, verified

- **40** Canup & Asphaug (2001), **41** Zhou et al. (2024), **42** NASA lunar laser ranging, **43** Benningfield (2024) "The End of the Eclipse". All lunar and planetary astrophysics under the header "So what (La lune)". No bearing on attachment. Left over from another chapter. **[abstracts verified for 40, 41, 43]**
- **52** Weber, *The Protestant Ethic and the Spirit of Capitalism* and "The Vocation of Science"; **53** Dawkins, *Unweaving the Rainbow*. Sociology and philosophy of science on disenchantment, under "Désenchantement / réenchantement du monde (2.2)". Off-topic for attachment, though plausibly deliberate if the thesis has a re-enchantment strand.
- **50, 51** Keating and Greenslade are journalism commentary illustrating the numbing theme, not primary evidence. The **Manuel de journalisme** handbook (Agnès) never parsed as a citation and is not a source document.
- **44** Fourie et al. is an encyclopedia chapter, filed under "Sources bonus"; useful but secondary.

### 16. Corrections made while reading

Three premises I started with were wrong and are fixed above: Epley et al. (2008) is **not** a story-reproduction study, Lewis et al. (2008) is a **game-character** attachment scale rather than a virtual-pet study, and the IKEA effect's "must be worth the cost" conditions belong to later summaries, not Norton et al. (2012).

Four citation records were wrong and have been repaired against Crossref/Europe PMC: paper 05 was a Baumeister & Vohs encyclopedia entry, 11 and 16 were journal reviews of Bowlby and Tinbergen rather than the monographs, and 48 was unresolvable under the abbreviated title your bibliography uses ("Differences in helping white and black victims") but resolves to Saucier et al., *Differences in Helping Whites and Blacks: A Meta-Analysis*. Paper 08 is likewise abbreviated to "Culture and cause" in `documents.md`; the real title is "Culture and cause: American and Chinese attributions for social and physical events".

Four papers have no abstract in any bibliographic API and are cited here from prior knowledge, flagged inline: Passman & Weisberg (1975), Fetherstonhaugh et al. (1997), Small et al. (2007), Lorenz (1943). Two records had an abstract belonging to a different paper and now carry none: Heider & Simmel (1944, whose record briefly held Ratajska's abstract) and Canup & Asphaug (2001, exoplanet text). Ratajska et al. (2020) was a false alarm in that cleanup — its abstract is genuine and has been restored from Crossref and checked against its preprint.

## Design levers, consolidated

Ordered roughly by strength of evidence.

1. **Motion before art.** Simultaneous large changes in speed and direction, with the body's axis aligned to travel, make a single rigid shape read as alive. Heider & Simmel's triangles needed nothing else.
2. **Goal legibility.** Equifinal paths, same destination, varying route. A pet that wants something reads as having wants; a pet that teleports reads as a script.
3. **Tune the baby schema as a slider.** Widen the face, raise the forehead ratio, enlarge the eyes; shrink nose and mouth. Supercute, supernormal, Mickey-Mouse territory.
4. **Reward the caretaker immediately.** Nucleus accumbens activity scales with schema. Care must pay out fast.
5. **Run both mind dials.** Experience (hunger, pain, joy) earns concern; Agency (choosing, remembering) earns respect but also invites blame. Mostly patient, brief agentic moments.
6. **Engineer the four Bowlby criteria.** Proximity, separation distress, safe haven, secure base. Then let the pet also soothe the user, because an aroused attachment system disables caregiving.
7. **Make care tasks complete.** Effort bonds only on success. Never manufacture effort without payoff.
8. **Make onboarding cost something.** Mild initiation buys nothing (Aronson & Mills).
9. **Ship the four character-attachment levers.** Identification, control, responsibility, suspension of disbelief.
10. **Make the pet a safe base and a reciprocal gaze loop.** It notices you, and it visibly reacts to being noticed.
11. **One named creature, never numbers.** No aggregates, no dashboards, no optimisation prompts, which measurably cool compassion.
12. **Frame it as vulnerable, never privileged.** Status cues reduce assumed capacity to suffer.
13. **Keep pets out of competing teams.** Group entitativity is the lever that manufactures counter-empathy.
14. **Do not market oxytocin.** The effect literature does not survive its own critique.
15. **Watch for heavy reliance.** It correlates with trauma, insecure attachment and BPD criteria.

## What is not established

- **No study in this corpus tests a virtual pet.** The nearest instruments are game-character attachment (Lewis et al.) and human-dog bonds. Everything mapped onto a web pet is inference.
- **No study tests whether a digital creature is granted in-group status.** This is the load-bearing assumption under every empathy design decision here.
- **The loneliness-anthropomorphism link is weak.** The 2024 registered replication (Elsherif et al.) found little support, and attachment anxiety predicts anthropomorphism better than loneliness.
- **Digital mediation may drain affect independently of magnitude.** Nothing here tests it.
- **The oxytocin-gaze loop has no verified human replication pathway**, given section 13.

### 2. Mind perception decides whether care feels deserved

Gray, Gray & Wegner (2007, *Science*) reduce perceived mind to two independent dimensions: **Experience** (hunger, fear, pain, pleasure, consciousness) and **Agency** (self-control, morality, planning, memory, thought). Experience drives moral concern and victimhood judgments; Agency drives responsibility and blame. Both increase the wish to treat the target as a person. **[abstract]**

This matters for a pet: **the two are separate dials.** Hunger, pain, joy and fear recruit care. Choosing, remembering, self-control earn respect but also invite blame when it misbehaves.

Gray & Wegner (2009, *JPSP*, 7 studies): perceived moral **agency and moral patiency are inversely related**. Actors of good or evil are seen as less vulnerable; recipients of good or evil are seen as less capable. The counterintuitive result: people will inflict more pain on a known good-doer than on someone who has done nothing. Casting a creature as pure **patient** (vulnerable, acted-upon) maximises protective sympathy. **[abstract]**

### 3. Cuteness is a hardwired, tunable, and rewarding dial

The chain is Lorenz → Tinbergen → Glocker:

- **Lorenz (1943)** proposes the innate *Kindchenschema*: infantile proportions are perceived as cute and release caretaking. **[abstract + prior knowledge for the feature list]**
- **Tinbergen (1951)** supplies the mechanism: **sign stimuli / releasers** and the **innate releasing mechanism**. A small set of exaggerated cues triggers a whole stereotyped behaviour sequence, no learning required. **[prior knowledge, book]**
- **Glocker et al. (2009, *Ethology*)** gives the actual numbers. Six ratios were manipulated on photos of 17 infants (8 boys, 9 girls → 51 faces); final samples 62 cuteness / 44 caretaking. Increase **face width**, **forehead length / face length**, **eye width / face width**. Decrease **nose length / head length**, **nose width / face width**, **mouth width / face width**. High-schema faces were rated cuter (F(2,59)=137.3, p<0.001) and produced stronger caretaking motivation (F(2,41)=40.0, p<0.001) than both unmanipulated and low-schema faces. Gender split: women high-vs-unmanipulated caretaking t=4.7, df=24, p<0.001; men t=0.8, df=18, **p=0.42, ns**. **[verified: papers/14 `## Verification`]**
- **Glocker et al. (2009, *PNAS*)** closes the loop: in 16 nulliparous women, increasing baby schema produced a **linear increase in right nucleus accumbens** BOLD (F(2,14)=12.96, P<0.001, high > unmanipulated > low), with anterior cingulate, precuneus and fusiform involvement, NAcc tracking fusiform activity. Cuteness ratings rose in parallel, F(2,14)=60.00, P<0.001. Caregiving motivation is therefore **appetitive and rewarding**, not merely dutiful. **[verified: papers/15 `## Verification`]**
- **Barrett (2010), *Supernormal Stimuli***: because the innate response scales with cue intensity, exaggerated artifacts (Mickey Mouse, teddy bears) pull harder than the real animals the cues evolved for. Exaggeration is legitimate and desirable here. **[TOC retrieved + prior knowledge]**

Consequence: **cuteness is a parameter, not an art direction.** It can be tuned per pet, and care should pay out immediately so the rewarding loop closes.

### 4. Attachment needs four criteria, not just familiarity

**Bowlby (1969/1982)** treats attachment as a biologically based, goal-corrected behavioural system, distinct from feeding and sex, whose set-goal is **felt security**. The behavioural criteria: **proximity maintenance**, **separation distress**, **safe haven** (seeking comfort under threat), **secure base** (exploring away from and returning to the caregiver). Repetition of threat → approach → comfort builds an internal working model that turns the figure into a conditioned source of safety. **[prior knowledge, book; the later currency debate is contested and not asserted here]**

**Solomon & George (1996)** supply the mirror image: the **caregiving system** is a separate goal-corrected system whose set-goal is keeping the dependent close and safe. It runs on an internal caregiving model, consolidates in adolescence, changes at the transition to parenthood, and **is disabled when the caregiver's own attachment system is highly aroused**. **[abstract]**

The pair is the actual engine. A pet that is only ever pleasant never triggers caregiving; a pet that is only ever in need is aversive. The loop is: pet needs → user cares → user feels relief and affection → pet reacts. One design consequence is explicit in Solomon & George: the pet must also be able to **soothe the user**, because an aroused attachment system disables the caregiving system. A pet that can only demand is a chore.

### 5. Guardrail from batch 2: do not encode disability as cute

O'Neill et al. (2022), VetCompass cross-sectional study, **905,544 dogs**, 4,308 Pugs. Pugs had **1.86× odds** (95% CI 1.72–2.01) of at least one disorder. Sharpest risks: brachycephalic obstructive airway syndrome OR **53.92** (36.22–80.28), stenotic nares 51.25, corneal ulceration 13.01. Protective: heart murmur 0.23, lipoma 0.24, aggression 0.31. **[abstract, OA protocol]**

The same neotenous proportions that make the breed sell are tied to the most severe welfare harms found. A virtual pet can take the full baby-schema appeal without modelling breathing-impaired anatomy as desirable.

### 6. Effort converts possession into attachment, but only on completion

**Norton, Mochon & Ariely (2012), *JCP*, 4 studies** (IKEA boxes, origami, Legos). In Experiment 1A (N=52) builders' willingness-to-pay averaged **$0.78 vs $0.48** for non-builders (t(50)=2.12, p<.05) — a **+62.5% premium**; liking 3.81 vs 2.50 (t(50)=3.58, p<.001). **[verified against the openly distributed HBS working paper 11-091: papers/19 `## Verification`]** The decisive detail: **completion is required.** Building then unbuilding, or being stopped halfway, dissipated the effect (published article, Experiment 2 — **[not stored locally]**). It also did not work prospectively: **92% (N=51)** preferred pre-assembled goods, χ²(1)=36.26, p<.001 **[verified, working paper]**.
*(Correction: the "worth the cost / not trivially self-verifying" IKEA-effect conditions belong to later summaries, not this paper. Marsh et al. 2018 found effort amount did not moderate the effect and attributed it to self-concept, emerging around age 5.)*

Design reading: care tasks must **visibly succeed**. A pet that gets sicker with no route to recovery is worse than no mechanic at all, because it manufactures effort without payoff.

**Aronson & Mills (1959), *JASP*, N=63.** Severe initiation (embarrassing material read aloud) produced higher liking than mild or no initiation, with mild ≈ control — effort justification needs real cost, but cost is not suffering: trivial friction buys nothing. Onboarding has a severity threshold. The condition means (severe M=97.6, mild M=81.8, control M=80.2; severe > control p<.01, severe > mild p<.05) are **[figures not stored locally — APA-gated, no abstract exposed; need the original]**.

### 7. Four levers of character attachment

**Lewis, Weber & Bowman (2008), *CyberPsychology & Behavior* 11(4):515-518.** Validated a **17-item Character Attachment scale** with four components: **identification/friendship, suspension of disbelief, control, responsibility** (scale structure confirmed in the stored abstract). The reported statistics — N≈270; RPG vs non-RPG M=3.96 vs 3.70, t(270)=2.94, p=.004; correlations with fantasy, arousal, enjoyment, playtime and addiction; the self-esteem × playtime interaction — are **[figures not stored locally — paywalled, need the original]**.
*(Correction: this is video-game character attachment, not a virtual-pet study. Still the best available instrument.)*

Four levers, directly actionable: the user **identifies** with the pet, **controls** it, feels **responsible** for it, and **suspends disbelief**. The fourth is the fragile one; everything else is scaffolding for it.

### 8. Reciprocity and the safe base

**Nagasawa et al. (2015), *Science*.** Dog gazing, unlike wolf gazing, raised owners' urinary oxytocin, raising owners' affiliation and the dogs' oxytocin; intranasal oxytocin increased dog gazing, which raised owner oxytocin again. An **interspecies positive feedback loop**. **[abstract]**
Design reading: the loop is the product. The pet must visibly notice you and measurably react to your attention, not just accumulate state.

**Passman & Weisberg (1975), *Developmental Psychology*.** In a novel playroom, children with a familiar blanket showed no distress and explored as much as those with mothers present, beating non-attached children given a blanket and all children given a favourite toy. A familiar nonsocial object works as a **secure base**. **[prior knowledge + secondary summaries; no abstract retrieved]**
Design reading: the pet's job is partly to lower arousal so the user can go do something else, not to monopolise attention.

**Hazan & Zeifman (1994).** Romantic pair bonds meet the same four attachment criteria, and the attachment functions appear in sequence: proximity seeking ~6-7 years, safe haven ~8-14, secure base and separation protest into late adolescence, then the partner. **[prior knowledge; chapter not retrieved]**

**Solomon & George's asymmetry matters here**: an over-aroused attachment system disables caregiving. A pet that only ever demands will eventually be resented, because it never soothes.

### 9. Anthropomorphism is motivated, which is both the opportunity and the risk

**Epley, Akalis, Waytz & Cacioppo (2008), *Psychological Science*.** Loneliness motivates anthropomorphism of gadgets and supernatural belief, with a fear-mood control ruling out general negativity (stored abstract confirms the mechanism; the specific values — Study 1 r=.53 vs r=.25 ns, Study 2 means 4.35 vs 3.71 — are **[figures not stored locally — paywalled, need the original]**). **(Correction: this is not a story-reproduction study; that premise is unsupported. And a 2024 large-N registered replication, Elsherif et al., found weak to no support for the loneliness-anthropomorphism correlation.)**

**Bartz, Tchalova & Fenerci (2016), *Psychological Science*, N=178.** Reminding participants of a close, supportive relationship **reduced** anthropomorphism. **Attachment anxiety predicted anthropomorphism more strongly than loneliness did.**

This is the most important negative result in the corpus for product design. Anthropomorphism is a **motivated search for connection that turns off once belonging is satisfied**. Two consequences: the target user is the anxious and the lonely, which makes this an ethically sensitive category; and a pet that positions itself as a substitute for people will be displaced the moment the user's life improves. Design alongside human relationships, not in place of them.

### 10. Guardrail: intense object reliance signals unmet need

**Hooley & Wilson-Murphy (2012), *J. Personality Disorders*, N=80 community sample.** Intense current attachment to transitional objects was significantly associated with meeting BPD criteria, more childhood trauma, less supportive early caregivers, and more adult attachment problems. **[abstract]**
Design reading: heavy reliance is a symptom marker. Worth instrumenting and watching, and a reason not to build dark-pattern retention mechanics around distress.

---