// Central sound engine for the whole app. Every sound here is synthesized
// with the Web Audio API at runtime (oscillators + gain envelopes) rather
// than loaded from audio files — no licensing concerns, zero asset weight,
// and it still gives us a real (if simple) piano-style game loop and a
// consistent set of UI blips.
//
// Browsers block audio before a user gesture, so the AudioContext is only
// created lazily, the first time any play* function actually runs.

const STORAGE_KEY = "veloop-sound-muted";

let ctx = null;
let musicGain = null;
let sfxGain = null;
let musicTimer = null;

function getMuted() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "1";
}

function ensureContext() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    ctx = new AudioCtx();
    musicGain = ctx.createGain();
    musicGain.gain.value = 0.16;
    musicGain.connect(ctx.destination);
    sfxGain = ctx.createGain();
    sfxGain.gain.value = 0.22;
    sfxGain.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

/** Plucked, piano-ish tone: fast attack, exponential decay, two stacked
 * oscillators (fundamental + a quiet octave) for a slightly richer timbre. */
function pluck(destination, freq, time, duration, peak) {
  const fundamental = ctx.createOscillator();
  const overtone = ctx.createOscillator();
  const gain = ctx.createGain();

  fundamental.type = "triangle";
  fundamental.frequency.value = freq;
  overtone.type = "sine";
  overtone.frequency.value = freq * 2;

  const overtoneGain = ctx.createGain();
  overtoneGain.gain.value = 0.25;
  overtone.connect(overtoneGain);
  overtoneGain.connect(gain);
  fundamental.connect(gain);
  gain.connect(destination);

  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(peak, time + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

  fundamental.start(time);
  overtone.start(time);
  fundamental.stop(time + duration + 0.02);
  overtone.stop(time + duration + 0.02);
}

function tone(destination, freq, time, duration, peak, type = "sine") {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(gain);
  gain.connect(destination);
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(peak, time + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
  osc.start(time);
  osc.stop(time + duration + 0.02);
}

// ---- one-shot UI / game sound effects ----

export function playClick() {
  if (getMuted() || !ensureContext()) return;
  tone(sfxGain, 720, ctx.currentTime, 0.06, 0.14, "square");
}

const CATCH_FREQS = { xp: 880, gem: 1046.5, coin: 660 };

export function playCatch(itemType) {
  if (getMuted() || !ensureContext()) return;
  const freq = CATCH_FREQS[itemType] || 780;
  const t = ctx.currentTime;
  tone(sfxGain, freq, t, 0.12, 0.18, "sine");
  tone(sfxGain, freq * 1.5, t + 0.03, 0.1, 0.1, "sine");
}

export function playMultiplier() {
  if (getMuted() || !ensureContext()) return;
  const t = ctx.currentTime;
  [660, 880, 1108.7].forEach((f, i) => tone(sfxGain, f, t + i * 0.05, 0.16, 0.16, "triangle"));
}

export function playLevelUp() {
  if (getMuted() || !ensureContext()) return;
  const t = ctx.currentTime;
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
    pluck(sfxGain, f, t + i * 0.11, 0.5, 0.22),
  );
}

export function playGameOver() {
  if (getMuted() || !ensureContext()) return;
  const t = ctx.currentTime;
  [523.25, 392.0].forEach((f, i) => tone(sfxGain, f, t + i * 0.12, 0.3, 0.16, "triangle"));
}

// ---- looping background piano melody, used only while the mini-game plays ----

const MELODY = [
  { note: 261.63, beat: 0 },
  { note: 329.63, beat: 0.5 },
  { note: 392.0, beat: 1 },
  { note: 523.25, beat: 1.5 },
  { note: 392.0, beat: 2 },
  { note: 329.63, beat: 2.5 },
  { note: 293.66, beat: 3 },
  { note: 392.0, beat: 3.5 },
];
const BEAT_SECONDS = 0.42;
const LOOP_SECONDS = 4 * BEAT_SECONDS;

function scheduleMelodyLoop(startTime) {
  MELODY.forEach(({ note, beat }) => {
    pluck(musicGain, note, startTime + beat * BEAT_SECONDS, BEAT_SECONDS * 0.9, 0.2);
    pluck(musicGain, note / 2, startTime + beat * BEAT_SECONDS, BEAT_SECONDS * 1.6, 0.09);
  });
}

export function startGameMusic() {
  if (getMuted() || !ensureContext() || musicTimer) return;
  let nextStart = ctx.currentTime + 0.05;
  scheduleMelodyLoop(nextStart);
  musicTimer = setInterval(() => {
    if (!ctx) return;
    nextStart += LOOP_SECONDS;
    scheduleMelodyLoop(nextStart);
  }, LOOP_SECONDS * 1000);
}

export function stopGameMusic() {
  if (musicTimer) {
    clearInterval(musicTimer);
    musicTimer = null;
  }
}

// ---- mute toggle, persisted across visits ----

export function isSoundMuted() {
  return getMuted();
}

export function setSoundMuted(muted) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, muted ? "1" : "0");
  if (muted) stopGameMusic();
}
