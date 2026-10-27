import type React from "react";
import { createContext, useContext } from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { fontFamily as jpFont } from "../theme";

const { fontFamily: latinFont } = loadMontserrat("normal", { weights: ["600", "700"] });
export { jpFont, latinFont };

// 参考動画の雰囲気（すりガラス・ライムの差し色）を、青みの背景で
export const G = {
  bg1: "#F3F7FD",
  bg2: "#D8E6F8",
  lime: "#C8F135",
  ink: "#15151C",
  sub: "#6E6A80",
  line: "#D3DEEE",
  card: "rgba(255,255,255,0.92)",
  shadow: "0 30px 70px rgba(40,90,170,0.18)",
};

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// シーンの再生速度（1=通常、1.3=約1.3倍速で動きが進む）。短縮版で使う
const SpeedContext = createContext(1);
export const SceneSpeed: React.FC<{ speed: number; children: React.ReactNode }> = ({ speed, children }) => (
  <SpeedContext.Provider value={speed}>{children}</SpeedContext.Provider>
);
export const useSceneFrame = () => useCurrentFrame() * useContext(SpeedContext);

// start から dur フレームで 0→1（跳ねない）
export const enter = (frame: number, start: number, dur = 16) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

// 背景：グラデーション＋奥でぼやけたガラス板（ゆっくり流れる）
export const GlassBg: React.FC = () => {
  const frame = useSceneFrame();
  const drift = frame * 0.25;
  const slabs = [
    { x: -120, w: 380, o: 0.35 },
    { x: 420, w: 260, o: 0.25 },
    { x: 1080, w: 320, o: 0.3 },
    { x: 1560, w: 420, o: 0.35 },
  ];
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${G.bg1} 0%, ${G.bg2} 100%)`, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 1200,
          top: -200,
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,241,53,0.18), rgba(200,241,53,0) 65%)",
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -300,
          top: 500,
          width: 1000,
          height: 900,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(90,160,240,0.35), rgba(90,160,240,0) 65%)",
          filter: "blur(40px)",
        }}
      />
      {slabs.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: s.x - drift,
            top: 120,
            width: s.w,
            height: 900,
            borderRadius: 28,
            background: `linear-gradient(180deg, rgba(255,255,255,${s.o}), rgba(255,255,255,0.05))`,
            border: "2px solid rgba(255,255,255,0.5)",
            filter: "blur(6px)",
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// 上部：左に会社ロゴ、中央に章ラベル、右に種別
export const TopLabels: React.FC<{ section: string }> = ({ section }) => {
  const frame = useSceneFrame();
  const o = enter(frame, 0, 12);
  const style: React.CSSProperties = {
    position: "absolute",
    top: 44,
    fontFamily: latinFont,
    fontWeight: 700,
    fontSize: 26,
    letterSpacing: "0.32em",
    color: "#2E3A55",
    opacity: o,
  };
  return (
    <>
      <Img src={staticFile("meets_logo_navy.png")} style={{ position: "absolute", top: 34, left: 56, width: 230, opacity: o }} />
      <div style={{ ...style, left: 0, right: 0, textAlign: "center", color: "#7F8BA3" }}>{section}</div>
      <div style={{ ...style, right: 56, fontFamily: jpFont, letterSpacing: "0.05em", fontWeight: 700 }}>コラム紹介</div>
    </>
  );
};

// 左から右へ現れる文字（現れたあとは静止）
export const Reveal: React.FC<{
  children: React.ReactNode;
  start: number;
  style?: React.CSSProperties;
}> = ({ children, start, style }) => {
  const frame = useSceneFrame();
  const p = enter(frame, start, 18);
  return (
    <div
      style={{
        fontFamily: jpFont,
        fontWeight: 900,
        color: G.ink,
        clipPath: `inset(-20% ${(1 - p) * 100}% -20% 0)`,
        filter: `blur(${(1 - p) * 6}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// すりガラスのカード：ぼけた状態から、すっとピントが合って現れる
export const Card: React.FC<{
  start: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ start, style, children }) => {
  const frame = useSceneFrame();
  const p = enter(frame, start, 18);
  return (
    <div
      style={{
        position: "absolute",
        background: G.card,
        borderRadius: 36,
        border: "2px solid rgba(255,255,255,0.9)",
        boxShadow: G.shadow,
        opacity: p,
        translate: `0px ${(1 - p) * 40}px`,
        filter: `blur(${(1 - p) * 10}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const LimeChip: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <span
    style={{
      display: "inline-block",
      background: G.lime,
      color: G.ink,
      borderRadius: 16,
      padding: "4px 18px",
      fontFamily: latinFont,
      fontWeight: 700,
      ...style,
    }}
  >
    {children}
  </span>
);

export const ImageNote: React.FC = () => (
  <div style={{ position: "absolute", left: 56, bottom: 36, fontFamily: jpFont, fontSize: 30, color: G.sub }}>画面は再現イメージ</div>
);

// 文字を1文字ずつ（チャットの入力風）
export const typed = (text: string, frame: number, start: number, perChar = 1) => {
  const chars = Array.from(text);
  const n = Math.max(0, Math.min(chars.length, Math.floor((frame - start) / perChar)));
  return chars.slice(0, n).join("");
};

// カメラワーク：キーフレームで「どこを・どれだけ寄って」映すかを指定する
// f=シーン内フレーム, x/y=画面の中心に置く座標（1920x1080基準）, z=寄り具合（1=全体）, r=回り込み角度
export type CamKey = { f: number; x: number; y: number; z: number; r?: number };

// 今のカメラの寄り具合（見出しのフェードに使う）
const ZoomContext = createContext(1);

// シーンの見出し：カメラが寄っている間は消え、引きの画角のときだけ見える（端で切れて見えないように）
export const SceneTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const z = useContext(ZoomContext);
  const o = interpolate(z, [1.08, 1.2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ position: "absolute", left: 120, top: 160, opacity: o }}>{children}</div>;
};
export const WIDE = { x: 960, y: 540, z: 1 };

export const Camera: React.FC<{ keys: CamKey[]; children: React.ReactNode }> = ({ keys, children }) => {
  const frame = useSceneFrame();
  const fs = keys.map((k) => k.f);
  const opt = {
    extrapolateLeft: "clamp" as const,
    extrapolateRight: "clamp" as const,
    easing: Easing.inOut(Easing.cubic),
  };
  const z = interpolate(frame, fs, keys.map((k) => k.z), opt);
  const x = interpolate(frame, fs, keys.map((k) => k.x), opt);
  const y = interpolate(frame, fs, keys.map((k) => k.y), opt);
  const r = interpolate(frame, fs, keys.map((k) => k.r ?? 0), opt);
  return (
    <AbsoluteFill style={{ perspective: 2400 }}>
      <AbsoluteFill style={{ transform: `rotateY(${r}deg)`, transformStyle: "preserve-3d" }}>
        <AbsoluteFill style={{ transformOrigin: "0 0", transform: `translate(${960 - x * z}px, ${540 - y * z}px) scale(${z})` }}>
          <ZoomContext.Provider value={z}>{children}</ZoomContext.Provider>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
