"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import { ElementGlyph } from "@/components/ElementGlyph";
import { PackageComparisonDeck } from "@/sections/Services/PackageComparisonDeck";
import { packages } from "@/data/services";
import { projects } from "@/data/projects";
import { blendHex } from "@/lib/sectionWash";
import { track } from "@/lib/analytics";
import { usePricing } from "@/components/PricingProvider";
import { RegionSelector } from "@/components/RegionSelector";
import { formatPrice, type PackageSlug } from "@/data/pricing";
import {
  SERVICES_SITUATION_EVENT,
  SERVICES_SITUATION_STORAGE_KEY,
  SITUATION_TO_PACKAGE,
  isServicesSituation,
  type ServicesSituationDetail,
  type ServicesSituationId,
} from "@/lib/servicesJourney";

// Three choices map to the three real packages. Scroll may demonstrate the
// paths, but only a carried diagnosis or explicit click is treated as a real
// recommendation. Passive preview never writes preference or analytics.
const CHOICES = [
  { slug: "brand-beginning", label: "Starting with an idea", element: "earth" },
  { slug: "brand-clarity", label: "Feeling unclear or inconsistent", element: "water" },
  { slug: "brand-partnership", label: "Needing ongoing consistency", element: "space" },
] as const;

const SCENE_PROGRESS_EVENT = "bt:services-scene-progress";
const MANUAL_HOLD_MS = 16000;

type SelectionSource = "situation" | "manual" | "scroll" | null;
type ServicesProgressDetail = {
  id?: string;
  progress?: number;
};

