"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import { packages } from "@/data/services";
import { SITUATION_KEY } from "@/sections/Home/VisitorRecognition";
import {
  HOME_TO_SERVICES_SITUATION,
  SERVICES_SITUATION_EVENT,
  SERVICES_SITUATION_STORAGE_KEY,
  SITUATION_TO_PACKAGE,
  isServicesSituation,
  type ServicesSituationDetail,
  type ServicesSituationId,
} from "@/lib/servicesJourney";
import { track } from "@/lib/analytics";

// Conversion architecture, Services chapter two: the visitor places
// themselves before any package is pitched. If they already chose in the
// Home page Clarity Lab, the same condition arrives preselected, so the
// site remembers the diagnosis instead of asking the same question again.
const OPTIONS: ReadonlyArray<{
  id: ServicesSituationId;
  label: string;
  reason: string;
}> = [
  {
    id: "idea",
    label: "I am beginning with an idea",
    reason: "Positioning gets decided before anything is designed, so every later choice inherits one direction.",
  },
  {
    id: "reposition",
    label: "My existing brand needs repositioning",
    reason: "An audit finds where recognition is leaking, then one position replaces the several currently competing.",
  },
  {
    id: "ongoing",
    label: "I need ongoing consistency",
    reason: "Recognition compounds when one person keeps the system coherent as more goes out into the world.",
  },
];

const FIRST_OPTION = OPTIONS[0];
const EASE = [0.22, 1, 0.36, 1] as const;
const SCENE_PROGRESS_EVENT = "bt:services-scene-progress";
const MANUAL_HOLD_MS = 14000;

type ServicesProgressDetail = {
  id?: string;
  progress?: number;
};

function publishSituation(id: ServicesSituationId) {
  try {
    window.localStorage.setItem(SERVICES_SITUATION_STORAGE_KEY, id);
    const detail: ServicesSituationDetail = {
      situation: id,
      packageSlug: SITUATION_TO_PACKAGE[id],
    };
    window.dispatchEvent(new CustomEvent<ServicesSituationDetail>(SERVICES_SITUATION_EVENT, { detail }));
  } catch {}
}

