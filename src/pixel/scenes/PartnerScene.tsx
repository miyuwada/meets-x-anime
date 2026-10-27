import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { appear, C } from "../../theme";
import { GIRL, HEART, ROBOT } from "../sprites";
import { pixelFont, snap, Sprite } from "../Sprite";
import { PixelBg, SlamTitle } from "../ui";

const greens = ["#2E7D4F", "#4CAF6E", "#9ED9A8"];
const CURSOR = ["K.....", "KK....", "KWK...", "KWWK..", "KWWWK.", "KWWWWK", "KWWKKK", "KKWK..", "...KK."];

// 6：決めるのは人。AIは相棒
export const PartnerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const picked = frame >= 54;
  const jump = (delay: number) => {
    const t = frame - 62 - delay;
    if (t < 0) return 0;
    return -snap(Math.abs(Math.sin(t * 0.18)) * 24 * Math.max(0, 1 - t / 36), 6);
  };
  const cx = interpolate(frame, [28, 50], [560, 950], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cy = interpolate(frame, [28, 50], [600, 500], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const chosen = spring({ frame: frame - 54, fps, config: { damping: 30, stiffness: 160 } });

  return (
    <AbsoluteFill>
      <PixelBg base="#FFF0F4" dot="#FCE6EC" />
      <svg width={1920} height={1080} style={{ position: "absolute" }} shapeRendering="crispEdges">
        <rect x={0} y={880} width={1920} height={200} fill="#F3D3DC" />
        <Sprite grid={picked ? GIRL.happy : GIRL.normal} x={180} y={528 + jump(0)} px={16} />
        <Sprite grid={ROBOT.happy} x={1500} y={592 + jump(4)} px={16} flip />

        {greens.map((g, i) => {
          const p = spring({ frame: frame - (10 + i * 5), fps, config: { damping: 30, stiffness: 160 } });
          const isPick = i === 1;
          const s = isPick && picked ? 1 + 0.2 * chosen : picked ? 0.85 : 1;
          return (
            <g key={g} transform={`translate(${740 + i * 220},${480}) scale(${p * s})`}>
              <rect x={-90} y={-90} width={180} height={180} fill={C.navy} />
              <rect x={-78} y={-78} width={156} height={156} fill={g} opacity={picked && !isPick ? 0.45 : 1} />
            </g>
          );
        })}
        {frame >= 24 && frame < 58 ? <Sprite grid={CURSOR} x={snap(cx, 6)} y={snap(cy, 6)} px={12} /> : null}
        {frame > 64
          ? [0, 1, 2, 3].map((i) => (
              <Sprite
                key={i}
                grid={HEART}
                x={[260, 380, 1520, 1640][i]}
                y={snap(500 - (frame - 64 - i * 3) * 3, 6)}
                px={10}
                opacity={frame - 64 - i * 3 > 0 ? Math.max(0, 1 - (frame - 64) / 45) : 0}
              />
            ))
          : null}
      </svg>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 270,
          textAlign: "center",
          fontFamily: pixelFont,
          fontSize: 56,
          color: C.navy,
          opacity: appear(frame, 6, 8),
        }}
      >
        AIの提案
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 640,
          textAlign: "center",
          fontFamily: pixelFont,
          fontSize: 76,
          color: "#2E7D4F",
          opacity: appear(frame, 60, 8),
        }}
      >
        自社らしい緑に決定！
      </div>

      <SlamTitle start={0}>決めるのは人。AIは相棒</SlamTitle>
    </AbsoluteFill>
  );
};
