import { createEngine, statWord } from './engine.js';
import { CreatureView } from './creature.js';

window.__vfBooted = true;

const $ = (s) => document.querySelector(s);
const onboarding = $('#onboarding'), main = $('#main');
const petNameInput = $('#petName'), promiseInput = $('#promise');
const commitBtn = $('#commit'), commitFill = $('#commitFill'), commitHint = $('#commitHint');
const petTitle = $('#petTitle'), stageLine = $('#stageLine'), statusLine = $('#statusLine');
const rhythmLine = $('#rhythmLine');
const stage = $('#stage'), canvas = $('#scene'), effects = $('#effects');
const spotSun = $('#spotSun'), spotSnack = $('#spotSnack'), spotNest = $('#spotNest');
const snackDrag = $('#snackDrag');
const breatheOv = $('#breathe'), breatheRing = $('#breatheRing'), breatheText = $('#breatheText');
const breatheFill = $('#breatheFill');
const btnFeed = $('#btnFeed'), btnPlay = $('#btnPlay'), btnSit = $('#btnSit');
const btnBreathe = $('#btnBreathe'), btnTuck = $('#btnTuck'), btnMedicine = $('#btnMedicine');
const btnNight = $('#btnNight'), nightLabel = $('#nightLabel');
const btnMute = $('#btnMute'), muteLabel = $('#muteLabel');
const healthNote = $('#healthNote'), healthText = $('#healthText');
const guideHint = $('#guideHint'), guideText = $('#guideText');
const returnNote = $('#returnNote'), returnText = $('#returnText');
const breakNote = $('#breakNote');
const keepsakesEl = $('#keepsakes'), shelfEmpty = $('#shelfEmpty');
const diaryEl = $('#diary'), diaryEmpty = $('#diaryEmpty');
const memorialEmpty = $('#memorialEmpty'), memorialList = $('#memorialList');
const promiseWall = $('#promiseWall'), toast = $('#toast');
const farewell = $('#farewell'), farewellText = $('#farewellText');
const farewellFade = $('#farewellFade'), farewellMemorial = $('#farewellMemorial');
const memorialName = $('#memorialName'), memorialStory = $('#memorialStory');
const farewellRestart = $('#farewellRestart');
const favLink = $('#fav');
const actionsEl = $('#actions');
const playGuide = $('#playGuide'), playGuideText = $('#playGuideText'), playGiveUp = $('#playGiveUp');
const eggHold = $('#eggHold');

/* ---------- quiet helpers: never throw, never log ---------- */
function swallow(fn, fb) { try { const v = fn(); return v === undefined ? fb : v; } catch { return fb; } }

/* ---------- engine (spec shape + legacy shape) ---------- */
const engine = swallow(() => createEngine(), null) || {};
const ES = () => { try { return engine.state || {}; } catch { return {}; } };
function eng(method, ...args) {
  try { const f = engine[method]; if (typeof f === 'function') return f.apply(engine, args); } catch {}
  return undefined;
}
function wordFor(n, kind) {
  const w = swallow(() => eng('statWord') ? eng('statWord')(n, kind) : statWord(n, kind));
  if (typeof w === 'string' && w) return w;
  const v = Number(n);
  if (!Number.isFinite(v)) return 'okay';
  if (v >= 80) return 'glowing';
  if (v >= 60) return 'well';
  if (v >= 40) return 'okay';
  if (v >= 20) return 'weary';
  return 'faint';
}
function statusOf() {
  const s = swallow(() => eng('getStatus'), null);
  if (s && typeof s === 'object') return s;
  return {};
}
/* Normalize needs to {belly, heart, sleep} words from either API shape. */
function needWords() {
  const st = ES();
  const gs = statusOf();
  const w = (gs && gs.words) || {};
  if (w.belly || w.heart || w.sleep) {
    return {
      belly: String(w.belly || w.food || 'content'),
      heart: String(w.heart || w.joy || 'okay'),
      sleep: String(w.sleep || w.rest || 'rested'),
    };
  }
  if (w.food || w.joy || w.rest) {
    return { belly: String(w.food || 'content'), heart: String(w.joy || 'okay'), sleep: String(w.rest || 'rested') };
  }
  if (st.needs && typeof st.needs === 'object') {
    const n = st.needs;
    const pick = (v) => (typeof v === 'string' ? v : wordFor(v, 'generic'));
    return { belly: pick(n.belly), heart: pick(n.heart), sleep: pick(n.sleep) };
  }
  const s = st.stats || {};
  return {
    belly: wordFor(s.food, 'food'),
    heart: wordFor(s.joy, 'joy'),
    sleep: wordFor(s.rest, 'rest'),
  };
}
function healthWord() {
  const gs = statusOf();
  if (gs && gs.words && gs.words.health) return String(gs.words.health);
  const st = ES();
  if (typeof st.health === 'string' && st.health) return st.health;
  if (Number.isFinite(+st.health)) return wordFor(+st.health, 'health');
  if (typeof st.moodWord === 'string' && /sturdy|tender|fragile|ailing|thriving/i.test(st.moodWord)) return st.moodWord;
  const s = st.stats || {};
  if (Number.isFinite(+s.health)) return wordFor(+s.health, 'health');
  return 'okay';
}
function trustWord() {
  const gs = statusOf();
  if (gs && typeof gs.trustWord === 'string' && gs.trustWord) return gs.trustWord;
  if (gs && gs.words && gs.words.bond) return String(gs.words.bond);
  const st = ES();
  if (typeof st.trust === 'string') return st.trust;
  const s = st.stats || {};
  return wordFor(s.bond, 'bond');
}
const aliveNow = () => { const gs = statusOf(); if (typeof gs.alive === 'boolean') return gs.alive; return ES().alive !== false; };
const sleepNow = () => { const gs = statusOf(); if (typeof gs.sleeping === 'boolean') return gs.sleeping; const st = ES(); return !!(st.sleeping || st.asleep); };
const sickNow = () => { const gs = statusOf(); if (typeof gs.sick === 'boolean') return gs.sick; return ES().sick === true; };
const scaredNow = () => ES().scared === true;
const nameNow = () => { const gs = statusOf(); return String(gs.name || ES().name || 'A small friend'); };
const stageNow = () => { const gs = statusOf(); return String(gs.stage || ES().stage || 'egg'); };
function warnStage() {
  const st = ES();
  if (Number.isFinite(+st.warnStage)) {
    const w = Math.round(+st.warnStage);
    if (w >= 3) return 'critical';
    if (w === 2) return 'unwell';
    if (w === 1) return 'tender';
    return 'well';
  }
  if (typeof st.warnStage === 'string' && st.warnStage) return st.warnStage;
  if (!aliveNow()) return 'gone';
  const h = healthWord().toLowerCase();
  if (sickNow() && (h === 'ailing' || h === 'fragile')) return 'critical';
  if (sickNow()) return 'unwell';
  if (h === 'tender' || h === 'fragile' || h === 'ailing') return 'tender';
  return 'well';
}
function doFeed() { return eng('feed'); }
function doPlay() { return eng('play'); }
function doSit() { return eng('sitClose') || eng('pet') || eng('soothe'); }
function doBreathe() { return eng('breathe') || eng('soothe'); }
function doTuck() { return eng('tuck'); }
function doWake() { return eng('wake'); }
function doMedicine() { return eng('medicine') || eng('cleanSick'); }
function doHatch() { return eng('hatchEgg'); }
function doRebirth() { return eng('rebirth'); }
function doTick(dt, dark) {
  try {
    const f = engine.tick;
    if (typeof f === 'function') return f.call(engine, dt, { dark, night: dark });
  } catch {}
  return null;
}
function diaryPush(line) {
  try {
    const st = ES();
    if (Array.isArray(st.diary)) {
      st.diary.push(String(line));
      while (st.diary.length > 120) st.diary.shift();
      return true;
    }
  } catch {}
  return false;
}

/* ---------- tiny ui store ---------- */
const UI_KEY = 'v2-ui-v1';
let ui = {};
try { ui = JSON.parse(localStorage.getItem(UI_KEY)) || {}; } catch { ui = {}; }
if (!ui.guided) ui.guided = {};
function storeUi() { try { localStorage.setItem(UI_KEY, JSON.stringify(ui)); } catch {} }
function persist() {
  eng('save');
  storeUi();
}

