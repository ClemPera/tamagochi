# Prior art: how successful virtual companions created attachment

Companion to `virtual_attachment.md` ("Design levers, consolidated", 15 levers).
This file answers: what did shipped companions actually do, and what should we steal
for a cute browser friend needing only a few check-ins/day? No code, mechanics only.

Lever cross-refs like [L1] point at the 15 design levers in `virtual_attachment.md`.

## Tamagotchi (Bandai, 1996, Gen 1/2)

### 1. Two 4-heart meters + attention beep
What it is: Hunger and Happiness each 0-4 hearts decaying on real-time timers (~minutes on originals, capped slower on rereleases); the device beeps only when a heart empties or the creature otherwise needs you. Proven by the original P1/P2: kids carried it to school because missing the beep had consequences. Adapt: keep exactly two needs, decay over ~4-8 hours so 2-3 check-ins/day suffice, and make the browser tab/pet visibly call (animation + sound) rather than silently draining numbers [L11].

### 2. Discipline shapes who it becomes, not just how full it is
What it is: occasionally the creature calls with full meters and refuses food/play; only Scold works, adding +25% discipline, and discipline level at evolution gates which adult you get (Mametchi vs Kuchipatchi tiers). Proven by Gen 1 reverse-engineering: care mistakes pick teen tier, discipline picks adult tier. Adapt: 1-2 "misbehave" moments per growth stage where the right response is a firm tap, not a treat; result visibly changes adult form/color/personality, giving replayability without extra daily burden.

### 3. Real death with a good-care farewell
What it is: neglect (starved, sick too long, poop left out) or old age kills; well-cared adults lay an egg before the angel/ghost screen. Proven by Tamagotchi's schoolyard infamy: children cried, press covered funerals, which is why the memory stuck 30 years. Adapt: do NOT ship sudden permadeath for a casual web pet, but keep finite lifespans/generations — e.g. after ~30-60 days it "wanders off, leaving an egg with one inherited trait" — so care quality writes family history instead of just a high score [L6, L7].

### 4. Poop and sickness as legible, curable neglect states
What it is: poop appears on screen if uncleaned, causes sickness (skull icon, refuses food/play); one Medicine button cures it if caught in time. Proven by Tamagotchi: the cheapest pixel art in the game created the strongest guilt/rescue arc. Adapt: one "mess" state max, always curable within the next check-in, with a big visible recovery celebration — effort must end in success or it un-bonds rather than bonds [L7].

## Nintendogs (Nintendo DS, 2005)

### 5. Name it by voice, touch it by stylus
What it is: you speak the puppy's name (scratchy 2005 recognition) and stroke it with the stylus to teach tricks; it cocks its head when it almost-understands. Proven by Nintendogs (~24M copies): reviews consistently cite naming + petting, not contests, as the hook. Adapt: let the user type/speak a name once, then have the creature react to that string (excited hop when named in greetings, sad when misspelled by others); petting = pointer stroke with purr + lean-in — direct tactile contingency beats any stat [L10].

### 6. It cannot die, but it can disappoint
What it is: Nintendogs never die or run away; neglect just stalls trick-learning, dirties fur, and loses contests, while Bark Mode wireless meets reward showing up. Proven as the anti-Tamagotchi: safe for kids and long breaks, still retained via guilt-lite + social display. Adapt: copy this for a low-burden web pet — absence pauses growth and leaves a wistful "missed you" animation, never rot or death spirals; social flex (shareable portrait/room) replaces punishment as the reason to return [L15].

## Neopets (1999-web, still live)

### 7. One pet, whole world of daily appointments around it
What it is: your Neopet sits inside an economy of once-a-day shops, faerie quests, stock market, Battledome, and full outfit customization (Wardrobe). Proven by 25 years of retention: the pet is the identity anchor, dailies are the reason to visit. Adapt: give the browser friend 2-3 tiny external appointments (morning forage, evening story) that refresh on a clock and are visible from the pet's room; keep customization (hats, room wallpaper) as the coin sink, since showing off care outperforms leaderboard competition [L13].

## Pou (Zakeh, 2012 mobile, 100M+ downloads)

### 8. Minigames fund care; lab potions invite experimentation
What it is: hunger/health/fun/energy meters refilled with food/cleaners, but coins to buy them come only from simple minigames; the Lab sells potions that temporarily transform Pou. Proven by Pou outliving dozens of Tamagotchi clones: the loop "care -> broke -> play 2 min -> care again" paces sessions without timers. Adapt: one optional 30-second minigame (catch falling fruit) that pays for treats/decor; plus one safe "experiment" slot (feed weird mushroom, get surprise color for a day) for curiosity without permanent harm [L7].

