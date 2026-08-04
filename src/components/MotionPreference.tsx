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
// Hydration deserves one extra guard. Framer can read the operating
// system's reduced-motion preference during the very first client
// render, while the server cannot. Several authored homepage scenes
// intentionally return a different static DOM when motion is reduced;
// letting that switch happen during hydration produces a genuine
// markup mismatch. The provider therefore renders with motion forced
// on for the server and first client pass, then applies the stored or
// operating-system preference immediately after mount. Visitors still
// receive the same reduced experience, just after React owns the DOM.

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
  const [pref, setPrefState] = useState<MotionPref>("full");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "reduced") setPrefState("reduced");
    } finally {
      setHydrated(true);
    }
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

  const reducedMotion = hydrated ? (pref === "reduced" ? "always" : "user") : "never";

  return (
    <MotionPrefContext.Provider value={{ pref, setPref }}>
      <MotionConfig reducedMotion={reducedMotion}>{children}</MotionConfig>
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
