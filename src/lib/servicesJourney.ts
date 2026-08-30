import type { PackageSlug } from "@/data/pricing";
import { trackRuntimeIssue } from "@/lib/analytics";

// The Services page asks for the visitor's condition once, then carries
// that answer into the package scene. Keeping the mapping in one small
// module prevents the Situation and Package components from inventing
// parallel vocabularies or drifting apart later.
export const SERVICES_SITUATION_STORAGE_KEY = "branding-tatva:services-situation";
export const SERVICES_SITUATION_EVENT = "branding-tatva:services-situation";
export const SERVICES_SITUATION_CLEARED_EVENT = "branding-tatva:services-situation-cleared";
export const SERVICES_RECOGNITION_AUDIT_EVENT = "branding-tatva:services-recognition-audit";
export const SERVICES_SITUATION_MAX_AGE_MS = 30 * 60 * 1000;

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

export const PACKAGE_TO_SITUATION: Record<PackageSlug, ServicesSituationId> = {
  "brand-beginning": "idea",
  "brand-clarity": "reposition",
  "brand-partnership": "ongoing",
};

export const SITUATION_TO_PROOF_SLUG: Record<ServicesSituationId, string> = {
  idea: "myshopineurope",
  reposition: "herbalcart",
  ongoing: "dr-haley-nutrition",
};

export function servicesContactHref(packageSlug: PackageSlug) {
  return `/contact?package=${encodeURIComponent(packageSlug)}`;
}

export function packageSlugFromServicesContactParam(value: string | null): PackageSlug | null {
  return value && value in PACKAGE_TO_SITUATION ? (value as PackageSlug) : null;
}

export function calendlyHrefForServicesPackage(baseHref: string, packageSlug: PackageSlug | null) {
  if (!packageSlug) return baseHref;

  try {
    const href = new URL(baseHref);
    href.searchParams.set("utm_source", "services");
    href.searchParams.set("utm_medium", "website");
    href.searchParams.set("utm_campaign", packageSlug);
    return href.toString();
  } catch {
    return baseHref;
  }
}

export type ServicesSituationOrigin =
  | "home_diagnostic"
  | "home_paths"
  | "services"
  | "services_package";

export type ServicesSituationDetail = {
  situation: ServicesSituationId;
  packageSlug: PackageSlug;
  origin?: ServicesSituationOrigin;
  completedAt?: number;
};

export type ServicesRecognitionAuditDetail = {
  score: number;
  total: number;
};

export function recognitionAuditGuidance(score: number, total: number) {
  if (score === 0) return "Mark each statement that already holds.";
  if (score < Math.ceil(total * 0.5)) return "Recognition is leaking through more than one signal.";
  if (score < total) return "A usable pattern is forming; the remaining gaps are specific.";
  return total > 5 ? "All ten signals are working together." : "The open signals are coherent. Five deeper checks remain.";
}

export function publishServicesRecognitionAudit(score: number, total: number) {
  if (!Number.isInteger(score) || !Number.isInteger(total) || total < 1 || score < 0 || score > total) return;
  window.dispatchEvent(
    new CustomEvent<ServicesRecognitionAuditDetail>(SERVICES_RECOGNITION_AUDIT_EVENT, {
      detail: { score, total },
    }),
  );
}

type CompletedHomeDiagnosisRecord = ServicesSituationDetail & {
  origin: "home_diagnostic";
  completedAt: number;
};

export function isServicesSituation(value: string | null): value is ServicesSituationId {
  return value !== null && SERVICES_SITUATIONS.includes(value as ServicesSituationId);
}

export function completedHomeDiagnosisFrom(
  value: ServicesSituationDetail | null | undefined,
  now = Date.now(),
): ServicesSituationId | null {
  if (
    !value ||
    value.origin !== "home_diagnostic" ||
    !isServicesSituation(value.situation) ||
    value.packageSlug !== SITUATION_TO_PACKAGE[value.situation] ||
    typeof value.completedAt !== "number" ||
    value.completedAt > now ||
    now - value.completedAt > SERVICES_SITUATION_MAX_AGE_MS
  ) {
    return null;
  }
  return value.situation;
}

export function readCompletedHomeDiagnosis(now = Date.now()): ServicesSituationId | null {
  try {
    const raw = window.localStorage.getItem(SERVICES_SITUATION_STORAGE_KEY);
    if (!raw?.startsWith("{")) return null;
    return completedHomeDiagnosisFrom(JSON.parse(raw) as CompletedHomeDiagnosisRecord, now);
  } catch {
    trackRuntimeIssue("personalization_storage_read_failed");
    return null;
  }
}

export function publishCompletedHomeDiagnosis(situation: ServicesSituationId) {
  const detail: CompletedHomeDiagnosisRecord = {
    situation,
    packageSlug: SITUATION_TO_PACKAGE[situation],
    origin: "home_diagnostic",
    completedAt: Date.now(),
  };
  try {
    window.localStorage.setItem(SERVICES_SITUATION_STORAGE_KEY, JSON.stringify(detail));
  } catch {
    trackRuntimeIssue("personalization_storage_write_failed");
  }
  window.dispatchEvent(
    new CustomEvent<ServicesSituationDetail>(SERVICES_SITUATION_EVENT, { detail }),
  );
}

export function publishServicesSituation(
  situation: ServicesSituationId,
  origin: Exclude<ServicesSituationOrigin, "home_diagnostic"> = "services",
) {
  const detail: ServicesSituationDetail = {
    situation,
    packageSlug: SITUATION_TO_PACKAGE[situation],
    origin,
  };
  try {
    window.localStorage.setItem(SERVICES_SITUATION_STORAGE_KEY, situation);
  } catch {
    trackRuntimeIssue("personalization_storage_write_failed");
  }
  window.dispatchEvent(
    new CustomEvent<ServicesSituationDetail>(SERVICES_SITUATION_EVENT, { detail }),
  );
}

export function clearServicesSituation() {
  try {
    window.localStorage.removeItem(SERVICES_SITUATION_STORAGE_KEY);
  } catch {
    trackRuntimeIssue("personalization_storage_clear_failed");
  }
  window.dispatchEvent(new CustomEvent(SERVICES_SITUATION_CLEARED_EVENT));
}
