import { AbsoluteFill, useCurrentFrame } from "remotion";
import { appear, C } from "../../theme";
import { BOX, FACTORY, HEART } from "../sprites";
import { pixelFont, snap, Sprite } from "../Sprite";
import { PixelBg, SlamTitle } from "../ui";

const SHELF = 900;
const Step: React.FC<{ top: number; start: number; color: string; children: React.ReactNode }> = ({ top, start, color, children }) => {
  const frame = useCurrentFrame();
  const p = appear(frame, start, 10);
  return (
    <div
      style={{
        position: "absolute",
        left: 110,
        top,
        fontFamily: pixelFont,
        fontSize: 68,
        color,
        opacity: p,
        translate: `${(1 - p) * -40}px 0px`,
      }}
    >
      {children}
    </div>
  );
};

// 5：少なく作って、売れたら追加
export const BatchScene: React.FC = () => {
  const frame = useCurrentFrame();
  const leftover = 1 - 0.65 * appear(frame, 112, 26);

  return (
    <AbsoluteFill>
      <PixelBg base="#EAF6EE" dot="#E1F1E6" />
      <svg width={1920} height={1080} style={{ position: "absolute" }} shapeRendering="crispEdges">
        <Sprite grid={FACTORY} x={110} y={SHELF - 168} px={14} />
        <rect x={340} y={SHELF} width={720} height={16} fill="#8A9A8E" />
        {[0, 1, 2].map((i) => {
          const p = appear(frame, 26 + i * 5, 12);
          return <Sprite key={i} grid={BOX} x={snap(340 + (360 + i * 130) * p, 6)} y={SHELF - 96} px={12} opacity={p > 0 ? 1 : 0} />;
        })}
        {[0, 1, 2].map((i) => {
          const p = appear(frame, 86 + i * 4, 10);
          return <Sprite key={i} grid={BOX} x={snap(340 + (360 + i * 130) * p, 6)} y={SHELF - 192} px={12} opacity={p > 0 ? 1 : 0} />;
        })}
        {frame > 74
          ? [0, 1, 2].map((i) => (
              <Sprite key={i} grid={HEART} x={760 + i * 90} y={snap(620 - (frame - 74) * 3 - i * 20, 6)} px={10} opacity={Math.max(0, 1 - (frame - 74) / 36)} />
            ))
          : null}
      </svg>

      <Step top={270} start={20} color={C.navy}>
        ① まず少しだけ作る
      </Step>
      <Step top={380} start={76} color={C.red}>
        ② 売れたら追加！
      </Step>

      {/* 売れ残りゲージ */}
      <div style={{ position: "absolute", left: 1180, top: 560, fontFamily: pixelFont, opacity: appear(frame, 100, 8) }}>
        <div style={{ fontSize: 64, color: C.navy }}>売れ残り</div>
        <div style={{ width: 620, height: 90, border: `8px solid ${C.navy}`, background: C.white, marginTop: 12 }}>
          <div style={{ width: `${snap(leftover * 100, 5)}%`, height: "100%", background: C.red }} />
        </div>
        <div style={{ fontSize: 40, color: "#6B7A70", marginTop: 8 }}>※イメージ</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 1360,
          top: 430,
          fontFamily: pixelFont,
          fontSize: 100,
          color: C.red,
          opacity: appear(frame, 140, 4),
          rotate: "-8deg",
        }}
      >
        へった！
      </div>

      <SlamTitle start={0} size={96}>
        少なく作って、売れたら追加
      </SlamTitle>
    </AbsoluteFill>
  );
};
