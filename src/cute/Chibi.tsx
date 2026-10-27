import type React from "react";
import { C } from "../theme";

type Mood = "smile" | "worried" | "wow" | "joy" | "aha";

type Props = {
  x: number;
  y: number; // 足元の位置
  scale?: number;
  flip?: boolean;
  mood?: Mood;
  hair?: string;
  hairStyle?: "long" | "twin" | "short";
  outfit?: string;
  skirt?: boolean;
  ribbon?: string; // 女性はリボン
  tie?: string; // 男性はネクタイ
  iris?: string;
  leftArm?: number; // 角度(deg)。0=真下
  rightArm?: number;
  tilt?: number;
  sway?: number; // 髪の揺れ(deg)
  blink?: boolean;
  sweat?: number; // 汗マーク 0〜1
  glasses?: boolean;
  ahoge?: boolean;
};

const INK = "#1B1B2F";

// 4点の星（瞳のキラキラ）
const Star: React.FC<{ x: number; y: number; r: number; fill?: string }> = ({ x, y, r, fill = C.white }) => (
  <path
    transform={`translate(${x},${y}) scale(${r / 10})`}
    d="M0,-10 Q1.5,-1.5 10,0 Q1.5,1.5 0,10 Q-1.5,1.5 -10,0 Q-1.5,-1.5 0,-10 Z"
    fill={fill}
  />
);

