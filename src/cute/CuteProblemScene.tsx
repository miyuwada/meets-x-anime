import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { appear, C, fontFamily, pop } from "../theme";
import { Caption, Em, Headline, SceneTag } from "../ui";
import { Chibi } from "./Chibi";
import { CuteBg, HoloBubble, Sparkle } from "./Decor";

// シーン1：悩む若手営業ちゃん
export const CuteProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const boxPop = pop(frame, fps, 40);
  const dash = appear(frame, 25, 25);

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <CuteBg top="#F6F1FF" bottom="#FFF4EE" />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <rect x={0} y={880} width={1920} height={200} fill="#EDE6F7" />
        <circle cx={1460} cy={640} r={290 * appear(frame, 5, 20)} fill="#FFF0C9" />

        {/* 伝わらないコツ */}
        <line
          x1={1290}
          y1={560}
          x2={1290 - 620 * dash}
          y2={560}
          stroke="#B9A9D6"
          strokeWidth={7}
          strokeDasharray="4 18"
          strokeLinecap="round"
        />
        <g transform={`translate(980,560) scale(${boxPop}) rotate(${Math.sin(frame * 0.2) * 4})`}>
          <rect x={-85} y={-85} width={170} height={170} rx={40} fill="#3B3F6B" />
          <text x={0} y={32} textAnchor="middle" fontSize={104} fontWeight={900} fill={C.white} fontFamily={fontFamily}>
            ?
          </text>
          <text x={0} y={136} textAnchor="middle" fontSize={38} fontWeight={700} fill={C.navy} fontFamily={fontFamily}>
            感覚・経験
          </text>
        </g>

        {/* 売れる先輩 */}
        <Chibi
          x={1460}
          y={905}
          scale={1.6}
          flip
          mood="joy"
          hairStyle="short"
          hair="#3A2A20"
          outfit={C.navy}
          tie={C.gold}
          iris="#3A4A7A"
          rightArm={interpolate(frame, [10, 22], [-12, -125], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        />
        {[0, 1, 2].map((i) => (
          <Sparkle
            key={i}
            x={[1260, 1660, 1680][i]}
            y={[360, 330, 560][i]}
            size={(18 + 12 * Math.abs(Math.sin(frame * 0.14 + i * 2))) * appear(frame, 18 + i * 4)}
          />
        ))}

        {/* 悩む若手営業ちゃん */}
        <Chibi
          x={440}
          y={905}
          scale={1.6}
          mood="worried"
          hairStyle="twin"
          hair="#6B4A8A"
          iris="#7A5BB0"
          outfit="#5E8FD6"
          skirt
          ribbon={C.red}
          ahoge
          tilt={Math.sin(frame * 0.15) * 5}
          sway={Math.sin(frame * 0.12) * 4}
          sweat={appear(frame, 20, 30)}
        />
        {/* デスクとノートPC（背面） */}
        <rect x={200} y={760} width={520} height={26} rx={10} fill="#D8B48C" />
        <rect x={225} y={786} width={18} height={100} rx={6} fill="#B8926A" />
        <rect x={677} y={786} width={18} height={100} rx={6} fill="#B8926A" />
        <rect x={590} y={650} width={130} height={110} rx={12} fill="#E3E8F2" />
        <circle cx={655} cy={705} r={12} fill="#C9D1E3" />

        <HoloBubble x={230} y={400 + Math.sin(frame * 0.1) * 10} label="?" opacity={appear(frame, 12)} />
        <HoloBubble x={600} y={340 + Math.sin(frame * 0.1 + 2) * 10} label="?" opacity={appear(frame, 18)} />
        <HoloBubble x={735} y={520 + Math.sin(frame * 0.1 + 4) * 10} label="?" opacity={appear(frame, 24)} />
      </svg>

      <SceneTag num="01" label="なやみ" />
      <Headline start={2}>
        売れる人のコツ、<Em>なぜマネできない？</Em>
      </Headline>
      <Caption start={55}>横で見ていても、どこが違うのか説明できない</Caption>
    </AbsoluteFill>
  );
};
