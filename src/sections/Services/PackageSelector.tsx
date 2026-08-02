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

export function PackageSelector() {
  const [active, setActive] = useState<string | null>(null);
  // Continuity pass: a real side by side view of all three packages —
  // same data/services.ts rows, so a visitor deciding between two
  // paths can weigh them without clicking back and forth.
  const [compare, setCompare] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const activePackage = packages.find((p) => p.slug === active);
  const proof = activePackage?.proofSlug ? projects.find((p) => p.slug === activePackage.proofSlug) : undefined;

  const transition = prefersReducedMotion ? { duration: 0 } : { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <Container className="max-w-3xl text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Desire</p>
      <h2 className="mt-2 text-display-sm font-display font-normal text-ivory">
        Where does your brand actually stand?
      </h2>
      {/* Was a flat, always-transparent bordered row (color only
          appeared once a choice was already active) and a one-line
          label with no real substance behind it. Each card now carries
          its own package color as a quiet top accent from the start —
          three real options presented as considered, not a plain
          button row — and a second line pulled straight from that
          package's own real `forWho` field, not new copy. */}
      <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
        {/* Phase 2 motion direction — "touching the surface": the three
            choices rise from below in sequence (scroll), lift with real
            depth on hover, and press down under the pointer on tap —
            the one section where interaction should feel physical. */}
        {CHOICES.map((choice, ci) => {
          const pkg = packages.find((p) => p.slug === choice.slug);
          const isActive = active === choice.slug;
          return (
            <motion.button
              key={choice.slug}
              type="button"
              onClick={() => setActive(choice.slug)}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 22 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -12% 0px" }}
              whileHover={prefersReducedMotion ? undefined : { y: -5 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.98, y: -1 }}
              transition={{ duration: 0.45, delay: ci * 0.09, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-3 rounded-lg border-t-2 p-6 text-center backdrop-blur-md transition-shadow duration-300 hover:shadow-[0_14px_36px_rgba(0,0,0,0.35)]"
              style={{
                borderColor: pkg?.color,
                // Glass over deep water (Phase 1 reading surface) — the
                // cards previously sat near-transparent on the shimmer,
                // so their descriptions dissolved into the highlights.
                backgroundColor: isActive ? blendHex(pkg?.color ?? "#B85A34", "#0F151C", 22) : "rgba(15,21,28,0.55)",
              }}
            >
              <ElementGlyph
                slug={choice.element}
                className="h-7 w-7"
                style={{ color: isActive ? pkg?.color : "rgba(244,239,230,0.7)" }}
              />
              <span className="font-display text-lg font-normal text-ivory">{choice.label}</span>
              {pkg && <span className="text-xs leading-relaxed text-ivory/75">{pkg.forWho}</span>}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-6">
        <button
          type="button"
          aria-pressed={compare}
          onClick={() => setCompare((c) => !c)}
          className="link-underline text-sm text-ivory/70 transition-colors duration-300 hover:text-ivory"
        >
          {compare ? "Back to one recommendation" : "Compare all three side by side"}
        </button>
      </div>

      <div className="relative mt-8 min-h-[240px] text-left">
        <AnimatePresence mode="wait">
          {compare ? (
            <motion.div
              key="compare"
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={transition}
              className="grid gap-4 lg:grid-cols-3"
            >
              {packages.map((pkg) => (
                <div
                  key={pkg.slug}
                  className="flex flex-col rounded-lg border-t-2 p-6 backdrop-blur-md"
                  style={{ borderColor: pkg.color, backgroundColor: blendHex(pkg.color, "#0F151C", 12) }}
                >
                  <p className="font-display text-lg font-normal text-ivory">{pkg.name}</p>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    {pkg.billing === "monthly" && <span className="text-xs text-ivory/70">from</span>}
                    <span className="font-display text-xl font-normal text-ivory">
                      £{pkg.price.toLocaleString("en-GB")}
                    </span>
                    {pkg.billing === "monthly" && <span className="text-xs text-ivory/70">/mo</span>}
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-ivory/75">{pkg.forWho}</p>
                  <ul className="mt-4 flex-1 space-y-1.5 border-t border-ivory/10 pt-4">
                    {pkg.includes.map((item) => (
                      <li key={item} className="text-xs leading-relaxed text-ivory/85 before:mr-2 before:content-['•']">
                        {item}
                      </li>
                    ))}
                  </ul>
                  <LinkButton
                    href="/contact"
                    className="mt-5 self-start"
                    style={{ backgroundColor: pkg.color }}
                  >
                    Start with {pkg.name}
                  </LinkButton>
                </div>
              ))}
            </motion.div>
          ) : activePackage ? (
            <motion.div
              key={activePackage.slug}
              // "Surfacing" — the recommendation rises from beneath the
              // water with a soft settle, discovered rather than shown.
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 170, damping: 24 }}
              className="rounded-lg border-t-2 p-6 backdrop-blur-md sm:p-8"
              style={{ borderColor: activePackage.color, backgroundColor: blendHex(activePackage.color, "#0F151C", 14) }}
            >
              <p className="font-display text-xl font-normal text-ivory">{activePackage.name}</p>
              <div className="mt-2 flex items-baseline gap-1.5">
                {activePackage.billing === "monthly" && <span className="text-sm text-ivory/70">from</span>}
                <span className="font-display text-2xl font-normal text-ivory">
                  £{activePackage.price.toLocaleString("en-GB")}
                </span>
                {activePackage.billing === "monthly" && <span className="text-sm text-ivory/70">/mo</span>}
              </div>
              <p className="mt-4 text-ivory/90">{activePackage.description}</p>
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
                    className="text-sm text-ivory/90 before:mr-2 before:content-['•']"
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
            <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-sm text-ivory/70">
              Pick the one closest to true. The right package appears below.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </Container>
  );
}
