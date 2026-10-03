import { createEngine, statWord } from './engine.js';
import { CreatureView } from './creature.js';

window.__vfBooted = true;

const $ = (s) => document.querySelector(s);
const onboarding = $('#onboarding'), main = $('#main');
const petNameInput = $('#petName'), promiseInput = $('#promise');
const commitBtn = $('#commit'), commitFill = $('#commitFill'), commitHint = $('#commitHint');
const petTitle = $('#petTitle'), stageLine = $('#stageLine'), statusLine = $('#statusLine');
const stage = $('#stage'), canvas = $('#scene'), effects = $('#effects');
const spotSun = $('#spotSun'), spotSnack = $('#spotSnack'), spotNest = $('#spotNest');
const breathe = $('#breathe'), breatheRing = $('#breatheRing'), breatheText = $('#breatheText');
const btnFeed = $('#btnFeed'), btnPlay = $('#btnPlay'), btnPet = $('#btnPet');
const btnSoothe = $('#btnSoothe'), sootheFill = $('#sootheFill');
const btnTuck = $('#btnTuck'), btnMedicine = $('#btnMedicine');
const healthNote = $('#healthNote'), healthText = $('#healthText');
const returnNote = $('#returnNote'), returnText = $('#returnText');
const breakNote = $('#breakNote');
const keepsakesEl = $('#keepsakes'), shelfEmpty = $('#shelfEmpty');
const diaryEl = $('#diary'), diaryEmpty = $('#diaryEmpty');
const memorialEmpty = $('#memorialEmpty'), memorialList = $('#memorialList');
const promiseWall = $('#promiseWall'), toast = $('#toast');
const farewell = $('#farewell'), farewellText = $('#farewellText');
const farewellFade = $('#farewellFade'), farewellMemorial = $('#farewellMemorial');
const memorialName = $('#memorialName'), farewellRestart = $('#farewellRestart');

const UI_KEY = 'vf-ui-v1', SEEN_KEY = 'vf-lastSeen';
const ui = loadUi();
function loadUi() {
  try { return JSON.parse(localStorage.getItem(UI_KEY)) || {}; }
  catch { return {}; }
}
function storeUi() {
  try { localStorage.setItem(UI_KEY, JSON.stringify(ui)); } catch {}
}
function markSeen() {
  try { localStorage.setItem(SEEN_KEY, String(Date.now())); } catch {}
}
function lastSeen() {
  const v = Number(localStorage.getItem(SEEN_KEY));
  return Number.isFinite(v) && v > 0 ? v : 0;
}

let toastTimer = 0;
function say(msg, ms = 2600) {
  if (!msg) return;
  toast.textContent = msg;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, ms);
}

// --- engine ---
const engine = createEngine();
let loaded = false;
try { loaded = engine.load ? engine.load() : false; } catch { loaded = false; }
const hasSave = !!(loaded && engine.state && engine.state.name);

// offline: fuzzy words, never numbers
(function offline() {
  const seen = lastSeen();
  if (!hasSave || !seen) return;
  const mins = (Date.now() - seen) / 60000;
  if (mins < 1.5) return;
  try { engine.simulateOffline && engine.simulateOffline(Math.round(mins)); } catch {}
  const span = mins < 8 ? 'a little while' : mins < 70 ? 'a while' : mins < 60 * 9 ? 'many hours' : 'a long, long time';
  returnNote.hidden = false;
  returnText.textContent = `While you were away for ${span}, your friend kept on. ${describeAway(mins)}`;
})();
function describeAway(mins) {
  const s = engine.state && engine.state.stats;
  if (!s) return 'Nothing is urgent. Settle back in together.';
  const low = lowestStat(s);
  if (low === 'food') return 'The snack bowl looks a little empty.';
  if (low === 'joy') return 'Someone missed playing with you.';
  if (low === 'rest') return 'Someone looks a little sleepy.';
  return 'Everything feels mostly alright.';
}
$('#returnDismiss').addEventListener('click', () => { returnNote.hidden = true; });
$('#breakDismiss').addEventListener('click', () => { breakNote.hidden = true; });

