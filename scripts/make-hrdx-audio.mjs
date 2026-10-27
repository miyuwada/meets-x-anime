// HRDX動画用のオリジナル音楽（場面ごとに曲調が変わる・約26.5秒）と効果音を合成して public/hrdx/audio/ に書き出す
// 実行: node scripts/make-hrdx-audio.mjs
import { mkdirSync, writeFileSync } from "node:fs";

const SR = 44100;
const OUT = new URL("../public/hrdx/audio/", import.meta.url);
mkdirSync(OUT, { recursive: true });

const midi = (m) => 440 * Math.pow(2, (m - 69) / 12);
const TAU = Math.PI * 2;
let seed = 11;
const noise = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;

function writeWav(name, L, R = L, peakTo = 0.8) {
  const N = L.length;
  let peak = 1e-9;
  for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
  const k = peakTo / peak;
  const buf = Buffer.alloc(44 + N * 4);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write("WAVEfmt ", 8);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(N * 4, 40);
  for (let i = 0; i < N; i++) {
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * k)) * 32767), 44 + i * 4);
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * k)) * 32767), 46 + i * 4);
  }
  writeFileSync(new URL(name, OUT), buf);
  console.log(`hrdx/audio/${name} (${(N / SR).toFixed(2)}s)`);
}

// 鍵盤のような音（倍音つき・減衰）
const keyTone = (f, t) => (Math.sin(TAU * f * t) + 0.35 * Math.sin(TAU * 2 * f * t) + 0.12 * Math.sin(TAU * 3 * f * t)) * Math.exp(-t * 2.6);
// ベルの音
const bell = (f, t) => (Math.sin(TAU * f * t) + 0.5 * Math.sin(TAU * 2.76 * f * t) + 0.25 * Math.sin(TAU * 5.4 * f * t)) * Math.exp(-t * 3.2);

// ---------- 音楽 ----------
// cuts: b=テクノロジー調の始まり, c=温かい調の始まり, d=締めの始まり, dur=全体の長さ（秒）
const Am = [57, 60, 64], F = [53, 57, 60], Cc = [55, 60, 64], G = [55, 59, 62];
const bass = { Am: 45, F: 41, C: 48, G: 43 };

