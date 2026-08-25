"use client";

import Link from "next/link";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import {
  SERVICES_SITUATION_EVENT,
  SERVICES_SITUATION_STORAGE_KEY,
  SITUATION_TO_PACKAGE,
  isServicesSituation,
  type ServicesSituationDetail,
  type ServicesSituationId,
} from "@/lib/servicesJourney";

const PATHS = [
  {
    number: "01",
    situation: "idea",
    choice: "I am creating something new.",
    title: "Build the foundation",
    eyebrow: "An idea becoming a business",
    body:
      "Set the category, audience, belief, and position before identity begins, so every visible choice grows from one clear centre.",
    route: "Frame / Position / System",
    result: "A position and decision system the business can grow from.",
    href: "/services#desire",
    tint: "#ad7336",
    proof: "MyShopInEurope began with positioning around craft and origin before the platform sold a thing.",
  },
  {
    number: "02",
    situation: "reposition",
    choice: "The business has outgrown its brand.",
    title: "Reposition the system",
    eyebrow: "An established business in transition",
    body:
      "Read the signals people already recognise, keep what still carries value, and align the brand with the business it has become.",
    route: "Decode / Retain / Reframe",
    result: "A clearer meaning that moves expectations forward.",
    href: "/services#situation",
    tint: "#667d63",
    proof: "HerbalCart turned a scattered campaign into one modern, supplement-first brand position.",
  },
  {
    number: "03",
    situation: "ongoing",
    choice: "The strategy needs to hold everywhere.",
    title: "Make the system repeatable",
    eyebrow: "A brand moving across channels",
    body:
      "Translate strategy into usable rules for language, content, campaigns, websites, and teams, so every release builds the same memory.",
    route: "Codify / Apply / Compound",
    result: "One recognisable logic the whole business can repeat.",
    href: "/services#offerings",
    tint: "#bd8a3f",
    proof: "Dr. Haley Nutrition earned more response from fewer, more focused posts built around one decision system.",
  },
] as const satisfies ReadonlyArray<{
  number: string;
  situation: ServicesSituationId;
  choice: string;
  title: string;
  eyebrow: string;
  body: string;
  route: string;
  result: string;
  href: string;
  tint: string;
  proof: string;
}>;

const EASE = [0.22, 1, 0.36, 1] as const;
const SITUATION_TO_INDEX: Record<ServicesSituationId, number> = {
  idea: 0,
  reposition: 1,
  ongoing: 2,
};

function publishSituation(situation: ServicesSituationId) {
  try {
    window.localStorage.setItem(SERVICES_SITUATION_STORAGE_KEY, situation);
    const detail: ServicesSituationDetail = {
      situation,
      packageSlug: SITUATION_TO_PACKAGE[situation],
    };
    window.dispatchEvent(
      new CustomEvent<ServicesSituationDetail>(SERVICES_SITUATION_EVENT, {
        detail,
      }),
    );
  } catch {}
}

