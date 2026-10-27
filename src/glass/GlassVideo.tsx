import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { staticFile, useVideoConfig } from "remotion";
import { OutroScene } from "../scenes/OutroScene";
import { C } from "../theme";
import { GHook, GHybrid, GProblem, GRag } from "./scenes";

// コラム「夜間応対のBPOコストをRAG活用AIで削減する手法」X用動画（約26.5秒）
export const GlassVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  const t = linearTiming({ durationInFrames: 10 });

  return (
    <>
      <Audio name="BGM" src={staticFile("bgm-glass.wav")} volume={0.5} premountFor={fps} />
      <TransitionSeries>
        <TransitionSeries.Sequence name="00 夜中の電話" durationInFrames={160} premountFor={fps}>
          <GHook />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="01 外注だけの課題" durationInFrames={195} premountFor={fps}>
          <GProblem />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="02 ルールをAIが覚える" durationInFrames={165} premountFor={fps}>
          <GRag />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="03 緊急だけ人へ" durationInFrames={210} premountFor={fps}>
          <GHybrid />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="04 締め・QR" durationInFrames={105} premountFor={fps}>
          <OutroScene
            quick
            message={
              <span style={{ fontSize: 68, fontWeight: 900 }}>
                夜は、<span style={{ color: C.blue }}>AIと人のチーム</span>で。
              </span>
            }
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </>
  );
};
