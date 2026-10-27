import type React from "react";
import { useCurrentFrame } from "remotion";
import { appear, C, fontFamily } from "./theme";

export const SceneTag: React.FC<{ num: string; label: string; dark?: boolean }> = ({
  num,
  label,
  dark,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top: 56,
        left: 96,
        fontFamily,
        fontWeight: 700,
        fontSize: 30,
        letterSpacing: 4,
        color: dark ? C.gold : C.blue,
        opacity: appear(frame, 0, 15),
      }}
    >
      {num}
      <span style={{ margin: "0 16px", opacity: 0.5 }}>｜</span>
      {label}
    </div>
  );
};

export const Headline: React.FC<{
  children: React.ReactNode;
  start?: number;
  dark?: boolean;
}> = ({ children, start = 4, dark }) => {
  const frame = useCurrentFrame();
  const p = appear(frame, start, 20);
  return (
    <div
      style={{
        position: "absolute",
        top: 104,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily,
        fontWeight: 900,
        fontSize: 76,
        color: dark ? C.white : C.navy,
        opacity: p,
        translate: `0px ${(1 - p) * 30}px`,
      }}
    >
      {children}
    </div>
  );
};

export const Caption: React.FC<{
  children: React.ReactNode;
  start: number;
  dark?: boolean;
  bottom?: number;
}> = ({ children, start, dark, bottom = 64 }) => {
  const frame = useCurrentFrame();
  const p = appear(frame, start, 18);
  return (
    <div
      style={{
        position: "absolute",
        bottom,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: p,
        translate: `0px ${(1 - p) * 24}px`,
      }}
    >
      <div
        style={{
          fontFamily,
          fontWeight: 700,
          fontSize: 46,
          padding: "18px 48px",
          borderRadius: 999,
          background: dark ? C.gold : C.navy,
          color: dark ? C.navy : C.white,
          boxShadow: "0 10px 30px rgba(23,39,77,0.25)",
        }}
      >
        {children}
      </div>
    </div>
  );
};

// 強調（ゴールド）
export const Em: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: C.gold }}>{children}</span>
);
