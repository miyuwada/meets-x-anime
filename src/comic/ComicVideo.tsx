import type React from "react";
import { Audio } from "@remotion/media";
import { loadFont as loadBangers } from "@remotion/google-fonts/Bangers";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, enter, WIDE, type CamKey } from "../glass/ui";
import { OutroScene } from "../scenes/OutroScene";
import { C, fontFamily } from "../theme";

// コラム「LXPとAIエージェントの統合」アメコミ版（約25秒）
// 絵は Gemini API（gemini-3-pro-image）で生成：public/comic/01〜04.jpg。それを Gemini Omni Flash で動かした 01〜04.mp4（8秒・無音）を使う
// 擬音・吹き出し・テロップはここで入れる
// コラムの「コスト約30%減」は根拠が示されていないため使わない

const { fontFamily: bangers } = loadBangers();
const CL = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const INK = "#111111";

// ---------- 部品 ----------
const LogoBadge: React.FC = () => (
  <div style={{ position: "absolute", top: 34, left: 40, background: "#FFFFFF", border: `5px solid ${INK}`, borderRadius: 12, padding: "8px 16px" }}>
    <Img src={staticFile("meets_logo_navy.png")} style={{ width: 200, display: "block" }} />
  </div>
);

// 右上の見出し「AI×新人研修」
const TitleChip: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top: 38,
        right: 44,
        opacity: enter(frame, 0, 12),
        background: "#FFD43B",
        border: `5px solid ${INK}`,
        boxShadow: `6px 6px 0 ${INK}`,
        padding: "6px 22px",
        fontFamily,
        fontWeight: 900,
        fontSize: 38,
        color: INK,
        rotate: "-2deg",
      }}
    >
      AI×新人研修
    </div>
  );
};

// 画面下のナレーション枠（アメコミのキャプションボックス風）
const Caption: React.FC<{ lines: string[]; start: number; top?: boolean }> = ({ lines, start, top = false }) => {
  const frame = useCurrentFrame();
  const p = enter(frame, start, 12);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, ...(top ? { top: 150 } : { bottom: 44 }), display: "flex", justifyContent: "center", opacity: p, translate: `0px ${(1 - p) * 18}px` }}>
      <div
        style={{
          background: "#FFF3B0",
          border: `6px solid ${INK}`,
          boxShadow: `8px 8px 0 ${INK}`,
          padding: "14px 46px",
          fontFamily,
          fontWeight: 900,
          fontSize: 56,
          lineHeight: 1.4,
          color: INK,
          textAlign: "center",
        }}
      >
        {lines.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
    </div>
  );
};

// 擬音（大きな英字・縁取り・グラデーション）。出るときだけ少し弾み、その後は止まる
const Sfx: React.FC<{ text: string; x: number; y: number; start: number; size: number; rot: number; from?: string; to?: string }> = ({
  text,
  x,
  y,
  start,
  size,
  rot,
  from = "#FFE14D",
  to = "#FF4B2B",
}) => {
  const frame = useCurrentFrame();
  const t = frame - start;
  const s = interpolate(t, [0, 6, 11], [0.3, 1.12, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: "-50% -50%",
        rotate: `${rot}deg`,
        scale: `${s}`,
        opacity: t < 0 ? 0 : 1,
        fontFamily: bangers,
        fontSize: size,
        letterSpacing: 4,
        lineHeight: 1,
        whiteSpace: "nowrap",
        background: `linear-gradient(180deg, ${from}, ${to})`,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        WebkitTextStroke: `${Math.round(size / 22)}px ${INK}`,
        filter: `drop-shadow(${size / 18}px ${size / 18}px 0 ${INK})`,
      }}
    >
      {text}
    </div>
  );
};

// 吹き出し（tail＝しっぽの向き）。thought=true でモヤモヤの心の声
const Bubble: React.FC<{
  lines: string[];
  x: number;
  y: number;
  start: number;
  end?: number;
  tail: "left" | "right" | "down-left" | "down-right";
  thought?: boolean;
  size?: number;
}> = ({ lines, x, y, start, end, tail, thought = false, size = 52 }) => {
  const frame = useCurrentFrame();
  const p = enter(frame, start, 10) * (end ? 1 - enter(frame, end, 10) : 1);
  const tailStyle: Record<string, React.CSSProperties> = {
    left: { left: -46, top: "55%" },
    right: { right: -46, top: "55%" },
    "down-left": { left: "22%", bottom: -50 },
    "down-right": { right: "22%", bottom: -50 },
  };
  return (
    <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", opacity: p, scale: `${0.85 + 0.15 * p}` }}>
      <div
        style={{
          position: "relative",
          background: "#FFFFFF",
          border: `6px ${thought ? "dashed" : "solid"} ${INK}`,
          borderRadius: thought ? 80 : 60,
          padding: "22px 44px",
          fontFamily,
          fontWeight: 900,
          fontSize: size,
          lineHeight: 1.35,
          color: INK,
          textAlign: "center",
          whiteSpace: "nowrap",
          boxShadow: `6px 6px 0 rgba(0,0,0,0.35)`,
        }}
      >
        {lines.map((l) => (
          <div key={l}>{l}</div>
        ))}
        {thought ? (
          <div style={{ position: "absolute", ...tailStyle[tail] }}>
            <div style={{ width: 30, height: 30, borderRadius: 99, background: "#FFF", border: `5px solid ${INK}` }} />
          </div>
        ) : (
          <svg width={60} height={60} viewBox="0 0 60 60" style={{ position: "absolute", ...tailStyle[tail], overflow: "visible" }}>
            {tail.startsWith("down") ? (
              <path d={tail === "down-left" ? "M8 0 L0 56 L40 0" : "M52 0 L60 56 L20 0"} fill="#FFF" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
            ) : (
              <path d={tail === "left" ? "M60 6 L0 30 L60 46" : "M0 6 L60 30 L0 46"} fill="#FFF" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
            )}
          </svg>
        )}
      </div>
    </div>
  );
};

