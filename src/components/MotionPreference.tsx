"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";

// The site's own Full/Reduced motion control (80 page manual p23:
// "Offer an optional Full/Reduced control"). The OS level setting
// keeps working exactly as before; this adds an explicit choice for
// visitors whose OS says nothing but who'd rather read than watch.
//
// Two delivery paths, both driven from one stored preference:
// - MotionConfig reducedMotion="always" makes every Framer component's
//   useReducedMotion() return true inside this provider, so the
//   existing per-component fallbacks all engage with zero changes.
// - data-motion="reduced" on <html> engages the CSS clamp in
//   globals.css for raw keyframe animations (mist drift, sky
//   crossings, aurora) that Framer never sees.
//
// The default is "full" until the visitor chooses otherwise; the OS
// preference already covers the "system says reduce" case on its own.

type MotionPref = "full" | "reduced";
const STORAGE_KEY = "bt-motion";

const MotionPrefContext = createContext<{
  pref: MotionPref;
  setPref: (p: MotionPref) => void;
}>({ pref: "full", setPref: () => {} });

export function useMotionPreference() {
  return useContext(MotionPrefContext);
}

export function MotionPreferenceProvider({ children }: { children: React.ReactNode }) {
  // Server render and first client render agree on "full"; the stored
  // choice applies right after mount, which keeps hydration clean.
  const [pref, setPrefState] = useState<MotionPref>("full");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "reduced") setPrefState("reduced");
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion = pref;
  }, [pref]);

  function setPref(p: MotionPref) {
    setPrefState(p);
    try {
      window.localStorage.setItem(STORAGE_KEY, p);
    } catch {
      // Storage can be unavailable (private mode); the choice still
      // applies for this visit.
    }
  }

  return (
    <MotionPrefContext.Provider value={{ pref, setPref }}>
      <MotionConfig reducedMotion={pref === "reduced" ? "always" : "user"}>{children}</MotionConfig>
    </MotionPrefContext.Provider>
  );
}

// The control itself — small, quiet, sits in the footer on every page.
export function MotionToggle() {
  const { pref, setPref } = useMotionPreference();
  return (
    <div className="inline-flex items-center gap-2 text-xs text-ivory/60">
      <span id="motion-toggle-label" className="uppercase tracking-[0.14em]">
        Motion
      </span>
      <div role="group" aria-labelledby="motion-toggle-label" className="inline-flex overflow-hidden rounded-full border border-ivory/25">
        {(["full", "reduced"] as const).map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={pref === option}
            onClick={() => setPref(option)}
            className={`px-3 py-1 capitalize transition-colors duration-300 ${
              pref === option ? "bg-ivory/15 text-ivory" : "text-ivory/55 hover:text-ivory"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
