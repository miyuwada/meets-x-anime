// 画像（PNG）の中のQRコードを読み取って、飛び先のURLを表示する
// 実行: node scripts/check-qr.mjs <画像.png>
import { readFileSync } from "node:fs";
import { PNG } from "pngjs";
import jsQR from "jsqr";

const png = PNG.sync.read(readFileSync(process.argv[2]));
const r = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
console.log(r ? `DECODED: ${r.data}` : "NOT DECODED");
