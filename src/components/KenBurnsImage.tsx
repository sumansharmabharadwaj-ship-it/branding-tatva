"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// A reusable slow, continuous zoom drift for any full-bleed background
// image block that isn't already a hero. Used anywhere a static photo
// panel would otherwise sit motionless for the entire time it's on
// screen, like the diptych panels on the home page.
//
// CSS background-image never gets native browser lazy-loading (unlike
// an <img loading="lazy">), so every instance of this on a page would
// otherwise download immediately regardless of scroll position — real
// weight on pages with several diptych/project-card panels below the
// fold. The gradient (solid color, ~instant) still renders immediately
// so the panel isn't blank; only the photo itself is deferred.

export function KenBurnsImage({
  image,
  gradient,
  className,
  imagePosition = "center",
}: {
  image: string;
  gradient: string;
  className?: string;
  imagePosition?: string;
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
      style={{
        backgroundImage: shouldLoad ? `${gradient}, url(${image})` : gradient,
        backgroundSize: "cover",
        backgroundPosition: imagePosition,
      }}
      initial={{ scale: 1 }}
      animate={prefersReducedMotion ? undefined : { scale: 1.08 }}
      transition={{ duration: 18, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
    />
  );
}
