"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
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

export function BrandFoundationScene() {
  const wrapperRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const sceneInView = useInView(wrapperRef, { amount: 0.08 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const active = FOUNDATION_LAYERS[activeIndex];
  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ["start end", "end start"] });
  const landscapeScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.1]);
  const landscapeY = useTransform(scrollYProgress, [0, 1], [14, -14]);
  const sunlightX = useTransform(scrollYProgress, [0, 1], ["-45%", "260%"]);

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
    if (index === activeIndex) return;
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
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
    <section ref={wrapperRef} className={styles.section} aria-labelledby="brand-foundation-title">
      <div className={styles.scene}>
        <motion.div className={styles.landscape} data-foundation-landscape aria-hidden="true" style={{ scale: prefersReducedMotion ? 1 : landscapeScale, y: prefersReducedMotion ? 0 : landscapeY }}>
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
        <motion.div className={styles.sunlight} data-foundation-sunlight aria-hidden="true" style={{ x: prefersReducedMotion ? 0 : sunlightX, opacity: prefersReducedMotion ? 0 : 0.3 }} />

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
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                  data-cursor-label="explore"
                >
                  <span aria-hidden="true">{layer.number}</span>{layer.label}
                </button>
              ))}
            </div>

            <div id="foundation-layer-panel" role="tabpanel" aria-labelledby={`foundation-tab-${active.id}`} tabIndex={0} className={styles.panel}>
              <motion.div key={active.id} initial={prefersReducedMotion ? false : { x: direction * 10 }} animate={{ x: 0 }} transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}>
                <h3>{active.title}</h3>
                <p className={styles.description}>{active.description}</p>
                <p className={styles.outputLabel}>What we define</p>
                <ul className={styles.outputs}>
                  {active.produces.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </motion.div>
            </div>

            <Link href="/services#package-brand-beginning" className={styles.link} data-magnetic data-cursor-label="foundation">
              Explore the foundation path <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
