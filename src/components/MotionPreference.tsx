"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";

type MotionPref = "full" | "reduced";
const STORAGE_KEY = "bt-motion";

const MotionPrefContext = createContext<{
  pref: MotionPref;
  hydrated: boolean;
  setPref: (p: MotionPref) => void;
}>({ pref: "full", hydrated: false, setPref: () => {} });

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
    } catch {
      // The default and OS preference still work when storage is unavailable.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.dataset.motion = pref;
  }, [hydrated, pref]);

  function setPref(p: MotionPref) {
    setPrefState(p);
    try {
      window.localStorage.setItem(STORAGE_KEY, p);
    } catch {
      // The choice still applies for the current visit.
    }
  }

  // MotionConfig governs Motion components. Bespoke DOM and media
  // fallbacks use the hydration-safe hook so React never branches while
  // hydrating server-rendered markup.
  const reducedMotion = !hydrated ? "never" : pref === "reduced" ? "always" : "user";

  return (
    <MotionPrefContext.Provider value={{ pref, hydrated, setPref }}>
      <MotionConfig reducedMotion={reducedMotion}>{children}</MotionConfig>
    </MotionPrefContext.Provider>
  );
}

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
            onPointerDown={() => setPref(option)}
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
