"use client";

import { useEffect } from "react";
import { DustMotes } from "@/components/DustMotes";
import { VideoBreak } from "@/components/VideoBreak";
import { ElementsSection } from "@/sections/Elements";
import { ProcessSection } from "@/sections/Process";
import { BrandFoundationScene } from "@/sections/Home/BrandFoundationScene";
import { EvidenceWall } from "@/sections/Home/EvidenceWall";
import { FinalInvitation } from "@/sections/Home/FinalInvitation";
import { HomePacingDirector } from "@/sections/Home/HomePacingDirector";
import { HomeQuestionsScene } from "@/sections/Home/HomeQuestionsScene";
import { PathsCinematicChapter } from "@/sections/Home/PathsCinematicChapter";
import { StudioCinematicChapter } from "@/sections/Home/StudioCinematicChapter";
import { TatvaStrip } from "@/sections/Home/TatvaStrip";
import { TatvaSystemLab } from "@/sections/Home/TatvaSystemLab";
import { elements } from "@/data/elements";
import { process as processStages } from "@/data/process";
import { elementColor } from "@/lib/elementColor";
import { GuidedView, LivingCursor, SceneHandoff } from "./HomeV4Interface";
import { V4HiddenCostScene, V4OpeningScene, V4RecognitionScene } from "./HomeV4Scenes";

export function HomeV4Experience() {
  useEffect(() => {
    document.documentElement.classList.add("home-v4-mounted");
    return () => document.documentElement.classList.remove("home-v4-mounted");
  }, []);

  return (
    <div className="home-v4" data-home-v4>
      <LivingCursor />
      <GuidedView />

      <V4OpeningScene />
      <SceneHandoff motif="mist" />

      <V4RecognitionScene />
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

      <SceneHandoff motif="constellation" />

      <section
        id="tatva"
        data-home-v4-chapter="tatva"
        data-home-chapter="tatva"
        data-home-section="tatva"
        data-cursor-world="light"
        className="home-v4-chapter home-v4-chapter--tatva"
        aria-label="The five Tatvas as one operating system"
      >
        <TatvaStrip />
        <TatvaSystemLab />
        <ElementsSection elements={elements} />
      </section>

      <SceneHandoff motif="river" />

      <div
        data-home-v4-chapter="studio"
        data-home-section="studio"
        data-cursor-world="light"
        className="home-v4-chapter home-v4-chapter--studio"
      >
        <StudioCinematicChapter />
      </div>

      <SceneHandoff motif="mist" />

      <div
        id="decision"
        data-home-v4-chapter="decision"
        data-home-chapter="decision"
        data-home-section="decision"
        data-cursor-world="dark"
        className="home-v4-chapter home-v4-chapter--decision"
      >
        <HomeQuestionsScene />
      </div>

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
