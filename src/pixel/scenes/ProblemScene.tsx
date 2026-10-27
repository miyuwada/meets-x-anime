import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C } from "../../theme";
import { DICE, GIRL } from "../sprites";
import { pixelFont, Sprite } from "../Sprite";
import { PixelBg, RpgBox, SlamTitle } from "../ui";

// 1：勘で決めていない？（文字は 見出し9字＋スタンプ4字＋説明14字 のみ）
export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bubble = spring({ frame: frame - 12, fps, config: { damping: 30, stiffness: 160 } });
  const stamp = spring({ frame: frame - 54, fps, config: { damping: 30, stiffness: 160 } });
  const diceRoll = frame < 44;
  const diceStep = Math.floor(frame / 8);

  return (
    <AbsoluteFill>
      <PixelBg base="#F4EBD9" dot="#EFE3CC" />
      <svg width={1920} height={1080} style={{ position: "absolute" }} shapeRendering="crispEdges">
        <rect x={0} y={820} width={1920} height={260} fill="#D9C7A7" />
        <rect x={0} y={820} width={1920} height={8} fill="#B8A27E" />
        <Sprite grid={frame > 54 ? GIRL.worried : GIRL.normal} x={260} y={490} px={15} />

        {/* 考えごとの吹き出し：サイコロと「？」だけ（文章なし） */}
        <g transform={`translate(860,420) scale(${bubble}) translate(-860,-420)`}>
          <rect x={640} y={300} width={460} height={250} fill={C.white} />
          <rect x={624} y={316} width={492} height={218} fill={C.white} />
          <rect x={590} y={570} width={36} height={36} fill={C.white} />
          <rect x={550} y={622} width={22} height={22} fill={C.white} />
          <Sprite
            grid={DICE}
            x={700 + (diceRoll ? (diceStep % 2) * 12 : 0)}
            y={370 + (diceRoll ? -Math.abs(Math.sin(frame * 0.3)) * 16 : 0)}
            px={14}
            flip={diceRoll && diceStep % 2 === 1}
          />
          <text x={940} y={500} fontSize={170} fontFamily={pixelFont} fill={C.navy}>
            ?
          </text>
        </g>
      </svg>

      {/* 「勘まかせ」スタンプ（スタンプ自身だけが動く） */}
      {frame >= 54 ? (
        <div
          style={{
            position: "absolute",
            left: 1200,
            top: 380,
            fontFamily: pixelFont,
            fontSize: 110,
            color: C.red,
            border: `12px solid ${C.red}`,
            padding: "0 36px",
            background: "rgba(255,255,255,0.9)",
            rotate: "-10deg",
            scale: `${1 + (1 - stamp) * 0.25}`,
            opacity: Math.min(1, stamp * 1.5),
          }}
        >
          勘まかせ
        </div>
      ) : null}

      <SlamTitle start={0}>勘で決めていない？</SlamTitle>
      <RpgBox text="勘だけだと、売れる物とズレる" start={80} />
    </AbsoluteFill>
  );
};
