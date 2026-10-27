import type React from "react";
import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { AbsoluteFill, Easing, Img, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { nod, Puppet, RIGS, walk } from "./Puppet";
import { Camera, enter, SceneSpeed, useSceneFrame, WIDE } from "../glass/ui";
import { OutroScene } from "../scenes/OutroScene";
import { C, fontFamily } from "../theme";

// コラム「AI予測で離職を防ぐ：静かな退職を検知する最新HRDX」
// Gemini で作ったキャラクター表（public/hrdx/sheet.jpg）から切り抜いた人物を使う（約26.5秒）

const img = (n: string) => staticFile(`hrdx/${n}.png`);
const CL = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: Easing.inOut(Easing.sin) };

// 人物：足元を基準に置き、呼吸（わずかな伸び縮み）と小さな揺れを付ける
const Char: React.FC<{
  src: string;
  x: number; // 足元の中心
  floor: number; // 足元の高さ
  h: number; // 表示する高さ
  flip?: boolean;
  phase?: number;
  sway?: number; // 揺れ（うなずき）の大きさ（度）
  filter?: string;
  shadow?: boolean;
}> = ({ src, x, floor, h, flip, phase = 0, sway = 0, filter, shadow = true }) => {
  const frame = useCurrentFrame();
  const breathe = 1 + 0.006 * Math.sin(frame * 0.09 + phase);
  const rot = sway * Math.sin(frame * 0.07 + phase);
  return (
    <>
      {shadow ? (
        <div
          style={{
            position: "absolute",
            left: x - h * 0.2,
            top: floor - h * 0.025,
            width: h * 0.4,
            height: h * 0.05,
            borderRadius: "50%",
            background: "radial-gradient(closest-side, rgba(0,0,0,0.35), rgba(0,0,0,0))",
          }}
        />
      ) : null}
      <Img
        src={src}
        style={{
          position: "absolute",
          left: x,
          top: floor - h,
          height: h,
          translate: "-50% 0",
          transformOrigin: "50% 100%",
          transform: `scaleX(${flip ? -1 : 1}) scaleY(${breathe}) rotate(${rot}deg)`,
          filter,
        }}
      />
    </>
  );
};

