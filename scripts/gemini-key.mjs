// Gemini APIキーを読む（値は表示しない）。meets-reel/.env を最優先。ダウンロードの gemini_api_key.env.txt を優先し、なければ insta_reel_rag/.env.local
import fs from "node:fs";
const FILES = [
  new URL("../.env", import.meta.url),
  "C:/Users/WadaMiyu/Downloads/gemini_api_key.env.txt",
  "C:/Users/WadaMiyu/Documents/insta_reel_rag/.env.local",
];
export const geminiKey = () => {
  for (const f of FILES) {
    if (!fs.existsSync(f)) continue;
    const m = fs.readFileSync(f, "utf8").match(/^\s*GEMINI_API_KEY\s*=\s*"?([^"\r\n]+)"?/m);
    if (m && m[1].trim()) return m[1].trim();
  }
  throw new Error("GEMINI_API_KEY not found");
};