export function PackageSelector() {
  const [active, setActive] = useState<PackageSlug | null>(null);
  const [selectionSource, setSelectionSource] = useState<SelectionSource>(null);
  const [compare, setCompare] = useState(false);
  const [carriedSituation, setCarriedSituation] = useState<ServicesSituationId | null>(null);
  const manualUntilRef = useRef(0);
  const prefersReducedMotion = useHydratedReducedMotion();
  const activePackage = packages.find((pkg) => pkg.slug === active);
  const proof = activePackage?.proofSlug
    ? projects.find((project) => project.slug === activePackage.proofSlug)
    : undefined;
  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const };
  const { region } = usePricing();

  useEffect(() => {
    function applySituation(situation: ServicesSituationId) {
      setActive(SITUATION_TO_PACKAGE[situation]);
      setSelectionSource("situation");
      setCompare(false);
      setCarriedSituation(situation);
    }

    try {
      const saved = window.localStorage.getItem(SERVICES_SITUATION_STORAGE_KEY);
      if (isServicesSituation(saved)) applySituation(saved);
    } catch {}

    function onSituation(event: Event) {
      const detail = (event as CustomEvent<ServicesSituationDetail>).detail;
      if (!detail || !isServicesSituation(detail.situation)) return;
      applySituation(detail.situation);
    }

    window.addEventListener(SERVICES_SITUATION_EVENT, onSituation);
    return () => window.removeEventListener(SERVICES_SITUATION_EVENT, onSituation);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    function onSceneProgress(event: Event) {
      const detail = (event as CustomEvent<ServicesProgressDetail>).detail;
      if (detail?.id !== "desire" || typeof detail.progress !== "number") return;
      if (compare || selectionSource === "situation" || selectionSource === "manual") return;
      if (Date.now() < manualUntilRef.current) return;

      const index = Math.min(
        CHOICES.length - 1,
        Math.max(0, Math.floor(detail.progress * CHOICES.length)),
      );
      const choice = CHOICES[index] ?? CHOICES[0];
      setActive((current) => (current === choice.slug ? current : choice.slug));
      setSelectionSource("scroll");
      setCarriedSituation(null);
    }

    window.addEventListener(SCENE_PROGRESS_EVENT, onSceneProgress as EventListener);
    return () => {
      window.removeEventListener(SCENE_PROGRESS_EVENT, onSceneProgress as EventListener);
    };
  }, [compare, prefersReducedMotion, selectionSource]);

  function choosePackage(slug: PackageSlug) {
    manualUntilRef.current = Date.now() + MANUAL_HOLD_MS;
    setActive(slug);
    setSelectionSource("manual");
    setCarriedSituation(null);
    setCompare(false);
    track("package_viewed", { package: slug });
  }

  return (
    <Container data-package-selector="true" className="max-w-3xl text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Desire</p>
      <h2 className="mt-2 text-display-sm font-display font-normal text-ivory">
        Where does your brand actually stand?
      </h2>

      <AnimatePresence initial={false}>
        {carriedSituation && activePackage && !compare && (
          <motion.p
            data-carried-package="true"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={transition}
            className="mx-auto mt-5 max-w-xl rounded-full border border-sandstone/35 bg-[rgba(15,21,28,0.48)] px-4 py-2 text-sm text-ivory/80 backdrop-blur-md"
          >
            Your earlier choice points to <span className="font-medium text-sandstone">{activePackage.name}</span>. You
            can still choose a different path below.
          </motion.p>
        )}
        {selectionSource === "scroll" && activePackage && !compare && (
          <motion.p
            key="scroll-package-preview"
            data-scroll-package-preview="true"
            initial={{ opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={transition}
            className="mx-auto mt-5 max-w-xl text-xs font-medium uppercase tracking-[0.15em] text-sandstone/80"
          >
            Previewing the package paths · select a card to hold your choice
          </motion.p>
        )}
      </AnimatePresence>

      <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
        {CHOICES.map((choice, choiceIndex) => {
          const pkg = packages.find((entry) => entry.slug === choice.slug);
          const isActive = active === choice.slug;
          return (
            <motion.button
              key={choice.slug}
              type="button"
              aria-pressed={isActive && selectionSource !== "scroll"}
              data-package-preview={isActive && selectionSource === "scroll" ? "true" : undefined}
              onClick={() => choosePackage(choice.slug)}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 22 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -12% 0px" }}
              whileHover={prefersReducedMotion ? undefined : { y: -5 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.98, y: -1 }}
              transition={{ duration: 0.35, delay: choiceIndex * 0.09, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-3 rounded-2xl border-t-2 p-6 text-center backdrop-blur-md transition-shadow duration-300 hover:shadow-[0_14px_36px_rgba(0,0,0,0.35)]"
              style={{
                borderColor: pkg?.color,
                backgroundColor: isActive
                  ? blendHex(pkg?.color ?? "#B85A34", "#0F151C", 22)
                  : "rgba(15,21,28,0.55)",
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

      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        <RegionSelector />
        <button
          type="button"
          aria-label="Compare all three side by side"
          aria-pressed={compare}
          onClick={() => {
            manualUntilRef.current = Date.now() + MANUAL_HOLD_MS;
            setCompare((current) => {
              if (!current) track("packages_compared");
              return !current;
            });
          }}
          className="link-underline inline-flex min-h-11 items-center rounded-full px-3 py-2.5 text-sm text-ivory/70 transition-colors duration-300 hover:bg-ivory/[0.05] hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
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
            >
              <PackageComparisonDeck region={region} />
            </motion.div>
          ) : activePackage ? (
            <motion.div
              key={activePackage.slug}
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 170, damping: 24 }}
              className="rounded-2xl border-t-2 p-6 backdrop-blur-md sm:p-8"
              style={{ borderColor: activePackage.color, backgroundColor: blendHex(activePackage.color, "#0F151C", 14) }}
            >
              <p className="font-display text-xl font-normal text-ivory">{activePackage.name}</p>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-sm text-ivory/70">
                  {activePackage.billing === "monthly" ? "from" : "Projects begin at"}
                </span>
                <span className="font-display text-2xl font-normal text-ivory">
                  {formatPrice(region, activePackage.slug as PackageSlug)}
                </span>
                {activePackage.billing === "monthly" && <span className="text-sm text-ivory/70">/mo</span>}
              </div>
              <p className="mt-1 text-xs text-ivory/60">Final quotation follows the discovery call.</p>
              <p className="mt-4 text-ivory/90">{activePackage.description}</p>
              <ul data-package-inclusions="true" className="mt-4 space-y-1.5">
                {activePackage.includes.map((item, index) => (
                  <motion.li
                    key={item}
                    initial={prefersReducedMotion ? undefined : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: prefersReducedMotion ? 0 : 0.15 + index * 0.08 }}
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
                <LinkButton href="/contact" style={{ backgroundColor: activePackage.color }}>
                  Start with {activePackage.name}
                </LinkButton>
              </div>
            </motion.div>
          ) : (
            <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-sm text-ivory/70">
              Scroll through the three package paths, or select the one closest to true.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <p data-package-disclaimer="true" className="mx-auto mt-8 max-w-lg text-xs leading-relaxed text-ivory/55">
        Final scope, taxes and third-party costs are confirmed after discovery.
      </p>
    </Container>
  );
}
