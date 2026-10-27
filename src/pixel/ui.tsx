import type React from "react";
import { Easing, interpolate, random, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C } from "../theme";
import { pixelFont } from "./Sprite";

// 画面の揺れ（start から dur フレーム、だんだん弱まる）
export const shake = (frame: number, start: number, dur = 12, power = 18) => {
  const t = frame - start;
  if (t < 0 || t > dur) return "0px 0px";
  const k = power * (1 - t / dur);
  return `${Math.round((random(`sx${t}`) - 0.5) * 2 * k)}px ${Math.round((random(`sy${t}`) - 0.5) * 2 * k)}px`;
};

// 文字を1文字ずつ表示
export const typed = (text: string, frame: number, start: number, perChar = 0.6) => {
  const chars = Array.from(text);
  const n = Math.max(0, Math.min(chars.length, Math.floor((frame - start) / perChar)));
  return chars.slice(0, n).join("");
};

// RPG風メッセージウィンドウ（下部）
export const RpgBox: React.FC<{ text: string; start: number; speaker?: string }> = ({ text, start, speaker }) => {
  const frame = useCurrentFrame();
  const open = interpolate(frame, [start - 8, start], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const shown = typed(text, frame, start);
  const done = shown.length === Array.from(text).length;
  return (
    <div
      style={{
        position: "absolute",
        left: 110,
        right: 110,
        bottom: 44,
        height: 190,
        background: C.navy,
        border: "8px solid #FFFFFF",
        outline: `6px solid ${C.navy}`,
        borderRadius: 8,
        padding: "34px 50px",
        boxSizing: "border-box",
        fontFamily: pixelFont,
        fontSize: 68,
        color: C.white,
        scale: `1 ${open}`,
        opacity: open > 0 ? 1 : 0,
      }}
    >
      {speaker ? (
        <div
          style={{
            position: "absolute",
            top: -40,
            left: 30,
            background: C.gold,
            color: C.navy,
            fontSize: 30,
            padding: "4px 18px",
            border: `5px solid ${C.navy}`,
          }}
        >
          {speaker}
        </div>
      ) : null}
      {shown}
      {done && Math.floor(frame / 8) % 2 === 0 ? (
        <span style={{ position: "absolute", right: 34, bottom: 18, color: C.gold, fontSize: 34 }}>▼</span>
      ) : null}
    </div>
  );
};

// 見出し：すっと浮かび上がって、そのまま静止（跳ねない）
export const SlamTitle: React.FC<{
  children: React.ReactNode;
  start: number;
  top?: number;
  size?: number;
  color?: string;
}> = ({ children, start, top = 60, size = 104, color = C.white }) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [start, start + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: pixelFont,
        fontSize: size,
        color,
        textShadow: `6px 6px 0 ${C.navy}, -3px -3px 0 ${C.navy}, 3px -3px 0 ${C.navy}, -3px 3px 0 ${C.navy}`,
        opacity: s,
        translate: `0px ${(1 - s) * 24}px`,
      }}
    >
      {children}
    </div>
  );
};

// ドットのタグ（ポンッと出る）
export const PixelTag: React.FC<{ label: string; start: number; x: number; y: number; color: string }> = ({
  label,
  start,
  x,
  y,
  color,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - start, fps, config: { damping: 200 }, durationInFrames: 10 });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        fontFamily: pixelFont,
        fontSize: 56,
        background: color,
        color: C.navy,
        padding: "8px 22px",
        border: `5px solid ${C.navy}`,
        boxShadow: `6px 6px 0 ${C.navy}`,
        opacity: s,
        translate: `0px ${(1 - s) * 16}px`,
        whiteSpace: "nowrap",
      }}
    >
      # {label}
    </div>
  );
};

// ドットの火花（バースト）
export const PixelBurst: React.FC<{ x: number; y: number; start: number; color?: string; count?: number }> = ({
  x,
  y,
  start,
  color = C.gold,
  count = 12,
}) => {
  const frame = useCurrentFrame();
  const t = frame - start;
  if (t < 0 || t > 20) return null;
  return (
    <g shapeRendering="crispEdges">
      {Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * Math.PI * 2;
        const d = 20 + t * 9;
        const size = 14 * (1 - t / 20) + 4;
        return (
          <rect
            key={i}
            x={Math.round((x + Math.cos(a) * d) / 6) * 6}
            y={Math.round((y + Math.sin(a) * d) / 6) * 6}
            width={size}
            height={size}
            fill={i % 2 ? color : C.white}
          />
        );
      })}
    </g>
  );
};

// ドット風の背景（チェック柄＋静止した星）
export const PixelBg: React.FC<{ base: string; dot: string; stars?: boolean }> = ({ base, dot, stars }) => {
  return (
    <svg width={1920} height={1080} style={{ position: "absolute" }} shapeRendering="crispEdges">
      <rect width={1920} height={1080} fill={base} />
      {Array.from({ length: 16 }).map((_, r) =>
        Array.from({ length: 28 }).map((__, c) =>
          (r + c) % 2 === 0 ? <rect key={`${r}-${c}`} x={c * 72} y={r * 72} width={72} height={72} fill={dot} /> : null,
        ),
      )}
      {stars
        ? Array.from({ length: 30 }).map((_, i) => (
            <rect
              key={i}
              x={Math.round((random(`px${i}`) * 1920) / 6) * 6}
              y={Math.round((random(`py${i}`) * 1080) / 6) * 6}
              width={6 + (i % 3) * 3}
              height={6 + (i % 3) * 3}
              fill={i % 4 === 0 ? C.gold : C.white}
              opacity={0.6}
            />
          ))
        : null}
    </svg>
  );
};
