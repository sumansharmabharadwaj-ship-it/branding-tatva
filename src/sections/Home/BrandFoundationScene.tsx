"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useScrollDrivenVisualizer } from "@/hooks/useScrollDrivenVisualizer";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useRef, type KeyboardEvent as ReactKeyboardEvent } from "react";

const FOUNDATION_LAYERS = [
  { id: "category", number: "01", label: "Category", title: "Where the business belongs.", description: "The frame that tells people what you are, what they should compare you with, and why the category has room for you.", produces: ["Category frame", "Competitor codes", "Market boundaries"] },
  { id: "audience", number: "02", label: "Audience", title: "Whose mind the brand must enter.", description: "The behaviours, tensions, and associations that decide how the right people read the business before they ever speak to it.", produces: ["Audience tensions", "Decision behaviour", "Perception map"] },
  { id: "belief", number: "03", label: "Belief", title: "What people should begin to associate.", description: "The central truth that identity, language, experience, and every campaign afterwards keep reinforcing.", produces: ["Brand truth", "Association system", "Message territory"] },
  { id: "position", number: "04", label: "Position", title: "The reason this business is chosen.", description: "A clear, defensible reason to choose this business, expressed through a position every later decision can reinforce.", produces: ["Positioning statement", "Value proposition", "Decision filters"] },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

export function BrandFoundationScene() {
  const wrapperRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const reducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(wrapperRef, { amount: 0.12, margin: "8% 0px -10% 0px" });
  const visualizer = useScrollDrivenVisualizer({ count: FOUNDATION_LAYERS.length, target: wrapperRef, enabled: inView, reducedMotion });
  const active = FOUNDATION_LAYERS[visualizer.activeIndex] ?? FOUNDATION_LAYERS[0];

  function onTabKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>, index: number) {
    const direction = event.key === "ArrowRight" || event.key === "ArrowDown"
      ? 1
      : event.key === "ArrowLeft" || event.key === "ArrowUp"
        ? -1
        : 0;
    if (!direction && event.key !== "Home" && event.key !== "End") return;

    event.preventDefault();
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? FOUNDATION_LAYERS.length - 1
        : (index + direction + FOUNDATION_LAYERS.length) % FOUNDATION_LAYERS.length;
    visualizer.choose(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <section ref={wrapperRef} className="foundation-orbit" data-scroll-story="foundation" aria-labelledby="brand-foundation-title">
      <div className="foundation-orbit__media" data-media-id="BT-HOME-FOUNDATION-ROOT-NETWORK" aria-hidden="true">
        <video muted loop autoPlay playsInline aria-hidden="true" preload={inView ? "metadata" : "none"} poster="/images/pexels-root-network-poster.jpg">
          <source src="/videos/pexels-root-network.webm" type="video/webm" />
          <source src="/videos/pexels-root-network.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="foundation-orbit__wash" aria-hidden="true" />

      <div className="foundation-orbit__shell">
        <header className="foundation-orbit__header">
          <p>04 · The foundation</p>
          <h2 id="brand-foundation-title">Four decisions beneath every visible brand.</h2>
        </header>

        <div className="foundation-orbit__stage">
          <AnimatePresence mode="wait" initial={false}>
            <motion.article id="foundation-active-layer" role="tabpanel" aria-label={`${active.label}: ${active.title}`} key={active.id} className="foundation-orbit__active" initial={reducedMotion ? false : { opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} exit={reducedMotion ? undefined : { opacity: 0, y: -22 }} transition={{ duration: reducedMotion ? 0 : 0.62, ease: EASE }} aria-live="polite">
              <span>{active.number} / 04</span>
              <p>{active.label}</p>
              <h3>{active.title}</h3>
              <strong>{active.description}</strong>
              <ul aria-label="Strategic outputs">{active.produces.map((item) => <li key={item}>{item}</li>)}</ul>
            </motion.article>
          </AnimatePresence>

          <div className="foundation-orbit__choices" role="tablist" aria-label="Foundation decisions">
            {FOUNDATION_LAYERS.map((layer, index) => (
              <button key={layer.id} ref={(node) => { tabRefs.current[index] = node; }} type="button" role="tab" aria-selected={visualizer.activeIndex === index} aria-controls="foundation-active-layer" tabIndex={visualizer.activeIndex === index ? 0 : -1} className={visualizer.activeIndex === index ? "is-active" : undefined} onClick={() => visualizer.choose(index)} onPointerEnter={() => visualizer.preview(index)} onPointerLeave={(event) => { if (document.activeElement !== event.currentTarget) visualizer.releasePreview(); }} onFocus={() => visualizer.choose(index)} onKeyDown={(event) => onTabKeyDown(event, index)}>
                <span>{layer.number}</span><strong>{layer.label}</strong><i aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
