import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Person } from "../Person";
import { appear, C, fontFamily, pop } from "../theme";
import { Em, Headline, SceneTag } from "../ui";

const steps = [
  { key: "1", label: "今の様子を聞く", start: 10 },
  { key: "2", label: "困りごとを聞く", start: 22 },
  { key: "3", label: "放っておくと？", start: 34 },
  { key: "4", label: "解決策を伝える", start: 46 },
];

export const Bubble: React.FC<{ left: number; top: number; start: number; tail: number; children: React.ReactNode }> = ({
  left,
  top,
  start,
  tail,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(frame, fps, start);
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        scale: `${s}`,
        transformOrigin: `${tail}px 100%`,
        background: C.white,
        border: `4px solid ${C.navy}`,
        borderRadius: 28,
        padding: "16px 30px",
        fontSize: 34,
        fontWeight: 700,
        color: C.navy,
        whiteSpace: "nowrap",
      }}
    >
      {children}
      <div
        style={{
          position: "absolute",
          left: tail - 14,
          bottom: -18,
          width: 28,
          height: 28,
          background: C.white,
          borderRight: `4px solid ${C.navy}`,
          borderBottom: `4px solid ${C.navy}`,
          rotate: "45deg",
        }}
      />
    </div>
  );
};

// シーン3：納得してもらえる質問の順番
export const SpinScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fit = appear(frame, 75, 25);
  const xL = 900 - 280 * (1 - fit);
  const xR = 1020 + 280 * (1 - fit);
  const flash = interpolate(frame, [100, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bulb = pop(frame, fps, 102);
  const convinced = frame >= 104;

  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily }}>
      {/* 質問の順番 */}
      <div style={{ position: "absolute", top: 250, left: 204, display: "flex", gap: 24 }}>
        {steps.map((st) => {
          const on = appear(frame, st.start, 10);
          const key = st.key === "3";
          return (
            <div
              key={st.key}
              style={{
                width: 360,
                height: 110,
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                background: on > 0.5 ? (key ? C.gold : C.navy) : "#DCE2EC",
                color: on > 0.5 ? (key ? C.navy : C.white) : "#9AA5B8",
                scale: `${1 + (key ? 0.08 * on : 0)}`,
                boxShadow: key && on > 0.5 ? "0 12px 30px rgba(204,179,102,0.55)" : "none",
              }}
            >
              <span style={{ fontSize: 56, fontWeight: 900 }}>{st.key}</span>
              <span style={{ fontSize: 38, fontWeight: 700 }}>{st.label}</span>
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          top: 400,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 42,
          fontWeight: 700,
          color: C.navy,
          opacity: appear(frame, 52),
        }}
      >
        「このままだとどうなる？」を
        <span style={{ background: "linear-gradient(transparent 60%, #EFE3B8 60%)" }}>お客様自身に気づいてもらう</span>
      </div>

      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <rect x={0} y={960} width={1920} height={120} fill="#E3E8F1" />
        <Person
          x={520}
          y={1010}
          hairStyle="long"
          hair="#4A3328"
          suit={C.blue}
          tie={null}
          mood="smile"
          rightArm={-50 + Math.sin(frame * 0.15) * 10}
          blink={frame % 80 > 76}
        />
        <Person
          x={1400}
          y={1010}
          flip
          mood={convinced ? "smile" : "worried"}
          suit="#555B66"
          tie={C.red}
          hair="#5A5A5A"
          rightArm={convinced ? -140 : -10}
        />

        {/* パズルが噛み合う */}
        <g opacity={appear(frame, 70, 8)}>
          <circle cx={960} cy={800} r={40 + 160 * flash} fill={C.gold} opacity={(1 - flash) * 0.6 * (frame >= 100 ? 1 : 0)} />
          <g transform={`translate(${xL},800)`}>
            <path d="M-60,-60 H60 V-20 A20,20 0 0 1 60,20 V60 H-60 Z" fill={C.blue} />
            <text x={0} y={11} textAnchor="middle" fontSize={34} fontWeight={700} fill={C.white} fontFamily={fontFamily}>
              悩み
            </text>
          </g>
          <g transform={`translate(${xR},800)`}>
            <path d="M-60,-60 H60 V60 H-60 V20 A20,20 0 0 0 -60,-20 Z" fill={C.gold} />
            <text x={8} y={11} textAnchor="middle" fontSize={34} fontWeight={700} fill={C.navy} fontFamily={fontFamily}>
              答え
            </text>
          </g>
        </g>

        {/* ひらめき電球 */}
        <g transform={`translate(960,630) scale(${bulb})`}>
          {Array.from({ length: 8 }).map((_, i) => (
            <line
              key={i}
              x1={0}
              y1={-62}
              x2={0}
              y2={-88}
              stroke={C.gold}
              strokeWidth={7}
              strokeLinecap="round"
              transform={`rotate(${i * 45 + frame})`}
            />
          ))}
          <circle cx={0} cy={0} r={46} fill="#FFD95A" />
          <rect x={-20} y={40} width={40} height={26} rx={6} fill={C.sub} />
        </g>
      </svg>

      <Bubble left={170} top={530} start={60} tail={330}>
        このままだと、どれくらい損しますか？
      </Bubble>
      <Bubble left={1190} top={530} start={110} tail={210}>
        確かに…早く何とかしたい！
      </Bubble>

      <SceneTag num="03" label="納得のひみつ" />
      <Headline start={2}>
        納得してもらえる<Em>“質問の順番”</Em>
      </Headline>
    </AbsoluteFill>
  );
};
