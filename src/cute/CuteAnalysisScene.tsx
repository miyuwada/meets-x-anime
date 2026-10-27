import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { appear, C, fontFamily } from "../theme";
import { Caption, Em, Headline, SceneTag } from "../ui";
import { Chibi } from "./Chibi";
import { CuteBg, Sparkle } from "./Decor";
import { Robot } from "./Robot";

const BARS = 36;
const isSilence = (i: number) => (i >= 11 && i <= 15) || (i >= 26 && i <= 27);

const cards = [
  { label: "お客様が黙ったら", value: "急かさずに「待つ」", start: 40, color: "#FFE3EA" },
  { label: "大事な提案の前に", value: "0.5秒「ひと呼吸」", start: 55, color: "#E3F2FF" },
  { label: "お客様が話す時間", value: "ふつうの人より15〜20%長い", start: 70, color: "#FFF3D1" },
];

// シーン2：AIマスコットが会話を分析
export const CuteAnalysisScene: React.FC = () => {
  const frame = useCurrentFrame();
  const scan = interpolate(frame, [10, 80], [500, 1040], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const screen = appear(frame, 6, 16);

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <CuteBg top="#F3F0FF" bottom="#E8F6FF" />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {/* ロボットから投影される光 */}
        <polygon points="330,400 470,300 470,700" fill="#8FE6FF" opacity={0.18 * screen} />
        <Robot x={290} y={420} frame={frame} scale={1.1} eyes="scan" />

        {/* ホログラム画面 */}
        <g opacity={screen}>
          <rect x={470} y={300} width={590} height={400} rx={30} fill="#FFFFFF" fillOpacity={0.6} stroke="#8FD3FF" strokeWidth={4} />
          {Array.from({ length: BARS }).map((_, i) => {
            const bx = 505 + i * 15;
            const silent = isSilence(i);
            const h = silent ? 6 : 20 + 170 * Math.abs(Math.sin(i * 0.7 + frame * 0.18)) * (0.4 + 0.6 * Math.abs(Math.sin(i * 0.31)));
            return (
              <rect
                key={i}
                x={bx}
                y={500 - h / 2}
                width={8}
                height={h}
                rx={4}
                fill={bx < scan ? (silent ? "#F2B640" : "#5AA9E6") : "#C9D6EA"}
              />
            );
          })}
          <g opacity={appear(frame, 40)}>
            <rect x={663} y={385} width={78} height={230} rx={14} fill="none" stroke="#F2B640" strokeWidth={4} strokeDasharray="10 8" />
            <text x={702} y={370} textAnchor="middle" fontSize={30} fontWeight={700} fill="#D9971A" fontFamily={fontFamily}>
              待つ
            </text>
          </g>
          <g opacity={appear(frame, 55)}>
            <rect x={888} y={385} width={38} height={230} rx={12} fill="none" stroke="#F2B640" strokeWidth={4} strokeDasharray="10 8" />
            <text x={907} y={370} textAnchor="middle" fontSize={30} fontWeight={700} fill="#D9971A" fontFamily={fontFamily}>
              ひと呼吸
            </text>
          </g>
          <line x1={scan} y1={318} x2={scan} y2={682} stroke={C.blue} strokeWidth={3} opacity={frame < 84 ? 0.7 : 0} />
          <text x={765} y={750} textAnchor="middle" fontSize={32} fill={C.sub} fontFamily={fontFamily} fontWeight={700}>
            商談の会話
          </text>
        </g>

        {/* 見上げて感動する営業ちゃん */}
        <Chibi
          x={250}
          y={1010}
          scale={1.0}
          mood={frame > 45 ? "aha" : "wow"}
          hairStyle="twin"
          hair="#6B4A8A"
          iris="#7A5BB0"
          outfit="#5E8FD6"
          skirt
          ribbon={C.red}
          ahoge
          tilt={-6}
          sway={Math.sin(frame * 0.12) * 4}
          blink={frame % 70 > 66}
        />
        {frame > 45
          ? [0, 1].map((i) => (
              <Sparkle key={i} x={[150, 370][i]} y={[740, 720][i]} size={14 + 8 * Math.abs(Math.sin(frame * 0.2 + i))} fill="#F2B640" />
            ))
          : null}
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
              top: 290 + i * 150,
              width: 720,
              height: 128,
              borderRadius: 34,
              background: C.white,
              border: `4px solid ${c.color}`,
              boxShadow: "0 8px 24px rgba(120,110,180,0.15)",
              display: "flex",
              alignItems: "center",
              padding: "0 30px",
              gap: 24,
              opacity: p,
              translate: `${(1 - p) * 80}px 0px`,
              scale: `${0.9 + 0.1 * p}`,
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                background: c.color,
                color: C.navy,
                fontSize: 32,
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

      <SceneTag num="02" label="AIで分析" />
      <Headline start={2}>
        AIで<Em>売れる人の会話</Em>を分析すると…
      </Headline>
      <Caption start={88}>売れる人は、自分より相手に話してもらう</Caption>
    </AbsoluteFill>
  );
};
