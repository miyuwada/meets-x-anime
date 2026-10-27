import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { staticFile, useVideoConfig } from "remotion";
import { OutroScene } from "../scenes/OutroScene";
import { C } from "../theme";
import { BatchScene } from "./scenes/BatchScene";
import { HookScene } from "./scenes/HookScene";
import { NumbersScene } from "./scenes/NumbersScene";
import { PartnerScene } from "./scenes/PartnerScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { ScanScene } from "./scenes/ScanScene";

// コラム「画像解析AIで捉える街角の兆し」紹介アニメ（ドット絵版・約41秒）
// 読みやすさのルール：文字が全部出てから「文字数÷6＋1秒」以上は表示を保つ
// 動きは控えめに：場面転換はフェードのみ、跳ね・揺れ・火花なし
export const PixelVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  const t = linearTiming({ durationInFrames: 10 });

  return (
    <>
      <Audio name="BGM" src={staticFile("bgm-pixel.wav")} volume={0.5} premountFor={fps} />
      <TransitionSeries>
        <TransitionSeries.Sequence name="00 つかみ" durationInFrames={150} premountFor={fps}>
          <HookScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="01 勘まかせ" durationInFrames={200} premountFor={fps}>
          <ProblemScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="02 写真を読みとる" durationInFrames={240} premountFor={fps}>
          <ScanScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="03 感覚を数字に" durationInFrames={210} premountFor={fps}>
          <NumbersScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="04 少なく作って追加" durationInFrames={210} premountFor={fps}>
          <BatchScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="05 AIは相棒" durationInFrames={180} premountFor={fps}>
          <PartnerScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="エンディング" durationInFrames={90} premountFor={fps}>
          <OutroScene
            quick
            message={
              <span style={{ fontSize: 66 }}>
                画像解析AIで、<span style={{ color: C.blue }}>売れ残りを減らす</span>商品づくりを。
              </span>
            }
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </>
  );
};
