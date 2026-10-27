import type React from "react";
import { loadFont } from "@remotion/google-fonts/DotGothic16";

export const { fontFamily: pixelFont } = loadFont("normal", { weights: ["400"] });

export type Palette = Record<string, string>;

// 共通パレット（'.' は透明）
export const BASE: Palette = {
  K: "#1B1B2F", // 輪郭
  W: "#FFFFFF",
  S: "#F6D5BC", // 肌
  s: "#E3B897",
  E: "#1B1B2F", // 目
  C: "#FF8FA3", // ほっぺ
  R: "#E0605E",
  G: "#F2C94C",
  P: "#2B3550",
  N: "#17274D",
  c: "#6FF0FF", // シアン
  A: "#1B5FA8",
  O: "#D9A066", // 段ボール
  o: "#A86F35",
  T: "#F3D9A4",
  g: "#9AA0B8",
  // キャラの初期色（企画担当の女の子）。通行人などは palette で上書き
  H: "#6B4A8A", // 髪
  h: "#9A7BC0",
  B: "#5E8FD6", // 服
  b: "#4A76B8",
  L: "#2B3550", // スカート
};

type Props = {
  grid: readonly string[];
  x: number;
  y: number;
  px: number; // 1ドットの大きさ
  palette?: Palette;
  flip?: boolean;
  opacity?: number;
};

// 文字列のマス目からドット絵を描く（SVG内で使用）
export const Sprite: React.FC<Props> = ({ grid, x, y, px, palette = {}, flip, opacity = 1 }) => {
  const pal = { ...BASE, ...palette };
  const w = grid[0].length;
  const rects: React.ReactNode[] = [];
  grid.forEach((row, r) => {
    let c = 0;
    while (c < row.length) {
      const ch = row[c];
      if (ch === ".") {
        c++;
        continue;
      }
      // 同じ色が横に続く部分は1つの矩形にまとめる
      let run = 1;
      while (c + run < row.length && row[c + run] === ch) run++;
      const col = flip ? w - c - run : c;
      rects.push(<rect key={`${r}-${c}`} x={col * px} y={r * px} width={run * px} height={px} fill={pal[ch] ?? "#FF00FF"} />);
      c += run;
    }
  });
  return (
    <g transform={`translate(${x},${y})`} opacity={opacity} shapeRendering="crispEdges">
      {rects}
    </g>
  );
};

// 位置をドット単位に丸める（カクカクしたドットらしい動き）
export const snap = (v: number, step: number) => Math.round(v / step) * step;
