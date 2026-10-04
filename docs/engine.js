export const SAVE_KEY = 'tomodachi.save.v2';

const OFFLINE_CAP_MIN = 720;
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const nowMs = () => Date.now();
const todayStr = () => dayStrOf(new Date());
const dayStrOf = (d) => {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
};
const yesterdayStr = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dayStrOf(d);
};
const streakWord = (n) => {
  const words = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  if (n >= 1 && n <= 10) return words[n];
  return 'many';
};

const SPARK_ORDER = ['bright', 'soft', 'sleepy', 'spent'];
const sparkIdx = (s) => {
  const i = SPARK_ORDER.indexOf(s);
  return i < 0 ? 0 : i;
};
const GIFT_ITEMS = [
  ['warm button', 'kept from an unprompted gift — carried over for no reason, just wanted you to have it'],
  ['bent straw', 'kept from an unprompted gift — found on a quiet wander and saved for you'],
  ['round pebble', 'kept from an unprompted gift — smooth from being carried with care'],
];
function daysBetween(aStr, bStr) {
  try {
    const a = new Date(String(aStr) + 'T00:00:00Z');
    const b = new Date(String(bStr) + 'T00:00:00Z');
    if (isNaN(a) || isNaN(b)) return 9999;
    return Math.round((b - a) / 86400000);
  } catch { return 9999; }
}
function isNightHour(h) { return h >= 21 || h < 7; }
function isMorningHour(h) { return h >= 5 && h < 12; }

export function statWord(n, kind) {
  const v = clamp(Number(n) || 0, 0, 100);
  if (kind === 'belly') {
    if (v >= 70) return 'content';
    if (v >= 50) return 'peckish';
    if (v >= 20) return 'hungry';
    return 'starving';
  }
  if (kind === 'heart') {
    if (v >= 80) return 'cheerful';
    if (v >= 55) return 'okay';
    if (v >= 25) return 'blue';
    return 'lonely';
  }
  if (kind === 'sleep') {
    if (v >= 70) return 'rested';
    if (v >= 40) return 'drowsy';
    if (v >= 15) return 'tired';
    return 'exhausted';
  }
  if (kind === 'health') {
    if (v >= 70) return 'sturdy';
    if (v >= 40) return 'tender';
    if (v >= 20) return 'fragile';
    return 'ailing';
  }
  if (kind === 'trust') {
    if (v >= 85) return 'devoted';
    if (v >= 55) return 'close';
    if (v >= 30) return 'fond';
    if (v >= 10) return 'shy';
    return 'distant';
  }
  if (kind === 'mood') {
    if (v >= 80) return 'glowing';
    if (v >= 60) return 'bright';
    if (v >= 40) return 'okay';
    if (v >= 20) return 'tender';
    return 'faint';
  }
  if (v >= 80) return 'glowing';
  if (v >= 60) return 'bright';
  if (v >= 40) return 'okay';
  if (v >= 20) return 'tender';
  return 'faint';
}

function pushDiary(st, text) {
  st.diary.push(String(text));
  if (st.diary.length > 120) st.diary = st.diary.slice(-120);
}

function pushKeepsake(st, name, story) {
  const n = String(name || '').slice(0, 48) || 'small keepsake';
  const s = String(story || `Kept with ${st.name} on a quiet day.`);
  st.keepsakes.push({ name: n, story: s });
  if (st.keepsakes.length > 48) st.keepsakes = st.keepsakes.slice(-48);
}

function growthKeepsakeFor(stage, name) {
  if (stage === 'child') return ['smooth pebble', `Kept from the day ${name} grew into childhood — found by the sun spot.`];
  if (stage === 'teen') return ['soft feather', `Kept from the day ${name} grew braver — found after a little adventure.`];
  if (stage === 'adult') return ['folded leaf', `Kept from the day ${name} grew steady — folded with care.`];
  if (stage === 'elder') return ['silver thread', `Kept from the day ${name} grew gentle and slow — saved for the story shelf.`];
  return ['warm speck', `Kept with ${name} on a quiet day.`];
}

const EXCURSION_FINDS = [
  ['bent twig', 'found on a short wander near home'],
  ['pale shell', 'found by listening near the water'],
  ['blue button', 'found on a little adventure out in the world'],
  ['dry leaf', 'found where the sun falls warm'],
  ['tiny acorn', 'found under the big quiet tree'],
  ['sea marble', 'found where the path turns toward the sea'],
];

