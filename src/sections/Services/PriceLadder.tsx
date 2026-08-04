"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { AnimatedStat } from "@/components/AnimatedStat";
import { useRevealTrigger } from "@/hooks/useRevealTrigger";
import { usePricing } from "@/components/PricingProvider";
import { motionTokens } from "@/lib/motionTokens";
import { packages } from "@/data/services";
import { REGIONS, formatPrice, priceAmount, type PackageSlug } from "@/data/pricing";

// The approved price book (data/pricing.ts), drawn rather than listed.
// Every amount is read straight out of that file through priceAmount and
// labelled with the very same figure through formatPrice, so a bar can
// never disagree with the price printed beside it. Switching market
// morphs the bars and recounts the figures; the region choice is the
// same shared cookie state the selector above the packages writes, so
// both controls always agree.
//
// Billing honesty: the two project fees share one scale, and the
// monthly retainer sits apart with its own. Drawing a monthly figure on
// the same axis as a project fee would compare two different things and
// read as a longer or shorter engagement than it is.
const BAR_VB_W = 360;
const BAR_VB_H = 12;

function Bar({
  fraction,
  color,
  active,
  still,
  delay,
}: {
  fraction: number;
  color: string;
  active: boolean;
  still: boolean;
  delay: number;
}) {
  const run = active || still;
  return (
    <svg viewBox={`0 0 ${BAR_VB_W} ${BAR_VB_H}`} className="h-auto w-full" aria-hidden="true">
      <rect x={0} y={0} width={BAR_VB_W} height={BAR_VB_H} rx={BAR_VB_H / 2} fill="rgba(244,239,230,0.10)" />
      <motion.rect
        x={0}
        y={0}
        width={BAR_VB_W}
        height={BAR_VB_H}
        rx={BAR_VB_H / 2}
        fill={color}
        initial={still ? false : { scaleX: 0 }}
        animate={run ? { scaleX: fraction } : undefined}
        transition={
          still
            ? { duration: 0 }
            : { duration: motionTokens.durationBase, ease: motionTokens.easeOrganic, delay }
        }
        // originX rather than a transformOrigin style: Framer Motion
        // overwrites transform-origin on SVG children with "50% 50%"
        // unless the origin is given as its own value, which grew the
        // bar out of its own centre in both directions.
        style={{ originX: 0 }}
      />
    </svg>
  );
}

export function PriceLadder() {
  const { region, setRegion } = usePricing();
  const prefersReducedMotion = useReducedMotion();
  const [ref, visible] = useRevealTrigger("0px 0px -120px 0px");
  const still = Boolean(prefersReducedMotion);

  const oneTime = packages.filter((p) => p.billing === "one-time");
  const monthly = packages.filter((p) => p.billing === "monthly");
  // Scale is the largest project fee in the chosen market, so the two
  // bars read as a ratio of each other rather than of an invented axis.
  const peak = Math.max(...oneTime.map((p) => priceAmount(region, p.slug as PackageSlug)));

  return (
    <Container className="max-w-4xl">
      <Reveal>
        <p className="text-sm font-medium uppercase tracking-wide text-sandstone">The price book</p>
        <h2 className="mt-2 max-w-xl text-display-sm font-display font-normal text-ivory">
          What an engagement begins at, in your market.
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ivory/85">
          Choose a market and the figures redraw. The level moves with the market; the shape of the three stays close to
          steady wherever you sit.
        </p>
      </Reveal>

      <div role="group" aria-label="Choose a market" className="mt-8 flex flex-wrap gap-2">
        {REGIONS.map((r) => {
          const isActive = r.id === region;
          return (
            <button
              key={r.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setRegion(r.id)}
              className={`rounded-full border px-3.5 py-1.5 text-xs uppercase tracking-[0.12em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone ${
                isActive
                  ? "border-sandstone/70 bg-sandstone/15 text-ivory"
                  : "border-ivory/20 text-ivory/65 hover:border-ivory/40 hover:text-ivory"
              }`}
            >
              {r.label} <span className="text-ivory/50">{r.currency}</span>
            </button>
          );
        })}
      </div>

      <div ref={ref} aria-live="polite" className="mt-10">
        <p className="text-[0.62rem] font-medium uppercase tracking-[0.18em] text-ivory/55">One time project fee</p>
        <div className="mt-5 space-y-7">
          {oneTime.map((pkg, i) => {
            const amount = priceAmount(region, pkg.slug as PackageSlug);
            return (
              <div key={pkg.slug}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="font-display text-lg font-normal text-ivory">{pkg.name}</p>
                  <p className="font-display text-xl font-normal text-sandstone">
                    <AnimatedStat key={`${region}-${pkg.slug}`} value={formatPrice(region, pkg.slug as PackageSlug)} />
                  </p>
                </div>
                <div className="mt-2">
                  <Bar
                    fraction={amount / peak}
                    color={pkg.color}
                    active={visible}
                    still={still}
                    delay={i * 0.12}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {monthly.map((pkg) => (
          <div key={pkg.slug} className="mt-9 border-t border-ivory/12 pt-7">
            <p className="text-[0.62rem] font-medium uppercase tracking-[0.18em] text-ivory/55">Each month</p>
            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="font-display text-lg font-normal text-ivory">{pkg.name}</p>
              <p className="font-display text-xl font-normal text-sandstone">
                <AnimatedStat key={`${region}-${pkg.slug}`} value={formatPrice(region, pkg.slug as PackageSlug)} />
                <span className="text-sm text-ivory/70"> /mo</span>
              </p>
            </div>
            <p className="mt-3 max-w-lg text-xs leading-relaxed text-ivory/60">
              A retainer carries its own scale, so it sits apart from the two project fees above rather than sharing
              their axis.
            </p>
          </div>
        ))}
      </div>

      <p className="mt-8 max-w-xl text-xs leading-relaxed text-ivory/55">
        Every figure begins the conversation. Final scope and quotation are confirmed after the discovery call.
      </p>
    </Container>
  );
}
