/* CreatureView — v2 rebuild, vanilla, zero deps, no external assets.
 *
 * Baby schema as a slider (Glocker): wide face, high forehead, supernormal
 * large glossy eyes, tiny nose + mouth. No disease-coded features: sick is
 * shiver + slow, never gasping; exhausted is droop, never collapse.
 * Animacy from motion (Heider & Simmel): squash-stretch along velocity axis,
 * tilt into turns, hop anticipation, goal-legible easing. Gaze loop: eyes
 * track lookAt within ~1s, petting reads as gaze resting while slow.
 * DPR-aware, cheap fills only (no shadowBlur), reduced-motion aware.
 *
 * v3 staging hooks (additive, all v1/v2 hooks kept):
 * - act 'pounce' (or pounce() helper): anticipation crouch ~0.14s, then hop.
 *   App lane drives wander to the fleck; creature only crouches + hops.
 * - act 'dream': sleep-settled + slow breath + zzz; pair with DOM
 *   .nest-dream on the nest spot + floating em for the dream beat.
 * - act 'hum': gentle idle variant, soft smile; pair with a note emote
 *   + chime('hum'). act 'present': trot-in gift hop; pair with .emote.gift.
 * - mood 'tender': soft warm read; longer pauses live in the app lane —
 *   multiply wander.pause by pauseFactor() (tender 1.6x, unwell/sick 1.8x,
 *   critical 2.4x, sleepy 1.5x, spent/exhausted 1.8x).
 * - moods 'unwell'/'critical' (+ legacy 'sick'): x-jitter shiver, flat
 *   mouth (never gasp), dull coat, droop. 'critical' droops hardest
 *   (R*0.2) + stays readable vs sleeping (sleep = shut eyes + zzz +
 *   no shiver; critical = half-mast droopy eyes + shiver + flat mouth).
 * - spark tired ('sleepy'/'spent'/'exhausted'): curls smaller + softer
 *   glow, warm coat, soft mouth, NO shiver — tired must not read as ill.
 * - nest-clamp (staying near nest when critical) is app-lane positioning;
 *   this view only renders the weak droop so the clamp reads clearly.
 */

const MOODS = new Set([
  'content', 'happy', 'hungry', 'sleepy', 'lonely', 'scared',
  'sick', 'sleep', 'gone', 'tender', 'unwell', 'critical',
  'spent', 'exhausted',
]);
const ACTS = new Set([
  'idle', 'wander', 'seek', 'eat', 'play', 'sleep',
  'breathe', 'greet', 'grieve', 'shiver', 'excursion',
  'pounce', 'dream', 'hum', 'present',
]);
// legacy v1 act names still accepted, mapped forward
const ACT_ALIAS = { soothe: 'breathe', soothed: 'breathe', eating: 'eat', playing: 'play', petted: 'idle', sleeping: 'sleep', waking: 'greet' };
const HAPPY_ACTS = new Set(['play', 'breathe', 'greet', 'excursion', 'pounce', 'hum', 'present']);
// Weak/tired/lonely faces must never be overridden into a happy smile:
// petGlow and giggle peaks stay gated behind this set.
const GLOW_BLOCK = new Set(['sick', 'unwell', 'critical', 'sleepy', 'spent', 'exhausted', 'lonely', 'scared']);

export class CreatureView {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.mood = 'content';
    this.act = 'idle';
    this.accent = 14;

    this.t = Math.random() * 10;
    this.cx = 0; this.cy = 0;
    this.px = 0; this.py = 0;
    this.havePos = false;
    this.vx = 0; this.vy = 0;
    this.speed = 0;
    this.stretch = 0;
    this.tilt = 0;
    this.crouch = 0;
    this.lastSpeed = 0;
    this.breath = 0;
    this.breathRate = 2.1;
    this.gaze = null;
    this._gazeAge = 0;
    this.petGlow = 0;
    this.blinkIn = 2 + Math.random() * 2;
    this.blink = 0;
    this._doubleBlink = false;
    // wander charm: remembered cursor for occasional glances (uses existing lookAt data)
    this._cursor = null;
    this._cursorAt = -99;
    this._glanceT = 0;
    this._glanceIn = 3 + Math.random() * 3;
    this._wasMoving = false;
    // day habitat speckles, seeded per stage size
    this._habitat = null;
    this.w = 0; this.h = 0; this.dpr = 1;

    // touch-zone reaction: { zone, t } seconds remaining
    this.touch = null;
    this.touchT = 0;
    // one-shot hop for greet / eat / happy moments
    this.hop = 0;
    // pounce anticipation: crouch first, hop fires when this hits 0
    this._pounceT = 0;
    this.shiverPhase = Math.random() * 10;
    // garnish particles: play-miss ripples + snack crumb-puffs (cheap canvas dots)
    this._parts = [];