// --- helpers over unknown engine shape ---
function word(n, kind) {
  try {
    if (engine.statWord) return engine.statWord(n, kind);
  } catch {}
  try {
    return statWord(n, kind);
  } catch {}
  if (n == null || Number.isNaN(n)) return 'okay';
  if (n >= 80) return 'glowing';
  if (n >= 60) return 'well';
  if (n >= 40) return 'okay';
  if (n >= 20) return 'weary';
  return 'faint';
}
function stats() { return (engine.state && engine.state.stats) || {}; }
function lowestStat(s) {
  let k = 'food', v = Infinity;
  for (const key of ['food', 'joy', 'rest', 'health']) {
    const n = Number(s[key]);
    if (Number.isFinite(n) && n < v) { v = n; k = key; }
  }
  return k;
}
function isSleeping() {
  const st = engine.state || {};
  return !!(st.sleeping || st.asleep || st.resting || st.stage === 'sleeping');
}
function isSick() {
  const st = engine.state || {};
  if (st.sick === true || st.ill === true) return true;
  const h = Number(stats().health);
  return Number.isFinite(h) && h < 32;
}
function isNight() {
  const h = new Date().getHours();
  return h >= 21 || h < 7;
}
function applyNight() { document.body.classList.toggle('night', isNight()); }
applyNight();
setInterval(applyNight, 60000);

function persist() {
  try { engine.save && engine.save(); } catch {}
  markSeen();
  storeUi();
}

// --- onboarding: name + promise + 3s hold ---
function ritualValid() {
  return petNameInput.value.trim().length >= 2 && promiseInput.value.trim().length >= 8;
}
function refreshCommit() {
  commitBtn.disabled = !ritualValid();
  if (!ritualValid()) commitHint.textContent = 'A short name, and a promise of a few words, unlocks the button.';
}
petNameInput.addEventListener('input', refreshCommit);
promiseInput.addEventListener('input', refreshCommit);

let holdRAF = 0, holdStart = 0;
const HOLD_MS = 3000;
function holdTick() {
  const p = Math.min(1, (performance.now() - holdStart) / HOLD_MS);
  commitFill.style.transform = `scaleX(${p})`;
  if (p >= 1) { finishHold(); return; }
  holdRAF = requestAnimationFrame(holdTick);
}
function startHold(e) {
  if (e) e.preventDefault();
  if (commitBtn.disabled) {
    commitHint.textContent = 'Give a name and a small promise first.';
    return;
  }
  commitBtn.classList.add('holding');
  commitHint.textContent = 'Keep holding…';
  holdStart = performance.now();
  cancelAnimationFrame(holdRAF);
  holdRAF = requestAnimationFrame(holdTick);
}
function cancelHold() {
  if (!commitBtn.classList.contains('holding')) return;
  commitBtn.classList.remove('holding');
  cancelAnimationFrame(holdRAF);
  commitFill.style.transform = 'scaleX(0)';
  commitHint.textContent = 'Three slow seconds. Hold it the whole way.';
}
function finishHold() {
  cancelAnimationFrame(holdRAF);
  commitBtn.classList.remove('holding');
  commitFill.style.transform = 'scaleX(1)';
  const name = petNameInput.value.trim().slice(0, 24);
  const promise = promiseInput.value.trim().slice(0, 120);
  ui.promise = promise;
  storeUi();
  let ok = false;
  try {
    if (engine.hatchEgg) engine.hatchEgg(name);
    else if (engine.state) engine.state.name = name;
    ok = true;
  } catch { ok = false; }
  try { persist(); } catch {}
  commitFill.style.transform = 'scaleX(0)';
  if (ok) enterMain(true);
  else say('Something hiccuped. Try holding again?');
}
commitBtn.addEventListener('pointerdown', startHold);
commitBtn.addEventListener('pointerup', (e) => { if (commitBtn.classList.contains('holding')) e.preventDefault(); });
commitBtn.addEventListener('pointercancel', cancelHold);
commitBtn.addEventListener('pointerleave', cancelHold);
// pointerup anywhere ends a cancelled hold; completed holds already left this state
window.addEventListener('pointerup', () => {
  if (commitBtn.classList.contains('holding') && performance.now() - holdStart < HOLD_MS) cancelHold();
});
commitBtn.addEventListener('contextmenu', (e) => e.preventDefault());

