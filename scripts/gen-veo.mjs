// コマ絵を Gemini Omni Flash で動かす（Veo は2026/10/22に終了）： node scripts/gen-veo.mjs <番号>
// 入力 public/comic/0N.jpg → 出力 public/comic/0N.mp4（音は使わない。BGMと効果音は Remotion 側）
import fs from "node:fs";
import { geminiKey } from "./gemini-key.mjs";

const KEEP = `Animate this exact American comic book illustration. Keep the art style, line art, colors, halftone dots and character designs exactly the same.
Natural, smooth, gentle character motion (breathing, blinking, small gestures). Static camera, no zoom, no cuts. No text, no letters, no speech bubbles.
About 8 seconds long. Silent (no music, no voices).`;
const MOTION = {
  1: "The heavy binder has just landed on the desk: small puffs of dust drift away. The young woman flinches, blinks twice and leans back a little in surprise, her hand raised. Trainees in the background shift slightly and look bored.",
  2: "The young woman slowly rubs her head with both hands and lets out a sigh, eyes lowering. The glowing question marks around her gently pulse and float. In the background, coworkers hurry past talking on their phones.",
  3: "The friendly robot hero rises out of the laptop's glow, cape flowing softly, and gestures toward the holographic learning panel, which lights up card by card. Digital particles drift. The young woman's eyes widen and she breaks into a delighted smile.",
  4: "The confident young woman walks forward toward the viewer with a bright smile, holding the glowing tablet. The robot hero flies beside her and gives a thumbs up; the manager in the back smiles and nods with a thumbs up. Confetti and stars gently fall.",
};

const n = Number(process.argv[2]);
const key = geminiKey();
const img = fs.readFileSync(`public/comic/0${n}.jpg`).toString("base64");
const res = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
  method: "POST",
  headers: { "x-goog-api-key": key, "content-type": "application/json" },
  body: JSON.stringify({
    model: "gemini-omni-1.1-flash",
    input: [
      { type: "image", data: img, mime_type: "image/jpeg" },
      { type: "text", text: `${KEEP}\n\n${MOTION[n]}` },
    ],
    response_format: { type: "video", aspect_ratio: "16:9", resolution: "1080p" },
    generation_config: { video_config: { task: "image_to_video" } },
  }),
});
const j = await res.json();
if (!res.ok) {
  console.log(res.status, JSON.stringify(j).slice(0, 400));
  process.exit(1);
}
const v = j.steps?.flatMap((s) => s.content ?? []).find((c) => c.type === "video");
if (!v) {
  console.log("no video", j.status, JSON.stringify(j).slice(0, 400));
  process.exit(1);
}
fs.writeFileSync(`public/comic/0${n}.mp4`, Buffer.from(v.data, "base64"));
console.log("saved", `public/comic/0${n}.mp4`);
