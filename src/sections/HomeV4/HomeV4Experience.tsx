"use client";

import { useEffect } from "react";
import { VideoBreak } from "@/components/VideoBreak";
import { ProcessSection } from "@/sections/Process";
import { EvidenceWall } from "@/sections/Home/EvidenceWall";
import { FinalInvitation } from "@/sections/Home/FinalInvitation";
import { HomePacingDirector } from "@/sections/Home/HomePacingDirector";
import { HomeBrandHealthCheck } from "@/sections/Home/HomeBrandHealthCheck";
import { HomeQuestionsScene } from "@/sections/Home/HomeQuestionsScene";
import { PathsCinematicChapter } from "@/sections/Home/PathsCinematicChapter";
import { StudioCinematicChapter } from "@/sections/Home/StudioCinematicChapter";
import { process as processStages } from "@/data/process";
import { elementColor } from "@/lib/elementColor";
import { SceneHandoff } from "./HomeV4Interface";
import { HomeV4MediaDirector } from "./HomeV4MediaDirector";
import { HomeV4PreludeBridge } from "./HomeV4PreludeBridge";
import { HomeV4SeamDirector } from "./HomeV4SeamDirector";
import { V4HiddenCostScene, V4OpeningScene } from "./HomeV4Scenes";

export function HomeV4Experience() {
  useEffect(() => {
    document.documentElement.classList.add("home-v4-mounted");
    return () => document.documentElement.classList.remove("home-v4-mounted");
  }, []);

  return (
    <div className="home-v4" data-home-v4>
      <HomeV4PreludeBridge />
      <HomeV4MediaDirector />
      <HomeV4SeamDirector />
      <V4OpeningScene />
      <SceneHandoff motif="mist" preservePrevious />

      <HomeBrandHealthCheck />
      <SceneHandoff motif="river" />

      <V4HiddenCostScene />
      <SceneHandoff motif="root" />

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
        data-cursor-world="light"
        className="home-v4-chapter home-v4-chapter--process"
        aria-label="How the Branding Tatva method moves"
      >
        <ProcessSection stages={processStages} elementColor={elementColor} />
      </section>

      <SceneHandoff motif="constellation" />

      <div
        id="studio"
        data-home-v4-chapter="studio"
        data-home-chapter="studio"
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
        id="invitation"
        data-home-v4-chapter="invitation"
        data-home-chapter="invitation"
        data-home-section="invitation"
        data-cursor-world="light"
        className="home-v4-chapter home-v4-chapter--invitation invitation-cinematic"
        aria-label="Begin a conversation with Branding Tatva"
      >
        <VideoBreak
          src="/videos/higgsfield-silver-tide.mp4"
          poster="/images/higgsfield-silver-tide-poster.jpg"
          height="100svh"
          imagePosition="52% 48%"
          cameraPush
          managedByHomepage
          homePlaybackRate={0.84}
          overlayGradient="linear-gradient(180deg, rgba(217,201,170,0.34) 0%, rgba(216,209,193,0.12) 18%, transparent 34%), linear-gradient(102deg, rgba(244,238,224,0.92) 0%, rgba(244,238,224,0.72) 42%, rgba(238,224,198,0.60) 70%, rgba(238,224,198,0.88) 100%)"
        >
          <FinalInvitation />
        </VideoBreak>
      </section>

      <HomePacingDirector />
    </div>
  );
}
