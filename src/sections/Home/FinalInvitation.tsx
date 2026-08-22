"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { LinkButton } from "@/components/Button";
import {
  SERVICES_SITUATION_EVENT,
  SERVICES_SITUATION_STORAGE_KEY,
  isServicesSituation,
  type ServicesSituationId,
} from "@/lib/servicesJourney";

type Situation = ServicesSituationId | "default";

type Invitation = {
  eyebrow: string;
  headline: string;
  body: string;
  action: string;
  trail: readonly [string, string, string];
  proofHref: string;
  proofLabel: string;
  accent: string;
};

const INVITATIONS: Record<Situation, Invitation> = {
  default: {
    eyebrow: "The next clear decision",
    headline: "Let’s find the idea your business should be remembered for.",
    body:
      "Thirty minutes to name the tension, choose the direction, and see what the brand needs next.",
    action: "Enter the strategy room",
    trail: ["Name the tension", "Choose the position", "Build the system"],
    proofHref: "/work",
    proofLabel: "Read the decisions behind the work",
    accent: "#D4B99A",
  },
  idea: {
    eyebrow: "Your diagnosis · the idea is ahead of the brand",
    headline: "Give the idea a position the market can recognise.",
    body:
      "We will name the category, audience tension, belief, and promise the first system should inherit.",
    action: "Enter the foundation room",
    trail: ["Decode founder truth", "Commit the position", "Build the first system"],
    proofHref: "/work/myshopineurope",
    proofLabel: "See a foundation take shape",
    accent: "#C77752",
  },
  reposition: {
    eyebrow: "Your diagnosis · the brand has drifted",
    headline: "Bring the scattered pieces back to one recognisable idea.",
    body:
      "We will locate the contradictions, choose the position, and decide what every touchpoint must repeat.",
    action: "Enter the repositioning room",
    trail: ["Audit contradictions", "Re-centre the story", "Rebuild recognition"],
    proofHref: "/work/herbalcart",
    proofLabel: "See perception repositioned",
    accent: "#7D8565",
  },
  ongoing: {
    eyebrow: "Your diagnosis · growth is outrunning consistency",
    headline: "Give growth a system strong enough to hold it.",
    body:
      "We will turn the strongest signals into rules for identity, content, campaigns, and recognition.",
    action: "Enter the system room",
    trail: ["Find the strongest signals", "Turn them into rules", "Compound across channels"],
    proofHref: "/work/dr-haley-nutrition",
    proofLabel: "See recognition compound",
    accent: "#D8A251",
  },
};

const NODE_POSITIONS = [
  { left: "12%", top: "12%" },
  { left: "69%", top: "28%" },
  { left: "20%", top: "72%" },
] as const;

function readSituation(): Situation {
  try {
    const savedServicesChoice = window.localStorage.getItem(SERVICES_SITUATION_STORAGE_KEY);
    if (isServicesSituation(savedServicesChoice)) return savedServicesChoice;

    const savedLegacyChoice = window.localStorage.getItem("bt-situation");
    if (savedLegacyChoice === "idea") return "idea";
    if (savedLegacyChoice === "inconsistent") return "reposition";
    if (savedLegacyChoice === "outgrown") return "ongoing";
  } catch {}
  return "default";
}

