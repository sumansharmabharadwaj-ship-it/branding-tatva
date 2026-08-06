"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { motion } from "framer-motion";
import type { KeyboardEvent, ReactNode } from "react";
import { motionTokens } from "@/lib/motionTokens";

// The one shared card primitive the Scroll OS calls for (§14: one
// purpose specific interaction, never universal tilt-and-glow). This
// is the base every specific card type (project, deliverable,
// capability, package) composes on top of — a real button semantics
// element when onClick is passed, a lift within the OS's own card
// amplitude (4 to 10px, here 4), and a focus ring that survives on
// dark AND light grounds via currentColor rather than one hardcoded
// accent. Reduced motion drops the lift/tap animation entirely; the
// card stays fully usable and fully visible either way.
type InteractiveCardProps = {
  children: ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
  ariaPressed?: boolean;
  className?: string;
};

export function InteractiveCard({ children, onClick, ariaLabel, ariaPressed, className = "" }: InteractiveCardProps) {
  const reduceMotion = useHydratedReducedMotion();

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!onClick) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  }

  return (
    <motion.article
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      onClick={onClick}
      onKeyDown={onKeyDown}
      initial={false}
      whileHover={reduceMotion || !onClick ? undefined : { y: -motionTokens.cardLift }}
      whileTap={reduceMotion || !onClick ? undefined : { scale: 0.995 }}
      transition={{ duration: motionTokens.durationFast, ease: motionTokens.easeOrganic }}
      className={[
        "group relative overflow-hidden rounded-2xl border transition-colors duration-300",
        onClick ? "cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" : "",
        className,
      ].join(" ")}
    >
      {children}
    </motion.article>
  );
}
