"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import { packages } from "@/data/services";
import { projects } from "@/data/projects";
import { blendHex } from "@/lib/sectionWash";

// The brief's "interactive decision moment" idea, built honestly: three
// buttons map to the site's three real packages (data/services.ts) —
// picking one reveals that package's own real description/includes/
// price, not invented content branching from a fake quiz. Short button
// labels are compressed from each package's own real `forWho` field
// rather than new copy.
const CHOICES = [
  { slug: "brand-beginning", label: "Starting with an idea" },
  { slug: "brand-clarity", label: "Feeling unclear or inconsistent" },
  { slug: "brand-partnership", label: "Needing ongoing consistency" },
] as const;

export function PackageSelector() {
  const [active, setActive] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const activePackage = packages.find((p) => p.slug === active);
  const proof = activePackage?.proofSlug ? projects.find((p) => p.slug === activePackage.proofSlug) : undefined;

  const transition = prefersReducedMotion ? { duration: 0 } : { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <Container className="max-w-2xl text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Desire</p>
      <h2 className="mt-2 text-display-sm font-display font-normal text-ivory">
        Where does your brand actually stand?
      </h2>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {CHOICES.map((choice) => (
          <button
            key={choice.slug}
            type="button"
            onClick={() => setActive(choice.slug)}
            className="rounded-full border px-5 py-2.5 text-sm transition-colors duration-300"
            style={{
              borderColor: active === choice.slug ? "#F4EFE6" : "rgba(244,239,230,0.3)",
              backgroundColor: active === choice.slug ? "rgba(244,239,230,0.12)" : "transparent",
              color: active === choice.slug ? "#F4EFE6" : "rgba(244,239,230,0.85)",
            }}
          >
            {choice.label}
          </button>
        ))}
      </div>

      <div className="relative mt-10 min-h-[240px] text-left">
        <AnimatePresence mode="wait">
          {activePackage ? (
            <motion.div
              key={activePackage.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={transition}
              className="rounded-lg border-t-2 p-6 sm:p-8"
              style={{ borderColor: activePackage.color, backgroundColor: blendHex(activePackage.color, "#27221E", 12) }}
            >
              <p className="font-display text-xl font-normal text-ivory">{activePackage.name}</p>
              <div className="mt-2 flex items-baseline gap-1.5">
                {activePackage.billing === "monthly" && <span className="text-sm text-ivory/60">from</span>}
                <span className="font-display text-2xl font-normal text-ivory">
                  £{activePackage.price.toLocaleString("en-GB")}
                </span>
                {activePackage.billing === "monthly" && <span className="text-sm text-ivory/60">/mo</span>}
              </div>
              <p className="mt-4 text-ivory/75">{activePackage.description}</p>
              <ul className="mt-4 space-y-1.5">
                {activePackage.includes.map((item) => (
                  <li key={item} className="text-sm text-ivory/70 before:mr-2 before:content-['•']">
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                {proof && (
                  <LinkButton href={`/work/${proof.slug}`} variant="secondary" className="border-ivory/30 text-ivory hover:bg-ivory/10">
                    See it in action: {proof.title}
                  </LinkButton>
                )}
                <LinkButton href="/contact" style={{ backgroundColor: activePackage.color }}>
                  Get started
                </LinkButton>
              </div>
            </motion.div>
          ) : (
            <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-sm text-ivory/50">
              Pick the one closest to true. The right package appears below.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </Container>
  );
}
