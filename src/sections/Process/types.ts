import type { ProcessStage } from "@/data/process";

export type ProcessSectionProps = {
  stages: ProcessStage[];
  elementColor: Record<string, string>;
  // Opt-in dark variant for use on a bold/dark section background
  // (e.g. Services' #process) — defaults to the light-mode colors Home's
  // Process section already relies on, so existing callers are unaffected.
  dark?: boolean;
};