export function PathsCinematicChapter() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(sectionRef, { amount: 0.2, margin: "8% 0px -10% 0px" });
  const [activeIndex, setActiveIndex] = useState(0);
  const [carriedChoice, setCarriedChoice] = useState(false);
  const active = PATHS[activeIndex];

  useEffect(() => {
    function applySituation(value: string | null, carried: boolean) {
      if (!isServicesSituation(value)) return;
      setActiveIndex(SITUATION_TO_INDEX[value]);
      setCarriedChoice(carried);
    }

    try {
      applySituation(window.localStorage.getItem(SERVICES_SITUATION_STORAGE_KEY), true);
    } catch {}

    function onSituation(event: Event) {
      const detail = (event as CustomEvent<ServicesSituationDetail>).detail;
      applySituation(detail?.situation ?? null, true);
    }

    window.addEventListener(SERVICES_SITUATION_EVENT, onSituation as EventListener);
    return () =>
      window.removeEventListener(
        SERVICES_SITUATION_EVENT,
        onSituation as EventListener,
      );
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (prefersReducedMotion || !inView) {
      video.pause();
      return;
    }

    void video.play().catch(() => {});
  }, [inView, prefersReducedMotion]);

  function choose(index: number, persist = true) {
    setActiveIndex(index);
    setCarriedChoice(false);
    if (persist) publishSituation(PATHS[index].situation);
  }

  function onChoiceKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = (index + 1) % PATHS.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = (index + PATHS.length - 1) % PATHS.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = PATHS.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    choose(next);
    document.getElementById(`path-film-tab-${PATHS[next].number}`)?.focus();
  }

  return (
    <section
      ref={sectionRef}
      id="paths"
      data-home-chapter="paths"
      data-home-section="paths"
      data-active-path={active.situation}
      className="paths-film home-scene"
      aria-labelledby="paths-film-title"
      style={{ "--paths-film-accent": active.tint } as CSSProperties}
    >
      <div className="paths-film__media" aria-hidden="true">
        <video
          ref={videoRef}
          autoPlay={!prefersReducedMotion}
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/hero-goldendunes-poster.jpg"
          data-media-id="BT-HOME-PATHS-GOLDEN-DUNES"
        >
          <source src="/videos/hero-goldendunes.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="paths-film__veil" aria-hidden="true" />

      <div className="paths-film__frame">
        <header className="paths-film__header">
          <div className="paths-film__chapter">
            <span>05</span>
            <p>Brand Strategy &amp; Systems</p>
          </div>
          <p className="paths-film__counter" aria-live="polite">
            {active.number} / 03
          </p>
        </header>

        <div className="paths-film__story">
          <div className="paths-film__lead">
            <p className="paths-film__eyebrow">Choose your starting point</p>
            <h2 id="paths-film-title">
              There is more than one way in. <em>Choose where your brand is now.</em>
            </h2>
            <p className="paths-film__instruction">
              Select the sentence that feels closest. The right scope opens here
              and carries into Services.
            </p>

            <div className="paths-film__chooser">
              <div className="paths-film__chooser-label">
                <span>
                  {carriedChoice
                    ? "Your 30-second diagnosis is carried here"
                    : "Choose the brand situation closest to yours"}
                </span>
                <span>{active.number} selected</span>
              </div>
              <div
                className="paths-film__choices"
                role="group"
                aria-label="Choose the service starting point that matches your brand"
              >
                {PATHS.map((path, index) => {
                  const selected = index === activeIndex;
                  return (
                    <button
                      key={path.number}
                      id={`path-film-tab-${path.number}`}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => choose(index)}
                      onFocus={() => choose(index, false)}
                      onKeyDown={(event) => onChoiceKeyDown(event, index)}
                      onPointerEnter={(event) => {
                        if (event.pointerType === "mouse") choose(index, false);
                      }}
                      className={selected ? "is-active" : undefined}
                      style={{ "--path-choice-accent": path.tint } as CSSProperties}
                    >
                      <span className="paths-film__choice-number">{path.number}</span>
                      <strong>{path.choice}</strong>
                      <span className="paths-film__choice-cue">
                        {selected ? "Selected" : "Choose"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={active.number}
              id={`path-film-panel-${active.number}`}
              className="paths-film__answer"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: EASE }}
            >
              <p className="paths-film__answer-eyebrow">{active.eyebrow}</p>
              <h3>{active.title}</h3>
              <p className="paths-film__answer-body">{active.body}</p>
              <dl>
                <div>
                  <dt>The work</dt>
                  <dd>{active.route}</dd>
                </div>
                <div>
                  <dt>The outcome</dt>
                  <dd>{active.result}</dd>
                </div>
              </dl>
              <p className="paths-film__proof">{active.proof}</p>
              <Link href={active.href} onClick={() => publishSituation(active.situation)}>
                Explore this service path <span aria-hidden="true">↗</span>
              </Link>
            </motion.article>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