export function SituationPath() {
  const [selected, setSelected] = useState<ServicesSituationId | null>(null);
  const [preview, setPreview] = useState<ServicesSituationId>(FIRST_OPTION.id);
  const [carried, setCarried] = useState(false);
  const holdUntilRef = useRef(0);
  const prefersReducedMotion = useHydratedReducedMotion();

  useEffect(() => {
    try {
      const savedServicesChoice = window.localStorage.getItem(SERVICES_SITUATION_STORAGE_KEY);
      if (isServicesSituation(savedServicesChoice)) {
        setSelected(savedServicesChoice);
        setPreview(savedServicesChoice);
        setCarried(true);
        publishSituation(savedServicesChoice);
        return;
      }

      const savedHomeChoice = window.localStorage.getItem(SITUATION_KEY);
      const mapped = savedHomeChoice ? HOME_TO_SERVICES_SITUATION[savedHomeChoice] : undefined;
      if (mapped) {
        setSelected(mapped);
        setPreview(mapped);
        setCarried(true);
        publishSituation(mapped);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    function onSceneProgress(event: Event) {
      const detail = (event as CustomEvent<ServicesProgressDetail>).detail;
      if (detail?.id !== "situation" || typeof detail.progress !== "number") return;
      if (selected || Date.now() < holdUntilRef.current) return;

      const index = Math.min(
        OPTIONS.length - 1,
        Math.max(0, Math.floor(detail.progress * OPTIONS.length)),
      );
      const next = OPTIONS[index]?.id ?? FIRST_OPTION.id;
      setPreview((current) => (current === next ? current : next));
    }

    window.addEventListener(SCENE_PROGRESS_EVENT, onSceneProgress as EventListener);
    return () => {
      window.removeEventListener(SCENE_PROGRESS_EVENT, onSceneProgress as EventListener);
    };
  }, [prefersReducedMotion, selected]);

  function pick(id: ServicesSituationId) {
    holdUntilRef.current = Date.now() + MANUAL_HOLD_MS;
    setPreview(id);
    setSelected((previous) => (previous === id ? previous : id));
    publishSituation(id);
    track("visitor_situation_selected", { situation: id, page: "services" });
    setCarried(false);
  }

  const displayed = selected ?? preview;

  return (
    <Container className="max-w-6xl">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Choose your situation</p>
          <h2 className="mt-2 text-display-sm font-display font-normal text-ivory">
            Three starting points. One of them is yours.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/70">
            A short scroll previews each route. Select the row that sounds like yours and the rest of the page carries that decision forward.
          </p>
          <AnimatePresence>
            {carried && (
              <motion.p
                initial={prefersReducedMotion ? undefined : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-sandstone/40 px-3.5 py-1.5 text-xs text-sandstone"
              >
                <span aria-hidden="true">↺</span> Carried forward from your earlier diagnosis.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div>
          {OPTIONS.map((option, index) => {
            const isActive = displayed === option.id;
            const isCommitted = selected === option.id;
            const pkg = packages.find((entry) => entry.slug === SITUATION_TO_PACKAGE[option.id]);
            return (
              <div key={option.id} className="relative">
                <div className="h-px bg-ivory/12" aria-hidden="true" />
                <motion.button
                  type="button"
                  aria-pressed={isCommitted}
                  data-situation-preview={isActive && !isCommitted ? "true" : undefined}
                  onClick={() => pick(option.id)}
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 14 }}
                  whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  transition={{ duration: 0.35, delay: index * 0.07, ease: EASE }}
                  className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-3 py-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone sm:gap-5 sm:py-7"
                >
                  <span
                    className={`font-display text-base transition-colors duration-300 ${isActive ? "text-sandstone" : "text-ivory/35"}`}
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`font-display text-xl font-normal leading-snug transition-all duration-500 ease-out group-hover:translate-x-1 sm:text-2xl ${
                      isActive ? "text-ivory" : "text-ivory/80 group-hover:text-ivory"
                    }`}
                  >
                    {option.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`pt-1 text-xl font-light transition-all duration-300 ${
                      isActive ? "rotate-45 text-sandstone" : "text-ivory/50 group-hover:text-ivory"
                    }`}
                  >
                    +
                  </span>
                </motion.button>
                <AnimatePresence initial={false}>
                  {isActive && pkg && (
                    <motion.div
                      initial={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.48, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div
                        className="mb-7 rounded-2xl border-t-2 p-6 backdrop-blur-md sm:p-7"
                        style={{ borderTopColor: pkg.color, backgroundColor: "rgba(244,239,230,0.05)" }}
                      >
                        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                          <p className="font-display text-xl font-normal text-ivory">{pkg.name}</p>
                          <p className="text-sm text-ivory/70">{pkg.forWho}</p>
                        </div>
                        {!isCommitted && (
                          <p className="mt-3 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-sandstone/80">
                            Previewing this route · select the row to carry it forward
                          </p>
                        )}
                        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ivory/90">{option.reason}</p>
                        <p className="mt-4 text-xs font-medium uppercase tracking-[0.15em] text-ivory/60">
                          Indicative scope
                        </p>
                        <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                          {pkg.includes.map((item) => (
                            <li key={item} className="text-sm text-ivory/85 before:mr-2 before:content-['•']">
                              {item}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-6 flex flex-wrap gap-3">
                          <LinkButton
                            href="#desire"
                            variant="secondary"
                            className="border-ivory/30 text-ivory hover:bg-ivory/10"
                          >
                            See the full package
                          </LinkButton>
                          <LinkButton href="#book">Book a Brand Strategy Session</LinkButton>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          <div className="h-px bg-ivory/12" aria-hidden="true" />
        </div>
      </div>
    </Container>
  );
}
