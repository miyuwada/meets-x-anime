import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { appear, C, fontFamily, pop } from "../theme";
import { Caption, Em, Headline, SceneTag } from "../ui";
import { Chibi } from "./Chibi";
import { CuteBg, Sparkle } from "./Decor";
import { Robot } from "./Robot";

const points = [
  [700, 630],
  [800, 610],
  [900, 618],
  [1000, 560],
  [1100, 480],
  [1210, 370],
];

// シーン4：チームみんなで喜ぶ
export const CuteTeamScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const line = appear(frame, 12, 30);
  const cheering = frame > 40;
  const cheer = (delay: number) => (cheering ? -118 + Math.sin((frame - delay) * 0.3) * 18 : -12);
  const mood = cheering ? "joy" : "smile";

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <CuteBg top="#FFF9EE" bottom="#FFF0F4" />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <ellipse cx={960} cy={1015} rx={860} ry={40} fill="#FFFFFF" opacity={0.7} />

        {/* ダッシュボード */}
        <g opacity={appear(frame, 4)}>
          <rect x={620} y={282} width={700} height={450} rx={40} fill="#F3D9E0" />
          <rect x={610} y={270} width={700} height={450} rx={40} fill={C.white} />
          <text x={660} y={335} fontSize={34} fontWeight={700} fill={C.navy} fontFamily={fontFamily}>
            チームの成績
          </text>
          <line x1={680} y1={665} x2={1260} y2={665} stroke="#E4E1F0" strokeWidth={4} />
          {points.map(([x], i) => {
            const h = (60 + i * 42) * appear(frame, 8 + i * 4, 15);
            return (
              <rect key={x} x={x - 22} y={665 - h} width={44} height={h} rx={12} fill={["#FFE3EA", "#E3F2FF", "#FFF3D1"][i % 3]} />
            );
          })}
          <polyline
            points={points.map((p) => p.join(",")).join(" ")}
            fill="none"
            stroke="#FF7F9E"
            strokeWidth={9}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - line}
          />
          <g transform={`translate(1210,370) scale(${pop(frame, fps, 42)})`}>
            <path d="M0,10 C-30,-14 -16,-36 0,-22 C16,-36 30,-14 0,10 Z" fill="#FF7F9E" transform="scale(1.3)" />
            <text x={0} y={-48} textAnchor="middle" fontSize={40} fontWeight={900} fill="#FF7F9E" fontFamily={fontFamily}>
              UP!
            </text>
          </g>
        </g>

        <Robot x={1440} y={420} frame={frame} scale={0.72} wave={cheering} />

        {/* チームメンバー */}
        <Chibi x={200} y={1010} mood={mood} hairStyle="short" hair="#3A2A20" outfit={C.navy} tie={C.gold} iris="#3A4A7A" rightArm={cheer(0)} />
        <Chibi
          x={400}
          y={1010}
          mood={mood}
          hairStyle="twin"
          hair="#6B4A8A"
          iris="#7A5BB0"
          outfit="#5E8FD6"
          skirt
          ribbon={C.red}
          ahoge
          rightArm={cheer(8)}
          leftArm={cheering ? 118 - Math.sin((frame - 8) * 0.3) * 18 : 12}
          sway={Math.sin(frame * 0.15) * 4}
        />
        <Chibi
          x={1520}
          y={1010}
          flip
          mood={mood}
          hairStyle="long"
          hair="#A0522D"
          iris="#6B3E26"
          outfit={C.blue}
          skirt
          ribbon={C.gold}
          rightArm={cheer(4)}
          sway={Math.sin(frame * 0.15 + 1) * 3}
        />
        <Chibi
          x={1720}
          y={1010}
          flip
          mood={mood}
          hairStyle="short"
          hair="#6E6E7A"
          outfit="#6A7186"
          tie={C.red}
          glasses
          iris="#4A5A7A"
          rightArm={cheer(12)}
        />

        {/* 紙吹雪とハート */}
        {cheering
          ? Array.from({ length: 36 }).map((_, i) => {
              const x = random(`x${i}`) * 1920 + Math.sin(frame * 0.1 + i) * 20;
              const y = (frame - 40) * (6 + random(`s${i}`) * 6) + random(`y${i}`) * 300 - 300;
              const color = ["#FF8FA3", "#5AA9E6", "#F2C94C", "#B79CFF"][i % 4];
              return i % 3 === 0 ? (
                <path
                  key={i}
                  transform={`translate(${x},${y}) scale(0.8)`}
                  d="M0,10 C-30,-14 -16,-36 0,-22 C16,-36 30,-14 0,10 Z"
                  fill={color}
                />
              ) : (
                <rect key={i} x={x} y={y} width={14} height={22} rx={4} fill={color} transform={`rotate(${frame * 6 + i * 40},${x},${y})`} />
              );
            })
          : null}
        {cheering ? <Sparkle x={560} y={300} size={26} opacity={0.9} /> : null}
      </svg>

      {/* 効果が出るまでの目安 */}
      <div style={{ position: "absolute", top: 765, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 28 }}>
        {[
          { t: "約3ヶ月", d: "で話し方が変わる", s: 48 },
          { t: "半年〜1年", d: "で成果アップ", s: 58 },
        ].map((b) => {
          const p = appear(frame, b.s, 14);
          return (
            <div
              key={b.t}
              style={{
                background: C.white,
                border: "4px solid #FFC9D6",
                borderRadius: 999,
                padding: "10px 26px",
                fontSize: 31,
                fontWeight: 700,
                color: C.navy,
                opacity: p,
                translate: `0px ${(1 - p) * 20}px`,
              }}
            >
              <span style={{ color: C.blue, fontWeight: 900 }}>{b.t}</span>
              {b.d}
            </div>
          );
        })}
      </div>

      <SceneTag num="04" label="チームで上達" />
      <Headline start={2}>
        チーム全員が<Em>“売れる話し方”</Em>に
      </Headline>
      <Caption start={70}>気合いではなく、データで上達する</Caption>
    </AbsoluteFill>
  );
};
