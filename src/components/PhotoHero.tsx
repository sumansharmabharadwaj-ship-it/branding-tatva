"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { kenBurnsAnimation } from "@/animations/kenBurns";
import { toSvh } from "@/lib/media";

const KEN_BURNS = kenBurnsAnimation({ scale: 1.07, duration: 22 });

// Full-bleed hero, the structure used across every reference site
// (Nevada House, Haven, Sylvan): a real photo or video fills the
// section, a dark gradient keeps text legible, content sits on top.
// Height varies by page: tall on the homepage, shorter elsewhere so
// secondary pages get to their content faster. When only a still image
// is given, it holds a slow continuous Ken Burns drift so it's never
// sitting completely still; a video background moves on its own.

const gradient =
  "linear-gradient(180deg, rgba(39,34,30,0.55) 0%, rgba(39,34,30,0.78) 60%, rgba(39,34,30,0.92) 100%)";

export function PhotoHero({
  children,
  image,
  video,
  poster,
  minHeight = "60vh",
  imagePosition = "center",
  className,
  accentColor,
}: {
  children?: React.ReactNode;
  image?: string;
  video?: string;
  poster?: string;
  minHeight?: string;
  imagePosition?: string;
  className?: string;
  accentColor?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  // A case study's hero footage is industry-specific (an office, a
  // warehouse) rather than generic nature photography, so an
  // accentColor tints it toward that project's own element color
  // instead of replacing it outright.
  const accentWash = accentColor ? (
    <div className="absolute inset-0" style={{ backgroundColor: accentColor, opacity: 0.16, mixBlendMode: "multiply" }} />
  ) : null;

  return (
    <section
      className={`relative flex items-center overflow-hidden bg-soil ${className ?? ""}`}
      style={{ minHeight: toSvh(minHeight) }}
    >
      {video && !prefersReducedMotion ? (
        <>
          <video
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: imagePosition }}
            src={video}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
          />
          {accentWash}
          <div className="absolute inset-0" style={{ backgroundImage: gradient }} />
        </>
      ) : (
        <motion.div
          className="absolute inset-0"
          initial={KEN_BURNS.initial}
          animate={prefersReducedMotion ? undefined : KEN_BURNS.animate}
          transition={KEN_BURNS.transition}
        >
          <Image
            src={poster ?? image ?? ""}
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: imagePosition }}
          />
          {accentWash}
          <div className="absolute inset-0" style={{ backgroundImage: gradient }} />
        </motion.div>
      )}
      {children}
    </section>
  );
}
