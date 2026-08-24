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
  | "imagine_your_brand_started"
  | "imagine_your_brand_completed"
  | "project_map_emailed"
  | "channel_strategy_viewed"
  | "lab_project_explored"
  | "decision_artifact_expanded"
  | "visitor_situation_selected"
  | "package_viewed"
  | "packages_compared"
  | "health_check_started"
  | "health_check_completed"
  | "lead_magnet_requested"
  | "faq_opened"
  | "calendar_opened"
  | "booking_completed"
  | "contact_form_validation_failed"
  | "contact_form_delivery_failed"
  | "contact_form_submitted"
  | "contact_route_selected";

export function track(event: AnalyticsEvent, props?: Record<string, string | number | boolean>) {
  // Gating the <Analytics /> component alone is half a gate: this call can
  // load the measurement script by itself, so a visitor who declined would
  // still be counted the first time they clicked anything. The consent
  // record is checked on every event rather than cached, so withdrawing
  // takes effect on the very next interaction.
  if (!readConsent().analytics) return;
  try {
    vercelTrack(event, props);
  } catch {}
}
