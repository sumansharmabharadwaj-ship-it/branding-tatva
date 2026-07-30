"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CalendlyEmbed } from "./CalendlyEmbed";
import { BackgroundVideo } from "./BackgroundVideo";
import { EASE_AIR } from "@/lib/motion";
import { useCurrentElement } from "@/lib/currentElement";
import { site } from "@/data/site";

// A real glass-widget calendar (Weekly/Monthly toggle, an actual date
// grid, today highlighted) — not a quote-card layout. Went through two
// more rounds after the original monthly-element-video version: first
// dropped to a flat color glow (direct feedback the fire clip "looked
// so bad"), then asked back explicitly — a single fixed, warm
// campfire-conversation scene ("the warmth conversation we will have
// in comfort"), not tied to the monthly element rotation that kept
// causing problems (a stacking glitch, a harsh close-up ember clip).
// One well-chosen, verified clip now, permanently, with the isolate
// stacking-context fix still in place. The five-element tie-in lives
// in color only — the "today" highlight and the "+Book a call" button
// both use the current month's element accent (useCurrentElement,
// shared with Header/Footer), so the palette still varies through the
// year without needing five different video assets.
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
  const element = useCurrentElement();

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
      className="relative isolate h-full overflow-hidden rounded-2xl border border-white/15 p-5 sm:p-6"
      style={{ boxShadow: "0 20px 60px -20px rgba(0,0,0,0.5)" }}
    >
      <div className="absolute inset-0 -z-10">
        <BackgroundVideo
          video="/videos/pixabay-campfire-conversation.mp4"
          poster="/images/pixabay-campfire-conversation-poster.jpg"
        />
        {/* Was /45 with a near-invisible 1px blur — direct feedback that
            the dates and labels were unreadable against the campfire
            video's own bright flame/highlight areas, which swing from
            near-black to near-white within the same frame and can sit
            directly behind any given digit depending on scroll/loop
            position. A much darker, more blurred wash makes the
            backdrop read as soft ambient light rather than a sharp
            image competing with small text, so contrast stays
            consistent no matter what the video is doing underneath. */}
        <div className="absolute inset-0 bg-soil/75 backdrop-blur-sm" />
      </div>

      {/* Weekly / Monthly toggle, same shape and position as the
          reference — a shared sliding highlight (layoutId) rather than
          each pill managing its own active state. */}
      <div className="flex items-center justify-between">
        <div className="relative flex rounded-full border border-white/25 bg-black/30 p-1">
          {(["weekly", "monthly"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className="relative rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors duration-300"
              style={{
                color: view === v ? "#27221E" : "rgba(244,239,230,0.9)",
                textShadow: view === v ? undefined : "0 1px 4px rgba(0,0,0,0.6)",
              }}
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
              <span
                className="font-display text-3xl font-normal leading-none text-ivory"
                style={{ textShadow: "0 1px 8px rgba(0,0,0,0.65)" }}
              >
                {MONTH_NAMES[month]}
              </span>
              <span
                className="font-display text-3xl font-normal leading-none text-ivory"
                style={{ textShadow: "0 1px 8px rgba(0,0,0,0.65)" }}
              >
                {today}
              </span>
            </div>
            <div className="mt-5 grid grid-cols-7 gap-1 text-center">
              {DAY_LETTERS.map((d, i) => (
                <span
                  key={i}
                  className="text-xs font-medium text-ivory/75"
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
                >
                  {d}
                </span>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-7 gap-1 text-center">
              {weekDates.map((d, i) => (
                <div
                  key={i}
                  className="mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium"
                  style={
                    d === today
                      ? { backgroundColor: element.color, color: "#F4EFE6" }
                      : { color: "rgba(244,239,230,0.92)", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }
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
                <span
                  key={i}
                  className="pb-2 text-xs font-medium text-ivory/75"
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
                >
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
                  <div key={di} className="flex items-center justify-center text-sm font-medium">
                    {d && (
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-full"
                        style={
                          d === today
                            ? { backgroundColor: element.color, color: "#F4EFE6" }
                            : { color: "rgba(244,239,230,0.92)", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }
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

      <p
        className="mx-auto mt-4 max-w-xs text-center text-xs italic leading-snug text-ivory/80"
        style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
      >
        &ldquo;{element.poetic}&rdquo;
      </p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span
          className="text-xs text-ivory/85 sm:text-sm"
          style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
        >
          Twenty minutes, just a real conversation.
        </span>
        <motion.button
          type="button"
          onClick={() => setExpanded(true)}
          whileHover={prefersReducedMotion ? undefined : { scale: 1.04 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
          style={{ backgroundColor: element.color }}
          className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-medium text-ivory transition-opacity duration-300 ${expanded ? "pointer-events-none opacity-0" : ""}`}
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
