"use client";

import { useEffect, useState } from "react";
import { CalendlyEmbed } from "./CalendlyEmbed";
import { BackgroundVideo } from "./BackgroundVideo";
import { ElementGlyph } from "./ElementGlyph";
import { BREAK_OVERLAY_GRADIENT } from "@/lib/media";
import { elements, type Element } from "@/data/elements";
import { site } from "@/data/site";

// Redesigned per direct feedback on the first version, which leaned on
// four European stock photos (Bavarian cherry blossoms, a Romanian
// waterfall, Mount Fuji) that had nothing to do with this brand and
// read as a bolted-on widget, not part of the site. This version
// introduces no new imagery at all — it reuses the five elements
// already at the center of the whole site (the same graded photos,
// accent colors, and hand-drawn ElementGlyph marks already established
// in the Elements section, Process journey, and Services page), mapped
// across the year instead of four generic seasons, so the calendar
// reads as one more room in the same five-element house rather than a
// separate feature. The copy also pulls each element's own `poetic`
// line from data/elements.ts — already-approved brand language — rather
// than inventing new seasonal copy.
const MONTH_TO_ELEMENT: Element["slug"][] = [
  "earth", "earth", "earth", // Jan–Mar: the year's foundation
  "water", "water",          // Apr–May
  "fire", "fire",            // Jun–Jul: peak heat
  "air", "air", "air",       // Aug–Oct
  "space", "space",          // Nov–Dec: what's remembered as the year settles
];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function SeasonalCalendarPanel() {
  const [expanded, setExpanded] = useState(false);
  // Resolved client-side only, after mount — computing new Date()
  // during render would let the server and client disagree on "now"
  // and trip a hydration mismatch, the same class of bug this codebase
  // already works around elsewhere (see useMediaQuery's own
  // useState(false) + useEffect pattern). January/Earth is a
  // deterministic default for the brief pre-mount frame — this panel
  // sits far down the page and is never actually seen before mounting.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
  }, []);

  const month = now?.getMonth() ?? 0;
  const element = elements.find((el) => el.slug === MONTH_TO_ELEMENT[month]) ?? elements[0];
  const day = now?.getDate() ?? null;
  const year = now?.getFullYear() ?? null;
  const monthName = MONTH_NAMES[month];

  return (
    <div className="relative mx-auto mt-16 max-w-2xl overflow-hidden rounded-2xl">
      <div className="absolute inset-0">
        <BackgroundVideo
          video={element.video ?? ""}
          poster={element.image}
          imagePosition={element.imagePosition ?? "center"}
        />
        {/* Same tint + overlay recipe ElementRowBackground already uses
            for these exact photos elsewhere on the site — a light
            multiply of the element's own color, then the shared
            BREAK_OVERLAY_GRADIENT every video-quote section uses, so
            this panel reads as visually continuous with the rest of
            the site instead of a different treatment. */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: element.color, opacity: 0.18, mixBlendMode: "multiply" }}
        />
        <div className="absolute inset-0" style={{ backgroundImage: BREAK_OVERLAY_GRADIENT }} />
      </div>

      {/* The current element's own hand-drawn mark, oversized and faint
          — the same ghost-watermark language used elsewhere on this
          site (ELEMENTS behind the Home heading, WHY on About), not a
          decorative stock icon. */}
      <ElementGlyph
        slug={element.slug}
        className="pointer-events-none absolute -top-10 -right-8 h-52 w-52 opacity-[0.16] sm:h-64 sm:w-64"
        style={{ color: element.color }}
        strokeWidth={0.8}
      />

      <div className="relative px-8 py-12 text-center sm:px-14 sm:py-14">
        <p
          className="text-xs font-medium uppercase tracking-[0.2em]"
          style={{ color: element.color }}
        >
          {element.name}
        </p>

        <p className="mx-auto mt-5 max-w-sm text-pretty font-display text-2xl italic leading-snug text-ivory sm:text-[1.75rem]">
          &ldquo;{element.poetic}&rdquo;
        </p>

        <div className="mx-auto mt-8 flex max-w-[200px] items-baseline justify-center gap-3 border-t border-ivory/20 pt-5">
          <span className="font-display text-4xl font-normal leading-none text-ivory">{day ?? " "}</span>
          <span className="text-left text-sm leading-tight text-ivory/70">
            {monthName}
            <br />
            {year ?? " "}
          </span>
        </div>

        <p className="mx-auto mt-6 max-w-xs text-sm text-ivory/75">
          If this feels like the right moment, I&apos;d like to hear about it — twenty minutes, whenever suits you, no pitch attached.
        </p>

        <button
          type="button"
          onClick={() => setExpanded(true)}
          className={`mt-7 inline-flex items-center gap-1.5 rounded-full border border-ivory/30 px-6 py-3 text-sm font-medium text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-ivory/10 ${expanded ? "hidden" : ""}`}
        >
          Find a time
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
