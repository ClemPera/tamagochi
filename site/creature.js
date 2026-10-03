/* CreatureView — a small virtual friend, drawn fresh every frame.
 *
 * Design notes (from virtual_attachment.md 1-3):
 * - Animacy comes from motion timing, not art: squash + stretch along the
 *   travel axis, tilt into turns, hop anticipation.
 * - Goal legibility: the engine moves it; this view keeps the body axis
 *   aligned with travel so detours read as wants, not glitches.
 * - Baby schema as a slider: wide face, big glossy eyes, tiny nose + mouth.
 *   Supernormal exaggeration is welcome, so the eyes are oversized.
 *
 * Zero dependencies, no external assets, DPR-aware, cheap fills only
 * (no shadowBlur). Respects prefers-reduced-motion.
 */

const MOODS = new Set([
  'content', 'happy', 'hungry', 'sleepy', 'lonely', 'scared', 'sick', 'sleep', 'gone',
]);
const ACTS = new Set([
  'idle', 'wander', 'seek', 'eat', 'play', 'sleep', 'soothe', 'greet', 'grieve',
]);
const HAPPY_ACTS = new Set(['play', 'soothe', 'greet']);

export class CreatureView {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.mood = 'content';
    this.act = 'idle';
    this.accent = 14; // warm terracotta hue

    this.t = Math.random() * 10;
    this.cx = 0; this.cy = 0; // smoothed render position (css px)
    this.px = 0; this.py = 0; // previous target, for turn detection
    this.havePos = false;
    this.vx = 0; this.vy = 0;
    this.speed = 0;
    this.stretch = 0;
    this.tilt = 0;
    this.crouch = 0; // hop anticipation, 0..1
    this.lastSpeed = 0;
    this.breath = 0;
    this.gaze = null; // {x,y} css px relative to canvas
    this.petGlow = 0; // recent petting warmth, 0..1
    this.blinkIn = 2 + Math.random() * 2;
    this.blink = 0; // seconds remaining of lid closure
    this.w = 0; this.h = 0; this.dpr = 1;

