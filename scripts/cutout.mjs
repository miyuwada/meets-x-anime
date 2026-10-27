// キャラクター表（public/hrdx/sheet.jpg）から人物を切り抜き、背景を透明にした PNG を書き出す
// 実行: node scripts/cutout.mjs
import { readFileSync, writeFileSync } from "node:fs";
import jpeg from "jpeg-js";
import { PNG } from "pngjs";

const dir = new URL("../public/hrdx/", import.meta.url);
const src = jpeg.decode(readFileSync(new URL("sheet.jpg", dir)), { useTArray: true });

const crops = {
  woman_front: [95, 150, 395, 1090],
  woman_side: [470, 150, 725, 1090],
  man_front: [835, 95, 1205, 1090],
  man_side: [1240, 105, 1560, 1090],
  robot: [1655, 225, 1935, 580],
  robot_side: [1670, 665, 1935, 1012],
};

// 背景色（四隅の平均）
const px = (x, y) => {
  const i = (y * src.width + x) * 4;
  return [src.data[i], src.data[i + 1], src.data[i + 2]];
};
const corners = [px(5, 5), px(src.width - 6, 5), px(5, src.height - 6), px(src.width - 6, src.height - 6)];
const bg = [0, 1, 2].map((c) => corners.reduce((s, p) => s + p[c], 0) / 4);
const dist = (p) => Math.hypot(p[0] - bg[0], p[1] - bg[1], p[2] - bg[2]);

// 輝度の勾配（輪郭の強さ）を先に計算しておく
const lumAt = (x, y) => { const p = px(Math.min(src.width - 1, Math.max(0, x)), Math.min(src.height - 1, Math.max(0, y))); return 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2]; };
const grad = (x, y) => {
  const gx = lumAt(x + 1, y - 1) + 2 * lumAt(x + 1, y) + lumAt(x + 1, y + 1) - lumAt(x - 1, y - 1) - 2 * lumAt(x - 1, y) - lumAt(x - 1, y + 1);
  const gy = lumAt(x - 1, y + 1) + 2 * lumAt(x, y + 1) + lumAt(x + 1, y + 1) - lumAt(x - 1, y - 1) - 2 * lumAt(x, y - 1) - lumAt(x + 1, y - 1);
  return Math.hypot(gx, gy) / 4;
};
// 背景・床の影とみなす条件：背景色にとても近い、または「色みが少なく明るく、輪郭のないなだらかな所」
// （白いロボットや水色のブラウスは輪郭で止まるので消えない）
const floodable = (x, y, strict) => {
  const p = px(x, y);
  if (strict) return dist(p) < 12 && grad(x, y) < 4; // ロボット：白い本体を削らないよう厳しめ
  if (dist(p) < 14) return true;
  const sat = Math.max(...p) - Math.min(...p);
  const lum = 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2];
  return sat < 20 && lum > 150 && grad(x, y) < 6;
};

for (const [name, [x0, y0, x1, y1]] of Object.entries(crops)) {
  const w = x1 - x0, h = y1 - y0;
  const isBg = new Uint8Array(w * h);
  const queue = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const k = y * w + x;
    if (isBg[k]) return;
    if (!floodable(x0 + x, y0 + y, name.startsWith("robot"))) return;
    isBg[k] = 1;
    queue.push(k);
  };
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
  while (queue.length) {
    const k = queue.pop();
    const x = k % w, y = (k / w) | 0;
    push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1);
  }

  // 人物の下半身：足のあいだに閉じこめられた背景と床の影も消す（明るく色みのない所だけ）
  if (!name.startsWith("robot")) {
    for (let y = Math.floor(h * 0.6); y < h; y++) {
      for (let x = 0; x < w; x++) {
        const p = px(x0 + x, y0 + y);
        const sat = Math.max(...p) - Math.min(...p);
        const lum = 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2];
        if (dist(p) < 30 || (sat < 20 && lum > 150 && grad(x0 + x, y0 + y) < 14)) isBg[y * w + x] = 1;
      }
    }
  }

  const out = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const k = y * w + x;
      const [r, g, b] = px(x0 + x, y0 + y);
      const o = k * 4;
      out.data[o] = r; out.data[o + 1] = g; out.data[o + 2] = b;
      if (isBg[k]) { out.data[o + 3] = 0; continue; }
      // 背景に接する縁は少し透かして、切り抜きのギザギザを目立たなくする
      let edge = 0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < w && ny < h && isBg[ny * w + nx]) edge++;
      }
      out.data[o + 3] = edge ? 150 : 255;
    }
  }
  writeFileSync(new URL(`${name}.png`, dir), PNG.sync.write(out));
  console.log(`${name}.png ${w}x${h}`);
}
