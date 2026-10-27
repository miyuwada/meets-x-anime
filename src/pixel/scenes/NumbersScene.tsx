import { AbsoluteFill, useCurrentFrame } from "remotion";
import { appear, C } from "../../theme";
import { GIRL } from "../sprites";
import { pixelFont, snap, Sprite } from "../Sprite";
import { PixelBg, SlamTitle } from "../ui";

const bars = [
  { color: "#9AA0B8", h: 140 },
  { color: "#FF8FA3", h: 180 },
  { color: "#5AA9E6", h: 160 },
  { color: "#F2C94C", h: 130 },
  { color: "#4CAF6E", h: 170, boost: 80 },
];

const Panel: React.FC<{ x: number; label: string; labelColor: string; children: React.ReactNode; opacity: number; dx: number }> = ({
  x,
  label,
  labelColor,
  children,
  opacity,
  dx,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: 270,
      width: 790,
      height: 600,
      background: "#FFFFFF",
      border: `8px solid ${C.navy}`,
      boxShadow: `12px 12px 0 #0E1833`,
      opacity,
      translate: `${dx}px 0px`,
    }}
  >
    <div
      style={{
        position: "absolute",
        top: -44,
        left: 24,
        fontFamily: pixelFont,
        fontSize: 56,
        background: labelColor,
        color: C.navy,
        border: `6px solid ${C.navy}`,
        padding: "0 22px",
      }}
    >
      {label}
    </div>
    {children}
  </div>
);

// 3：感覚を、数字に（BEFORE を約2秒読ませてから AFTER を出す）
export const NumbersScene: React.FC = () => {
  const frame = useCurrentFrame();
  const left = appear(frame, 6, 14);
  const right = appear(frame, 72, 14);
  const boost = appear(frame, 104, 18);
  const pct = Math.round(15 * boost);

  return (
    <AbsoluteFill>
      <PixelBg base="#1F2F5C" dot="#22346A" stars />

      <Panel x={90} label="BEFORE" labelColor="#C9CED8" opacity={left} dx={(1 - left) * -120}>
        <svg width={790} height={600} style={{ position: "absolute" }} shapeRendering="crispEdges">
          <Sprite grid={GIRL.worried} x={50} y={230} px={13} />
        </svg>
        <div
          style={{
            position: "absolute",
            left: 290,
            top: 150,
            fontFamily: pixelFont,
            fontSize: 72,
            lineHeight: 1.35,
            color: "#5B6478",
          }}
        >
          緑の服、
          <br />
          増えてる…
          <br />
          気がする？
        </div>
      </Panel>

      <div
        style={{
          position: "absolute",
          left: 892,
          top: 520,
          fontFamily: pixelFont,
          fontSize: 100,
          color: C.gold,
          opacity: appear(frame, 64, 6),
        }}
      >
        ▶
      </div>

      <Panel x={1040} label="AFTER" labelColor="#B8F0C8" opacity={right} dx={(1 - right) * 120}>
        <svg width={790} height={600} style={{ position: "absolute" }} shapeRendering="crispEdges">
          <rect x={60} y={420} width={670} height={8} fill={C.navy} />
          {bars.map((b, i) => {
            const grow = appear(frame, 78 + i * 4, 16);
            const h = snap(b.h * grow + (b.boost ?? 0) * boost, 12);
            return <rect key={i} x={90 + i * 130} y={420 - h} width={90} height={h} fill={b.color} />;
          })}
        </svg>
        <div
          style={{
            position: "absolute",
            left: 300,
            top: 50,
            fontFamily: pixelFont,
            fontSize: 90,
            color: "#2E8B57",
            opacity: boost > 0 ? 1 : 0,
          }}
        >
          +{pct}%
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 455,
            textAlign: "center",
            fontFamily: pixelFont,
            fontSize: 64,
            color: C.navy,
            opacity: appear(frame, 124, 8),
          }}
        >
          緑色が15%増<span style={{ fontSize: 44, color: "#7A7F94" }}>（例）</span>
        </div>
      </Panel>

      <SlamTitle start={0}>感覚を、数字に</SlamTitle>
    </AbsoluteFill>
  );
};