/* ---------- status echo: last ritual lingers a while ---------- */
let lastRitualKind = '', lastRitualAt = 0;
function noteRitual(kind) {
  try { lastRitualKind = String(kind || ''); lastRitualAt = Date.now(); } catch {}
}
function ritualEcho() {
  try {
    if (!lastRitualKind) return '';
    if (Date.now() - lastRitualAt > 10 * 60 * 1000) return '';
    if (lastRitualKind === 'snack') return 'Still glowing from that snack.';
    if (lastRitualKind === 'play') return 'Still humming from that game.';
    if (lastRitualKind === 'sit') return 'Still warm from sitting close.';
    if (lastRitualKind === 'breathe') return 'Still steady from breathing together.';
    if (lastRitualKind === 'tuck') return 'Still cozy from being tucked in.';
    if (lastRitualKind === 'wake') return 'Still blinking awake, glad to see you.';
    if (lastRitualKind === 'medicine') return 'Still held close, feeling a touch better.';
    return '';
  } catch { return ''; }
}
function withEcho(line) {
  try {
    const e = ritualEcho();
    if (!e || !line) return line;
    if (String(line).includes(e)) return line;
    return String(line).replace(/[.\s]+$/, '') + '. ' + e;
  } catch { return line; }
}

/* ---------- sound: optional, degrades to silence ---------- */
let chimeFn = null, setMutedFn = null;
let muted = ui.muted === true;
try {
  import('./sound.js').then((m) => {
    try {
      chimeFn = typeof m.chime === 'function' ? m.chime : null;
      setMutedFn = typeof m.setMuted === 'function' ? m.setMuted : null;
      if (muted && setMutedFn) setMutedFn(true);
    } catch {}
  }).catch(() => {});
} catch {}
function chime(kind) { try { if (chimeFn && !muted) chimeFn(kind); } catch {} }

/* ---------- toast ---------- */
let toastTimer = 0;
function say(msg, ms = 2600) {
  if (!msg) return;
  try {
    toast.textContent = String(msg);
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, ms);
  } catch {}
}

/* ---------- night: manual toggle + auto dusk-to-dawn ---------- */
let demoNight = false;
function autoNight() { const h = new Date().getHours(); return h >= 21 || h < 7; }
function nightNow() {
  if (demoNight) return true;
  if (ui.manualNight === true) return true;
  if (ui.manualNight === false) return false;
  return autoNight();
}
function applyNight() {
  const n = nightNow();
  try {
    document.body.classList.toggle('night', n);
    if (n) document.body.setAttribute('data-phase', 'night');
    else document.body.setAttribute('data-phase', 'day');
    if (nightLabel) nightLabel.textContent = ui.manualNight === true ? 'Night: on' : ui.manualNight === false ? 'Night: off' : 'Night: auto';
    if (btnNight) btnNight.setAttribute('aria-pressed', ui.manualNight === true ? 'true' : 'false');
  } catch {}
}

/* ---------- tab presence + favicon (data URI only, no fetch) ---------- */
const FAVS = {
  glad: '%23e59a8b', sleepy: '%238fa6d8', poorly: '%23c9b8a6', peckish: '%23e8a24f', waiting: '%23a9b0c4',
};
function setFav(tint) {
  if (!favLink) return;
  try {
    favLink.href = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='34' r='24' fill='%23fff5e2'/%3E%3Ccircle cx='32' cy='34' r='24' fill='none' stroke='" + tint + "' stroke-width='4'/%3E%3Ccircle cx='24' cy='32' r='5' fill='%233d342e'/%3E%3Ccircle cx='40' cy='32' r='5' fill='%233d342e'/%3E%3Cpath d='M26 44 Q32 48 38 44' stroke='%234a3f36' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E";
  } catch {}
}
function updateTitle() {
  const unnamed = stageNow() === 'egg' || !ui.onboardDone;
  const n = unnamed ? 'A small friend' : nameNow();
  let t = unnamed ? 'A small friend' : n + ' · a small friend';
  let fav = FAVS.glad;
  try {
    if (unnamed) { t = 'A small friend'; fav = FAVS.glad; }
    else if (!aliveNow()) { t = 'remembering ' + n + ' · a small friend'; fav = FAVS.waiting; }
    else if (sleepNow()) { t = n + ' is sleeping softly'; fav = FAVS.sleepy; }
    else if (sickNow()) { t = n + ' is needing-near'; fav = FAVS.poorly; }
    else {
      const w = needWords();
      if (/hungry|starving|peckish/i.test(w.belly)) { t = n + ' feels a little peckish'; fav = FAVS.peckish; }
      else if (/lonely|blue/i.test(w.heart)) { t = n + ' hopes you will visit'; fav = FAVS.waiting; }
      else if (/tired|exhausted|drowsy/i.test(w.sleep)) { t = n + ' feels sleepy'; fav = FAVS.sleepy; }
    }
    document.title = t;
    setFav(fav);
  } catch {}
}

/* ---------- onboarding: name + promise + three slow seconds ---------- */
function ritualValid() {
  return petNameInput.value.trim().length >= 2 && promiseInput.value.trim().length >= 8;
}
function refreshCommit() {
  try {
    commitBtn.disabled = !ritualValid();
    if (!ritualValid()) commitHint.textContent = 'A short name, and a promise of a few words, unlocks the button.';
    else commitHint.textContent = 'Three slow seconds. Hold it the whole way.';
  } catch {}
}
swallow(() => {
  petNameInput.addEventListener('input', refreshCommit);
  promiseInput.addEventListener('input', refreshCommit);
});
let holdRAF = 0, holdStart = 0;
const HOLD_MS = 3000;
function setEggStage(p) {
  try {
    if (!eggHold) return;
    eggHold.classList.remove('egg-1', 'egg-2', 'egg-3');
    if (p >= 0.66) eggHold.classList.add('egg-3');
    else if (p >= 0.33) eggHold.classList.add('egg-2');
    else if (p > 0) eggHold.classList.add('egg-1');
  } catch {}
}
function holdTick() {
  const p = Math.min(1, (performance.now() - holdStart) / HOLD_MS);
  try { commitFill.style.transform = 'scaleX(' + p + ')'; } catch {}
  setEggStage(p);
  if (p >= 1) { finishHold(); return; }
  holdRAF = requestAnimationFrame(holdTick);
}
function startHold(e) {
  if (e) swallow(() => e.preventDefault());
  if (commitBtn.disabled) { try { commitHint.textContent = 'Give a name and a small promise first.'; } catch {} return; }
  try { commitBtn.classList.add('holding'); } catch {}
  try { commitHint.textContent = 'Keep holding…'; } catch {}
  holdStart = performance.now();
  cancelAnimationFrame(holdRAF);
  holdRAF = requestAnimationFrame(holdTick);
}
function cancelHold() {
  if (!commitBtn.classList.contains('holding')) return;
  try { commitBtn.classList.remove('holding'); } catch {}
  cancelAnimationFrame(holdRAF);
  try { commitFill.style.transform = 'scaleX(0)'; } catch {}
  setEggStage(0);
  try { commitHint.textContent = 'Three slow seconds. Hold it the whole way.'; } catch {}
}
function finishHold() {
  cancelAnimationFrame(holdRAF);
  try { commitBtn.classList.remove('holding'); } catch {}
  try { commitFill.style.transform = 'scaleX(1)'; } catch {}
  const name = petNameInput.value.trim().slice(0, 24);
  const promise = promiseInput.value.trim().slice(0, 120);
  ui.promise = promise;
  let okName = false;
  const r = swallow(() => eng('setName', name), null);
  if (r && r.ok !== false) okName = true;
  else {
    try { if (ES()) ES().name = name; okName = true; } catch { okName = false; }
  }
  let okHatch = false;
  if (stageNow() === 'egg') {
    const h = swallow(() => doHatch(), null);
    okHatch = !!(h ? h.ok !== false : true);
  } else okHatch = true;
  ui.hatchAt = Date.now();
  ui.onboardDone = true;
  storeUi();
  try { commitFill.style.transform = 'scaleX(0)'; } catch {}
  setEggStage(0);
  if (okName && okHatch) { persist(); enterMain(true); scheduleGuides(); }
  else say('Something hiccuped. Try holding again?');
}
swallow(() => {
  commitBtn.addEventListener('pointerdown', startHold);
  commitBtn.addEventListener('pointerup', (e) => { if (commitBtn.classList.contains('holding')) swallow(() => e.preventDefault()); });
  commitBtn.addEventListener('pointercancel', cancelHold);
  commitBtn.addEventListener('pointerleave', cancelHold);
  window.addEventListener('pointerup', () => {
    if (commitBtn.classList.contains('holding') && performance.now() - holdStart < HOLD_MS) cancelHold();
  });
  commitBtn.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    if (e.key === ' ' || e.key === 'Enter') { swallow(() => e.preventDefault()); startHold(e); }
  });
  commitBtn.addEventListener('keyup', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      swallow(() => e.preventDefault());
      if (commitBtn.classList.contains('holding') && performance.now() - holdStart < HOLD_MS) cancelHold();
    }
  });
  commitBtn.addEventListener('blur', () => {
    if (commitBtn.classList.contains('holding') && performance.now() - holdStart < HOLD_MS) cancelHold();
  });
  commitBtn.addEventListener('contextmenu', (e) => swallow(() => e.preventDefault()));
});