function freshState(init = {}) {
  const t = nowMs();
  const st = {
    name: 'Mochi',
    accentHue: 12,
    stage: 'egg',
    alive: true,
    needs: { belly: 80, heart: 80, sleep: 80 },
    health: 82,
    moodWord: 'bright',
    trust: 0,
    bornAt: t,
    ageDays: 0,
    ritualsDone: 0,
    keepsakes: [],
    diary: [],
    pastLives: 0,
    lineage: [],
    lastSeen: t,
    sleeping: false,
    sick: false,
    scared: false,
    warnStage: 0,
    warningsShown: {},
    newbornUntil: 0,
    lastExcursionDay: '',
    neglectDays: 0,
    simMinutes: 0,
    breakSuggested: false,
    careCount: 0,
    careWindowStart: 0,
    chillDemo: false,
    thinMinutes: 0,
    singleBottomMinutes: 0,
    doubleLowMinutes: 0,
    sickMinutes: 0,
    criticalMinutes: 0,
    recoverMinutes: 0,
    missedYou: false,
    lastNursedDay: '',
    nurseMentionedDay: '',
    lastGiftDay: '',
    lastGiftName: '',
    giftMentionedDay: '',
    breakfastStreak: 0,
    lastBreakfastDay: '',
    breakfastMentionedDay: '',
    spark: 'bright',
    lastSunFleckDay: '',
    lastSunFleckKeepsakeDay: '',
    initiativeDay: '',
    initiativeCount: 0,
    unpromptedGiftWeek: [],
    lastGrewDay: '',
    annivMentioned: {},
    lastTuckWasNight: false,
    pendingReturn: null,
    lastReturnInitiativeDay: '',
    lastReturnInitiativeKind: '',
    lastRushedDay: '',
    rushedVariant: 0,
    rushedIdx: 0,
  };
  if (typeof init.name === 'string' && init.name.trim()) st.name = init.name.trim().slice(0, 24);
  if (Number.isFinite(init.accentHue)) st.accentHue = clamp(init.accentHue, 0, 360);
  if (typeof init.stage === 'string') st.stage = init.stage;
  if (typeof init.alive === 'boolean') st.alive = init.alive;
  if (init.needs && typeof init.needs === 'object') {
    if (Number.isFinite(+init.needs.belly)) st.needs.belly = clamp(+init.needs.belly, 0, 100);
    if (Number.isFinite(+init.needs.heart)) st.needs.heart = clamp(+init.needs.heart, 0, 100);
    if (Number.isFinite(+init.needs.sleep)) st.needs.sleep = clamp(+init.needs.sleep, 0, 100);
  }
  if (Number.isFinite(+init.health)) st.health = clamp(+init.health, 0, 100);
  if (typeof init.moodWord === 'string' && init.moodWord) st.moodWord = init.moodWord;
  if (Number.isFinite(+init.trust)) st.trust = clamp(+init.trust, 0, 100);
  if (Number.isFinite(+init.bornAt)) st.bornAt = +init.bornAt;
  if (Number.isFinite(+init.ageDays)) st.ageDays = Math.max(0, +init.ageDays);
  if (Number.isFinite(+init.ritualsDone)) st.ritualsDone = Math.max(0, Math.floor(+init.ritualsDone));
  if (Array.isArray(init.keepsakes)) st.keepsakes = [...init.keepsakes];
  if (Array.isArray(init.diary)) st.diary = [...init.diary].map(String).slice(-120);
  if (Number.isFinite(+init.pastLives)) st.pastLives = Math.max(0, Math.floor(+init.pastLives));
  if (Array.isArray(init.lineage)) st.lineage = [...init.lineage];
  if (Number.isFinite(+init.lastSeen)) st.lastSeen = +init.lastSeen;
  if (typeof init.sleeping === 'boolean') st.sleeping = init.sleeping;
  if (typeof init.sick === 'boolean') st.sick = init.sick;
  if (typeof init.scared === 'boolean') st.scared = init.scared;
  if (Number.isFinite(+init.warnStage)) st.warnStage = clamp(Math.floor(+init.warnStage), 0, 3);
  if (init.warningsShown && typeof init.warningsShown === 'object') st.warningsShown = { ...init.warningsShown };
  if (Number.isFinite(+init.newbornUntil)) st.newbornUntil = +init.newbornUntil;
  if (typeof init.lastExcursionDay === 'string') st.lastExcursionDay = init.lastExcursionDay;
  if (Number.isFinite(+init.neglectDays)) st.neglectDays = Math.max(0, +init.neglectDays);
  if (Number.isFinite(+init.simMinutes)) st.simMinutes = Math.max(0, +init.simMinutes);
  if (typeof init.breakSuggested === 'boolean') st.breakSuggested = init.breakSuggested;
  if (Number.isFinite(+init.careCount)) st.careCount = Math.max(0, Math.floor(+init.careCount));
  if (Number.isFinite(+init.careWindowStart)) st.careWindowStart = Math.max(0, +init.careWindowStart);
  if (typeof init.chillDemo === 'boolean') st.chillDemo = init.chillDemo;
  for (const k of ['thinMinutes', 'singleBottomMinutes', 'doubleLowMinutes', 'sickMinutes', 'criticalMinutes', 'recoverMinutes']) {
    if (Number.isFinite(+init[k])) st[k] = Math.max(0, +init[k]);
  }
  if (typeof init.missedYou === 'boolean') st.missedYou = init.missedYou;
  if (typeof init.lastNursedDay === 'string') st.lastNursedDay = init.lastNursedDay;
  if (typeof init.nurseMentionedDay === 'string') st.nurseMentionedDay = init.nurseMentionedDay;
  if (typeof init.lastGiftDay === 'string') st.lastGiftDay = init.lastGiftDay;
  if (typeof init.lastGiftName === 'string') st.lastGiftName = init.lastGiftName.slice(0, 48);
  if (typeof init.giftMentionedDay === 'string') st.giftMentionedDay = init.giftMentionedDay;
  if (Number.isFinite(+init.breakfastStreak)) st.breakfastStreak = Math.max(0, Math.floor(+init.breakfastStreak));
  if (typeof init.lastBreakfastDay === 'string') st.lastBreakfastDay = init.lastBreakfastDay;
  if (typeof init.breakfastMentionedDay === 'string') st.breakfastMentionedDay = init.breakfastMentionedDay;
  if (typeof init.spark === 'string' && SPARK_ORDER.includes(init.spark)) st.spark = init.spark;
  if (typeof init.lastSunFleckDay === 'string') st.lastSunFleckDay = init.lastSunFleckDay;
  if (typeof init.lastSunFleckKeepsakeDay === 'string') st.lastSunFleckKeepsakeDay = init.lastSunFleckKeepsakeDay;
  if (typeof init.initiativeDay === 'string') st.initiativeDay = init.initiativeDay;
  if (Number.isFinite(+init.initiativeCount)) st.initiativeCount = Math.max(0, Math.floor(+init.initiativeCount));
  if (Array.isArray(init.unpromptedGiftWeek)) st.unpromptedGiftWeek = [...init.unpromptedGiftWeek].map(String).slice(-14);
  if (typeof init.lastGrewDay === 'string') st.lastGrewDay = init.lastGrewDay;
  if (init.annivMentioned && typeof init.annivMentioned === 'object') st.annivMentioned = { ...init.annivMentioned };
  if (typeof init.lastTuckWasNight === 'boolean') st.lastTuckWasNight = init.lastTuckWasNight;
  if (init.pendingReturn && typeof init.pendingReturn === 'object') st.pendingReturn = { ...init.pendingReturn };
  else if (init.pendingReturn === null) st.pendingReturn = null;
  if (typeof init.lastReturnInitiativeDay === 'string') st.lastReturnInitiativeDay = init.lastReturnInitiativeDay;
  if (typeof init.lastReturnInitiativeKind === 'string') st.lastReturnInitiativeKind = init.lastReturnInitiativeKind;
  if (typeof init.lastRushedDay === 'string') st.lastRushedDay = init.lastRushedDay;
  if (Number.isFinite(+init.rushedVariant)) st.rushedVariant = ((Math.floor(+init.rushedVariant) % 3) + 3) % 3;
  if (Number.isFinite(+init.rushedIdx)) st.rushedVariant = ((Math.floor(+init.rushedIdx) % 3) + 3) % 3;
  st.rushedIdx = st.rushedVariant;
  return st;
}

export function serialize(state) {
  return JSON.stringify(state);
}

