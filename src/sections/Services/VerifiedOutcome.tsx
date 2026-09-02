"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { LinkButton } from "@/components/Button";
import { AnimatedStat } from "@/components/AnimatedStat";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { track } from "@/lib/analytics";
import { projects } from "@/data/projects";
import { packages } from "@/data/services";
import {
  SERVICES_SITUATION_EVENT,
  SERVICES_SITUATION_STORAGE_KEY,
  SITUATION_TO_PACKAGE,
  SITUATION_TO_PROOF_SLUG,
  isServicesSituation,
  readCompletedHomeDiagnosis,
  type ServicesSituationDetail,
  type ServicesSituationId,
} from "@/lib/servicesJourney";

const SCENE_PROGRESS_EVENT = "bt:services-scene-progress";
const EASE = [0.22, 1, 0.36, 1] as const;
const MANUAL_HOLD_MS = 14000;

// Each route receives the closest documented project record. The large proof
// value is always taken from copy already present in that project's source
// record: a four-quarter plan, five ready-to-shoot formats, or the measured
// 104% efficiency gain. No outcome is inferred beyond the work documented.
const PROOF_ROUTES: Record<
  ServicesSituationId,
  {
    routeLabel: string;
    slug: string;
    headline: string;
    lead: { value: string; label: string; statement: string };
    resultLabel: string;
  }
> = {
  idea: {
    routeLabel: "Building a new brand",
    slug: SITUATION_TO_PROOF_SLUG.idea,
    headline: "MyShopInEurope: a brand plan before the launch spend.",
    lead: {
      value: "4",
      label: "quarters mapped from brand foundation to market position",
      statement: "The rollout mapped brand foundation, audience pull, lead quality, and market position across four quarters.",
    },
    resultLabel: "Documented delivery",
  },
  reposition: {
    routeLabel: "Repositioning an established business",
    slug: SITUATION_TO_PROOF_SLUG.reposition,
    headline: "HerbalCart: a campaign built around one category choice.",
    lead: {
      value: "5",
      label: "content formats ready to shoot after the campaign reset",
      statement: "Five content formats were ready to shoot after the campaign reset.",
    },
    resultLabel: "Documented delivery",
  },
  ongoing: {
    routeLabel: "Stopping drift across channels",
    slug: SITUATION_TO_PROOF_SLUG.ongoing,
    headline: "Dr. Haley Nutrition: eight weeks of repeated brand direction.",
    lead: {
      value: "104%",
      label: "more followers earned per post",
      statement: "The account earned 104% more followers per post.",
    },
    resultLabel: "Verified result",
  },
};

const DEFAULT_PROOF_ROUTE = PROOF_ROUTES.ongoing;

type ServicesProgressDetail = {
  id?: string;
  progress?: number;
  storyProgress?: number;
};