/* ---------- creature view + goal-legible wander ---------- */
let view = null;
swallow(() => {
  view = new CreatureView(canvas);
  const hue = ES().accentHue;
  if (Number.isFinite(hue)) swallow(() => view.setAccent(hue));
  else swallow(() => view.setAccent(14));
});
function safeMood(m) { try { if (view && view.setMood) view.setMood(m); } catch {} }
function safeAct(a) { try { if (view && view.setAct) view.setAct(a); } catch {} }
function safeReact(zone) { try { if (view && typeof view.react === 'function') view.react(zone); } catch {} }
swallow(() => {
  stage.addEventListener('pointermove', (e) => {
    if (!view || !view.lookAt) return;
    const r = canvas.getBoundingClientRect();
    gaze.x = (e.clientX - r.left) / Math.max(1, r.width);
    gaze.y = (e.clientY - r.top) / Math.max(1, r.height);
    gazeAt = performance.now();
  });
});
const gaze = { x: 0.5, y: 0.4 };
let gazeAt = 0;

const SPOTS = [
  { el: spotSnack, x: 0.78, y: 0.72, goal: 'snack' },
  { el: spotSun, x: 0.24, y: 0.3, goal: 'sun' },
  { el: spotNest, x: 0.52, y: 0.8, goal: 'nest' },
];
function layoutSpots() {
  for (const s of SPOTS) {
    try { s.el.style.left = (s.x * 100) + '%'; s.el.style.top = (s.y * 100) + '%'; } catch {}
  }
  placeSnackHome();
}
function placeSnackHome() {
  try {
    snackDrag.style.left = '78%';
    snackDrag.style.top = '60%';
    snackDrag.style.fontSize = '26px';
  } catch {}
}
layoutSpots();
const wander = { x: 0.5, y: 0.55, tx: 0.5, ty: 0.55, goal: 'sun', pause: 1.5, wob: Math.random() * 9 };
let ritualTarget = null;
function spotXY(goal) {
  const s = SPOTS.find((q) => q.goal === goal);
  return s ? { x: s.x, y: s.y } : { x: 0.5, y: 0.55 };
}
function goSpot(goal) {
  const p = spotXY(goal);
  ritualTarget = { x: p.x + (Math.random() - 0.5) * 0.06, y: p.y + (Math.random() - 0.5) * 0.06 };
  wander.pause = 0;
}
function pickTarget() {
  if (ritualTarget) {
    wander.tx = Math.min(0.94, Math.max(0.06, ritualTarget.x));
    wander.ty = Math.min(0.94, Math.max(0.06, ritualTarget.y));
    wander.pause = 0;
    return;
  }
  const st = ES();
  let want = SPOTS[Math.floor(Math.random() * SPOTS.length)];
  try {
    const w = needWords();
    if (/hungry|starving/i.test(w.belly)) want = SPOTS[0];
    else if (/lonely|blue/i.test(w.heart)) want = SPOTS[1];
    else if (/tired|exhausted|drowsy/i.test(w.sleep) || sleepNow()) want = SPOTS[2];
  } catch {}
  wander.goal = want.goal;
  wander.tx = Math.min(0.94, Math.max(0.06, want.x + (Math.random() - 0.5) * 0.14));
  wander.ty = Math.min(0.94, Math.max(0.06, want.y + (Math.random() - 0.5) * 0.14));
  wander.pause = 1 + Math.random() * 2.2;
}
function clamp01(v) { return Math.min(0.94, Math.max(0.06, v)); }
function stepWander(dt) {
  wander.wob += dt;
  const slow = (!aliveNow() || sickNow() || warnStage() === 'critical') ? 0.45 : 1;
  if (sleepNow()) {
    const n = spotXY('nest');
    wander.x += (n.x - wander.x) * Math.min(1, dt * 2);
    wander.y += (n.y - wander.y) * Math.min(1, dt * 2);
    return { mx: 0, my: 0 };
  }
  if (wander.pause > 0) {
    wander.pause -= dt;
    if (wander.pause <= 0) { pickTarget(); if (ritualTarget) ritualTarget = null; }
    return { mx: 0, my: 0 };
  }
  const dx = wander.tx - wander.x, dy = wander.ty - wander.y;
  const d = Math.hypot(dx, dy);
  if (d < 0.02) {
    if (ritualTarget) { ritualTarget = null; pickTarget(); return { mx: 0, my: 0 }; }
    wander.pause = 1 + Math.random() * 2.2;
    return { mx: 0, my: 0 };
  }
  const sp = (0.1 + d * 0.35) * slow;
  const wob = Math.sin(wander.wob * 2.1) * 0.03;
  const mx = (dx / d) * sp * dt + (-dy / (d || 1)) * wob * dt;
  const my = (dy / d) * sp * dt + (dx / (d || 1)) * wob * dt;
  wander.x = clamp01(wander.x + mx);
  wander.y = clamp01(wander.y + my);
  return { mx, my };
}
function toPx(nx, ny) {
  const r = swallow(() => canvas.getBoundingClientRect(), { width: 300, height: 225 });
  return { x: nx * r.width, y: ny * r.height };
}

