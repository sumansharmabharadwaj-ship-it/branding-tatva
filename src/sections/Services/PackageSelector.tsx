"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/Container";
import { ElementGlyph } from "@/components/ElementGlyph";
import { PackageComparisonDeck } from "@/sections/Services/PackageComparisonDeck";
import { ProjectRoomPackage } from "@/sections/Services/ProjectRoomPackage";
import { packages } from "@/data/services";
import { projects } from "@/data/projects";
import { blendHex } from "@/lib/sectionWash";
import { track } from "@/lib/analytics";
import { usePricing } from "@/components/PricingProvider";
import { RegionSelector } from "@/components/RegionSelector";
import type { PackageSlug } from "@/data/pricing";
import {
  SERVICES_SITUATION_EVENT,
  SERVICES_SITUATION_STORAGE_KEY,
  SITUATION_TO_PACKAGE,
  isServicesSituation,
  type ServicesSituationDetail,
  type ServicesSituationId,
} from "@/lib/servicesJourney";

// The visitor chooses a real business situation rather than a tier.
// That choice opens a project workspace built from the package registry,
// localized price book, and verified project evidence. Comparison stays
// available as a separate decision mode.
const CHOICES = [
  { slug: "brand-beginning", label: "Starting with an idea", element: "earth" },
  { slug: "brand-clarity", label: "Feeling unclear or inconsistent", element: "water" },
  { slug: "brand-partnership", label: "Needing ongoing consistency", element: "space" },
] as const;

export function PackageSelector() {
  const [active, setActive] = useState<PackageSlug | null>(null);
  const [compare, setCompare] = useState(false);
  const [carriedSituation, setCarriedSituation] = useState<ServicesSituationId | null>(null);
  const prefersReducedMotion = useHydratedReducedMotion();
  const activePackage = packages.find((pkg) => pkg.slug === active);
  const proof = activePackage?.proofSlug ? projects.find((project) => project.slug === activePackage.proofSlug) : undefined;
  const { region } = usePricing();

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const };

  useEffect(() => {
    function applySituation(situation: ServicesSituationId) {
      setActive(SITUATION_TO_PACKAGE[situation]);
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

  return (
    <Container className="flex min-h-[calc(100svh-8rem)] max-w-5xl flex-col justify-start text-center lg:block lg:min-h-0">
      <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Desire</p>
      <h2 className="mt-2 text-display-sm font-display font-normal text-ivory">
        Where does your brand actually stand?
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ivory/68 sm:text-base">
        Choose the situation closest to true. The recommendation opens as a project workspace, so you can inspect the decision, route, scope, and investment before asking for a quotation.
      </p>

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
      </AnimatePresence>

      <div className="mx-auto mt-9 grid max-w-3xl gap-3 sm:grid-cols-3 sm:gap-4">
        {CHOICES.map((choice, index) => {
          const pkg = packages.find((candidate) => candidate.slug === choice.slug);
          const isActive = active === choice.slug;
          return (
            <motion.button
              key={choice.slug}
              type="button"
              aria-pressed={isActive}
              onClick={() => {
                setActive(choice.slug);
                setCompare(false);
                setCarriedSituation(null);
                track("package_viewed", { package: choice.slug, source: "situation_choice" });
              }}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 22 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -12% 0px" }}
              whileHover={prefersReducedMotion ? undefined : { y: -4 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.985, y: -1 }}
              transition={{ duration: 0.35, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="flex min-h-28 flex-col items-center justify-center gap-2.5 rounded-2xl border-t-2 px-4 py-5 text-center backdrop-blur-md transition-shadow duration-300 hover:shadow-[0_14px_36px_rgba(0,0,0,0.35)] sm:min-h-40 sm:p-6"
              style={{
                borderColor: pkg?.color,
                backgroundColor: isActive
                  ? blendHex(pkg?.color ?? "#B85A34", "#0F151C", 22)
                  : "rgba(15,21,28,0.55)",
              }}
            >
              <ElementGlyph
                slug={choice.element}
                className="h-6 w-6 sm:h-7 sm:w-7"
                style={{ color: isActive ? pkg?.color : "rgba(244,239,230,0.7)" }}
              />
              <span className="font-display text-base font-normal text-ivory sm:text-lg">{choice.label}</span>
              {pkg && <span className="hidden text-xs leading-relaxed text-ivory/70 sm:block">{pkg.forWho}</span>}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:mt-6 sm:gap-x-6 sm:gap-y-3">
        <RegionSelector />
        <button
          type="button"
          aria-label="Compare all three side by side"
          aria-pressed={compare}
          onClick={() =>
            setCompare((current) => {
              if (!current) track("packages_compared");
              return !current;
            })
          }
          className="link-underline inline-flex min-h-11 items-center rounded-full px-3 py-2.5 text-sm text-ivory/70 transition-colors duration-300 hover:bg-ivory/[0.05] hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
        >
          {compare ? "Back to one project room" : "Compare all three side by side"}
        </button>
      </div>

      <div className="relative mx-auto mt-7 min-h-[25rem] max-w-5xl text-left sm:mt-8">
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
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 170, damping: 24 }}
            >
              <ProjectRoomPackage pkg={activePackage} region={region} proof={proof} />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex min-h-[20rem] items-center justify-center rounded-[1.75rem] border border-dashed border-ivory/14 bg-ivory/[0.018] px-6 text-center"
            >
              <p className="max-w-md text-sm leading-relaxed text-ivory/62">
                Pick the one closest to true. Its project room will open here with the real scope and localized starting investment.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mx-auto mt-6 max-w-2xl text-xs leading-relaxed text-ivory/50 sm:mt-8">
        Prices are localised by market and shown in the selected currency. Final scope and quotation are confirmed
        after the discovery conversation. Taxes and third party production, media, printing, development, travel or
        licensing are listed separately where relevant.
      </p>
    </Container>
  );
}
