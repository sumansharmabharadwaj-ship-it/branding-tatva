"use client";

import { useEffect } from "react";
import { ProcessSection } from "@/sections/Process";
import { BrandFoundationScene } from "@/sections/Home/BrandFoundationScene";
import { EvidenceWall } from "@/sections/Home/EvidenceWall";
import { FinalInvitation } from "@/sections/Home/FinalInvitation";
import { HomePacingDirector } from "@/sections/Home/HomePacingDirector";
import { HomeBrandHealthCheck } from "@/sections/Home/HomeBrandHealthCheck";
import { HomeQuestionsScene } from "@/sections/Home/HomeQuestionsScene";
import { PathsCinematicChapter } from "@/sections/Home/PathsCinematicChapter";
import { StudioCinematicChapter } from "@/sections/Home/StudioCinematicChapter";
import { TatvaStrip } from "@/sections/Home/TatvaStrip";
import { TatvaSystemLab } from "@/sections/Home/TatvaSystemLab";
import { process as processStages } from "./homeSnapshotProcess";
import { elementColor } from "@/lib/elementColor";
import { HomeV4HeaderDirector } from "./HomeV4HeaderDirector";
import { GuidedView, SceneHandoff } from "./HomeV4Interface";
import { HomeV4MediaDirector } from "./HomeV4MediaDirector";
import { HomeV4PreludeBridge } from "./HomeV4PreludeBridge";
import { HomeV4SceneRhythm } from "./HomeV4SceneRhythm";
import { HomeV4ScrollCamera } from "./HomeV4ScrollCamera";
import { V4CostStackScene } from "./CostStackScene";
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
      <HomeV4SceneRhythm />
      {/* HomeV4SeamDirector is deliberately left unmounted. It writes the
          same seven --home-handoff-* custom properties to the same
          .home-v4-handoff elements that HomeV4ScrollCamera already
          writes (ScrollCamera's set is a strict superset, adding
          --home-handoff-phase), so mounting both puts two rAF loops in a
          race over the same properties every frame, where whichever
          writes last wins and neither director's intent is reliable.
          It was mounted to restore motion to chapters measured as
          static on a local dev server that was serving zero hydrated
          JavaScript at the time, because the site's own CSP was
          blocking it. Measured against production instead, nine of
          eleven chapters were already scroll responsive with NEITHER
          director mounted, so the motion never depended on this. */}
      <HomeV4ScrollCamera />
      <GuidedView />

      <V4OpeningScene />
      <SceneHandoff motif="mist" />

      <V4RecognitionScene />
      <SceneHandoff motif="river" />

      <V4HiddenCostScene />
      <SceneHandoff motif="light" />

      {/* The three costs, stacked, on the orangery field. Gives the front
          half of Home the dark chapter it was missing: hero, cream,
          cream, cream was most of why the early scroll read as flat.
          The handoff above blends cream into this ground, the one below
          carries it on into the foundation chapter. */}
      <V4CostStackScene />
      <SceneHandoff motif="root" />

      <div
        id="foundation"
        tabIndex={-1}
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
        tabIndex={-1}
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
        data-cursor-world="dark"
        className="home-v4-chapter home-v4-chapter--tatva"
        aria-label="The five Tatvas as one operating system"
      >
        <TatvaStrip />
        <TatvaSystemLab />
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

      <SceneHandoff motif="constellation" />

      {/* The brand health check, back on the page. It was a complete,
          working conversion feature sitting in the codebase imported by
          nothing, so no visitor could reach it.
          Placed here rather than earlier on purpose: the recognition
          chapter near the top already asks the visitor to name their own
          situation, so a self diagnostic up there would make the page
          classify the same person twice. After the decision chapter it
          is a verdict on what they have just been taught, and it hands
          straight into the invitation.
          It renders its own <section> with data-home-v4-chapter, so it
          needs no wrapper; its stylesheet is imported in page.tsx. */}
      <HomeBrandHealthCheck />

      <SceneHandoff motif="light" />

      <section
        id="invitation"
        tabIndex={-1}
        data-home-v4-chapter="invitation"
        data-home-chapter="invitation"
        data-home-section="invitation"
        data-cursor-world="dark"
        className="home-v4-chapter home-v4-chapter--invitation"
        aria-label="Begin a conversation with Branding Tatva"
      >
        <FinalInvitation />
      </section>

      <HomePacingDirector />
    </div>
  );
}
