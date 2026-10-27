// ドット絵動画用のオリジナル・チップチューンBGM（秒数指定可・150BPM）を public/bgm-pixel.wav に書き出す
// 実行: node scripts/make-chiptune.mjs [秒数]
import { writeFileSync } from "node:fs";

const SR = 44100;
const BPM = 150;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;
const DURATION = Number(process.argv[2] ?? 24.5);
const N = Math.floor(SR * DURATION);

const midi = (m) => 440 * Math.pow(2, (m - 69) / 12);
const Am = { notes: [57, 60, 64], bass: 45 };
const F = { notes: [53, 57, 60], bass: 41 };
const C = { notes: [55, 60, 64], bass: 48 };
const G = { notes: [55, 59, 62], bass: 43 };
// Am-F-C-G を繰り返し、最後の1つ前を G、最後を C で終える
const BARS = Math.floor(DURATION / BAR);
const progression = Array.from({ length: BARS }, (_, i) => (i === BARS - 1 ? C : i === BARS - 2 ? G : [Am, F, C, G][i % 4]));
const LAST = progression.length - 1;

// 8分音符ごとのメロディ（和音の何番目の音か、-1=休符）
const melody = [
  [2, -1, 1, 2, 0, -1, 1, -1],
  [2, 1, 0, 1, 2, -1, 2, 1],
];

const square = (phase, duty) => ((phase % 1) < duty ? 1 : -1);
const triangle = (phase) => 4 * Math.abs((phase % 1) - 0.5) - 1;

let seed = 7;
const noise = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;

const L = new Float32Array(N);
const R = new Float32Array(N);
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const bar = Math.min(Math.floor(t / BAR), LAST);
  const tb = t - bar * BAR;
  const chord = progression[bar];
  const final = bar === LAST;

  const eighth = BEAT / 2;
  const e = Math.floor(tb / eighth);
  const te = tb - e * eighth;

  // メロディ（矩形波 50%）
  let lead = 0;
  if (!final || e < 1) {
    const idx = melody[bar % 2][e % 8];
    if (idx >= 0) {
      const f = midi(chord.notes[idx] + 12);
      lead = square(f * t, 0.5) * 0.07 * Math.exp(-te * 5) * (final ? Math.exp(-tb * 1.2) * 3 : 1);
    }
  } else {
    const f = midi(chord.notes[2] + 12);
    lead = square(f * t, 0.5) * 0.06 * Math.exp(-(tb - eighth) * 1.5);
  }

  // アルペジオ（矩形波 25%・16分音符）
  let arp = 0;
  if (!final) {
    const s16 = Math.floor(tb / (BEAT / 4));
    const f = midi(chord.notes[s16 % 3] + 24);
    arp = square(f * t, 0.25) * 0.03;
  }

  // ベース（三角波・オクターブ跳躍）
  const bf = midi(chord.bass - 12 + (e % 2 === 1 && !final ? 12 : 0));
  const bass = triangle(bf * t) * 0.22 * (final ? Math.exp(-tb * 1.2) : 1);

  // ドラム
  let drums = 0;
  if (!final) {
    const beat = Math.floor(tb / BEAT);
    const tbeat = tb - beat * BEAT;
    if (beat % 2 === 0) {
      const f = 40 + 120 * Math.exp(-tbeat * 40);
      drums += triangle(f * tbeat) * 0.35 * Math.exp(-tbeat * 14);
    } else {
      drums += noise() * 0.12 * Math.exp(-tbeat * 22);
    }
    if (te < 0.03) drums += noise() * 0.03;
  }

  L[i] = lead * 1.0 + arp * 0.6 + bass + drums;
  R[i] = lead * 0.7 + arp * 1.0 + bass + drums;
}

let peak = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const g = Math.min(1, t / 0.05) * Math.min(1, (DURATION - t) / 1.2);
  L[i] *= g;
  R[i] *= g;
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const norm = 0.7 / peak;

const buf = Buffer.alloc(44 + N * 4);
buf.write("RIFF", 0);
buf.writeUInt32LE(36 + N * 4, 4);
buf.write("WAVEfmt ", 8);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20);
buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28);
buf.writeUInt16LE(4, 32);
buf.writeUInt16LE(16, 34);
buf.write("data", 36);
buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * norm)) * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * norm)) * 32767), 46 + i * 4);
}
writeFileSync(new URL("../public/bgm-pixel.wav", import.meta.url), buf);
console.log(`public/bgm-pixel.wav (${DURATION}s) written`);
