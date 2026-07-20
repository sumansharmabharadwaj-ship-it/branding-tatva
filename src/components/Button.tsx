"use client";

import Link from "next/link";
import { ReactNode, useRef, useState, type MouseEvent } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/Magnetic";
import { useSpotlight } from "@/hooks/useSpotlight";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  onClick?: () => void;
};

const EASE = [0.16, 1, 0.3, 1] as const;
let rippleId = 0;

// Pill-shaped to match the badge/scroll-cue language already used across
// every hero. Every button shares three moves regardless of variant —
// magnetic pull, a click ripple, and an arrow that extends outward
// rather than just fading in — plus one variant-specific signature:
// primary keeps the cursor-tracking spotlight sheen (useSpotlight, same
// technique as the photo/video sections); secondary gets a border that
// draws itself in on hover instead, since a glint would just look like
// a smudge on a pill with no fill behind it to catch the light.

export function LinkButton({ href, children, variant = "primary", className, onClick }: ButtonProps) {
  const prefersReducedMotion = useReducedMotion();
  const linkRef = useRef<HTMLAnchorElement>(null);
  const spotlightRef = useSpotlight(linkRef, variant !== "primary" || Boolean(prefersReducedMotion));
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    if (!prefersReducedMotion) {
      const rect = e.currentTarget.getBoundingClientRect();
      const id = rippleId++;
      setRipples((prev) => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 650);
    }
    onClick?.();
  }

  const base =
    "group/btn relative overflow-hidden inline-flex items-center justify-center gap-1.5 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 ease-earth focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-state-focus focus-visible:ring-offset-2";
  const styles = {
    primary: "bg-action-primary text-white hover:bg-action-primary-hover hover:-translate-y-0.5 hover:shadow-elevation-lg",
    secondary:
      "border border-soil/30 text-soil hover:border-soil/50 hover:bg-soil/5 hover:-translate-y-0.5",
  };

  return (
    <Magnetic className="inline-block">
      <Link ref={linkRef} href={href} onClick={handleClick} className={cn(base, styles[variant], className)}>
        {variant === "primary" && (
          <span
            ref={spotlightRef}
            aria-hidden="true"
            className="cursor-spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
          />
        )}

        {variant === "secondary" && (
          <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
            <rect
              x="0.5"
              y="0.5"
              width="calc(100% - 1px)"
              height="calc(100% - 1px)"
              rx="9999"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              pathLength={1}
              className="text-action-primary opacity-0 [stroke-dasharray:1] [stroke-dashoffset:1] transition-[stroke-dashoffset,opacity] duration-500 ease-earth group-hover/btn:opacity-100 group-hover/btn:[stroke-dashoffset:0]"
            />
          </svg>
        )}

        {!prefersReducedMotion && (
          <AnimatePresence>
            {ripples.map((r) => (
              <motion.span
                key={r.id}
                aria-hidden="true"
                className="pointer-events-none absolute rounded-full bg-current"
                style={{ left: r.x, top: r.y, transform: "translate(-50%, -50%)" }}
                initial={{ width: 0, height: 0, opacity: 0.3 }}
                animate={{ width: 220, height: 220, opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
              />
            ))}
          </AnimatePresence>
        )}

        <span className="relative z-10 inline-flex items-center gap-1.5">
          {children}
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true" className="ml-0.5 shrink-0 overflow-visible">
            <line
              x1="0"
              y1="5"
              x2="10"
              y2="5"
              stroke="currentColor"
              strokeWidth="1.4"
              className="origin-left scale-x-0 transition-transform duration-300 ease-earth group-hover/btn:scale-x-100"
            />
            <path
              d="M7 1L11 5L7 9"
              stroke="currentColor"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 ease-earth group-hover/btn:translate-x-1"
            />
          </svg>
        </span>
      </Link>
    </Magnetic>
  );
}
