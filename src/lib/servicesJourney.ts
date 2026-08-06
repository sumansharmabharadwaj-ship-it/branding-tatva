import type { PackageSlug } from "@/data/pricing";

// The Services page asks for the visitor's condition once, then carries
// that answer into the package scene. Keeping the mapping in one small
// module prevents the Situation and Package components from inventing
// parallel vocabularies or drifting apart later.
export const SERVICES_SITUATION_STORAGE_KEY = "branding-tatva:services-situation";
export const SERVICES_SITUATION_EVENT = "branding-tatva:services-situation";

export const SERVICES_SITUATIONS = ["idea", "reposition", "ongoing"] as const;
export type ServicesSituationId = (typeof SERVICES_SITUATIONS)[number];

export const HOME_TO_SERVICES_SITUATION: Record<string, ServicesSituationId> = {
  idea: "idea",
  inconsistent: "reposition",
  outgrown: "ongoing",
};

export const SITUATION_TO_PACKAGE: Record<ServicesSituationId, PackageSlug> = {
  idea: "brand-beginning",
  reposition: "brand-clarity",
  ongoing: "brand-partnership",
};

export type ServicesSituationDetail = {
  situation: ServicesSituationId;
  packageSlug: PackageSlug;
};

export function isServicesSituation(value: string | null): value is ServicesSituationId {
  return value !== null && SERVICES_SITUATIONS.includes(value as ServicesSituationId);
}
