"use client";

import { useEffect } from "react";
import { DustMotes } from "@/components/DustMotes";
import { VideoBreak } from "@/components/VideoBreak";
import { ProcessSection } from "@/sections/Process";
import { BrandFoundationScene } from "@/sections/Home/BrandFoundationScene";
import { EvidenceWall } from "@/sections/Home/EvidenceWall";
import { FinalInvitation } from "@/sections/Home/FinalInvitation";
import { HomePacingDirector } from "@/sections/Home/HomePacingDirector";
import { HomeBrandHealthCheck } from "@/sections/Home/HomeBrandHealthCheck";
import { HomeInsightsPreview } from "@/sections/Home/HomeInsightsPreview";
import { HomeQuestionsScene } from "@/sections/Home/HomeQuestionsScene";
import { PathsCinematicChapter } from "@/sections/Home/PathsCinematicChapter";
import { StudioCinematicChapter } from "@/sections/Home/StudioCinematicChapter";
import { TatvaSystemLab } from "@/sections/Home/TatvaSystemLab";
import { process as processStages } from "@/data/process";
import { elementColor } from "@/lib/elementColor";
import { HomeV4HeaderDirector } from "./HomeV4HeaderDirector";
import { SceneHandoff } from "./HomeV4Interface";
import { HomeV4MediaDirector } from "./HomeV4MediaDirector";
import { HomeV4PreludeBridge } from "./HomeV4PreludeBridge";
import { HomeV4ProcessTempo } from "./HomeV4ProcessTempo";
import { HomeV4RecognitionTempo } from "./HomeV4RecognitionTempo";
import { HomeV4TatvaTempo } from "./HomeV4TatvaTempo";
import { V4HiddenCostScene, V4OpeningScene, V4RecognitionScene } from "./HomeV4Scenes";

export function HomeV4Experience() {
  useEffect(() => {
    document.documentElement.classList.add("home-v4-mounted");
    return () => document.documentElement.classList.remove("home-v4-mounted");
  }, []);

  return (
    <div className="home-v4" data-home-v4>
      <HomeV4PreludeBridge />
      <HomeV4MediaDirector />
      <HomeV4HeaderDirector />
      <HomeV4RecognitionTempo />
      <HomeV4ProcessTempo />
      <HomeV4TatvaTempo />
      <V4OpeningScene />
      <SceneHandoff motif="mist" />

      <V4RecognitionScene />
      <SceneHandoff motif="mist" />

      <HomeBrandHealthCheck />
      <SceneHandoff motif="river" />

      <V4HiddenCostScene />
      <SceneHandoff motif="root" />

      <div
        id="foundation"
        data-home-v4-chapter="foundation"
        data-home-chapter="foundation"
        data-home-section="foundation"
        data-cursor-world="dark"
        className="home-v4-chapter home-v4-chapter--foundation"
      >
        <BrandFoundationScene />
      </div>

      <SceneHandoff motif="aperture" />

      <div
        data-home-v4-chapter="paths"
        data-home-chapter="paths"
        data-home-section="paths"
        data-cursor-world="light"
        className="home-v4-chapter home-v4-chapter--paths"
      >
        <PathsCinematicChapter />
      </div>

      <SceneHandoff motif="light" />

      <section
        id="process"
        data-home-v4-chapter="process"
        data-home-chapter="process"
        data-home-section="process"
        data-cursor-world="dark"
        className="home-v4-chapter home-v4-chapter--process"
        aria-label="How the Branding Tatva method moves"
      >
        <ProcessSection stages={processStages} elementColor={elementColor} />
      </section>

      <SceneHandoff motif="paper" />

      <div
        id="evidence"
        data-home-v4-chapter="evidence"
        data-home-chapter="evidence"
        data-home-section="evidence"
        data-cursor-world="dark"
        className="home-v4-chapter home-v4-chapter--evidence"
      >
        <EvidenceWall />
      </div>

      <SceneHandoff motif="river" />

      <section
        id="tatva"
        data-home-v4-chapter="tatva"
        data-home-chapter="tatva"
        data-home-section="tatva"
        data-cursor-world="light"
        className="home-v4-chapter home-v4-chapter--tatva"
        aria-label="The five Tatvas as one operating system"
      >
        <TatvaSystemLab />
      </section>

      <SceneHandoff motif="constellation" />

      <div
        id="studio"
        data-home-v4-chapter="studio"
        data-home-section="studio"
        data-cursor-world="dark"
        className="home-v4-chapter home-v4-chapter--studio"
      >
        <StudioCinematicChapter />
      </div>

      <SceneHandoff motif="constellation" />

      <div
        id="decision"
        data-home-v4-chapter="decision"
        data-home-chapter="decision"
        data-home-section="decision"
        data-cursor-world="light"
        className="home-v4-chapter home-v4-chapter--decision"
      >
        <HomeQuestionsScene />
      </div>

      <SceneHandoff motif="mist" />

      <section
        id="insights-preview"
        data-home-v4-chapter="insights"
        data-home-chapter="insights"
        data-home-section="insights"
        data-cursor-world="dark"
        className="home-v4-chapter home-v4-chapter--insights"
        aria-label="Featured Branding Tatva Insight and two supporting field notes"
      >
        <HomeInsightsPreview />
      </section>

      <SceneHandoff motif="light" />

      <section
        id="invitation"
        data-home-v4-chapter="invitation"
        data-home-chapter="invitation"
        data-home-section="invitation"
        data-cursor-world="dark"
        className="home-v4-chapter home-v4-chapter--invitation invitation-cinematic"
        aria-label="Begin a conversation with Branding Tatva"
      >
        {/* Measured as a held scene and reverted. Its content runs to 1.17
            viewports, so the frame is taller than the screen and cannot stay
            at the top through the whole runway: it held at three of five
            sampled positions rather than five. A frame can only hold cleanly
            when its content fits inside one viewport, which is the rule this
            chapter fails and Tatva passes. Holding it needs its own layout to
            come under a screen first. */}
        <VideoBreak
          src="/videos/higgsfield-silver-tide.mp4"
          poster="/images/higgsfield-silver-tide-poster.jpg"
          quote="Some things only become visible once everything else goes quiet."
          height="auto"
          imagePosition="50% 18%"
          quoteVariant="statement"
          cameraPush
          wordFade
          overlayGradient="linear-gradient(180deg, rgba(16,20,24,0.36) 0%, rgba(16,20,24,0.12) 25%, rgba(16,20,24,0.28) 55%, rgba(17,20,23,0.96) 100%)"
        >
          <DustMotes />
          <FinalInvitation />
        </VideoBreak>
      </section>

      <HomePacingDirector />
    </div>
  );
}
