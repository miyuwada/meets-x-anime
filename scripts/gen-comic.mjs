// アメコミ風の絵を Gemini API で作る： node scripts/gen-comic.mjs <番号> [参照画像...]
import fs from "node:fs";
import { geminiKey } from "./gemini-key.mjs";

const MODEL = "gemini-3-pro-image";
const STYLE = `Modern American superhero comic book art. Bold thick black ink outlines, dramatic cel shading,
Ben-Day halftone dots in the backgrounds, saturated primary colors (red, yellow, cyan, navy), radiating speed lines,
dynamic low camera angles. Single full-bleed panel, 16:9. Absolutely NO text, NO letters, NO words, NO speech bubbles,
NO sound-effect lettering, NO logos anywhere in the image (leave clean empty space for lettering to be added later).
Original characters only. Do NOT draw any empty caption boxes, blank rectangles, banners or frames; the empty space must be part of the scene (sky, wall, light rays).`;

const CAST = `Characters (keep them consistent):
- NEW HIRE: a young Japanese woman in her early 20s, short black bob hair, navy business suit, white blouse, ID lanyard, expressive big eyes.
- AI AGENT HERO: a friendly sleek humanoid robot superhero, glossy white and teal armor with gold accents, a glowing cyan visor face with a kind smile, a short cape, a small glowing chat-bubble emblem on the chest.
- HR MANAGER: a Japanese man in his 40s, glasses, short hair, light grey suit, kind face.`;

// 各場面に出てよい登場人物（ほかの2人は描かない）
const WHO = { 1: "NEW HIRE only (plus generic background trainees). The AI AGENT HERO and the HR MANAGER must NOT appear.", 2: "NEW HIRE only (plus generic busy coworkers in background). The AI AGENT HERO and the HR MANAGER must NOT appear.", 3: "NEW HIRE and AI AGENT HERO only. The HR MANAGER must NOT appear.", 4: "NEW HIRE, AI AGENT HERO and HR MANAGER." };

const SCENES = {
  1: `A bright corporate training room. A row of new employees at desks; a huge identical thick binder manual slams down onto every desk at once
with impact lines. In the foreground the NEW HIRE stares at her enormous binder with a stunned, overwhelmed face, sweat drop. Bored faces behind her. Leave empty sky/wall space in the upper-left third.`,
  2: `Late evening office, dark blue tones. The NEW HIRE sits alone at her desk, head in her hands, lots of floating question-mark shapes drawn as abstract glowing symbols around her (no letters).
In the background, busy senior coworkers rushing past and on phones, unaware of her. Feeling of isolation; dramatic shadows. Leave empty space at the top-right.`,
  3: `Heroic entrance! The AI AGENT HERO bursts out of the NEW HIRE's laptop screen in a blast of cyan light and digital particles, cape flowing, one hand reaching out to offer help,
the other pointing at a floating holographic panel of learning cards and skill icons arranged in a personalized path. The NEW HIRE leans back amazed, eyes sparkling. Explosive radial speed lines, starburst. Leave empty space at the top-left.`,
  4: `Triumphant finale. The NEW HIRE, now confident, strides forward toward the viewer in a dynamic pose with a determined smile, holding a tablet; the AI AGENT HERO flies beside her giving a thumbs up;
behind them the HR MANAGER smiles and gives a thumbs up too, with a bright modern office and a sunrise burst of yellow and red rays. Celebration, confetti stars. Leave empty space at the top-center.`,
};

const n = Number(process.argv[2]);
const refs = process.argv.slice(3);
const parts = [{ text: `${STYLE}\n\n${CAST}\n\nCharacters in this panel: ${WHO[n]}

Scene: ${SCENES[n]}${refs.length ? "\n\nMatch the character designs and art style of the attached reference image exactly (use it only as a design reference; do not copy its composition, and only draw the characters listed for this panel)." : ""}` }];
for (const r of refs) parts.push({ inlineData: { mimeType: r.endsWith(".png") ? "image/png" : "image/jpeg", data: fs.readFileSync(r).toString("base64") } });

const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
  method: "POST",
  headers: { "x-goog-api-key": geminiKey(), "content-type": "application/json" },
  body: JSON.stringify({
    contents: [{ parts }],
    generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: "16:9", imageSize: "2K" } },
  }),
});
const j = await res.json();
if (!res.ok) { console.log(res.status, JSON.stringify(j).slice(0, 400)); process.exit(1); }
const img = j.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
if (!img) { console.log("no image", JSON.stringify(j).slice(0, 400)); process.exit(1); }
fs.mkdirSync("public/comic", { recursive: true });
const out = `public/comic/0${n}.${img.inlineData.mimeType.includes("png") ? "png" : "jpg"}`;
fs.writeFileSync(out, Buffer.from(img.inlineData.data, "base64"));
console.log("saved", out);
