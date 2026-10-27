import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Person } from "../Person";
import { appear, C, fontFamily, pop } from "../theme";
import { Caption, Em, Headline, SceneTag } from "../ui";

// シーン1：売れる人のコツが共有できない
export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const marks = [
    { x: 330, y: 360, start: 12, color: C.blue },
    { x: 560, y: 300, start: 18, color: C.gold },
    { x: 680, y: 410, start: 24, color: C.blue },
  ];
  const boxPop = pop(frame, fps, 40);
  const dash = appear(frame, 25, 25);

  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <rect x={0} y={880} width={1920} height={200} fill="#E3E8F1" />
        {/* 売れる営業のスポットライト */}
        <circle cx={1460} cy={640} r={260 * appear(frame, 5, 20)} fill="#FFF3D6" />

        {/* 売れる営業 → 若手へ、伝わらないコツ */}
        <line
          x1={1300}
          y1={560}
          x2={1300 - 640 * dash}
          y2={560}
          stroke={C.sub}
          strokeWidth={6}
          strokeDasharray="4 18"
          strokeLinecap="round"
        />
        <g transform={`translate(980,560) scale(${boxPop})`}>
          <rect x={-90} y={-90} width={180} height={180} rx={24} fill={C.ink} />
          <text x={0} y={34} textAnchor="middle" fontSize={110} fontWeight={900} fill={C.white} fontFamily={fontFamily}>
            ?
          </text>
          <text x={0} y={140} textAnchor="middle" fontSize={38} fontWeight={700} fill={C.ink} fontFamily={fontFamily}>
            感覚・経験
          </text>
        </g>

        {/* 売れる営業 */}
        <Person
          x={1460}
          y={900}
          scale={1.2}
          flip
          mood="smile"
          rightArm={interpolate(frame, [10, 25], [-10, -150], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
          blink={frame % 70 > 66}
        />
        {[0, 1, 2].map((i) => {
          const s = 0.6 + 0.4 * Math.abs(Math.sin(frame * 0.12 + i * 2));
          return (
            <path
              key={i}
              transform={`translate(${[1290, 1640, 1600][i]},${[380, 330, 520][i]}) scale(${s * appear(frame, 18 + i * 4)})`}
              d="M0,-28 L8,-8 L28,0 L8,8 L0,28 L-8,8 L-28,0 L-8,-8 Z"
              fill={C.gold}
            />
          );
        })}

        {/* 悩む若手営業 */}
        <Person
          x={500}
          y={900}
          scale={1.2}
          mood="worried"
          suit="#3C5A8A"
          tie={C.sky}
          leftArm={-165}
          rightArm={165}
          armsFront
          tilt={Math.sin(frame * 0.15) * 4}
        />
        {/* デスクとノートPC */}
        <rect x={280} y={720} width={440} height={22} rx={6} fill="#8A6A4F" />
        <rect x={300} y={742} width={18} height={140} fill="#6E543F" />
        <rect x={682} y={742} width={18} height={140} fill="#6E543F" />
        <polygon points="400,720 600,720 585,610 415,610" fill="#C9D1DE" />
        <polygon points="420,705 580,705 568,622 432,622" fill={C.sky} opacity={0.5} />

        {marks.map((m) => (
          <text
            key={m.x}
            x={m.x}
            y={m.y + Math.sin(frame * 0.1 + m.x) * 12}
            textAnchor="middle"
            fontSize={96}
            fontWeight={900}
            fill={m.color}
            fontFamily={fontFamily}
            opacity={appear(frame, m.start)}
          >
            ?
          </text>
        ))}
      </svg>

      <SceneTag num="01" label="なやみ" />
      <Headline start={2}>
        売れる人のコツ、<Em>なぜマネできない？</Em>
      </Headline>
      <Caption start={55}>横で見ていても、どこが違うのか説明できない</Caption>
    </AbsoluteFill>
  );
};
