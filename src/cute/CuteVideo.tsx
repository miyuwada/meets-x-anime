import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { staticFile, useVideoConfig } from "remotion";
import { OutroScene } from "../scenes/OutroScene";
import { CuteAhaScene } from "./CuteAhaScene";
import { CuteAnalysisScene } from "./CuteAnalysisScene";
import { CuteProblemScene } from "./CuteProblemScene";
import { CuteTeamScene } from "./CuteTeamScene";
import { CuteTitleScene } from "./CuteTitleScene";

// かわいいアニメキャラ版（内容・BGM・QR は通常版と同じ／約23秒）
export const CuteVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <>
      <Audio name="BGM" src={staticFile("bgm.wav")} volume={0.6} premountFor={fps} />
      <TransitionSeries>
        <TransitionSeries.Sequence name="タイトル" durationInFrames={75} premountFor={fps}>
          <CuteTitleScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence name="01 なやみ" durationInFrames={120} premountFor={fps}>
          <CuteProblemScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: 12 })}
        />
        <TransitionSeries.Sequence name="02 AIで分析" durationInFrames={135} premountFor={fps}>
          <CuteAnalysisScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: 12 })}
        />
        <TransitionSeries.Sequence name="03 ひらめき" durationInFrames={150} premountFor={fps}>
          <CuteAhaScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: 12 })}
        />
        <TransitionSeries.Sequence name="04 チームで上達" durationInFrames={120} premountFor={fps}>
          <CuteTeamScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence name="エンディング" durationInFrames={150} premountFor={fps}>
          <OutroScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </>
  );
};
