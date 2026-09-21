"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { REGION_COOKIE, isRegion, type Region } from "@/data/pricing";

// Client side region state for location aware pricing. The server
// detects a starting region (cookie first, then Vercel's country
// header) and passes it down; the visitor's manual choice is written
// back to the cookie so the next server render agrees with it. The
// selector is mandatory UI wherever a price shows — detection is a
// starting point, never a lock.
const PricingContext = createContext<{ region: Region; setRegion: (r: Region) => void }>({
  region: "row",
  setRegion: () => {},
});

export function PricingProvider({ initialRegion, children }: { initialRegion: Region; children: React.ReactNode }) {
  const [region, setRegionState] = useState<Region>(initialRegion);

  // A cookie written after the server render (e.g. the visitor chose a
  // region, then navigated client side) still wins on mount.
  useEffect(() => {
    const match = document.cookie.match(new RegExp(`${REGION_COOKIE}=([a-z]+)`));
    if (match && isRegion(match[1])) setRegionState(match[1]);
  }, []);

  function setRegion(r: Region) {
    setRegionState(r);
    try {
      document.cookie = `${REGION_COOKIE}=${r}; path=/; max-age=31536000; samesite=lax`;
    } catch {}
  }

  return <PricingContext.Provider value={{ region, setRegion }}>{children}</PricingContext.Provider>;
}

export function usePricing() {
  return useContext(PricingContext);
}
