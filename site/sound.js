/* Tiny WebAudio chimes — pentatonic blips, no assets.
 * Never throws: silent no-op when AudioContext is unavailable. */

let muted = false;
let ctx = null;

export function setMuted(b) { muted = !!b; }

function ac() {
  if (muted) return null;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctx) ctx = new AC();
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  } catch { return null; }
}

// C major pentatonic-ish ladder, soft and warm
const N = { C4: 261.63, D4: 293.66, E4: 329.63, G4: 392.0, A4: 440.0, C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99 };

const SEQS = {
  eat:   [[N.E4, 0, 0.12], [N.G4, 0.1, 0.14]],
  happy: [[N.C4, 0, 0.12], [N.E4, 0.09, 0.12], [N.G4, 0.18, 0.2]],
  sleep: [[N.G4, 0, 0.22], [N.E4, 0.2, 0.22], [N.D4, 0.4, 0.3]],
  sick:  [[N.E4, 0, 0.25], [N.D4, 0.24, 0.3]],
  hatch: [[N.C4, 0, 0.1], [N.D4, 0.08, 0.1], [N.E4, 0.16, 0.1], [N.G4, 0.24, 0.14], [N.A4, 0.34, 0.22]],
  sad:   [[N.E4, 0, 0.2], [N.D4, 0.18, 0.2], [N.C4, 0.36, 0.32]],
  tap:   [[N.G4, 0, 0.09]],
  gift:  [[N.G4, 0, 0.12], [N.A4, 0.1, 0.12], [N.C5, 0.2, 0.24]],
};

export function chime(kind) {
  try {
    const c = ac();
    const seq = SEQS[kind] || SEQS.tap;
    if (!c) return;
    const t0 = c.currentTime + 0.01;
    for (const [freq, off, dur] of seq) {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = kind === 'sleep' || kind === 'sick' || kind === 'sad' ? 'sine' : 'triangle';
      o.frequency.value = freq;
      const peak = kind === 'sleep' || kind === 'sick' ? 0.08 : 0.12;
      g.gain.setValueAtTime(0.0001, t0 + off);
      g.gain.exponentialRampToValueAtTime(peak, t0 + off + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + off + dur);
      o.connect(g).connect(c.destination);
      o.start(t0 + off);
      o.stop(t0 + off + dur + 0.05);
    }
  } catch { /* cozy silence */ }
}
