"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import { ElementGlyph } from "@/components/ElementGlyph";
import { packages } from "@/data/services";
import { projects } from "@/data/projects";
import { blendHex } from "@/lib/sectionWash";

// The brief's "interactive decision moment" idea, built honestly: three
// buttons map to the site's three real packages (data/services.ts) —
// picking one reveals that package's own real description/includes/
// price, not invented content branching from a fake quiz. Short button
// labels are compressed from each package's own real `forWho` field
// rather than new copy. Element glyph per choice reuses each package's
// own already-documented element mapping (see the color comments next
// to each package in data/services.ts: clay/Earth, indigo/Water,
// rose-earth/Space) rather than inventing new iconography.
const CHOICES = [
  { slug: "brand-beginning", label: "Starting with an idea", element: "earth" },
  { slug: "brand-clarity", label: "Feeling unclear or inconsistent", element: "water" },
  { slug: "brand-partnership", label: "Needing ongoing consistency", element: "space" },
] as const;

type PackageSelectorProps = {
  eyebrow?: string;
  heading?: string;
  description?: string;
};

export function PackageSelector({
  eyebrow = "Desire",
  heading = "Where does your brand actually stand?",
  description,
}: PackageSelectorProps = {}) {
  const [active, setActive] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const activePackage = packages.find((p) => p.slug === active);
  const proof = activePackage?.proofSlug ? projects.find((p) => p.slug === activePackage.proofSlug) : undefined;

  const transition = prefersReducedMotion ? { duration: 0 } : { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <Container className="max-w-2xl text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-sandstone">{eyebrow}</p>
      <h2 className="mt-2 text-display-sm font-display font-normal text-ivory">
        {heading}
      </h2>
      {description && <p className="mx-auto mt-4 max-w-xl text-ivory/78">{description}</p>}
      <div className="mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
        {CHOICES.map((choice) => {
          const pkg = packages.find((p) => p.slug === choice.slug);
          const isActive = active === choice.slug;
          return (
            <button
              key={choice.slug}
              type="button"
              onClick={() => setActive(choice.slug)}
              className="flex min-h-11 flex-col items-center gap-3 rounded-lg border p-5 text-center transition-all duration-300 hover:-translate-y-0.5"
              style={{
                borderColor: isActive ? pkg?.color : "rgba(244,239,230,0.2)",
                backgroundColor: isActive ? blendHex(pkg?.color ?? "#B85A34", "#27221E", 18) : "transparent",
              }}
            >
              <ElementGlyph
                slug={choice.element}
                className="h-6 w-6"
                style={{ color: isActive ? pkg?.color : "rgba(244,239,230,0.6)" }}
              />
              <span className="text-sm" style={{ color: isActive ? "#F4EFE6" : "rgba(244,239,230,0.8)" }}>
                {choice.label}
              </span>
            </button>
          );
        })}
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
              <p className="mt-2 text-sm text-ivory/60">Scope and investment are confirmed after the initial audit.</p>
              <p className="mt-4 text-ivory/85">{activePackage.description}</p>
              {/* "Open folder" stagger reveal — each real include item
                  animates in with a short delay instead of appearing as
                  a static bulleted list, so what a visitor actually
                  receives reads as something being handed over rather
                  than a spec sheet. Same real services.ts data either
                  way, only the presentation changed. */}
              <ul className="mt-4 space-y-1.5">
                {activePackage.includes.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={prefersReducedMotion ? undefined : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: prefersReducedMotion ? 0 : 0.15 + i * 0.08 }}
                    className="text-sm text-ivory/80 before:mr-2 before:content-['•']"
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                {proof && (
                  <LinkButton href={`/work/${proof.slug}`} variant="secondary" className="border-ivory/30 text-ivory hover:bg-ivory/10">
                    See it in action: {proof.title}
                  </LinkButton>
                )}
                {/* Named after the real package chosen, not a generic
                    "Get started" repeated on every card. */}
                <LinkButton href="/contact" style={{ backgroundColor: activePackage.color }}>
                  Start with {activePackage.name}
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
