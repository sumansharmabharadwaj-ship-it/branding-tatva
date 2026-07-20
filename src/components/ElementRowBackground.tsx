"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { kenBurnsAnimation } from "@/animations/kenBurns";

const KEN_BURNS = kenBurnsAnimation({ scale: 1.06, duration: 26 });

// The photographic backdrop behind each Five Elements row. Previously
// rendered at 16% opacity with mix-blend-mode: color — a blend mode that
// keeps only the photo's hue/saturation and takes luminosity from
// whatever's behind it, which against this section's pale cream
// background crushed five real photos down to a barely-visible tint.
// The row read as a flat color card, not a photograph. Now the photo
// shows at real opacity with a slow continuous drift (the same
// technique used everywhere else full-bleed media appears on the site),
// so this section stops being the one static, uncreative stretch of the
// page. A tinted wash in the element's own color keeps the five rows
// reading as one coherent set rather than five unrelated photos.
export function ElementRowBackground({ image, color }: { image: string; color: string }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <motion.div
        className="absolute inset-0"
        initial={KEN_BURNS.initial}
        animate={prefersReducedMotion ? undefined : KEN_BURNS.animate}
        transition={KEN_BURNS.transition}
      >
        <Image
          src={image}
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </motion.div>
      <div className="absolute inset-0" style={{ backgroundColor: color, opacity: 0.22, mixBlendMode: "multiply" }} />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: "linear-gradient(180deg, rgba(244,239,230,0.55) 0%, rgba(244,239,230,0.7) 100%)" }}
      />
    </div>
  );
}
