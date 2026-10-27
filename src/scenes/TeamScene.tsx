import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { Person } from "../Person";
import { appear, C, fontFamily, pop } from "../theme";
import { Caption, Em, Headline, SceneTag } from "../ui";

const points = [
  [700, 630],
  [800, 610],
  [900, 618],
  [1000, 560],
  [1100, 480],
  [1210, 370],
];

// シーン4：チーム全員が上達
export const TeamScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const line = appear(frame, 12, 30);
  const cheer = (delay: number) => -150 + Math.sin((frame - delay) * 0.25) * 15;
  const cheering = frame > 40;

  return (
    <AbsoluteFill style={{ background: "#FBF8EF", fontFamily }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <rect x={0} y={960} width={1920} height={120} fill="#EFE8D6" />

        {/* ダッシュボード */}
        <g opacity={appear(frame, 4)}>
          <rect x={620} y={282} width={700} height={450} rx={30} fill="#E6DCC2" />
          <rect x={610} y={270} width={700} height={450} rx={30} fill={C.white} />
          <text x={660} y={335} fontSize={34} fontWeight={700} fill={C.navy} fontFamily={fontFamily}>
            チームの成績
          </text>
          <line x1={680} y1={665} x2={1260} y2={665} stroke="#D5DAE3" strokeWidth={4} />
          {points.map(([x], i) => {
            const h = (60 + i * 42) * appear(frame, 8 + i * 4, 15);
            return <rect key={x} x={x - 22} y={665 - h} width={44} height={h} rx={8} fill="#DCE7F5" />;
          })}
          <polyline
            points={points.map((p) => p.join(",")).join(" ")}
            fill="none"
            stroke={C.blue}
            strokeWidth={9}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - line}
          />
          <g transform={`translate(1210,370) scale(${pop(frame, fps, 42)})`}>
            <circle r={22} fill={C.gold} />
            <text x={0} y={-40} textAnchor="middle" fontSize={40} fontWeight={900} fill={C.gold} fontFamily={fontFamily}>
              UP!
            </text>
          </g>
        </g>

        {/* チームメンバー */}
        <Person x={280} y={1010} scale={0.95} mood="smile" suit="#3C5A8A" tie={C.sky} rightArm={cheering ? cheer(0) : -10} />
        <Person x={470} y={1010} scale={0.95} mood="smile" hairStyle="long" hair="#4A3328" suit={C.blue} tie={null} rightArm={cheering ? cheer(8) : -10} />
        <Person x={1450} y={1010} scale={0.95} flip mood="smile" suit={C.navy} rightArm={cheering ? cheer(4) : -10} />
        <Person x={1640} y={1010} scale={0.95} flip mood="smile" hairStyle="long" hair="#2A2A35" suit="#555B66" tie={null} rightArm={cheering ? cheer(12) : -10} />

        {/* 紙吹雪 */}
        {frame > 40
          ? Array.from({ length: 36 }).map((_, i) => {
              const x = random(`x${i}`) * 1920;
              const speed = 6 + random(`s${i}`) * 6;
              const y = (frame - 40) * speed + random(`y${i}`) * 300 - 300;
              return (
                <rect
                  key={i}
                  x={x + Math.sin(frame * 0.1 + i) * 20}
                  y={y}
                  width={14}
                  height={22}
                  fill={[C.gold, C.blue, C.sky, C.red][i % 4]}
                  transform={`rotate(${frame * 6 + i * 40},${x},${y})`}
                  opacity={0.85}
                />
              );
            })
          : null}
      </svg>

      {/* 効果が出るまでの目安 */}
      <div
        style={{
          position: "absolute",
          top: 765,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 28,
        }}
      >
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
                border: `4px solid ${C.gold}`,
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