export function FinalInvitation() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [situation, setSituation] = useState<Situation>("default");
  const inView = useInView(rootRef, { amount: 0.28 });
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());

  useEffect(() => {
    if (!inView) return;
    setSituation(readSituation());
  }, [inView]);

  useEffect(() => {
    function sync() {
      setSituation(readSituation());
    }

    function onChapter(event: Event) {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      if (detail?.id === "invitation") sync();
    }

    window.addEventListener("storage", sync);
    window.addEventListener(SERVICES_SITUATION_EVENT, sync as EventListener);
    window.addEventListener("bt:situation", sync as EventListener);
    window.addEventListener("bt:home-chapter", onChapter as EventListener);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(SERVICES_SITUATION_EVENT, sync as EventListener);
      window.removeEventListener("bt:situation", sync as EventListener);
      window.removeEventListener("bt:home-chapter", onChapter as EventListener);
    };
  }, []);

  const invitation = INVITATIONS[situation];
  const motionActive = inView && !prefersReducedMotion;

  return (
    <div
      ref={rootRef}
      data-invitation-situation={situation}
      className="final-invitation relative mx-auto w-full max-w-5xl"
      style={{ "--invitation-accent": invitation.accent } as CSSProperties}
    >
        <motion.div
          className="final-invitation__card grid overflow-hidden rounded-[2rem] border border-ivory/16 bg-[#17140f]/68 text-left shadow-[0_32px_100px_rgba(0,0,0,0.3)] backdrop-blur-xl md:grid-cols-[minmax(0,1.15fr)_minmax(17rem,0.85fr)]"
          initial={
            prefersReducedMotion
              ? false
              : { opacity: 0, y: 16, filter: "blur(7px)", scale: 0.988 }
          }
          animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
          exit={
            prefersReducedMotion
              ? undefined
              : { opacity: 0, y: -8, filter: "blur(4px)", scale: 0.993 }
          }
          transition={{
            duration: prefersReducedMotion ? 0 : 0.68,
            ease: [0.22, 1, 0.36, 1],
          }}
          aria-live="polite"
        >
          <div className="final-invitation__copy relative p-6 sm:p-8 lg:p-10">
            <motion.span
              aria-hidden="true"
              className="final-invitation__glow pointer-events-none absolute -left-24 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full blur-3xl"
              style={{ background: `radial-gradient(circle, ${invitation.accent}2F, transparent 68%)` }}
              animate={
                motionActive
                  ? { x: [0, 24, 0], scale: [0.94, 1.07, 0.94], opacity: [0.42, 0.78, 0.42] }
                  : undefined
              }
              transition={
                motionActive
                  ? { duration: 8.2, repeat: Infinity, ease: "easeInOut" }
                  : undefined
              }
            />

            <div className="relative">
              <p
                className="final-invitation__eyebrow text-[0.62rem] font-medium uppercase tracking-[0.2em]"
                style={{ color: invitation.accent, textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}
              >
                {invitation.eyebrow}
              </p>
              <h2
                className="final-invitation__headline mt-4 max-w-3xl font-display text-[clamp(2rem,4vw,4rem)] font-normal leading-[1.02] text-ivory"
                style={{
                  textShadow:
                    "0 2px 14px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.9)",
                }}
              >
                {invitation.headline}
              </h2>
              <p
                className="final-invitation__body mt-5 max-w-xl text-sm leading-relaxed text-ivory/72 sm:text-base"
                style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}
              >
                {invitation.body}
              </p>

              <div
                className="final-invitation__mobile-trail mt-6 grid gap-2 md:hidden"
                aria-label="The next three strategic decisions"
              >
                {invitation.trail.map((step, index) => (
                  <div
                    key={step}
                    className="flex items-center gap-3 rounded-xl border border-ivory/12 bg-ivory/[0.035] px-3 py-2.5"
                  >
                    <span
                      className="text-[0.52rem] font-medium uppercase tracking-[0.15em]"
                      style={{ color: invitation.accent }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-xs leading-relaxed text-ivory/68">{step}</span>
                  </div>
                ))}
              </div>

              <div className="final-invitation__actions mt-7 flex flex-wrap items-center gap-4">
                <LinkButton href="/contact">{invitation.action}</LinkButton>
                <Link
                  href={invitation.proofHref}
                  className="link-underline text-sm font-medium text-ivory/62 transition-colors hover:text-sandstone"
                >
                  {invitation.proofLabel} <span aria-hidden="true">→</span>
                </Link>
              </div>

              <div
                className="final-invitation__details mt-7 flex flex-wrap gap-2"
                aria-label="First conversation details"
              >
                {["30 minutes", "honest diagnosis", "zero pitch deck"].map((detail) => (
                  <span
                    key={detail}
                    className="rounded-full border border-ivory/12 bg-ivory/[0.035] px-3 py-2 text-[0.58rem] font-medium uppercase tracking-[0.14em] text-ivory/48"
                  >
                    {detail}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="final-invitation__map relative hidden min-h-[19rem] overflow-hidden border-t border-ivory/12 bg-black/10 p-5 sm:p-7 md:block md:min-h-full md:border-l md:border-t-0">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.58rem] font-medium uppercase tracking-[0.18em] text-ivory/38">
                  Your next-move map
                </p>
                <p className="mt-1 font-display text-xl text-ivory">Three decisions, one direction.</p>
              </div>
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: invitation.accent,
                  boxShadow: `0 0 18px ${invitation.accent}99`,
                }}
              />
            </div>

            <div
              className="final-invitation__map-canvas relative mx-auto mt-4 aspect-square w-full max-w-[22rem]"
              aria-label="The next three strategic decisions"
            >
              <motion.span
                aria-hidden="true"
                className="absolute inset-[13%] rounded-full border border-dashed border-ivory/14"
                animate={motionActive ? { rotate: 360 } : undefined}
                transition={motionActive ? { duration: 26, repeat: Infinity, ease: "linear" } : undefined}
              />
              <motion.span
                aria-hidden="true"
                className="absolute inset-[25%] rounded-full border border-ivory/10"
                animate={motionActive ? { rotate: -360, scale: [0.96, 1.04, 0.96] } : undefined}
                transition={
                  motionActive
                    ? {
                        rotate: { duration: 18, repeat: Infinity, ease: "linear" },
                        scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                      }
                    : undefined
                }
              />

              <svg viewBox="0 0 320 320" className="absolute inset-0 h-full w-full" aria-hidden="true">
                {[
                  "M80 76 C150 88 202 112 236 128",
                  "M236 128 C224 190 182 224 104 244",
                  "M104 244 C90 190 76 132 80 76",
                ].map((path, index) => (
                  <g key={path}>
                    <path d={path} fill="none" stroke="rgba(244,239,230,0.09)" strokeWidth="1" />
                    <motion.path
                      d={path}
                      fill="none"
                      stroke={invitation.accent}
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      pathLength="1"
                      strokeDasharray="0.08 0.12"
                      animate={
                        motionActive
                          ? { strokeDashoffset: [0, -1], opacity: [0.25, 0.82, 0.25] }
                          : { opacity: 0.34 }
                      }
                      transition={{
                        strokeDashoffset: {
                          duration: 4.8 + index * 0.45,
                          repeat: Infinity,
                          ease: "linear",
                        },
                        opacity: {
                          duration: 4.6,
                          delay: index * 0.35,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                      }}
                    />
                  </g>
                ))}
              </svg>

              <motion.div
                className="final-invitation__core absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border bg-[#17140f]/82 text-center backdrop-blur-md"
                style={{ borderColor: `${invitation.accent}77` }}
                animate={
                  motionActive
                    ? {
                        scale: [0.96, 1.04, 0.96],
                        boxShadow: [
                          `0 0 0 ${invitation.accent}00`,
                          `0 0 34px ${invitation.accent}42`,
                          `0 0 0 ${invitation.accent}00`,
                        ],
                      }
                    : undefined
                }
                transition={motionActive ? { duration: 5.2, repeat: Infinity, ease: "easeInOut" } : undefined}
              >
                <div>
                  <span className="block text-[0.52rem] font-medium uppercase tracking-[0.16em] text-ivory/42">
                    Find the
                  </span>
                  <span className="mt-1 block font-display text-2xl" style={{ color: invitation.accent }}>
                    Tatva
                  </span>
                </div>
              </motion.div>

              {invitation.trail.map((step, index) => (
                <motion.div
                  key={step}
                  className="final-invitation__node absolute w-[7.4rem] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-ivory/12 bg-[#17140f]/78 px-3 py-2.5 text-center backdrop-blur-md"
                  style={NODE_POSITIONS[index]}
                  initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.88, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.6,
                    delay: prefersReducedMotion ? 0 : 0.16 + index * 0.14,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <span
                    className="block text-[0.5rem] font-medium uppercase tracking-[0.15em]"
                    style={{ color: invitation.accent }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-1 block text-[0.66rem] leading-snug text-ivory/72">{step}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
    </div>
  );
}