// --- creature view + goal-seeking wander ---
let view = null;
try {
  fitCanvas();
  view = new CreatureView(canvas);
  const hue = (hash(ui.promise || engine.state?.name || 'friend') % 60) - 30;
  try { view.setAccent && view.setAccent(hue); } catch {}
} catch { view = null; }
function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
function fitCanvas() {
  const r = stage.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.max(2, Math.round(r.width * dpr));
  canvas.height = Math.max(2, Math.round(r.height * dpr));
}
window.addEventListener('resize', fitCanvas);

// spots in normalised coords; jitter each trip for equifinal varying routes
const SPOTS = [
  { el: spotSnack, x: 0.78, y: 0.72, goal: 'snack' },
  { el: spotSun, x: 0.24, y: 0.3, goal: 'sun' },
  { el: spotNest, x: 0.52, y: 0.8, goal: 'nest' },
];
function layoutSpots() {
  for (const s of SPOTS) {
    s.el.style.left = `${s.x * 100}%`;
    s.el.style.top = `${s.y * 100}%`;
  }
}
layoutSpots();
const wander = { x: 0.5, y: 0.55, tx: 0.5, ty: 0.55, goal: 'sun', pause: 0, wob: Math.random() * 9 };
function pickTarget() {
  const others = SPOTS.filter((s) => s.goal !== wander.goal);
  const s = others[Math.floor(Math.random() * others.length)] || SPOTS[0];
  wander.goal = s.goal;
  wander.tx = clamp01(s.x + (Math.random() - 0.5) * 0.14);
  wander.ty = clamp01(s.y + (Math.random() - 0.5) * 0.14);
  wander.pause = 1 + Math.random() * 2.2;
}
function clamp01(v) { return Math.min(0.94, Math.max(0.06, v)); }
function stepWander(dt) {
  wander.wob += dt;
  if (wander.pause > 0) { wander.pause -= dt; if (wander.pause <= 0) pickTarget(); return { mx: 0, my: 0 }; }
  const dx = wander.tx - wander.x, dy = wander.ty - wander.y;
  const d = Math.hypot(dx, dy);
  if (d < 0.02) { wander.pause = 1 + Math.random() * 2.2; return { mx: 0, my: 0 }; }
  const sp = 0.1 + d * 0.35; // slower near arrival
  const wob = Math.sin(wander.wob * 2.1) * 0.03;
  const mx = (dx / d) * sp * dt + -dy / (d || 1) * wob * dt;
  const my = (dy / d) * sp * dt + dx / (d || 1) * wob * dt;
  wander.x = clamp01(wander.x + mx);
  wander.y = clamp01(wander.y + my);
  return { mx, my };
}
function toPx(nx, ny) {
  const r = canvas.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  return { x: nx * r.width * dpr, y: ny * r.height * dpr };
}

