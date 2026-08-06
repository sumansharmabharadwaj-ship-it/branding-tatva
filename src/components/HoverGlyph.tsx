"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { motion } from "framer-motion";
import { ElementGlyph } from "@/components/ElementGlyph";
import { EASE_AIR } from "@/lib/motion";

type Slug = "earth" | "water" | "fire" | "air" | "space";

// The Footer's five-element row was purely decorative — no onMouse* at
// all — so hovering any one of the five felt identical to hovering
// nothing. A small per-glyph scale-and-brighten response ties the
// closing scene into the same interactive vocabulary as the rest of
// the site instead of leaving it inert. Its own client component (not
// inline motion.span in Footer/index.tsx, a server component) so
// reduced-motion gating stays self-contained, the same pattern
// TiltCard/FeaturedSecondaryCard already use.
export function HoverGlyph({ slug, color }: { slug: Slug; color: string }) {
  const prefersReducedMotion = useHydratedReducedMotion();
  return (
    <motion.span
      className="inline-flex cursor-default"
      initial={{ opacity: 0.6 }}
      whileHover={prefersReducedMotion ? undefined : { scale: 1.35, opacity: 1 }}
      transition={{ duration: 0.35, ease: EASE_AIR }}
    >
      <ElementGlyph slug={slug} className="h-5 w-5" style={{ color }} strokeWidth={1.2} />
    </motion.span>
  );
}
