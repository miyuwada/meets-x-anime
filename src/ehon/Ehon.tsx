import type React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/ZenMaruGothic";

// コラム「デジタル行動履歴から解析するリード熱量の可視化」を絵本風4枚にまとめる
// 絵は Gemini で生成（public/ehon/01〜04.jpg・2000x1116）。吹き出しと本文の文字はここで入れる
const { fontFamily } = loadFont("normal", { weights: ["700", "900"] });

export const EHON_W = 2000;
export const EHON_H = 1116 + 220; // 絵の下に本文の帯

const INK = "#4A3B32";
const TEAL = "#2E8B84";

type Bubble = { x: number; y: number; w: number; h: number; lines: string[]; size: number };
type Page = { img: string; bubbles: Bubble[]; text: React.ReactNode; cta?: boolean };

// 吹き出しの位置（x,y＝吹き出しの中心、w,h＝文字を置ける幅と高さ）は各画像で測った値
export const PAGES: Page[] = [
  {
    img: "ehon/01.jpg",
    bubbles: [
      { x: 775, y: 268, w: 200, h: 120, lines: ["リスト順に", "電話しても…"], size: 34 },
      { x: 1465, y: 543, w: 190, h: 110, lines: ["「まだ検討前」", "ばかり…"], size: 30 },
    ],
    text: <>リストの順に電話しても、<span style={{ color: TEAL }}>空振りばかり</span>。</>,
  },
  {
    img: "ehon/02.jpg",
    bubbles: [
      { x: 1585, y: 148, w: 220, h: 130, lines: ["どのページを", "じっくり見た？"], size: 34 },
      { x: 1412, y: 688, w: 210, h: 115, lines: ["本気度が", "見えてきた！"], size: 38 },
    ],
    text: <>AIが、Webでの行動から<span style={{ color: TEAL }}>“熱量”</span>を読み取ります。</>,
  },
  {
    img: "ehon/03.jpg",
    bubbles: [
      { x: 195, y: 195, w: 260, h: 130, lines: ["今が", "チャンス！"], size: 46 },
      { x: 1292, y: 565, w: 260, h: 140, lines: ["ちょうど相談", "したかったんです"], size: 31 },
    ],
    text: <>熱が上がった<span style={{ color: TEAL }}>“今”</span>、すぐに連絡。</>,
  },
  {
    img: "ehon/04.jpg",
    bubbles: [{ x: 1578, y: 305, w: 240, h: 170, lines: ["熱い順に", "“助け舟”の", "電話を！"], size: 40 }],
    text: <>リストをこなす営業から、<span style={{ color: TEAL }}>熱量で動く営業へ</span>。</>,
    cta: true,
  },
];

const BubbleText: React.FC<{ b: Bubble }> = ({ b }) => (
  <div
    style={{
      position: "absolute",
      left: b.x - b.w / 2,
      top: b.y - b.h / 2,
      width: b.w,
      height: b.h,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily,
      fontWeight: 900,
      fontSize: b.size,
      lineHeight: 1.3,
      color: INK,
      textAlign: "center",
      whiteSpace: "nowrap",
    }}
  >
    {b.lines.map((l) => (
      <div key={l}>{l}</div>
    ))}
  </div>
);

export const EhonPage: React.FC<{ page: number }> = ({ page }) => {
  const p = PAGES[page - 1];
  return (
    <AbsoluteFill style={{ background: "#FBF5EA" }}>
      <Img src={staticFile(p.img)} style={{ position: "absolute", left: 0, top: 0, width: EHON_W, height: 1116 }} />
      {p.bubbles.map((b) => (
        <BubbleText key={b.lines.join()} b={b} />
      ))}
      {/* 本文の帯 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 1116,
          width: EHON_W,
          height: 220,
          background: "#FBF5EA",
          borderTop: "4px solid #E8DCC6",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 90px",
          boxSizing: "border-box",
          gap: 18,
        }}
      >
        <div style={{ fontFamily, fontWeight: 900, fontSize: p.cta ? 52 : 60, color: INK, textAlign: "center" }}>{p.text}</div>
        {p.cta ? (
          <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
            <div style={{ fontFamily, fontWeight: 900, fontSize: 36, color: "#FFFFFF", background: TEAL, borderRadius: 999, padding: "10px 34px" }}>
              まずは無料相談から
            </div>
            <Img src={staticFile("meets_logo_navy.png")} style={{ width: 240 }} />
          </div>
        ) : null}
        {/* ページ番号（右下に小さく） */}
        <div style={{ position: "absolute", right: 36, bottom: 22, fontFamily, fontWeight: 700, fontSize: 20, color: "#C8B49A" }}>{page}/4</div>
      </div>
    </AbsoluteFill>
  );
};
