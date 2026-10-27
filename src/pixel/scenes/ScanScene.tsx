import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { appear, C } from "../../theme";
import { ROBOT, SHIRT, WALKER } from "../sprites";
import { pixelFont, snap, Sprite } from "../Sprite";
import { PixelTag, RpgBox, SlamTitle } from "../ui";

const GROUND = 820;
const ROBOT_X = 1460;
const ROBOT_Y = 300;
const shirtColors = ["#4CAF6E", "#E0605E", "#5AA9E6", "#F2C94C", "#B79CFF", "#4CAF6E", "#FF8FA3", "#4CAF6E", "#5AA9E6", "#4CAF6E"];

// 2：AIが写真を読みとる
// 動き（写真・カウンター）→ タグ → 説明文 の順に出し、同時に読む文字を増やさない
export const ScanScene: React.FC = () => {
  const frame = useCurrentFrame();
  const count =
    frame >= 60
      ? 1000000
      : Math.round(interpolate(frame, [10, 60], [0, 1000000], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) / 137) * 137;
  const bob = snap(Math.sin(frame * 0.06) * 6, 6);

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute" }} shapeRendering="crispEdges">
        <rect width={1920} height={1080} fill="#BFE3FF" />
        {Array.from({ length: 14 }).map((_, i) => {
          const w = 150 + random(`fw${i}`) * 90;
          const h = 220 + random(`fh${i}`) * 240;
          const raw = i * 170 - frame * 0.4;
          const x = snap((((raw % 2380) + 2380) % 2380) - 230, 6);
          return <rect key={i} x={x} y={GROUND - h} width={w} height={h} fill="#9CC3E6" />;
        })}
        {Array.from({ length: 8 }).map((_, i) => {
          const h = 240 + random(`nh${i}`) * 180;
          const raw = i * 300 - frame * 0.8;
          const x = snap((((raw % 2400) + 2400) % 2400) - 240, 6);
          return (
            <g key={i}>
              <rect x={x} y={GROUND - h} width={220} height={h} fill="#6E8FB8" />
              {Array.from({ length: Math.floor(h / 70) }).map((__, r) =>
                [0, 1, 2].map((c) => (
                  <rect
                    key={`${r}-${c}`}
                    x={x + 24 + c * 66}
                    y={GROUND - h + 24 + r * 70}
                    width={36}
                    height={36}
                    fill={(r + c + i) % 3 === 0 ? "#FFE27A" : "#A9C4E6"}
                  />
                )),
              )}
            </g>
          );
        })}
        <rect x={0} y={GROUND} width={1920} height={260} fill="#C9CED8" />

        {Array.from({ length: 7 }).map((_, i) => {
          const x = snap((((2200 - i * 300 - frame * 1.5) % 2300) + 2300) % 2300 - 150, 6);
          const step = Math.floor((frame + i * 3) / 12) % 2;
          return (
            <Sprite
              key={i}
              grid={WALKER[step]}
              x={x}
              y={GROUND - 108 - step * 6}
              px={9}
              palette={{ B: shirtColors[i], H: ["#3A2A20", "#6B4A8A", "#1B1B2F", "#A0522D"][i % 4], L: "#3E4560" }}
            />
          );
        })}

        {Array.from({ length: 6 }).map((_, k) => {
          const start = 8 + k * 8;
          const p = appear(frame, start, 30);
          if (p <= 0 || p >= 1) return null;
          const sx = 180 + ((k * 237) % 1000);
          const sy = 680;
          const x = snap(sx + (ROBOT_X - sx) * p, 6);
          const y = snap(sy + (ROBOT_Y + 100 - sy) * p - Math.sin(Math.PI * p) * 120, 6);
          const s = 1 - p * 0.6;
          return (
            <g key={k} transform={`translate(${x},${y}) scale(${s})`}>
              {p < 0.12 ? <rect x={-70} y={-70} width={140} height={140} fill={C.white} opacity={0.8} /> : null}
              <rect x={-54} y={-54} width={108} height={108} fill={C.white} />
              <rect x={-46} y={-46} width={92} height={92} fill="#EAF2FB" />
              <Sprite grid={SHIRT} x={-40} y={-36} px={8} palette={{ B: shirtColors[k], b: "#00000033" }} />
            </g>
          );
        })}

        <Sprite grid={ROBOT.scan} x={ROBOT_X - 96} y={ROBOT_Y - 40 + bob} px={12} />
      </svg>

      {/* カウンター（数字は60Fで止まり、以降は静止） */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 230,
          fontFamily: pixelFont,
          background: C.navy,
          color: C.white,
          border: "7px solid #FFFFFF",
          padding: "14px 34px",
          opacity: appear(frame, 6, 8),
        }}
      >
        <div style={{ fontSize: 52 }}>よみとった写真</div>
        <div style={{ fontSize: 96, color: C.gold, lineHeight: 1.1 }}>
          {count.toLocaleString()}
          <span style={{ fontSize: 56, color: C.white }}>{frame >= 60 ? "枚〜" : "枚"}</span>
        </div>
      </div>

      {/* 見分けるポイント */}
      <PixelTag label="えりの形" start={72} x={1040} y={500} color="#FFE27A" />
      <PixelTag label="丈" start={80} x={1600} y={500} color="#BDE3FF" />
      <PixelTag label="色" start={88} x={1140} y={600} color="#B8F0C8" />
      <PixelTag label="素材" start={96} x={1520} y={600} color="#FFC9D6" />

      <SlamTitle start={0}>AIが写真を読みとる</SlamTitle>
      <RpgBox text="服の特徴を、1枚ずつデータに" start={122} />
    </AbsoluteFill>
  );
};
