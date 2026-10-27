import type React from "react";
import { Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";

// 切り抜いた1枚の絵を「頭」と「体」に分けて動かす（切り絵アニメの方式）
// 座標はすべて切り抜き PNG の元のピクセル

type Eye = { cx: number; cy: number; rx: number; ry: number };
export type Rig = {
  src: string;
  w: number;
  h: number;
  split: number; // この高さより上が頭
  pivot: [number, number]; // 首の付け根（頭の回転の中心）
  eyes: Eye[];
  lid: string; // まぶたの色（画像から読み取った肌色の濃淡。ロボットは画面の色）
  lash: string;
  lashW: number;
};

export const RIGS: Record<"woman" | "man" | "robot", Rig> = {
  woman: {
    src: "hrdx/woman_side.png", w: 255, h: 940, split: 206, pivot: [150, 214],
    eyes: [{ cx: 128, cy: 120, rx: 17, ry: 13 }, { cx: 188, cy: 121, rx: 13, ry: 12 }],
    lid: "linear-gradient(180deg, #E3A088 0%, #FBBDA2 70%)", lash: "#3B2620", lashW: 3,
  },
  man: {
    src: "hrdx/man_side.png", w: 320, h: 985, split: 210, pivot: [200, 218],
    eyes: [{ cx: 177, cy: 118, rx: 14, ry: 8 }, { cx: 227, cy: 118, rx: 10, ry: 8 }],
    lid: "linear-gradient(180deg, #D48E70 0%, #F2AC8B 70%)", lash: "#2A1D18", lashW: 2,
  },
  robot: {
    src: "hrdx/robot.png", w: 280, h: 355, split: 184, pivot: [140, 186],
    eyes: [{ cx: 89, cy: 92, rx: 14, ry: 20 }, { cx: 157, cy: 92, rx: 15, ry: 20 }],
    lid: "#121821", lash: "#6FF0FF", lashW: 3,
  },
};

// 自然なまばたき：数秒ごとに約0.15秒閉じる（キャラごとにずらす）
const blinkAmount = (frame: number, offset: number) => {
  const period = 97 + (offset % 3) * 23;
  const t = (frame + offset) % period;
  return [0.6, 1, 1, 0.5][t] ?? 0;
};

// うなずき：start から count 回、ゆっくり頭を下げて戻す（角度・度）
export const nod = (frame: number, start: number, count = 2, amp = 5, len = 16) => {
  const t = frame - start;
  if (t < 0 || t >= count * len) return 0;
  return amp * Math.sin((Math.PI * (t % len)) / len);
};

// 歩いて移動：位置・上下の弾み・左右の揺れ
export const walk = (frame: number, start: number, end: number, from: number, to: number) => {
  const p = interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });
  const moving = frame > start && frame < end;
  const step = (frame - start) * 0.42;
  return {
    x: from + (to - from) * p,
    bob: moving ? -Math.abs(Math.sin(step)) * 14 : 0,
    rock: moving ? Math.sin(step) * 1.6 : 0,
  };
};

export const Puppet: React.FC<{
  rig: Rig;
  x: number; // 足元の中心
  floor: number;
  height: number; // 表示する高さ
  flip?: boolean;
  head?: number; // 頭の回転（度）。＋で顔を伏せる（うなずき・うつむき）
  headY?: number;
  lean?: number; // 体の傾き（度）
  bob?: number; // 上下の移動（px）
  blinkOffset?: number;
  filter?: string;
  shadow?: boolean;
}> = ({ rig, x, floor, height, flip, head = 0, headY = 0, lean = 0, bob = 0, blinkOffset = 0, filter, shadow = true }) => {
  const frame = useCurrentFrame();
  const s = height / rig.h;
  const breathe = 1 + 0.007 * Math.sin(frame * 0.09 + blinkOffset);
  const blink = blinkAmount(frame, blinkOffset);
  const overlap = 10;
  return (
    <>
      {shadow ? (
        <div
          style={{
            position: "absolute",
            left: x - height * 0.2,
            top: floor - height * 0.025,
            width: height * 0.4,
            height: height * 0.05,
            borderRadius: "50%",
            background: "radial-gradient(closest-side, rgba(0,0,0,0.33), rgba(0,0,0,0))",
            scale: `${1 + bob / 200}`,
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          left: x - (rig.w * s) / 2,
          top: floor - height + bob,
          width: rig.w * s,
          height,
          transformOrigin: "50% 100%",
          transform: `scaleX(${flip ? -1 : 1}) rotate(${lean}deg) scaleY(${breathe})`,
          filter,
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 0, width: rig.w, height: rig.h, transformOrigin: "0 0", scale: `${s}` }}>
          {/* 体 */}
          <Img
            src={staticFile(rig.src)}
            style={{ position: "absolute", left: 0, top: 0, width: rig.w, height: rig.h, clipPath: `inset(${rig.split}px 0 0 0)` }}
          />
          {/* 頭（首の付け根を中心に回す） */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: rig.w,
              height: rig.h,
              transformOrigin: `${rig.pivot[0]}px ${rig.pivot[1]}px`,
              transform: `translateY(${headY}px) rotate(${head}deg)`,
            }}
          >
            <Img
              src={staticFile(rig.src)}
              style={{ position: "absolute", left: 0, top: 0, width: rig.w, height: rig.h, clipPath: `inset(0 0 ${rig.h - rig.split - overlap}px 0)` }}
            />
            {/* まぶた（まばたき） */}
            {blink > 0
              ? rig.eyes.map((e, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: e.cx - e.rx - 1,
                      top: e.cy - e.ry - 1,
                      width: (e.rx + 1) * 2,
                      height: (e.ry + 1) * 2 * blink,
                      background: rig.lid,
                      borderRadius: "50% 50% 45% 45% / 60% 60% 40% 40%",
                      borderBottom: `${rig.lashW}px solid ${rig.lash}`,
                    }}
                  />
                ))
              : null}
          </div>
        </div>
      </div>
    </>
  );
};
