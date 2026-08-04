"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { AnimatedStat } from "@/components/AnimatedStat";
import { useRevealTrigger } from "@/hooks/useRevealTrigger";
import { motionTokens } from "@/lib/motionTokens";
import { projects } from "@/data/projects";

// The one verified engagement outcome on this site, drawn instead of
// listed. Every figure below is already recorded in data/projects.ts on
// the `dr-haley-nutrition` entry — each series carries the exact source
// sentence in its comment so any number on screen can be traced back to
// the file in one step. Commercial honesty rule (CLAUDE.md): nothing
// here is computed into a new claim, interpolated, or estimated; the
// four pairs are read verbatim, and the derived percentages come from
// that project's own `stats` array rather than being recalculated here.
//
// Deliberately a different mechanism from VerifiedOutcome directly
// above it: that section states the decision and the single headline
// number, this one lets a visitor move between the four measures and
// watch each one redraw.

type Series = {
  id: string;
  tab: string;
  channel: string;
  unit: string;
  decimals: number;
  before: number;
  after: number;
  // The stat value in projects.ts `stats` this series closes with, when
  // one exists for it — looked up by value so the copy on screen stays
  // owned by the data file.
  statValue?: string;
  reading: string;
  color: string;
};

const SERIES: Series[] = [
  {
    id: "instagram-posts",
    tab: "Instagram posts",
    channel: "Instagram",
    unit: "posts published",
    decimals: 0,
    // execution: "Cut Instagram posting from 23 posts in December to 12 in January."
    before: 23,
    after: 12,
    // reflection: "impressions barely dropping (down just 10%) despite posting 48% less"
    reading:
      "Instagram posting was halved on purpose. Impressions held across the account, falling only 10% while the schedule dropped 48%.",
    color: "#5C6B4A", // sage — the project's own accent in projects.ts
  },
  {
    id: "instagram-followers",
    tab: "Followers earned",
    channel: "Instagram",
    unit: "followers earned",
    decimals: 0,
    // outcome: "Instagram gained 126 new followers in January from 12 posts,
    // more than December's 111 followers from 23 posts."
    before: 111,
    after: 126,
    statValue: "104%",
    reading:
      "December earned 111 followers across 23 posts. January earned 126 across 12. The figure that moved is what each post was worth.",
    color: "#C28A28", // ochre
  },
  {
    id: "linkedin-rate",
    tab: "LinkedIn engagement rate",
    channel: "LinkedIn",
    unit: "engagement rate",
    decimals: 2,
    // outcome: "engagement rate climbed from 0.71% to 2.81%"
    before: 0.71,
    after: 2.81,
    statValue: "2.81%",
    // execution: "Used LinkedIn, previously dormant, to start building
    // visibility with a professional audience from a low base."
    // outcome: "LinkedIn impressions rose 365%"
    reading:
      "LinkedIn opened the period dormant. Impressions rose 365% over the same eight weeks as the rate climbed.",
    color: "#D4B99A", // sandstone
  },
  {
    id: "facebook-fans",
    tab: "Facebook fans",
    channel: "Facebook",
    unit: "total fans",
    decimals: 0,
    // outcome: "Facebook grew steadily from roughly 59 to 69 total fans over
    // the same period, with engagement per post up 67%."
    before: 59,
    after: 69,
    reading:
      "Facebook kept its cadence steady while relevance tightened. Fans moved from roughly 59 to roughly 69, with engagement per post up 67%.",
    color: "#CD7A4C", // terracotta
  },
];

// Chart geometry, in SVG user units. The viewBox scales to whatever
// width the column gives it, so nothing here can push the page wider.
const VB_W = 360;
const VB_H = 212;
const BASELINE = 168;
const MAX_BAR = 112;
const BAR_W = 84;
const LEFT_CX = 98;
const RIGHT_CX = 262;

// Counts a number up in place. AnimatedStat covers the HTML case and is
// reused below for the headline figure; SVG <text> cannot hold a span,
// so the same behaviour lives here in the small form the chart needs.
// Same guarantee as AnimatedStat: the resting state is the real value,
// so a stalled frame loop can never leave a wrong number on screen.
function useCountUp(target: number, active: boolean, decimals: number) {
  const prefersReducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(target);

  useEffect(() => {
    if (!active || prefersReducedMotion) {
      setDisplay(target);
      return;
    }
    const duration = 1100;
    const start = performance.now();
    let frame = 0;
    setDisplay(0);
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(target * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
      else setDisplay(target);
    }
    frame = requestAnimationFrame(tick);
    const settle = setTimeout(() => setDisplay(target), duration + 200);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(settle);
    };
  }, [target, active, prefersReducedMotion, decimals]);

  return display.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function Column({
  cx,
  value,
  peak,
  label,
  decimals,
  suffix,
  fill,
  active,
  still,
  delay,
}: {
  cx: number;
  value: number;
  peak: number;
  label: string;
  decimals: number;
  suffix: string;
  fill: string;
  active: boolean;
  still: boolean;
  delay: number;
}) {
  const height = Math.max(6, (value / peak) * MAX_BAR);
  const top = BASELINE - height;
  const shown = useCountUp(value, active || still, decimals);
  const run = active || still;

  return (
    <g>
      <motion.rect
        x={cx - BAR_W / 2}
        y={top}
        width={BAR_W}
        height={height}
        rx={7}
        fill={fill}
        initial={still ? false : { scaleY: 0 }}
        animate={run ? { scaleY: 1 } : undefined}
        transition={
          still
            ? { duration: 0 }
            : { duration: motionTokens.durationBase, ease: motionTokens.easeOrganic, delay }
        }
        // Framer Motion rewrites transform-origin on SVG children to
        // "50% 50%" against a fill-box unless the origin arrives as its
        // own originX/originY values, so a plain transformOrigin style
        // here is silently discarded and the bar grows out of its own
        // middle instead of standing up off the baseline. originY: 1
        // pins it to the bottom edge, which is the axis line.
        style={{ originY: 1 }}
      />
      <motion.text
        x={cx}
        y={top - 14}
        textAnchor="middle"
        className="font-display"
        fill="#F4EFE6"
        fontSize={26}
        initial={still ? false : { opacity: 0 }}
        animate={run ? { opacity: 1 } : undefined}
        transition={still ? { duration: 0 } : { duration: motionTokens.durationFast, delay: delay + 0.1 }}
      >
        {shown}
        {suffix}
      </motion.text>
      <text
        x={cx}
        y={BASELINE + 26}
        textAnchor="middle"
        fill="rgba(244,239,230,0.65)"
        fontSize={13}
        letterSpacing="0.12em"
      >
        {label.toUpperCase()}
      </text>
    </g>
  );
}

