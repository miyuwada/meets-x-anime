import type React from "react";
import { C } from "./theme";

type Props = {
  x: number;
  y: number; // 足元の位置
  scale?: number;
  flip?: boolean; // 左向き
  mood?: "smile" | "worried" | "neutral";
  hair?: string;
  hairStyle?: "short" | "long";
  suit?: string;
  tie?: string | null;
  leftArm?: number; // 角度(deg)。0=真下
  rightArm?: number;
  tilt?: number;
  blink?: boolean;
  armsFront?: boolean; // 腕を頭より手前に描く（頭を抱えるポーズ等）
};

// フラットデザインのビジネスパーソン（SVG）
export const Person: React.FC<Props> = ({
  x,
  y,
  scale = 1,
  flip,
  mood = "neutral",
  hair = "#2A2A35",
  hairStyle = "short",
  suit = C.navy,
  tie = C.gold,
  leftArm = 10,
  rightArm = -10,
  tilt = 0,
  blink,
  armsFront,
}) => {
  const arm = (sx: number, angle: number) => (
    <g transform={`translate(${sx},-228) rotate(${angle})`}>
      <rect x={-12} y={0} width={24} height={96} rx={12} fill={suit} />
      <circle cx={0} cy={102} r={13} fill={C.skin} />
    </g>
  );

  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -scale : scale},${scale})`}>
      {/* 脚 */}
      <rect x={-32} y={-115} width={28} height={115} rx={10} fill="#2B3550" />
      <rect x={4} y={-115} width={28} height={115} rx={10} fill="#2B3550" />
      {armsFront ? null : arm(-54, leftArm)}
      {armsFront ? null : arm(54, rightArm)}
      {/* 胴体 */}
      <path
        d="M-62,-105 L-62,-200 Q-62,-238 -24,-242 L24,-242 Q62,-238 62,-200 L62,-105 Z"
        fill={suit}
      />
      <polygon points="-20,-242 0,-192 20,-242" fill={C.white} />
      {tie ? <polygon points="0,-234 -8,-222 0,-180 8,-222" fill={tie} /> : null}
      {/* 首・頭 */}
      <rect x={-11} y={-258} width={22} height={20} fill={C.skin} />
      <g transform={`rotate(${tilt},0,-260)`}>
        {hairStyle === "long" ? (
          <path d="M-48,-290 Q-50,-215 -30,-222 L30,-222 Q50,-215 48,-290 Z" fill={hair} />
        ) : null}
        <circle cx={0} cy={-292} r={44} fill={C.skin} />
        <path
          d="M-46,-296 Q-48,-344 0,-342 Q48,-344 46,-296 Q34,-322 6,-320 Q-24,-322 -46,-296 Z"
          fill={hair}
        />
        {/* 目 */}
        {blink ? (
          <>
            <line x1={-20} y1={-290} x2={-8} y2={-290} stroke={C.ink} strokeWidth={3} strokeLinecap="round" />
            <line x1={8} y1={-290} x2={20} y2={-290} stroke={C.ink} strokeWidth={3} strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx={-14} cy={-290} r={5} fill={C.ink} />
            <circle cx={14} cy={-290} r={5} fill={C.ink} />
          </>
        )}
        {/* 眉・口 */}
        {mood === "worried" ? (
          <>
            <line x1={-24} y1={-301} x2={-8} y2={-308} stroke={C.ink} strokeWidth={3.5} strokeLinecap="round" />
            <line x1={8} y1={-308} x2={24} y2={-301} stroke={C.ink} strokeWidth={3.5} strokeLinecap="round" />
            <path d="M-11,-264 Q0,-273 11,-264" stroke={C.ink} strokeWidth={3.5} fill="none" strokeLinecap="round" />
          </>
        ) : mood === "smile" ? (
          <>
            <circle cx={-26} cy={-274} r={7} fill="#F29B9B" opacity={0.45} />
            <circle cx={26} cy={-274} r={7} fill="#F29B9B" opacity={0.45} />
            <path d="M-14,-272 Q0,-256 14,-272" stroke={C.ink} strokeWidth={3.5} fill="none" strokeLinecap="round" />
          </>
        ) : (
          <line x1={-9} y1={-268} x2={9} y2={-268} stroke={C.ink} strokeWidth={3.5} strokeLinecap="round" />
        )}
      </g>
      {armsFront ? arm(-54, leftArm) : null}
      {armsFront ? arm(54, rightArm) : null}
    </g>
  );
};
