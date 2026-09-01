"use client";

import { track as vercelTrack } from "@vercel/analytics";
import { readConsent } from "@/lib/consent";

// One measurement door for the whole site — the conversion events the
// redesign brief names, nothing else. Wraps Vercel Analytics so every
// event lands in the project's own dashboard with zero extra setup;
// swallows errors so measurement can never break an interaction.
export type AnalyticsEvent =
  | "hero_booking_click"
  | "case_study_opened"
  | "work_filter_selected"
  | "capability_selected"
  | "deliverable_inspected"
  | "contextual_cta_clicked"
  | "insights_path_selected"
  | "insights_article_selected"
  | "insights_evidence_layer_toggled"
  | "insights_field_note_requested"
  | "insights_field_note_return_to_library"
  | "imagine_your_brand_started"
  | "imagine_your_brand_completed"
  | "project_map_emailed"
  | "channel_strategy_viewed"
  | "lab_project_explored"
  | "decision_artifact_expanded"
  | "visitor_situation_selected"
  | "package_viewed"
  | "packages_compared"
  | "verified_proof_beat_selected"
  | "health_check_started"
  | "health_check_completed"
  | "lead_magnet_requested"
  | "faq_opened"
  | "calendar_opened"
  | "strategy_note_copied"
  | "booking_completed"
  | "contact_form_validation_failed"
  | "contact_form_delivery_failed"
  | "contact_form_submitted"
  | "contact_route_selected"
  | "home_runtime_issue";

export function track(event: AnalyticsEvent, props?: Record<string, string | number | boolean>) {
  // Gating the <Analytics /> component alone is half a gate: this call can
  // load the measurement script by itself, so a visitor who declined would
  // still be counted the first time they clicked anything. The consent
  // record is checked on every event rather than cached, so withdrawing
  // takes effect on the very next interaction.
  if (!readConsent().analytics) return false;
  try {
    vercelTrack(event, props);
    return true;
  } catch {
    return false;
  }
}

export type HomeRuntimeIssue =
  | "diagnostic_transition_failed"
  | "scene_visibility_failed"
  | "scene_visibility_recovered"
  | "media_playback_failed"
  | "scheduler_timeout"
  | "scheduler_script_failed"
  | "scheduler_initialization_failed"
  | "personalization_storage_read_failed"
  | "personalization_storage_write_failed"
  | "personalization_storage_clear_failed";

type RuntimeContext = {
  scene?: string;
  media?: string;
  attempt?: number;
};

const RUNTIME_SCENES = new Set([
  "opening",
  "diagnostic",
  "cost",
  "evidence",
  "paths",
  "process",
  "studio",
  "decision",
  "invitation",
]);

const RUNTIME_MEDIA = new Map([
  ["BT-HOME-HERO-FOREST-SANCTUARY", "opening_film"],
  ["BT-HOME-HIDDEN-COST-RIVER-DAWN", "cost_film"],
  ["BT-HOME-SELECTED-WORK-CINEMATIC-V2", "evidence_film"],
  ["BT-HOME-PATHS-GOLDEN-DUNES", "paths_film"],
  ["BT-HOME-METHOD-STREAM-LIGHT", "process_film"],
  ["BT-HOME-INVITATION-SUMMIT-FIRST-LIGHT-V1", "invitation_film"],
]);

const runtimeIssueKeys = new Set<string>();

function boundedRoute(pathname: string) {
  if (pathname === "/") return "home";
  const route = pathname.split("/").filter(Boolean)[0];
  return new Set(["about", "services", "work", "insights", "contact"]).has(route)
    ? route
    : "other";
}

function deviceBucket() {
  if (window.innerWidth < 768) return "mobile";
  if (window.innerWidth < 1100) return "tablet";
  return "desktop";
}

function motionBucket() {
  if (document.documentElement.dataset.motion === "reduced") return "site_reduced";
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "os_reduced"
    : "full";
}

export function trackRuntimeIssue(issue: HomeRuntimeIssue, context: RuntimeContext = {}) {
  if (typeof window === "undefined") return false;
  const scene = context.scene && RUNTIME_SCENES.has(context.scene) ? context.scene : "unknown";
  const media = context.media ? (RUNTIME_MEDIA.get(context.media) ?? "unknown") : "none";
  const attempt = Math.max(0, Math.min(3, Math.round(context.attempt ?? 0)));
  const payload = {
    issue,
    scene,
    media,
    attempt,
    device: deviceBucket(),
    motion: motionBucket(),
    route: boundedRoute(window.location.pathname),
  };
  const key = JSON.stringify(payload);
  if (runtimeIssueKeys.has(key)) return false;
  if (runtimeIssueKeys.size >= 128) runtimeIssueKeys.clear();
  const sent = track("home_runtime_issue", payload);
  if (sent) runtimeIssueKeys.add(key);
  return sent;
}
