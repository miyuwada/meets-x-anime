import type React from "react";
import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, enter, WIDE } from "../glass/ui";
import { OutroScene } from "../scenes/OutroScene";
import { C, fontFamily } from "../theme";

// コラム「AIで可視化する倉庫内『歩行ロス』削減と動線最適化の急務」ピクトグラム版（約26秒）
// 倉庫を上から見た図の上を、ピクトグラムの作業員が歩く。数字はコラムに根拠がないため使わない

const P = {
  bg: "#EEF1F5",
  floor: "#FFFFFF",
  ink: "#17274D",
  rack: "#C9D2DE",
  bin: "#DCE3EC",
  hot: "#F28C28",
  good: "#13A39B",
  bad: "#E0605E",
  grey: "#9AA6B6",
};
const CL = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// ---------- 倉庫のレイアウト（1920x1080 の上） ----------
const RACKS = [520, 820, 1120, 1420]; // 棚の左端 x（幅120、y 280〜820）
const RACK_W = 120;
const RACK_TOP = 280;
const RACK_H = 540;
const PACK = { x: 210, y: 540 }; // 梱包台
// よく出る商品（はじめは奥の棚に置かれている）
const HOT_FAR = [
  { x: 1480, y: 334 },
  { x: 1180, y: 766 },
  { x: 1480, y: 658 },
];
// 置き直したあと（梱包台にいちばん近い棚）
const HOT_NEAR = [
  { x: 580, y: 442 },
  { x: 580, y: 550 },
  { x: 580, y: 658 },
];
type Pt = [number, number];
const LONG_PATH: Pt[] = [
  [300, 540], [460, 540], [460, 870], [1360, 870], [1360, 766], [1360, 870], [1600, 870],
  [1600, 334], [1600, 220], [760, 220], [760, 870], [300, 870], [300, 540],
];
const SHORT_PATH: Pt[] = [[300, 540], [460, 540], [460, 442], [460, 658], [460, 540], [300, 540]];

const pathLen = (pts: Pt[]) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
// 道のりの割合 t（0〜1）の位置と、進む向き
const pointAt = (pts: Pt[], t: number) => {
  let d = pathLen(pts) * Math.min(1, Math.max(0, t));
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1], [bx, by] = pts[i];
    const seg = Math.hypot(bx - ax, by - ay);
    if (d <= seg || i === pts.length - 1) {
      const k = seg ? Math.min(1, d / seg) : 0;
      return { x: ax + (bx - ax) * k, y: ay + (by - ay) * k, dx: bx - ax };
    }
    d -= seg;
  }
  return { x: pts[0][0], y: pts[0][1], dx: 1 };
};
const toPoints = (pts: Pt[]) => pts.map((p) => p.join(",")).join(" ");