/* ---------- words-only status, shelves, buttons ---------- */
function rhythmText() {
  const h = new Date().getHours();
  if (h >= 5 && h < 11) return 'Morning — a shared breakfast starts the day softly.';
  if (h >= 11 && h < 17) return 'Midday — a good moment for a little outing, if the morning was kind.';
  if (h >= 17 && h < 21) return 'Evening — winding down together, no hurry.';
  return 'Night — tucked warm is the coziest place. Untucked nights leave little ones tired by morning.';
}
function renderStatus() {
  const n = nameNow();
  try { petTitle.textContent = n; } catch {}
  try { stageLine.textContent = stageNow() && stageNow() !== 'egg' ? stageNow() : ''; } catch {}
  try { rhythmLine.textContent = rhythmText(); } catch {}
  if (!aliveNow()) { try { statusLine.textContent = ''; } catch {} safeMood('gone'); return; }
  if (sleepNow()) {
    try { statusLine.textContent = n + ' is sleeping softly. Shhh.'; } catch {}
    safeMood('sleep');
    return;
  }
  const ws = warnStage();
  if (ws === 'critical') {
    try { statusLine.textContent = n + ' is very weak and staying near the nest. Staying close, with food and rest, matters most now.'; } catch {}
    safeMood('sick');
    return;
  }
  if (ws === 'unwell') {
    try { statusLine.textContent = n + ' has a little chill and wants nearness. Warmth and patience will see it through.'; } catch {}
    safeMood('sick');
    return;
  }
  if (ws === 'tender') {
    try { statusLine.textContent = withEcho(n + ' is a little quieter today. Small meals and naps help most.'); } catch {}
    safeMood('lonely');
    return;
  }
  if (scaredNow()) {
    try { statusLine.textContent = withEcho(n + ' feels a little trembly and wants you near.'); } catch {}
    safeMood('scared');
    return;
  }
  let w = null;
  try { w = needWords(); } catch { w = null; }
  if (!w) { try { statusLine.textContent = n + ' is here, glad to see you.'; } catch {} safeMood('content'); return; }
  const lowIs = (word, list) => list.some((s) => word.toLowerCase().includes(s));
  let line = n + ' is here, glad to see you.';
  let mood = 'content';
  const bellyLow = lowIs(w.belly, ['hungry', 'starving', 'peckish']);
  const heartLow = lowIs(w.heart, ['lonely', 'blue']);
  const sleepLow = lowIs(w.sleep, ['tired', 'exhausted', 'drowsy']);
  if (bellyLow && !heartLow && !sleepLow) { line = n + ' feels ' + w.belly + ' and keeps glancing at the snack corner.'; mood = 'hungry'; }
  else if (heartLow && !bellyLow) { line = n + ' feels ' + w.heart + ' and hopes you will play a moment.'; mood = 'lonely'; }
  else if (sleepLow && !bellyLow) { line = n + ' feels ' + w.sleep + ' and may curl up in the nest soon.'; mood = 'sleepy'; }
  else if (bellyLow) { line = n + ' feels ' + w.belly + ' and keeps glancing at the snack corner.'; mood = 'hungry'; }
  else if (heartLow || sleepLow) { line = n + ' is doing all right, and gladder with you near.'; mood = heartLow ? 'lonely' : 'sleepy'; }
  else {
    const gs = statusOf();
    const traj = gs && gs.trajectory;
    line = n + ' is doing all right, and gladder with you near.';
    if (typeof traj === 'string' && traj) line = n + ' is doing all right — ' + traj + '.';
    else if (nightNow() && !sleepNow()) line = n + ' is getting drowsy as night settles in.';
    mood = /glad|cheer|joy/i.test(w.heart) ? 'happy' : 'content';
  }
  const tw = swallow(() => trustWord(), '');
  if (/close|devoted/i.test(tw || '')) line = line.replace(/\.$/, '') + ', and very fond of you.';
  try { statusLine.textContent = withEcho(line); } catch {}
  safeMood(mood);
}
const K_ICON = { shell: '🐚', feather: '🪶', pebble: '🫧', leaf: '🍃', star: '⭐', ribbon: '🎀', button: '🔘', song: '🎵' };
function keepsakeName(k) {
  if (typeof k === 'string') return k;
  if (k && typeof k === 'object') return String(k.name || k.story || 'keepsake');
  return 'keepsake';
}
function keepsakeStory(k) {
  if (k && typeof k === 'object' && k.story) return String(k.story);
  return '';
}
function renderShelves() {
  const st = ES();
  const keeps = Array.isArray(st.keepsakes) ? st.keepsakes : [];
  try {
    keepsakesEl.innerHTML = '';
    shelfEmpty.hidden = keeps.length > 0;
    for (const k of keeps.slice(-12)) {
      const nm = keepsakeName(k);
      const d = document.createElement('div');
      d.className = 'keepsake';
      const ic = document.createElement('span');
      ic.className = 'icon';
      ic.textContent = K_ICON[nm] || '✨';
      const kn = document.createElement('span');
      kn.className = 'kname';
      kn.textContent = nm;
      const story = keepsakeStory(k);
      if (story) d.title = story;
      d.appendChild(ic); d.appendChild(kn);
      keepsakesEl.appendChild(d);
    }
  } catch {}
  try {
    const diary = Array.isArray(st.diary) ? st.diary : [];
    diaryEl.innerHTML = '';
    diaryEmpty.hidden = diary.length > 0;
    for (const e of diary.slice(-6).reverse()) {
      const text = typeof e === 'string' ? e : (e && (e.text || e.entry)) || '';
      if (!text) continue;
      const p = document.createElement('p');
      p.className = 'diary-entry';
      p.textContent = String(text);
      diaryEl.appendChild(p);
    }
  } catch {}
  try {
    const lin = Array.isArray(st.lineage) ? st.lineage : [];
    const names = lin.map((x) => (typeof x === 'string' ? x : (x && x.name) || '')).filter(Boolean);
    memorialEmpty.hidden = names.length > 0;
    memorialList.innerHTML = '';
    for (const nm of names.slice(-10)) {
      const li = document.createElement('li');
      li.textContent = nm;
      memorialList.appendChild(li);
    }
  } catch {}
  try { promiseWall.textContent = ui.promise ? '“' + ui.promise + '”' : ''; } catch {}
}
let busy = false;
function renderButtons() {
  const sleep = sleepNow();
  try { btnTuck.querySelector('.actLabel').textContent = sleep ? 'Wake gently' : 'Tuck in'; } catch {}
  try {
    btnTuck.disabled = busy;
    const sick = sickNow() || (ui.guided && ui.guideChillActive);
    if (sleep) {
      try { if (actionsEl) actionsEl.classList.add('panel-quiet'); } catch {}
      try { btnFeed.hidden = true; } catch {}
      try { btnPlay.hidden = true; } catch {}
      try { btnSit.hidden = true; } catch {}
      try { btnBreathe.hidden = true; } catch {}
      try { btnMedicine.hidden = true; } catch {}
      try { btnTuck.hidden = false; } catch {}
    } else {
      try { if (actionsEl) actionsEl.classList.remove('panel-quiet'); } catch {}
      try { btnFeed.hidden = false; } catch {}
      try { btnPlay.hidden = false; } catch {}
      try { btnSit.hidden = false; } catch {}
      try { btnBreathe.hidden = false; } catch {}
      btnMedicine.hidden = !sick;
    }
    btnFeed.disabled = busy || sleep || !aliveNow();
    btnPlay.disabled = busy || sleep || !aliveNow();
    btnSit.disabled = busy || !aliveNow();
    btnBreathe.disabled = busy || !aliveNow();
    btnMedicine.disabled = busy;
  } catch {}
  renderHealthNote();
  suggestRitual();
}
function suggestRitual() {
  try {
    for (const b of [btnFeed, btnPlay, btnSit, btnBreathe, btnTuck, btnMedicine]) {
      try { if (b) b.classList.remove('suggested'); } catch {}
    }
    if (busy || !aliveNow()) return;
    if (sleepNow()) { try { if (btnTuck) btnTuck.classList.add('suggested'); } catch {} return; }
    if (sickNow() && btnMedicine && !btnMedicine.hidden) {
      try { btnMedicine.classList.add('suggested'); } catch {}
      return;
    }
    let belly = NaN, heart = NaN, rest = NaN;
    try {
      const st = ES();
      if (st && st.needs) {
        belly = +st.needs.belly; heart = +st.needs.heart; rest = +st.needs.sleep;
      }
    } catch {}
    let pick = null;
    if (Number.isFinite(belly) && Number.isFinite(heart) && Number.isFinite(rest)) {
      if (belly <= heart && belly <= rest) pick = btnFeed;
      else if (rest <= belly && rest <= heart) pick = btnTuck;
      else pick = btnPlay;
    } else {
      try {
        const w = needWords();
        const lowBelly = /hungry|starving|peckish/i.test(w.belly || '');
        const lowSleep = /tired|exhausted|drowsy/i.test(w.sleep || '');
        if (lowBelly) pick = btnFeed;
        else if (lowSleep) pick = btnTuck;
        else pick = btnPlay;
      } catch { pick = null; }
    }
    if (pick && !pick.hidden && !pick.disabled) pick.classList.add('suggested');
  } catch {}
}
function renderHealthNote() {
  const ws = warnStage();
  try {
    if (!aliveNow() || ws === 'well') { healthNote.hidden = true; return; }
    healthNote.hidden = false;
    const n = nameNow();
    if (ws === 'critical') healthText.textContent = n + ' is very weak. Staying close and keeping them fed and rested matters most now. A quiet sit-together helps more than anything.';
    else if (ws === 'unwell') healthText.textContent = n + ' has a little chill. A little food and rest will help the medicine along.';
    else healthText.textContent = n + ' is a little quieter today. Unhurried company, a snack, a nap — that is plenty.';
  } catch {}
}
function renderAll() { renderStatus(); renderShelves(); renderButtons(); updateTitle(); }

/* ---------- completion-first ritual runner ---------- */
function emote(txt, nx, ny) {
  try {
    const s = document.createElement('span');
    s.className = 'emote';
    s.textContent = txt;
    s.style.left = ((nx ?? wander.x) * 100) + '%';
    s.style.top = ((ny ?? wander.y) * 100) + '%';
    effects.appendChild(s);
    setTimeout(() => swallow(() => s.remove()), 1450);
  } catch {}
}
function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }
function needWake() {
  if (sleepNow()) { say('Fast asleep. Wake gently first?'); return true; }
  return false;
}
function busyNote() {
  if (!busy) return false;
  say('One moment… still here with you.');
  return true;
}

