"use client";

import { useEffect, useState } from "react";
import { elements, type Element } from "@/data/elements";

// Which element governs the current calendar month — Jan-Mar Earth,
// Apr-May Water, Jun-Jul Fire, Aug-Oct Air, Nov-Dec Space. Pulled out of
// SeasonalCalendarPanel (its original, only caller) so Footer and Header
// can share the same accent — direct feedback that every button/pill
// defaulting to flat clay-orange (or plain ivory) read as boring; tying
// them to the current element instead means the color actually varies
// through the year and ties back to the five-element system, the same
// job the calendar's own accent dot already does.
export const MONTH_TO_ELEMENT: Element["slug"][] = [
  "earth", "earth", "earth", // Jan-Mar: the year's foundation
  "water", "water", // Apr-May
  "fire", "fire", // Jun-Jul: peak heat
  "air", "air", "air", // Aug-Oct
  "space", "space", // Nov-Dec: what's remembered as the year settles
];

// Resolved client-side only, after mount — computing new Date() during
// render risks a server/client hydration mismatch. Falls back to the
// first element (Earth) for the brief pre-mount frame.
export function useCurrentElement(): Element {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
  }, []);
  const month = now?.getMonth() ?? 0;
  return elements.find((el) => el.slug === MONTH_TO_ELEMENT[month]) ?? elements[0];
}
