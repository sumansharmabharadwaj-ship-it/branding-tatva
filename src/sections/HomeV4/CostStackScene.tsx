"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useHydratedMotionPreference } from "@/hooks/useHydratedReducedMotion";
import { ArrowDownRight } from "lucide-react";
import { LivingGradient } from "@/components/LivingGradient";
import styles from "./CostStack.module.css";

/* Moved here from the cream hidden-cost scene rather than rewritten.
 * This copy is already approved and already holds the house standard,
 * and inventing three new consequences to fill a new layout would be
 * the wrong way round: the layout changed because the argument is about
 * accumulation, the argument did not change to suit a layout. */
const BRAND_RESET_COSTS = [
  {
    number: "01",
    title: "More explaining.",
    body: "Each touchpoint makes a different promise. People need another explanation before they understand why they should choose you.",
  },
  {
    number: "02",
    title: "Work repeated.",
    body: "Every brief reopens the language, look, and tone. The team remakes decisions that could have carried forward.",
  },
  {
    number: "03",
    title: "Recognition lost.",
    body: "A campaign earns attention. A different identity next time makes the connection harder for people to recognise.",
  },
] as const;

/**
 * The three costs, stacked.
 *
 * Sits immediately after the cream hidden-cost scene and gives the
 * front half of Home the dark chapter it was missing: the page ran
 * hero, cream, cream, cream before this, which is most of why the
 * scroll read as flat. The field underneath is the orangery plate from
 * Suman's reference board, the deepest warm ground in the set.
 */
export function V4CostStackScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const { hydrated, prefersReducedMotion } = useHydratedMotionPreference();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !hydrated || prefersReducedMotion) return;
    const cards = Array.from(section.querySelectorAll<HTMLElement>("[data-cost-card]"));
    const stacked = window.matchMedia("(min-width: 901px) and (min-height: 701px)");
    let frame = 0;
    let visible = true;
    let disposed = false;
    const clamp = (value: number) => Math.max(0, Math.min(1, value));

    function render() {
      frame = 0;
      if (disposed || !visible || document.hidden) return;
      const viewport = window.innerHeight;
      // Top-centred scale leaves each sticky top unchanged. Read layout height
      // rather than transformed height so depth never feeds back into progress.
      const measurements = cards.map((card) => ({
        card, top: card.getBoundingClientRect().top, height: card.offsetHeight,
        pin: stacked.matches ? parseFloat(getComputedStyle(card).top) : 0,
      }));
      measurements.forEach(({ card, top, height, pin }, index) => {
        const next = measurements[index + 1];
        const cover = stacked.matches && next
          ? clamp((top + height - next.top) / Math.max(1, height - (next.pin - pin)))
          : 0;
        const arrival = clamp((viewport * .92 - top) / Math.max(1, viewport * .92 - pin));
        card.style.setProperty("--stack-cover", cover.toFixed(4));
        card.style.setProperty("--stack-arrival", arrival.toFixed(4));
      });
    }
    function schedule() {
      if (!frame && !disposed && visible && !document.hidden) frame = requestAnimationFrame(render);
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
    }, { rootMargin: "20% 0px" });
    observer.observe(section);
    const resize = new ResizeObserver(schedule);
    cards.forEach((card) => resize.observe(card));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    document.addEventListener("visibilitychange", schedule);
    stacked.addEventListener("change", schedule);
    schedule();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
      stacked.removeEventListener("change", schedule);
      cards.forEach((card) => {
        card.style.removeProperty("--stack-cover");
        card.style.removeProperty("--stack-arrival");
      });
    };
  }, [hydrated, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="cost-stack"
      tabIndex={-1}
      data-home-v4-chapter="cost-stack"
      data-home-chapter="cost-stack"
      data-home-section="cost-stack"
      data-cursor-world="dark"
      className={styles.scene}
      aria-labelledby="home-v4-cost-stack-title"
    >
      {/* First child, content after: DOM order does the layering, so no
          negative z-index is involved anywhere in this scene. */}
      <LivingGradient contours preset="orangery" />

      <div className={styles.inner}>
        <p className={styles.eyebrow}>02 · What the reset costs</p>
        {/* Matches the two beat declarative rhythm the rest of Home's
            headings use ("More content. The same introduction.") rather
            than the idiom this first read as, which sat wrong against a
            literary voice. */}
        <h2 id="home-v4-cost-stack-title" className={styles.title}>
          Three costs. <em>Every reset renews them.</em>
        </h2>
        <p className={styles.lede}>
          Starting the brand again looks free. The bill arrives later, in the work
          people repeat and the recognition that never compounds.
        </p>

        <ol className={styles.stack} aria-label="Where an inconsistent brand costs time and attention">
          {BRAND_RESET_COSTS.map((cost, index) => (
            <li
              data-cost-card
              key={cost.number}
              className={styles.card}
              /* Drives the staggered sticky offset, so each card pins a
                 little lower than the one before and the stacked edges
                 stay visible. */
              style={{ "--i": index } as CSSProperties}
            >
              <div className={styles.cardHead}>
                <span className={styles.number} aria-hidden="true">{cost.number}</span>
                <span className={styles.meter} aria-hidden="true" />
              </div>
              <h3>{cost.title}</h3>
              <p>{cost.body}</p>
            </li>
          ))}
        </ol>

        <div className={styles.footer}>
          <p>A clear position gives every campaign something to build on.</p>
          <a href="#foundation" className={styles.link} data-magnetic data-cursor-label="foundation">
            Build the foundation <ArrowDownRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