    this.reduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this._resize();
    if (typeof ResizeObserver !== 'undefined') {
      this._ro = new ResizeObserver(() => this._resize());
      this._ro.observe(canvas);
    }
    window.addEventListener('resize', () => this._resize());
  }

  setMood(m) {
    if (MOODS.has(m)) this.mood = m;
  }

  setAct(a) {
    if (ACTS.has(a)) this.act = a;
  }

  setAccent(h) {
    h = Number(h);
    if (Number.isFinite(h)) this.accent = ((h % 360) + 360) % 360;
  }

  // Gaze point in css px relative to the canvas (engine converts for us).
  lookAt(x, y) {
    if (Number.isFinite(x) && Number.isFinite(y)) this.gaze = { x, y };
  }

  // pos {x,y}: css px relative to canvas, or 0..1 normalized. vel {x,y}: px/s.
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
    if (!this.havePos) {
      this.cx = tx; this.cy = ty; this.px = tx; this.py = ty;
      this.havePos = true;
    }
    const k = 1 - Math.exp(-dt * 9);
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

    // Squash + stretch along travel, eased.
    const target = Math.min(this.speed / 620, 0.26);
    this.stretch += (target - this.stretch) * (1 - Math.exp(-dt * 8));

    // Hop anticipation: sudden surge crouches first, then releases.
    const accel = (this.speed - this.lastSpeed) / Math.max(dt, 1e-3);
    this.lastSpeed = this.speed;
    if (accel > 2600 && this.crouch <= 0.05) this.crouch = 1;
    this.crouch = Math.max(0, this.crouch - dt * 5.5);

    // Tilt into turns from lateral velocity.
    const tiltTarget = Math.max(-0.3, Math.min(0.3, this.vx / 950));
    this.tilt += (tiltTarget - this.tilt) * (1 - Math.exp(-dt * 6));

    this.breath += dt * (this.mood === 'sleep' || this.act === 'sleep' ? 1.1 : 2.1);

    // Blink every 2-5 s; sleepy moods blink slower and lazier.
    this.blinkIn -= dt;
    if (this.blink > 0) this.blink -= dt;
    else if (this.blinkIn <= 0) {
      this.blink = 0.13;
      this.blinkIn = 2 + Math.random() * 3;
      if (this.mood === 'sleepy' || this.mood === 'sleep') this.blinkIn += 1.5;
    }

    // Petting reads as gaze resting on the creature while it is slow.
    if (this.gaze) {
      const d = Math.hypot(this.gaze.x - this.cx, this.gaze.y - this.cy);
      const R = this.radius();
      if (d < R * 1.4 && this.speed < 60) this.petGlow = Math.min(1, this.petGlow + dt * 3);
      else this.petGlow = Math.max(0, this.petGlow - dt * 1.2);
    } else {
      this.petGlow = Math.max(0, this.petGlow - dt * 1.2);
    }
  }

  radius() {
    return Math.max(26, Math.min(this.w, this.h) * 0.17);
  }

  _resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width || this.canvas.clientWidth || 300));
    const h = Math.max(1, Math.round(rect.height || this.canvas.clientHeight || 225));
    if (w !== this.w || h !== this.h || dpr !== this.dpr) {
      this.w = w; this.h = h; this.dpr = dpr;
      this.canvas.width = Math.round(w * dpr);
      this.canvas.height = Math.round(h * dpr);
    }
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  draw() {
    if (this.canvas.clientWidth && (this.canvas.clientWidth !== this.w)) this._resize();
    const { ctx, w: W, h: H } = this;
    ctx.clearRect(0, 0, W, H);
    if (W < 2 || H < 2) return;

    if (this.mood === 'gone') { this._drawAbsence(ctx, W, H); return; }

    const R = this.radius();
    const calm = this.reduced ? 0 : 1;
    const bob = Math.sin(this.breath) * R * 0.028 * calm;
    const cx = this.cx, cy = this.cy + bob;

    this._drawShadow(ctx, W, H, cx, cy, R);

    // Build squash + stretch along the velocity axis.
    const ang = this.speed > 24 ? Math.atan2(this.vy, this.vx) : 0;
    const along = this.speed > 24 ? this.stretch : this.stretch * 0.4;
    let sx = 1 + along, sy = 1 - along * 0.72;
    if (this.crouch > 0) { // anticipation crouch
      sx *= 1 + 0.18 * this.crouch;
      sy *= 1 - 0.24 * this.crouch;
    }
    const br = 1 + Math.sin(this.breath) * 0.014 * calm;
    sx *= br; sy *= br;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.tilt * 0.7);
    if (this.mood === 'scared') ctx.translate((Math.random() - 0.5) * 1.6 * calm, 0);
    ctx.rotate(ang);
    ctx.scale(sx, sy);
    ctx.rotate(-ang);
    this._drawBody(ctx, R);
    this._drawFace(ctx, R);
    ctx.restore();

    if ((this.mood === 'sleep' || this.act === 'sleep') && calm) this._drawZzz(ctx, cx, cy, R);
  }

  _bodyColor() {
    if (this.mood === 'sick') return '#e9e6d2'; // pale, washed-out tint
    if (this.mood === 'sleep' || this.mood === 'sleepy') return '#f7ecd9';
    if (this.mood === 'scared') return '#fdf3e3';
    return '#fff5e2'; // warm cream
  }

  _drawShadow(ctx, W, H, cx, cy, R) {
    const gy = Math.min(H - R * 0.42, cy + R * 1.18);
    const hop = Math.max(0, Math.min(1, (gy - cy) / (R * 1.6)));
    const sw = R * (1.02 - hop * 0.25);
    ctx.fillStyle = 'rgba(74,52,32,0.16)';
    ctx.beginPath();
    ctx.ellipse(cx, gy, sw, R * 0.17, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  _drawBody(ctx, R) {
    // Wide round body (baby-schema: broad face, high forehead).
    ctx.fillStyle = this._bodyColor();
    ctx.beginPath();
    ctx.ellipse(0, 0, R * 1.1, R * 1.0, 0, 0, Math.PI * 2);
    ctx.fill();

    // Soft belly patch, slightly lighter.
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.beginPath();
    ctx.ellipse(0, R * 0.42, R * 0.62, R * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Little feet nubs.
    ctx.fillStyle = this._bodyColor();
    ctx.beginPath();
    ctx.ellipse(-R * 0.52, R * 0.88, R * 0.3, R * 0.2, -0.25, 0, Math.PI * 2);
    ctx.ellipse(R * 0.52, R * 0.88, R * 0.3, R * 0.2, 0.25, 0, Math.PI * 2);
    ctx.fill();

    // Blush in the accent hue.
    const ac = `hsla(${this.accent},72%,68%,0.55)`;
    ctx.fillStyle = ac;
    ctx.beginPath();
    ctx.ellipse(-R * 0.66, R * 0.18, R * 0.2, R * 0.13, -0.2, 0, Math.PI * 2);
    ctx.ellipse(R * 0.66, R * 0.18, R * 0.2, R * 0.13, 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  _eyeOpenness() {
    if (this.blink > 0) return 0;
    switch (this.mood) {
      case 'sleep': return 0.05;
      case 'sleepy': return 0.38;
      case 'sick': return 0.5;
      case 'lonely': return 0.72; // sad droop
      case 'scared': return 1.12; // wide
      default: return 1;
    }
  }

  _happyClosed() {
    if (this.petGlow > 0.45) return true;
    if ((this.mood === 'happy' || this.mood === 'content') && HAPPY_ACTS.has(this.act)) return true;
    return false;
  }

  _drawFace(ctx, R) {
    const ex = R * 0.4, ey = -R * 0.14, er = R * 0.3;
    const open = this._eyeOpenness();

    if (this._happyClosed()) {
      // Joyful closed eyes: two upward curves.
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

    // Gaze offset toward the look point, clamped small.
    let gx = 0, gy = 0;
    const gp = this.gaze || { x: this.cx, y: this.cy - R };
    const dx = gp.x - this.cx, dy = gp.y - this.cy;
    const dl = Math.hypot(dx, dy) || 1;
    const maxOff = er * 0.34;
    gx = (dx / dl) * Math.min(maxOff, dl * 0.03 + maxOff * 0.4);
    gy = (dy / dl) * Math.min(maxOff, dl * 0.03 + maxOff * 0.4);

    const wide = this.mood === 'scared' ? 1.14 : 1;
    for (const s of [-1, 1]) {
      const px = s * ex + gx, py = ey + gy;
      // Eye ball, supernormal large and glossy.
      ctx.fillStyle = '#3d342e';
      ctx.beginPath();
      ctx.arc(px, py, er * wide, 0, Math.PI * 2);
      ctx.fill();
      // Gloss: one bright dot + one tiny sparkle.
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.beginPath();
      ctx.arc(px - er * 0.32, py - er * 0.34, er * 0.28, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.beginPath();
      ctx.arc(px + er * 0.3, py + er * 0.28, er * 0.12, 0, Math.PI * 2);
      ctx.fill();

      // Lid: cream shutter from the top. Lonely gets an extra droop tilt.
      const lid = Math.max(0, Math.min(1, 1 - open));
      if (lid > 0.02) {
        ctx.fillStyle = this._bodyColor();
        const droop = this.mood === 'lonely' && s < 0 ? er * 0.12 : 0;
        const droopR = this.mood === 'lonely' && s > 0 ? er * 0.12 : 0;
        ctx.beginPath();
        ctx.ellipse(px, py - er - droop + lid * er * 1.15, er * 1.06, er * (0.55 + lid * 0.75), 0, 0, Math.PI * 2);
        if (droopR) { ctx.ellipse(px, py - er - droopR + lid * er * 1.15, er * 1.06, er * (0.55 + lid * 0.75), 0, 0, Math.PI * 2); }
        ctx.fill();
      }
    }

    // Worried brows for scared / lonely.
    if (this.mood === 'scared' || this.mood === 'lonely' || this.mood === 'sick') {
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
    ctx.strokeStyle = '#4a3f36';
    ctx.fillStyle = '#4a3f36';
    ctx.lineWidth = Math.max(1.5, R * 0.032);
    ctx.lineCap = 'round';
    const mw = R * 0.17;

    const mouthFor = () => {
      if (happy || this.mood === 'happy' || this.mood === 'content') return 'smile';
      switch (this.mood) {
        case 'hungry': return 'open';
        case 'sleep':
        case 'sleepy': return 'soft';
        case 'lonely': return 'wobble';
        case 'scared': return 'o';
        case 'sick': return 'flat';
        default: return 'smile';
      }
    };
    const kind = this.act === 'eat' ? 'open' : mouthFor();
    // Tiny nose dot above the mouth (small nose per baby schema).
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
    } else if (kind === 'flat') {
      ctx.beginPath();
      ctx.moveTo(-mw * 0.7, my);
      ctx.lineTo(mw * 0.7, my);
      ctx.stroke();
    } else if (kind === 'wobble') {
      ctx.beginPath();
      ctx.arc(0, my + R * 0.14, mw * 0.9, Math.PI * 1.2, Math.PI * 1.8);
      ctx.stroke();
    } else { // soft: tiny resting line
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

  _drawAbsence(ctx, W, H) {
    // Gone: no creature, just a faint remembered ring where it used to be.
    const R = this.radius();
    const cx = this.havePos ? this.cx : W / 2;
    const cy = this.havePos ? this.cy : H * 0.56;
    ctx.strokeStyle = 'rgba(120,105,90,0.28)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 8]);
    ctx.beginPath();
    ctx.ellipse(cx, cy, R * 0.9, R * 0.8, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}
