"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { kenBurnsAnimation } from "@/animations/kenBurns";

const KEN_BURNS = kenBurnsAnimation();

// A reusable slow, continuous zoom drift for any full-bleed background
// image block that isn't already a hero. Used anywhere a static photo
// panel would otherwise sit motionless for the entire time it's on
// screen, like the diptych panels on the home page.
//
// next/image gives this a real srcset (avif/webp, sized per breakpoint)
// instead of one fixed-resolution JPEG regardless of viewport — but it
// still fetches eagerly once mounted, so the IntersectionObserver gate
// stays: the <Image> itself isn't rendered until the panel nears the
// viewport, same 600px rootMargin as before. The gradient (solid color,
// ~instant) still renders immediately so the panel isn't blank.

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
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
            sizes={sizes}
            style={{ objectFit: "cover", objectPosition: imagePosition }}
          />
          <div className="absolute inset-0" style={{ backgroundImage: gradient }} />
        </>
      )}
    </motion.div>
  );
}
