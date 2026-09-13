"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useScrollDrivenVisualizer } from "@/hooks/useScrollDrivenVisualizer";
import { useEffect, useId, useRef, type KeyboardEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useInView, useIsPresent, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import styles from "./BrandFoundation.module.css";

const FOUNDATION_LAYERS = [
  {
    id: "category",
    number: "01",
    label: "Category",
    title: "Decide what people compare you with.",
    description: "Name the market you belong to, the alternatives buyers consider, and the expectations your offer needs to meet or change.",
    produces: ["Category definition", "Competitive context", "Market boundaries"],
  },
  {
    id: "audience",
    number: "02",
    label: "Audience",
    title: "Know what makes the right buyer choose.",
    description: "Understand the situation, hesitation, and expectations behind the decision. Give the brand a specific person to speak to.",
    produces: ["Audience priorities", "Decision barriers", "Perception map"],
  },
  {
    id: "belief",
    number: "03",
    label: "Belief",
    title: "Choose a promise the business can keep.",
    description: "What should people consistently associate with you? Settle the belief and the evidence that language, identity, and experience must reinforce.",
    produces: ["Core brand belief", "Reasons to believe", "Message territory"],
  },
  {
    id: "position",
    number: "04",
    label: "Position",
    title: "Make the reason to choose you clear.",
    description: "Bring the category, audience, and belief into one position. Give the team a shared basis for deciding what belongs in the brand.",
    produces: ["Positioning statement", "Value proposition", "Decision filters"],
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

function FoundationDecision({ layer, direction, reducedMotion }: {
  layer: (typeof FOUNDATION_LAYERS)[number];
  direction: number;
  reducedMotion: boolean;
}) {
  const present = useIsPresent();
  const arrival = reducedMotion ? false : { opacity: 0, y: direction * 16 };

  return (
    <motion.div
      className={styles.panelCopy}
      aria-hidden={!present}
      inert={!present}
      initial={false}
      animate={{ opacity: 1, x: 0 }}
      exit="depart"
      variants={{ depart: (nextDirection: number) => ({
        opacity: 0,
        x: reducedMotion ? 0 : -nextDirection * 12,
        transition: { duration: reducedMotion ? 0 : 0.16, ease: EASE },
      }) }}
    >
      <motion.h3 initial={arrival} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 0.42, ease: EASE }}>
        {layer.title}
      </motion.h3>
      <motion.p className={styles.description} initial={arrival} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 0.42, delay: reducedMotion ? 0 : 0.045, ease: EASE }}>
        {layer.description}
      </motion.p>
      <motion.div initial={arrival} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 0.42, delay: reducedMotion ? 0 : 0.09, ease: EASE }}>
        <p className={styles.outputLabel}>What we define</p>
        <ul className={styles.outputs}>
          {layer.produces.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </motion.div>
    </motion.div>
  );
}