function makeScore(file, { b, c, d, dur }) {
  const chords = [[0, "Am", Am], [b / 2, "F", F]];
  const cycB = [["Am", Am], ["F", F], ["C", Cc], ["G", G]];
  for (let t = b, k = 0; t < c - 0.01; t += 2, k++) chords.push([t, ...cycB[k % 4]]);
  const cycC = [["C", Cc], ["G", G], ["Am", Am], ["F", F]];
  for (let t = c, k = 0; t < d - 0.01; t += 2, k++) chords.push([t, ...cycC[k % 4]]);
  chords.push([d, "G", G], [d + 1.5, "C", Cc]);
  const N = Math.floor(dur * SR);
  const L = new Float32Array(N), R = new Float32Array(N);
  const section = (t) => (t < b ? "A" : t < c ? "B" : t < d ? "C" : "D");
  const chordAt = (t) => { let ch = chords[0]; for (const x of chords) if (t >= x[0]) ch = x; return ch; };

  // パッド（やわらかい和音）とベース
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    const [t0, name, notes] = chordAt(t);
    const nextT = chords.find((x) => x[0] > t)?.[0] ?? dur;
    const env = Math.min(1, (t - t0) / 0.6) * Math.min(1, (nextT - t) / 0.3 + (nextT === dur ? 1 : 0));
    const sec = section(t);
    const padVol = { A: 0.05, B: 0.04, C: 0.06, D: 0.06 }[sec];
    let pad = 0;
    for (const n of notes) {
      const f = midi(n + (sec === "C" || sec === "D" ? 12 : 0));
      pad += Math.sin(TAU * f * t) + Math.sin(TAU * f * 1.004 * t);
    }
    const bf = midi(bass[name]);
    const bassV = (sec === "A" ? 0.05 : 0.09) * (Math.sin(TAU * bf * t) + 0.3 * Math.sin(TAU * 2 * bf * t));
    const v = pad * padVol * env + bassV * env;
    L[i] += v; R[i] += v;
  }
  const addNote = (start, f, len, vol, pan, fn) => {
    const s0 = Math.floor(start * SR), n = Math.floor(len * SR);
    for (let k = 0; k < n && s0 + k < N; k++) {
      const v = fn(f, k / SR) * vol;
      L[s0 + k] += v * (1 - pan); R[s0 + k] += v * (1 + pan);
    }
  };
  // 静か：ゆっくりした短調の鍵盤
  for (let t = 0.2, j = 0; t < b; t += 0.8, j++) addNote(t, midi(chordAt(t)[2][[0, 1, 2, 1][j % 4]] + 12), 2.2, 0.16, -0.2, keyTone);
  // テクノロジー：16分のつま弾き＋軽いリズム（120BPM）
  for (let t = b, j = 0; t < c; t += 0.125, j++)
    addNote(t, midi(chordAt(t)[2][j % 3] + 24), 0.2, 0.05, 0.3, (f, x) => (4 * Math.abs(((f * x) % 1) - 0.5) - 1) * Math.exp(-x * 18));
  for (let t = b; t < c; t += 0.5) {
    addNote(t, 0, 0.25, 0.22, 0, (_, x) => Math.sin(TAU * (45 + 80 * Math.exp(-x * 30)) * x) * Math.exp(-x * 16));
    addNote(t + 0.25, 0, 0.06, 0.05, 0.2, (_, x) => noise() * Math.exp(-x * 70));
  }
  // 温かい：鍵盤とベル、ゆったりしたリズム
  for (let t = c, j = 0; t < d; t += 0.5, j++) {
    const notes = chordAt(t)[2];
    addNote(t, midi(notes[[0, 2, 1, 2][j % 4]] + 12), 1.4, 0.13, -0.15, keyTone);
    if (j % 2 === 0) addNote(t, midi(notes[2] + 24), 1.2, 0.05, 0.35, bell);
    if (j % 4 === 0) addNote(t, 0, 0.3, 0.14, 0, (_, x) => Math.sin(TAU * (45 + 70 * Math.exp(-x * 30)) * x) * Math.exp(-x * 12));
  }
  // 締め：最後の和音をそっと鳴らす
  for (const [k, n] of [48, 55, 60, 64, 67].entries()) addNote(d + 1.5 + k * 0.06, midi(n + 12), 3.4, 0.12, -0.2 + k * 0.1, keyTone);
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    const g = Math.min(1, t / 0.8) * Math.min(1, (dur - t) / 1.6);
    L[i] *= g; R[i] *= g;
  }
  writeWav(file, L, R, 0.75);
}

makeScore("score.wav", { b: 6.5, c: 14, d: 21.5, dur: 26.5 }); // 最初の版
makeScore("score-v2.wav", { b: 11, c: 18.5, d: 24, dur: 27.5 }); // 絵コンテ版（つかみ＋共感 → AI → 解決 → 無料相談）
makeScore("score-warehouse.wav", { b: 10.5, c: 16, d: 22.5, dur: 26 }); // 倉庫の歩行ロス（ピクトグラム版）
makeScore("score-comic.wav", { b: 10, c: 16, d: 21.5, dur: 25 }); // LXP×AIエージェント（アメコミ版）

// ---------- 効果音 ----------
const make = (len, fn) => {
  const n = Math.floor(len * SR);
  const a = new Float32Array(n);
  for (let i = 0; i < n; i++) a[i] = fn(i / SR, len);
  return a;
};

