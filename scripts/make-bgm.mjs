// オリジナルBGM（秒数指定可・120BPM・C-G-Am-F）を合成して public/bgm.wav に書き出す
// 実行: node scripts/make-bgm.mjs [秒数] [出力ファイル名]
import { writeFileSync } from "node:fs";

const SR = 44100;
const BPM = 120;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;
const DURATION = Number(process.argv[2] ?? 23);
const OUT = process.argv[3] ?? "bgm.wav";
const N = Math.floor(SR * DURATION);

const midi = (m) => 440 * Math.pow(2, (m - 69) / 12);
const C = { notes: [60, 64, 67], bass: 36 };
const G = { notes: [59, 62, 67], bass: 43 };
const Am = { notes: [57, 60, 64], bass: 45 };
const F = { notes: [57, 60, 65], bass: 41 };
// C-G-Am-F を繰り返し、最後の1つ前を G、最後を C で終える
const BARS = Math.ceil(DURATION / BAR);
const progression = Array.from({ length: BARS }, (_, i) => (i === BARS - 1 ? C : i === BARS - 2 ? G : [C, G, Am, F][i % 4]));
const LAST = progression.length - 1;

const L = new Float32Array(N);
const R = new Float32Array(N);
const arpL = new Float32Array(N);
const arpR = new Float32Array(N);

// 再現性のある乱数（ハイハット用）
let seed = 1;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
let prevNoise = 0;

for (let i = 0; i < N; i++) {
  const t = i / SR;
  const bar = Math.min(Math.floor(t / BAR), LAST);
  const tb = t - bar * BAR;
  const chord = progression[bar];
  const final = bar === LAST;

  // パッド（やわらかい和音）
  const padEnv = Math.min(1, tb / 0.15) * (final ? 1 : Math.min(1, (BAR - tb) / 0.08));
  let pad = 0;
  for (const n of chord.notes) {
    const f = midi(n);
    pad += Math.sin(2 * Math.PI * f * t) + Math.sin(2 * Math.PI * f * 1.004 * t);
  }
  pad *= 0.028 * padEnv;

  // ベース（4分音符）
  const beatIdx = Math.floor(tb / BEAT);
  const tn = tb - beatIdx * BEAT;
  const bf = midi(chord.bass);
  const bassEnv = final ? Math.exp(-0.8 * tb) : Math.exp(-3 * tn);
  const bass = (Math.sin(2 * Math.PI * bf * t) + 0.3 * Math.sin(4 * Math.PI * bf * t)) * 0.2 * bassEnv;

  // アルペジオ（8分音符・三角波）
  let arp = 0;
  if (!final) {
    const e = BEAT / 2;
    const step = Math.floor(tb / e);
    const te = tb - step * e;
    const pattern = [0, 1, 2, 1, 0, 2, 1, 2];
    const note = chord.notes[pattern[step % 8]] + 12;
    const phase = (midi(note) * t) % 1;
    const tri = 4 * Math.abs(phase - 0.5) - 1;
    arp = tri * 0.09 * Math.exp(-7 * te);
  }

  // ドラム（1小節目の後から）
  let drums = 0;
  if (bar >= 1 && !final) {
    if (beatIdx % 2 === 0) {
      const f = 50 + 70 * Math.exp(-tn * 30);
      drums += Math.sin(2 * Math.PI * f * tn) * 0.32 * Math.exp(-tn * 18);
    }
    const te = (tb % BEAT) - BEAT / 2;
    if (te >= 0) {
      const noise = rnd();
      drums += (noise - prevNoise) * 0.035 * Math.exp(-te * 60);
      prevNoise = noise;
    }
  }

  const mix = pad + bass + drums;
  L[i] = mix;
  R[i] = mix;
  arpL[i] = arp;
  arpR[i] = arp;
}

// アルペジオにステレオディレイ
const dL = Math.floor(SR * BEAT * 0.75);
const dR = Math.floor(SR * BEAT * 0.5);
for (let i = 0; i < N; i++) {
  if (i >= dL) arpL[i] += arpL[i - dL] * 0.3;
  if (i >= dR) arpR[i] += arpR[i - dR] * 0.3;
  L[i] += arpL[i];
  R[i] += arpR[i];
}

// フェードイン／アウトと正規化
let peak = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const g = Math.min(1, t / 0.4) * Math.min(1, (DURATION - t) / 1.5);
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
writeFileSync(new URL(`../public/${OUT}`, import.meta.url), buf);
console.log(`public/${OUT} (${DURATION}s) written`);
