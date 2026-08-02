"use client";

import { track as vercelTrack } from "@vercel/analytics";

// One measurement door for the whole site — the conversion events the
// redesign brief names, nothing else. Wraps Vercel Analytics so every
// event lands in the project's own dashboard with zero extra setup;
// swallows errors so measurement can never break an interaction.
export type AnalyticsEvent =
  | "hero_booking_click"
  | "case_study_click"
  | "situation_selected"
  | "package_viewed"
  | "packages_compared"
  | "health_check_started"
  | "health_check_completed"
  | "audit_requested"
  | "faq_opened"
  | "calendar_opened"
  | "booking_completed";

export function track(event: AnalyticsEvent, props?: Record<string, string | number | boolean>) {
  try {
    vercelTrack(event, props);
  } catch {}
}