const Sound: React.FC<{ name: string; at: number; vol: number }> = ({ name, at, vol }) => {
  const { fps } = useVideoConfig();
  return <Audio name={`効果音 ${name}`} src={staticFile(`hrdx/audio/${name}.wav`)} from={at} volume={vol} premountFor={fps} />;
};

// 動くコマ（16:9）を画面いっぱいに置き、カメラでゆっくり寄り・引き。外側に太い黒枠でコマらしく
const Panel: React.FC<{ img: string; keys: CamKey[]; children?: React.ReactNode }> = ({ img, keys, children }) => (
  <AbsoluteFill style={{ background: INK }}>
    <Camera keys={keys}>
      <OffthreadVideo src={staticFile(img)} muted style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "cover" }} />
    </Camera>
    <AbsoluteFill style={{ border: `14px solid ${INK}`, boxSizing: "border-box" }} />
    {children}
    <LogoBadge />
    <TitleChip />
  </AbsoluteFill>
);

// ---------- 場面 ----------
// 01 みんな同じ分厚いマニュアル
const BinderScene: React.FC = () => (
  <Panel
    img={IMG[1]}
    keys={[
      { f: 0, x: 1080, y: 600, z: 1.15 },
      { f: 110, ...WIDE },
    ]}
  >
    <Sfx text="DOSUN!!" x={1480} y={560} start={8} size={180} rot={-8} />
    <Sound name="impact" at={8} vol={0.6} />
    <Caption lines={["その研修、", "全員に同じでいいの？"]} start={100} top />
  </Panel>
);

// 02 聞きたいけど、聞けない
const AloneScene: React.FC = () => (
  <Panel
    img={IMG[2]}
    keys={[
      { f: 0, ...WIDE },
      { f: 150, x: 880, y: 520, z: 1.1 },
    ]}
  >
    <Bubble lines={["聞きたいけど、", "聞けない…"]} x={1450} y={300} start={20} tail="down-left" thought />
    <Caption lines={["わからないまま、", "ひとりで抱えこむ新人。"]} start={58} />
  </Panel>
);

// 03 AIエージェント、参上
const HeroScene: React.FC = () => (
  <Panel
    img={IMG[3]}
    keys={[
      { f: 0, x: 1080, y: 470, z: 1.15 },
      { f: 80, ...WIDE },
      { f: 195, x: 960, y: 540, z: 1.05 },
    ]}
  >
    <Sfx text="SHAKIN!!" x={330} y={360} start={6} size={170} rot={-10} from="#E6FFFF" to="#19B6D2" />
    <Sound name="shing" at={6} vol={0.5} />
    <Bubble lines={["24時間、", "なんでも聞いて！"]} x={880} y={230} start={72} tail="right" />
    <Caption lines={["AIエージェントが、", "ひとりひとりに合った学び方を。"]} start={95} />
  </Panel>
);

// 04 自信をもって現場へ
const FinaleScene: React.FC = () => (
  <Panel
    img={IMG[4]}
    keys={[
      { f: 0, x: 900, y: 480, z: 1.12 },
      { f: 120, ...WIDE },
    ]}
  >
    <Sfx text="BOOOM!!" x={1010} y={170} start={8} size={170} rot={-4} />
    <Sound name="boom" at={8} vol={0.55} />
    <Caption lines={["“全員同じ”から、", "“ひとりひとりに合う”研修へ。"]} start={44} />
  </Panel>
);

export const IMG: Record<number, string> = {
  1: "comic/01.mp4",
  2: "comic/02.mp4",
  3: "comic/03.mp4",
  4: "comic/04.mp4",
};

export const ComicVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  const t = linearTiming({ durationInFrames: 15 });
  return (
    <>
      <Audio name="音楽" src={staticFile("hrdx/audio/score-comic.wav")} volume={0.45} premountFor={fps} />
      <TransitionSeries>
        <TransitionSeries.Sequence name="01 同じマニュアル" durationInFrames={165} premountFor={fps}>
          <BinderScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="02 聞けない" durationInFrames={165} premountFor={fps}>
          <AloneScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="03 AIエージェント" durationInFrames={195} premountFor={fps}>
          <HeroScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="04 自信をもって" durationInFrames={180} premountFor={fps}>
          <FinaleScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="05 無料相談" durationInFrames={105} premountFor={fps}>
          <OutroScene
            quick
            lead={["新人の育成・研修に", "お悩みの方は"]}
            message={
              <span style={{ fontSize: 72, fontWeight: 900 }}>
                まずは、<span style={{ color: C.blue }}>無料相談</span>から。
              </span>
            }
          />
          <Sound name="success" at={4} vol={0.5} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </>
  );
};

export { BinderScene, AloneScene, HeroScene, FinaleScene };