/* Feed: drag the snack over; animation first, benefit after. */
async function feedRitual() {
  if (busyNote() || !aliveNow() || needWake()) return;
  busy = true; renderButtons();
  goSpot('snack');
  safeAct('eat'); safeMood('hungry');
  emote('🍪');
  chime('feed');
  await wait(1100);
  const res = swallow(() => doFeed(), null);
  safeAct('idle');
  busy = false;
  persist(); renderAll();
  if (res && res.ok === false) say(res.msg || 'Full and happy. A little company is plenty.');
  else {
    noteRitual('snack');
    renderAll();
    say((res && res.msg) || 'Eaten slowly, then looked up, glad.');
    if (ui.guided && !ui.guided.hunger) {
      ui.guided.hunger = true; storeUi();
      hideGuide();
      say('First meal together. Read the glance, shared the snack — that is the whole game.', 3400);
    }
    if (ui.guideChillActive) chillStep('fed');
  }
}
/* Play: hide-and-find at the warm spot, a round or two, then benefit. */
let playRound = null;
let playCancel = false;
async function playRitual() {
  if (busyNote() || !aliveNow() || needWake()) return;
  busy = true; renderButtons();
  playCancel = false;
  const n = nameNow();
  showPlayGuide('Tap your friend when you spot them.');
  safeAct('play'); safeMood('happy');
  goSpot('sun');
  try { spotSun.classList.add('spot-glow'); } catch {}
  chime('play');
  emote('✨');
  let found = 0;
  const rounds = 2;
  while (found < rounds) {
    goSpot(found % 2 ? 'sun' : 'nest');
    await wait(900);
    if (playCancel) break;
    const tapped = await waitCreatureTap(30000);
    if (playCancel || !tapped) break;
    found += 1;
    emote(found >= rounds ? '💛' : '✨');
    chime('play');
    safeReact('head');
    await wait(500);
  }
  hidePlayGuide();
  try { spotSun.classList.remove('spot-glow'); } catch {}
  await wait(400);
  const res = swallow(() => doPlay(), null);
  safeAct('idle');
  busy = false;
  persist(); renderAll();
  if (res && res.ok === false) say(res.msg || 'Too sleepy to play. A nap together first?');
  else {
    noteRitual('play');
    renderAll();
    say(n + ' lights up and trots back for more.');
  }
}
/* Sit close: always available, tiny and kind. */
let sitCount = 0;
async function sitRitual() {
  if (busyNote() || !aliveNow()) return;
  busy = true; renderButtons();
  ritualTarget = { x: 0.5, y: 0.62 };
  wander.pause = 0;
  safeAct('greet');
  safeReact('head');
  try {
    canvas.style.transition = 'transform .35s ease';
    canvas.style.transform = 'scale(1.04)';
    setTimeout(() => { try { canvas.style.transform = ''; } catch {} }, 750);
  } catch {}
  emote('❤');
  chime('sit');
  await wait(700);
  const res = swallow(() => doSit(), null);
  safeAct('idle');
  busy = false;
  persist(); renderAll();
  sitCount += 1;
  noteRitual('sit');
  renderAll();
  say((res && res.msg) || 'Leaned in, soft and warm. Always time for this.');
  if (ui.guideChillActive) chillStep('held');
  if (warnStage() === 'critical' && sitCount >= 3) {
    sitCount = 0;
    say('Stayed a while. Breathing a touch easier now.', 3200);
  }
}
/* Tuck / wake: nest ritual, animation before rest. */
async function tuckRitual() {
  if (busyNote() || !aliveNow()) return;
  if (sleepNow()) {
    busy = true; renderButtons();
    await wait(700);
    const res = swallow(() => doWake(), null);
    safeAct('greet'); safeMood('content');
    busy = false;
    persist(); renderAll();
    noteRitual('wake');
    renderAll();
    say((res && res.msg) || 'Blinked awake and looked straight for you.');
    if (ui.guided && ui.guideDuskActive) finishDusk();
    return;
  }
  busy = true; renderButtons();
  goSpot('nest');
  try { spotNest.classList.add('spot-glow'); } catch {}
  safeAct('sleep'); safeMood('sleepy');
  emote('🌙');
  chime('tuck');
  await wait(1300);
  const res = swallow(() => doTuck(), null);
  try { spotNest.classList.remove('spot-glow'); } catch {}
  busy = false;
  persist(); renderAll();
  const night = nightNow();
  noteRitual('tuck');
  renderAll();
  say((res && res.msg) || (night ? 'Curled up small and drifted off. Rest well — they will be here.' : 'A short nap together. Even daylight naps help.'));
  if (ui.guided && ui.guideDuskActive && sleepNow()) {
    try { guideText.textContent = 'Tucked warm. When you are ready, wake gently — real night-times work just like this.'; } catch {}
  }
}
/* Breathe: held a little while, benefit only on completion. */
let brRAF = 0, brStart = 0, brDone = false;
const BREATHE_MS = 5000;
function breatheTick() {
  const el = performance.now() - brStart;
  const p = Math.min(1, el / BREATHE_MS);
  try { breatheFill.style.transform = 'scaleX(' + p + ')'; } catch {}
  const reduced = swallow(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, false);
  if (reduced) {
    try { breatheRing.style.transform = 'scale(1)'; } catch {}
    try { breatheText.textContent = 'breathe together, easy and still…'; } catch {}
  } else {
    const phase = (el / 4000) * Math.PI * 2;
    const s = 1 + 0.22 * Math.sin(phase - Math.PI / 2) * p + 0.1 * p;
    try { breatheRing.style.transform = 'scale(' + s.toFixed(3) + ')'; } catch {}
    try { breatheText.textContent = Math.sin(phase - Math.PI / 2) > 0 ? 'breathe out…' : 'breathe in…'; } catch {}
  }
  if (p >= 1 && !brDone) { brDone = true; finishBreathe(); return; }
  brRAF = requestAnimationFrame(breatheTick);
}
function startBreathe(e) {
  if (e) swallow(() => e.preventDefault());
  if (busy || !aliveNow()) return;
  try { btnBreathe.classList.add('holding'); } catch {}
  try { breatheOv.hidden = false; } catch {}
  brDone = false;
  brStart = performance.now();
  cancelAnimationFrame(brRAF);
  brRAF = requestAnimationFrame(breatheTick);
  safeAct('soothe');
}
function cancelBreathe() {
  cancelAnimationFrame(brRAF);
  try { btnBreathe.classList.remove('holding'); } catch {}
  try { breatheOv.hidden = true; } catch {}
  try { breatheFill.style.transform = 'scaleX(0)'; } catch {}
  safeAct('idle');
  if (brStart) say('That was nice anyway. No need to finish.');
  brStart = 0;
}
async function finishBreathe() {
  cancelAnimationFrame(brRAF);
  try { btnBreathe.classList.remove('holding'); } catch {}
  try { breatheOv.hidden = true; } catch {}
  try { breatheFill.style.transform = 'scaleX(0)'; } catch {}
  brStart = 0;
  emote('❤');
  chime('breathe');
  await wait(500);
  const res = swallow(() => doBreathe(), null);
  safeAct('idle');
  persist(); renderAll();
  noteRitual('breathe');
  renderAll();
  say((res && res.msg) || 'Breathed together a while. Steadier now — both of you.');
  if (ui.guideChillActive) chillStep('breathed');
}
/* Medicine: gentle, needs food and rest alongside. */
async function medicineRitual() {
  if (busyNote() || !aliveNow()) return;
  busy = true; renderButtons();
  safeAct('soothe'); safeMood('sick');
  emote('🌿');
  chime('medicine');
  await wait(1100);
  const res = swallow(() => doMedicine(), null);
  safeAct('idle');
  busy = false;
  persist(); renderAll();
  if (res && res.ok !== false && !sickNow()) {
    noteRitual('medicine');
    renderAll();
    say((res && res.msg) || 'Held close until the shivers eased. Well done.');
    if (ui.guideChillActive) finishChill(true);
    else {
      diaryPush('Nursed back after the chill, together.');
      renderShelves(); persist();
    }
  } else {
    say((res && res.msg) || 'Held close. A little food and rest will help the medicine along.');
    if (ui.guideChillActive) chillStep('medicine');
  }
}

