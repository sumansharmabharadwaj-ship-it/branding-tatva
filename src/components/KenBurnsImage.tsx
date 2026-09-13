"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import Image from "next/image";
import { motion } from "framer-motion";
import { kenBurnsAnimation } from "@/animations/kenBurns";
import { useLazyMount } from "@/hooks/useLazyMount";

const KEN_BURNS = kenBurnsAnimation();

// A reusable slow, continuous zoom drift for any full-bleed background
// image block that isn't already a hero. Used anywhere a static photo
// panel would otherwise sit motionless for the entire time it's on
// screen, like the diptych panels on the home page.
//
// next/image gives this a real srcset (avif/webp, sized per breakpoint)
// instead of one fixed-resolution JPEG regardless of viewport — the
// <Image> itself isn't rendered until the panel nears the viewport
// (useLazyMount's IntersectionObserver + Lenis-scroll fallback), and
// once it does mount it's marked priority so it fetches immediately
// instead of picking up a second, independent (and confirmed
// unreliable on its own) native lazy-load gate on top of that. The
// gradient (solid color, ~instant) still renders immediately so the
// panel isn't blank.

export function KenBurnsImage({
  image,
  gradient,
  className,
  imagePosition = "center",
  sizes = "100vw",
}: {
  image: string;
  gradient: string;
  className?: string;
  imagePosition?: string;
  sizes?: string;
}) {
  const prefersReducedMotion = useHydratedReducedMotion();
  const [ref, shouldLoad] = useLazyMount();

  return (
    <motion.div
      ref={ref}
      className={`absolute inset-0 ${className ?? ""}`}
      style={{ backgroundImage: shouldLoad ? undefined : gradient }}
      initial={KEN_BURNS.initial}
      animate={prefersReducedMotion ? undefined : KEN_BURNS.animate}
      transition={KEN_BURNS.transition}
    >
      {shouldLoad && (
        <>
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes={sizes}
            style={{ objectFit: "cover", objectPosition: imagePosition }}
          />
          <div className="absolute inset-0" style={{ backgroundImage: gradient }} />
        </>
      )}
    </motion.div>
  );
}
