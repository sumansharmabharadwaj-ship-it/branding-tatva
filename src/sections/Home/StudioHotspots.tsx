"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

// Suman's board, scene four: the studio explored instead of read.
// Glowing hotspots sit over the desk scene; each opens a small card
// naming a real place on the site where that side of the practice
// already lives — exploration with honest destinations, zero invented
// artifacts. Desktop positions the dots inside the scene; mobile gets
// the same four as an inline chip row (nothing depends on hover or
// precise coordinates on touch). One card open at a time; every
// control is a real button with aria-expanded.
const SPOTS = [
  {
    id: "notebook",
    label: "Strategy Notebook",
    line: "Deliverables you can open before you ever book.",
    href: "/services#study",
    pos: { left: "10%", top: "44%" },
  },
  {
    id: "research",
    label: "Research & Insights",
    line: "Twelve pieces answering real brand questions.",
    href: "/insights",
    pos: { left: "34%", top: "20%" },
  },
  {
    id: "philosophy",
    label: "Brand Philosophy",
    line: "Five Tatvas, one method, argued in the open.",
    href: "/about",
    pos: { left: "62%", top: "30%" },
  },
  {
    id: "approach",
    label: "Personal Approach",
    line: "One pair of hands, start to finish.",
    href: "/about",
    pos: { left: "84%", top: "56%" },
  },
] as const;

export function StudioHotspots() {
  const [open, setOpen] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      {/* Desktop: dots living inside the scene. */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden={false}>
        {SPOTS.map((s) => {
          const isOpen = open === s.id;
          return (
            <div key={s.id} className="pointer-events-auto absolute" style={s.pos}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-label={s.label}
                onClick={() => setOpen(isOpen ? null : s.id)}
                className="relative flex h-6 w-6 items-center justify-center rounded-full border border-ivory/70 bg-soil/40 backdrop-blur-sm transition-transform duration-300 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#C6A97A]" />
                {!prefersReducedMotion && (
                  <span className="absolute inset-0 animate-ping rounded-full border border-[#C6A97A]/50" style={{ animationDuration: "2.6s" }} />
                )}
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute left-1/2 top-8 z-10 w-56 -translate-x-1/2 rounded-2xl border border-ivory/15 p-4 text-left backdrop-blur-md"
                    style={{ backgroundColor: "rgba(23,20,17,0.85)" }}
                  >
                    <p className="text-sm font-medium text-ivory">{s.label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-ivory/75">{s.line}</p>
                    <Link
                      href={s.href}
                      className="link-underline mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-sandstone"
                    >
                      Open <span aria-hidden="true">→</span>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Mobile and tablet: the same four as honest chips. */}
      <div className="mt-8 flex flex-wrap justify-center gap-2 lg:hidden">
        {SPOTS.map((s) => (
          <Link
            key={s.id}
            href={s.href}
            className="inline-flex items-center gap-2 rounded-full border border-ivory/25 px-4 py-1.5 text-xs text-ivory/85 transition-colors duration-300 hover:border-sandstone hover:text-ivory"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#C6A97A]" />
            {s.label}
          </Link>
        ))}
      </div>
    </>
  );
}
