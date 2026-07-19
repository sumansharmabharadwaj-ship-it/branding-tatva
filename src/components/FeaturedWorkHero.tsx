"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

// The large featured-work entry: a full photographic block with a slow
// hover zoom, distinct from the smaller text-only entries beside it so
// the section reads as one large story plus two quiet footnotes, not
// three identical cards.

export function FeaturedWorkHero({
  href,
  image,
  industry,
  title,
  outcome,
  imagePosition = "center",
}: {
  href: string;
  image: string;
  industry: string;
  title: string;
  outcome: string;
  imagePosition?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <a
      href={href}
      data-cursor-label="View case study"
      className="group relative flex min-h-[75vh] items-end overflow-hidden bg-soil"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1 }}
        animate={prefersReducedMotion ? undefined : { scale: 1.05 }}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 16, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      >
        <Image
          src={image}
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: imagePosition }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(0deg, rgba(39,34,30,0.92) 0%, rgba(39,34,30,0.35) 55%, rgba(39,34,30,0.25) 100%)",
          }}
        />
      </motion.div>
      <div className="container-page relative py-10">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-sandstone">{industry}</p>
        <p className="mt-3 max-w-xl font-display text-3xl font-semibold text-ivory sm:text-4xl">
          {title}
        </p>
        <p className="mt-3 max-w-lg text-sm text-ivory/70">{outcome}</p>
      </div>
    </a>
  );
}