// ちびキャラ（2.5頭身・大きな瞳）
export const Chibi: React.FC<Props> = ({
  x,
  y,
  scale = 1,
  flip,
  mood = "smile",
  hair = "#5B3A29",
  hairStyle = "long",
  outfit = C.blue,
  skirt,
  ribbon,
  tie,
  iris = "#7A4E2D",
  leftArm = 12,
  rightArm = -12,
  tilt = 0,
  sway = 0,
  blink,
  sweat = 0,
  glasses,
  ahoge,
}) => {
  const eyesType = blink ? "blink" : mood === "joy" ? "happy" : mood === "wow" || mood === "aha" ? "sparkle" : "normal";
  const mouthType =
    mood === "worried" ? "wavy" : mood === "wow" ? "o" : mood === "joy" || mood === "aha" ? "open" : "smile";

  const arm = (sx: number, angle: number) => (
    <g transform={`translate(${sx},-96) rotate(${angle})`}>
      <rect x={-8} y={0} width={16} height={48} rx={8} fill={outfit} />
      <circle cx={0} cy={54} r={10} fill={C.skin} />
    </g>
  );

  const eye = (ex: number) => {
    const ey = -170;
    if (eyesType === "happy") {
      return (
        <path
          key={ex}
          d={`M${ex - 15},${ey + 4} Q${ex},${ey - 16} ${ex + 15},${ey + 4}`}
          stroke={INK}
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
        />
      );
    }
    if (eyesType === "blink") {
      return (
        <path
          key={ex}
          d={`M${ex - 15},${ey} Q${ex},${ey + 9} ${ex + 15},${ey}`}
          stroke={INK}
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
        />
      );
    }
    return (
      <g key={ex}>
        <ellipse cx={ex} cy={ey} rx={17} ry={22} fill={C.white} />
        <ellipse cx={ex} cy={ey + 2} rx={14.5} ry={19.5} fill={iris} />
        <ellipse cx={ex} cy={ey + 8} rx={12} ry={11} fill={C.white} opacity={0.18} />
        <ellipse cx={ex} cy={ey + 1} rx={7.5} ry={10.5} fill={INK} />
        {eyesType === "sparkle" ? (
          <>
            <Star x={ex + 5} y={ey - 7} r={9} />
            <Star x={ex - 5} y={ey + 9} r={5} />
          </>
        ) : (
          <>
            <circle cx={ex + 5} cy={ey - 8} r={5.5} fill={C.white} />
            <circle cx={ex - 5} cy={ey + 9} r={2.6} fill={C.white} />
          </>
        )}
        {mood === "worried" ? (
          // 困り顔：目尻が下がり、目頭側が上がったまぶた
          <path
            d={
              ex < 0
                ? `M${ex - 19},${ey - 10} Q${ex - 2},${ey - 20} ${ex + 18},${ey - 26}`
                : `M${ex - 18},${ey - 26} Q${ex + 2},${ey - 20} ${ex + 19},${ey - 10}`
            }
            stroke={INK}
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
          />
        ) : (
          <path
            d={`M${ex - 19},${ey - 15} Q${ex},${ey - 30} ${ex + 19},${ey - 15}`}
            stroke={INK}
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
          />
        )}
      </g>
    );
  };

  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -scale : scale},${scale})`}>
      <ellipse cx={0} cy={0} rx={52} ry={8} fill="#000" opacity={0.08} />

      {/* 後ろ髪 */}
      {hairStyle === "long" ? (
        <path
          transform={`rotate(${sway},0,-200)`}
          d="M-86,-200 Q-102,-92 -66,-56 Q0,-44 66,-56 Q102,-92 86,-200 Z"
          fill={hair}
        />
      ) : null}
      {hairStyle === "twin" ? (
        <>
          <ellipse cx={-96} cy={-140} rx={24} ry={62} fill={hair} transform={`rotate(${14 + sway},-80,-200)`} />
          <ellipse cx={96} cy={-140} rx={24} ry={62} fill={hair} transform={`rotate(${-14 + sway},80,-200)`} />
        </>
      ) : null}

      {/* 脚・体 */}
      <rect x={-20} y={-48} width={14} height={44} rx={7} fill="#3E4560" />
      <rect x={6} y={-48} width={14} height={44} rx={7} fill="#3E4560" />
      <ellipse cx={-14} cy={-4} rx={13} ry={6} fill="#2B2F40" />
      <ellipse cx={14} cy={-4} rx={13} ry={6} fill="#2B2F40" />
      <path d="M-40,-42 Q-46,-92 -26,-104 L26,-104 Q46,-92 40,-42 Z" fill={outfit} />
      {skirt ? <path d="M-40,-50 L40,-50 L50,-24 Q0,-18 -50,-24 Z" fill="#2B3550" /> : null}
      <polygon points="-14,-104 0,-80 14,-104" fill={C.white} />
      {ribbon ? (
        <g transform="translate(0,-99)">
          <polygon points="-15,-8 0,0 -15,8" fill={ribbon} />
          <polygon points="15,-8 0,0 15,8" fill={ribbon} />
          <circle r={4.5} fill={ribbon} />
        </g>
      ) : null}
      {tie ? <polygon points="0,-102 -6,-94 0,-66 6,-94" fill={tie} /> : null}
      <rect x={-8} y={-114} width={16} height={14} fill={C.skin} />

      {/* 頭 */}
      <g transform={`rotate(${tilt},0,-110)`}>
        <ellipse cx={0} cy={-182} rx={80} ry={74} fill={C.skin} />
        {eye(-30)}
        {eye(30)}
        {/* ほっぺ */}
        <ellipse cx={-52} cy={-146} rx={13} ry={7} fill="#FF8FA3" opacity={mood === "worried" ? 0.3 : 0.55} />
        <ellipse cx={52} cy={-146} rx={13} ry={7} fill="#FF8FA3" opacity={mood === "worried" ? 0.3 : 0.55} />
        {/* 口 */}
        {mouthType === "smile" ? (
          <path d="M-9,-138 Q0,-129 9,-138" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
        ) : mouthType === "open" ? (
          <>
            <path d="M-14,-141 Q0,-117 14,-141 Z" fill="#C2455A" />
            <path d="M-7,-127 Q0,-122 7,-127 Q0,-131 -7,-127 Z" fill="#FF8FA3" />
          </>
        ) : mouthType === "o" ? (
          <ellipse cx={0} cy={-134} rx={7} ry={9} fill="#C2455A" />
        ) : (
          <path
            d="M-11,-134 Q-5.5,-140 0,-134 Q5.5,-128 11,-134"
            stroke={INK}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
          />
        )}
        {/* 前髪 */}
        <path
          d="M-84,-176 Q-92,-262 0,-262 Q92,-262 84,-176 Q78,-196 64,-206 Q58,-188 46,-182 Q44,-204 30,-214 Q20,-196 4,-192 Q2,-212 -14,-220 Q-26,-198 -42,-190 Q-46,-208 -58,-212 Q-70,-196 -84,-176 Z"
          fill={hair}
        />
        {hairStyle !== "short" ? (
          <>
            <path d="M-84,-192 Q-94,-128 -74,-104 Q-70,-150 -64,-196 Z" fill={hair} />
            <path d="M84,-192 Q94,-128 74,-104 Q70,-150 64,-196 Z" fill={hair} />
          </>
        ) : null}
        {hairStyle === "twin" ? (
          <>
            <circle cx={-80} cy={-204} r={7} fill={C.gold} />
            <circle cx={80} cy={-204} r={7} fill={C.gold} />
          </>
        ) : null}
        {ahoge ? (
          <path d="M4,-258 Q-2,-300 30,-294" stroke={hair} strokeWidth={7} fill="none" strokeLinecap="round" />
        ) : null}
        {glasses ? (
          <g stroke="#3A3A4A" strokeWidth={4} fill="none">
            <circle cx={-30} cy={-170} r={25} />
            <circle cx={30} cy={-170} r={25} />
            <line x1={-5} y1={-172} x2={5} y2={-172} />
          </g>
        ) : null}
        {/* 汗マーク */}
        {sweat > 0 ? (
          <path
            transform={`translate(${84},${-214 + sweat * 22}) scale(1.7)`}
            d="M0,-14 Q11,0 0,7 Q-11,0 0,-14 Z"
            fill="#9FDcFF"
            stroke="#4AA8E0"
            strokeWidth={1.6}
            opacity={Math.min(1, sweat * 3)}
          />
        ) : null}
      </g>

      {/* 腕（頭より手前） */}
      {arm(-34, leftArm)}
      {arm(34, rightArm)}
    </g>
  );
};
