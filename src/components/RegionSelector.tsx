"use client";

import { usePricing } from "@/components/PricingProvider";
import { REGIONS, isRegion } from "@/data/pricing";

// The mandatory manual region control — visible wherever a price is,
// so detection stays a convenience rather than a decision made for the
// visitor. A plain labelled select: honest, accessible, zero novelty.
export function RegionSelector() {
  const { region, setRegion } = usePricing();
  return (
    <label className="inline-flex items-center gap-2 text-xs text-ivory/70">
      Prices shown for
      <select
        value={region}
        onChange={(e) => {
          if (isRegion(e.target.value)) setRegion(e.target.value);
        }}
        className="min-h-11 rounded-full border border-ivory/25 bg-transparent px-3 py-2 text-xs text-ivory outline-none transition-colors focus:border-sandstone focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone [&>option]:text-soil"
      >
        {REGIONS.map((r) => (
          <option key={r.id} value={r.id}>
            {r.label} ({r.currency})
          </option>
        ))}
      </select>
    </label>
  );
}
