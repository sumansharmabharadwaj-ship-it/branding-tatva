"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
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
  readCompletedHomeDiagnosis,
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
    label: "I have a credible offer but no settled brand.",
    reason: "We decide what the business should mean before naming, identity, website, or launch work begins.",
  },
  {
    id: "reposition",
    label: "The business has outgrown the brand people still see.",
    reason: "We keep the cues buyers already trust, remove the ones that misrepresent the business, and establish the stronger position.",
  },
  {
    id: "ongoing",
    label: "The brand changes every time the channel changes.",
    reason: "I set the verbal and visual rules, apply them to live work, and correct drift before it becomes another version of the brand.",
  },
];

const FIRST_OPTION = OPTIONS[0];
const EASE = [0.22, 1, 0.36, 1] as const;
const SCENE_PROGRESS_EVENT = "bt:services-scene-progress";
const ANCHOR_SETTLE_EVENT = "bt:services-anchor-settle";
const MANUAL_HOLD_MS = 14000;

type ServicesProgressDetail = {
  id?: string;
  progress?: number;
  storyProgress?: number;
};

function publishSituation(id: ServicesSituationId) {
  try {
    window.localStorage.setItem(SERVICES_SITUATION_STORAGE_KEY, id);
  } catch {}

  const detail: ServicesSituationDetail = {
    situation: id,
    packageSlug: SITUATION_TO_PACKAGE[id],
    origin: "services",
  };
  window.dispatchEvent(new CustomEvent<ServicesSituationDetail>(SERVICES_SITUATION_EVENT, { detail }));
}

function settlePackageChapter(event: MouseEvent<HTMLAnchorElement>) {
  // Next's hash-only Link navigation can restore the top of the route after
  // our scroll runtime has already aligned the package chapter. Keep this
  // journey within the current document, update the shareable fragment, and
  // let the shared Services runtime perform the authoritative alignment.
  event.preventDefault();
  if (window.location.hash !== "#desire") {
    window.history.pushState(window.history.state, "", "#desire");
  }
  window.dispatchEvent(new CustomEvent(ANCHOR_SETTLE_EVENT, { detail: { id: "desire" } }));
}

