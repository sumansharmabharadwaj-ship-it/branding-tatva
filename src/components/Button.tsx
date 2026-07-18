import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

// Pill-shaped to match the badge/scroll-cue language already used across
// every hero, rather than a separate boxier button shape. The primary
// variant carries a small arrow that slides in on hover instead of just
// swapping background color, so the call to action has somewhere to go.

export function LinkButton({ href, children, variant = "primary", className }: ButtonProps) {
  const base =
    "group/btn inline-flex items-center justify-center gap-1.5 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 ease-earth focus-visible:outline-none";
  const styles = {
    primary: "bg-action-primary text-warm-white hover:bg-action-primary-hover hover:-translate-y-0.5 hover:shadow-lg hover:shadow-action-primary/25",
    secondary:
      "border border-soil/30 text-soil hover:border-soil/50 hover:bg-soil/5 hover:-translate-y-0.5",
  };

  return (
    <Link href={href} className={cn(base, styles[variant], className)}>
      {children}
      {variant === "primary" && (
        <span
          aria-hidden="true"
          className="inline-block -translate-x-1 opacity-0 transition-all duration-300 ease-earth group-hover/btn:translate-x-0 group-hover/btn:opacity-100"
        >
          &rarr;
        </span>
      )}
    </Link>
  );
}