export function deserialize(text) {
  let raw = {};
  try {
    raw = typeof text === 'string' ? JSON.parse(text) : { ...(text || {}) };
  } catch { raw = {}; }
  if (raw && typeof raw === 'object' && raw.state && typeof raw.state === 'object' && (raw.savedAt || raw.version)) raw = raw.state;
  const base = freshState();
  const st = { ...base };
  if (raw.name) st.name = String(raw.name).trim().slice(0, 24) || base.name;
  if (Number.isFinite(+raw.accentHue)) st.accentHue = clamp(+raw.accentHue, 0, 360);
  const stages = ['egg', 'baby', 'child', 'teen', 'adult', 'elder'];
  if (stages.includes(raw.stage)) st.stage = raw.stage;
  if (typeof raw.alive === 'boolean') st.alive = raw.alive;
  if (raw.needs && typeof raw.needs === 'object') {
    if (Number.isFinite(+raw.needs.belly)) st.needs.belly = clamp(+raw.needs.belly, 0, 100);
    if (Number.isFinite(+raw.needs.heart)) st.needs.heart = clamp(+raw.needs.heart, 0, 100);
    if (Number.isFinite(+raw.needs.sleep)) st.needs.sleep = clamp(+raw.needs.sleep, 0, 100);
  } else if (raw.stats && typeof raw.stats === 'object') {
    if (Number.isFinite(+raw.stats.food)) st.needs.belly = clamp(+raw.stats.food, 0, 100);
    if (Number.isFinite(+raw.stats.joy)) st.needs.heart = clamp(+raw.stats.joy, 0, 100);
    if (Number.isFinite(+raw.stats.rest)) st.needs.sleep = clamp(+raw.stats.rest, 0, 100);
    if (Number.isFinite(+raw.stats.bond)) st.trust = clamp(+raw.stats.bond, 0, 100);
    if (Number.isFinite(+raw.stats.health)) st.health = clamp(+raw.stats.health, 0, 100);
  }
  if (Number.isFinite(+raw.health)) st.health = clamp(+raw.health, 0, 100);
  if (Number.isFinite(+raw.trust)) st.trust = clamp(+raw.trust, 0, 100);
  if (typeof raw.moodWord === 'string' && raw.moodWord) st.moodWord = raw.moodWord;
  if (Number.isFinite(+raw.bornAt)) st.bornAt = +raw.bornAt;
  if (Number.isFinite(+raw.ageDays)) st.ageDays = Math.max(0, +raw.ageDays);
  if (Number.isFinite(+raw.ritualsDone)) st.ritualsDone = Math.max(0, Math.floor(+raw.ritualsDone));
  else if (Number.isFinite(+raw.rituals)) st.ritualsDone = Math.max(0, Math.floor(+raw.rituals));
  if (Array.isArray(raw.keepsakes)) {
    st.keepsakes = raw.keepsakes.map((k) => {
      if (k && typeof k === 'object' && k.name) return { name: String(k.name).slice(0, 48), story: String(k.story || `Kept with ${st.name} on a quiet day.`) };
      return { name: String(k).slice(0, 48), story: `Kept with ${st.name} on a quiet day.` };
    }).slice(-48);
  }
  if (Array.isArray(raw.diary)) st.diary = raw.diary.map(String).slice(-120);
  if (Number.isFinite(+raw.pastLives)) st.pastLives = Math.max(0, Math.floor(+raw.pastLives));
  if (Array.isArray(raw.lineage)) {
    st.lineage = raw.lineage.map((l) => {
      if (typeof l === 'string') return l.slice(0, 24);
      if (l && typeof l.name === 'string') return l.name.slice(0, 24);
      return '';
    }).filter(Boolean).slice(-10);
  }
  if (Number.isFinite(+raw.lastSeen)) st.lastSeen = +raw.lastSeen;
  if (typeof raw.sleeping === 'boolean') st.sleeping = raw.sleeping;
  if (typeof raw.sick === 'boolean') st.sick = raw.sick;
  if (typeof raw.scared === 'boolean') st.scared = raw.scared;
  if (Number.isFinite(+raw.warnStage)) st.warnStage = clamp(Math.floor(+raw.warnStage), 0, 3);
  if (raw.warningsShown && typeof raw.warningsShown === 'object') st.warningsShown = { ...raw.warningsShown };
  if (Number.isFinite(+raw.newbornUntil)) st.newbornUntil = +raw.newbornUntil;
  if (typeof raw.lastExcursionDay === 'string') st.lastExcursionDay = raw.lastExcursionDay;
  if (Number.isFinite(+raw.neglectDays)) st.neglectDays = Math.max(0, +raw.neglectDays);
  if (Number.isFinite(+raw.simMinutes)) st.simMinutes = Math.max(0, +raw.simMinutes);
  if (typeof raw.breakSuggested === 'boolean') st.breakSuggested = raw.breakSuggested;
  if (Number.isFinite(+raw.careCount)) st.careCount = Math.max(0, Math.floor(+raw.careCount));
  if (Number.isFinite(+raw.careWindowStart)) st.careWindowStart = Math.max(0, +raw.careWindowStart);
  if (typeof raw.chillDemo === 'boolean') st.chillDemo = raw.chillDemo;
  for (const k of ['thinMinutes', 'singleBottomMinutes', 'doubleLowMinutes', 'sickMinutes', 'criticalMinutes', 'recoverMinutes']) {
    if (Number.isFinite(+raw[k])) st[k] = Math.max(0, +raw[k]);
  }
  if (typeof raw.missedYou === 'boolean') st.missedYou = raw.missedYou;
  if (typeof raw.separationProtest === 'boolean') st.missedYou = st.missedYou || raw.separationProtest;
  if (typeof raw.lastNursedDay === 'string') st.lastNursedDay = raw.lastNursedDay;
  if (typeof raw.nurseMentionedDay === 'string') st.nurseMentionedDay = raw.nurseMentionedDay;
  if (typeof raw.lastGiftDay === 'string') st.lastGiftDay = raw.lastGiftDay;
  if (typeof raw.lastGiftName === 'string') st.lastGiftName = raw.lastGiftName.slice(0, 48);
  if (typeof raw.giftMentionedDay === 'string') st.giftMentionedDay = raw.giftMentionedDay;
  if (Number.isFinite(+raw.breakfastStreak)) st.breakfastStreak = Math.max(0, Math.floor(+raw.breakfastStreak));
  if (typeof raw.lastBreakfastDay === 'string') st.lastBreakfastDay = raw.lastBreakfastDay;
  if (typeof raw.breakfastMentionedDay === 'string') st.breakfastMentionedDay = raw.breakfastMentionedDay;
  if (typeof raw.spark === 'string' && SPARK_ORDER.includes(raw.spark)) st.spark = raw.spark;
  if (typeof raw.lastSunFleckDay === 'string') st.lastSunFleckDay = raw.lastSunFleckDay;
  if (typeof raw.lastSunFleckKeepsakeDay === 'string') st.lastSunFleckKeepsakeDay = raw.lastSunFleckKeepsakeDay;
  if (typeof raw.initiativeDay === 'string') st.initiativeDay = raw.initiativeDay;
  if (Number.isFinite(+raw.initiativeCount)) st.initiativeCount = Math.max(0, Math.floor(+raw.initiativeCount));
  if (Array.isArray(raw.unpromptedGiftWeek)) st.unpromptedGiftWeek = raw.unpromptedGiftWeek.map(String).slice(-14);
  if (typeof raw.lastGrewDay === 'string') st.lastGrewDay = raw.lastGrewDay;
  if (raw.annivMentioned && typeof raw.annivMentioned === 'object') st.annivMentioned = { ...raw.annivMentioned };
  if (typeof raw.lastTuckWasNight === 'boolean') st.lastTuckWasNight = raw.lastTuckWasNight;
  if (raw.pendingReturn && typeof raw.pendingReturn === 'object') st.pendingReturn = { ...raw.pendingReturn };
  else if (raw.pendingReturn === null) st.pendingReturn = null;
  if (typeof raw.lastReturnInitiativeDay === 'string') st.lastReturnInitiativeDay = raw.lastReturnInitiativeDay;
  if (typeof raw.lastReturnInitiativeKind === 'string') st.lastReturnInitiativeKind = raw.lastReturnInitiativeKind;
  if (typeof raw.lastRushedDay === 'string') st.lastRushedDay = raw.lastRushedDay;
  if (Number.isFinite(+raw.rushedVariant)) st.rushedVariant = ((Math.floor(+raw.rushedVariant) % 3) + 3) % 3;
  if (Number.isFinite(+raw.rushedIdx)) st.rushedVariant = ((Math.floor(+raw.rushedIdx) % 3) + 3) % 3;
  st.rushedIdx = st.rushedVariant;
  return st;
}

function store() {
  try {
    if (typeof localStorage !== 'undefined') return localStorage;
  } catch { /* private mode */ }
  return null;
}

function ok(msg, completed = true, extra = {}) {
  return { ok: true, msg, completed, ...extra };
}
function fail(msg, extra = {}) {
  return { ok: false, msg, completed: false, ...extra };
}

