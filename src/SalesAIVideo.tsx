import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { staticFile, useVideoConfig } from "remotion";
import { AnalysisScene } from "./scenes/AnalysisScene";
import { OutroScene } from "./scenes/OutroScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { SpinScene } from "./scenes/SpinScene";
import { TeamScene } from "./scenes/TeamScene";
import { TitleScene } from "./scenes/TitleScene";

// コラム「AIで解明するトップ営業の『間』と納得感の正体」紹介アニメ（約23秒）
export const SalesAIVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <>
      <Audio name="BGM" src={staticFile("bgm.wav")} volume={0.6} premountFor={fps} />
      <TransitionSeries>
        <TransitionSeries.Sequence name="タイトル" durationInFrames={75} premountFor={fps}>
          <TitleScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence name="01 なやみ" durationInFrames={120} premountFor={fps}>
          <ProblemScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: 12 })}
        />
        <TransitionSeries.Sequence name="02 AIで分析" durationInFrames={135} premountFor={fps}>
          <AnalysisScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: 12 })}
        />
        <TransitionSeries.Sequence name="03 質問の順番" durationInFrames={150} premountFor={fps}>
          <SpinScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: 12 })}
        />
        <TransitionSeries.Sequence name="04 チームで上達" durationInFrames={120} premountFor={fps}>
          <TeamScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence name="エンディング" durationInFrames={150} premountFor={fps}>
          <OutroScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </>
  );
};
