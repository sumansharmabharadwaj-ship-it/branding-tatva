"use client";

import { useRef, useState, type UIEvent } from "react";
import { LinkButton } from "@/components/Button";
import { packages } from "@/data/services";
import { formatPrice, type PackageSlug, type Region } from "@/data/pricing";
import { servicesContactHref } from "@/lib/servicesJourney";
import { blendHex } from "@/lib/sectionWash";
import { track } from "@/lib/analytics";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

// Desktop earns a true three-column comparison. A phone used to receive
// those same three cards as a vertical tower, paying three card-heights
// for one decision. The same DOM now becomes a horizontal snap deck below
// 1024px: every package and CTA remains present and keyboard reachable,
// while the page only spends one card's vertical height. A live position
// label, previous/next controls, and direct dots make the sideways route
// explicit instead of relying on a mystery swipe.
export function PackageComparisonDeck({ region }: { region: Region }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const prefersReducedMotion = useHydratedReducedMotion();

  function goTo(index: number, source: "previous" | "next" | "dot") {
    const nextIndex = Math.max(0, Math.min(packages.length - 1, index));
    const trackNode = trackRef.current;
    const cardNode = cardRefs.current[nextIndex];
    setActiveIndex(nextIndex);

    if (trackNode && cardNode) {
      const left = cardNode.offsetLeft - (trackNode.clientWidth - cardNode.clientWidth) / 2;
      trackNode.scrollTo({
        left: Math.max(0, left),
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }

    track("package_viewed", {
      package: packages[nextIndex].slug,
      source: `comparison_${source}`,
    });
  }

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    const trackNode = event.currentTarget;
    const trackCenter = trackNode.scrollLeft + trackNode.clientWidth / 2;
    let closestIndex = activeIndex;
    let closestDistance = Number.POSITIVE_INFINITY;

    cardRefs.current.forEach((cardNode, index) => {
      if (!cardNode) return;
      const cardCenter = cardNode.offsetLeft + cardNode.clientWidth / 2;
      const distance = Math.abs(cardCenter - trackCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== activeIndex) setActiveIndex(closestIndex);
  }

  return (
    <div
      data-package-comparison-deck="true"
      data-active-index={activeIndex}
      data-active-package={packages[activeIndex].slug}
    >
      <div data-package-comparison-controls="true" className="mb-4 flex items-center justify-between gap-4 lg:hidden">
        <div aria-live="polite">
          <p className="text-[0.58rem] font-medium uppercase tracking-[0.18em] text-ivory/45">Comparison path</p>
          <p className="mt-1 font-display text-lg font-normal text-ivory">
            {String(activeIndex + 1).padStart(2, "0")} / {String(packages.length).padStart(2, "0")} · {packages[activeIndex].name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous package"
            disabled={activeIndex === 0}
            onClick={() => goTo(activeIndex - 1, "previous")}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/20 text-lg text-ivory transition-colors hover:border-ivory/45 hover:bg-ivory/[0.06] disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            aria-label="Next package"
            disabled={activeIndex === packages.length - 1}
            onClick={() => goTo(activeIndex + 1, "next")}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/20 text-lg text-ivory transition-colors hover:border-ivory/45 hover:bg-ivory/[0.06] disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        role="list"
        aria-label="All three package comparisons"
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-3 pr-[12%] lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0 lg:pr-0"
        style={{ scrollbarWidth: "none" }}
      >
        {packages.map((pkg, index) => (
          <article
            key={pkg.slug}
            ref={(node) => {
              cardRefs.current[index] = node;
            }}
            role="listitem"
            aria-label={`${index + 1} of ${packages.length}: ${pkg.name}`}
            data-package-comparison-card="true"
            data-package-slug={pkg.slug}
            onFocusCapture={() => setActiveIndex(index)}
            className="flex min-h-[28rem] min-w-[86%] snap-center flex-col rounded-2xl border-t-2 p-5 backdrop-blur-md sm:min-w-[72%] sm:p-6 lg:min-w-0"
            style={{ borderColor: pkg.color, backgroundColor: blendHex(pkg.color, "#0F151C", 12) }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.56rem] font-medium uppercase tracking-[0.18em] text-sandstone/75">
                  Package {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-display text-xl font-normal text-ivory">{pkg.name}</h3>
              </div>
              <span aria-hidden="true" className="font-display text-4xl text-ivory/[0.08]">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-xs text-ivory/70">{pkg.billing === "monthly" ? "from" : "begins at"}</span>
              <span className="font-display text-2xl font-normal text-ivory">
                {formatPrice(region, pkg.slug as PackageSlug)}
              </span>
              {pkg.billing === "monthly" && <span className="text-xs text-ivory/70">/mo</span>}
            </div>
            <p className="mt-3 min-h-12 text-sm leading-relaxed text-ivory/75">{pkg.forWho}</p>

            <ul className="mt-5 flex-1 space-y-2 border-t border-ivory/10 pt-5">
              {pkg.includes.map((item) => (
                <li key={item} className="grid grid-cols-[0.7rem_1fr] gap-2 text-sm leading-relaxed text-ivory/88">
                  <span aria-hidden="true" className="pt-0.5 text-sandstone">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <LinkButton href={servicesContactHref(pkg.slug as PackageSlug)} className="mt-6 self-start" style={{ backgroundColor: pkg.color }}>
              Start with {pkg.name}
            </LinkButton>
          </article>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between gap-4 lg:hidden">
        <div role="group" aria-label="Choose a package comparison" className="flex items-center gap-2">
          {packages.map((pkg, index) => (
            <button
              key={pkg.slug}
              type="button"
              aria-label={`Show ${pkg.name}`}
              aria-pressed={activeIndex === index}
              onClick={() => goTo(index, "dot")}
              className="flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
            >
              <span
                aria-hidden="true"
                className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${
                  activeIndex === index ? "w-7 bg-sandstone" : "w-2 bg-ivory/25"
                }`}
              />
            </button>
          ))}
        </div>
        <p className="text-[0.58rem] uppercase tracking-[0.16em] text-ivory/45">Swipe or use arrows</p>
      </div>
    </div>
  );
}