## Finch: Self-Care Pet (2021 app, ~10M MAU, 54%/37% D1/D7)

### 9. Invert the loop: the bird grows when YOU grow
What it is: completing real self-care (breathe, journal, stretch, goal check) earns energy that feeds the birch-bird and sends it on adventures; neglecting yourself stalls the bird, never kills it. Proven by Finch's near-5-star scale in a crowded wellness market and Deconstructor of Fun's retention teardown. Adapt: tie 1-2 pet rewards to tiny real-world check-ins ("drank water", "stood up") rather than in-game grinding — the pet becomes an externalized conscience that cannot argue back, which is stickier and kinder than hunger timers [L6, L15].

### 10. Micropets + adventures: collect without splitting the bond
What it is: the main finch stays singular while earned Micropets (hatch after completing a goal 7x, grow after 7 adventures) orbit as sidekicks. Proven by Finch events and the Micropet Lab: collectors stay busy without the main bond diluting. Adapt: keep ONE named creature [L11] and let everything else be visitors/souvenirs from its "adventures while you were away" — collectible, displayable, never competing for care meters.

### 11. Widget as living window + appointment board
What it is: the homescreen widget shows the pet living (adventuring in progress, sleeping at night), one progress bar toward the next reward, and micro-events mapped to morning/evening rhythm — no spam pushes. Proven by Finch's widget teardown: passive presence beats notifications. Adapt: make the browser tab title, favicon, or an optional PWA badge do this job — "back in 2h with a story" shown passively, so returning feels like checking on a friend, not clearing an alert.

## Minecraft wolves (Mojang, tamed since Beta 1.4)

### 12. Tame with effort, seal with a name, mourn with a message
What it is: feeding bones tames probabilistically, a name tag names permanently, and since 15w38a every tamed death prints a chat line to its owner ("Biscuit was slain..."). Proven by a decade of player stories, memorial posts, and "my dog died, I quit the world" lore — the cheapest retention mechanic ever shipped. Adapt: require a small taming ritual (offer food 2-3 times), then a naming ceremony, then remember everything: first-met date, likes, a memorial shelf if a generation ends — naming + history is the cheapest attachment tech available [L9, L11].

### 13. Useful companionship + legible loyalty states
What it is: tamed wolves sit/stay on command, teleport to you when lost, whine at low HP with tail droop, and fight beside you (kills even count as player kills). Proven by wolves remaining the default companion despite horses, cats, parrots: they help AND show need. Adapt: give the browser friend one visible way to help (finds a coin/gift while away, cheers when you complete a task) and one legible hurt state (droopy tail/ears at low mood) curable by one action — Agency earns respect, Experience earns concern, keep both dials turning [L5].

## Pokemon-Amie / Refresh / Camp (3DS/Switch, from X/Y 2013)

### 14. Stroke-and-feed minigame that pays off in real battles
What it is: petting (watch for the "dislike" flinch spots), feeding Poke Puffs, and playing with full/enjoyment/affection meters grants crits, evades, EXP, and shrug-off-status in battle. Proven by Smogon/Bulbapedia documentation and speedrun affection guides: players who never touch minigames still learn Amie matters. Adapt: petting/feeding quality should grant a visible next-visit bonus ("well-loved: brings you a gift tomorrow") so tenderness has stakes beyond a heart meter [L4].

### 15. Split Affection (bond) from Friendship (history)
What it is: Affection (Amie hearts, per-mon) and Friendship (evolution/shops value, hidden) are separate numbers with separate effects. Proven by confusion FAQs that still resolved into depth: two tracks let short-term mood and long-term trust vary independently. Adapt: copy the split — Mood (today: happy/sad, resets fast) vs Trust (lifetime: grows only via completed care, never decays) — so a bad day never wipes months of bond [L6].

## Dreamies / Yume Neko Dream Cat (Sega Toys, physical)