export function SituationPath() {
  const [selected, setSelected] = useState<ServicesSituationId | null>(null);
  const [preview, setPreview] = useState<ServicesSituationId>(FIRST_OPTION.id);
  const [carried, setCarried] = useState(false);
  const holdUntilRef = useRef(0);
  const mobileTabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const prefersReducedMotion = useHydratedReducedMotion();

  useEffect(() => {
    try {
      const storedSituation = window.localStorage.getItem(SERVICES_SITUATION_STORAGE_KEY);
      const savedServicesChoice = isServicesSituation(storedSituation)
        ? storedSituation
        : readCompletedHomeDiagnosis();
      if (savedServicesChoice) {
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
      const storyProgress = detail.storyProgress ?? detail.progress;

      const index = Math.min(
        OPTIONS.length - 1,
        Math.max(0, Math.floor(storyProgress * OPTIONS.length)),
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

  function moveMobileTab(event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) {
    let nextIndex = currentIndex;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % OPTIONS.length;
    else if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + OPTIONS.length) % OPTIONS.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = OPTIONS.length - 1;
    else return;

    event.preventDefault();
    const next = OPTIONS[nextIndex];
    if (!next) return;
    pick(next.id);
    mobileTabRefs.current[nextIndex]?.focus();
  }

  const displayed = selected ?? preview;
  const displayedOption = OPTIONS.find((option) => option.id === displayed) ?? FIRST_OPTION;
  const displayedPackage = packages.find((entry) => entry.slug === SITUATION_TO_PACKAGE[displayed]);

  return (
    <Container className="max-w-6xl">
      <div data-situation-grid="true" className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-20">
        <div data-services-chapter-copy="true" className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Your situation</p>
          <h2 className="mt-2 text-display-sm font-display font-normal text-ivory">
            Which sentence sounds like your business?
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/70">
            Choose the closest truth. Your answer changes what Suman decides first, the engagement that fits, and the evidence worth inspecting.
          </p>
          <AnimatePresence>
            {carried && (
              <motion.p
                initial={prefersReducedMotion ? undefined : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                data-situation-carried="true"
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-sandstone/40 px-3.5 py-1.5 text-xs text-sandstone"
              >
                <span aria-hidden="true">↺</span> Your earlier diagnosis is already here.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div data-situation-mobile-deck="true" className="lg:hidden">
          <div
            role="tablist"
            aria-label="Choose the situation closest to your brand"
            className="grid grid-cols-3 gap-1.5 rounded-[1.2rem] border border-ivory/14 bg-[rgba(18,28,23,0.72)] p-1.5 backdrop-blur-xl"
          >
            {OPTIONS.map((option, index) => {
              const isActive = displayed === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="tab"
                  id={`situation-tab-${option.id}`}
                  aria-selected={isActive}
                  aria-controls="situation-mobile-panel"
                  tabIndex={isActive ? 0 : -1}
                  data-situation-tab="true"
                  ref={(node) => {
                    mobileTabRefs.current[index] = node;
                  }}
                  onClick={() => pick(option.id)}
                  onKeyDown={(event) => moveMobileTab(event, index)}
                  className={`min-h-12 rounded-[0.9rem] border px-1.5 py-2 text-center transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone ${
                    isActive
                      ? "border-sandstone/45 bg-sandstone/[0.12] text-ivory"
                      : "border-transparent text-ivory/58"
                  }`}
                >
                  <span className="block text-[0.58rem] font-medium uppercase tracking-[0.12em] text-sandstone/80">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-1 block font-display text-sm font-normal leading-none">
                    {option.id === "idea" ? "Idea" : option.id === "reposition" ? "Reposition" : "Ongoing"}
                  </span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {displayedPackage ? (
              <motion.div
                id="situation-mobile-panel"
                key={displayed}
                role="tabpanel"
                aria-labelledby={`situation-tab-${displayed}`}
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.32, ease: EASE }}
                data-situation-detail="true"
                className="mt-2.5 rounded-[1.3rem] border-t-2 p-4 backdrop-blur-xl"
                style={{ borderTopColor: displayedPackage.color, backgroundColor: "rgba(18,28,23,0.76)" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p data-situation-package-name="true" className="font-display text-xl font-normal text-ivory">{displayedPackage.name}</p>
                    <p data-situation-package-for="true" className="mt-1 text-xs leading-relaxed text-ivory/66">{displayedPackage.forWho}</p>
                  </div>
                  <span className="shrink-0 font-display text-sm text-sandstone" aria-hidden="true">
                    {String(OPTIONS.findIndex((option) => option.id === displayed) + 1).padStart(2, "0")} / 03
                  </span>
                </div>
                {!selected ? (
                  <p data-situation-route-status="true" className="mt-3 text-[0.58rem] font-medium uppercase tracking-[0.15em] text-sandstone/78">
                    Route currently in view
                  </p>
                ) : null}
                <p data-situation-route-reason="true" className="mt-2.5 text-sm leading-relaxed text-ivory/88">{displayedOption.reason}</p>
                <div data-situation-route-action="true" className="mt-4">
                  <LinkButton href="#desire" onClick={settlePackageChapter} className="min-h-11 w-full justify-center">
                    See the {displayedPackage.name} path
                  </LinkButton>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div data-services-chapter-instrument="true" className="hidden lg:block">
          {OPTIONS.map((option, index) => {
            const isActive = displayed === option.id;
            const isCommitted = selected === option.id;
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
              </div>
            );
          })}
          <div className="h-px bg-ivory/12" aria-hidden="true" />
          <AnimatePresence mode="wait" initial={false}>
            {displayedPackage ? (
              <motion.div
                key={displayed}
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.36, ease: EASE }}
                data-situation-detail="true"
                className="mt-5 rounded-2xl border-t-2 p-6 backdrop-blur-md sm:p-7"
                style={{ borderTopColor: displayedPackage.color, backgroundColor: "rgba(244,239,230,0.05)" }}
              >
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <p className="font-display text-xl font-normal text-ivory">{displayedPackage.name}</p>
                  <p className="text-sm text-ivory/70">{displayedPackage.forWho}</p>
                </div>
                {!selected ? (
                  <p className="mt-3 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-sandstone/80">
                    Route currently in view
                  </p>
                ) : null}
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-ivory/90">{displayedOption.reason}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <LinkButton href="#desire" onClick={settlePackageChapter}>See the matching engagement</LinkButton>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </Container>
  );
}