export function BrandFoundationScene() {
  const wrapperRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectionId = useId();
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const hasScrollRunway = useMediaQuery("(min-width: 1181px) and (min-height: 901px) and (pointer: fine)");
  const cinematicMotion = hasScrollRunway && !prefersReducedMotion;
  const sceneInView = useInView(wrapperRef, { amount: 0.08 });
  const previousIndexRef = useRef(0);
  const visualizer = useScrollDrivenVisualizer({
    count: FOUNDATION_LAYERS.length,
    target: wrapperRef,
    enabled: sceneInView && cinematicMotion,
    reducedMotion: !cinematicMotion,
  });
  const activeIndex = visualizer.activeIndex;
  const direction = activeIndex >= previousIndexRef.current ? 1 : -1;
  const active = FOUNDATION_LAYERS[activeIndex];
  const scrollYProgress = visualizer.scrollYProgress;
  // A close view opens, pushes toward the roots, then resolves to the wider
  // frame. The reading card stays still while scroll drives the camera.
  const landscapeScale = useTransform(scrollYProgress, [0, 0.34, 0.67, 1], [1.32, 1.12, 1.22, 1.08]);
  const landscapeX = useTransform(scrollYProgress, [0, 0.34, 0.67, 1], ["3%", "-1%", "1.5%", "-2%"]);
  const landscapeY = useTransform(scrollYProgress, [0, 0.34, 0.67, 1], [20, -18, -8, 8]);
  const sunlightX = useTransform(scrollYProgress, [0, 1], ["-45%", "260%"]);

  useEffect(() => {
    previousIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const videoAtEffectStart = videoRef.current;
    function syncPlayback() {
      const video = videoRef.current;
      if (!video) return;
      if (prefersReducedMotion || !sceneInView || document.hidden) {
        video.pause();
        return;
      }
      void video.play().catch(() => {});
    }
    syncPlayback();
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      document.removeEventListener("visibilitychange", syncPlayback);
      videoAtEffectStart?.pause();
    };
  }, [prefersReducedMotion, sceneInView]);

  function choose(index: number) {
    visualizer.choose(index);
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % FOUNDATION_LAYERS.length;
    else if (event.key === "ArrowLeft") next = (index + FOUNDATION_LAYERS.length - 1) % FOUNDATION_LAYERS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = FOUNDATION_LAYERS.length - 1;
    else return;
    event.preventDefault();
    choose(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <section
      ref={wrapperRef}
      className={styles.section}
      aria-labelledby="brand-foundation-title"
      data-scroll-story="foundation"
      data-foundation-state={activeIndex}
      data-foundation-motion={cinematicMotion ? "scroll" : "static"}
    >
      <div className={styles.scene}>
        <motion.div className={styles.landscape} data-foundation-landscape aria-hidden="true" style={{ scale: cinematicMotion ? landscapeScale : 1, x: cinematicMotion ? landscapeX : 0, y: cinematicMotion ? landscapeY : 0 }}>
          <video
            ref={videoRef}
            muted
            loop
            autoPlay={Boolean(sceneInView && !prefersReducedMotion)}
            playsInline
            preload={sceneInView ? "metadata" : "none"}
            poster="/images/pexels-root-network-poster.jpg"
          >
            <source src="/videos/pexels-root-network.webm" type="video/webm" />
            <source src="/videos/pexels-root-network.mp4" type="video/mp4" />
          </video>
        </motion.div>
        <div className={styles.scrim} aria-hidden="true" />
        <motion.div className={styles.sunlight} data-foundation-sunlight aria-hidden="true" style={{ x: cinematicMotion ? sunlightX : 0, opacity: cinematicMotion ? 0.3 : 0 }} />

        <div className={styles.shell}>
          <div className={styles.content}>
            <header>
              <p className={styles.eyebrow}>03 · The foundation</p>
              <h2 id="brand-foundation-title">The decisions people never see.</h2>
              <p className={styles.intro}>What should people understand, trust, and remember before they see the logo?</p>
            </header>

            <div className={styles.tabs} role="tablist" aria-label="Brand foundation layers">
              {FOUNDATION_LAYERS.map((layer, index) => (
                <button
                  key={layer.id}
                  ref={(node) => { tabRefs.current[index] = node; }}
                  type="button"
                  role="tab"
                  id={`foundation-tab-${layer.id}`}
                  aria-selected={index === activeIndex}
                  aria-controls="foundation-layer-panel"
                  tabIndex={index === activeIndex ? 0 : -1}
                  className={styles.tab}
                  onClick={() => choose(index)}
                  onPointerEnter={() => visualizer.preview(index)}
                  onPointerLeave={(event) => {
                    if (document.activeElement !== event.currentTarget) visualizer.releasePreview();
                  }}
                  onFocus={() => visualizer.preview(index)}
                  onBlur={visualizer.releasePreview}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                  data-cursor-label="explore"
                >
                  {index === activeIndex && <motion.span
                    className={styles.selection}
                    layoutId={selectionId}
                    aria-hidden="true"
                    transition={{ duration: prefersReducedMotion ? 0 : 0.42, ease: EASE }}
                  />}
                  <span className={styles.tabNumber} aria-hidden="true">{layer.number}</span>
                  <span className={styles.tabLabel}>{layer.label}</span>
                </button>
              ))}
            </div>

            <div id="foundation-layer-panel" role="tabpanel" aria-labelledby={`foundation-tab-${active.id}`} tabIndex={0} className={styles.panel}>
              <AnimatePresence initial={false} mode="sync" custom={direction}>
                <FoundationDecision key={active.id} layer={active} direction={direction} reducedMotion={prefersReducedMotion} />
              </AnimatePresence>
            </div>

            <Link href="/services#package-brand-beginning" className={styles.link} data-magnetic data-cursor-label="foundation">
              Walk the foundation path <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
