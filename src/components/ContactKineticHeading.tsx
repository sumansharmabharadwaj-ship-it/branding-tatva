"use client";

import { useContext, type ComponentPropsWithoutRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ContactSceneMotion } from "@/components/ContactCinematicScene";
import { cn } from "@/lib/utils";

type ContactKineticHeadingProps = Omit<ComponentPropsWithoutRef<"h2">, "children"> & {
  lines: readonly [string, string, string];
  resolveClassName: string;
};

/** Opposing lines settle into a crisp reading composition. Sharing the scene
 * timeline keeps the choreography identical in Safari, Chrome and Firefox. */
export function ContactKineticHeading({ lines, resolveClassName, className, "aria-label": ariaLabel, ...headingProps }: ContactKineticHeadingProps) {
  const scene = useContext(ContactSceneMotion);
  const restingProgress = useMotionValue(0.5);
  const progress = scene?.progress ?? restingProgress;
  const enabled = scene?.enabled ?? false;
  const distance = scene?.compact ? 12 : 46;
  const leadX = useTransform(progress, [0, 0.37, 0.76, 1], [-distance, 0, 0, distance * 0.18]);
  const bodyX = useTransform(progress, [0, 0.42, 0.76, 1], [distance * 0.65, 0, 0, -distance * 0.12]);
  const resolveY = useTransform(progress, [0, 0.46, 0.76, 1], [distance * 0.5, 0, 0, -distance * 0.15]);
  const underline = useTransform(progress, [0.12, 0.5], [0, 1]);
  return (
    <h2 {...headingProps} aria-label={ariaLabel ?? lines.join(" ")} data-contact-kinetic-heading data-contact-scene-heading data-contact-heading-motion="shared" className={className}>
      <span aria-hidden="true" data-contact-heading-stack>
        <motion.span data-contact-heading-line="lead" style={{ x: enabled ? leadX : 0 }}>{lines[0]}</motion.span>
        <motion.span data-contact-heading-line="body" style={{ x: enabled ? bodyX : 0 }}>{lines[1]}</motion.span>
        <motion.em data-contact-heading-line="resolve" className={cn("relative font-normal", resolveClassName)} style={{ y: enabled ? resolveY : 0 }}>
          {lines[2]}
          <motion.span data-contact-heading-ink style={{ scaleX: enabled ? underline : 1 }} />
        </motion.em>
      </span>
    </h2>
  );
}
