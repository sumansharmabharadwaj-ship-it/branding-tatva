"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useLenis } from "@/components/SmoothScrollProvider";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { FeaturedWorkHero } from "@/components/FeaturedWorkHero";
import { FeaturedSecondaryCard } from "@/components/FeaturedSecondaryCard";
import type { Project } from "@/data/projects";
import { stageOpacity } from "@/lib/pinnedStageOpacity";

// Same PinnedSlider/PinnedJourney/ElementsIntroPinned mechanism, applied
// to "Selected work" — deliberately 2 stages, not 3 (one per card).
// page.tsx's own comment on this section already states the intent:
// "one large story plus two quiet footnotes, not three identical
// cards." Giving each FeaturedSecondaryCard equal full-screen weight to
// FeaturedWorkHero would contradict that hierarchy, so stage 0 is the
// hero project alone and stage 1 is the existing side-by-side pair,
// shown together exactly as they already are.
//
// Neither card component depends on scroll-position assumptions that
// conflict with permanent mounting + opacity toggling: FeaturedWorkHero
// uses useLazyMount (image load gate) and useTilt (mouse-driven), its
// Ken Burns drift runs on its own repeat: Infinity loop rather than
// whileInView; FeaturedSecondaryCard uses local hover state + useTilt.
//
// Desktop/motion-allowed only, matching every other pinned component's
// convention (CSS-hidden dual-render, same as ElementsIntro — image
// loading here is next/image's own lazy-load, not an eager <video>, so
// the dual-mount concern PinnedVideoBreak works around doesn't apply).
//
// Same STAGE_SPEED pacing fix as PinnedSlider/ElementsIntroPinned/
// MeadowClosing — direct, repeated feedback that pinned scrolling
// site-wide felt too fast to actually settle on a stage. Wrapper
// height below is derived from STAGE_SPEED, not hardcoded.
// Dialed back from an earlier 1.8/+200vh pass — applied identically
// across five pinned sections on the same pages, that compounded into
// a document roughly 40 screens tall and direct feedback the whole
// site's scrolling was unusable. The real fix for "no settle point" is
// stageOpacity's hold plateau, which is a fraction of whatever
// distance exists regardless of STAGE_SPEED — so a small multiplier
// plus a 1-screen tail buffer (was 2) keeps the same settle behavior
// without inflating total scroll distance.
const STAGE_SPEED = 1.15;

export function SelectedWorkPinned({ featured }: { featured: Project[] }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion || !featured[0]) {
    return <SelectedWorkFallback featured={featured} />;
  }

  return (
    <>
      <div className="hidden sm:block">
        <SelectedWorkPinnedDesktop featured={featured} />
      </div>
      <div className="sm:hidden">
        <SelectedWorkFallback featured={featured} />
      </div>
    </>
  );
}

function SelectedWorkPinnedDesktop({ featured }: { featured: Project[] }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const lenis = useLenis();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    function update() {
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      const scrollDistance = 1 * window.innerHeight * STAGE_SPEED;
      const raw = scrollDistance > 0 ? -rect.top / scrollDistance : 0;
      const progress = Math.min(1, Math.max(0, raw));
      const idx = Math.min(1, Math.round(progress));
      if (idx !== activeIndexRef.current) {
        activeIndexRef.current = idx;
        setActiveIndex(idx);
      }
      stageRefs.current.forEach((stage, i) => {
        if (!stage) return;
        stage.style.opacity = String(stageOpacity(progress, i));
      });
    }

    update();
    const unsubscribe = lenis?.on("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      unsubscribe?.();
      window.removeEventListener("resize", update);
    };
  }, [lenis]);

  const hero = featured[0];
  const secondary = featured.slice(1);

  return (
    <div ref={wrapperRef} className="relative bg-soil" style={{ height: `${100 * STAGE_SPEED + 100}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Behind both stages — stage 0's FeaturedWorkHero already fills
            the whole frame edge-to-edge with its own photo, so this
            only actually shows through in stage 1's Container gutters
            and the gap between the two secondary cards, which otherwise
            read as flat, motionless bg-soil. Was own-leaves-cabin.mp4 —
            direct feedback to replace it with a waterfall in the
            mountains; pixabay-alpine-waterfall.mp4 is a genuinely
            moving cascade (frame-sampled across its full duration
            before swapping in), not a static-reading clip. */}
        <BackgroundVideo
          video="/videos/pixabay-alpine-waterfall.mp4"
          poster="/images/pixabay-alpine-waterfall-poster.jpg"
        />
        <div
          ref={(node) => {
            stageRefs.current[0] = node;
          }}
          className="absolute inset-0 [&>a]:h-full [&>a]:min-h-0"
          style={{ opacity: 1, pointerEvents: activeIndex === 0 ? "auto" : "none" }}
          aria-hidden={activeIndex !== 0}
        >
          <FeaturedWorkHero
            href={`/work/${hero.slug}`}
            image={hero.cardImage ?? "/images/own-forest-clearing.jpg"}
            industry={hero.industry}
            title={hero.title}
            hook={hero.hook}
            outcome={hero.outcome}
            stats={hero.stats}
            accent={hero.accent}
          />
        </div>

        <div
          ref={(node) => {
            stageRefs.current[1] = node;
          }}
          className="absolute inset-0 flex items-center"
          style={{ opacity: 0, pointerEvents: activeIndex === 1 ? "auto" : "none" }}
          aria-hidden={activeIndex !== 1}
        >
          <Container>
            <div className="grid gap-10 sm:grid-cols-2">
              {secondary.map((project) => (
                <FeaturedSecondaryCard key={project.slug} project={project} />
              ))}
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
}

function SelectedWorkFallback({ featured }: { featured: Project[] }) {
  const hero = featured[0];
  const secondary = featured.slice(1);

  return (
    <div className="relative overflow-hidden bg-soil py-20 sm:py-28">
      <BackgroundVideo
        video="/videos/pixabay-alpine-waterfall.mp4"
        poster="/images/pixabay-alpine-waterfall-poster.jpg"
      />
      <div className="absolute inset-0 bg-soil/70" />
      {hero && (
        <Reveal>
          <div className="relative">
            <FeaturedWorkHero
              href={`/work/${hero.slug}`}
              image={hero.cardImage ?? "/images/own-forest-clearing.jpg"}
              industry={hero.industry}
              title={hero.title}
              outcome={hero.outcome}
              stats={hero.stats}
              accent={hero.accent}
            />
          </div>
        </Reveal>
      )}
      <Container className="relative">
        <div className="mt-10 grid gap-10 sm:grid-cols-2">
          {secondary.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.1}>
              <FeaturedSecondaryCard project={project} />
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  );
}
