import type React from "react";
import { AbsoluteFill, Img, interpolate, staticFile } from "remotion";
import { Camera, Card, enter, G, GlassBg, ImageNote, jpFont, latinFont, LimeChip, Reveal, TopLabels, typed, useSceneFrame, WIDE, SceneTitle } from "./ui";

// コラム「夜間応対のBPOコストをRAG活用AIで削減する手法」紹介（X用・約26.5秒）
// 数字は使わない／文字は大きく、出たあとは静止して読み切れる時間を残す／動きは控えめ

const PhoneIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M6.6 2.5h3.2l1.7 4.3-2.2 1.4a11.5 11.5 0 0 0 6.5 6.5l1.4-2.2 4.3 1.7v3.2a2 2 0 0 1-2.1 2A17.6 17.6 0 0 1 4.5 4.6a2 2 0 0 1 2.1-2.1z"
      fill={G.ink}
    />
  </svg>
);

const Big: React.FC<{ children: React.ReactNode; size?: number }> = ({ children, size = 88 }) => (
  <span style={{ fontSize: size, lineHeight: 1.25 }}>{children}</span>
);

const mark = (text: string) => <span style={{ background: `linear-gradient(transparent 62%, ${G.lime} 62%)` }}>{text}</span>;

// 0：つかみ
export const GHook: React.FC = () => {
  const calls = [
    { t: "23:41", text: "鍵をなくした", top: 240, left: 1130, start: 0 },
    { t: "01:12", text: "お湯が出ない", top: 460, left: 1190, start: 6 },
    { t: "03:05", text: "上の階から水が…", top: 680, left: 1150, start: 12 },
  ];
  return (
    <AbsoluteFill>
      <GlassBg />
      <Camera
        keys={[
          { f: 0, x: 1460, y: 325, z: 1.7, r: -3 },
          { f: 10, x: 1460, y: 325, z: 1.7, r: -3 },
          { f: 30, x: 1470, y: 700, z: 1.55, r: -3 },
          { f: 56, ...WIDE, x: 900 },
          { f: 160, x: 820, y: 520, z: 1.06, r: 1 },
        ]}
      >
        {calls.map((c) => (
          <Card key={c.t} start={c.start} style={{ left: c.left, top: c.top, width: 640, height: 170, display: "flex", alignItems: "center", gap: 30, padding: "0 36px", boxSizing: "border-box" }}>
            <div style={{ width: 100, height: 100, borderRadius: 50, background: G.lime, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <PhoneIcon size={56} />
            </div>
            <div>
              <div style={{ fontFamily: latinFont, fontWeight: 700, fontSize: 30, color: G.sub, letterSpacing: "0.1em" }}>{c.t}</div>
              <div style={{ fontFamily: jpFont, fontWeight: 700, fontSize: 54, color: G.ink }}>{c.text}</div>
            </div>
          </Card>
        ))}
        <div style={{ position: "absolute", left: 120, top: 360 }}>
          <Reveal start={50}>
            <Big size={100}>夜中の入居者対応、</Big>
          </Reveal>
          <Reveal start={58}>
            <Big size={100}>{mark("外注まかせ")}ですか？</Big>
          </Reveal>
        </div>
      </Camera>
      <TopLabels section="NIGHT CALLS" />
    </AbsoluteFill>
  );
};

// 1：外注だけの課題
export const GProblem: React.FC = () => {
  const items = [
    { n: "01", l1: "閑散期も", l2: "割高", start: 32, left: 120 },
    { n: "02", l1: "答えが", l2: "まちまち", start: 64, left: 710 },
    { n: "03", l1: "翌朝に", l2: "二度手間", start: 96, left: 1300 },
  ];
  return (
    <AbsoluteFill>
      <GlassBg />
      <Camera
        keys={[
          { f: 0, ...WIDE },
          { f: 22, ...WIDE },
          { f: 40, x: 370, y: 600, z: 1.45, r: -2 },
          { f: 56, x: 370, y: 600, z: 1.45, r: -2 },
          { f: 72, x: 960, y: 600, z: 1.45 },
          { f: 88, x: 960, y: 600, z: 1.45 },
          { f: 104, x: 1550, y: 600, z: 1.45, r: 2 },
          { f: 122, x: 1550, y: 600, z: 1.45, r: 2 },
          { f: 146, ...WIDE },
          { f: 195, ...WIDE, z: 1.03 },
        ]}
      >
        <SceneTitle>
          <Reveal start={6}>
            <Big>外注だけだと、こうなりがち</Big>
          </Reveal>
        </SceneTitle>
        {items.map((it) => (
          <Card key={it.n} start={it.start} style={{ left: it.left, top: 380, width: 500, height: 440, padding: 44, boxSizing: "border-box" }}>
            <LimeChip style={{ fontSize: 36 }}>{it.n}</LimeChip>
            <div style={{ fontFamily: jpFont, fontWeight: 900, fontSize: 80, color: G.ink, lineHeight: 1.25, marginTop: 40 }}>
              {it.l1}
              <br />
              {it.l2}
            </div>
            <div style={{ position: "absolute", left: 44, bottom: 40, width: 220, height: 12, borderRadius: 6, background: G.lime }} />
          </Card>
        ))}
      </Camera>
      <TopLabels section="THE PROBLEM" />
    </AbsoluteFill>
  );
};

// 2：物件ごとのルールをAIが覚える（RAG）
export const GRag: React.FC = () => {
  const frame = useSceneFrame();
  const glow = 0.5 + 0.5 * Math.sin(frame * 0.08);
  const Doc: React.FC<{ top: number; start: number; label: string }> = ({ top, start, label }) => (
    <Card start={start} style={{ left: 120, top, width: 740, height: 180, display: "flex", alignItems: "center", gap: 32, padding: "0 40px", boxSizing: "border-box" }}>
      <div style={{ width: 84, height: 108, borderRadius: 12, background: "#F1EEF9", border: `3px solid ${G.line}`, padding: 14, boxSizing: "border-box", flexShrink: 0 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ height: 8, borderRadius: 4, background: i === 0 ? G.lime : G.line, marginBottom: 10, width: i === 3 ? "60%" : "100%" }} />
        ))}
      </div>
      <div style={{ fontFamily: jpFont, fontWeight: 700, fontSize: 60, color: G.ink }}>{label}</div>
    </Card>
  );
  return (
    <AbsoluteFill>
      <GlassBg />
      <Camera
        keys={[
          { f: 0, ...WIDE },
          { f: 18, ...WIDE },
          { f: 38, x: 520, y: 620, z: 1.4, r: -2 },
          { f: 60, x: 520, y: 620, z: 1.4, r: -2 },
          { f: 86, x: 1400, y: 620, z: 1.4, r: 2 },
          { f: 104, x: 1400, y: 620, z: 1.4, r: 2 },
          { f: 126, ...WIDE },
          { f: 165, ...WIDE, z: 1.03 },
        ]}
      >
        <SceneTitle>
          <Reveal start={6}>
            <Big>物件ごとのルールを、AIが覚える</Big>
          </Reveal>
        </SceneTitle>
        <Doc top={410} start={30} label="管理マニュアル" />
        <Doc top={650} start={40} label="物件ごとの特約" />
        {/* 資料が AI に流れこむ点 */}
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          {[500, 740].map((y0, k) =>
            [0, 1, 2].map((i) => {
              const t = ((frame - 58 - i * 14 - k * 7) % 42) / 42;
              if (frame < 58 + i * 14 + k * 7) return null;
              const x = interpolate(t, [0, 1], [880, 1170]);
              const y = interpolate(t, [0, 1], [y0, 620]);
              return <circle key={`${k}-${i}`} cx={x} cy={y} r={10} fill={G.lime} opacity={Math.sin(Math.PI * t)} />;
            }),
          )}
        </svg>
        <Card start={78} style={{ left: 1170, top: 400, width: 560, height: 440, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", width: 300, height: 300, borderRadius: 80, background: G.lime, opacity: 0.25 * glow, filter: "blur(20px)" }} />
          <div style={{ width: 240, height: 240, borderRadius: 64, background: G.lime, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: latinFont, fontWeight: 700, fontSize: 120, color: G.ink }}>
            AI
          </div>
        </Card>
      </Camera>
      <TopLabels section="HOW IT WORKS" />
    </AbsoluteFill>
  );
};

// 3：夜中でもすぐ返事（チャット画面）
export const GChat: React.FC = () => {
  const frame = useSceneFrame();
  const q = "お湯が出ません";
  const a1 = "給湯器の再起動方法を";
  const a2 = "ご案内します";
  const aStart = 80;
  const shownA1 = typed(a1, frame, aStart);
  const shownA2 = typed(a2, frame, aStart + Array.from(a1).length);
  return (
    <AbsoluteFill>
      <GlassBg />
      <Camera
        keys={[
          { f: 0, x: 700, y: 540, z: 1.15 },
          { f: 28, x: 700, y: 540, z: 1.15 },
          { f: 48, x: 1370, y: 400, z: 1.5, r: 2 },
          { f: 72, x: 1370, y: 400, z: 1.5, r: 2 },
          { f: 90, x: 1370, y: 600, z: 1.5, r: 2 },
          { f: 118, x: 1370, y: 600, z: 1.5, r: 2 },
          { f: 134, x: 1370, y: 720, z: 1.45, r: 2 },
          { f: 150, x: 1370, y: 720, z: 1.45, r: 2 },
          { f: 172, ...WIDE },
          { f: 195, ...WIDE, z: 1.02 },
        ]}
      >
        <div style={{ position: "absolute", left: 120, top: 380 }}>
          <Reveal start={4}>
            <Big size={100}>夜中でも、</Big>
          </Reveal>
          <Reveal start={10}>
            <Big size={100}>{mark("すぐ返事。")}</Big>
          </Reveal>
        </div>
        <Card start={14} style={{ left: 940, top: 170, width: 860, height: 780, padding: 48, boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <LimeChip style={{ fontSize: 34 }}>AI</LimeChip>
            <span style={{ fontFamily: jpFont, fontWeight: 700, fontSize: 40, color: G.sub }}>入居者サポート</span>
          </div>
          {frame >= 50 ? (
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 50 }}>
              <div style={{ background: "#EEECF5", borderRadius: 28, padding: "20px 34px", fontFamily: jpFont, fontWeight: 700, fontSize: 54, color: G.ink }}>
                {typed(q, frame, 50)}
              </div>
            </div>
          ) : null}
          {frame >= aStart ? (
            <div style={{ marginTop: 40, background: G.ink, borderRadius: 28, padding: "24px 36px", fontFamily: jpFont, fontWeight: 700, fontSize: 54, color: "#FFFFFF", width: "fit-content", lineHeight: 1.4 }}>
              {shownA1}
              <br />
              {shownA2}
              <span style={{ color: G.lime, opacity: Math.floor(frame / 15) % 2 ? 0 : 1 }}>|</span>
            </div>
          ) : null}
          {[0, 1].map((i) => (
            <div
              key={i}
              style={{
                marginTop: i === 0 ? 40 : 18,
                height: 84,
                borderRadius: 22,
                background: G.lime,
                display: "flex",
                alignItems: "center",
                gap: 22,
                padding: "0 26px",
                opacity: enter(frame, 126 + i * 8, 12),
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 24, background: G.ink, color: G.lime, fontFamily: latinFont, fontWeight: 700, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {i + 1}
              </div>
              <div style={{ height: 14, width: 260, borderRadius: 7, background: "rgba(21,21,28,0.65)" }} />
              <div style={{ height: 14, width: 160, borderRadius: 7, background: "rgba(21,21,28,0.65)" }} />
            </div>
          ))}
        </Card>
      </Camera>
      <TopLabels section="23:41 · NIGHT" />
      <ImageNote />
    </AbsoluteFill>
  );
};

// 4：緊急のときだけ人へ（AI × 有人）
export const GHybrid: React.FC = () => {
  const frame = useSceneFrame();
  const l1 = enter(frame, 52, 18);
  const l2 = enter(frame, 104, 18);
  return (
    <AbsoluteFill>
      <GlassBg />
      <Camera
        keys={[
          { f: 0, ...WIDE },
          { f: 20, ...WIDE },
          { f: 38, x: 420, y: 620, z: 1.5, r: -2 },
          { f: 52, x: 420, y: 620, z: 1.5, r: -2 },
          { f: 72, x: 1280, y: 470, z: 1.4, r: 2 },
          { f: 104, x: 1280, y: 470, z: 1.4, r: 2 },
          { f: 124, x: 1280, y: 790, z: 1.4, r: 2 },
          { f: 156, x: 1280, y: 790, z: 1.4, r: 2 },
          { f: 178, ...WIDE },
          { f: 210, ...WIDE, z: 1.02 },
        ]}
      >
        <SceneTitle>
          <Reveal start={6}>
            <Big>緊急のときだけ、すぐ人へ</Big>
          </Reveal>
        </SceneTitle>
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          <path d="M520,620 C690,620 690,470 860,470" stroke={G.ink} strokeWidth={5} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - l1} />
          <path d="M520,620 C690,620 690,790 860,790" stroke={G.ink} strokeWidth={5} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - l2} />
        </svg>
        <Card start={28} style={{ left: 160, top: 470, width: 360, height: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22 }}>
          <div style={{ width: 150, height: 150, borderRadius: 42, background: G.lime, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: latinFont, fontWeight: 700, fontSize: 76, color: G.ink }}>AI</div>
          <div style={{ fontFamily: jpFont, fontWeight: 700, fontSize: 48, color: G.ink }}>まず受付</div>
        </Card>
        <Card start={66} style={{ left: 860, top: 370, width: 960, height: 200, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 44px", boxSizing: "border-box" }}>
          <span style={{ fontFamily: jpFont, fontWeight: 900, fontSize: 64, color: G.ink }}>よくある相談</span>
          <span style={{ fontFamily: jpFont, fontWeight: 700, fontSize: 48, background: G.lime, color: G.ink, borderRadius: 20, padding: "8px 26px" }}>AIが対応</span>
        </Card>
        <Card start={116} style={{ left: 860, top: 690, width: 960, height: 200, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 44px", boxSizing: "border-box" }}>
          <span style={{ fontFamily: jpFont, fontWeight: 900, fontSize: 60, color: G.ink, whiteSpace: "nowrap" }}>漏水・火災のおそれ</span>
          <span style={{ fontFamily: jpFont, fontWeight: 700, fontSize: 48, background: G.ink, color: "#FFFFFF", borderRadius: 20, padding: "8px 26px", whiteSpace: "nowrap" }}>すぐ人へ</span>
        </Card>
      </Camera>
      <TopLabels section="AI × HUMAN" />
    </AbsoluteFill>
  );
};

// 5：翌朝は整理された状態から（BEFORE / AFTER）
export const GMorning: React.FC = () => {
  const frame = useSceneFrame();
  const dimBefore = interpolate(frame, [70, 90], [1, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scribbles = [
    { w: 380, r: -4 },
    { w: 260, r: 3 },
    { w: 420, r: -2 },
    { w: 200, r: 5 },
    { w: 340, r: -6 },
  ];
  return (
    <AbsoluteFill>
      <GlassBg />
      <Camera
        keys={[
          { f: 0, ...WIDE },
          { f: 18, ...WIDE },
          { f: 36, x: 480, y: 640, z: 1.4, r: -2 },
          { f: 62, x: 480, y: 640, z: 1.4, r: -2 },
          { f: 84, x: 1300, y: 660, z: 1.35, r: 2 },
          { f: 128, x: 1300, y: 660, z: 1.35, r: 2 },
          { f: 152, ...WIDE },
          { f: 195, ...WIDE, z: 1.02 },
        ]}
      >
        <SceneTitle>
          <Reveal start={6}>
            <Big>翌朝は、整理された状態から</Big>
          </Reveal>
        </SceneTitle>
        <div style={{ opacity: dimBefore }}>
          <Card start={26} style={{ left: 120, top: 380, width: 660, height: 560, padding: 44, boxSizing: "border-box" }}>
            <LimeChip style={{ fontSize: 32, background: "#E4E1EE", color: G.sub, letterSpacing: "0.2em" }}>BEFORE</LimeChip>
            <div style={{ fontFamily: jpFont, fontWeight: 900, fontSize: 60, color: G.ink, marginTop: 30 }}>メモがバラバラ</div>
            {scribbles.map((s, i) => (
              <div key={i} style={{ marginTop: 26, marginLeft: (i % 3) * 30, width: s.w, height: 14, borderRadius: 7, background: G.line, rotate: `${s.r}deg` }} />
            ))}
          </Card>
        </div>
        <Card start={70} style={{ left: 880, top: 340, width: 900, height: 640, padding: 48, boxSizing: "border-box" }}>
          <LimeChip style={{ fontSize: 32, letterSpacing: "0.2em" }}>AFTER</LimeChip>
          <div style={{ fontFamily: jpFont, fontWeight: 900, fontSize: 60, color: G.ink, marginTop: 30 }}>やることリスト</div>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                marginTop: i === 0 ? 34 : 20,
                height: 96,
                borderRadius: 24,
                background: G.lime,
                display: "flex",
                alignItems: "center",
                gap: 24,
                padding: "0 28px",
                opacity: enter(frame, 88 + i * 8, 12),
                translate: `${(1 - enter(frame, 88 + i * 8, 12)) * 30}px 0px`,
              }}
            >
              <div style={{ width: 54, height: 54, borderRadius: 27, background: G.ink, color: G.lime, fontFamily: latinFont, fontWeight: 700, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {i + 1}
              </div>
              <div style={{ height: 16, width: 220, borderRadius: 8, background: "rgba(21,21,28,0.65)" }} />
              <div style={{ height: 16, width: 300, borderRadius: 8, background: "rgba(21,21,28,0.65)" }} />
            </div>
          ))}
        </Card>
      </Camera>
      <TopLabels section="NEXT MORNING" />
      <ImageNote />
    </AbsoluteFill>
  );
};

// 6：締め
export const GClosing: React.FC = () => {
  const frame = useSceneFrame();
  return (
    <AbsoluteFill>
      <GlassBg />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 44 }}>
        <div
          style={{
            background: G.lime,
            borderRadius: 40,
            padding: "26px 64px",
            boxShadow: G.shadow,
            opacity: enter(frame, 6, 16),
            translate: `0px ${(1 - enter(frame, 6, 16)) * 30}px`,
          }}
        >
          <span style={{ fontFamily: jpFont, fontWeight: 900, fontSize: 104, color: G.ink }}>夜は、AIと人のチームで。</span>
        </div>
        <div style={{ fontFamily: jpFont, fontWeight: 700, fontSize: 56, color: G.sub, opacity: enter(frame, 24, 14) }}>詳しくはコラムで</div>
        <Img src={staticFile("meets_logo_navy.png")} style={{ width: 420, marginTop: 30, opacity: enter(frame, 34, 14) }} />
      </AbsoluteFill>
      <TopLabels section="" />
    </AbsoluteFill>
  );
};
