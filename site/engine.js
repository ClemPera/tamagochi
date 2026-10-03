export const SAVE_KEY = 'tomodachi.save.v1';
const OFFLINE_CAP_MIN = 12 * 60;
const STEP_MIN = 15;

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const nowMs = () => Date.now();

function freshStats() {
  return { food: 78, joy: 76, rest: 80, health: 82, bond: 6 };
}

function freshState(init = {}) {
  const t = nowMs();
  return {
    name: typeof init.name === 'string' && init.name.trim() ? init.name.trim().slice(0, 24) : 'Mochi',
    accentHue: Number.isFinite(init.accentHue) ? clamp(init.accentHue, 0, 360) : 12,
    stage: 'egg',
    alive: true,
    stats: { ...(init.stats || freshStats()) },
    bornAt: init.bornAt || t,
    ageDays: init.ageDays || 0,
    keepsakes: Array.isArray(init.keepsakes) ? [...init.keepsakes] : [],
    diary: Array.isArray(init.diary) ? [...init.diary] : [],
    pastLives: init.pastLives || 0,
    lineage: Array.isArray(init.lineage) ? [...init.lineage] : [],
    lastSeen: init.lastSeen || t,
    sleeping: false,
    sick: false,
    scared: false,
    separationProtest: false,
    exploring: false,
    excursionInMin: 0,
    lastExcursionSimMin: 0,
    simMinutes: 0,
    lowMinutes: 0,
    recoverMinutes: 0,
    criticalMinutes: 0,
    touches: 0,
    touchWindowStart: t,
    breakSuggested: false,
  };
}

function pushDiary(st, text) {
  st.diary.push(String(text));
  if (st.diary.length > 120) st.diary = st.diary.slice(-120);
}

function pushKeepsake(st, name) {
  st.keepsakes.push(String(name));
  if (st.keepsakes.length > 48) st.keepsakes = st.keepsakes.slice(-48);
}

// Never regress a grown stage; bond gates promotion but decay never demotes.
function refreshStage(st) {
  if (st.stage === 'egg' || !st.alive) return null;
  const { ageDays, stats } = st;
  const bond = stats.bond;
  let want = 'baby';
  if (ageDays >= 15) want = 'elder';
  else if (ageDays >= 9 && bond >= 55) want = 'adult';
  else if (ageDays >= 5 && bond >= 30) want = 'teen';
  else if (ageDays >= 2 && bond >= 10) want = 'child';
  const order = ['baby', 'child', 'teen', 'adult', 'elder'];
  if (order.indexOf(want) > order.indexOf(st.stage)) {
    st.stage = want;
    pushDiary(st, `${st.name} grew into a new season of smallness.`);
    pushKeepsake(st, growthKeepsake(want));
    return want;
  }
  return null;
}

function growthKeepsake(stage) {
  if (stage === 'child') return 'smooth pebble';
  if (stage === 'teen') return 'soft feather';
  if (stage === 'adult') return 'folded leaf';
  if (stage === 'elder') return 'silver thread';
  return 'warm speck';
}

const EXCURSION_FINDS = ['bent twig', 'pale shell', 'blue button', 'dry leaf', 'tiny acorn', 'sea marble'];

function maybeStartExcursion(st) {
  if (st.sleeping || !st.alive || st.stage === 'egg' || st.stage === 'baby') return null;
  if (st.exploring || st.sick || st.scared) return null;
  const s = st.stats;
  if (s.food < 55 || s.joy < 55 || s.rest < 50 || s.bond < 30) return null;
  if (st.simMinutes - st.lastExcursionSimMin < 240) return null;
  st.exploring = true;
  st.excursionInMin = 30;
  pushDiary(st, `${st.name} wandered off to peek at the world, knowing you are near.`);
  return 'left';
}

function finishExcursion(st) {
  st.exploring = false;
  st.excursionInMin = 0;
  st.lastExcursionSimMin = st.simMinutes;
  const find = EXCURSION_FINDS[Math.floor(Math.random() * EXCURSION_FINDS.length)];
  pushKeepsake(st, find);
  st.stats.joy = clamp(st.stats.joy + 5, 0, 100);
  pushDiary(st, `${st.name} came back from a little adventure with ${find}.`);
  return find;
}

