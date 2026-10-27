import type React from "react";
import { C } from "../theme";

type Props = {
  x: number;
  y: number;
  frame: number;
  scale?: number;
  eyes?: "happy" | "scan";
  wave?: boolean;
};

const CYAN = "#6FF0FF";

// AIマスコットロボット（ふわふわ浮かぶ）
export const Robot: React.FC<Props> = ({ x, y, frame, scale = 1, eyes = "happy", wave }) => {
  const bob = Math.sin(frame * 0.1) * 10;
  const glow = 0.5 + 0.5 * Math.sin(frame * 0.2);
  const blink = frame % 90 > 85;
  const waveAngle = wave ? -120 + Math.sin(frame * 0.3) * 25 : -20;

  return (
    <g transform={`translate(${x},${y + bob}) scale(${scale})`}>
      {/* アンテナ */}
      <line x1={0} y1={-95} x2={0} y2={-128} stroke="#9DB7D5" strokeWidth={5} />
      <circle cx={0} cy={-138} r={22} fill={C.gold} opacity={0.3 * glow} />
      <circle cx={0} cy={-138} r={12} fill={C.gold} />
      {/* 耳 */}
      <circle cx={-92} cy={-30} r={18} fill={C.sky} />
      <circle cx={92} cy={-30} r={18} fill={C.sky} />
      {/* 腕 */}
      <g transform={`translate(-52,62) rotate(20)`}>
        <rect x={-10} y={0} width={20} height={42} rx={10} fill={C.white} stroke="#D7E6F5" strokeWidth={3} />
      </g>
      <g transform={`translate(52,62) rotate(${waveAngle})`}>
        <rect x={-10} y={0} width={20} height={42} rx={10} fill={C.white} stroke="#D7E6F5" strokeWidth={3} />
      </g>
      {/* 体 */}
      <ellipse cx={0} cy={78} rx={56} ry={46} fill={C.white} stroke="#D7E6F5" strokeWidth={4} />
      <text x={0} y={90} textAnchor="middle" fontSize={32} fontWeight={900} fill={C.blue} fontFamily="sans-serif">
        AI
      </text>
      {/* 頭 */}
      <rect x={-90} y={-95} width={180} height={132} rx={58} fill={C.white} stroke="#D7E6F5" strokeWidth={4} />
      <rect x={-68} y={-76} width={136} height={90} rx={40} fill={C.navy} />
      {blink ? (
        <>
          <line x1={-40} y1={-32} x2={-16} y2={-32} stroke={CYAN} strokeWidth={6} strokeLinecap="round" />
          <line x1={16} y1={-32} x2={40} y2={-32} stroke={CYAN} strokeWidth={6} strokeLinecap="round" />
        </>
      ) : eyes === "happy" ? (
        <>
          <path d="M-40,-26 Q-28,-46 -16,-26" stroke={CYAN} strokeWidth={7} fill="none" strokeLinecap="round" />
          <path d="M16,-26 Q28,-46 40,-26" stroke={CYAN} strokeWidth={7} fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx={-28} cy={-34} rx={16} ry={20} fill={CYAN} opacity={0.25 * glow} />
          <ellipse cx={28} cy={-34} rx={16} ry={20} fill={CYAN} opacity={0.25 * glow} />
          <ellipse cx={-28} cy={-34} rx={10} ry={14} fill={CYAN} />
          <ellipse cx={28} cy={-34} rx={10} ry={14} fill={CYAN} />
        </>
      )}
      <ellipse cx={-50} cy={-8} rx={9} ry={5} fill="#FF8FA3" opacity={0.75} />
      <ellipse cx={50} cy={-8} rx={9} ry={5} fill="#FF8FA3" opacity={0.75} />
      <path d="M-8,-10 Q0,-3 8,-10" stroke={CYAN} strokeWidth={4} fill="none" strokeLinecap="round" />
    </g>
  );
};
