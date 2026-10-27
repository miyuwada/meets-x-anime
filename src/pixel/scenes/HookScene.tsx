import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C } from "../../theme";
import { BOX, GIRL } from "../sprites";
import { Sprite } from "../Sprite";
import { PixelBg, SlamTitle } from "../ui";

const BOX_W = 100;
const BOX_H = 80;
const FLOOR = 1010;

// 在庫の山（下から 6,5,4,3 個）
const boxes = [6, 5, 4, 3].flatMap((n, row) =>
  Array.from({ length: n }).map((_, i) => ({
    row,
    x: 960 - (n * BOX_W) / 2 + i * BOX_W,
    y: FLOOR - BOX_H * (row + 1),
  })),
);

// 0：つかみ「その新商品、売れ残りませんか？」
// 揺れ・跳ねはなし。文字は42F〜150Fの約3.6秒静止して読める
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const girlDrop = spring({ frame: frame - 26, fps, config: { damping: 30, stiffness: 120 } });
  const girlY = FLOOR - BOX_H * 4 - 220;

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0 }}>
        <PixelBg base="#17274D" dot="#1C2E5A" stars />
        <svg width={1920} height={1080} style={{ position: "absolute" }} shapeRendering="crispEdges">
          <rect x={0} y={FLOOR} width={1920} height={70} fill="#0E1833" />
          {boxes.map((b, i) => {
            const s = spring({ frame: frame - (2 + i), fps, config: { damping: 30, stiffness: 120 } });
            return <Sprite key={i} grid={BOX} x={b.x} y={-200 + (b.y + 200) * s} px={10} />;
          })}
          <Sprite grid={frame > 34 ? GIRL.worried : GIRL.normal} x={880} y={-400 + (girlY + 400) * girlDrop} px={10} />
          {frame > 36 ? (
            <g shapeRendering="crispEdges">
              <rect x={1050} y={girlY + 40 + ((frame - 36) % 20) * 2} width={14} height={20} fill="#6FC8FF" />
              <rect x={1054} y={girlY + 30 + ((frame - 36) % 20) * 2} width={6} height={10} fill="#6FC8FF" />
            </g>
          ) : null}
        </svg>
      </div>

      <SlamTitle start={34} top={70} size={100}>
        その新商品、
      </SlamTitle>
      <SlamTitle start={42} top={200} size={150} color={C.gold}>
        売れ残りませんか？
      </SlamTitle>
    </AbsoluteFill>
  );
};