/* ---------- snack drag + creature tap ---------- */
let dragOn = false;
function stagePos(e) {
  const r = swallow(() => stage.getBoundingClientRect(), null);
  if (!r) return { x: 0.5, y: 0.5 };
  const cx = (e.clientX - r.left) / Math.max(1, r.width);
  const cy = (e.clientY - r.top) / Math.max(1, r.height);
  return { x: Math.min(1, Math.max(0, cx)), y: Math.min(1, Math.max(0, cy)) };
}
swallow(() => {
  snackDrag.addEventListener('pointerdown', (e) => {
    swallow(() => e.preventDefault());
    dragOn = true;
    try { snackDrag.setPointerCapture(e.pointerId); } catch {}
    try { snackDrag.classList.add('dragging'); } catch {}
    moveSnack(e);
  });
  snackDrag.addEventListener('pointermove', (e) => { if (dragOn) moveSnack(e); });
  const drop = (e) => {
    if (!dragOn) return;
    dragOn = false;
    try { snackDrag.classList.remove('dragging'); } catch {}
    const p = stagePos(e);
    const d = Math.hypot(p.x - wander.x, p.y - wander.y);
    if (d < 0.2) { placeSnackHome(); feedRitual(); }
    else {
      placeSnackHome();
      say('Drag the little treat right over to your friend.');
      goSpot('snack');
    }
  };
  snackDrag.addEventListener('pointerup', drop);
  snackDrag.addEventListener('pointercancel', () => { dragOn = false; placeSnackHome(); });
  snackDrag.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { swallow(() => e.preventDefault()); feedRitual(); }
  });
  function moveSnack(e) {
    const p = stagePos(e);
    try { snackDrag.style.left = (p.x * 100) + '%'; snackDrag.style.top = (p.y * 100) + '%'; } catch {}
  }
});
function canvasTapPos(e) {
  const r = swallow(() => canvas.getBoundingClientRect(), null);
  if (!r) return { x: 0.5, y: 0.5 };
  return {
    x: (e.clientX - r.left) / Math.max(1, r.width),
    y: (e.clientY - r.top) / Math.max(1, r.height),
  };
}
let tapResolvers = [];
function waitCreatureTap(ms) {
  return new Promise((resolve) => {
    const t = setTimeout(() => {
      tapResolvers = tapResolvers.filter((r) => r !== done);
      resolve(false);
    }, ms);
    const done = (v) => { clearTimeout(t); resolve(v); };
    tapResolvers.push(done);
  });
}
function cancelCreatureWait() {
  playCancel = true;
  const rs = tapResolvers.splice(0);
  for (const r of rs) swallow(() => r(false));
}
function creatureTap() {
  if (!aliveNow()) return;
  if (sleepNow()) {
    emote('💤');
    say('Shhh… dreaming softly. Wake gently when ready.');
    return;
  }
  safeReact('back');
  const rs = tapResolvers.splice(0);
  for (const r2 of rs) swallow(() => r2(true));
  if (rs.length) return;
  if (busy) { say('One moment… still here with you.'); return; }
  if (playRound === null) sitRitual();
}
swallow(() => {
  canvas.addEventListener('pointerdown', (e) => {
    const p = canvasTapPos(e);
    const d = Math.hypot(p.x - wander.x, p.y - wander.y);
    try {
      const r = canvas.getBoundingClientRect();
      if (view && view.lookAt) view.lookAt((e.clientX - r.left) / Math.max(1, r.width), (e.clientY - r.top) / Math.max(1, r.height));
      gazeAt = performance.now();
    } catch {}
    if (d < 0.28) {
      const zone = p.y < wander.y - 0.05 ? 'head' : p.y > wander.y + 0.08 ? 'belly' : 'back';
      safeReact(zone);
      if (sleepNow()) {
        emote('💤');
        say('Shhh… dreaming softly. Wake gently when ready.');
        const rs0 = tapResolvers.splice(0);
        for (const r2 of rs0) swallow(() => r2(false));
        return;
      }
      const rs = tapResolvers.splice(0);
      for (const r2 of rs) swallow(() => r2(true));
      if (rs.length) return;
      if (busy) { say('One moment… still here with you.'); return; }
      if (!tapResolvers.length && playRound === null) sitRitual();
    } else if (tapResolvers.length) {
      emote('·', p.x, p.y);
      say('almost — try again', 1200);
    }
  });
  canvas.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { swallow(() => e.preventDefault()); creatureTap(); }
    else if (e.key === 'Escape') {
      swallow(() => e.preventDefault());
      if (tapResolvers.length) { say('Paused the game. No hurry at all.'); cancelCreatureWait(); }
    }
  });
  spotSun.addEventListener('click', () => { if (busy) say('One moment… still here with you.'); else playRitual(); });
  spotNest.addEventListener('click', () => { if (busy) say('One moment… still here with you.'); else tuckRitual(); });
});
swallow(() => {
  /* spots are decorative glows; ritual taps live on canvas + buttons */
  for (const s of [spotSun, spotNest]) {
    try { s.style.pointerEvents = 'none'; } catch {}
  }
});
swallow(() => {
  btnFeed.addEventListener('click', () => { goSpot('snack'); feedRitual(); });
  btnPlay.addEventListener('click', playRitual);
  btnSit.addEventListener('click', sitRitual);
  btnTuck.addEventListener('click', tuckRitual);
  btnMedicine.addEventListener('click', medicineRitual);
  btnBreathe.addEventListener('pointerdown', startBreathe);
  btnBreathe.addEventListener('pointerup', () => { if (brStart && !brDone) cancelBreathe(); });
  btnBreathe.addEventListener('pointercancel', () => { if (brStart && !brDone) cancelBreathe(); });
  btnBreathe.addEventListener('pointerleave', () => { if (brStart && !brDone) cancelBreathe(); });
  btnBreathe.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    if (e.key === ' ' || e.key === 'Enter') { swallow(() => e.preventDefault()); startBreathe(e); }
  });
  btnBreathe.addEventListener('keyup', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      swallow(() => e.preventDefault());
      if (brStart && !brDone) cancelBreathe();
    }
  });
  btnBreathe.addEventListener('blur', () => { if (brStart && !brDone) cancelBreathe(); });
  btnBreathe.addEventListener('contextmenu', (e) => swallow(() => e.preventDefault()));
  btnNight.addEventListener('click', () => {
    if (ui.manualNight === true) ui.manualNight = false;
    else if (ui.manualNight === false) ui.manualNight = null;
    else ui.manualNight = true;
    storeUi(); applyNight(); renderStatus();
    say(ui.manualNight === true ? 'Night settles in. Soft and dim.' : ui.manualNight === false ? 'Daylight again. Bright and easy.' : 'Back to following the real sky.');
  });
  btnMute.addEventListener('click', () => {
    muted = !muted;
    ui.muted = muted; storeUi();
    try { if (setMutedFn) setMutedFn(muted); } catch {}
    try { muteLabel.textContent = muted ? 'Quiet: on' : 'Quiet: off'; } catch {}
    try { btnMute.setAttribute('aria-pressed', muted ? 'true' : 'false'); } catch {}
  });
  if (muted) { try { muteLabel.textContent = 'Quiet: on'; } catch {} try { btnMute.setAttribute('aria-pressed', 'true'); } catch {} }
  try {
    if (playGiveUp) playGiveUp.addEventListener('click', (e) => {
      try { if (e) e.stopPropagation(); } catch {}
      say('Paused the game. No hurry at all.');
      cancelCreatureWait();
    });
  } catch {}
});

