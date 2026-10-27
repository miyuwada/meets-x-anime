import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { appear, C, fontFamily } from "../theme";

export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: C.navy, fontFamily }}>
      {/* 右側の音声波形（装飾） */}
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {Array.from({ length: 34 }).map((_, i) => {
          const h =
            30 + 170 * Math.abs(Math.sin(i * 0.55 + frame * 0.12)) * Math.sin((i / 33) * Math.PI);
          return (
            <rect
              key={i}
              x={1340 + i * 15}
              y={540 - h / 2}
              width={9}
              height={h}
              rx={4.5}
              fill={i % 5 === 2 ? C.gold : C.sky}
              opacity={0.55 * appear(frame, 6 + i * 0.5, 10)}
            />
          );
        })}
      </svg>

      <div style={{ position: "absolute", left: 160, top: 270 }}>
        <div
          style={{
            color: C.gold,
            fontSize: 38,
            fontWeight: 700,
            letterSpacing: 6,
            opacity: appear(frame, 3),
          }}
        >
          Meets Consulting コラム
        </div>
        <div
          style={{
            color: C.white,
            fontSize: 72,
            fontWeight: 700,
            marginTop: 36,
            opacity: appear(frame, 8),
            translate: `${(1 - appear(frame, 8)) * -40}px 0px`,
          }}
        >
          AIでわかった
        </div>
        <div
          style={{
            color: C.white,
            fontSize: 112,
            fontWeight: 900,
            lineHeight: 1.25,
            opacity: appear(frame, 14),
            translate: `${(1 - appear(frame, 14)) * -40}px 0px`,
          }}
        >
          売れる営業の
          <br />
          <span style={{ color: C.gold }}>話し方のコツ</span>
        </div>
        <div
          style={{
            height: 8,
            borderRadius: 4,
            marginTop: 30,
            background: C.gold,
            width: 640 * appear(frame, 24, 18),
          }}
        />
      </div>

      <Img
        src={staticFile("meets_logo_white.png")}
        style={{
          position: "absolute",
          right: 96,
          bottom: 72,
          width: 285,
          opacity: appear(frame, 26),
        }}
      />
    </AbsoluteFill>
  );
};
