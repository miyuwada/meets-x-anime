import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { appear, C, fontFamily } from "../theme";
import { Chibi } from "./Chibi";
import { CuteBg, Sparkle } from "./Decor";
import { Robot } from "./Robot";

export const CuteTitleScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <CuteBg top="#FFF5EE" bottom="#EAF3FF" />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <ellipse cx={1450} cy={965} rx={420} ry={40} fill="#FFFFFF" opacity={0.7} />
        <g opacity={appear(frame, 4, 14)}>
          <Chibi
            x={1360}
            y={960}
            scale={1.7}
            mood={frame > 30 ? "joy" : "smile"}
            hairStyle="long"
            outfit={C.blue}
            skirt
            ribbon={C.gold}
            ahoge
            rightArm={-115 + Math.sin(frame * 0.3) * 18}
            sway={Math.sin(frame * 0.12) * 3}
            blink={frame % 60 > 56}
          />
        </g>
        <g opacity={appear(frame, 12, 14)}>
          <Robot x={1690} y={560} frame={frame} scale={1.05} wave />
        </g>
        {[
          [1120, 420, 0],
          [1600, 330, 4],
          [1820, 760, 8],
        ].map(([sx, sy, d]) => (
          <Sparkle key={sx} x={sx} y={sy} size={22 + 10 * Math.abs(Math.sin(frame * 0.12 + d))} opacity={appear(frame, 16 + d)} />
        ))}
      </svg>

      <div style={{ position: "absolute", left: 140, top: 240 }}>
        <div style={{ color: "#B08F3A", fontSize: 38, fontWeight: 700, letterSpacing: 6, opacity: appear(frame, 3) }}>
          Meets Consulting コラム
        </div>
        <div
          style={{
            color: C.navy,
            fontSize: 72,
            fontWeight: 700,
            marginTop: 36,
            opacity: appear(frame, 8),
            translate: `${(1 - appear(frame, 8)) * -40}px 0px`,
          }}
        >
          AIでわかった
        </div>
        <div
          style={{
            color: C.navy,
            fontSize: 112,
            fontWeight: 900,
            lineHeight: 1.25,
            opacity: appear(frame, 14),
            translate: `${(1 - appear(frame, 14)) * -40}px 0px`,
          }}
        >
          売れる営業の
          <br />
          <span style={{ color: C.blue }}>話し方のコツ</span>
        </div>
        <div style={{ height: 10, borderRadius: 5, marginTop: 26, background: C.gold, width: 660 * appear(frame, 24, 18) }} />
      </div>

      <Img
        src={staticFile("meets_logo_navy.png")}
        style={{ position: "absolute", left: 140, bottom: 110, width: 270, opacity: appear(frame, 26) }}
      />
    </AbsoluteFill>
  );
};
