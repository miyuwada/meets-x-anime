import { Composition, Folder, Still } from "remotion";
import { AloneScene, BinderScene, ComicVideo, FinaleScene, HeroScene } from "./comic/ComicVideo";
import { EHON_H, EHON_W, EhonPage } from "./ehon/Ehon";
import { AiScene, FarScene, OptimizeScene, WalkScene, WarehouseVideo } from "./warehouse/WarehouseVideo";
import { CuteAhaScene } from "./cute/CuteAhaScene";
import { CuteAnalysisScene } from "./cute/CuteAnalysisScene";
import { CuteProblemScene } from "./cute/CuteProblemScene";
import { CuteTeamScene } from "./cute/CuteTeamScene";
import { CuteTitleScene } from "./cute/CuteTitleScene";
import { CuteVideo } from "./cute/CuteVideo";
import { GlassVideo } from "./glass/GlassVideo";
import { CeoHookScene, DetectScene, HrdxStoryVideo, HrdxVideo, QuietScene, SupportScene } from "./hrdx/HrdxVideo";
import { GlassVideoFull } from "./glass/GlassVideoFull";
import { GHook, GHybrid, GProblem, GRag } from "./glass/scenes";
import { PixelVideo } from "./pixel/PixelVideo";
import { BatchScene } from "./pixel/scenes/BatchScene";
import { HookScene } from "./pixel/scenes/HookScene";
import { NumbersScene } from "./pixel/scenes/NumbersScene";
import { PartnerScene } from "./pixel/scenes/PartnerScene";
import { PredictScene } from "./pixel/scenes/PredictScene";
import { ProblemScene as PixelProblemScene } from "./pixel/scenes/ProblemScene";
import { ScanScene } from "./pixel/scenes/ScanScene";
import { SalesAIVideo } from "./SalesAIVideo";
import { AnalysisScene } from "./scenes/AnalysisScene";
import { OutroScene } from "./scenes/OutroScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { SpinScene } from "./scenes/SpinScene";
import { TeamScene } from "./scenes/TeamScene";
import { TitleScene } from "./scenes/TitleScene";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SalesAIColumn"
        component={SalesAIVideo}
        durationInFrames={690}
        fps={30}
        width={1920}
        height={1080}
      />
      <Folder name="Scenes">
        <Composition id="Title" component={TitleScene} durationInFrames={75} fps={30} width={1920} height={1080} />
        <Composition id="Problem" component={ProblemScene} durationInFrames={120} fps={30} width={1920} height={1080} />
        <Composition id="Analysis" component={AnalysisScene} durationInFrames={135} fps={30} width={1920} height={1080} />
        <Composition id="Spin" component={SpinScene} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="Team" component={TeamScene} durationInFrames={120} fps={30} width={1920} height={1080} />
        <Composition id="Outro" component={OutroScene} durationInFrames={150} fps={30} width={1920} height={1080} />
      </Folder>
      <Composition
        id="SalesAIColumnCute"
        component={CuteVideo}
        durationInFrames={690}
        fps={30}
        width={1920}
        height={1080}
      />
      <Folder name="CuteScenes">
        <Composition id="CuteTitle" component={CuteTitleScene} durationInFrames={75} fps={30} width={1920} height={1080} />
        <Composition id="CuteProblem" component={CuteProblemScene} durationInFrames={120} fps={30} width={1920} height={1080} />
        <Composition id="CuteAnalysis" component={CuteAnalysisScene} durationInFrames={135} fps={30} width={1920} height={1080} />
        <Composition id="CuteAha" component={CuteAhaScene} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="CuteTeam" component={CuteTeamScene} durationInFrames={120} fps={30} width={1920} height={1080} />
      </Folder>
      <Composition
        id="ImageAIColumnPixel"
        component={PixelVideo}
        durationInFrames={1220}
        fps={30}
        width={1920}
        height={1080}
      />
      <Folder name="PixelScenes">
        <Composition id="PxHook" component={HookScene} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="PxProblem" component={PixelProblemScene} durationInFrames={200} fps={30} width={1920} height={1080} />
        <Composition id="PxScan" component={ScanScene} durationInFrames={240} fps={30} width={1920} height={1080} />
        <Composition id="PxNumbers" component={NumbersScene} durationInFrames={210} fps={30} width={1920} height={1080} />
        <Composition id="PxPredict" component={PredictScene} durationInFrames={175} fps={30} width={1920} height={1080} />
        <Composition id="PxBatch" component={BatchScene} durationInFrames={210} fps={30} width={1920} height={1080} />
        <Composition id="PxPartner" component={PartnerScene} durationInFrames={180} fps={30} width={1920} height={1080} />
      </Folder>
      <Composition
        id="NightBpoColumnX"
        component={GlassVideo}
        durationInFrames={795}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="NightBpoColumnXFull"
        component={GlassVideoFull}
        durationInFrames={895}
        fps={30}
        width={1920}
        height={1080}
      />
      <Folder name="GlassScenes">
        <Composition id="GxHook" component={GHook} durationInFrames={160} fps={30} width={1920} height={1080} />
        <Composition id="GxProblem" component={GProblem} durationInFrames={195} fps={30} width={1920} height={1080} />
        <Composition id="GxRag" component={GRag} durationInFrames={165} fps={30} width={1920} height={1080} />
        <Composition id="GxHybrid" component={GHybrid} durationInFrames={210} fps={30} width={1920} height={1080} />
      </Folder>
      <Composition id="HrdxQuietQuitting" component={HrdxVideo} durationInFrames={795} fps={30} width={1920} height={1080} />
      <Composition id="HrdxStoryboard" component={HrdxStoryVideo} durationInFrames={825} fps={30} width={1920} height={1080} />
      <Composition id="WarehousePicto" component={WarehouseVideo} durationInFrames={780} fps={30} width={1920} height={1080} />
      <Folder name="WarehouseScenes">
        <Composition id="WhWalk" component={WalkScene} durationInFrames={165} fps={30} width={1920} height={1080} />
        <Composition id="WhFar" component={FarScene} durationInFrames={180} fps={30} width={1920} height={1080} />
        <Composition id="WhAi" component={AiScene} durationInFrames={180} fps={30} width={1920} height={1080} />
        <Composition id="WhOpt" component={OptimizeScene} durationInFrames={210} fps={30} width={1920} height={1080} />
      </Folder>
      <Composition id="LxpComic" component={ComicVideo} durationInFrames={750} fps={30} width={1920} height={1080} />
      <Folder name="ComicScenes">
        <Composition id="CmBinder" component={BinderScene} durationInFrames={165} fps={30} width={1920} height={1080} />
        <Composition id="CmAlone" component={AloneScene} durationInFrames={165} fps={30} width={1920} height={1080} />
        <Composition id="CmHero" component={HeroScene} durationInFrames={195} fps={30} width={1920} height={1080} />
        <Composition id="CmFinale" component={FinaleScene} durationInFrames={180} fps={30} width={1920} height={1080} />
      </Folder>
      <Folder name="Ehon">
        <Still id="Ehon1" component={EhonPage} width={EHON_W} height={EHON_H} defaultProps={{ page: 1 }} />
        <Still id="Ehon2" component={EhonPage} width={EHON_W} height={EHON_H} defaultProps={{ page: 2 }} />
        <Still id="Ehon3" component={EhonPage} width={EHON_W} height={EHON_H} defaultProps={{ page: 3 }} />
        <Still id="Ehon4" component={EhonPage} width={EHON_W} height={EHON_H} defaultProps={{ page: 4 }} />
      </Folder>
      <Folder name="HrdxScenes">
        <Composition id="HxCeoHook" component={CeoHookScene} durationInFrames={165} fps={30} width={1920} height={1080} />
        <Composition id="HxQuiet" component={QuietScene} durationInFrames={210} fps={30} width={1920} height={1080} />
        <Composition id="HxDetect" component={DetectScene} durationInFrames={240} fps={30} width={1920} height={1080} />
        <Composition id="HxSupport" component={SupportScene} durationInFrames={240} fps={30} width={1920} height={1080} />
      </Folder>
    </>
  );
};
