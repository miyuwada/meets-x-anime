import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { appear, C } from "../../theme";
import { STAR } from "../sprites";
import { pixelFont, Sprite } from "../Sprite";
import { PixelBg, RpgBox, SlamTitle } from "../ui";

const MINI_CHART = ["K.......", "K.....GG", "K.....GG", "K..GG.GG", "K..GG.GG", "KGGGG.GG", "KGGGGGGG", "KKKKKKKK"];
const BALL = ["..KKKK..", ".KccWcK.", "KccWcccK", "KcccccAK", "KcccccAK", ".KcccAK.", "..KKKK..", ".KggggK."];

const Card: React.FC<{ x: number; start: number; label: string; children: React.ReactNode }> = ({ x, start, label, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - start, fps, config: { damping: 12, stiffness: 180 } });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 270,
        width: 460,
        height: 400,
        background: C.white,
        border: `8px solid ${C.navy}`,
        boxShadow: `12px 12px 0 ${C.navy}`,
        translate: `0px ${(1 - s) * 200}px`,
        opacity: frame >= start ? 1 : 0,
      }}
    >
      <svg width={460} height={260} style={{ position: "absolute" }} shapeRendering="crispEdges">
        {children}
      </svg>
      <div
        style={{
          position: "absolute",
          bottom: 28,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: pixelFont,
          fontSize: 58,
          color: C.navy,
        }}
      >
        {label}
      </div>
    </div>
  );
};

const Op: React.FC<{ x: number; start: number; children: string }> = ({ x, start, children }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 390,
        fontFamily: pixelFont,
        fontSize: 120,
        color: C.navy,
        opacity: appear(frame, start, 4),
      }}
    >
      {children}
    </div>
  );
};

// 4：過去 × 今 ＝ 半年先の予測
export const PredictScene: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = 0.4 + 0.6 * Math.abs(Math.sin(frame * 0.15));

  return (
    <AbsoluteFill>
      <PixelBg base="#EAF6EE" dot="#E1F1E6" />

      <Card x={90} start={6} label="過去の実績">
        <Sprite grid={MINI_CHART} x={150} y={50} px={20} palette={{ G: "#5AA9E6" }} />
      </Card>
      <Op x={590} start={18}>
        ×
      </Op>
      <Card x={730} start={24} label="今の兆し">
        <Sprite grid={STAR} x={160} y={55} px={20} />
      </Card>
      <Op x={1230} start={36}>
        ＝
      </Op>
      <Card x={1370} start={42} label="半年先の予測">
        <rect x={130} y={30} width={200} height={190} fill="#6FF0FF" opacity={0.3 * glow} />
        <Sprite grid={BALL} x={150} y={50} px={20} />
      </Card>

      <SlamTitle start={0}>半年先を予測する</SlamTitle>
      <RpgBox text="実績と兆しで、半年先を読む" start={64} />
    </AbsoluteFill>
  );
};
