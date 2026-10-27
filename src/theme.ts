import { Easing, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/NotoSansJP";

export const { fontFamily } = loadFont("normal", {
  weights: ["500", "700", "900"],
});

// Meets Consulting ブランドカラー
export const C = {
  navy: "#17274D",
  gold: "#CCB366",
  blue: "#1B5FA8",
  sky: "#5AA9E6",
  bg: "#F4F6FA",
  ink: "#1A2236",
  sub: "#5B6478",
  white: "#FFFFFF",
  skin: "#F6D5BC",
  red: "#E0605E",
};

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

// start フレームから dur フレームかけて 0→1
export const appear = (frame: number, start: number, dur = 18) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

// ポンッと弾むように 0→1
export const pop = (frame: number, fps: number, start: number) =>
  spring({ frame: frame - start, fps, config: { damping: 11, stiffness: 140 } });