// テロップ（下中央・2行・出たあとは静止）
const Telop: React.FC<{ lines: string[]; start: number }> = ({ lines, start }) => {
  const frame = useCurrentFrame();
  const p = enter(frame, start, 14);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 56, display: "flex", justifyContent: "center", opacity: p, translate: `0px ${(1 - p) * 20}px` }}>
      <div
        style={{
          background: "rgba(8,16,32,0.72)",
          borderRadius: 20,
          padding: "18px 48px",
          fontFamily,
          fontWeight: 700,
          fontSize: 54,
          lineHeight: 1.45,
          color: "#FFFFFF",
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

// 効果音（シーン内のフレームで鳴らす）
const Sfx: React.FC<{ name: string; at: number; vol: number }> = ({ name, at, vol }) => {
  const { fps } = useVideoConfig();
  return <Audio name={`効果音 ${name}`} src={staticFile(`hrdx/audio/${name}.wav`)} from={at} volume={vol} premountFor={fps} />;
};

const LogoBadge: React.FC = () => (
  <div style={{ position: "absolute", top: 36, left: 40, background: "rgba(255,255,255,0.9)", borderRadius: 14, padding: "10px 18px" }}>
    <Img src={staticFile("meets_logo_navy.png")} style={{ width: 210, display: "block" }} />
  </div>
);

// ---------- シーン1：静かな退職（夜のオフィス） ----------
const QuietScene: React.FC<{ lines?: string[] }> = ({ lines = ["退職届が出てからでは遅い。", "『静かな退職』は目に見えず進行する。"] }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#0B1428" }}>
      <Camera
        keys={[
          { f: 0, ...WIDE, z: 1.02 },
          { f: 30, ...WIDE, z: 1.02 },
          { f: 150, x: 640, y: 520, z: 1.45, r: -2 },
          { f: 210, x: 660, y: 510, z: 1.5, r: -2 },
        ]}
      >
        {/* 壁と窓の夜景 */}
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #0F1C38 0%, #1A2B52 62%, #0C1426 62%, #080E1C 100%)" }} />
        {[0, 1, 2].map((w) => (
          <div key={w} style={{ position: "absolute", left: 120 + w * 580, top: 90, width: 520, height: 470, background: "linear-gradient(180deg, #0A1430, #1C2C5A)", border: "10px solid #24365F", overflow: "hidden" }}>
            {Array.from({ length: 9 }).map((_, b) => {
              const bh = 140 + random(`bh${w}-${b}`) * 260;
              return (
                <div key={b} style={{ position: "absolute", left: b * 60, bottom: 0, width: 54, height: bh, background: "#0E1934" }}>
                  {Array.from({ length: 10 }).map((__, r) => (
                    <div
                      key={r}
                      style={{
                        position: "absolute",
                        left: 10 + (r % 3) * 14,
                        top: 12 + Math.floor(r / 3) * 22,
                        width: 8,
                        height: 10,
                        background: random(`l${w}-${b}-${r}`) > 0.45 ? "#FFD98A" : "transparent",
                        opacity: 0.7,
                      }}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        ))}
        {/* 奥で談笑する同僚（影） */}
        <div style={{ position: "absolute", left: 1380, top: 300, width: 440, height: 380, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(255,200,120,0.28), rgba(255,200,120,0))" }} />
        <Char src={img("man_front")} x={1500} floor={690} h={380} filter="brightness(0.22) blur(3px)" shadow={false} sway={1.2} />
        <Char src={img("woman_front")} x={1650} floor={690} h={360} filter="brightness(0.22) blur(3px)" shadow={false} phase={2} sway={1.2} />
        {/* 主人公：机に向かう */}
        <div style={{ position: "absolute", left: 470, top: 330, width: 420, height: 560, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(90,200,255,0.25), rgba(90,200,255,0))" }} />
        <Puppet
          rig={RIGS.woman}
          x={600}
          floor={980}
          height={720}
          filter="brightness(0.78) saturate(0.7)"
          blinkOffset={7}
          head={interpolate(frame, [55, 75, 95, 150], [0, -4, -4, 6], CL)}
          headY={interpolate(frame, [95, 150], [0, 4], CL)}
          lean={interpolate(frame, [140, 175], [0, 1.2], CL)}
        />
        {/* 机とノートPC（手前） */}
        <div style={{ position: "absolute", left: 360, top: 700, width: 640, height: 30, background: "#2A3550", borderRadius: 6 }} />
        <div style={{ position: "absolute", left: 380, top: 730, width: 600, height: 360, background: "linear-gradient(180deg, #1C253C, #121A2D)" }} />
        <div style={{ position: "absolute", left: 700, top: 560, width: 230, height: 146, background: "#1A2236", border: "6px solid #39445E", borderRadius: 10, transform: "skewX(-6deg)" }}>
          <div style={{ position: "absolute", inset: 8, background: `rgba(90,200,255,${0.55 + 0.08 * Math.sin(frame * 0.1)})`, borderRadius: 4 }} />
        </div>
        {/* 漂う冷たいモヤ */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 200 + i * 300 + Math.sin(frame * 0.02 + i) * 60,
              top: 420 + Math.cos(frame * 0.015 + i) * 40,
              width: 520,
              height: 300,
              borderRadius: "50%",
              background: "radial-gradient(closest-side, rgba(160,180,220,0.10), rgba(160,180,220,0))",
            }}
          />
        ))}
      </Camera>
      <LogoBadge />
      <Telop lines={lines} start={30} />
      <Sfx name="typing" at={15} vol={0.35} />
      <Sfx name="typing" at={95} vol={0.3} />
      <Sfx name="whoosh" at={26} vol={0.4} />
    </AbsoluteFill>
  );
};

// ---------- シーン2：AIが変化に気づく（昼のオフィス） ----------
const RISK = [0.2, 0.22, 0.2, 0.26, 0.24, 0.32, 0.42, 0.55, 0.66, 0.78, 0.86];
const DetectScene: React.FC<{ lines?: string[] }> = ({ lines = ["勤怠やメッセージの変化から、", "AIが孤立のシグナルを早期検出。"] }) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame * 0.08) * 12;
  const rx = interpolate(frame, [0, 30], [-260, 560], { ...CL, easing: Easing.out(Easing.cubic) });
  const mw = walk(frame, 110, 150, 2150, 1720);
  const line = interpolate(frame, [40, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pts = RISK.map((v, i) => `${40 + i * 52},${300 - v * 260}`).join(" ");
  const chips = ["勤怠の乱れ", "発信の減少", "回答の遅れ"];
  return (
    <AbsoluteFill style={{ background: "#DCE9F7" }}>
      <Camera
        keys={[
          { f: 0, x: 600, y: 430, z: 1.7, r: -2 },
          { f: 30, x: 600, y: 430, z: 1.7, r: -2 },
          { f: 85, x: 1110, y: 500, z: 1.45, r: 2 },
          { f: 140, ...WIDE, x: 980 },
          { f: 240, ...WIDE, x: 980, z: 1.04 },
        ]}
      >
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #F2F7FD 0%, #D9E7F6 64%, #C7D6E8 64%, #B9C9DE 100%)" }} />
        {[0, 1, 2, 3].map((w) => (
          <div key={w} style={{ position: "absolute", left: 60 + w * 470, top: 70, width: 420, height: 520, background: "linear-gradient(180deg, #BFE0FA, #EAF5FD)", border: "10px solid #FFFFFF", boxShadow: "0 10px 30px rgba(60,100,160,0.15)" }} />
        ))}
        <div style={{ position: "absolute", left: 140, top: 470, width: 120, height: 220, borderRadius: "60px 60px 10px 10px", background: "#5E9C6E" }} />
        <div style={{ position: "absolute", left: 160, top: 660, width: 80, height: 80, borderRadius: 10, background: "#E4D3BC" }} />

        {/* ロボットからダッシュボードへの光 */}
        <div
          style={{
            position: "absolute",
            left: 640,
            top: 360 + bob,
            width: 360,
            height: 200,
            background: "linear-gradient(90deg, rgba(110,240,255,0.55), rgba(110,240,255,0))",
            clipPath: "polygon(0 45%, 100% 0, 100% 100%, 0 55%)",
            opacity: enter(frame, 32, 18) * (0.7 + 0.3 * Math.sin(frame * 0.2)),
          }}
        />
        <Puppet
          rig={RIGS.robot}
          x={rx}
          floor={560 + bob}
          height={300}
          shadow={false}
          blinkOffset={3}
          lean={interpolate(frame, [0, 30, 42], [14, -6, 0], CL)}
          head={frame > 34 && frame < 74 ? -10 * Math.sin(((frame - 34) / 40) * Math.PI) : 0}
        />
        <div style={{ position: "absolute", left: rx - 90, top: 700, width: 180, height: 26, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(0,0,0,0.22), rgba(0,0,0,0))", scale: `${1 - bob / 80}` }} />

        {/* ホログラムのダッシュボード */}
        <div
          style={{
            position: "absolute",
            left: 900,
            top: 230,
            width: 640,
            height: 460,
            borderRadius: 28,
            background: "linear-gradient(160deg, rgba(120,220,255,0.38), rgba(60,140,255,0.22))",
            border: "3px solid rgba(160,235,255,0.9)",
            boxShadow: "0 0 40px rgba(110,220,255,0.55)",
            opacity: enter(frame, 26, 18),
          }}
        >
          <div style={{ position: "absolute", left: 32, top: 22, fontFamily, fontWeight: 700, fontSize: 34, color: "#0B3B66" }}>
            離職リスクの変化<span style={{ fontSize: 24, marginLeft: 12, color: "#2C5E8A" }}>（イメージ）</span>
          </div>
          <svg width={640} height={340} style={{ position: "absolute", left: 0, top: 70 }}>
            <line x1={40} y1={130} x2={600} y2={130} stroke="#E0605E" strokeWidth={3} strokeDasharray="12 10" />
            <polyline
              points={pts}
              fill="none"
              stroke="#E0605E"
              strokeWidth={8}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - line}
              style={{ filter: "drop-shadow(0 0 10px rgba(255,90,90,0.9))" }}
            />
          </svg>
          <div style={{ position: "absolute", left: 32, bottom: 26, display: "flex", gap: 14 }}>
            {chips.map((c, i) => (
              <div
                key={c}
                style={{
                  fontFamily,
                  fontWeight: 700,
                  fontSize: 30,
                  color: "#0B3B66",
                  background: "rgba(255,255,255,0.85)",
                  borderRadius: 999,
                  padding: "6px 18px",
                  opacity: enter(frame, 70 + i * 10, 12),
                }}
              >
                {c}
              </div>
            ))}
          </div>
        </div>

        {/* 気づく上司 */}
        <Puppet
          rig={RIGS.man}
          x={mw.x}
          floor={1040}
          height={820}
          flip
          bob={mw.bob}
          blinkOffset={20}
          lean={mw.rock + interpolate(frame, [150, 170], [0, 2.5], CL)}
          head={nod(frame, 172, 2, 5)}
        />
      </Camera>
      <LogoBadge />
      <Telop lines={lines} start={60} />
      <Sfx name="bleep" at={10} vol={0.5} />
      <Sfx name="beam" at={20} vol={0.4} />
      <Sfx name="rise" at={40} vol={0.3} />
      <Sfx name="whoosh" at={56} vol={0.4} />
      <Sfx name="pop" at={70} vol={0.45} />
      <Sfx name="pop" at={80} vol={0.45} />
      <Sfx name="pop" at={90} vol={0.45} />
      <Sfx name="alert" at={96} vol={0.5} />
    </AbsoluteFill>
  );
};

// ---------- シーン3：1on1で支える（日の差す会議室） ----------
// SceneSpeed で包むと、演技とカメラがまとめて速く進む（短縮版に使う）
const SupportScene: React.FC<{ lines?: string[]; robot?: boolean }> = ({ lines = ["監視ではなく支援へ。", "データ×対話でつくる強固な組織。"], robot }) => {
  const frame = useSceneFrame();
  const rbob = Math.sin(frame * 0.08) * 8;
  const ww = walk(frame, 0, 48, 330, 690);
  const hop = frame >= 188 && frame < 208 ? -Math.sin((Math.PI * (frame - 188)) / 20) * 16 : 0;
  return (
    <AbsoluteFill style={{ background: "#F6E6CF" }}>
      <Camera
        keys={[
          { f: 0, ...WIDE, z: 1.0, r: -3 },
          { f: 30, ...WIDE, z: 1.0, r: -3 },
          { f: 220, x: 960, y: 500, z: 1.28, r: 2 },
          { f: 240, x: 960, y: 500, z: 1.3, r: 2 },
        ]}
      >
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #FFF4E2 0%, #F4E1C4 63%, #D9BF99 63%, #CDB18A 100%)" }} />
        <div style={{ position: "absolute", left: 1180, top: 60, width: 640, height: 560, background: "linear-gradient(180deg, #FFF9E8, #FFE7B8)", border: "12px solid #FFFFFF" }} />
        {/* 窓からの日差し */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 700 + i * 210,
              top: 0,
              width: 150,
              height: 1200,
              background: "linear-gradient(180deg, rgba(255,240,200,0.45), rgba(255,240,200,0))",
              rotate: "28deg",
              transformOrigin: "top",
              opacity: 0.75 + 0.15 * Math.sin(frame * 0.04 + i),
            }}
          />
        ))}
        <div style={{ position: "absolute", left: 120, top: 420, width: 130, height: 260, borderRadius: "70px 70px 10px 10px", background: "#6FAE7A" }} />
        <div style={{ position: "absolute", left: 140, top: 660, width: 90, height: 90, borderRadius: 10, background: "#E9D5B7" }} />

        {/* 後ろで見守るAI */}
        {robot ? <Puppet rig={RIGS.robot} x={1560} floor={430 + rbob} height={170} shadow={false} blinkOffset={11} head={-6 * Math.sin(frame * 0.03)} /> : null}
        {/* 向かい合うふたり（交互に小さくうなずく） */}
        <Puppet
          rig={RIGS.woman}
          x={ww.x}
          floor={1010}
          height={760}
          bob={ww.bob + hop}
          lean={ww.rock}
          blinkOffset={5}
          head={interpolate(frame, [95, 130], [4, -3], CL) + nod(frame, 135, 2, 4) + (frame > 188 ? interpolate(frame, [188, 200], [0, -3], CL) : 0)}
        />
        <Puppet
          rig={RIGS.man}
          x={1240}
          floor={1030}
          height={800}
          flip
          blinkOffset={31}
          lean={interpolate(frame, [50, 80], [0, 2], CL)}
          head={nod(frame, 60, 2, 5) + nod(frame, 155, 2, 5)}
        />
        {/* 丸テーブル（手前） */}
        <div style={{ position: "absolute", left: 720, top: 720, width: 480, height: 90, borderRadius: "50%", background: "#B98B5E", boxShadow: "0 18px 30px rgba(120,80,40,0.25)" }} />
        <div style={{ position: "absolute", left: 935, top: 770, width: 50, height: 300, background: "#9C7248" }} />
        {/* 温かい光 */}
        <AbsoluteFill style={{ background: "radial-gradient(circle at 70% 25%, rgba(255,214,140,0.35), rgba(255,214,140,0) 55%)" }} />
      </Camera>
      <LogoBadge />
      <Telop lines={lines} start={50} />
      <Sfx name="chime" at={8} vol={0.5} />
      <Sfx name="whoosh" at={46} vol={0.4} />
    </AbsoluteFill>
  );
};

export const HrdxVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  const t = linearTiming({ durationInFrames: 15 });
  return (
    <>
      <Audio name="音楽" src={staticFile("hrdx/audio/score.wav")} volume={0.5} premountFor={fps} />
      <TransitionSeries>
        <TransitionSeries.Sequence name="01 静かな退職" durationInFrames={210} premountFor={fps}>
          <QuietScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="02 AIが気づく" durationInFrames={240} premountFor={fps}>
          <DetectScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="03 1on1で支える" durationInFrames={240} premountFor={fps}>
          <SupportScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="04 締め・QR" durationInFrames={150} premountFor={fps}>
          <OutroScene
            quick
            message={
              <span style={{ fontSize: 66, fontWeight: 900 }}>
                AIは「監視」ではなく<span style={{ color: C.blue }}>「支援」</span>のために。
              </span>
            }
          />
          <Sfx name="success" at={4} vol={0.5} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </>
  );
};

export { QuietScene, DetectScene, SupportScene };

// ================= 絵コンテ版（主役＝AI活用／経営者向け／最後に無料相談） =================

// つかみ：夜の社長室。机の「退職届」に寄ってから、うなだれる社長へ引く
const CeoHookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const slide = interpolate(frame, [0, 10], [260, 0], { ...CL, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ background: "#120E14" }}>
      <Camera
        keys={[
          { f: 0, x: 1080, y: 640, z: 2.3, r: 2 },
          { f: 35, x: 1080, y: 640, z: 2.3, r: 2 },
          { f: 80, x: 900, y: 520, z: 1.05, r: -1 },
          { f: 165, x: 880, y: 520, z: 1.12, r: -1 },
        ]}
      >
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #1B1520 0%, #2A1F28 66%, #150F14 66%, #0E0A0D 100%)" }} />
        {/* 本棚 */}
        {[0, 1, 2].map((r) => (
          <div key={r} style={{ position: "absolute", left: 120, top: 150 + r * 170, width: 520, height: 14, background: "#3B2B26" }}>
            {Array.from({ length: 11 }).map((_, b) => (
              <div
                key={b}
                style={{
                  position: "absolute",
                  left: 10 + b * 46,
                  bottom: 14,
                  width: 36,
                  height: 90 + random(`bk${r}-${b}`) * 50,
                  background: ["#4A3540", "#3C3A52", "#5A4636", "#33404A"][b % 4],
                  opacity: 0.8,
                }}
              />
            ))}
          </div>
        ))}
        {/* デスクライトの光 */}
        <div style={{ position: "absolute", left: 820, top: 280, width: 900, height: 700, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(255,190,110,0.32), rgba(255,190,110,0))" }} />
        {/* 社長：机の上を見つめてうなだれる */}
        <Puppet
          rig={RIGS.man}
          x={880}
          floor={1010}
          height={760}
          filter="brightness(0.85) sepia(0.15)"
          blinkOffset={9}
          head={interpolate(frame, [40, 75], [0, 8], CL)}
          headY={interpolate(frame, [40, 75], [0, 4], CL)}
          lean={interpolate(frame, [70, 110], [0, 1.5], CL)}
        />
        {/* 机 */}
        <div style={{ position: "absolute", left: 380, top: 700, width: 1180, height: 34, background: "#4A3326", borderRadius: 6 }} />
        <div style={{ position: "absolute", left: 400, top: 734, width: 1140, height: 360, background: "linear-gradient(180deg, #3A2820, #24180F)" }} />
        {/* デスクライト */}
        <div style={{ position: "absolute", left: 1400, top: 470, width: 14, height: 230, background: "#2A2A2E" }} />
        <div style={{ position: "absolute", left: 1330, top: 440, width: 160, height: 60, background: "#2E2E34", borderRadius: "80px 80px 10px 10px" }} />
        {/* 退職届（机に置かれる） */}
        <div
          style={{
            position: "absolute",
            left: 1000 + slide,
            top: 520,
            width: 150,
            height: 230,
            background: "#FAF7F0",
            boxShadow: "0 18px 26px rgba(0,0,0,0.45)",
            transform: "perspective(900px) rotateX(38deg) rotate(-8deg)",
            transformOrigin: "50% 100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ writingMode: "vertical-rl", fontFamily, fontWeight: 900, fontSize: 54, color: "#1A1A1A", letterSpacing: "0.2em" }}>退職届</span>
        </div>
      </Camera>
      <LogoBadge />
      <Telop lines={["「辞めるなんて、思わなかった」", "そんな経験、ありませんか？"]} start={55} />
      <Sfx name="paper" at={9} vol={0.6} />
      <Sfx name="whoosh" at={51} vol={0.35} />
    </AbsoluteFill>
  );
};

export const HrdxStoryVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  const t = linearTiming({ durationInFrames: 15 });
  return (
    <>
      <Audio name="音楽" src={staticFile("hrdx/audio/score-v2.wav")} volume={0.5} premountFor={fps} />
      <TransitionSeries>
        <TransitionSeries.Sequence name="00 つかみ：退職届" durationInFrames={165} premountFor={fps}>
          <CeoHookScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="01 共感：静かな退職" durationInFrames={195} premountFor={fps}>
          <QuietScene lines={["不満は口にせず、静かに心が離れていく。", "それが『静かな退職』です。"]} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="02 主役：AIが兆しに気づく" durationInFrames={240} premountFor={fps}>
          <DetectScene lines={["AIなら、勤怠やチャットの", "小さな変化から『兆し』に気づけます。"]} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="03 解決：対話で間に合う" durationInFrames={180} premountFor={fps}>
          <SceneSpeed speed={4 / 3}>
            <SupportScene robot lines={["気づけば、対話で間に合う。", "AI活用で解決できることもあります。"]} />
          </SceneSpeed>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="04 無料相談" durationInFrames={105} premountFor={fps}>
          <OutroScene
            quick
            lead={["同じ悩みをお持ちの", "経営者の方は"]}
            message={
              <span style={{ fontSize: 76, fontWeight: 900 }}>
                まずは、<span style={{ color: C.blue }}>無料相談</span>から。
              </span>
            }
          />
          <Sfx name="success" at={4} vol={0.5} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </>
  );
};

export { CeoHookScene };
