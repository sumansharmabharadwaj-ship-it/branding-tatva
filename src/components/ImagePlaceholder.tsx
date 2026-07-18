// Placeholder frame for portraits/case-study visuals until real assets are
// supplied. Deliberately echoes the hero's bindu/convergence language — a
// single centred mark inside a thin frame — so the visual system reads as
// one continuous idea from hero to photo, not two unrelated design choices.

import { cn } from "@/lib/utils";

export function ImagePlaceholder({
  label,
  aspect = "aspect-[4/5]",
  className,
}: {
  label: string;
  aspect?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(aspect, "flex items-center justify-center rounded-lg border border-dashed border-border bg-background-alt", className)}
    >
      <div className="text-center px-6">
        <div className="mx-auto h-2 w-2 rounded-full bg-soil/40" />
        <p className="mt-3 text-xs text-foreground-secondary">{label}</p>
      </div>
    </div>
  );
}
