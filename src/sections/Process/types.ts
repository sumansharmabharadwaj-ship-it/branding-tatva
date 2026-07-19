import type { ProcessStage } from "@/data/process";

export type ProcessSectionProps = {
  stages: ProcessStage[];
  elementColor: Record<string, string>;
};
