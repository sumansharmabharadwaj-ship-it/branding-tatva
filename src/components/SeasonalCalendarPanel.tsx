"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CalendlyEmbed } from "./CalendlyEmbed";
import { BackgroundVideo } from "./BackgroundVideo";
import { EASE_AIR } from "@/lib/motion";
import { elements, type Element } from "@/data/elements";
import { site } from "@/data/site";

// Rebuilt to match direct reference images — a real glass-widget
// calendar (Weekly/Monthly toggle, an actual date grid, today
// highlighted) over a full-bleed photo, the way an iOS/Android widget
// looks, rather than a quote-card layout. The brand tie-in is the
// backdrop and accent, not invented calendar chrome: the background is
// the current element's own already-graded video, "today" is
// highlighted in that element's own accent color, and the element's
// `poetic` line sits as one quiet caption underneath rather than
// dominating the card. Booking mechanics are unchanged — this is a
// themed shell around the existing Calendly embed.
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
const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

function buildMonthGrid(year: number, month: number): (number | null)[][] {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

export function SeasonalCalendarPanel() {
  const prefersReducedMotion = useReducedMotion();
  const [expanded, setExpanded] = useState(false);
  const [view, setView] = useState<"weekly" | "monthly">("weekly");
  // Resolved client-side only, after mount — computing new Date() during
  // render would let the server and client disagree on "now" and trip a
  // hydration mismatch (see useMediaQuery's own pattern elsewhere in
  // this codebase).
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
  }, []);

  const month = now?.getMonth() ?? 0;
  const year = now?.getFullYear() ?? 2026;
  const today = now?.getDate() ?? 1;
  const element = elements.find((el) => el.slug === MONTH_TO_ELEMENT[month]) ?? elements[0];

  // The Sunday-starting calendar week containing today, walked via
  // real Date arithmetic (not today ± 3) — a naive day-number offset
  // breaks at month boundaries (June 30 + 3 became a nonexistent
  // "July 33" rather than rolling over) and doesn't actually line up
  // with the S M T W T F S header unless today happens to fall exactly
  // midweek.
  const weekDates = useMemo(() => {
    if (!now) return [];
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d.getDate();
    });
  }, [now]);

  const monthGrid = useMemo(() => buildMonthGrid(year, month), [year, month]);

  return (
    <div
      className="relative h-full overflow-hidden rounded-2xl border border-white/15 p-5 sm:p-6"
      style={{ boxShadow: "0 20px 60px -20px rgba(0,0,0,0.5)" }}
    >
      <div className="absolute inset-0 -z-10">
        <BackgroundVideo
          video={element.video ?? ""}
          poster={element.image}
          imagePosition={element.imagePosition ?? "center"}
        />
        <div className="absolute inset-0 bg-soil/40 backdrop-blur-[2px]" />
      </div>

      {/* Weekly / Monthly toggle, same shape and position as the
          reference — a shared sliding highlight (layoutId) rather than
          each pill managing its own active state. */}
      <div className="flex items-center justify-between">
        <div className="relative flex rounded-full border border-white/20 bg-black/15 p-1">
          {(["weekly", "monthly"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className="relative rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors duration-300"
              style={{ color: view === v ? "#27221E" : "rgba(244,239,230,0.75)" }}
            >
              {view === v && (
                <motion.span
                  layoutId="active-view-pill"
                  className="absolute inset-0 rounded-full bg-ivory"
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.35, ease: EASE_AIR }}
                />
              )}
              <span className="relative">{v}</span>
            </button>
          ))}
        </div>
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: element.color }}
          aria-hidden="true"
        />
      </div>

      <AnimatePresence mode="wait">
        {view === "weekly" ? (
          <motion.div
            key="weekly"
            initial={prefersReducedMotion ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_AIR }}
          >
            <div className="mt-5 flex items-baseline justify-between">
              <span className="font-display text-3xl font-normal leading-none text-ivory">
                {MONTH_NAMES[month]}
              </span>
              <span className="font-display text-3xl font-normal leading-none text-ivory">{today}</span>
            </div>
            <div className="mt-5 grid grid-cols-7 gap-1 text-center">
              {DAY_LETTERS.map((d, i) => (
                <span key={i} className="text-xs text-ivory/50">
                  {d}
                </span>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-7 gap-1 text-center">
              {weekDates.map((d, i) => (
                <div
                  key={i}
                  className="mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm"
                  style={
                    d === today
                      ? { backgroundColor: element.color, color: "#F4EFE6" }
                      : { color: "rgba(244,239,230,0.85)" }
                  }
                >
                  {d}
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="monthly"
            initial={prefersReducedMotion ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_AIR }}
          >
            <div className="mt-5 grid grid-cols-7 text-center">
              {DAY_LETTERS.map((d, i) => (
                <span key={i} className="pb-2 text-xs text-ivory/50">
                  {d}
                </span>
              ))}
            </div>
            {monthGrid.map((week, wi) => (
              <div
                key={wi}
                className={`grid grid-cols-7 border-white/15 py-1.5 ${wi > 0 ? "border-t" : ""}`}
              >
                {week.map((d, di) => (
                  <div key={di} className="flex items-center justify-center text-sm">
                    {d && (
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-full"
                        style={
                          d === today
                            ? { backgroundColor: element.color, color: "#F4EFE6" }
                            : { color: "rgba(244,239,230,0.85)" }
                        }
                      >
                        {d}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mx-auto mt-4 max-w-xs text-center text-xs italic leading-snug text-ivory/60">
        &ldquo;{element.poetic}&rdquo;
      </p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-xs text-ivory/70 sm:text-sm">Twenty minutes, no pitch attached.</span>
        <motion.button
          type="button"
          onClick={() => setExpanded(true)}
          whileHover={prefersReducedMotion ? undefined : { scale: 1.04 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
          className={`shrink-0 rounded-full bg-ivory px-5 py-2.5 text-sm font-medium text-soil transition-opacity duration-300 ${expanded ? "pointer-events-none opacity-0" : ""}`}
        >
          + Book a call
        </motion.button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: EASE_AIR }}
            className="overflow-hidden"
          >
            <div className="mt-5 rounded-2xl bg-background p-1 sm:p-2">
              <CalendlyEmbed url={site.calendlyUrl} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