export function createEngine(initial = {}) {
  const state = freshState(initial);
  if (initial && initial.stage && initial.stage !== 'egg') {
    if (!Number.isFinite(+initial.ageDays)) state.ageDays = 0;
    if (!Number.isFinite(+initial.newbornUntil)) state.newbornUntil = state.bornAt + 7 * 86400000;
  }
  updateMood(state);

  function updateMood(st) {
    const avg = (st.needs.belly + st.needs.heart + st.needs.sleep) / 3;
    let m = statWord(avg, 'mood');
    if (st.sick) m = avg < 40 ? 'faint' : 'tender';
    else if (st.sleeping && (m === 'faint' || m === 'tender')) m = 'tender';
    st.moodWord = m;
  }

  function isBottomed(st) {
    const b = st.needs.belly < 20 || statWord(st.needs.belly, 'belly') === 'starving';
    const h = st.needs.heart < 25 || statWord(st.needs.heart, 'heart') === 'lonely';
    const s = st.needs.sleep < 15 || statWord(st.needs.sleep, 'sleep') === 'exhausted';
    return (b ? 1 : 0) + (h ? 1 : 0) + (s ? 1 : 0);
  }

  function lowCount(st) {
    let c = 0;
    if (st.needs.belly < 40) c += 1;
    if (st.needs.heart < 40) c += 1;
    if (st.needs.sleep < 40) c += 1;
    return c;
  }

  function refreshStage(st) {
    if (st.stage === 'egg' || !st.alive) return null;
    if (st.sick) return null;
    if (isBottomed(st) >= 1) return null;
    const order = ['baby', 'child', 'teen', 'adult', 'elder'];
    const gates = {
      child: { age: 2, trust: 10, rituals: 4 },
      teen: { age: 5, trust: 30, rituals: 10 },
      adult: { age: 9, trust: 55, rituals: 20 },
      elder: { age: 15, trust: 55, rituals: 35 },
    };
    let want = 'baby';
    for (const s of ['child', 'teen', 'adult', 'elder']) {
      const g = gates[s];
      if (st.ageDays >= g.age && st.trust >= g.trust && st.ritualsDone >= g.rituals) want = s;
    }
    if (order.indexOf(want) > order.indexOf(st.stage)) {
      st.stage = want;
      try { st.lastGrewDay = todayStr(); } catch { /* keep */ }
      const [kn, ks] = growthKeepsakeFor(want, st.name);
      pushKeepsake(st, kn, ks);
      pushDiary(st, `${st.name} grew into a new season of smallness.`);
      return want;
    }
    return null;
  }

  function getSparkWord() {
    return SPARK_ORDER.includes(state.spark) ? state.spark : 'bright';
  }
  function spendSpark(kind) {
    const costly = ['feed', 'play', 'excursion', 'sunfleck', 'sun-fleck', 'sunFleck'];
    if (!costly.includes(kind)) return;
    const i = sparkIdx(state.spark);
    if (i < SPARK_ORDER.length - 1) state.spark = SPARK_ORDER[i + 1];
  }
  function restoreSparkStep() {
    const i = sparkIdx(state.spark);
    if (i > 0) state.spark = SPARK_ORDER[i - 1];
  }

  function markShown() {
    if (state.warnStage > 0) state.warningsShown[state.warnStage] = true;
  }

  function lowestNeed() {
    const { belly, heart, sleep } = state.needs;
    if (belly <= heart && belly <= sleep) return { key: 'belly', value: belly, word: statWord(belly, 'belly') };
    if (heart <= belly && heart <= sleep) return { key: 'heart', value: heart, word: statWord(heart, 'heart') };
    return { key: 'sleep', value: sleep, word: statWord(sleep, 'sleep') };
  }

  function trajectory() {
    if (!state.alive) return 'steady';
    if (state.sick || state.warnStage >= 2 || state.health < 30) return 'slipping';
    const bottomed = isBottomed(state);
    if (bottomed >= 1 && lowCount(state) >= 2) return 'slipping';
    if (state.warnStage === 1 || lowCount(state) >= 1) {
      const avg = (state.needs.belly + state.needs.heart + state.needs.sleep) / 3;
      if (avg < 60 || state.recoverMinutes > 0) return 'recovering';
      return 'slipping';
    }
    const { belly, heart, sleep } = state.needs;
    const top = statWord(belly, 'belly') === 'content' && statWord(heart, 'heart') === 'cheerful' && statWord(sleep, 'sleep') === 'rested';
    if (top && state.warnStage === 0) return 'steady';
    if (state.recoverMinutes > 0) return 'recovering';
    if (belly >= 55 && heart >= 55 && sleep >= 40) return 'steady';
    return 'recovering';
  }

  function die() {
    if (!state.alive) return fail('Already at rest.');
    state.alive = false;
    state.sleeping = false;
    state.sick = false;
    state.scared = false;
    state.missedYou = false;
    state.pastLives += 1;
    if (state.name) {
      state.lineage.push(state.name.slice(0, 24));
      if (state.lineage.length > 10) state.lineage = state.lineage.slice(-10);
    }
    pushDiary(state, `${state.name} slipped away quietly, loved the whole time.`);
    return ok(`${state.name} slipped away quietly, loved the whole time. Their keepsakes stay.`, true);
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
    let left = dt;
    let grew = null;
    let died = false;
    while (left > 0 && state.alive) {
      const step = Math.min(left, 60);
      left -= step;
      const hrs = step / 60;
      state.simMinutes += step;
      state.ageDays += step / 1440;
      const damp = state.sleeping ? 0.5 : 1;
      state.needs.belly = clamp(state.needs.belly - 3.0 * hrs * damp, 0, 100);
      state.needs.heart = clamp(state.needs.heart - 1.6 * hrs * damp, 0, 100);
      if (state.sleeping) {
        const rate = dark ? 10 : 5;
        state.needs.sleep = clamp(state.needs.sleep + rate * hrs, 0, 100);
      } else {
        state.needs.sleep = clamp(state.needs.sleep - (dark ? 4.8 : 2.4) * hrs, 0, 100);
      }
      const target = (state.needs.belly + state.needs.heart + state.needs.sleep) / 3;
      state.health = clamp(state.health + (target - state.health) * 0.15 * hrs, 0, 100);
      const bottomed = (state.needs.belly < 20 ? 1 : 0) + (state.needs.heart < 25 ? 1 : 0) + (state.needs.sleep < 15 ? 1 : 0);
      const lows = lowCount(state);
      if (bottomed >= 2) state.health = clamp(state.health - 2 * hrs, 0, 100);
      if (state.sick) state.health = clamp(state.health - 2 * hrs, 0, 100);
      const thin = state.needs.belly < 50 || state.needs.heart < 50 || state.needs.sleep < 50;
      state.thinMinutes = thin ? state.thinMinutes + step : Math.max(0, state.thinMinutes - step);
      state.singleBottomMinutes = bottomed >= 1 ? state.singleBottomMinutes + step : Math.max(0, state.singleBottomMinutes - step);
      state.doubleLowMinutes = lows >= 2 ? state.doubleLowMinutes + step : Math.max(0, state.doubleLowMinutes - step);
      if (bottomed >= 1 || lows >= 2) state.neglectDays = Math.max(0, state.neglectDays + step / 1440);
      else if (state.needs.belly > 50 && state.needs.heart > 50 && state.needs.sleep > 50) {
        state.neglectDays = Math.max(0, state.neglectDays - step / 2880);
      }
      if (state.sick) state.sickMinutes += step;
      else state.sickMinutes = 0;
      if (state.warnStage === 3) state.criticalMinutes += step;
      else if (state.warnStage < 3) state.criticalMinutes = 0;
      const goodForRecover = state.needs.belly >= 30 && state.needs.heart >= 30 && state.needs.sleep >= 30;
      if (state.sick && goodForRecover) state.recoverMinutes += step;
      else if (!state.sick) state.recoverMinutes = 0;
      else state.recoverMinutes = 0;
      if (state.sick && state.recoverMinutes >= 120) {
        state.sick = false;
        state.scared = false;
        state.chillDemo = false;
        state.recoverMinutes = 0;
        state.sickMinutes = 0;
        state.singleBottomMinutes = 0;
        state.doubleLowMinutes = 0;
        state.health = clamp(state.health + 6, 0, 100);
        pushKeepsake(state, 'warm speck', `Kept from nursing ${state.name} back after the chill — stayed close until they were bright again.`);
        pushDiary(state, `${state.name} is feeling better after steady care.`);
        state.warnStage = state.thinMinutes >= 720 ? 1 : 0;
        state.criticalMinutes = 0;
        state.lastNursedDay = todayStr();
        events.push({ type: 'recovered' });
      }
      if (!state.sick) {
        if (state.warnStage < 1 && state.thinMinutes >= 720) {
          state.warnStage = 1;
          pushDiary(state, `${state.name} is a little quieter today.`);
          events.push({ type: 'tender' });
        }
        const singleReady = state.singleBottomMinutes >= 1440;
        const doubleReady = state.doubleLowMinutes >= 720;
        if (state.warnStage < 2 && (singleReady || doubleReady)) {
          state.warnStage = 2;
          state.sick = true;
          state.scared = true;
          state.sickMinutes = 0;
          state.recoverMinutes = 0;
          pushDiary(state, `${state.name} caught a little chill and needs gentle care.`);
          events.push({ type: 'sick' });
        }
      } else if (state.warnStage === 2 && state.sickMinutes >= 1440) {
        state.warnStage = 3;
        state.criticalMinutes = 0;
        pushDiary(state, `${state.name} is very weak. Staying close and keeping them fed and rested matters most now.`);
        events.push({ type: 'critical' });
      }
      if (state.warnStage === 3 && !died) {
        if (state.health > 30 && !state.sick) {
          state.criticalMinutes = 0;
          events.push({ type: 'rallied' });
        } else if (state.criticalMinutes >= 1440) {
          const newborn = Date.now() < state.newbornUntil || state.ageDays < 7;
          const shown = state.warningsShown[2] && state.warningsShown[3];
          if (!newborn && shown && state.ageDays > 7) {
            die();
            died = true;
            events.push({ type: 'died' });
            break;
          } else {
            events.push({ type: 'critical-ongoing' });
            state.criticalMinutes = 1440;
          }
        } else if (state.criticalMinutes > 0 && state.criticalMinutes < 1440) {
          events.push({ type: 'critical-ongoing' });
        }
      }
      if (!state.sick && state.warnStage === 1 && state.thinMinutes <= 0) {
        state.warnStage = 0;
        events.push({ type: 'rallied' });
      }
      const g = refreshStage(state);
      if (g) {
        grew = g;
        events.push({ type: 'grew', stage: g });
      }
      if (step >= 60) {
        try {
          const h = new Date().getHours();
          if (isMorningHour(h) && trajectory() === 'steady') restoreSparkStep();
        } catch { /* keep */ }
      }
      updateMood(state);
    }
    updateMood(state);
    return { events, grew, died };
  }

  function needAlive() {
    if (!state.alive) return fail(`${state.name} is gone, but their story stays with you.`);
    return null;
  }

  function noteCareAction() {
    if (typeof state.careCount !== 'number') state.careCount = 0;
    if (typeof state.careWindowStart !== 'number') state.careWindowStart = 0;
    if (state.simMinutes - state.careWindowStart > 60) {
      state.careWindowStart = state.simMinutes;
      state.careCount = 0;
    }
    state.careCount += 1;
    if (state.careCount >= 12 && (state.simMinutes - state.careWindowStart) <= 60) {
      state.breakSuggested = true;
    }
  }

  function afterRitual(trustGain, kind) {
    let gain = trustGain;
    let k = kind;
    if (typeof gain === 'string' && k === undefined) {
      k = gain;
      gain = 0;
    }
    state.trust = clamp(state.trust + (Number(gain) || 0), 0, 100);
    state.ritualsDone += 1;
    noteCareAction();
    if (typeof k === 'string' && k) spendSpark(k);
    if (state.thinMinutes > 0 && state.warnStage === 1) {
      const good = state.needs.belly >= 40 && state.needs.heart >= 40 && state.needs.sleep >= 40;
      if (good) {
        state.thinMinutes = 0;
        state.warnStage = 0;
        pushDiary(state, `${state.name} seems brighter after your time together.`);
      }
    }
    const g = refreshStage(state);
    updateMood(state);
    return g;
  }

  function feed() {
    const dead = needAlive();
    if (dead) return dead;
    if (state.stage === 'egg') return fail('The egg needs warmth and waiting, not food yet.');
    if (state.sleeping) return fail('Fast asleep — waking first would be kinder.');
    if (state.needs.belly >= 95) return fail(`${state.name} is full and happy. A little company is plenty.`);
    if (state.spark === 'spent' && statWord(state.needs.belly, 'belly') === 'content') {
      return fail(`${state.name} feels spent and wants only nearness. Sitting close is plenty for now.`);
    }
    const wasLow = state.needs.belly < 50;
    state.needs.belly = clamp(state.needs.belly + 18, 0, 100);
    state.health = clamp(state.health + 2, 0, 100);
    if (new Date().getHours() < 12) {
      const t = todayStr();
      if (state.lastBreakfastDay !== t) {
        if (state.lastBreakfastDay === yesterdayStr()) state.breakfastStreak = Math.max(2, (state.breakfastStreak || 1) + 1);
        else state.breakfastStreak = 1;
        state.lastBreakfastDay = t;
      }
    }
    pushDiary(state, `Shared a warm meal with ${state.name}.`);
    const g = afterRitual(wasLow ? 3 : 2, 'feed');
    return ok(`${state.name} eats slowly, then looks up, glad.`, true, g ? { grew: g } : {});
  }

  function play() {
    const dead = needAlive();
    if (dead) return dead;
    if (state.stage === 'egg') return fail('Not yet — little one still needs quiet to grow.');
    if (state.sleeping) return fail('Let them dream a little longer; play can wait.');
    if (state.spark === 'spent') return fail(`${state.name} feels spent and wants only nearness. Sitting close is plenty for now.`);
    if (state.needs.sleep < 20) return fail(`${state.name} is too sleepy to play. A nap together first?`);
    state.needs.heart = clamp(state.needs.heart + 20, 0, 100);
    state.needs.belly = clamp(state.needs.belly - 4, 0, 100);
    state.needs.sleep = clamp(state.needs.sleep - 3, 0, 100);
    pushDiary(state, `Played a small game with ${state.name} by the sun spot.`);
    const g = afterRitual(2, 'play');
    return ok(`${state.name} lights up and trots back for more.`, true, g ? { grew: g } : {});
  }

  function sitClose() {
    const dead = needAlive();
    if (dead) return dead;
    if (state.stage === 'egg') {
      state.trust = clamp(state.trust + 1, 0, 100);
      state.ritualsDone += 1;
      noteCareAction();
      pushDiary(state, `Rested a hand near the egg and kept it warm.`);
      updateMood(state);
      return ok('You rest a hand near the egg. It feels a little warmer.');
    }
    state.needs.heart = clamp(state.needs.heart + 6, 0, 100);
    pushDiary(state, `Sat close with ${state.name} for a quiet while.`);
    const g = afterRitual(1, 'sit');
    if (state.warnStage === 3) state.health = clamp(state.health + 1, 0, 100);
    updateMood(state);
    return ok(`${state.name} leans in close, soft and warm.`, true, g ? { grew: g } : {});
  }

  function breathe() {
    const dead = needAlive();
    if (dead) return dead;
    if (state.stage === 'egg') return fail('You hum softly near the egg and wait.');
    const wasAfraid = state.sick || state.scared;
    state.needs.heart = clamp(state.needs.heart + 6, 0, 100);
    state.scared = false;
    pushDiary(state, `Breathed slowly together with ${state.name}.`);
    const g = afterRitual(wasAfraid ? 4 : 2, 'breathe');
    if (wasAfraid) return ok(`${state.name} settles against you, and the quiet settles over you too.`, true, g ? { grew: g } : {});
    return ok(`You breathe together for a while. ${state.name} seems glad to be near.`, true, g ? { grew: g } : {});
  }

  function tuck() {
    const dead = needAlive();
    if (dead) return dead;
    if (state.stage === 'egg') return fail('The egg is already tucked in warm.');
    if (state.sleeping) return fail('Already dreaming softly.');
    try { state.lastTuckWasNight = isNightHour(new Date().getHours()); } catch { state.lastTuckWasNight = false; }
    state.sleeping = true;
    state.needs.heart = clamp(state.needs.heart + 2, 0, 100);
    pushDiary(state, `Tucked ${state.name} in for a rest.`);
    const g = afterRitual(1, 'tuck');
    return ok(`${state.name} curls up small and drifts off. Rest well — they will be here.`, true, g ? { grew: g } : {});
  }

  function wake() {
    const dead = needAlive();
    if (dead) return dead;
    if (!state.sleeping) return fail('Already awake and puttering about.');
    const wasNight = !!state.lastTuckWasNight;
    state.sleeping = false;
    if (wasNight) {
      state.spark = 'bright';
    } else {
      const i = sparkIdx(state.spark);
      if (i > sparkIdx('soft')) state.spark = 'soft';
    }
    state.lastTuckWasNight = false;
    updateMood(state);
    return ok(`${state.name} blinks awake and looks for you.`);
  }

  function medicine() {
    const dead = needAlive();
    if (dead) return dead;
    if (state.stage === 'egg') return fail('The egg needs warmth and waiting, not medicine.');
    if (!state.sick) return fail(`${state.name} seems well right now. A cuddle keeps it that way.`);
    const s = state.needs;
    const needFood = s.belly < 25;
    const needRest = s.sleep < 25;
    const needComfort = s.heart < 15;
    if (!needFood && !needRest && !needComfort) {
      state.sick = false;
      state.scared = false;
      state.chillDemo = false;
      state.recoverMinutes = 0;
      state.sickMinutes = 0;
      state.singleBottomMinutes = 0;
      state.doubleLowMinutes = 0;
      state.criticalMinutes = 0;
      state.health = clamp(state.health + 10, 0, 100);
      pushKeepsake(state, 'warm speck', `Kept from nursing ${state.name} back after the chill — stayed close until they were bright again.`);
      pushDiary(state, `Nursed ${state.name} back to comfort with medicine and patience.`);
      state.warnStage = state.thinMinutes >= 720 ? 1 : 0;
      state.lastNursedDay = todayStr();
      const g = afterRitual(3, 'medicine');
      return ok(`${state.name} feels the care working and rests easier now. Well done.`, true, g ? { grew: g } : {});
    }
    const missing = [];
    if (needFood) missing.push(`food (feeling ${statWord(s.belly, 'belly')})`);
    if (needRest) missing.push(`rest (feeling ${statWord(s.sleep, 'sleep')})`);
    if (needComfort) missing.push(`company (feeling ${statWord(s.heart, 'heart')})`);
    return fail(`${state.name} appreciates the comfort. Still needing ${missing.join(' and ')} — a little food and rest will help the medicine along.`);
  }

  function beginChillDemo() {
    if (!state.alive) return fail('This story has ended; a new one can begin when you are ready.');
    if (state.stage === 'egg') return fail('The egg needs warmth and waiting first.');
    state.sick = true;
    state.scared = true;
    if (state.warnStage < 2) state.warnStage = 2;
    state.sickMinutes = 0;
    state.recoverMinutes = 0;
    state.chillDemo = true;
    state.needs.belly = 36;
    state.needs.heart = 22;
    state.needs.sleep = 38;
    state.sleeping = false;
    pushDiary(state, `${state.name} caught a pretend chill for practice — shivery and wanting-near.`);
    updateMood(state);
    return ok(`${state.name} shivers a little — a pretend chill, so you can learn the way back. Sit close, share a snack, rest, breathe together, then a little medicine.`, true);
  }

  function hatchEgg() {
    if (!state.alive) return fail('This story has ended; a new one can begin when you are ready.');
    if (state.stage !== 'egg') return fail('Already hatched and glad to see you.');
    state.stage = 'baby';
    state.bornAt = nowMs();
    state.ageDays = 0;
    state.needs = { belly: 75, heart: 72, sleep: 78 };
    state.health = 80;
    if (state.trust < 6) state.trust = 6;
    state.newbornUntil = state.bornAt + 7 * 86400000;
    state.warnStage = 0;
    state.sick = false;
    state.scared = false;
    state.sleeping = false;
    pushDiary(state, `${state.name} hatched, blinking and new.`);
    pushKeepsake(state, 'first shell', `Kept from the day ${state.name} hatched — tiny and blinking, looking straight at you.`);
    updateMood(state);
    return ok(`${state.name} hatches, tiny and blinking, and looks straight at you. Welcome.`, true);
  }

  function rebirth() {
    if (state.alive) return fail(`${state.name} is still here — no need to begin again yet.`);
    const keepsakes = [...state.keepsakes];
    const diary = [...state.diary];
    const lineage = [...state.lineage];
    const pastLives = state.pastLives;
    const hue = state.accentHue;
    const t = nowMs();
    const fresh = freshState({ name: state.name, accentHue: hue });
    Object.assign(state, fresh, {
      stage: 'egg',
      alive: true,
      keepsakes,
      diary,
      lineage,
      pastLives,
      lastSeen: t,
      bornAt: t,
      accentHue: hue,
    });
    pushDiary(state, 'A new egg waits, warm with possibility.');
    updateMood(state);
    return ok('A new egg waits, warm with possibility. The love carries over; the story starts fresh.', true);
  }

  function getGreeting() {
    if (!state.alive) return { intense: false, text: '' };
    markShown();
    if (state.stage === 'egg') return { intense: false, text: 'The egg feels warm. Something small is waiting to meet you.' };
    if (state.missedYou) {
      state.missedYou = false;
      try {
        const t = todayStr();
        if (state.lastRushedDay !== t) {
          const variants = [
            `${state.name} rushed over on your return, overjoyed to see you.`,
            `${state.name} hurried over when you came back, so glad to be near again.`,
            `${state.name} came rushing over, having missed you, glowing to see you back.`,
          ];
          let idx = Math.floor(Number(state.rushedVariant) || 0) % 3;
          if (!Number.isFinite(idx) || idx < 0) idx = 0;
          pushDiary(state, variants[idx]);
          state.lastRushedDay = t;
          state.rushedVariant = (idx + 1) % 3;
          state.rushedIdx = state.rushedVariant;
        }
      } catch { /* diary cap never blocks greeting */ }
      return { intense: true, text: `${state.name} notices you and comes rushing over, glowing all over — missed you, missed you, so glad you are back.` };
    }
    if (state.sleeping) return { intense: false, text: `${state.name} sleeps softly, breathing slow.` };
    if (state.sick || state.warnStage >= 3) return { intense: true, text: `${state.name} looks up tiredly and stays near the nest, glad you are here.` };
    if (state.sick || state.warnStage === 2) return { intense: false, text: `${state.name} feels tender and wants nearness.` };
    const t = todayStr();
    const y = yesterdayStr();
    if ((state.lastNursedDay === t || state.lastNursedDay === y) && state.nurseMentionedDay !== state.lastNursedDay) {
      state.nurseMentionedDay = state.lastNursedDay;
      return { intense: false, text: `${state.name} leans in close, still warm from how you stayed through the shivers together until they eased.` };
    }
    if ((state.lastGiftDay === t || state.lastGiftDay === y) && state.lastGiftName && state.giftMentionedDay !== state.lastGiftDay) {
      state.giftMentionedDay = state.lastGiftDay;
      return { intense: false, text: `${state.name} trots over proudly, still pleased about the ${state.lastGiftName} from out in the world, glancing up to make sure you remember too.` };
    }
    if (state.breakfastStreak >= 3 && state.breakfastMentionedDay !== t && (state.lastBreakfastDay === t || state.lastBreakfastDay === y)) {
      state.breakfastMentionedDay = t;
      return { intense: false, text: `${state.name} settles in for shared breakfast, ${streakWord(state.breakfastStreak)} mornings running now, as if mornings together have become your small ritual.` };
    }
    const low = lowestNeed();
    if (low.key === 'belly' && low.value < 70) return { intense: false, text: `${state.name} feels ${low.word} and keeps glancing at the snack corner.` };
    if (low.key === 'heart' && low.value < 80) return { intense: false, text: `${state.name} feels ${low.word} and edges a little closer.` };
    if (low.key === 'sleep' && low.value < 70) return { intense: false, text: `${state.name} feels ${low.word} and blinks slowly.` };
    return { intense: false, text: `${state.name} looks up, glad you are here.` };
  }

  function getStatus() {
    markShown();
    updateMood(state);
    const words = {
      belly: statWord(state.needs.belly, 'belly'),
      heart: statWord(state.needs.heart, 'heart'),
      sleep: statWord(state.needs.sleep, 'sleep'),
    };
    const low = lowestNeed();
    let hint;
    if (low.key === 'belly') hint = `${state.name} feels ${low.word} and keeps glancing at the snack corner.`;
    else if (low.key === 'heart') hint = `${state.name} feels ${low.word} and would love a little company.`;
    else hint = `${state.name} feels ${low.word} and blinks slowly by the nest.`;
    const top = words.belly === 'content' && words.heart === 'cheerful' && words.sleep === 'rested';
    if (top && !state.sick && state.warnStage === 0) hint = `${state.name} feels settled and glad to be near you.`;
    if (state.sleeping) hint = `${state.name} is tucked in and dreaming softly.`;
    if (!state.alive) hint = `${state.name} is at rest, loved the whole time.`;
    const traj = trajectory();
    return {
      words,
      mood: state.moodWord,
      trustWord: statWord(state.trust, 'trust'),
      sleeping: state.sleeping,
      sick: state.sick,
      alive: state.alive,
      stage: state.stage,
      name: state.name,
      hint,
      trajectory: traj,
      trajectoryWord: traj,
      spark: getSparkWord(),
      sparkWord: getSparkWord(),
    };
  }

  function storyFor(mins) {
    if (mins < 60) return [`${state.name} looks up, glad you are here.`];
    if (mins < 300) {
      return [
        `${state.name} trots over, happy to see you.`,
        'Nothing is spoiled — a quiet moment together is plenty.',
      ];
    }
    return [
      `${state.name} missed you and lights up on your return.`,
      'The nest is still warm and nothing is spoiled.',
      'A shared meal or a quiet sit-close would feel just right.',
    ];
  }

  function wantTextForSpot(spot) {
    if (spot === 'snack') return 'Seems to be asking — glancing at the snack corner.';
    if (spot === 'sun') return 'Seems to be asking — glancing at the warm spot.';
    if (spot === 'nest') return 'Seems to be asking — glancing at the nest.';
    return 'Seems to be asking — looking back at you.';
  }

  function pendingWantSpot() {
    try {
      const low = lowestNeed();
      if (low.key === 'belly') return 'snack';
      if (low.key === 'heart') return 'sun';
      return 'nest';
    } catch { return 'snack'; }
  }

  function maybeAttachReturnInitiative() {
    if (!state.alive) return;
    if (state.stage === 'egg') return;
    if (state.pendingReturn) return;
    let today = '';
    let yest = '';
    try { today = todayStr(); yest = yesterdayStr(); } catch { return; }
    if (!today) return;
    if (state.lastReturnInitiativeDay === today) return;
    if (state.spark === 'spent') return;
    if (!(Number(state.trust) >= 30)) return;
    const lb = state.lastBreakfastDay || '';
    if (!(lb === today || (lb && lb === yest))) return;
    let kind = state.lastReturnInitiativeKind === 'want' ? 'gift' : 'want';
    if (kind === 'gift') {
      let week = Array.isArray(state.unpromptedGiftWeek) ? state.unpromptedGiftWeek.map(String) : [];
      try { week = week.filter((d) => daysBetween(String(d), today) <= 7); } catch { week = []; }
      if (week.includes(today) || week.length >= 2) kind = 'want';
      else {
        const pick = GIFT_ITEMS[Math.floor(Math.random() * GIFT_ITEMS.length)];
        const item = pick[0];
        const story = `Brought you ${item} for no reason — just wanted you to have it.`;
        state.pendingReturn = { kind: 'gift', item, story };
        state.lastReturnInitiativeDay = today;
        state.lastReturnInitiativeKind = 'gift';
        return;
      }
    }
    const spot = pendingWantSpot();
    state.pendingReturn = { kind: 'want', spot, text: wantTextForSpot(spot) };
    state.lastReturnInitiativeDay = today;
    state.lastReturnInitiativeKind = 'want';
  }

  function consumePendingReturn() {
    const p = state.pendingReturn || null;
    state.pendingReturn = null;
    return p;
  }

  function simulateOffline(awayMinutes) {
    const capped = clamp(Number(awayMinutes) || 0, 0, OFFLINE_CAP_MIN);
    if (capped >= 180 && state.alive && state.stage !== 'egg') state.missedYou = true;
    const allEvents = [];
    let left = capped;
    while (left > 0) {
      const step = Math.min(left, 15);
      const r = tick(step, {});
      allEvents.push(...r.events);
      left -= step;
      if (!state.alive) break;
    }
    if (capped >= 180) {
      try { maybeAttachReturnInitiative(); } catch { /* words only, never block return */ }
    }
    state.lastSeen = nowMs();
    updateMood(state);
    return { simulatedMinutes: capped, events: allEvents, story: storyFor(capped) };
  }

  function save() {
    const s = store();
    state.lastSeen = nowMs();
    const payload = JSON.stringify({ version: 2, savedAt: state.lastSeen, state });
    if (s) {
      try { s.setItem(SAVE_KEY, payload); } catch { /* blocked */ }
    }
    return payload;
  }

  function load() {
    const s = store();
    if (!s) return { ok: false, msg: 'No saved story on this device yet.', completed: false, found: false, awayMinutes: 0, story: [], events: [] };
    let raw = null;
    try { raw = s.getItem(SAVE_KEY); } catch { raw = null; }
    if (!raw) return { ok: false, msg: 'No saved story on this device yet.', completed: false, found: false, awayMinutes: 0, story: [], events: [] };
    let parsed = {};
    try { parsed = JSON.parse(raw); } catch { parsed = {}; }
    const incoming = deserialize(parsed.state || parsed);
    Object.assign(state, incoming);
    const savedAt = parsed.savedAt || state.lastSeen || nowMs();
    const awayMinutes = (nowMs() - savedAt) / 60000;
    const sim = simulateOffline(awayMinutes);
    return { ok: true, msg: 'Welcome back.', completed: true, found: true, awayMinutes: sim.simulatedMinutes, events: sim.events, story: sim.story };
  }

  function setName(name) {
    const clean = String(name || '').trim().slice(0, 24);
    if (!clean) return fail('A name with a little love in it works best.');
    state.name = clean;
    return ok(`${clean} — a good name. Said softly, it already sounds like home.`);
  }

  function canExcursion() {
    if (!state.alive || state.stage === 'egg' || state.stage === 'baby') return false;
    if (state.sleeping || state.sick || state.scared) return false;
    if (state.lastExcursionDay === todayStr()) return false;
    return state.needs.belly >= 55 && state.needs.heart >= 55 && state.needs.sleep >= 50;
  }

  function excursion() {
    const dead = needAlive();
    if (dead) return dead;
    if (state.stage === 'egg' || state.stage === 'baby') return fail('Little one is still too small to wander — staying near is best.');
    if (state.sleeping) return fail('Fast asleep — adventures can wait until morning.');
    if (state.sick || state.scared) return fail('Wants nearness right now, not adventure. A quiet moment together first?');
    if (state.spark === 'spent') return fail(`${state.name} feels spent and wants only nearness. Sitting close is plenty for now.`);
    if (state.lastExcursionDay === todayStr()) return fail('Already had one little adventure today — rest feels best now.');
    if (state.needs.belly < 55 || state.needs.heart < 55 || state.needs.sleep < 50) {
      return fail(`${state.name} would love to wander, but a snack and some company first would help.`);
    }
    const pick = EXCURSION_FINDS[Math.floor(Math.random() * EXCURSION_FINDS.length)];
    state.lastExcursionDay = todayStr();
    state.lastGiftDay = todayStr();
    state.lastGiftName = pick[0];
    pushKeepsake(state, pick[0], `${state.name} came back from a little adventure with ${pick[0]} — ${pick[1]}.`);
    pushDiary(state, `${state.name} came back from a little adventure with ${pick[0]}.`);
    state.needs.heart = clamp(state.needs.heart + 5, 0, 100);
    const g = afterRitual(2, 'excursion');
    return ok(`${state.name} trots back with ${pick[0]}, proud to show you.`, true, { find: pick[0], grew: g || undefined });
  }

  function canSunFleck(now) {
    let d;
    try {
      if (now instanceof Date) d = now;
      else if (Number.isFinite(+now) && +now > 0) d = new Date(+now);
      else if (now == null) d = new Date();
      else d = new Date();
    } catch { d = new Date(); }
    let h = 12;
    let today = todayStr();
    try {
      h = d.getHours();
      today = dayStrOf(d);
    } catch { /* keep defaults */ }
    if (h < 10 || h > 17) return { ok: false, reason: 'Sun-flecks rest now. Back with daylight tomorrow — nothing missed.' };
    if (state.lastSunFleckDay === today) return { ok: false, reason: 'Sun-flecks rest now. Back with daylight tomorrow — nothing missed.' };
    if (!state.alive) return { ok: false, reason: `${state.name} is at rest, loved the whole time.` };
    if (state.stage === 'egg') return { ok: false, reason: 'Not yet — little one still needs quiet to grow.' };
    if (state.sleeping) return { ok: false, reason: `${state.name} is dreaming softly. Sun-flecks can wait.` };
    if (state.sick) return { ok: false, reason: `${state.name} wants nearness right now, not chasing. Sitting close is plenty.` };
    if (statWord(state.needs.belly, 'belly') === 'starving') return { ok: false, reason: `${state.name} feels too hungry for flecks. A snack first?` };
    if (statWord(state.needs.sleep, 'sleep') === 'exhausted') return { ok: false, reason: `${state.name} feels too sleepy for flecks. A nap together first?` };
    if (state.spark === 'spent') return { ok: false, reason: 'Too sleepy for flecks. Sitting close is plenty.' };
    return { ok: true, reason: '' };
  }

  function playSunFleck(now) {
    const dead = needAlive();
    if (dead) return { ...dead, completed: false };
    const gate = canSunFleck(now);
    if (!gate.ok) return fail(gate.reason);
    let today = todayStr();
    try {
      if (now instanceof Date) today = dayStrOf(now);
      else if (Number.isFinite(+now) && +now > 0) today = dayStrOf(new Date(+now));
    } catch { /* keep */ }
    const prevKeepsakeDay = state.lastSunFleckKeepsakeDay;
    state.lastSunFleckDay = today;
    let give = true;
    if (prevKeepsakeDay) {
      try {
        if (daysBetween(prevKeepsakeDay, today) < 3) give = false;
      } catch { give = true; }
    }
    if (give) {
      pushKeepsake(state, 'sun fleck', `Kept from chasing sun-flecks with ${state.name} in the warm spot.`);
      state.lastSunFleckKeepsakeDay = today;
    }
    pushDiary(state, `Chased sun-flecks with ${state.name} in the warm spot.`);
    const g = afterRitual(2, 'sunfleck');
    return ok(`${state.name} pounces and tumbles through the sun-flecks, glowing.`, true, g ? { grew: g } : {});
  }

  function checkInitiative(openMinutes, lastRitualMinutes) {
    const today = todayStr();
    if (state.initiativeDay !== today) {
      state.initiativeDay = today;
      state.initiativeCount = 0;
    }
    const open = Number(openMinutes);
    const last = Number(lastRitualMinutes);
    if (!Number.isFinite(open) || open < 3) return null;
    if (!Number.isFinite(last) || last <= 5) return null;
    if (!state.alive) return null;
    if (state.stage === 'egg') return null;
    if (state.sleeping) return null;
    if (state.sick) return null;
    if (state.spark === 'spent') return null;
    if (state.initiativeCount >= 2) return null;
    let spot = 'snack';
    try {
      const low = lowestNeed();
      if (low.key === 'belly') spot = 'snack';
      else if (low.key === 'heart') spot = 'sun';
      else spot = 'nest';
    } catch { spot = 'snack'; }
    state.initiativeCount += 1;
    return { kind: 'want', spot };
  }

  function grantGift() {
    if (!state.alive) return null;
    if (state.stage === 'egg') return null;
    const today = todayStr();
    if (!Array.isArray(state.unpromptedGiftWeek)) state.unpromptedGiftWeek = [];
    try {
      state.unpromptedGiftWeek = state.unpromptedGiftWeek.filter((d) => daysBetween(String(d), today) <= 7);
    } catch { state.unpromptedGiftWeek = []; }
    if (state.unpromptedGiftWeek.includes(today)) return null;
    if (state.unpromptedGiftWeek.length >= 2) return null;
    if (state.trust < 30) return null;
    if (state.lastBreakfastDay !== today) return null;
    const pick = GIFT_ITEMS[Math.floor(Math.random() * GIFT_ITEMS.length)];
    const item = pick[0];
    const story = `Brought you ${item} for no reason — just wanted you to have it.`;
    pushKeepsake(state, item, `${state.name} ${story} Kept with care.`);
    pushDiary(state, `${state.name} ${story}`);
    state.unpromptedGiftWeek.push(today);
    return { item, story };
  }

  function anniversaryLine(todayParam) {
    let today = todayStr();
    if (typeof todayParam === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(todayParam)) today = todayParam;
    if (!state.alive) return null;
    if (state.stage === 'egg') return null;
    if (!state.annivMentioned || typeof state.annivMentioned !== 'object') state.annivMentioned = {};
    const N = state.name;
    let hatchDay = '';
    try { hatchDay = dayStrOf(new Date(state.bornAt)); } catch { hatchDay = ''; }
    const diffHatch = hatchDay ? daysBetween(hatchDay, today) : 9999;
    const diffNursed = state.lastNursedDay ? daysBetween(state.lastNursedDay, today) : 9999;
    const diffGrew = state.lastGrewDay ? daysBetween(state.lastGrewDay, today) : 9999;
    const diffGift = state.lastGiftDay ? daysBetween(state.lastGiftDay, today) : 9999;
    if (diffHatch === 7 && state.annivMentioned['hatch'] !== today) {
      state.annivMentioned['hatch'] = today;
      return `A week with you now. Tiny at hatching, looking straight at you — ${N} still does.`;
    }
    if (diffHatch === 30 && state.annivMentioned['hatch'] !== today) {
      state.annivMentioned['hatch'] = today;
      return `A month with you now. Tiny at hatching, looking straight at you — ${N} still does.`;
    }
    if (diffNursed === 7 && state.annivMentioned['nursed'] !== today) {
      state.annivMentioned['nursed'] = today;
      return `This time last week, you stayed through the shivers together until they eased. ${N} still leans in a touch closer for it.`;
    }
    const streak = state.breakfastStreak || 0;
    const lastB = state.lastBreakfastDay;
    const recentB = lastB === today || (lastB && daysBetween(lastB, today) === 1);
    if (recentB && streak >= 3 && state.annivMentioned['streak'] !== today) {
      state.annivMentioned['streak'] = today;
      return `Shared breakfast, ${streakWord(streak)} mornings running now, as if mornings together have become your small ritual.`;
    }
    if (diffGrew === 7 && state.annivMentioned['grew'] !== today) {
      state.annivMentioned['grew'] = today;
      return `A week since ${N} grew into a new season of smallness — a little braver since.`;
    }
    if (diffGift === 1 && state.lastGiftName && state.annivMentioned['gift'] !== today) {
      state.annivMentioned['gift'] = today;
      return `${N} is still pleased about the ${state.lastGiftName} from out in the world.`;
    }
    return null;
  }

  return {
    state,
    tick,
    feed,
    play,
    sitClose,
    pet: sitClose,
    breathe,
    soothe: breathe,
    tuck,
    wake,
    medicine,
    cleanSick: medicine,
    beginChillDemo,
    hatchEgg,
    rebirth,
    die,
    setName,
    getStatus,
    getGreeting,
    consumeGreeting: getGreeting,
    acknowledgeReturn: getGreeting,
    simulateOffline,
    save,
    load,
    excursion,
    canExcursion,
    serialize: () => serialize(state),
    getSparkWord,
    canSunFleck,
    playSunFleck,
    checkInitiative,
    grantGift,
    anniversaryLine,
    consumePendingReturn,
  };
}
