import type React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { C } from "../theme";

// パステルのグラデーション背景＋ふわふわ浮かぶ玉ボケ
export const CuteBg: React.FC<{ top: string; bottom: string }> = ({ top, bottom }) => {
  const frame = useCurrentFrame();
  const colors = ["#FFC9D6", "#BDE3FF", "#FFE6A8", "#D9CCFF"];
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${top}, ${bottom})` }}>
      <svg width={1920} height={1080}>
        {Array.from({ length: 12 }).map((_, i) => (
          <circle
            key={i}
            cx={random(`bx${i}`) * 1920}
            cy={random(`by${i}`) * 1080 + Math.sin(frame * 0.04 + i) * 18}
            r={20 + random(`br${i}`) * 50}
            fill={colors[i % 4]}
            opacity={0.35}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

// キラキラ（4点星）
export const Sparkle: React.FC<{ x: number; y: number; size: number; fill?: string; opacity?: number }> = ({
  x,
  y,
  size,
  fill = C.gold,
  opacity = 1,
}) => (
  <path
    transform={`translate(${x},${y}) scale(${size / 28})`}
    d="M0,-28 Q4,-4 28,0 Q4,4 0,28 Q-4,4 -28,0 Q-4,-4 0,-28 Z"
    fill={fill}
    opacity={opacity}
  />
);

// ホログラム風の吹き出し
export const HoloBubble: React.FC<{ x: number; y: number; label: string; opacity: number }> = ({
  x,
  y,
  label,
  opacity,
}) => (
  <g transform={`translate(${x},${y})`} opacity={opacity}>
    <rect x={-48} y={-44} width={96} height={80} rx={26} fill="#BDE8FF" fillOpacity={0.45} stroke="#6FC8FF" strokeWidth={3} />
    <polygon points="-10,35 6,35 -16,54" fill="#6FC8FF" />
    <text x={0} y={18} textAnchor="middle" fontSize={56} fontWeight={900} fill={C.blue} fontFamily="sans-serif">
      {label}
    </text>
  </g>
);