// gaze follows cursor / touch
stage.addEventListener('pointermove', (e) => {
  if (!view || !view.lookAt) return;
  const r = canvas.getBoundingClientRect();
  view.lookAt((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
});

// --- qualitative status line, no numbers ---
function renderStatus() {
  const st = engine.state || {};
  const name = st.name || 'A small friend';
  petTitle.textContent = name;
  stageLine.textContent = st.stage ? `· ${st.stage}` : '';
  if (st.alive === false) { statusLine.textContent = ''; return; }
  if (isSleeping()) {
    statusLine.textContent = `${name} is sleeping softly. Shhh.`;
    try { view && view.setMood && view.setMood('sleepy'); } catch {}
    return;
  }
  if (isSick()) {
    statusLine.textContent = `${name} feels poorly and wants you near.`;
    try { view && view.setMood && view.setMood('sick'); } catch {}
    return;
  }
  const s = stats();
  const keys = ['food', 'joy', 'rest'].filter((k) => Number.isFinite(Number(s[k])));
  if (!keys.length) { statusLine.textContent = `${name} is here, glad to see you.`; return; }
  const worst = keys.slice().sort((a, b) => s[a] - s[b])[0];
  const w = word(s[worst], worst);
  const line = worst === 'food'
    ? `${name} feels ${w} and keeps glancing at the snack corner.`
    : worst === 'joy'
      ? `${name} feels ${w} and hopes you will play a moment.`
      : `${name} feels ${w} and may curl up in the nest soon.`;
  const bond = Number(s.bond);
  statusLine.textContent = Number.isFinite(bond) && bond > 75
    ? line.replace(/\.$/, '') + ', and very fond of you.'
    : line;
  try {
    const mood = worst === 'food' ? 'hungry' : worst === 'joy' ? (s[worst] < 35 ? 'sad' : 'playful') : (s[worst] < 35 ? 'tired' : 'content');
    view && view.setMood && view.setMood(mood);
  } catch {}
}

// --- progress shelves: keepsakes / diary / lineage, words only ---
const K_ICON = { shell: '🐚', feather: '🪶', pebble: '🫧', leaf: '🍃', star: '⭐', ribbon: '🎀', button: '🔘', song: '🎵' };
function renderShelves() {
  const st = engine.state || {};
  const keeps = Array.isArray(st.keepsakes) ? st.keepsakes : [];
  keepsakesEl.innerHTML = '';
  shelfEmpty.hidden = keeps.length > 0;
  for (const k of keeps.slice(-12)) {
    const name = typeof k === 'string' ? k : (k.name || k.id || 'keepsake');
    const icon = typeof k === 'object' && k.icon ? k.icon : (K_ICON[name] || '✨');
    const d = document.createElement('div');
    d.className = 'keepsake';
    d.innerHTML = `<span class="icon"></span><span class="kname"></span>`;
    d.querySelector('.icon').textContent = icon;
    d.querySelector('.kname').textContent = name;
    keepsakesEl.appendChild(d);
  }
  const diary = Array.isArray(st.diary) ? st.diary : [];
  diaryEl.innerHTML = '';
  diaryEmpty.hidden = diary.length > 0;
  for (const e of diary.slice(-6).reverse()) {
    const text = typeof e === 'string' ? e : (e.text || e.entry || '');
    if (!text) continue;
    const p = document.createElement('p');
    p.className = 'diary-entry';
    p.textContent = text;
    diaryEl.appendChild(p);
  }
  const lin = [...(Array.isArray(st.lineage) ? st.lineage : []), ...(Array.isArray(st.pastLives) ? st.pastLives : [])]
    .map((x) => (typeof x === 'string' ? x : (x && (x.name || x.id)) || ''))
    .filter(Boolean);
  memorialEmpty.hidden = lin.length > 0;
  memorialList.innerHTML = '';
  for (const n of lin.slice(-10)) {
    const li = document.createElement('li');
    li.textContent = n;
    memorialList.appendChild(li);
  }
  promiseWall.textContent = ui.promise ? `“${ui.promise}”` : '';
}
function renderButtons() {
  const sleep = isSleeping();
  btnTuck.querySelector('.actLabel').textContent = sleep ? 'Wake' : 'Tuck in';
  btnTuck.disabled = busy;
  const sick = isSick();
  btnMedicine.hidden = !sick;
  for (const b of [btnFeed, btnPlay, btnPet, btnSoothe]) b.disabled = busy || sleep;
  btnMedicine.disabled = busy;
}

// --- care: completion animation BEFORE engine benefit ---
let busy = false;
function emote(txt, nx, ny) {
  const s = document.createElement('span');
  s.className = 'emote';
  s.textContent = txt;
  s.style.left = `${(nx ?? wander.x) * 100}%`;
  s.style.top = `${(ny ?? wander.y) * 100}%`;
  effects.appendChild(s);
  setTimeout(() => s.remove(), 1450);
}
async function doCare(kind, fn, line) {
  if (busy || engine.state?.alive === false) return;
  if (isSleeping() && kind !== 'wake' && kind !== 'tuck') {
    say('Fast asleep. Wake gently first?');
    return;
  }
  busy = true;
  renderButtons();
  const acts = { feed: 'eating', play: 'playing', pet: 'petted', tuck: 'sleeping', wake: 'waking', medicine: 'soothed' };
  try { view && view.setAct && view.setAct(acts[kind] || kind); } catch {}
  emote(kind === 'feed' ? '🍪' : kind === 'play' ? '✨' : kind === 'medicine' ? '🌿' : '❤');
  await new Promise((r) => setTimeout(r, 900)); // let the moment land first
  let res = null;
  try { res = fn(); } catch { res = null; }
  try { view && view.setAct && view.setAct('idle'); } catch {}
  busy = false;
  persist();
  renderAll();
  say((res && res.msg) || line || 'A small happy moment.');
}
btnFeed.addEventListener('click', () => doCare('feed', () => engine.feed && engine.feed(), 'A shared snack, eaten slowly.'));
btnPlay.addEventListener('click', () => doCare('play', () => engine.play && engine.play(), 'A good little game together.'));
btnPet.addEventListener('click', () => doCare('pet', () => engine.pet && engine.pet(), 'A gentle pat. Leaned into.'));
btnMedicine.addEventListener('click', () => doCare('medicine', () => engine.cleanSick && engine.cleanSick(), 'Held close until the shivers eased.'));
btnTuck.addEventListener('click', () => {
  if (isSleeping()) doCare('wake', () => engine.wake && engine.wake(), 'Wakened soft and slow.');
  else doCare('tuck', () => engine.tuck && engine.tuck(), 'Tucked in warm. Sleep tight.');
});

// --- soothe: 5s held breathing, benefit only on completion ---
let sootheRAF = 0, sootheStart = 0, sootheDone = false;
const SOOTHE_MS = 5000;
function sootheTick() {
  const el = performance.now() - sootheStart;
  const p = Math.min(1, el / SOOTHE_MS);
  sootheFill.style.transform = `scaleX(${p})`;
  const phase = (el / 4000) * Math.PI * 2; // one slow breath
  const scale = 1 + 0.22 * Math.sin(phase - Math.PI / 2) * p + 0.1 * p;
  breatheRing.style.transform = `scale(${scale.toFixed(3)})`;
  breatheText.textContent = Math.sin(phase - Math.PI / 2) > 0 ? 'breathe out…' : 'breathe in…';
  if (p >= 1 && !sootheDone) {
    sootheDone = true;
    finishSoothe();
    return;
  }
  sootheRAF = requestAnimationFrame(sootheTick);
}
function startSoothe(e) {
  if (e) e.preventDefault();
  if (busy || engine.state?.alive === false) return;
  btnSoothe.classList.add('holding');
  breathe.hidden = false;
  sootheDone = false;
  sootheStart = performance.now();
  cancelAnimationFrame(sootheRAF);
  sootheRAF = requestAnimationFrame(sootheTick);
  try { view && view.setAct && view.setAct('soothed'); } catch {}
}
function cancelSoothe(finished) {
  cancelAnimationFrame(sootheRAF);
  btnSoothe.classList.remove('holding');
  breathe.hidden = true;
  sootheFill.style.transform = 'scaleX(0)';
  try { view && view.setAct && view.setAct('idle'); } catch {}
  if (!finished && sootheStart) say('That was nice anyway. No need to finish.');
  sootheStart = 0;
}
function finishSoothe() {
  cancelAnimationFrame(sootheRAF);
  btnSoothe.classList.remove('holding');
  breathe.hidden = true;
  sootheFill.style.transform = 'scaleX(0)';
  sootheStart = 0;
  emote('❤');
  let res = null;
  try { res = engine.soothe && engine.soothe(); } catch {}
  try { view && view.setAct && view.setAct('idle'); } catch {}
  persist();
  renderAll();
  say((res && res.msg) || 'Breathed together. Steadier now.');
}
btnSoothe.addEventListener('pointerdown', startSoothe);
btnSoothe.addEventListener('pointerup', () => { if (sootheStart && !sootheDone) cancelSoothe(false); });
btnSoothe.addEventListener('pointercancel', () => { if (sootheStart && !sootheDone) cancelSoothe(false); });
btnSoothe.addEventListener('pointerleave', () => { if (sootheStart && !sootheDone) cancelSoothe(false); });
btnSoothe.addEventListener('contextmenu', (e) => e.preventDefault());

// --- enter main ---
function enterMain(fresh) {
  onboarding.hidden = true;
  main.hidden = false;
  farewell.hidden = true;
  fitCanvas();
  renderAll();
  if (fresh) {
    const n = engine.state?.name || 'little one';
    say(`${n} is here. Be gentle with each other.`, 3400);
  }
  markSeen();
}

// --- farewell: gentle stages -> memorial -> one-tap restart ---
let farewellShown = false;
async function runFarewell() {
  if (farewellShown) return;
  farewellShown = true;
  persist();
  const name = engine.state?.name || 'A small friend';
  farewell.hidden = false;
  farewellFade.hidden = false;
  farewellMemorial.hidden = true;
  farewell.style.opacity = '1';
  const lines = [
    `${name} is very tired now.`,
    'Stay a moment. There is nowhere else to be.',
    'Thank you for staying. They felt safe with you.',
  ];
  for (const l of lines) {
    farewellText.textContent = l;
    await new Promise((r) => setTimeout(r, 2400));
    if (farewell.hidden) return; // restarted mid-farewell
  }
  farewellFade.hidden = true;
  memorialName.textContent = name;
  farewellMemorial.hidden = false;
  renderShelves();
}
farewellRestart.addEventListener('click', () => {
  try { engine.rebirth && engine.rebirth(); } catch {}
  try { persist(); } catch {}
  farewellShown = false;
  farewell.hidden = true;
  farewellMemorial.hidden = true;
  farewellFade.hidden = false;
  // forgiving restart: naming ritual again, promise kept on the wall
  petNameInput.value = '';
  promiseInput.value = ui.promise || '';
  refreshCommit();
  const h = $('#onboardTitle');
  if (h) h.textContent = 'Someone new is waiting.';
  onboarding.hidden = false;
  main.hidden = true;
  say('Take your time. There is no hurry.');
});

// --- greet after tab hidden > 60s ---
let hiddenAt = 0;
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    hiddenAt = Date.now();
    persist();
  } else {
    applyNight();
    if (hiddenAt && Date.now() - hiddenAt > 60000 && engine.state?.alive !== false && !main.hidden) {
      const n = engine.state?.name || 'your friend';
      say(`Oh, you're back. ${n} missed you.`);
      returnNote.hidden = false;
      returnText.textContent = `${n} waited, and thought of you. Nothing is spoiled — pick up wherever you are.`;
    }
    hiddenAt = 0;
    try { renderAll(); } catch {}
  }
});
window.addEventListener('beforeunload', persist);
window.addEventListener('pagehide', persist);