function noteTouch(st) {
  const t = nowMs();
  if (t - st.touchWindowStart > 60 * 60 * 1000) {
    st.touchWindowStart = t;
    st.touches = 0;
    st.breakSuggested = false;
  }
  st.touches += 1;
  // Gentle reliance guardrail: suggest a breather, never punish or block.
  if (st.touches >= 24 && !st.breakSuggested) {
    st.breakSuggested = true;
    return ' Glad to have you — I will be right here while you stretch or rest a little.';
  }
  return '';
}

function ok(msg, completed = true, extra = {}) {
  return { ok: true, msg, completed, ...extra };
}
function fail(msg, extra = {}) {
  return { ok: false, msg, completed: false, ...extra };
}

export function statWord(n, kind = 'generic') {
  const v = clamp(Number(n) || 0, 0, 100);
  const band = v < 15 ? 0 : v < 35 ? 1 : v < 55 ? 2 : v < 80 ? 3 : 4;
  const table = {
    food: ['starving', 'hungry', 'peckish', 'content', 'full'],
    joy: ['lonely', 'blue', 'okay', 'cheerful', 'joyful'],
    rest: ['exhausted', 'tired', 'drowsy', 'rested', 'bright-eyed'],
    health: ['ailing', 'fragile', 'tender', 'sturdy', 'thriving'],
    bond: ['distant', 'shy', 'fond', 'close', 'devoted'],
    generic: ['faint', 'tender', 'okay', 'bright', 'glowing'],
  };
  return (table[kind] || table.generic)[band];
}

export function serialize(state) {
  return JSON.stringify(state);
}

export function deserialize(text) {
  let raw = {};
  try {
    raw = typeof text === 'string' ? JSON.parse(text) : { ...text };
  } catch { raw = {}; }
  const base = freshState();
  const st = { ...base, ...raw, stats: { ...base.stats, ...(raw.stats || {}) } };
  st.stats.food = clamp(+st.stats.food || 0, 0, 100);
  st.stats.joy = clamp(+st.stats.joy || 0, 0, 100);
  st.stats.rest = clamp(+st.stats.rest || 0, 0, 100);
  st.stats.health = clamp(+st.stats.health || 0, 0, 100);
  st.stats.bond = clamp(+st.stats.bond || 0, 0, 100);
  if (!Array.isArray(st.keepsakes)) st.keepsakes = [];
  if (!Array.isArray(st.diary)) st.diary = [];
  if (!Array.isArray(st.lineage)) st.lineage = [];
  return st;
}

function store() {
  try {
    if (typeof localStorage !== 'undefined') return localStorage;
  } catch { /* private mode */ }
  return null;
}

