import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { appear, C, fontFamily, pop } from "../theme";
import { Caption, Em, Headline, SceneTag } from "../ui";

const BARS = 46;
// 黙って待つ区間と「ひと呼吸」区間
const isSilence = (i: number) => (i >= 14 && i <= 19) || (i >= 32 && i <= 33);

const cards = [
  { label: "お客様が黙ったら", value: "急かさずに「待つ」", start: 40 },
  { label: "大事な提案の前に", value: "0.5秒「ひと呼吸」", start: 55 },
  { label: "お客様が話す時間", value: "ふつうの人より15〜20%長い", start: 70 },
];

// シーン2：AIで商談の会話を分析
export const AnalysisScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scan = interpolate(frame, [10, 80], [150, 850], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const chip = pop(frame, fps, 15);
  const glow = 0.5 + 0.5 * Math.sin(frame * 0.2);

  return (
    <AbsoluteFill style={{ background: C.navy, fontFamily }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {/* 音声波形パネル */}
        <rect x={130} y={330} width={740} height={380} rx={28} fill="#1F3363" />
        {Array.from({ length: BARS }).map((_, i) => {
          const x = 160 + i * 15;
          const silent = isSilence(i);
          const h = silent ? 6 : 24 + 190 * Math.abs(Math.sin(i * 0.7 + frame * 0.18)) * (0.4 + 0.6 * Math.abs(Math.sin(i * 0.31)));
          const scanned = x < scan;
          return (
            <rect
              key={i}
              x={x}
              y={520 - h / 2}
              width={8}
              height={h}
              rx={4}
              fill={scanned ? (silent ? C.gold : C.sky) : "#4A5E8C"}
            />
          );
        })}
        {/* 見つけたポイント */}
        <g opacity={appear(frame, 40)}>
          <rect x={364} y={400} width={98} height={240} rx={12} fill="none" stroke={C.gold} strokeWidth={4} strokeDasharray="10 8" />
          <text x={413} y={385} textAnchor="middle" fontSize={30} fontWeight={700} fill={C.gold} fontFamily={fontFamily}>
            待つ
          </text>
        </g>
        <g opacity={appear(frame, 55)}>
          <rect x={634} y={400} width={46} height={240} rx={12} fill="none" stroke={C.gold} strokeWidth={4} strokeDasharray="10 8" />
          <text x={657} y={385} textAnchor="middle" fontSize={30} fontWeight={700} fill={C.gold} fontFamily={fontFamily}>
            ひと呼吸
          </text>
        </g>
        <line x1={scan} y1={350} x2={scan} y2={690} stroke={C.white} strokeWidth={3} opacity={frame < 84 ? 0.8 : 0} />
        <text x={500} y={760} textAnchor="middle" fontSize={32} fill="#AFC0E0" fontFamily={fontFamily} fontWeight={500}>
          商談の会話
        </text>

        {/* AIチップ */}
        <g transform={`translate(985,520) scale(${chip})`}>
          {[-50, 0, 50].map((d) => (
            <g key={d}>
              <rect x={d - 5} y={-115} width={10} height={25} fill={C.sky} />
              <rect x={d - 5} y={90} width={10} height={25} fill={C.sky} />
            </g>
          ))}
          <rect x={-100} y={-100} width={200} height={200} rx={30} fill={C.blue} opacity={0.35 * glow} transform="scale(1.25)" />
          <rect x={-90} y={-90} width={180} height={180} rx={26} fill={C.blue} stroke={C.sky} strokeWidth={5} />
          <text x={0} y={30} textAnchor="middle" fontSize={84} fontWeight={900} fill={C.white} fontFamily={fontFamily}>
            AI
          </text>
        </g>
      </svg>

      {/* 分析結果カード */}
      {cards.map((c, i) => {
        const p = appear(frame, c.start, 15);
        return (
          <div
            key={c.label}
            style={{
              position: "absolute",
              left: 1120,
              top: 300 + i * 150,
              width: 720,
              height: 128,
              borderRadius: 22,
              background: C.white,
              display: "flex",
              alignItems: "center",
              padding: "0 32px",
              gap: 26,
              opacity: p,
              translate: `${(1 - p) * 80}px 0px`,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                background: C.navy,
                color: C.gold,
                fontSize: 30,
                fontWeight: 900,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            <div>
              <div style={{ fontSize: 28, color: C.sub, fontWeight: 500 }}>{c.label}</div>
              <div style={{ fontSize: i === 2 ? 38 : 44, color: i === 2 ? C.blue : C.navy, fontWeight: 900, lineHeight: 1.25 }}>
                {c.value}
              </div>
            </div>
          </div>
        );
      })}

      <SceneTag num="02" label="AIで分析" dark />
      <Headline dark start={2}>
        AIで<Em>売れる人の会話</Em>を分析すると…
      </Headline>
      <Caption start={88} dark>
        売れる人は、自分より相手に話してもらう
      </Caption>
    </AbsoluteFill>
  );
};
