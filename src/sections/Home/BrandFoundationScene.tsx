"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useScrollDrivenVisualizer } from "@/hooks/useScrollDrivenVisualizer";
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { animate, motion, useAnimationControls, useInView, useMotionValue, useMotionValueEvent, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import styles from "./BrandFoundation.module.css";

const FOUNDATION_LAYERS = [
  {
    id: "category",
    number: "01",
    label: "Category",
    title: "Know the alternatives your buyer considers.",
    description: "Buyers may compare you with another provider, an internal team, or doing nothing. We identify the alternatives your offer must answer.",
    produces: ["Buyer alternatives", "Category choice", "Market expectations"],
    mapHint: "Your alternatives",
    connectionCopy: "Start with the options your buyer already knows.",
  },
  {
    id: "audience",
    number: "02",
    label: "Audience",
    title: "What makes your buyer ready to choose?",
    description: "We identify the problem buyers need solved, what makes them hesitate, and the evidence they need before they commit.",
    produces: ["Priority buyer", "Buying barriers", "Reasons to choose"],
    mapHint: "Who needs you",
    connectionCopy: "Speak to the decision your buyer needs to make.",
  },
  {
    id: "belief",
    number: "03",
    label: "Belief",
    title: "Make a promise you can prove.",
    description: "We match the promise to evidence your business can show, then decide how your words, design, and service should carry it.",
    produces: ["Brand promise", "Supporting evidence", "Message priorities"],
    mapHint: "What you prove",
    connectionCopy: "Give people evidence for the promise you make.",
  },
  {
    id: "position",
    number: "04",
    label: "Position",
    title: "Give every touchpoint the same direction.",
    description: "We bring the buyer, alternatives, and proof into one position your team can use across the website, sales pitch, and next campaign.",
    produces: ["Positioning statement", "Reason to choose", "Brand decision rules"],
    mapHint: "Why choose you",
    connectionCopy: "One reason to choose you, carried through the brand.",
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;
type FoundationLayer = (typeof FOUNDATION_LAYERS)[number];

function FoundationReading({ layer }: { layer: FoundationLayer }) {
  return <><h3>{layer.title}</h3><p className={styles.description}>{layer.description}</p></>;
}

/* A visual echo of the reading, not a second set of controls. The three
 * inputs converge on Position; the same activeIndex drives both views. */
function FoundationMap({ activeIndex, reducedMotion }: { activeIndex: number; reducedMotion: boolean }) {
  const mapId = useId();
  return (
    <div className={styles.map} aria-hidden="true" data-foundation-map>
      <p className={styles.mapLabel}>How a position takes shape</p>
      <div className={styles.mapCanvas}>
        <svg className={styles.mapLines} viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
          {FOUNDATION_LAYERS.slice(0, 3).map((layer, index) => {
            const connected = activeIndex === index || activeIndex === 3;
            const clipId = `${mapId}-${layer.id}`;
            const y = Number(((index + .5) * 100 / 3).toFixed(3));
            const path = `M 40 ${y} C 51 ${y}, 49 50, 60 50`;
            return (
              <g key={layer.id} data-map-connection={layer.id} data-connected={connected}>
                <defs>
                  <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
                    {/* Reveal along the actual coordinate system: normalized
                        stroke dashes distort with non-scaling strokes. */}
                    <motion.rect
                      key={reducedMotion ? "settled" : "animated"}
                      x="39.5" y="0" height="100"
                      initial={false}
                      animate={{ width: connected ? 21 : 0 }}
                      transition={{ duration: reducedMotion ? 0 : connected ? .56 : .2, delay: !reducedMotion && activeIndex === 3 ? index * .08 : 0, ease: EASE }}
                    />
                  </clipPath>
                </defs>
                <path d={path} vectorEffect="non-scaling-stroke" />
                <path className={styles.mapSignal} d={path} vectorEffect="non-scaling-stroke" clipPath={`url(#${clipId})`} />
              </g>
            );
          })}
        </svg>
        {FOUNDATION_LAYERS.slice(0, 3).map((layer, index) => (
          <div
            key={layer.id}
            className={styles.mapInput}
            data-active={activeIndex === index}
            data-connected={activeIndex === index || activeIndex === 3}
            style={{ gridRow: index + 1 }}
          >
            <span>{layer.number}</span>
            <strong>{layer.label}</strong>
            <small className={styles.mapHint}>{layer.mapHint}</small>
          </div>
        ))}
        <div className={styles.mapPosition} data-active={activeIndex === 3}>
          <span>04</span>
          <strong>Position</strong>
          <small className={styles.mapHint}>{FOUNDATION_LAYERS[3].mapHint}</small>
        </div>
      </div>
      <p className={`${styles.mapCaption} ${styles.readingStack}`}>
        <span className={styles.readingMeasure}>
          {FOUNDATION_LAYERS.map((layer) => <span key={layer.id}>{layer.connectionCopy}</span>)}
        </span>
        <motion.span
          key={`${activeIndex}-${reducedMotion}`}
          initial={reducedMotion ? false : { y: 6 }}
          animate={{ y: 0 }}
          transition={{ duration: reducedMotion ? 0 : .36, ease: EASE }}
          data-foundation-map-reading
        >
          {FOUNDATION_LAYERS[activeIndex].connectionCopy}
        </motion.span>
      </p>
    </div>
  );
}

function FoundationDecision({ layer, direction, reducedMotion }: {
  layer: FoundationLayer;
  direction: number;
  reducedMotion: boolean;
}) {
  const controls = useAnimationControls();
  const outputControls = useAnimationControls();
  const ruleControls = useAnimationControls();
  const previousLayer = useRef(layer.id);
  const settle = useCallback(() => {
    controls.stop();
    outputControls.stop();
    ruleControls.stop();
    controls.set({ x: 0, y: 0 });
    outputControls.set({ x: 0 });
    ruleControls.set({ scaleY: 1 });
  }, [controls, outputControls, ruleControls]);

  useEffect(() => {
    const changed = previousLayer.current !== layer.id;
    previousLayer.current = layer.id;
    settle();
    if (reducedMotion || !changed) return;
    controls.set({ x: direction * 8, y: 3 });
    outputControls.set({ x: direction * -6 });
    ruleControls.set({ scaleY: 0 });
    void controls.start({ x: 0, y: 0, transition: { duration: .38, ease: EASE } });
    void outputControls.start({ x: 0, transition: { duration: .42, ease: EASE } });
    void ruleControls.start({ scaleY: 1, transition: { duration: .58, ease: EASE } });
    return () => { controls.stop(); outputControls.stop(); ruleControls.stop(); };
  }, [controls, outputControls, ruleControls, direction, layer.id, reducedMotion, settle]);

  return (
    <div
      id="foundation-layer-panel"
      role="tabpanel"
      aria-labelledby={`foundation-tab-${layer.id}`}
      tabIndex={0}
      className={styles.panel}
      onFocusCapture={settle}
      onPointerDown={settle}
    >
      <div className={styles.panelCopy} data-foundation-decision>
        <div className={styles.readingStack}>
          <div className={styles.readingMeasure} aria-hidden="true" inert>
            {FOUNDATION_LAYERS.map((item) => <div key={item.id}><FoundationReading layer={item} /></div>)}
          </div>
          <motion.div initial={false} animate={controls} data-foundation-reading>
            <FoundationReading layer={layer} />
          </motion.div>
        </div>
        <p className={styles.outputLabel}>Decisions you can use</p>
        <ul className={styles.outputs}>
          {layer.produces.map((item, index) => (
            <li key={index}>
              <motion.i className={styles.outputRule} aria-hidden="true" initial={false} animate={ruleControls} />
              <span className={styles.readingStack}>
                <span className={styles.readingMeasure} aria-hidden="true" inert>
                  {FOUNDATION_LAYERS.map((candidate) => <span key={candidate.id}>{candidate.produces[index]}</span>)}
                </span>
                <motion.span initial={false} animate={outputControls} data-foundation-output>{item}</motion.span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function BrandFoundationScene() {
  const wrapperRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectionId = useId();
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  // Match the CSS breakpoint, then measure the complete natural frame.
  // Larger text or a shorter viewport can release the hold without clipping.
  const hasScrollRunway = useMediaQuery("(min-width: 1181px) and (min-height: 761px) and (pointer: fine)");
  const [frameFits, setFrameFits] = useState(false);
  const [hasScrollLayout, setHasScrollLayout] = useState(false);
  const cinematicMotion = hasScrollLayout && !prefersReducedMotion;
  const sceneInView = useInView(wrapperRef, { amount: 0.08 });
  const previousIndexRef = useRef(0);
  const visualizer = useScrollDrivenVisualizer({
    scrollHysteresis: 0.0125,
    preservePanelFocus: true,
    focusScopeSelector: '[data-foundation-controls]',
    count: FOUNDATION_LAYERS.length,
    target: wrapperRef,
    enabled: sceneInView && cinematicMotion,
    reducedMotion: prefersReducedMotion,
  });
  const activeIndex = visualizer.activeIndex;
  const direction = activeIndex >= previousIndexRef.current ? 1 : -1;
  const active = FOUNDATION_LAYERS[activeIndex];
  const scrollYProgress = visualizer.scrollYProgress;
  // Keep a separate painted camera value. A paused scene must retain its
  // framing even if the document scrolls; resume catches up once, gently.
  const cameraProgress = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (!cinematicMotion || !sceneInView || document.hidden) return;
    cameraProgress.stop();
    cameraProgress.set(progress);
  });
  useEffect(() => {
    if (!cinematicMotion || !sceneInView) return;
    const playback = animate(cameraProgress, scrollYProgress.get(), { duration: .45, ease: EASE });
    return () => playback.stop();
  }, [cameraProgress, cinematicMotion, sceneInView, scrollYProgress]);
  // A close view opens, pushes toward the roots, then resolves to the wider
  // frame. The reading card stays still while scroll drives the camera.
  const landscapeScale = useTransform(cameraProgress, [0, 0.34, 0.67, 1], [1.32, 1.12, 1.22, 1.08]);
  const landscapeX = useTransform(cameraProgress, [0, 0.34, 0.67, 1], ["3%", "-1%", "1.5%", "-2%"]);
  const landscapeY = useTransform(cameraProgress, [0, 0.34, 0.67, 1], [20, -18, -8, 8]);
  const sunlightX = useTransform(cameraProgress, [0, 1], ["-45%", "260%"]);

  useEffect(() => {
    previousIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    // Once a desktop story has started, pause its animation without removing
    // its runway. A visit that begins with reduced motion still uses normal
    // document flow, and a smaller viewport always releases the sticky frame.
    if (!hasScrollRunway || !frameFits) setHasScrollLayout(false);
    else if (!prefersReducedMotion) setHasScrollLayout(true);
  }, [hasScrollRunway, frameFits, prefersReducedMotion]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const measure = () => setFrameFits(scene.offsetHeight <= window.innerHeight + 1);
    const observer = new ResizeObserver(measure);
    observer.observe(scene);
    window.addEventListener("resize", measure);
    measure();
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); };
  }, []);

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
    const target = tabRefs.current[next];
    const bounds = target?.getBoundingClientRect();
    if (bounds && (bounds.top < 80 || bounds.bottom > window.innerHeight - 64)) {
      target?.scrollIntoView({ block: "center", inline: "nearest", behavior: "instant" });
    }
    target?.focus({ preventScroll: true });
  }

  return (
    <section
      ref={wrapperRef}
      className={styles.section}
      aria-labelledby="brand-foundation-title"
      data-scroll-story="foundation"
      data-foundation-state={activeIndex}
      data-foundation-motion={cinematicMotion ? "scroll" : "static"}
      data-foundation-layout={hasScrollLayout ? "sticky" : "flow"}
    >
      <div ref={sceneRef} className={styles.scene}>
        <motion.div className={styles.landscape} data-foundation-landscape aria-hidden="true" style={{ scale: hasScrollLayout ? landscapeScale : 1, x: hasScrollLayout ? landscapeX : 0, y: hasScrollLayout ? landscapeY : 0 }}>
          <video
            ref={videoRef}
            muted
            loop
            autoPlay={Boolean(sceneInView && !prefersReducedMotion)}
            playsInline
            preload={sceneInView ? "metadata" : "none"}
            poster="/images/pexels-root-network-poster.jpg"
          >
            {/* Mobile derivative FIRST: a browser takes the first <source>
                whose media and type both match, so a narrow-screen entry
                placed after the full size ones would never be reached.
                768 wide, same framing as the approved clip rather than a
                reframe, so this is purely weight and changes nothing about
                what the shot shows. 3.00MB webm down to 1.05MB. */}
            <source src="/videos/pexels-root-network-mobile.mp4" media="(max-width: 767px)" type="video/mp4" />
            <source src="/videos/pexels-root-network.webm" type="video/webm" />
            <source src="/videos/pexels-root-network.mp4" type="video/mp4" />
          </video>
        </motion.div>
        <div className={styles.scrim} aria-hidden="true" />
        <motion.div className={styles.sunlight} data-foundation-sunlight aria-hidden="true" style={{ x: hasScrollLayout ? sunlightX : 0, opacity: hasScrollLayout ? 0.3 : 0 }} />

        <div className={styles.shell}>
          <div className={styles.content} data-foundation-controls>
            <header>
              <p className={styles.eyebrow}>04 · The foundation</p>
              <h2 id="brand-foundation-title">Give buyers a reason to choose you.</h2>
              <p className={styles.intro}>Before the logo, decide who needs your business, what they compare you with, and which promise you can prove.</p>
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
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse" && cinematicMotion) visualizer.preview(index);
                  }}
                  onPointerLeave={(event) => {
                    if (event.pointerType === "mouse" && cinematicMotion && document.activeElement !== event.currentTarget) {
                      visualizer.releasePreview();
                    }
                  }}
                  onFocus={() => choose(index)}
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

            <FoundationDecision layer={active} direction={direction} reducedMotion={prefersReducedMotion} />

            <Link href="/services#package-brand-beginning" className={styles.link} data-cursor-label="foundation">
              See the foundation scope <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <FoundationMap activeIndex={activeIndex} reducedMotion={prefersReducedMotion} />
        </div>
      </div>
    </section>
  );
}