/* ---------- guided first moments (teach by doing) ---------- */
function hideGuide() { try { guideHint.hidden = true; } catch {} }
function showGuide(t) { try { guideText.textContent = t; guideHint.hidden = false; } catch {} }
function showPlayGuide(t) {
  try {
    if (playGuideText) playGuideText.textContent = t;
    if (playGuide) playGuide.hidden = false;
  } catch {}
}
function hidePlayGuide() { try { if (playGuide) playGuide.hidden = true; } catch {} }
function demoBoost() {
  try {
    const hatched = ui.hatchAt || Date.now();
    if (Date.now() - hatched < 10 * 60 * 1000) return 10;
  } catch {}
  return 1;
}
let guideTimers = [];
function scheduleGuides() {
  for (const t of guideTimers) clearTimeout(t);
  guideTimers = [];
  if (ui.guided.hunger && ui.guided.dusk) { maybeScheduleChill(); return; }
  if (!ui.guided.hunger) {
    guideTimers.push(setTimeout(() => {
      if (main.hidden || !aliveNow() || ui.guided.hunger) return;
      goSpot('snack');
      try { spotSnack.classList.add('spot-glow'); } catch {}
      setTimeout(() => { try { spotSnack.classList.remove('spot-glow'); } catch {} }, 12000);
      showGuide('Looks peckish — glancing at the snack corner. Drag the little treat right over, tap it, or press Enter.');
      say('Someone looks peckish…', 3000);
      safeMood('hungry');
    }, 25 * 1000));
  }
  if (!ui.guided.dusk) {
    guideTimers.push(setTimeout(() => {
      if (main.hidden || !aliveNow() || ui.guided.dusk) return;
      startDusk();
    }, 6 * 60 * 1000));
  }
  maybeScheduleChill();
}
function startDusk() {
  demoNight = true;
  applyNight();
  ui.guideDuskActive = true; storeUi();
  goSpot('nest');
  safeMood('sleepy'); safeAct('sleep');
  try { spotNest.classList.add('spot-glow'); } catch {}
  showGuide('Pretend night is falling… the nest glows. Tap it, or Tuck in — then wake gently when ready.');
  say('A pretend dusk, just to learn the way night feels.', 3400);
  renderAll();
}
function finishDusk() {
  ui.guided.dusk = true;
  ui.guideDuskActive = false;
  demoNight = false;
  storeUi();
  applyNight();
  hideGuide();
  try { spotNest.classList.remove('spot-glow'); } catch {}
  say('That is night mode — at real night-time it gets properly sleepy. Untucked nights feel tired by morning.', 4200);
  diaryPush('Learned tucking-in under a pretend dusk.');
  renderShelves(); persist();
  maybeScheduleChill();
}
function maybeScheduleChill() {
  if (ui.guided.chill || ui.guideChillActive) return;
  guideTimers.push(setTimeout(() => {
    if (main.hidden || !aliveNow() || ui.guided.chill || ui.guideChillActive) return;
    if (sickNow()) { startChill('noticed'); return; }
    startChill('demo');
  }, 9 * 60 * 1000));
}
function startChill(how) {
  if (how === 'demo') {
    const r = swallow(() => (typeof engine.beginChillDemo === 'function' ? engine.beginChillDemo() : null), null);
    if (r && r.ok === false && /still here|no need/i.test(String(r.msg || ''))) return;
  }
  ui.guideChillActive = true;
  ui.chillSteps = {};
  storeUi();
  safeMood('sick');
  emote('🌧');
  if (how === 'demo') showGuide('A shiver… a pretend chill, so you can learn the way back. Sit close, share a snack, breathe together — then a little medicine.');
  else showGuide('A little chill — shivery and wanting-near. Sit close, share a snack, breathe together — then a little medicine. Food and rest help the medicine along.');
  say('Shivery… staying near is the medicine that matters most.', 3400);
  renderButtons();
}
function chillStep(step) {
  try {
    ui.chillSteps = ui.chillSteps || {};
    ui.chillSteps[step] = true;
    storeUi();
    const s = ui.chillSteps;
    if (!s.held) showGuide('Held close… good. Now share a little snack.');
    else if (!s.fed) showGuide('Eaten… good. Now hold Breathe together a little while.');
    else if (!s.breathed) showGuide('Steadier… good. Now a little medicine, then rest.');
    else showGuide('Almost warm again. A little medicine now.');
  } catch {}
}
function finishChill(recovered) {
  ui.guided.chill = true;
  ui.guideChillActive = false;
  storeUi();
  hideGuide();
  renderAll();
  if (recovered) {
    say('Warmer now, breathing easy. You nursed them back — together.', 3600);
    chime('recover');
    emote('💛');
    if (!diaryHas('nursed back')) diaryPush('Nursed back after the chill — held close the whole way.');
    renderShelves(); persist();
  }
}
function diaryHas(frag) {
  try {
    const d = ES().diary || [];
    return d.some((e) => String(typeof e === 'string' ? e : (e && e.text) || '').toLowerCase().includes(frag));
  } catch { return false; }
}

/* ---------- excursions: one outing gift a day ---------- */
function todayStr() {
  try { return new Date().toISOString().slice(0, 10); } catch { return 'day'; }
}
let excursionRunning = false;
let lastExcursionTry = 0;
async function excursionRitual() {
  if (busy || excursionRunning || !aliveNow() || sleepNow() || sickNow()) return;
  const can = swallow(() => (typeof engine.canExcursion === 'function' ? engine.canExcursion() : false), false);
  if (!can) {
    const res = swallow(() => (typeof engine.excursion === 'function' ? engine.excursion() : null), null);
    if (res && res.msg) say(res.msg, 3400);
    else say('Would love to wander, but a snack and some company first would help.', 3400);
    return;
  }
  excursionRunning = true;
  busy = true; renderButtons();
  say('Wandered off to peek at the world, knowing you are near. Back in a while with a story.', 3400);
  safeAct('excursion');
  ritualTarget = { x: 0.94, y: 0.5 };
  wander.pause = 0;
  await wait(2200);
  const res = swallow(() => (typeof engine.excursion === 'function' ? engine.excursion() : null), null);
  goSpot('sun');
  safeReact('head');
  await wait(1400);
  safeAct('idle');
  excursionRunning = false;
  busy = false;
  persist(); renderAll();
  if (res && res.ok !== false) {
    const msg = String((res && res.msg) || '');
    const found = (res && res.find) || (/with (.+?), proud/.exec(msg) || [])[1] || 'a small wonder';
    ui.lastGiftDay = todayStr(); storeUi();
    say('Came back from a little adventure with ' + found + '.', 3600);
    chime('gift');
    emote('🎁');
    if (res && res.grew) { say('Came back from a little adventure with ' + found + ', and grew a touch, too.', 3600); }
  } else if (res && res.msg) say(res.msg, 3400);
  renderAll();
}
function maybeExcursion() {
  if (main.hidden || busy || excursionRunning || !aliveNow()) return;
  const h = new Date().getHours();
  if (h < 11 || h >= 17) return;
  if (Date.now() - lastExcursionTry < 5 * 60 * 1000) return;
  if (sleepNow() || sickNow()) return;
  const can = swallow(() => (typeof engine.canExcursion === 'function' ? engine.canExcursion() : false), false);
  if (!can) {
    if (ui.excursionRefusedDay !== todayStr()) {
      ui.excursionRefusedDay = todayStr(); storeUi();
      lastExcursionTry = Date.now();
      const res = swallow(() => (typeof engine.excursion === 'function' ? engine.excursion() : null), null);
      if (res && res.msg) say(res.msg, 3400);
      else say('Would love to wander, but a snack and some company first would help.', 3400);
    }
    return;
  }
  lastExcursionTry = Date.now();
  excursionRitual();
}
function handleEvents(events) {
  if (!Array.isArray(events)) return;
  for (const ev of events) {
    const t = ev && ev.type;
    if (t === 'excursion') {
      say('Wandered off to peek at the world, knowing you are near. Back in a while with a story.', 3400);
    } else if (t === 'returned') {
      const find = (ev && ev.find) || 'a small wonder';
      if (ui.lastGiftDay !== todayStr()) {
        ui.lastGiftDay = todayStr(); storeUi();
        say('Came back from a little adventure with ' + find + '.', 3600);
        chime('gift');
        emote('🎁');
      } else {
        say('Back from a wander, happy to be home. One outing a day is plenty.', 3200);
      }
    } else if (t === 'sick') {
      if (!ui.guideChillActive && !ui.guided.chill) startChill('noticed');
      else { say('A little chill. Gentle care will see it through.', 3200); renderButtons(); }
    } else if (t === 'recovered') {
      if (ui.guideChillActive) finishChill(true);
      else say('Feeling better after steady care. Well done.', 3200);
    } else if (t === 'critical') {
      say('Very weak now. Staying close matters most.', 3600);
      renderButtons();
    } else if (t === 'grew') {
      say('Grew into a new season of smallness.', 3600);
      chime('grow');
      emote('🌱');
    }
  }
}

