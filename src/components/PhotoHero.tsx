"use client";

import { motion, useReducedMotion } from "framer-motion";

// Full-bleed photograph hero, the structure used across every reference
// site (Nevada House, Haven, Sylvan): a real photo fills the section, a
// dark gradient keeps text legible, content sits on top. Height varies
// by page: tall on the homepage, shorter elsewhere so secondary pages
// get to their content faster. The image itself holds a slow, continuous
// Ken Burns drift, an infinite gentle mirror between two points rather
// than a one-shot zoom, so the hero is never sitting completely still
// even before anyone scrolls.

export function PhotoHero({
  children,
  image,
  minHeight = "60vh",
  className,
}: {
  children?: React.ReactNode;
  image: string;
  minHeight?: string;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className={`relative flex items-center overflow-hidden bg-soil ${className ?? ""}`}
      style={{ minHeight }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(39,34,30,0.55) 0%, rgba(39,34,30,0.78) 60%, rgba(39,34,30,0.92) 100%), url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        initial={{ scale: 1 }}
        animate={prefersReducedMotion ? undefined : { scale: 1.07 }}
        transition={{ duration: 22, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />
      {children}
    </section>
  );
}