export function createEngine(initial = {}) {
  const state = freshState(initial);
  if (initial && initial.stage && initial.stage !== 'egg') {
    state.stage = initial.stage;
    refreshStage(state);
  }

  function tick(dtMinutes, env = {}) {
    const events = [];
    let dt = Number(dtMinutes);
    if (!Number.isFinite(dt) || dt <= 0) return { events, grew: null, died: false };
    if (!state.alive) return { events, grew: null, died: false };
    if (state.stage === 'egg') {
      state.simMinutes += dt;
      return { events, grew: null, died: false };
    }
    const dark = !!(env && env.dark);
    // Step long sims so excursion return, sick onset and warnings fire in order.
    let left = dt;
    let grew = null;
    let died = false;
    while (left > 0 && state.alive) {
      const step = Math.min(left, 60);
      left -= step;
      const hrs = step / 60;
      state.simMinutes += step;
      state.ageDays += step / 1440;

      const s = state.stats;
      const sleepDamp = state.sleeping ? 0.5 : 1;
      s.food = clamp(s.food - 7 * hrs * sleepDamp, 0, 100);
      s.joy = clamp(s.joy - 5 * hrs * sleepDamp, 0, 100);
      if (state.sleeping) s.rest = clamp(s.rest + 18 * hrs, 0, 100);
      else s.rest = clamp(s.rest - (dark ? 4.5 : 3.5) * hrs, 0, 100);

      // Health drifts toward the mean of the other needs; sickness drags it down.
      const target = (s.food + s.joy + s.rest) / 3;
      s.health = clamp(s.health + (target - s.health) * 0.18 * hrs, 0, 100);
      if (state.sick) s.health = clamp(s.health - 2 * hrs, 0, 100);

      // Bond only erodes slowly when needs go unmet; it never rises here.
      if (s.food < 30 || s.joy < 30 || s.rest < 30) s.bond = clamp(s.bond - 0.5 * hrs, 0, 100);

      // Sick after any core need sits under 20 for six sim-hours.
      if (s.food < 20 || s.joy < 20 || s.rest < 20) {
        state.lowMinutes += step;
        state.recoverMinutes = 0;
      } else {
        state.lowMinutes = Math.max(0, state.lowMinutes - step);
        if (state.sick && s.food >= 30 && s.joy >= 30 && s.rest >= 30) {
          state.recoverMinutes += step;
          if (state.recoverMinutes >= 120) {
            state.sick = false;
            state.recoverMinutes = 0;
            pushDiary(state, `${state.name} is feeling better after steady care.`);
            events.push({ type: 'recovered' });
          }
        }
      }
      if (!state.sick && state.lowMinutes >= 360) {
        state.sick = true;
        state.scared = true;
        state.lowMinutes = 0;
        pushDiary(state, `${state.name} caught a little chill and needs gentle care.`);
        events.push({ type: 'sick' });
      }
      if (!state.sick && s.health < 25 && s.joy < 25) state.scared = true;

      // Secure-base excursions: brief, self-limited, always ending in return.
      if (state.exploring) {
        state.excursionInMin -= step;
        if (state.excursionInMin <= 0) {
          const find = finishExcursion(state);
          events.push({ type: 'returned', find });
        }
      } else if (maybeStartExcursion(state)) {
        events.push({ type: 'excursion' });
      }

      const g = refreshStage(state);
      if (g) {
        grew = g;
        events.push({ type: 'grew', stage: g });
      }

      // Death only after health at or under 15 for a full sim-day, with warnings first.
      if (s.health <= 15) {
        state.criticalMinutes += step;
        if (state.criticalMinutes >= 1440) {
          die();
          died = true;
          events.push({ type: 'died' });
          break;
        } else if (state.criticalMinutes === step) {
          pushDiary(state, `${state.name} is very weak. Staying close and keeping them fed and rested matters most now.`);
          events.push({ type: 'critical' });
        } else {
          events.push({ type: 'critical-ongoing' });
        }
      } else if (s.health > 18) {
        if (state.criticalMinutes > 0) events.push({ type: 'rallied' });
        state.criticalMinutes = 0;
      }
    }
    return { events, grew, died };
  }

  function needAlive() {
    if (!state.alive) return fail(`${state.name} is gone, but their story stays with you.`);
    return null;
  }

  function feed() {
    const dead = needAlive();
    if (dead) return dead;
    if (state.stage === 'egg') return fail('The egg needs warmth and waiting, not food yet.');
    if (state.sleeping) return fail('Fast asleep — waking first would be kinder.');
    if (state.stats.food >= 95) return fail(`${state.name} is full and happy. A little company is plenty.`);
    state.stats.food = clamp(state.stats.food + 18, 0, 100);
    state.stats.health = clamp(state.stats.health + 2, 0, 100);
    state.stats.bond = clamp(state.stats.bond + 3, 0, 100);
    pushDiary(state, `Shared a warm meal with ${state.name}.`);
    return ok(`${state.name} eats slowly, then looks up, glad.${noteTouch(state)}`);
  }

  function play() {
    const dead = needAlive();
    if (dead) return dead;
    if (state.stage === 'egg') return fail('Not yet — little one still needs quiet to grow.');
    if (state.sleeping) return fail('Let them dream a little longer; play can wait.');
    if (state.stats.rest < 12) return fail(`${state.name} is too sleepy to play. A nap together first?`);
    state.stats.joy = clamp(state.stats.joy + 16, 0, 100);
    state.stats.food = clamp(state.stats.food - 4, 0, 100);
    state.stats.rest = clamp(state.stats.rest - 3, 0, 100);
    state.stats.bond = clamp(state.stats.bond + 3, 0, 100);
    pushDiary(state, `Played a small game with ${state.name}.`);
    return ok(`${state.name} lights up and trots back for more.${noteTouch(state)}`);
  }

  function comfortGain() {
    // Safe haven: comfort counts double while frightened or unwell.
    return state.sick || state.scared ? 4 : 2;
  }

  function pet() {
    const dead = needAlive();
    if (dead) return dead;
    if (state.stage === 'egg') return fail('You rest a hand near the egg. It feels a little warmer.');
    const gain = comfortGain();
    state.stats.joy = clamp(state.stats.joy + 4, 0, 100);
    state.stats.bond = clamp(state.stats.bond + gain, 0, 100);
    if (state.scared) {
      state.scared = false;
      pushDiary(state, `Held ${state.name} close until the trembling eased.`);
      return ok(`${state.name} leans in and breathes easier, soothed by you.${noteTouch(state)}`);
    }
    return ok(`${state.name} leans into your hand, soft and warm.${noteTouch(state)}`);
  }

  // Bidirectional soothing: you steady them, and they steady you back.
  function soothe() {
    const dead = needAlive();
    if (dead) return dead;
    if (state.stage === 'egg') return fail('You hum softly near the egg and wait.');
    const wasAfraid = state.scared || state.sick;
    const gain = wasAfraid ? 4 : 2;
    state.stats.joy = clamp(state.stats.joy + 6, 0, 100);
    state.stats.bond = clamp(state.stats.bond + gain, 0, 100);
    state.scared = false;
    pushDiary(state, `Breathed slowly together with ${state.name}.`);
    if (wasAfraid) return ok(`${state.name} settles against you, and the quiet settles over you too.${noteTouch(state)}`);
    return ok(`You breathe together for a while. ${state.name} seems glad to be near.${noteTouch(state)}`);
  }

  function tuck() {
    const dead = needAlive();
    if (dead) return dead;
    if (state.stage === 'egg') return fail('The egg is already tucked in warm.');
    if (state.sleeping) return fail('Already dreaming softly.');
    state.sleeping = true;
    state.stats.joy = clamp(state.stats.joy + 2, 0, 100);
    state.stats.bond = clamp(state.stats.bond + 1, 0, 100);
    pushDiary(state, `Tucked ${state.name} in for a nap.`);
    return ok(`${state.name} curls up small and drifts off. Rest well — they will be here.${noteTouch(state)}`);
  }

  function wake() {
    const dead = needAlive();
    if (dead) return dead;
    if (!state.sleeping) return fail('Already awake and puttering about.');
    state.sleeping = false;
    return ok(`${state.name} blinks awake and looks for you.${noteTouch(state)}`);
  }

  function cleanSick() {
    const dead = needAlive();
    if (dead) return dead;
    if (!state.sick) return fail(`${state.name} seems well right now. A cuddle keeps it that way.`);
    const s = state.stats;
    if (s.food >= 25 && s.joy >= 25 && s.rest >= 25) {
      state.sick = false;
      state.scared = false;
      state.lowMinutes = 0;
      state.recoverMinutes = 0;
      s.health = clamp(s.health + 10, 0, 100);
      s.bond = clamp(s.bond + 5, 0, 100);
      pushDiary(state, `Nursed ${state.name} back to comfort with medicine and patience.`);
      return ok(`${state.name} feels the care working and rests easier now. Well done.${noteTouch(state)}`);
    }
    s.joy = clamp(s.joy + 3, 0, 100);
    s.bond = clamp(s.bond + 2, 0, 100);
    return ok(`${state.name} appreciates the comfort. A little food and rest will help the medicine along.${noteTouch(state)}`);
  }

  function hatchEgg() {
    if (!state.alive) return fail('This story has ended; a new one can begin when you are ready.');
    if (state.stage !== 'egg') return fail('Already hatched and glad to see you.');
    state.stage = 'baby';
    state.bornAt = nowMs();
    state.ageDays = 0;
    state.stats = { food: 75, joy: 72, rest: 78, health: 80, bond: 6 };
    pushDiary(state, `${state.name} hatched, blinking and new.`);
    pushKeepsake(state, 'first shell');
    return ok(`${state.name} hatches, tiny and blinking, and looks straight at you. Welcome.`, true);
  }

  function die() {
    if (!state.alive) return fail('Already at rest.');
    state.alive = false;
    state.sleeping = false;
    state.exploring = false;
    state.pastLives += 1;
    state.lineage.push({
      name: state.name,
      ageDays: Math.round(state.ageDays * 10) / 10,
      stage: state.stage,
      endedAt: nowMs(),
    });
    pushDiary(state, `${state.name} slipped away quietly, loved the whole time.`);
    return ok(`${state.name} slipped away quietly, loved the whole time. Their keepsakes stay.`, true);
  }

  function rebirth() {
    if (state.alive) return fail(`${state.name} is still here — no need to begin again yet.`);
    const keepsakes = [...state.keepsakes];
    const diary = [...state.diary];
    const lineage = [...state.lineage];
    const pastLives = state.pastLives;
    const t = nowMs();
    state.stage = 'egg';
    state.alive = true;
    state.stats = freshStats();
    state.bornAt = t;
    state.ageDays = 0;
    state.keepsakes = keepsakes;
    state.diary = diary;
    state.pastLives = pastLives;
    state.lineage = lineage;
    state.lastSeen = t;
    state.sleeping = false;
    state.sick = false;
    state.scared = false;
    state.separationProtest = false;
    state.exploring = false;
    state.excursionInMin = 0;
    state.lowMinutes = 0;
    state.recoverMinutes = 0;
    state.criticalMinutes = 0;
    state.breakSuggested = false;
    pushDiary(state, 'A new egg waits, warm with possibility.');
    return ok('A new egg waits, warm with possibility. The love carries over; the story starts fresh.', true);
  }

  // Separation protest: an intense, joyful reunion after a long absence — never a scolding.
  function getGreeting() {
    if (!state.alive) return { intense: false, text: '' };
    if (state.separationProtest) {
      state.separationProtest = false;
      state.stats.bond = clamp(state.stats.bond + 2, 0, 100);
      state.stats.joy = clamp(state.stats.joy + 4, 0, 100);
      pushDiary(state, `${state.name} rushed over on your return, overjoyed to see you.`);
      return { intense: true, text: `${state.name} notices you and comes rushing over, glowing all over — missed you, missed you, so glad you are back.` };
    }
    return { intense: false, text: `${state.name} looks up, glad you are here.` };
  }

  function getStatus() {
    const s = state.stats;
    return {
      name: state.name,
      stage: state.stage,
      alive: state.alive,
      sleeping: state.sleeping,
      sick: state.sick,
      scared: state.scared,
      words: {
        food: statWord(s.food, 'food'),
        joy: statWord(s.joy, 'joy'),
        rest: statWord(s.rest, 'rest'),
        health: statWord(s.health, 'health'),
        bond: statWord(s.bond, 'bond'),
      },
    };
  }

  function isCritical() {
    return state.alive && state.stats.health <= 15;
  }

  function simulateOffline(awayMinutes) {
    const capped = clamp(Number(awayMinutes) || 0, 0, OFFLINE_CAP_MIN);
    if (capped >= 240) state.separationProtest = true;
    let left = capped;
    const allEvents = [];
    while (left > 0) {
      const step = Math.min(left, STEP_MIN);
      const r = tick(step, {});
      allEvents.push(...r.events);
      left -= step;
      if (!state.alive) break;
    }
    state.lastSeen = nowMs();
    return { simulatedMinutes: capped, events: allEvents };
  }

  function save() {
    const s = store();
    state.lastSeen = nowMs();
    const payload = JSON.stringify({ version: 1, savedAt: state.lastSeen, state });
    if (s) {
      try { s.setItem(SAVE_KEY, payload); } catch { /* storage full or blocked */ }
    }
    return payload;
  }

  function load() {
    const s = store();
    if (!s) return { ok: false, msg: 'No saved story on this device yet.', completed: false, found: false };
    let raw = null;
    try { raw = s.getItem(SAVE_KEY); } catch { raw = null; }
    if (!raw) return { ok: false, msg: 'No saved story on this device yet.', completed: false, found: false };
    let parsed = {};
    try { parsed = JSON.parse(raw); } catch { parsed = {}; }
    const incoming = deserialize(parsed.state || parsed);
    Object.assign(state, incoming);
    const savedAt = parsed.savedAt || state.lastSeen || nowMs();
    const awayMinutes = (nowMs() - savedAt) / 60000;
    const sim = simulateOffline(awayMinutes);
    return { ok: true, msg: 'Welcome back.', completed: true, found: true, awayMinutes: sim.simulatedMinutes, events: sim.events };
  }

  function setName(name) {
    const clean = String(name || '').trim().slice(0, 24);
    if (!clean) return fail('A name with a little love in it works best.');
    state.name = clean;
    return ok(`${clean} — a good name. Said softly, it already sounds like home.`);
  }

  return {
    state,
    tick,
    feed, play, pet, soothe, tuck, wake,
    cleanSick, medicine: cleanSick,
    hatchEgg, rebirth, die,
    getGreeting, consumeGreeting: getGreeting, acknowledgeReturn: getGreeting,
    getStatus, isCritical,
    simulateOffline,
    save, load,
    serialize: () => serialize(state),
    setName,
    dismissBreak() { state.breakSuggested = false; },
  };
}
