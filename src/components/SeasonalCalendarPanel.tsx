"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CalendlyEmbed } from "./CalendlyEmbed";
import { ELEMENT_HEX, SANDSTONE } from "@/lib/sectionWash";
import { site } from "@/data/site";

// A booking panel for the Footer (already the one component present on
// every page — this doesn't need its own sitewide-fixed mount, and a
// floating overlay would just fight the corners AmbientAudio/
// SectionJumpNav/PrecisionMark already occupy). The seasonal backdrop
// changes with the real calendar month rather than showing one static
// mountain photo forever; the four images were sourced fresh and graded
// together this round rather than reused from elsewhere on the site.
// Reuses the existing CalendlyEmbed/booking flow — this is a themed
// presentation shell around it, not a replacement scheduling system;
// building real availability/timezone/confirmation-email handling from
// scratch is out of scope for a marketing site when Calendly already
// does that job for free.
const SEASONS = [
  {
    key: "spring",
    months: [2, 3, 4], // Mar–May
    label: "Spring",
    image: "/images/season-spring-cherry-alps.jpg",
    accent: ELEMENT_HEX.air,
  },
  {
    key: "summer",
    months: [5, 6, 7], // Jun–Aug
    label: "Summer",
    image: "/images/season-summer-lake-mountain.jpg",
    accent: ELEMENT_HEX.earth,
  },
  {
    key: "monsoon",
    months: [8, 9, 10], // Sep–Nov
    label: "Monsoon",
    image: "/images/season-monsoon-waterfall.jpg",
    accent: ELEMENT_HEX.water,
  },
  {
    key: "winter",
    months: [11, 0, 1], // Dec–Feb
    label: "Winter",
    image: "/images/season-winter-fuji.jpg",
    accent: SANDSTONE,
  },
] as const;

function seasonForMonth(month: number) {
  return SEASONS.find((s) => (s.months as readonly number[]).includes(month)) ?? SEASONS[0];
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function SeasonalCalendarPanel() {
  const [expanded, setExpanded] = useState(false);
  // Resolved client-side only, after mount — computing new Date()
  // during render would let the server and client disagree on "now"
  // (a request landing right at a day/month boundary) and trip a
  // hydration mismatch, the exact class of bug this codebase already
  // works around elsewhere (see useMediaQuery's own useState(false) +
  // useEffect pattern). Spring is a reasonable, deterministic default
  // for the brief pre-mount frame — it's never actually painted long
  // enough to notice, since this panel sits far down the page and only
  // becomes visible once already scrolled near.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
  }, []);

  const month = now?.getMonth() ?? 3;
  const season = seasonForMonth(month);
  const day = now?.getDate() ?? null;
  const year = now?.getFullYear() ?? null;
  const monthName = MONTH_NAMES[month];

  return (
    <div className="relative mx-auto mt-16 max-w-2xl overflow-hidden rounded-2xl border border-ivory/15">
      <div className="absolute inset-0">
        <Image src={season.image} alt="" fill sizes="(min-width: 768px) 42rem, 100vw" style={{ objectFit: "cover" }} />
        <div
          className="absolute inset-0"
          style={{ backgroundImage: "linear-gradient(180deg, rgba(39,34,30,0.55) 0%, rgba(39,34,30,0.8) 100%)" }}
        />
      </div>

      <div className="relative px-8 py-10 text-center sm:px-14 sm:py-12">
        <p
          className="text-xs font-medium uppercase tracking-[0.2em]"
          style={{ color: season.accent }}
        >
          {season.label}
        </p>

        <div className="mx-auto mt-5 flex max-w-[220px] items-baseline justify-center gap-3 border-y border-ivory/20 py-4">
          <span className="font-display text-5xl font-normal leading-none text-ivory">{day ?? " "}</span>
          <span className="text-left text-sm leading-tight text-ivory/70">
            {monthName}
            <br />
            {year ?? " "}
          </span>
        </div>

        <p className="mx-auto mt-6 max-w-xs text-sm text-ivory/75">
          Pick a time that works — a short call, no obligation, to see if this is the right fit.
        </p>

        <button
          type="button"
          onClick={() => setExpanded(true)}
          className={`mt-7 rounded-full border border-ivory/30 px-6 py-3 text-sm font-medium text-ivory transition-colors hover:bg-ivory/10 ${expanded ? "hidden" : ""}`}
        >
          Book a call
        </button>

        {expanded && (
          <div className="mt-7 rounded-lg bg-background p-1 sm:p-2">
            <CalendlyEmbed url={site.calendlyUrl} />
          </div>
        )}
      </div>
    </div>
  );
}
