import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Bubble } from "../scenes/SpinScene";
import { appear, C, fontFamily, pop } from "../theme";
import { Em, Headline, SceneTag } from "../ui";
import { Chibi } from "./Chibi";
import { CuteBg, Sparkle } from "./Decor";

const steps = [
  { key: "1", label: "今の様子を聞く", start: 10 },
  { key: "2", label: "困りごとを聞く", start: 22 },
  { key: "3", label: "放っておくと？", start: 34 },
  { key: "4", label: "解決策を伝える", start: 46 },
];

// シーン3：「これだ！」とひらめく瞬間
export const CuteAhaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fit = appear(frame, 75, 25);
  const xL = 900 - 280 * (1 - fit);
  const xR = 1020 + 280 * (1 - fit);
  const flash = interpolate(frame, [100, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bulb = pop(frame, fps, 102);
  const convinced = frame >= 104;
  const zoom = pop(frame, fps, 104);

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <CuteBg top="#FFF4F7" bottom="#F1F5FF" />

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
                borderRadius: 55,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                background: on > 0.5 ? (key ? C.gold : C.navy) : "#E4E1F0",
                color: on > 0.5 ? (key ? C.navy : C.white) : "#A49FBC",
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
        <span style={{ background: "linear-gradient(transparent 60%, #FFD6E0 60%)" }}>お客様自身に気づいてもらう</span>
      </div>

      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <ellipse cx={960} cy={1015} rx={760} ry={40} fill="#FFFFFF" opacity={0.7} />
        <Chibi
          x={520}
          y={1010}
          scale={1.1}
          mood="smile"
          hairStyle="twin"
          hair="#6B4A8A"
          iris="#7A5BB0"
          outfit="#5E8FD6"
          skirt
          ribbon={C.red}
          ahoge
          rightArm={-60 + Math.sin(frame * 0.15) * 12}
          sway={Math.sin(frame * 0.12) * 4}
          blink={frame % 80 > 76}
        />
        <Chibi
          x={1400}
          y={1010}
          scale={1.1 + 0.12 * zoom}
          flip
          mood={convinced ? "aha" : "worried"}
          hairStyle="short"
          hair="#6E6E7A"
          iris="#4A5A7A"
          outfit="#6A7186"
          tie={C.red}
          glasses
          sweat={convinced ? 0 : appear(frame, 60, 30)}
          rightArm={convinced ? -125 : -12}
        />
        {convinced
          ? Array.from({ length: 8 }).map((_, i) => {
              const a = (i / 8) * Math.PI * 2;
              const d = 130 + 90 * flash;
              return (
                <Sparkle
                  key={i}
                  x={1400 + Math.cos(a) * d}
                  y={810 + Math.sin(a) * d * 0.8}
                  size={16 + 8 * Math.abs(Math.sin(frame * 0.2 + i))}
                  fill={i % 2 ? "#FF8FA3" : C.gold}
                  opacity={1 - flash * 0.4}
                />
              );
            })
          : null}

        {/* パズルが噛み合う */}
        <g opacity={appear(frame, 70, 8)}>
          <circle cx={960} cy={800} r={40 + 160 * flash} fill="#FFD6E0" opacity={(1 - flash) * 0.8 * (frame >= 100 ? 1 : 0)} />
          <g transform={`translate(${xL},800)`}>
            <path d="M-60,-60 H60 V-20 A20,20 0 0 1 60,20 V60 H-60 Z" fill="#5AA9E6" />
            <text x={0} y={11} textAnchor="middle" fontSize={34} fontWeight={700} fill={C.white} fontFamily={fontFamily}>
              悩み
            </text>
          </g>
          <g transform={`translate(${xR},800)`}>
            <path d="M-60,-60 H60 V60 H-60 V20 A20,20 0 0 0 -60,-20 Z" fill="#F2C94C" />
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
              stroke="#F2B640"
              strokeWidth={7}
              strokeLinecap="round"
              transform={`rotate(${i * 45 + frame})`}
            />
          ))}
          <circle cx={0} cy={0} r={46} fill="#FFE27A" />
          <circle cx={-14} cy={-14} r={10} fill={C.white} opacity={0.8} />
          <rect x={-20} y={40} width={40} height={26} rx={8} fill="#9AA0B8" />
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
