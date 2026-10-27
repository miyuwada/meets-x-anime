import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { appear, C, fontFamily, pop } from "../theme";

const defaultMessage = (
  <>
    AIで、<span style={{ color: C.blue }}>売れる人のコツ</span>をチーム全員に。
  </>
);

// quick=true：短いエンディング用。最初から静止した状態で表示し、QR をすぐ読めるようにする
// lead：パネル左の呼びかけ2行（例：経営者向けに言い換える）
export const OutroScene: React.FC<{ message?: React.ReactNode; font?: string; quick?: boolean; lead?: [string, string] }> = ({
  message = defaultMessage,
  font = fontFamily,
  quick = false,
  lead = ["同じようなお悩みを", "お持ちの方は"],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const panel = quick ? 1 : appear(frame, 18, 16);
  // 「こちらから ▶」の矢印を QR に向けて小さく揺らす
  const nudge = quick ? 0 : Math.max(0, Math.sin((frame - 30) * 0.25)) * 14;

  return (
    <AbsoluteFill style={{ background: C.white, fontFamily: font }}>
      <div
        style={{
          position: "absolute",
          top: 110,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 60,
          fontWeight: 700,
          color: C.navy,
          opacity: quick ? 1 : appear(frame, 3),
        }}
      >
        {message}
      </div>
      <Img
        src={staticFile("meets_logo_navy.png")}
        style={{
          position: "absolute",
          top: 230,
          left: 710,
          width: 500,
          scale: `${quick ? 1 : pop(frame, fps, 8)}`,
        }}
      />

      {/* お問い合わせ QR パネル */}
      <div
        style={{
          position: "absolute",
          top: 420,
          left: 260,
          width: 1400,
          height: 560,
          borderRadius: 40,
          background: C.bg,
          border: `5px solid ${C.gold}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 90px",
          boxSizing: "border-box",
          opacity: panel,
          translate: `0px ${(1 - panel) * 30}px`,
        }}
      >
        <div>
          <div style={{ fontSize: 48, fontWeight: 700, color: C.navy }}>{lead[0]}</div>
          <div style={{ fontSize: 48, fontWeight: 700, color: C.navy }}>{lead[1]}</div>
          <div
            style={{
              fontSize: 92,
              fontWeight: 900,
              color: C.blue,
              marginTop: 12,
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            こちらから
            <span style={{ color: C.gold, fontSize: 72, translate: `${nudge}px 0px` }}>▶</span>
          </div>
          <div style={{ fontSize: 38, fontWeight: 500, color: C.sub, marginTop: 28 }}>
            コラムの続きは meetsc.co.jp/blog
          </div>
        </div>
        <div
          style={{
            background: C.white,
            borderRadius: 24,
            padding: 18,
            boxShadow: "0 10px 30px rgba(23,39,77,0.18)",
            scale: `${quick ? 1 : pop(frame, fps, 26)}`,
          }}
        >
          <Img src={staticFile("qr.svg")} style={{ width: 400, height: 400, display: "block" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