// キーボードを打つ音（ランダムな間隔のクリック）
{
  const len = 2.6, a = new Float32Array(Math.floor(len * SR));
  let t = 0.05;
  while (t < len - 0.1) {
    const s0 = Math.floor(t * SR);
    let prev = 0;
    for (let k = 0; k < SR * 0.03 && s0 + k < a.length; k++) {
      const nz = noise();
      a[s0 + k] += (nz - prev) * Math.exp(-(k / SR) * 160) * (0.6 + 0.4 * Math.random());
      prev = nz;
    }
    t += 0.09 + Math.random() * 0.13;
  }
  writeWav("typing.wav", a, a, 0.5);
}
// シュッ（テロップ）
{
  let lp = 0;
  const a = make(0.7, (t, len) => {
    const p = t / len;
    const c = 0.02 + 0.25 * Math.sin(Math.PI * p);
    lp += c * (noise() - lp);
    return lp * Math.sin(Math.PI * p);
  });
  writeWav("whoosh.wav", a, a, 0.5);
}
// ロボットの電子音（ピピッ）
writeWav("bleep.wav", make(0.4, (t) => {
  const f = t < 0.15 ? 1100 + t * 2000 : 1500;
  const env = t < 0.15 ? Math.exp(-((t % 0.15) * 14)) : t > 0.2 ? Math.exp(-(t - 0.2) * 14) : 0;
  return Math.sin(TAU * f * t) * env;
}), undefined, 0.5);
// 光がのびる音
writeWav("beam.wav", make(1.2, (t, len) => Math.sin(TAU * (300 * t + 250 * t * t)) * Math.sin(Math.PI * (t / len)) * 0.8 + noise() * 0.04 * Math.sin(Math.PI * (t / len))), undefined, 0.45);
// グラフが上がる音
writeWav("rise.wav", make(2.3, (t, len) => Math.sin(TAU * (420 * t + 90 * t * t)) * Math.min(1, t / 0.2) * Math.min(1, (len - t) / 0.4) * 0.6), undefined, 0.35);
// ポン（項目が出る）
writeWav("pop.wav", make(0.18, (t) => Math.sin(TAU * (900 - 1800 * t) * t) * Math.exp(-t * 28)), undefined, 0.5);
// 通知音（注意ラインを越えた）
writeWav("alert.wav", make(0.9, (t) => bell(1320, t) * 0.6 + (t > 0.14 ? bell(1760, t - 0.14) * 0.6 : 0)), undefined, 0.55);
// 温かいチャイム
writeWav("chime.wav", make(1.8, (t) => [0, 0.12, 0.24].reduce((s, d, k) => s + (t > d ? bell(midi([72, 76, 79][k]), t - d) : 0), 0)), undefined, 0.5);
// 足音（約5秒・ゆっくりした歩幅）
writeWav("steps.wav", make(5.2, (t) => { const k = t % 0.42; return (Math.sin(TAU * (90 - 120 * k) * k) * 0.9 + noise() * 0.25) * Math.exp(-k * 38); }), undefined, 0.45);
// 封筒を机に置く音
writeWav("paper.wav", make(0.35, (t) => noise() * Math.exp(-t * 22) * 0.6 + Math.sin(TAU * (120 - 200 * t) * t) * Math.exp(-t * 30) * 0.8), undefined, 0.5);
// 完了音（締め）
writeWav("success.wav", make(2.0, (t) => [0, 0.1, 0.2, 0.32].reduce((s, d, k) => s + (t > d ? bell(midi([72, 76, 79, 84][k]), t - d) : 0), 0)), undefined, 0.55);
// アメコミ用：ドスン（重い着地）／シャキーン（金属の光）／ドーン（爆発）
writeWav("impact.wav", make(0.9, (t) => Math.sin(TAU * (70 - 40 * t) * t) * Math.exp(-t * 7) + noise() * Math.exp(-t * 18) * 0.5), undefined, 0.6);
writeWav("shing.wav", make(1.1, (t) => (Math.sin(TAU * 2637 * t) * 0.5 + Math.sin(TAU * 3520 * t) * 0.35 + Math.sin(TAU * 5274 * t) * 0.2) * Math.exp(-t * 4) * Math.min(1, t / 0.01) + noise() * Math.exp(-t * 30) * 0.4), undefined, 0.45);
writeWav("boom.wav", make(1.6, (t) => Math.sin(TAU * (55 - 25 * t) * t) * Math.exp(-t * 3) + noise() * Math.exp(-t * 5) * 0.45 * Math.min(1, t / 0.005)), undefined, 0.6);
