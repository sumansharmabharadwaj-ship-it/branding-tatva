// Location aware pricing — the approved price book, one figure per
// market per package, researched against published solo and boutique
// rate cards (UK/US well sourced; Canada and India extrapolated from
// thinner public data, flagged in the research report). These are
// "begins at" figures by design: the site never quotes a final price,
// the discovery call does. Detection order: the visitor's explicit
// region choice (cookie, set by the mandatory selector) always wins,
// then Vercel's country header, then rest of world.
export type Region = "uk" | "us" | "ca" | "in" | "row";
export type PackageSlug = "brand-beginning" | "brand-clarity" | "brand-partnership";

export const REGION_COOKIE = "bt-region";

export const REGIONS: { id: Region; label: string; currency: string }[] = [
  { id: "uk", label: "United Kingdom", currency: "GBP" },
  { id: "us", label: "United States", currency: "USD" },
  { id: "ca", label: "Canada", currency: "CAD" },
  { id: "in", label: "India", currency: "INR" },
  { id: "row", label: "Rest of world", currency: "USD" },
];

// Amounts are whole currency units. Partnership is monthly; the other
// two are one time project fees, mirroring data/services.ts billing.
const BOOK: Record<Region, Record<PackageSlug, number>> = {
  uk: { "brand-beginning": 1950, "brand-clarity": 4500, "brand-partnership": 1100 },
  us: { "brand-beginning": 2800, "brand-clarity": 6500, "brand-partnership": 1500 },
  ca: { "brand-beginning": 3200, "brand-clarity": 7500, "brand-partnership": 1900 },
  in: { "brand-beginning": 85000, "brand-clarity": 225000, "brand-partnership": 50000 },
  row: { "brand-beginning": 2800, "brand-clarity": 6500, "brand-partnership": 1500 },
};

const LOCALE: Record<Region, string> = {
  uk: "en-GB",
  us: "en-US",
  ca: "en-CA",
  in: "en-IN",
  row: "en-US",
};

export function regionFromCountry(country: string | undefined | null): Region {
  switch ((country ?? "").toUpperCase()) {
    case "GB":
      return "uk";
    case "US":
      return "us";
    case "CA":
      return "ca";
    case "IN":
      return "in";
    default:
      return "row";
  }
}

export function isRegion(value: string | undefined | null): value is Region {
  return REGIONS.some((r) => r.id === value);
}

// The raw amount behind formatPrice, for surfaces that need to draw the
// figure (bar length, ratio) rather than print it. Same single source of
// truth as the formatted string, so a chart can never drift from the
// price it is labelled with.
export function priceAmount(region: Region, slug: PackageSlug): number {
  return BOOK[region][slug];
}

export function formatPrice(region: Region, slug: PackageSlug): string {
  const currency = REGIONS.find((r) => r.id === region)?.currency ?? "USD";
  return new Intl.NumberFormat(LOCALE[region], {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(BOOK[region][slug]);
}