/* ---------- welcome-back story, sized to absence, never scolding ---------- */
function spanWords(mins) {
  if (mins < 8) return 'a little while';
  if (mins < 70) return 'a while';
  if (mins < 540) return 'many hours';
  return 'a long, long time';
}
function showWelcomeBack(awayMinutes, events, story) {
  if (!awayMinutes || awayMinutes < 1.5) return;
  const n = nameNow();
  const tidy = (s) => String(s || '').replace(/;+/g, ',').replace(/\s+/g, ' ').trim().replace(/[.\s]+$/, '').trim();
  const lines = [];
  if (Array.isArray(story) && story.length) {
    for (const s of story.slice(-3)) {
      if (!s) continue;
      const c = tidy(s);
      if (c) lines.push(c);
    }
  } else if (Array.isArray(events) && events.length) {
    if (events.some((e) => e && e.type === 'returned')) lines.push('came back from a little adventure while you were away');
    if (events.some((e) => e && e.type === 'sick')) lines.push('felt a little shivery for a bit, then rested');
    if (events.some((e) => e && e.type === 'grew')) lines.push('grew a touch, too');
  }
  const clean = lines.map(tidy).filter(Boolean);
  const g = swallow(() => { const f = engine.getGreeting || engine.consumeGreeting || engine.acknowledgeReturn; return typeof f === 'function' ? f.call(engine) : null; }, null);
  const rush = g && (g.intense || /rush|missed/i.test(g.text || ''));
  try {
    returnNote.hidden = false;
    const greet = rush && g.text ? tidy(g.text) : '';
    let t = greet
      ? greet + '. '
      : n + ' notices you and comes rushing over, glowing all over — so glad you are back. ';
    if (clean.length) t += 'While you were away for ' + spanWords(awayMinutes) + ', ' + clean.join(' ') + '. ';
    else t += 'While you were away for ' + spanWords(awayMinutes) + ', the little home kept warm. ';
    const hasSpoiled = /spoiled/i.test(clean.join(' ') + ' ' + greet);
    if (!hasSpoiled) t += 'Nothing is spoiled — pick up wherever you are.';
    else t = t.trim().replace(/[.\s]+$/, '') + '.';
    t = String(t).replace(/;+/g, ',').replace(/\.{2,}/g, '.').replace(/\s{2,}/g, ' ').trim();
    returnText.textContent = t;
  } catch {}
}
swallow(() => {
  $('#returnDismiss').addEventListener('click', () => { try { returnNote.hidden = true; } catch {} });
  $('#breakDismiss').addEventListener('click', () => { try { breakNote.hidden = true; } catch {} hideBreakSoon(); });
});

/* ---------- farewell → memorial → one-tap rebirth ---------- */
let farewellShown = false;
async function runFarewell() {
  if (farewellShown) return;
  farewellShown = true;
  persist();
  const st = ES();
  const n = nameNow();
  try {
    farewell.hidden = false;
    farewellFade.hidden = false;
    farewellMemorial.hidden = true;
    farewell.style.opacity = '1';
  } catch {}
  safeMood('gone');
  const lines = [
    n + ' is very tired now.',
    'Stay a moment. There is nowhere else to be.',
    'Thank you for staying. They felt safe with you.',
  ];
  for (const l of lines) {
    try { farewellText.textContent = l; } catch {}
    await wait(2400);
    try { if (farewell.hidden) return; } catch { return; }
  }
  try {
    farewellFade.hidden = true;
    memorialName.textContent = n;
    const days = st.ageDays;
    const lived = Number.isFinite(days) && days >= 1 ? 'lived gently, and long for someone so small' : 'lived a small, loved life';
    const keeps = Array.isArray(st.keepsakes) ? st.keepsakes.length : 0;
    memorialStory.textContent = n + ' ' + lived + '. Nothing you did wrong brought this — some lives are just short. ' +
      (keeps ? 'The keepsakes stay on the shelf. ' : '') +
      'Their name stays with you, and when you are ready, someone new is waiting. There is no hurry.';
    farewellMemorial.hidden = false;
  } catch {}
  renderShelves();
}
swallow(() => {
  farewellRestart.addEventListener('click', () => {
    swallow(() => doRebirth(), null);
    persist();
    farewellShown = false;
    try {
      farewell.hidden = true;
      farewellMemorial.hidden = true;
      farewellFade.hidden = false;
    } catch {}
    try {
      petNameInput.value = '';
      promiseInput.value = ui.promise || '';
      refreshCommit();
      const h = $('#onboardTitle');
      if (h) h.textContent = 'Someone new is waiting.';
    } catch {}
    try { onboarding.hidden = false; main.hidden = true; } catch {}
    say('Take your time. There is no hurry. The love carries over; the story starts fresh.');
  });
});

/* ---------- enter main ---------- */
function enterMain(fresh) {
  try {
    onboarding.hidden = true;
    main.hidden = false;
    farewell.hidden = true;
  } catch {}
  renderAll();
  if (fresh) {
    const n = nameNow();
    say(n + ' hatches, tiny and blinking, and looks straight at you. Welcome.', 3600);
    chime('hatch');
  }
}

/* ---------- break suggestion: gentle, never blocking ---------- */
let breakTimer = 0;
function armBreak() {
  clearTimeout(breakTimer);
  breakTimer = setTimeout(() => {
    try {
      if (main.hidden || !aliveNow()) return;
      breakNote.hidden = false;
    } catch {}
  }, 30 * 60 * 1000);
}
function hideBreakSoon() { try { if (engine.state) engine.state.breakSuggested = false; } catch {} }

/* ---------- persist on hide/close ---------- */
let hiddenAt = 0;
swallow(() => {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { hiddenAt = Date.now(); persist(); }
    else {
      applyNight();
      if (hiddenAt && Date.now() - hiddenAt > 60000 && aliveNow() && !main.hidden) {
        const n = nameNow();
        say('Oh, you are back. ' + n + ' missed you.');
        try {
          returnNote.hidden = false;
          returnText.textContent = n + ' waited, and thought of you. Nothing is spoiled — pick up wherever you are.';
        } catch {}
      }
      hiddenAt = 0;
      try { renderAll(); } catch {}
    }
  });
  window.addEventListener('beforeunload', persist);
  window.addEventListener('pagehide', persist);
});

/* ---------- main loop: rAF render + one-second tick + ten-second save ---------- */
function renderFrame(dt) {
  if (main.hidden || !view) return;
  try {
    const { mx, my } = stepWander(dt);
    const r = canvas.getBoundingClientRect();
    const px = wander.x * Math.max(1, r.width);
    const py = wander.y * Math.max(1, r.height);
    const vx = (mx / Math.max(dt, 1e-3)) * 60;
    const vy = (my / Math.max(dt, 1e-3)) * 60;
    if (performance.now() - gazeAt < 1000) {
      try { view.lookAt(gaze.x, gaze.y); } catch {}
    }
    try { view.update(dt, { x: px, y: py }, { x: vx, y: vy }); } catch {}
    try { view.draw(); } catch {}
  } catch {}
}
let lastFrame = performance.now(), acc = 0, saveAcc = 0;
function frame(now) {
  const dt = Math.min(0.1, (now - lastFrame) / 1000);
  lastFrame = now;
  acc += dt;
  saveAcc += dt;
  renderFrame(dt);
  if (acc >= 1) {
    const steps = Math.floor(acc);
    acc -= steps;
    for (let i = 0; i < steps; i++) {
      const boost = demoBoost();
      const r = swallow(() => doTick((1 / 60) * boost, nightNow()), null);
      const evs = r && Array.isArray(r.events) ? r.events : [];
      if (evs.length) handleEvents(evs);
      if (r && r.died) { /* engine-side farewell flag */ }
    }
    if (!main.hidden) {
      renderStatus();
      renderButtons();
      updateTitle();
      if (!aliveNow()) runFarewell();
      else swallow(() => maybeExcursion());
      try {
        if (ES().breakSuggested && breakNote.hidden) breakNote.hidden = false;
      } catch {}
    }
  }
  if (saveAcc >= 10) {
    saveAcc = 0;
    if (!main.hidden) { persist(); renderShelves(); }
  }
  requestAnimationFrame(frame);
}

/* ---------- boot ---------- */
refreshCommit();
applyNight();
setInterval(applyNight, 60000);
(function boot() {
  let found = false, awayMinutes = 0, events = [], story = [];
  const res = swallow(() => eng('load'), null);
  if (res && typeof res === 'object') {
    found = !!(res.found || res.ok);
    awayMinutes = Number(res.awayMinutes) || 0;
    events = Array.isArray(res.events) ? res.events : [];
    story = Array.isArray(res.story) ? res.story : [];
  } else {
    try { found = !!(ES().name && stageNow() !== 'egg'); } catch { found = false; }
  }
  const hasSave = found && stageNow() !== 'egg';
  if (hasSave) {
    if (!ui.hatchAt) { ui.hatchAt = Date.now() - 11 * 60 * 1000; storeUi(); }
    enterMain(false);
    if (awayMinutes >= 1.5) showWelcomeBack(awayMinutes, events, story);
    else say(nameNow() + ' is glad you are here.');
    if (events && events.length) handleEvents(events);
    if (!aliveNow()) runFarewell();
    else {
      if (sickNow() && !ui.guided.chill) startChill('noticed');
      else if (!ui.guided.hunger || !ui.guided.dusk) scheduleGuides();
      else maybeScheduleChill();
    }
  } else if (found && stageNow() === 'egg' && ui.onboardDone) {
    enterMain(false);
    say('The little egg waits, warm with possibility.');
    scheduleGuides();
  } else {
    try { onboarding.hidden = false; main.hidden = true; } catch {}
  }
  renderAll();
  armBreak();
  requestAnimationFrame(frame);
})();