export function CadenceOutcome() {
  const [activeId, setActiveId] = useState(SERIES[0].id);
  const prefersReducedMotion = useReducedMotion();
  const [ref, visible] = useRevealTrigger("0px 0px -120px 0px");
  const still = Boolean(prefersReducedMotion);

  const proof = projects.find((p) => p.slug === "dr-haley-nutrition");
  const series = SERIES.find((s) => s.id === activeId) ?? SERIES[0];
  const peak = Math.max(series.before, series.after);
  const suffix = series.decimals > 0 ? "%" : "";
  // Looked up in the project's own verified stats rather than written
  // here, so the badge below can only ever say what that file says.
  const stat = series.statValue ? proof?.stats?.find((s) => s.value === series.statValue) : undefined;

  return (
    <Container className="max-w-6xl">
      <Reveal>
        <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Eight weeks, measured</p>
        <h2 className="mt-2 max-w-2xl text-display-sm font-display font-normal text-ivory">
          Posting less, drawn against what followed.
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ivory/85">
          Every figure comes from the same {proof?.title} engagement, December 2025 into January 2026. Choose a measure
          to watch it redraw.
        </p>
      </Reveal>

      <div ref={ref} className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
        <div>
          <div role="group" aria-label="Choose a measure" className="flex flex-wrap gap-2">
            {SERIES.map((s) => {
              const isActive = s.id === series.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveId(s.id)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs uppercase tracking-[0.12em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone ${
                    isActive
                      ? "border-sandstone/70 bg-sandstone/15 text-ivory"
                      : "border-ivory/20 text-ivory/65 hover:border-ivory/40 hover:text-ivory"
                  }`}
                >
                  {s.tab}
                </button>
              );
            })}
          </div>

          <div aria-live="polite" className="mt-8">
            <p className="text-[0.62rem] font-medium uppercase tracking-[0.18em] text-ivory/55">
              {series.channel} · {series.unit}
            </p>
            {stat ? (
              <>
                <p className="mt-3 font-display text-[clamp(3rem,7vw,5rem)] font-normal leading-none text-sandstone">
                  <AnimatedStat key={stat.value} value={stat.value} />
                </p>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-ivory/85">{stat.label}</p>
              </>
            ) : (
              <p className="mt-3 font-display text-[clamp(2rem,4vw,2.8rem)] font-normal leading-tight text-sandstone">
                {series.before.toLocaleString("en-US", { minimumFractionDigits: series.decimals })}
                {suffix} to{" "}
                {series.after.toLocaleString("en-US", { minimumFractionDigits: series.decimals })}
                {suffix}
              </p>
            )}
            <p className="mt-5 max-w-md text-sm leading-relaxed text-ivory/75">{series.reading}</p>
          </div>
        </div>

        {/* The chart itself. width:100% plus a viewBox means it can only
            ever scale down inside its column, so no width here can push
            the page into horizontal scroll. */}
        <div className="rounded-2xl border border-ivory/12 bg-ivory/[0.04] p-5 backdrop-blur-md sm:p-7">
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            className="h-auto w-full"
            role="img"
            aria-label={`${series.channel} ${series.unit}: ${series.before}${suffix} in December, ${series.after}${suffix} in January.`}
          >
            <line
              x1={16}
              y1={BASELINE}
              x2={VB_W - 16}
              y2={BASELINE}
              stroke="rgba(244,239,230,0.22)"
              strokeWidth={1}
            />
            <Column
              key={`${series.id}-before`}
              cx={LEFT_CX}
              value={series.before}
              peak={peak}
              label="December"
              decimals={series.decimals}
              suffix={suffix}
              fill="rgba(244,239,230,0.20)"
              active={visible}
              still={still}
              delay={0}
            />
            <Column
              key={`${series.id}-after`}
              cx={RIGHT_CX}
              value={series.after}
              peak={peak}
              label="January"
              decimals={series.decimals}
              suffix={suffix}
              fill={series.color}
              active={visible}
              still={still}
              delay={0.14}
            />
          </svg>
        </div>
      </div>
    </Container>
  );
}