// Conversion architecture: proof sits directly after the packages instead of
// waiting for the Work page. Every route uses one documented project record;
// no result is inferred beyond the selected case study's source material.
//
// A natural 100svh chapter now carries three semantic beats through the same
// stable composition: the strategic decision, the behavioural shift it
// created, and the verified result. React changes only that discrete semantic
// state, never every scroll pixel.
export function VerifiedOutcome() {
  const [activeBeat, setActiveBeat] = useState(0);
  const [situation, setSituation] = useState<ServicesSituationId | null>(null);
  const manualHoldUntilRef = useRef(0);
  const prefersReducedMotion = useHydratedReducedMotion();
  const proofRoute = situation ? PROOF_ROUTES[situation] : DEFAULT_PROOF_ROUTE;
  const proof = projects.find((project) => project.slug === proofRoute.slug);
  const selectedPackageSlug = situation ? SITUATION_TO_PACKAGE[situation] : null;
  const selectedPackage = selectedPackageSlug
    ? packages.find((entry) => entry.slug === selectedPackageSlug)
    : null;

  useEffect(() => {
    function applySituation(nextSituation: ServicesSituationId | null) {
      setSituation(nextSituation);
    }

    try {
      const storedSituation = window.localStorage.getItem(SERVICES_SITUATION_STORAGE_KEY);
      applySituation(
        isServicesSituation(storedSituation)
          ? storedSituation
          : readCompletedHomeDiagnosis(),
      );
    } catch {
      applySituation(null);
    }

    function onSituation(event: Event) {
      const detail = (event as CustomEvent<ServicesSituationDetail>).detail;
      applySituation(isServicesSituation(detail?.situation) ? detail.situation : null);
    }

    window.addEventListener(SERVICES_SITUATION_EVENT, onSituation as EventListener);
    return () => window.removeEventListener(SERVICES_SITUATION_EVENT, onSituation as EventListener);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setActiveBeat(2);
      return;
    }

    function onProgress(event: Event) {
      const detail = (event as CustomEvent<ServicesProgressDetail>).detail;
      if (detail?.id !== "verified-outcome" || typeof detail.progress !== "number") return;
      if (Date.now() < manualHoldUntilRef.current) return;
      const storyProgress = detail.storyProgress ?? detail.progress;
      const next = storyProgress < 0.43 ? 0 : storyProgress < 0.7 ? 1 : 2;
      setActiveBeat((current) => (current === next ? current : next));
    }

    window.addEventListener(SCENE_PROGRESS_EVENT, onProgress as EventListener);
    return () => window.removeEventListener(SCENE_PROGRESS_EVENT, onProgress as EventListener);
  }, [prefersReducedMotion]);

  if (!proof) return null;

  const proofSlug = proof.slug;
  const lead = proofRoute.lead;
  const beats = [
    {
      label: "What the business faced",
      text: proof.challenge,
    },
    {
      label: "What was decided",
      text: proof.strategy ?? proof.hook ?? proof.reflection ?? proof.outcome,
    },
    {
      label: proofRoute.resultLabel,
      text: lead.statement,
    },
  ];

  function chooseBeat(index: number) {
    manualHoldUntilRef.current = Date.now() + MANUAL_HOLD_MS;
    setActiveBeat(index);
    track("verified_proof_beat_selected", {
      beat: index + 1,
      route: situation ?? "unselected",
      project: proofSlug,
    });
  }

  return (
    <Container className="max-w-6xl">
      <div
        data-proof-frame="true"
        data-verified-outcome-phase={activeBeat}
        data-proof-route={situation ?? "default"}
        className="relative grid gap-10 overflow-hidden rounded-[2rem] border border-ivory/12 bg-[rgba(18,26,23,0.5)] p-6 shadow-[0_32px_110px_rgba(7,12,10,0.28)] backdrop-blur-xl sm:p-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-center lg:gap-16 lg:p-10"
      >
        <div data-verified-proof-thread="true" aria-hidden="true">
          <span data-verified-proof-node="1" />
          <span data-verified-proof-node="2" />
          <span data-verified-proof-node="3" />
        </div>
        <div data-services-chapter-copy="true" data-proof-copy="true">
          <Reveal>
            <p data-proof-eyebrow="true" className="text-sm font-medium uppercase tracking-wide text-sandstone">
              {situation ? `Evidence for ${proofRoute.routeLabel}` : "Client evidence"}
            </p>
            <h2 data-proof-heading="true" className="mt-2 max-w-xl text-display-sm font-display font-normal text-ivory">
              {proofRoute.headline}
            </h2>
          </Reveal>

          <motion.div
            data-proof-stat="true"
            data-verified-proof-result="true"
            animate={
              prefersReducedMotion
                ? { opacity: 1, y: 0, scale: 1 }
                : activeBeat === 2
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0.78, y: 5, scale: 0.98 }
            }
            transition={{ duration: prefersReducedMotion ? 0 : 0.48, ease: EASE }}
            className="mt-10 origin-left"
          >
            <p data-proof-stat-value="true" className="font-display text-[clamp(4.5rem,11vw,9rem)] font-normal leading-none text-sandstone">
              <AnimatedStat value={lead.value} />
            </p>
            <p data-proof-stat-label="true" className="mt-3 max-w-sm text-base leading-relaxed text-ivory/90">{lead.label}</p>
          </motion.div>

          <div data-proof-progress="true" className="mt-8 flex items-center gap-3" aria-hidden="true">
            <span className="font-display text-xs text-sandstone">{String(activeBeat + 1).padStart(2, "0")}</span>
            <span className="relative h-px flex-1 overflow-hidden bg-ivory/12">
              <motion.span
                className="absolute inset-y-0 left-0 bg-sandstone"
                animate={{ width: `${((activeBeat + 1) / beats.length) * 100}%` }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.44, ease: EASE }}
              />
            </span>
            <span className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-ivory/45">
              / {String(beats.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div data-services-chapter-instrument="true" data-proof-instrument="true" className="relative">
          <p data-proof-instrument-label="true" className="mb-4 text-[0.6rem] font-medium uppercase tracking-[0.18em] text-ivory/70 sm:ml-14">
            The problem, the choice, and the record
          </p>
          <ol data-proof-beat-list="true" className="border-y border-ivory/12">
            {beats.map((beat, index) => {
              const active = activeBeat === index;
              const completed = index < activeBeat;
              return (
                <li
                  key={beat.label}
                  data-proof-beat="true"
                  data-active={active ? "true" : "false"}
                  data-proof-beat-state={active ? "active" : completed ? "complete" : "waiting"}
                  className="relative border-b border-ivory/10 last:border-b-0"
                >
                  <motion.button
                    data-proof-beat-button="true"
                    type="button"
                    aria-pressed={active}
                    onClick={() => chooseBeat(index)}
                    animate={
                      prefersReducedMotion
                        ? { opacity: 1, filter: "blur(0px)" }
                        : { opacity: active ? 1 : completed ? 0.9 : 0.78, filter: active ? "blur(0px)" : "blur(0.25px)" }
                    }
                    transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: EASE }}
                    className="grid w-full grid-cols-[2.5rem_1fr] gap-4 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sandstone sm:py-6"
                  >
                    <span
                      data-proof-beat-index="true"
                      className={`font-display text-sm transition-colors duration-300 ${
                        active ? "text-sandstone" : "text-ivory/55"
                      }`}
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p data-proof-beat-label="true" className={`text-xs font-medium uppercase tracking-[0.16em] ${active ? "text-sandstone" : "text-ivory/72"}`}>
                        {beat.label}
                      </p>
                      <p data-proof-beat-detail="true" className={`mt-2 max-w-xl text-sm leading-relaxed sm:text-base ${active || prefersReducedMotion ? "text-ivory/95" : "text-ivory/90"}`}>
                        {beat.text}
                      </p>
                    </div>
                  </motion.button>
                  {active && !prefersReducedMotion && (
                    <motion.span
                      data-proof-active-line="true"
                      layoutId="verified-proof-active-line"
                      aria-hidden="true"
                      className="absolute inset-y-4 left-0 w-px bg-sandstone"
                      transition={{ duration: 0.42, ease: EASE }}
                    />
                  )}
                </li>
              );
            })}
          </ol>

          <motion.div
            key={`${proof.slug}-${activeBeat}`}
            data-proof-mobile-panel="true"
            aria-live="polite"
            initial={
              prefersReducedMotion
                ? false
                : { opacity: 0.18, clipPath: "inset(0 0 74% 0 round 0.9rem)", filter: "blur(4px)" }
            }
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0 round 0rem)", filter: "blur(0px)" }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.36, ease: EASE }}
            className="hidden"
          >
            <p>{beats[activeBeat]?.text}</p>
          </motion.div>

          <Reveal delay={0.08}>
            <div data-proof-actions="true" className="mt-7 flex flex-wrap gap-3">
              <LinkButton
                href="#book"
                trackEvent="contextual_cta_clicked"
                trackProps={{
                  source: "verified_outcome",
                  route: situation ?? "unselected",
                  package: selectedPackageSlug ?? "unselected",
                }}
              >
                {selectedPackage ? `Discuss ${selectedPackage.name}` : "Book a brand diagnosis"}
              </LinkButton>
              <LinkButton
                href={`/work/${proof.slug}`}
                variant="secondary"
                className="border-ivory/30 text-ivory hover:bg-ivory/10"
              >
                Open the full project record
              </LinkButton>
            </div>
          </Reveal>
        </div>
      </div>
    </Container>
  );
}