    this.reduced = false;
    try {
      this.reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      if (window.matchMedia) {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const upd = (e) => { this.reduced = !!e.matches; };
        if (mq.addEventListener) mq.addEventListener('change', upd);
        else if (mq.addListener) mq.addListener(upd);
      }
    } catch { this.reduced = false; }

    this._resize();
    if (typeof ResizeObserver !== 'undefined') {
      try {
        this._ro = new ResizeObserver(() => this._resize());
        this._ro.observe(canvas);
      } catch {}
    }
    try { window.addEventListener('resize', () => this._resize()); } catch {}
  }

  setMood(m) { if (MOODS.has(m)) this.mood = m; }
  setAct(a) {
    if (ACT_ALIAS[a]) a = ACT_ALIAS[a];
    if (ACTS.has(a)) {
      if (a === 'greet' && this.act !== 'greet') this.hop = 1;
      if (a === 'eat' && this.act !== 'eat') this.snackPuff();
      if (a === 'pounce') this.pounce();
      if (a === 'present' && this.act !== 'present' && !this.reduced) this.hop = Math.max(this.hop, 0.7);
      if (a === 'dream') this.hop = 0;
      this.act = a;
    }
  }
  // pounce() — sun-fleck pounce: anticipation crouch now, hop lands ~0.14s
  // later via update(). Reduced-motion: crouch only, no hop.
  pounce() {
    if (!this.reduced) {
      this.crouch = Math.max(this.crouch, 1);
      this._pounceT = 0.14;
    } else {
      this.crouch = Math.max(this.crouch, 0.5);
    }
  }
  // pauseFactor() — app-lane wander pacing per mood. Tender pauses longer,
  // weak/tired pause longest; multiply wander.pause by this after pickTarget.
  pauseFactor() {
    switch (this.mood) {
      case 'critical': return 2.4;
      case 'unwell':
      case 'sick': return 1.8;
      case 'spent':
      case 'exhausted': return 1.8;
      case 'tender': return 1.6;
      case 'sleepy': return 1.5;
      default: return 1;
    }
  }
  setAccent(h) {
    h = Number(h);
    if (Number.isFinite(h)) this.accent = ((h % 360) + 360) % 360;
  }

  lookAt(x, y) {
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    const W = this.w || 300, H = this.h || 225;
    // accept normalized 0..1 or css px
    if (Math.abs(x) <= 1.5 && Math.abs(y) <= 1.5 && W > 60) {
      this.gaze = { x: x * W, y: y * H };
    } else {
      this.gaze = { x, y };
    }
    this._gazeAge = 0;
    // remember cursor for occasional glances between pointer moves
    try { this._cursor = { x: this.gaze.x, y: this.gaze.y }; this._cursorAt = this.t; } catch {}
  }

  // Garnish hooks the app lane can call any time (normalized 0..1 or css px):
  // missAt(x, y) pops a ring ripple where a play tap landed wide,
  // snackPuff() puffs biscuit crumbs where the snack rests (bottom-right of
  // the dish, matching the #snackDrag home pin in style.css). snackPuff also
  // fires on its own whenever the act flips to 'eat', so feeding already puffs.
  missAt(x, y) {
    const W = this.w || 300, H = this.h || 225;
    let px = x, py = y;
    if (Math.abs(x) <= 1.5 && Math.abs(y) <= 1.5 && W > 60) { px = x * W; py = y * H; }
    if (!Number.isFinite(px) || !Number.isFinite(py)) return;
    if (this.reduced) return;
    this._parts.push({ kind: 'ring', x: px, y: py, age: 0, life: 0.6 });
    if (this._parts.length > 40) this._parts.splice(0, this._parts.length - 40);
  }

  snackPuff() {
    if (this.reduced) return;
    const W = this.w || 300, H = this.h || 225;
    const bx = W * 0.78, by = H * 0.8;
    const cols = ['#fff3d9', '#f0d49c', '#d8a86a', '#c69a62'];
    for (let i = 0; i < 7; i++) {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
      const sp = 40 + Math.random() * 90;
      this._parts.push({
        kind: 'dot',
        x: bx + (Math.random() - 0.5) * 10, y: by + (Math.random() - 0.5) * 6,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        age: 0, life: 0.5 + Math.random() * 0.3,
        size: 2 + Math.random() * 2.6, color: cols[i % cols.length],
      });
    }
    if (this._parts.length > 40) this._parts.splice(0, this._parts.length - 40);
  }

  // react('head'|'belly'|'back') — distinct touch reaction, returns a word.
  react(zone) {
    const calm = this.reduced ? 0.15 : 1;
    if (zone === 'head') {
      this.touch = 'head'; this.touchT = 1.1;
      this.petGlow = 1; this.hop = Math.max(this.hop, 0.6 * calm);
      return 'wiggle';
    }
    if (zone === 'belly') {
      this.touch = 'belly'; this.touchT = 1.4;
      this.petGlow = 0.9;
      return 'giggle';
    }
    if (zone === 'back') {
      this.touch = 'back'; this.touchT = 1.6;
      this.petGlow = Math.max(this.petGlow, 0.6);
      return 'cozy';
    }
    return 'hello';
  }

  update(dt, pos, vel) {
    dt = Math.min(Math.max(dt || 0, 0), 0.05);
    this.t += dt;
    const W = this.w || 1, H = this.h || 1;

    let tx = W / 2, ty = H * 0.56;
    if (pos && Number.isFinite(pos.x) && Number.isFinite(pos.y)) {
      if (Math.abs(pos.x) <= 1.5 && Math.abs(pos.y) <= 1.5 && W > 60) {
        tx = pos.x * W; ty = pos.y * H;
      } else { tx = pos.x; ty = pos.y; }
    }
    if (!this.havePos) { this.cx = tx; this.cy = ty; this.px = tx; this.py = ty; this.havePos = true; }
    const slow = this._slowFactor();
    const k = 1 - Math.exp(-dt * (9 / slow));
    this.cx += (tx - this.cx) * k;
    this.cy += (ty - this.cy) * k;

    let vx = 0, vy = 0;
    if (vel && Number.isFinite(vel.x) && Number.isFinite(vel.y)) {
      vx = vel.x; vy = vel.y;
      if (Math.abs(vx) <= 3 && Math.abs(vy) <= 3) { vx *= W; vy *= H; }
    } else {
      vx = (tx - this.px) / Math.max(dt, 1e-3);
      vy = (ty - this.py) / Math.max(dt, 1e-3);
    }
    this.px = tx; this.py = ty;
    const vk = 1 - Math.exp(-dt * 7);
    this.vx += (vx - this.vx) * vk;
    this.vy += (vy - this.vy) * vk;
    this.speed = Math.hypot(this.vx, this.vy);

    const target = Math.min(this.speed / 620, 0.26);
    this.stretch += (target - this.stretch) * (1 - Math.exp(-dt * 8));

    const accel = (this.speed - this.lastSpeed) / Math.max(dt, 1e-3);
    this.lastSpeed = this.speed;
    if (accel > 2600 && this.crouch <= 0.05 && !this.reduced) this.crouch = 1;
    // pounce anticipation: crouch held, hop fires when timer lapses
    if (this._pounceT > 0) {
      this._pounceT -= dt;
      this.crouch = Math.max(this.crouch, this.reduced ? 0.3 : 0.8);
      if (this._pounceT <= 0 && !this.reduced) this.hop = Math.max(this.hop, 1);
    }
    this.crouch = Math.max(0, this.crouch - dt * 5.5);
    this.hop = Math.max(0, this.hop - dt * 2.2);
    // wander charm: hop on arrival — was gliding, now settled
    const moving = this.speed > 140;
    if (this._wasMoving && !moving && this.speed < 70 && !this.reduced) {
      if (this.act !== 'sleep' && this.mood !== 'sleep' && this.act !== 'dream') {
        if (this.hop <= 0.05) this.hop = Math.max(this.hop, 0.45);
        this.crouch = Math.max(this.crouch, 0.4);
      }
    }
    this._wasMoving = moving;

    const tiltTarget = Math.max(-0.3, Math.min(0.3, this.vx / 950));
    this.tilt += (tiltTarget - this.tilt) * (1 - Math.exp(-dt * 6));

    this.breathRate = (this.mood === 'sleep' || this.act === 'sleep' || this.act === 'dream') ? 1.1
      : this.act === 'breathe' ? 0.9
      : this._isWeak() ? 1.3 : this._isTired() ? 1.5 : 2.1;
    this.breath += dt * this.breathRate;
    this.shiverPhase += dt * (this._isShivery() ? 26 : 4);

    if (this.touchT > 0) {
      this.touchT -= dt;
      if (this.touchT <= 0) { this.touch = null; this.touchT = 0; }
    }

    // garnish particles drift + fade
    if (this._parts.length) {
      for (const p of this._parts) {
        p.age += dt;
        if (p.kind === 'dot') { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 160 * dt; }
      }
      this._parts = this._parts.filter((p) => p.age < p.life);
    }

    this.blinkIn -= dt;
    if (this.blink > 0) {
      this.blink -= dt;
      if (this.blink <= 0) {
        // wander charm: occasional double-blink, like a sleepy second thought
        if (this._doubleBlink) { this._doubleBlink = false; this.blinkIn = 0.24; }
      }
    }
    else if (this.blinkIn <= 0) {
      this.blink = 0.13;
      // blink rhythm: 2-5s cadence, slower when drowsy or weak, quicker when playful
      this.blinkIn = 2 + Math.random() * 3; // 2-5s cadence
      if (this.mood === 'sleepy' || this.mood === 'sleep' || this._isWeak() || this._isTired()) this.blinkIn += 1.5;
      if (this.act === 'play' || this.act === 'greet') this.blinkIn = Math.max(1.4, this.blinkIn - 1);
      this._doubleBlink = !this.reduced && Math.random() < 0.22;
    }

    if (this.gaze) {
      this._gazeAge += dt;
      if (this._gazeAge > 1) { this.gaze = null; this._gazeAge = 0; }
      else {
        const d = Math.hypot(this.gaze.x - this.cx, this.gaze.y - this.cy);
        const R = this.radius();
        if (d < R * 1.5 && this.speed < 70) this.petGlow = Math.min(1, this.petGlow + dt * 2.2);
        else this.petGlow = Math.max(0, this.petGlow - dt * 1.1);
      }
    } else {
      this._gazeAge = 0;
      this.petGlow = Math.max(0, this.petGlow - dt * 1.1);
    }
    // wander charm: occasional cursor glance using remembered lookAt data
    this._glanceIn -= dt;
    if (this._glanceT > 0) {
      this._glanceT -= dt;
      if (this._cursor && !this.gaze && !this.reduced) {
        this.gaze = { x: this._cursor.x, y: this._cursor.y };
        this._gazeAge = 0.2;
      }
      if (this._glanceT <= 0) this._glanceIn = 3.5 + Math.random() * 4;
    } else if (!this.gaze && this._cursor && !this.reduced) {
      const awake = this.act !== 'sleep' && this.mood !== 'sleep';
      const idle = this.speed < 80 && awake;
      const fresh = (this.t - this._cursorAt) < 14;
      if (idle && fresh && this._glanceIn <= 0) this._glanceT = 0.7 + Math.random() * 0.4;
      else if (this._glanceIn <= 0) this._glanceIn = 2;
    }
  }

  radius() { return Math.max(30, Math.min(this.w, this.h) * 0.205); }

  _isShivery() {
    return this.mood === 'sick' || this.mood === 'unwell' || this.mood === 'critical'
      || this.mood === 'scared' || this.act === 'shiver';
  }
  _isWeak() {
    return this.mood === 'sick' || this.mood === 'unwell' || this.mood === 'critical';
  }
  // tired (spark sleepy/spent) is NOT weak: no shiver, no slow-path, warm read
  _isTired() {
    return this.mood === 'sleepy' || this.mood === 'spent' || this.mood === 'exhausted';
  }
  _slowFactor() { return this._isWeak() ? 1.8 : 1; } // weak moves slower, never frozen

  _resize() {
    let dpr = 1;
    try { dpr = Math.min(window.devicePixelRatio || 1, 2); } catch {}
    let w = 300, h = 225;
    try {
      const rect = this.canvas.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width || this.canvas.clientWidth || 300));
      h = Math.max(1, Math.round(rect.height || this.canvas.clientHeight || 225));
    } catch { }
    if (w !== this.w || h !== this.h || dpr !== this.dpr) {
      this.w = w; this.h = h; this.dpr = dpr;
      try {
        this.canvas.width = Math.round(w * dpr);
        this.canvas.height = Math.round(h * dpr);
      } catch {}
    }
    try { this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0); } catch {}
  }

  draw() {
    try {
      if (this.canvas.clientWidth && this.canvas.clientWidth !== this.w) this._resize();
    } catch {}
    const { ctx, w: W, h: H } = this;
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    if (W < 2 || H < 2) return;
    if (this.mood === 'gone') { this._drawAbsence(ctx, W, H); return; }

    const R = this.radius();
    const calm = this.reduced ? 0 : 1;
    const weak = this._isWeak();

    // breathing bob: slow + shallow when weak, deep + slow for breathe act
    const bobAmp = this.act === 'breathe' ? 0.045 : weak ? 0.016 : 0.028;
    const bob = Math.sin(this.breath) * R * bobAmp * (this.reduced ? 0.2 : 1);

    // hop lift (greet / eat joy / head pat) with anticipation already in crouch
    const hopLift = this.hop > 0 ? Math.sin(this.hop * Math.PI) * R * 0.35 * calm : 0;
    // droop ladder, readable at a glance: critical sinks hardest, ill sinks,
    // sleeping settles, tired only softens. Sleep = shut eyes + zzz, no
    // shiver; critical = half-mast eyes + shiver + flat mouth, never confused.
    const sleeping = this.mood === 'sleep' || this.act === 'sleep' || this.act === 'dream';
    const droopY = this.mood === 'critical' ? R * 0.2
      : weak ? R * 0.14
      : sleeping ? R * 0.12
      : this._isTired() ? R * 0.08 : 0;

    let cx = this.cx, cy = this.cy + bob - hopLift + droopY;

    // shiver: tiny fast x jitter, never gasp (mouth untouched), skipped in reduced motion
    let shx = 0;
    if (this._isShivery() && calm) {
      const amp = this.mood === 'critical' ? 2.2 : this.mood === 'scared' ? 1.6 : 1.2;
      shx = Math.sin(this.shiverPhase) * amp;
      if (this.act === 'shiver') shx *= 1.4;
    }

    this._drawHabitat(ctx, W, H, R);
    this._drawShadow(ctx, W, H, cx, cy, R, hopLift);

    const ang = this.speed > 24 ? Math.atan2(this.vy, this.vx) : 0;
    const along = this.speed > 24 ? this.stretch : this.stretch * 0.4;
    let sx = 1 + along, sy = 1 - along * 0.72;
    if (this.crouch > 0) { sx *= 1 + 0.18 * this.crouch; sy *= 1 - 0.24 * this.crouch; }
    const brBase = this.act === 'breathe' ? 0.035 : 0.014;
    const br = 1 + Math.sin(this.breath) * brBase * (this.reduced ? 0.3 : 1);
    sx *= br; sy *= (2 - br) / 1 + (br - 1) * 0.4; // keep volume-ish, gentle
    // weak droop: slightly wider + flatter, still upright
    if (weak) { sx *= 1.04; sy *= 0.96; }
    if (this.mood === 'critical') { sx *= 1.03; sy *= 0.95; } // heaviest, still upright
    if (sleeping) { sx *= 1.06; sy *= 0.93; }
    // spark tired curl: smaller + softer, warm — never the ill droop/shiver
    if (this._isTired()) { sx *= 0.94; sy *= 0.9; }

    ctx.save();
    ctx.translate(cx + shx, cy);

    // touch-zone lean / wiggle
    let extraTilt = this.tilt * 0.7;
    if (this.touch === 'head' && this.touchT > 0 && calm) {
      extraTilt += Math.sin(this.t * 22) * 0.12 * Math.min(1, this.touchT);
      ctx.translate(Math.sin(this.t * 22) * 3 * Math.min(1, this.touchT), Math.sin(this.t * 30) * -1.5);
    }
    if (this.touch === 'belly' && this.touchT > 0 && calm) {
      // grumpy-then-giggly: early shake, late bounce
      if (this.touchT > 0.9) ctx.translate(Math.sin(this.t * 30) * 2.2, 0);
      else ctx.translate(0, -Math.abs(Math.sin(this.t * 9)) * 5);
    }
    if (this.touch === 'back' && this.touchT > 0) {
      extraTilt += 0.22 * Math.min(1, this.touchT); // sleepy lean
    }
    // grief: held still, slight lean down
    if (this.act === 'grieve') extraTilt *= 0.3;
    ctx.rotate(extraTilt);
    if (this.mood === 'scared' && calm) ctx.translate((Math.random() - 0.5) * 1.6, 0);
    ctx.rotate(ang);
    ctx.scale(sx, sy);
    ctx.rotate(-ang);

    this._drawBody(ctx, R);
    this._drawFace(ctx, R);
    ctx.restore();

    // tender glow ring
    if ((this.mood === 'tender' || this.petGlow > 0.55) && calm) {
      ctx.strokeStyle = `hsla(${this.accent},80%,72%,${0.25 + this.petGlow * 0.3})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(cx + shx, cy, R * 1.22, R * 1.12, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    if ((this.mood === 'sleep' || this.act === 'sleep' || this.act === 'dream') && calm) this._drawZzz(ctx, cx + shx, cy, R);
    if (this._parts.length) this._drawParts(ctx);
    if (this.act === 'excursion' && calm) this._drawMotionPuffs(ctx, cx + shx, cy, R);
  }

  _bodyColor() {
    if (this.mood === 'critical') return '#e7e1cf';
    if (this.mood === 'unwell' || this.mood === 'sick') return '#e9e6d2';
    if (this.mood === 'tender') return '#fff0df';
    if (this.mood === 'sleep' || this.mood === 'sleepy') return '#f7ecd9';
    if (this.mood === 'spent' || this.mood === 'exhausted') return '#f3e8d5'; // tired-warm, not ill-grey
    if (this.mood === 'scared') return '#fdf3e3';
    if (this.mood === 'lonely') return '#f9ecdf';
    return '#fff5e2';
  }

  _drawShadow(ctx, W, H, cx, cy, R, hopLift) {
    // ground shadow follows the creature; softens + shrinks as it hops
    const gy = Math.min(H - R * 0.42, cy + R * 1.18);
    const hop = Math.max(0, Math.min(1, ((gy - cy) / (R * 1.6)) + (hopLift / (R * 2))));
    const sw = R * (1.04 - hop * 0.28);
    const alpha = 0.19 - hop * 0.07;
    ctx.fillStyle = 'rgba(96,66,38,' + Math.max(0.06, alpha).toFixed(3) + ')';
    ctx.beginPath();
    ctx.ellipse(cx, gy, sw, R * 0.17, 0, 0, Math.PI * 2);
    ctx.fill();
    // whisper of a second soft edge, no shadowBlur
    ctx.fillStyle = 'rgba(96,66,38,0.07)';
    ctx.beginPath();
    ctx.ellipse(cx, gy, sw * 1.28, R * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  _isNight() {
    try {
      return document.body.getAttribute('data-phase') === 'night'
        || document.body.classList.contains('night');
    } catch { return false; }
  }

  _drawHabitat(ctx, W, H, R) {
    // day-only whisper of home: warm ground wash, faint speckles, tiny tufts
    if (this._isNight()) return;
    if (W < 40 || H < 40) return;
    // warm ground wash along the bottom third
    ctx.fillStyle = 'rgba(255,214,150,0.14)';
    ctx.beginPath();
    ctx.ellipse(W * 0.5, H * 0.94, W * 0.46, H * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
    // seed speckles per stage size so they sit still
    const key = Math.round(W) + 'x' + Math.round(H);
    if (!this._habitat || this._habitat.key !== key) {
      const dots = [];
      let seed = (Math.round(W) * 13 + Math.round(H) * 7) % 1000;
      const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed % 1000) / 1000; };
      for (let i = 0; i < 16; i++) {
        dots.push({ x: 0.06 + rnd() * 0.88, y: 0.52 + rnd() * 0.4, r: 1 + rnd() * 2.2, a: 0.06 + rnd() * 0.08 });
      }
      const tufts = [];
      for (let i = 0; i < 4; i++) {
        tufts.push({ x: 0.1 + rnd() * 0.8, y: 0.62 + rnd() * 0.26, s: 0.7 + rnd() * 0.6 });
      }
      this._habitat = { key, dots, tufts };
    }
    for (const d of this._habitat.dots) {
      ctx.fillStyle = 'rgba(120,98,66,' + d.a.toFixed(3) + ')';
      ctx.beginPath();
      ctx.ellipse(d.x * W, d.y * H, d.r, d.r * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = 'rgba(130,138,88,0.28)';
    ctx.lineWidth = 1.4;
    ctx.lineCap = 'round';
    for (const tf of this._habitat.tufts) {
      const bx = tf.x * W, by = tf.y * H, s = tf.s * Math.max(4, R * 0.09);
      ctx.beginPath();
      ctx.moveTo(bx - s, by);
      ctx.quadraticCurveTo(bx - s * 0.7, by - s * 1.4, bx - s * 0.4, by - s * 1.7);
      ctx.moveTo(bx, by);
      ctx.quadraticCurveTo(bx, by - s * 1.5, bx + s * 0.1, by - s * 1.9);
      ctx.moveTo(bx + s, by);
      ctx.quadraticCurveTo(bx + s * 0.8, by - s * 1.3, bx + s * 0.9, by - s * 1.6);
      ctx.stroke();
    }
  }

  _drawBody(ctx, R) {
    ctx.fillStyle = this._bodyColor();
    ctx.beginPath();
    ctx.ellipse(0, 0, R * 1.1, R * 1.0, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.beginPath();
    ctx.ellipse(0, R * 0.42, R * 0.62, R * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = this._bodyColor();
    ctx.beginPath();
    ctx.ellipse(-R * 0.52, R * 0.88, R * 0.3, R * 0.2, -0.25, 0, Math.PI * 2);
    ctx.ellipse(R * 0.52, R * 0.88, R * 0.3, R * 0.2, 0.25, 0, Math.PI * 2);
    ctx.fill();

    // blush in accent hue, softer when weak
    const alpha = this._isWeak() ? 0.32 : 0.55;
    ctx.fillStyle = `hsla(${this.accent},72%,68%,${alpha})`;
    ctx.beginPath();
    ctx.ellipse(-R * 0.66, R * 0.18, R * 0.2, R * 0.13, -0.2, 0, Math.PI * 2);
    ctx.ellipse(R * 0.66, R * 0.18, R * 0.2, R * 0.13, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // excursion dust is drawn outside; keep body clean
  }

  _eyeOpenness() {
    if (this.blink > 0) return 0;
    if (this.touch === 'back') return 0.45; // sleepy lean
    switch (this.mood) {
      case 'sleep': return 0.05;
      case 'sleepy': return 0.38;
      case 'spent': return 0.45; // drowsy-soft, even lids — not the ill droop
      case 'exhausted': return 0.42;
      case 'sick': return 0.5;
      case 'unwell': return 0.45;
      case 'critical': return 0.3; // heavy half-mast, never shut fully while awake
      case 'tender': return 0.85; // soft, warm
      case 'lonely': return 0.72;
      case 'scared': return 1.12;
      case 'hungry': return 0.95;
      default: return 1;
    }
  }

  _happyClosed() {
    if (GLOW_BLOCK.has(this.mood)) return false;
    if (this.petGlow > 0.45) return true;
    if ((this.mood === 'happy' || this.mood === 'content' || this.mood === 'tender') && HAPPY_ACTS.has(this.act)) return true;
    // belly giggle peak: eyes squeezed happy
    if (this.touch === 'belly' && this.touchT < 0.9 && this.touchT > 0) return true;
    if (this.act === 'eat') return false; // eating watches the snack
    return false;
  }

  _drawFace(ctx, R) {
    const ex = R * 0.4, ey = -R * 0.14, er = R * 0.3;
    const open = this._eyeOpenness();

    if (this._happyClosed()) {
      ctx.strokeStyle = '#40362e';
      ctx.lineWidth = Math.max(2, R * 0.045);
      ctx.lineCap = 'round';
      for (const s of [-1, 1]) {
        ctx.beginPath();
        ctx.arc(s * ex, ey + er * 0.35, er * 0.62, Math.PI * 1.12, Math.PI * 1.88);
        ctx.stroke();
      }
      this._drawMouth(ctx, R, true);
      return;
    }

    let gx = 0, gy = 0;
    const gp = this.gaze || { x: this.cx, y: this.cy - R };
    const dx = gp.x - this.cx, dy = gp.y - this.cy;
    const dl = Math.hypot(dx, dy) || 1;
    const maxOff = er * 0.34;
    gx = (dx / dl) * Math.min(maxOff, dl * 0.03 + maxOff * 0.4);
    gy = (dy / dl) * Math.min(maxOff, dl * 0.03 + maxOff * 0.4);
    // grief looks down, sleep looks nowhere
    if (this.act === 'grieve') { gx *= 0.3; gy = Math.abs(gy) * 0.6 + er * 0.1; }
    if (this.mood === 'sleep') { gx = 0; gy = 0; }

    const wide = this.mood === 'scared' ? 1.14 : 1;
    for (const s of [-1, 1]) {
      const px = s * ex + gx, py = ey + gy;
      ctx.fillStyle = '#3d342e';
      ctx.beginPath();
      ctx.arc(px, py, er * wide, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.beginPath();
      ctx.arc(px - er * 0.32, py - er * 0.34, er * 0.28, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.beginPath();
      ctx.arc(px + er * 0.3, py + er * 0.28, er * 0.12, 0, Math.PI * 2);
      ctx.fill();

      const lid = Math.max(0, Math.min(1, 1 - open));
      if (lid > 0.02) {
        ctx.fillStyle = this._bodyColor();
        const droopL = (this.mood === 'lonely' || this._isWeak()) && s < 0 ? er * 0.14 : 0;
        const droopR = (this.mood === 'lonely' || this._isWeak()) && s > 0 ? er * 0.14 : 0;
        ctx.beginPath();
        ctx.ellipse(px, py - er - droopL + lid * er * 1.15, er * 1.06, er * (0.55 + lid * 0.75), 0, 0, Math.PI * 2);
        if (droopR) ctx.ellipse(px, py - er - droopR + lid * er * 1.15, er * 1.06, er * (0.55 + lid * 0.75), 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (this.mood === 'scared' || this.mood === 'lonely' || this._isWeak()) {
      ctx.strokeStyle = 'rgba(64,54,46,0.8)';
      ctx.lineWidth = Math.max(1.5, R * 0.03);
      ctx.lineCap = 'round';
      const tilt = this.mood === 'scared' ? 0.5 : 0.32;
      ctx.beginPath();
      ctx.moveTo(-ex - er * 0.7, ey - er * 1.25);
      ctx.lineTo(-ex + er * 0.4, ey - er * (1.25 - tilt));
      ctx.moveTo(ex + er * 0.7, ey - er * 1.25);
      ctx.lineTo(ex - er * 0.4, ey - er * (1.25 - tilt));
      ctx.stroke();
    }

    this._drawMouth(ctx, R, false);
  }

  _drawMouth(ctx, R, happy) {
    const my = R * 0.36;
    ctx.lineWidth = Math.max(1.5, R * 0.032);
    ctx.lineCap = 'round';
    const mw = R * 0.17;

    const mouthFor = () => {
      if (this.touch === 'belly' && this.touchT > 0.9) return 'grumpy'; // grumpy first…
      if (happy || this.mood === 'happy' || this.mood === 'content' || this.mood === 'tender') return 'smile';
      if (this.act === 'hum') return 'smile'; // hum is a soft happy sound
      switch (this.mood) {
        case 'hungry': return 'open';
        case 'sleep':
        case 'sleepy':
        case 'spent':
        case 'exhausted': return 'soft'; // tired-soft, never the ill flat line
        case 'lonely': return 'wobble';
        case 'scared': return 'o';
        case 'sick':
        case 'unwell':
        case 'critical': return 'flat'; // tired line, never gasp
        default: return 'smile';
      }
    };
    let kind = this.act === 'eat' ? 'open' : mouthFor();
    if (this.touch === 'belly' && this.touchT <= 0.9 && this.touchT > 0) kind = 'smile'; // …then giggly
    if (this.act === 'grieve') kind = 'soft';

    ctx.fillStyle = 'rgba(120,90,80,0.55)';
    ctx.beginPath();
    ctx.arc(0, my - R * 0.14, R * 0.028, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#4a3f36';

    if (kind === 'smile') {
      ctx.beginPath();
      ctx.arc(0, my - R * 0.05, mw, Math.PI * 0.2, Math.PI * 0.8);
      ctx.stroke();
    } else if (kind === 'open') {
      ctx.fillStyle = '#7a4a3d';
      ctx.beginPath();
      ctx.ellipse(0, my + R * 0.02, mw * 0.72, mw * 0.85, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (kind === 'o') {
      ctx.fillStyle = '#5a463c';
      ctx.beginPath();
      ctx.ellipse(0, my, mw * 0.42, mw * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (kind === 'flat' || kind === 'grumpy') {
      ctx.beginPath();
      if (kind === 'grumpy') {
        ctx.moveTo(-mw * 0.7, my + R * 0.03);
        ctx.lineTo(mw * 0.7, my - R * 0.02);
      } else {
        ctx.moveTo(-mw * 0.7, my);
        ctx.lineTo(mw * 0.7, my);
      }
      ctx.stroke();
    } else if (kind === 'wobble') {
      ctx.beginPath();
      ctx.arc(0, my + R * 0.14, mw * 0.9, Math.PI * 1.2, Math.PI * 1.8);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(-mw * 0.45, my);
      ctx.quadraticCurveTo(0, my + R * 0.03, mw * 0.45, my);
      ctx.stroke();
    }
  }

  _drawZzz(ctx, cx, cy, R) {
    const a = (Math.sin(this.breath * 0.9) + 1) / 2;
    ctx.fillStyle = 'rgba(109,99,87,0.75)';
    ctx.font = `${Math.round(R * 0.3)}px ui-rounded, system-ui, sans-serif`;
    ctx.fillText('z', cx + R * 1.05, cy - R * 0.7 - a * R * 0.25);
    ctx.fillStyle = 'rgba(109,99,87,0.45)';
    ctx.font = `${Math.round(R * 0.42)}px ui-rounded, system-ui, sans-serif`;
    ctx.fillText('z', cx + R * 1.3, cy - R * 1.05 - a * R * 0.35);
  }

  _drawParts(ctx) {
    for (const p of this._parts) {
      const k = Math.min(1, p.age / p.life);
      if (p.kind === 'ring') {
        const r = 6 + k * 26;
        ctx.strokeStyle = 'rgba(201,118,95,' + (0.8 * (1 - k)).toFixed(3) + ')';
        ctx.lineWidth = Math.max(1, 3 - k * 2);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.globalAlpha = 1 - k;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - k * 0.5), 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
  }

  _drawMotionPuffs(ctx, cx, cy, R) {
    // excursion trot puffs: two cheap fading dots behind
    const p = (Math.sin(this.t * 8) + 1) / 2;
    ctx.fillStyle = 'rgba(140,120,100,0.25)';
    ctx.beginPath();
    ctx.arc(cx - R * 0.9 - p * R * 0.3, cy + R * 0.7, R * (0.1 + p * 0.06), 0, Math.PI * 2);
    ctx.fill();
  }

  _drawAbsence(ctx, W, H) {
    const R = this.radius();
    const cx = this.havePos ? this.cx : W / 2;
    const cy = this.havePos ? this.cy : H * 0.56;
    ctx.strokeStyle = 'rgba(120,105,90,0.28)';
    ctx.lineWidth = 2;
    try { ctx.setLineDash([6, 8]); } catch {}
    ctx.beginPath();
    ctx.ellipse(cx, cy, R * 0.9, R * 0.8, 0, 0, Math.PI * 2);
    ctx.stroke();
    try { ctx.setLineDash([]); } catch {}
  }
}
