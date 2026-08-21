"use client";

import { useEffect } from "react";
import { DustMotes } from "@/components/DustMotes";
import { VideoBreak } from "@/components/VideoBreak";
import { ProcessSection } from "@/sections/Process";
import { BrandFoundationScene } from "@/sections/Home/BrandFoundationScene";
import { EvidenceWall } from "@/sections/Home/EvidenceWall";
import { FinalInvitation } from "@/sections/Home/FinalInvitation";
import { HomePacingDirector } from "@/sections/Home/HomePacingDirector";
import { HomeQuestionsScene } from "@/sections/Home/HomeQuestionsScene";
import { PathsCinematicChapter } from "@/sections/Home/PathsCinematicChapter";
import { StudioCinematicChapter } from "@/sections/Home/StudioCinematicChapter";
import { TatvaSystemLab } from "@/sections/Home/TatvaSystemLab";
import { process as processStages } from "@/data/process";
import { elementColor } from "@/lib/elementColor";
import { HomeV4HeaderDirector } from "./HomeV4HeaderDirector";
import { GuidedView, SceneHandoff } from "./HomeV4Interface";
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
        data-cursor-world="dark"
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

      {/* The homepage used to stack three complete five-element experiences
          inside this single guided chapter: the observatory, pressure lab, and
          a full-screen element carousel. The pressure lab is the clearest
          operating-system demonstration, so it now owns the chapter alone.
          Detailed element exploration stays elsewhere instead of adding two
          more viewports before Studio. */}
      {/* The first Home chapter built as a held scene. Its content already
          fits inside one screen, at roughly 0.9 of a viewport, so the runway
          underneath buys a genuine pause rather than a token one: the frame
          stays still while the page keeps moving, and the pressure lab has a
          moment to be read instead of passing by.

          Chosen for that reason. The taller chapters need their own layouts
          to fit a screen before a frame can hold them, which is a change to
          each chapter rather than a wrapper around it. */}
      <section
        id="tatva"
        data-home-v4-chapter="tatva"
        data-home-chapter="tatva"
        data-home-section="tatva"
        data-cursor-world="dark"
        className="home-v4-chapter home-v4-chapter--tatva bt-scene bt-scene--unfold-short"
        aria-label="The five Tatvas as one operating system"
      >
        <div className="bt-scene__sticky">
          <TatvaSystemLab />
        </div>
      </section>

      <SceneHandoff motif="river" />

      <div
        data-home-v4-chapter="studio"
        data-home-section="studio"
        data-cursor-world="dark"
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
