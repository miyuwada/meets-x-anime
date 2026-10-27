// hrdx-comic.src.html にロゴ・QR・フォント用の文字一覧を埋め込み、hrdx-comic.html を作る
// 実行: node web/build.mjs
import { readFileSync, writeFileSync } from "node:fs";

const dir = new URL("./", import.meta.url);
const src = readFileSync(new URL("hrdx-comic.src.html", dir), "utf8");
const { qr, logo } = JSON.parse(readFileSync(new URL("assets.json", dir), "utf8"));

// ページで使う文字だけを Google Fonts から読み込む（日本語フォントの欠けを防ぐ）
const chars = [...new Set(Array.from(src.replace(/__\w+__/g, "")))].filter((c) => c.trim()).join("");
const out = src
  .replaceAll("__JPTEXT__", encodeURIComponent(chars))
  .replace("__QR__", JSON.stringify(qr))
  .replace("__LOGO__", logo);

writeFileSync(new URL("hrdx-comic.html", dir), out);
console.log(`hrdx-comic.html written (${out.length} chars, ${chars.length} glyphs)`);