// ---------- ピクトグラム ----------
// 作業員（横向きの人型）。walk で手足を振る
const Worker: React.FC<{ x: number; y: number; size?: number; walk: number; flip?: boolean; color?: string }> = ({
  x, y, size = 1, walk, flip, color = P.ink,
}) => {
  const sw = Math.sin(walk) * 26;
  const limb = (cx: number, cy: number, len: number, deg: number, w: number) => (
    <line
      x1={cx}
      y1={cy}
      x2={cx + Math.sin((deg * Math.PI) / 180) * len}
      y2={cy + Math.cos((deg * Math.PI) / 180) * len}
      stroke={color}
      strokeWidth={w}
      strokeLinecap="round"
    />
  );
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -size : size},${size}) translate(0,-46)`}>
      <circle cx={2} cy={-34} r={11} fill={color} />
      {limb(0, -16, 22, sw, 11)}
      {limb(0, -16, 22, -sw, 11)}
      <line x1={0} y1={-18} x2={0} y2={10} stroke={color} strokeWidth={15} strokeLinecap="round" />
      {limb(0, 10, 30, -sw * 1.1, 12)}
      {limb(0, 10, 30, sw * 1.1, 12)}
    </g>
  );
};

// 商品の箱
const Box: React.FC<{ x: number; y: number; color: string; s?: number }> = ({ x, y, color, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-30} y={-24} width={60} height={48} rx={6} fill={color} />
    <rect x={-6} y={-24} width={12} height={20} fill="#FFFFFF" opacity={0.55} />
  </g>
);

// 倉庫の床・棚・梱包台
const Floor: React.FC<{ hotAt?: { x: number; y: number }[]; hotPulse?: number }> = ({ hotAt = HOT_FAR, hotPulse = 0 }) => (
  <>
    <rect x={150} y={180} width={1620} height={740} rx={24} fill={P.floor} stroke="#D5DCE6" strokeWidth={4} />
    {RACKS.map((rx) => (
      <g key={rx}>
        <rect x={rx} y={RACK_TOP} width={RACK_W} height={RACK_H} rx={10} fill={P.rack} />
        {Array.from({ length: 5 }).map((_, i) => (
          <rect key={i} x={rx + 12} y={RACK_TOP + 14 + i * 108} width={RACK_W - 24} height={88} rx={6} fill={P.bin} />
        ))}
      </g>
    ))}
    {/* 梱包台 */}
    <rect x={PACK.x - 50} y={PACK.y - 90} width={100} height={180} rx={12} fill={P.ink} />
    <rect x={PACK.x - 30} y={PACK.y - 26} width={60} height={52} rx={6} fill="#FFFFFF" opacity={0.85} />
    {hotAt.map((h, i) => (
      <Box key={i} x={h.x} y={h.y} color={P.hot} s={1 + hotPulse * 0.12 * Math.max(0, Math.sin(i))} />
    ))}
  </>
);

// 描き進める線（実線）
const DrawLine: React.FC<{ pts: Pt[]; progress: number; color: string; width?: number; opacity?: number }> = ({
  pts, progress, color, width = 10, opacity = 1,
}) => (
  <polyline
    points={toPoints(pts)}
    fill="none"
    stroke={color}
    strokeWidth={width}
    strokeLinecap="round"
    strokeLinejoin="round"
    pathLength={1}
    strokeDasharray={1}
    strokeDashoffset={1 - progress}
    opacity={opacity}
  />
);

// ---------- 画面の文字 ----------
const Telop: React.FC<{ lines: string[]; start: number }> = ({ lines, start }) => {
  const frame = useCurrentFrame();
  const p = enter(frame, start, 14);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 46, display: "flex", justifyContent: "center", opacity: p, translate: `0px ${(1 - p) * 20}px` }}>
      <div style={{ background: "rgba(23,39,77,0.92)", borderRadius: 20, padding: "16px 48px", fontFamily, fontWeight: 700, fontSize: 54, lineHeight: 1.45, color: "#FFFFFF", textAlign: "center" }}>
        {lines.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
    </div>
  );
};

const StepChip: React.FC<{ step: string; label: string }> = ({ step, label }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top: 38, right: 44, display: "flex", alignItems: "center", gap: 14, opacity: enter(frame, 0, 12), fontFamily }}>
      <span style={{ background: P.ink, color: "#FFFFFF", fontWeight: 900, fontSize: 28, borderRadius: 8, padding: "4px 14px" }}>{step}</span>
      <span style={{ color: P.ink, fontWeight: 700, fontSize: 34 }}>{label}</span>
    </div>
  );
};

const LogoBadge: React.FC = () => (
  <div style={{ position: "absolute", top: 34, left: 40, background: "rgba(255,255,255,0.95)", borderRadius: 14, padding: "10px 18px" }}>
    <Img src={staticFile("meets_logo_navy.png")} style={{ width: 210, display: "block" }} />
  </div>
);

const Sfx: React.FC<{ name: string; at: number; vol: number }> = ({ name, at, vol }) => {
  const { fps } = useVideoConfig();
  return <Audio name={`効果音 ${name}`} src={staticFile(`hrdx/audio/${name}.wav`)} from={at} volume={vol} premountFor={fps} />;
};

// ラベルの吹き出し（ピクトグラムの近くに出す）
const Tag: React.FC<{ x: number; y: number; start: number; end?: number; color: string; children: React.ReactNode }> = ({ x, y, start, end, color, children }) => {
  const frame = useCurrentFrame();
  const p = enter(frame, start, 12) * (end ? 1 - enter(frame, end, 10) : 1);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: `-50% ${(1 - p) * 16}px`,
        opacity: p,
        background: color,
        color: "#FFFFFF",
        fontFamily,
        fontWeight: 900,
        fontSize: 40,
        borderRadius: 14,
        padding: "8px 24px",
        whiteSpace: "nowrap",
        boxShadow: "0 10px 24px rgba(23,39,77,0.18)",
      }}
    >
      {children}
    </div>
  );
};

// ---------- シーン1：歩いてばかり ----------
const WalkScene: React.FC = () => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [6, 150], [0, 1], { ...CL, easing: Easing.inOut(Easing.sin) });
  const w = pointAt(LONG_PATH, t);
  // カメラ：作業員を追いかけてから、引いて歩いた道のり全体を見せる
  const wide = interpolate(frame, [70, 115], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const z = 1.75 - 0.75 * wide;
  const cx = w.x + (960 - w.x) * wide;
  const cy = w.y + (550 - w.y) * wide;
  return (
    <AbsoluteFill style={{ background: P.bg }}>
      <AbsoluteFill style={{ transformOrigin: "0 0", transform: `translate(${960 - cx * z}px, ${540 - cy * z}px) scale(${z})` }}>
        <svg width={1920} height={1080}>
          <Floor />
          <DrawLine pts={LONG_PATH} progress={t} color={P.bad} width={9} opacity={0.75} />
          <Worker x={w.x} y={w.y} size={1.5} walk={frame * 0.45} flip={w.dx < 0} />
        </svg>
      </AbsoluteFill>
      <LogoBadge />
      <StepChip step="01" label="現場のなやみ" />
      <Telop lines={["ピッキングの時間、", "じつは“歩く”ことに使っていませんか？"]} start={60} />
      <Sfx name="steps" at={6} vol={0.35} />
    </AbsoluteFill>
  );
};

// ---------- シーン2：よく出る商品が奥にある ----------
const FarScene: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.18);
  return (
    <AbsoluteFill style={{ background: P.bg }}>
      <Camera
        keys={[
          { f: 0, ...WIDE },
          { f: 20, ...WIDE },
          { f: 60, x: 1340, y: 560, z: 1.3, r: 2 },
          { f: 110, x: 1340, y: 560, z: 1.3, r: 2 },
          { f: 145, ...WIDE },
          { f: 180, ...WIDE, z: 1.02 },
        ]}
      >
        <svg width={1920} height={1080}>
          <Floor hotPulse={pulse} />
          <DrawLine pts={LONG_PATH} progress={1} color={P.grey} width={8} opacity={0.5} />
          {HOT_FAR.map((h, i) => (
            <circle key={i} cx={h.x} cy={h.y} r={48 + 10 * pulse} fill="none" stroke={P.hot} strokeWidth={5} opacity={enter(frame, 20 + i * 6, 10)} />
          ))}
          <Worker x={300} y={540} size={1.5} walk={0} />
        </svg>
        <Tag x={1480} y={200} start={40} color={P.hot}>よく出る商品</Tag>
        <Tag x={300} y={400} start={100} color={P.ink}>梱包場所</Tag>
      </Camera>
      <LogoBadge />
      <StepChip step="02" label="原因" />
      <Telop lines={["よく出る商品ほど、", "なぜか棚の奥にある。"]} start={70} />
    </AbsoluteFill>
  );
};

// ---------- シーン3：AIカメラで見える化 ----------
const HEAT = [
  { x: 460, y: 870, r: 150, a: 0.55 },
  { x: 1360, y: 870, r: 170, a: 0.65 },
  { x: 1600, y: 600, r: 130, a: 0.45 },
  { x: 760, y: 220, r: 140, a: 0.5 },
];
const CROSS = [
  { x: 1360, y: 870 },
  { x: 760, y: 870 },
];
const AiScene: React.FC = () => {
  const frame = useCurrentFrame();
  const sweep = Math.sin(frame * 0.05) * 22;
  return (
    <AbsoluteFill style={{ background: P.bg }}>
      <Camera
        keys={[
          { f: 0, ...WIDE },
          { f: 30, ...WIDE },
          { f: 80, x: 1180, y: 760, z: 1.5, r: -2 },
          { f: 125, x: 1180, y: 760, z: 1.5, r: -2 },
          { f: 160, ...WIDE },
          { f: 180, ...WIDE, z: 1.02 },
        ]}
      >
        <svg width={1920} height={1080}>
          <defs>
            <radialGradient id="heat">
              <stop offset="0%" stopColor="#E0412E" stopOpacity={1} />
              <stop offset="45%" stopColor="#F28C28" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#F2C94C" stopOpacity={0} />
            </radialGradient>
          </defs>
          <Floor />
          <DrawLine pts={LONG_PATH} progress={1} color={P.grey} width={8} opacity={0.4} />
          {/* ヒートマップ */}
          {HEAT.map((h, i) => (
            <circle key={i} cx={h.x} cy={h.y} r={h.r} fill="url(#heat)" opacity={h.a * enter(frame, 30 + i * 8, 20)} />
          ))}
          {/* 交差・逆走の地点 */}
          {CROSS.map((c, i) => {
            const p = enter(frame, 90 + i * 10, 10);
            return (
              <g key={i} transform={`translate(${c.x},${c.y}) scale(${p})`}>
                <circle r={34} fill={P.bad} />
                <path d="M-14,-14 L14,14 M14,-14 L-14,14" stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" />
              </g>
            );
          })}
          {/* AIカメラ */}
          <g transform="translate(1700,160)" opacity={enter(frame, 4, 12)}>
            <polygon points={`0,0 ${-420 + sweep * 4},560 ${-120 + sweep * 4},620`} fill="#13A39B" opacity={0.12} />
            <rect x={-46} y={-30} width={92} height={60} rx={14} fill={P.ink} />
            <circle cx={0} cy={0} r={18} fill={P.good} />
            <circle cx={0} cy={0} r={8} fill="#FFFFFF" />
          </g>
        </svg>
        <Tag x={1700} y={225} start={10} color={P.good}>AIカメラ</Tag>
        <Tag x={1180} y={770} start={100} color={P.bad}>交差・逆走</Tag>
      </Camera>
      <LogoBadge />
      <StepChip step="03" label="AIで見える化" />
      <Telop lines={["AIカメラで動線を見える化。", "ムダな移動がひと目でわかる。"]} start={44} />
      <Sfx name="bleep" at={6} vol={0.45} />
      <Sfx name="pop" at={90} vol={0.45} />
      <Sfx name="pop" at={100} vol={0.45} />
    </AbsoluteFill>
  );
};

// ---------- シーン4：手前に置き直して、最短ルートへ ----------
const OptimizeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const move = interpolate(frame, [18, 60], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const hot = HOT_FAR.map((f, i) => ({ x: f.x + (HOT_NEAR[i].x - f.x) * move, y: f.y + (HOT_NEAR[i].y - f.y) * move - Math.sin(move * Math.PI) * 120 }));
  const draw = interpolate(frame, [68, 100], [0, 1], CL);
  const t = interpolate(frame, [104, 168], [0, 1], { ...CL, easing: Easing.inOut(Easing.sin) });
  const w = pointAt(SHORT_PATH, t);
  return (
    <AbsoluteFill style={{ background: P.bg }}>
      <Camera
        keys={[
          { f: 0, ...WIDE },
          { f: 64, ...WIDE },
          { f: 104, x: 470, y: 520, z: 1.5, r: -2 },
          { f: 180, x: 470, y: 520, z: 1.5, r: -2 },
          { f: 210, x: 480, y: 520, z: 1.53, r: -2 },
        ]}
      >
        <svg width={1920} height={1080}>
          <Floor hotAt={hot} />
          <DrawLine pts={LONG_PATH} progress={1} color={P.grey} width={8} opacity={0.35 * (1 - draw * 0.6)} />
          <DrawLine pts={SHORT_PATH} progress={draw} color={P.good} width={12} />
          <Worker x={w.x} y={w.y} size={1.5} walk={frame > 104 && frame < 168 ? frame * 0.45 : 0} flip={w.dx < 0} color={P.ink} />
        </svg>
        <Tag x={580} y={340} start={60} end={138} color={P.hot}>手前に置き直し</Tag>
        <Tag x={460} y={278} start={150} color={P.good}>歩く距離が短く！</Tag>
      </Camera>
      <LogoBadge />
      <StepChip step="04" label="動線を最適化" />
      <Telop lines={["よく出る商品を手前に。", "AIが最短ルートを提案。"]} start={30} />
      <Sfx name="whoosh" at={18} vol={0.4} />
      <Sfx name="rise" at={68} vol={0.25} />
      <Sfx name="steps" at={104} vol={0.3} />
      <Sfx name="chime" at={150} vol={0.45} />
    </AbsoluteFill>
  );
};

export const WarehouseVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  const t = linearTiming({ durationInFrames: 15 });
  return (
    <>
      <Audio name="音楽" src={staticFile("hrdx/audio/score-warehouse.wav")} volume={0.45} premountFor={fps} />
      <TransitionSeries>
        <TransitionSeries.Sequence name="01 歩いてばかり" durationInFrames={165} premountFor={fps}>
          <WalkScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="02 奥にある" durationInFrames={180} premountFor={fps}>
          <FarScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="03 AIで見える化" durationInFrames={180} premountFor={fps}>
          <AiScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="04 最短ルート" durationInFrames={210} premountFor={fps}>
          <OptimizeScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="05 無料相談" durationInFrames={105} premountFor={fps}>
          <OutroScene
            quick
            lead={["倉庫の“歩くムダ”に", "お悩みの方は"]}
            message={
              <span style={{ fontSize: 72, fontWeight: 900 }}>
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

export { WalkScene, FarScene, AiScene, OptimizeScene };
