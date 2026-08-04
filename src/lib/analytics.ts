"use client";

import { track as vercelTrack } from "@vercel/analytics";

export type AnalyticsEvent =
  | "hero_booking_click"
  | "closing_booking_click"
  | "case_study_opened"
  | "capability_selected"
  | "deliverable_inspected"
  | "contextual_cta_clicked"
  | "imagine_your_brand_started"
  | "imagine_your_brand_completed"
  | "project_map_emailed"
  | "channel_strategy_viewed"
  | "lab_project_explored"
  | "decision_artifact_expanded"
  | "visitor_situation_selected"
  | "evidence_case_selected"
  | "evidence_case_opened"
  | "home_author_lens_selected"
  | "service_path_opened"
  | "package_viewed"
  | "packages_compared"
  | "health_check_started"
  | "health_check_completed"
  | "lead_magnet_requested"
  | "faq_opened"
  | "calendar_opened"
  | "booking_completed";

const CONSENT_KEY = "bt-consent-v2";

function consented() {
  try {
    const stored = window.localStorage.getItem(CONSENT_KEY);
    if (!stored) return false;
    const parsed = JSON.parse(stored) as { analytics?: unknown };
    return parsed.analytics === true;
  } catch {
    return false;
  }
}

export function track(event: AnalyticsEvent, props?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined" || !consented()) return;
  try {
    vercelTrack(event, props);
  } catch {
    // Measurement must never interrupt the visitor's interaction.
  }
}