### 16. Touch zones with distinct voices, no screen needed
What it is: five body sensors; head pats purr, tail pulls meow-complain, scruff-lift goes limp — a purely tactile contingency loop (note: "Dreamies" here = Sega's Yume Neko Dream Cat line, localized as Dream Pets). Proven by its long shelf life as a comfort toy for elderly/kids: location-specific reactions read as personality with zero meters. Adapt: give the browser pet 2-3 clickable zones with different reactions (head = happy wiggle, belly = grumpy-then-giggly after trust is high, back = sleepy lean) — motion + sound contingency alone buys animacy [L1, L10].

## Cross-cutting craft: onboarding, loop, juice, ethical retention, offline

### 17. Teach without a manual: constrain, demonstrate, then release
What it is: Mario 1-1 / Portal-style invisible tutorial — first screen allows only one action, an NPC or ghost demonstrates it, then the constraint lifts. Proven across Nintendo onboarding teardowns and UX studies: completion beats explanation. Adapt: first visit = egg that hatches only when stroked; second = one food offered, creature demonstrates eating path; third = mess appears with exactly one glowing button — three scripted wins, zero text walls, then free play [L7, L8].

### 18. Core loop with real stakes but guaranteed recovery
What it is: "suffer but recover" — the pet visibly droops when neglected but always bounces back fully with one or two good check-ins (Chou's pet-companion sweet spot). Proven negatively by Tamagotchi school bans (too harsh) and positively by Finch/Cozy games (Animal Crossing weeds, never ruins). Adapt: design the loop as notice -> care (under 60s) -> visible joy + small keepsake, with neglect costing time/story, never stats, appearance, or life — stakes you can hug away [L6, L15].

### 19. Juice every care act like it is the game
What it is: game-feel essentials — squash-and-stretch on pet/feed button, particle hearts/crumbs, pitch-rising chime per heart filled, creature hop-to-food pathing instead of teleporting. Proven by "juice" canon (Swink, Jonasson, GDC feel talks): response density, not art budget, makes actions feel alive. Adapt: each of ~4 care verbs gets unique motion + sound + aftermath (fed = round bounce, petted = eye-close lean, cleaned = shake-spray, played = zoomies); goal-legible pathing matters more than sprite detail [L1, L2].

### 20. Retain with appointments and repair, never shame or FOMO
What it is: ethical retention kit — fixed-time appointments ("adventure back at 6pm"), streak repair (Duolingo-style one-tap forgive, Finch-style no streaks on core bond), surprise delight over loss threats. Proven by cozy-game literature (Animal Crossing, Stardew) and streak-burnout research: guilt spikes D7 but kills D90 and selects for anxious over-users [L15]. Adapt: one daily surprise window + forgiving "missed you" greeting that rewards return instead of tallying absence; never show meters as red/failing, show the creature as waiting-hopeful.

### 21. Offline progress as a welcome-back story, capped and kind
What it is: idle-game best practice — bank offline time, convert to a short illustrated report ("while you were away: napped, found 3 berries, dreamed of you"), cap at ~8-12h value, run at reduced rate, never punish. Proven by idle/Animal Crossing genre norms and Tideward/Machinations teardowns: uncapped accrual breaks economy, zero accrual breaks trust. Adapt: each return shows 1-3 souvenirs + one-sentence diary entry sized to absence (minutes vs overnight), with a small "dreamed of you" bonus that makes leaving feel safe — presence while away is the whole trick [L6, L10].

## Sources consulted
- Tamagotchi P1/P2 care guides (Tamagotchi Wiki, thaao.net P1 guide), Gen-1 solve writeups (Hive), Wikipedia history.
- Nintendogs: Lost Garden "non-game that barked" critique, IWATA Asks Nintendogs+Cats, Bark Mode docs; dog-never-dies confirmation via JustAnswer/Nintendo support threads.
- Neopets: JellyNeo/SunnyNeo dailies economy, stock/Battledome guides, Guardian retrospective.
- Pou: Wikipedia/Kiddle summary, Poupedia level/coin pages, r/Pou money-grinding threads.
- Finch: Play Store listing, Finch FAQ/Help (Micropet Lab), HabitBox/Lifehacker reviews, Deconstructor of Fun widget teardown (54%/37% D1/D7 vs Duolingo 51%/35%), Yu-kai Chou Octalysis GT#135 pet-companion analysis.
- Minecraft wolves: Minecraft Wiki wolf history (taming, name-tag death messages 15w38a, sit/teleport/combat-kill credit).
- Pokemon-Amie: Bulbapedia Amie page, Smogon Enjoying Pokemon-Amie (affection/fullness/enjoyment), affection-bonus guides.
- Dreamies: Sega Toys Yume Neko Dream Cat / Dream Pets line (Japan Trend Shop, SlashGear review, Pink Tentacle sensor breakdown) — interpreted as requested prior art; flag if a different Dreamies was meant.
- Craft: Machinations idle-game design + Tideward offline-progression guide, r/incremental_games offline threads; game-feel/juice (Brad Woods garden, GMTK Secrets of Game Feel) and game-onboarding UX (UX Collective, Nerdy Teachers PICO-8 methods); dark-pattern/streak ethics (Canvs, NerdSip, Chou streak-design, Lost Garden cozy games).