// --- break suggestion after 30 min together, no streak threats ---
setTimeout(() => {
  if (main.hidden || engine.state?.alive === false) return;
  breakNote.hidden = false;
}, 30 * 60 * 1000);

// --- game loop: rAF render + 1s logic tick + 10s save ---
function renderAll() {
  renderStatus();
  renderShelves();
  renderButtons();
}
let lastFrame = performance.now(), acc = 0, saveAcc = 0;
function frame(now) {
  const dt = Math.min(0.1, (now - lastFrame) / 1000);
  lastFrame = now;
  acc += dt;
  saveAcc += dt;
  if (!main.hidden && view) {
    try {
      const { mx, my } = stepWander(dt);
      const p = toPx(wander.x, wander.y);
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const v = { x: (mx / Math.max(dt, 1e-3)) * r.width * dpr * 0.05, y: (my / Math.max(dt, 1e-3)) * r.height * dpr * 0.05 };
      view.update ? view.update(dt, p, v) : null;
      view.draw ? view.draw() : null;
    } catch {}
  }
  if (acc >= 1) {
    const steps = Math.floor(acc);
    acc -= steps;
    for (let i = 0; i < steps; i++) {
      try { engine.tick && engine.tick(1 / 60, { night: isNight(), sleeping: isSleeping() }); } catch {}
    }
    if (!main.hidden) {
      renderStatus();
      renderButtons();
      if (engine.state?.alive === false) runFarewell();
    }
  }
  if (saveAcc >= 10) {
    saveAcc = 0;
    if (!main.hidden) { persist(); renderShelves(); }
  }
  requestAnimationFrame(frame);
}

// --- boot ---
refreshCommit();
if (hasSave) {
  enterMain(false);
  if (!returnNote.hidden) { /* offline message already set */ }
  else {
    const n = engine.state?.name;
    if (n) say(`${n} is glad you're here.`);
  }
} else {
  onboarding.hidden = false;
  main.hidden = true;
}
renderAll();
requestAnimationFrame(frame);
