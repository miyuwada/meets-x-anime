import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { staticFile, useVideoConfig } from "remotion";
import { OutroScene } from "../scenes/OutroScene";
import { C } from "../theme";
import { GChat, GHook, GHybrid, GMorning, GProblem, GRag } from "./scenes";
import { SceneSpeed } from "./ui";

// 全6シーン版（約29.8秒）：シーンは外さず、各シーンの動きを約1.2〜1.4倍速にして短縮
export const GlassVideoFull: React.FC = () => {
  const { fps } = useVideoConfig();
  const t = linearTiming({ durationInFrames: 10 });

  return (
    <>
      <Audio name="BGM" src={staticFile("bgm-glass-full.wav")} volume={0.5} premountFor={fps} />
      <TransitionSeries>
        <TransitionSeries.Sequence name="00 夜中の電話" durationInFrames={125} premountFor={fps}>
          <SceneSpeed speed={1.28}>
            <GHook />
          </SceneSpeed>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="01 外注だけの課題" durationInFrames={160} premountFor={fps}>
          <SceneSpeed speed={1.22}>
            <GProblem />
          </SceneSpeed>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="02 ルールをAIが覚える" durationInFrames={125} premountFor={fps}>
          <SceneSpeed speed={1.32}>
            <GRag />
          </SceneSpeed>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="03 夜中でもすぐ返事" durationInFrames={145} premountFor={fps}>
          <SceneSpeed speed={1.34}>
            <GChat />
          </SceneSpeed>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="04 緊急だけ人へ" durationInFrames={160} premountFor={fps}>
          <SceneSpeed speed={1.31}>
            <GHybrid />
          </SceneSpeed>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="05 翌朝" durationInFrames={140} premountFor={fps}>
          <SceneSpeed speed={1.39}>
            <GMorning />
          </SceneSpeed>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="06 締め・QR" durationInFrames={100} premountFor={fps}>
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
