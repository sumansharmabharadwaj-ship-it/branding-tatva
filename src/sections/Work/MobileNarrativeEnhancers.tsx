"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useHydratedMotionPreference } from "@/hooks/useHydratedReducedMotion";
import { WORK, EASE_ORGANIC } from "@/sections/Work/palette";

type EvidenceStat = {
  value: string;
  label: string;
};

type NarrativeChapter = {
  label: string;
  title: string;
  body: string;
  stats: EvidenceStat[];
};

type CaseDeckModel = {
  host: HTMLElement;
  chapters: NarrativeChapter[];
  articles: HTMLElement[];
  originalButtons: HTMLButtonElement[];
};

type SystemDeckModel = {
  host: HTMLElement;
  imageSrc: string;
  steps: NarrativeChapter[];
  outcome: string;
  href: string;
};

type SignatureDeckModel = {
  host: HTMLElement;
  imageSrc: string;
  beats: NarrativeChapter[];
  href: string;
};

const SYSTEM_STATES = [
  {
    word: "ACCESS",
    eyebrow: "The default meaning",
    line: "A generic route to inexpensive supply.",
  },
  {
    word: "ORIGIN",
    eyebrow: "The positioning decision",
    line: "Craft and story before price.",
  },
  {
    word: "SYSTEM",
    eyebrow: "What the work built",
    line: "One foundation carried through channels and rollout.",
  },
] as const;

const SYSTEM_CARDS = [
  ["Foundation", "Belief · mission · promise · value"],
  ["Content architecture", "65% authority · 25% culture · 10% direct brand"],
  ["Rollout", "Foundation → audience pull → lead quality → market position"],
] as const;

const MOBILE_ENHANCEMENT_CSS = `
@media (max-width: 1023px) {
  [data-mobile-narrative-original-case="true"],
  [data-mobile-narrative-original-system="true"],
  [data-mobile-narrative-original-signature="true"],
  [data-mobile-narrative-original-nav="true"] {
    display: none !important;
  }

  [data-mobile-case-deck-host="true"],
  [data-mobile-system-deck-host="true"],
  [data-mobile-signature-deck-host="true"] {
    display: block;
  }
}

@media (min-width: 1024px) {
  [data-mobile-case-deck-host="true"],
  [data-mobile-system-deck-host="true"],
  [data-mobile-signature-deck-host="true"] {
    display: none !important;
  }
}
`;

function text(element: Element | null | undefined) {
  return element?.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

function directParagraphs(element: HTMLElement) {
  return Array.from(element.children).filter((child): child is HTMLParagraphElement => child.tagName === "P");
}

function extractStats(element: HTMLElement): EvidenceStat[] {
  const directDiv = Array.from(element.children).find((child) => child.tagName === "DIV");
  if (!directDiv) return [];

  return Array.from(directDiv.children)
    .map((card) => {
      const paragraphs = Array.from(card.children).filter((child) => child.tagName === "P");
      if (paragraphs.length < 2) return null;
      const value = text(paragraphs[0]);
      const label = text(paragraphs[1]);
      return value && label ? { value, label } : null;
    })
    .filter((item): item is EvidenceStat => Boolean(item));
}

function extractNarrative(element: HTMLElement): NarrativeChapter {
  const paragraphs = directParagraphs(element);
  const label = text(element.querySelector(":scope > p span:last-child")) || text(paragraphs[0]).replace(/^\d+\s*/, "");
  const title = text(element.querySelector(":scope > h2, :scope > h3"));
  const body = text(paragraphs[1] ?? paragraphs.at(-1));
  return { label, title, body, stats: extractStats(element) };
}

function restoreScrollIntoView(element: HTMLElement, original: HTMLElement["scrollIntoView"]) {
  window.requestAnimationFrame(() => {
    element.scrollIntoView = original;
  });
}

function CaseStudyDeck() {
  const [model, setModel] = useState<CaseDeckModel | null>(null);
  const [active, setActive] = useState(0);
  const { hydrated, prefersReducedMotion } = useHydratedMotionPreference();
  const animate = hydrated && !prefersReducedMotion;

  useEffect(() => {
    if (document.getElementById("mobile-case-study-chapter")) return;

    const story = document.getElementById("story");
    if (!story) return;

    const articles = Array.from(story.querySelectorAll<HTMLElement>("[data-chapter-index]"));
    const originalButtons = Array.from(
      story.querySelectorAll<HTMLButtonElement>('ol[aria-label="Case-study chapters"] button'),
    );
    const originalNarrative = articles[0]?.parentElement;
    const originalNav = story.querySelector<HTMLElement>('ol[aria-label="Case-study chapters"]');
    const visualColumn = originalNav?.parentElement;

    if (!articles.length || !originalNarrative || !originalNav || !visualColumn) return;

    const host = document.createElement("div");
    host.dataset.mobileCaseDeckHost = "true";
    originalNav.insertAdjacentElement("afterend", host);
    originalNarrative.dataset.mobileNarrativeOriginalCase = "true";
    originalNav.dataset.mobileNarrativeOriginalNav = "true";

    setModel({
      host,
      chapters: articles.map(extractNarrative),
      articles,
      originalButtons,
    });

    return () => {
      host.remove();
      delete originalNarrative.dataset.mobileNarrativeOriginalCase;
      delete originalNav.dataset.mobileNarrativeOriginalNav;
    };
  }, []);

  if (!model) return null;

  const chapter = model.chapters[active] ?? model.chapters[0];
  if (!chapter) return null;

  function choose(index: number) {
    setActive(index);

    const article = model.articles[index];
    const originalButton = model.originalButtons[index];
    if (!article || !originalButton) return;

    const originalScrollIntoView = article.scrollIntoView;
    article.scrollIntoView = () => undefined;
    originalButton.click();
    restoreScrollIntoView(article, originalScrollIntoView);
  }

  return createPortal(
    <div className="mt-5 lg:hidden" data-mobile-case-study-deck="true">
      <div className="grid grid-cols-4 gap-2" role="group" aria-label="Choose a case-study chapter">
        {model.chapters.map((item, index) => {
          const selected = active === index;
          return (
            <button
              key={`${item.label}-${index}`}
              type="button"
              aria-pressed={selected}
              aria-controls="mobile-case-study-deck-panel"
              onClick={() => choose(index)}
              className="min-h-11 rounded-xl border px-2 py-2 text-center font-display text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                borderColor: selected ? WORK.sand : "rgba(255,255,255,0.18)",
                backgroundColor: selected ? "rgba(198,169,122,0.13)" : "rgba(255,255,255,0.035)",
                color: selected ? WORK.sand : "rgba(255,255,255,0.62)",
                outlineColor: WORK.sand,
              }}
              aria-label={`${String(index + 1).padStart(2, "0")}: ${item.label}`}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.article
          id="mobile-case-study-deck-panel"
          key={`${active}-${chapter.label}`}
          role="region"
          aria-label={`${chapter.label}: ${chapter.title}`}
          initial={animate ? { opacity: 0, y: 10 } : false}
          animate={{ opacity: 1, y: 0 }}
          exit={animate ? { opacity: 0, y: -8 } : undefined}
          transition={{ duration: animate ? 0.42 : 0, ease: EASE_ORGANIC }}
          className="mt-4 rounded-[1.35rem] border border-white/12 bg-black/15 p-5"
        >
          <p className="flex items-center justify-between gap-4 text-[0.58rem] font-medium uppercase tracking-[0.17em]" style={{ color: WORK.sand }}>
            <span>{chapter.label}</span>
            <span className="font-display text-sm" aria-hidden="true">
              {String(active + 1).padStart(2, "0")} / {String(model.chapters.length).padStart(2, "0")}
            </span>
          </p>
          <h3 className="mt-3 font-display text-2xl font-normal leading-tight text-white min-[430px]:text-3xl">
            {chapter.title}
          </h3>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-white/76">{chapter.body}</p>

          {chapter.stats.length > 0 && (
            <div className="mt-5 grid grid-cols-2 gap-3">
              {chapter.stats.map((stat) => (
                <div key={`${stat.value}-${stat.label}`} className="rounded-xl border border-white/10 bg-white/[0.035] p-3.5">
                  <p className="font-display text-xl" style={{ color: WORK.sand }}>{stat.value}</p>
                  <p className="mt-1 text-[0.68rem] leading-relaxed text-white/58">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </motion.article>
      </AnimatePresence>
    </div>,
    model.host,
  );
}

function SignatureDeck() {
  const [model, setModel] = useState<SignatureDeckModel | null>(null);
  const [active, setActive] = useState(0);
  const { hydrated, prefersReducedMotion } = useHydratedMotionPreference();
  const animate = hydrated && !prefersReducedMotion;

  useEffect(() => {
    if (document.getElementById("mobile-signature-beat")) return;

    const firstBeat = document.querySelector<HTMLElement>("[data-beat]");
    const section = firstBeat?.closest("section");
    const beatElements = section ? Array.from(section.querySelectorAll<HTMLElement>("[data-beat]")) : [];
    const narrativeColumn = firstBeat?.parentElement;
    const grid = narrativeColumn?.parentElement;
    const container = grid?.parentElement;

    if (!section || !beatElements.length || !grid || !container) return;

    const host = document.createElement("div");
    host.dataset.mobileSignatureDeckHost = "true";
    container.insertBefore(host, grid);
    grid.dataset.mobileNarrativeOriginalSignature = "true";

    setModel({
      host,
      imageSrc: section.querySelector<HTMLImageElement>("img")?.getAttribute("src") ?? "",
      beats: beatElements.map(extractNarrative),
      href: section.querySelector<HTMLAnchorElement>('a[href^="/work/"]')?.getAttribute("href") ?? "/work",
    });

    return () => {
      host.remove();
      delete grid.dataset.mobileNarrativeOriginalSignature;
    };
  }, []);

  if (!model) return null;
  const beat = model.beats[active] ?? model.beats[0];
  if (!beat) return null;

  return createPortal(
    <div className="mt-8 lg:hidden" data-mobile-signature-deck="true">
      <div className="overflow-hidden rounded-[1.35rem] border" style={{ borderColor: "rgba(143,174,131,0.28)" }}>
        {model.imageSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={model.imageSrc}
            alt="Performance evidence diagram"
            className="block aspect-[4/3] w-full object-cover transition-[filter] duration-500"
            style={{ filter: `grayscale(${Math.max(0, 0.78 * (1 - active / Math.max(1, model.beats.length - 1))).toFixed(2)})` }}
          />
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2" role="group" aria-label="Choose a performance case-study beat">
        {model.beats.map((item, index) => {
          const selected = active === index;
          return (
            <button
              key={`${item.label}-${index}`}
              type="button"
              aria-pressed={selected}
              aria-controls="mobile-signature-beat"
              onClick={() => setActive(index)}
              className="min-h-11 rounded-xl border px-2 py-2 font-display text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                borderColor: selected ? WORK.sage : "rgba(143,174,131,0.24)",
                backgroundColor: selected ? "rgba(143,174,131,0.12)" : "transparent",
                color: selected ? WORK.sage : "rgba(242,240,232,0.58)",
                outlineColor: WORK.sage,
              }}
              aria-label={`${String(index + 1).padStart(2, "0")}: ${item.label}`}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.article
          id="mobile-signature-beat"
          key={`${active}-${beat.label}`}
          role="region"
          aria-label={beat.label}
          initial={animate ? { opacity: 0, y: 10 } : false}
          animate={{ opacity: 1, y: 0 }}
          exit={animate ? { opacity: 0, y: -8 } : undefined}
          transition={{ duration: animate ? 0.42 : 0, ease: EASE_ORGANIC }}
          className="mt-4 rounded-[1.35rem] border p-5"
          style={{ borderColor: "rgba(143,174,131,0.28)", backgroundColor: "rgba(255,255,255,0.035)" }}
        >
          <p className="flex items-center justify-between gap-4 text-[0.58rem] font-medium uppercase tracking-[0.17em]" style={{ color: WORK.sage }}>
            <span>{beat.label}</span>
            <span className="font-display text-sm" aria-hidden="true">
              {String(active + 1).padStart(2, "0")} / {String(model.beats.length).padStart(2, "0")}
            </span>
          </p>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-white/80">{beat.body}</p>

          {beat.stats.length > 0 && (
            <div className="mt-5 grid grid-cols-2 gap-3">
              {beat.stats.map((stat) => (
                <div key={`${stat.value}-${stat.label}`} className="rounded-xl border border-white/10 p-3.5">
                  <p className="font-display text-xl" style={{ color: WORK.sand }}>{stat.value}</p>
                  <p className="mt-1 text-[0.68rem] leading-relaxed text-white/58">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </motion.article>
      </AnimatePresence>

      <a
        href={model.href}
        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium text-white"
        style={{ backgroundColor: WORK.moss }}
      >
        Read the full case study <span aria-hidden="true" className="ml-2">→</span>
      </a>
    </div>,
    model.host,
  );
}

function SystemDeck() {
  const [model, setModel] = useState<SystemDeckModel | null>(null);
  const [active, setActive] = useState(0);
  const { hydrated, prefersReducedMotion } = useHydratedMotionPreference();
  const animate = hydrated && !prefersReducedMotion;

  useEffect(() => {
    if (document.getElementById("mobile-system-step")) return;

    const firstStep = document.querySelector<HTMLElement>("[data-system-step]");
    const section = firstStep?.closest("section");
    const stepElements = section ? Array.from(section.querySelectorAll<HTMLElement>("[data-system-step]")) : [];
    const narrativeColumn = firstStep?.parentElement;
    const grid = narrativeColumn?.parentElement;
    const container = grid?.parentElement;

    if (!section || !stepElements.length || !narrativeColumn || !grid || !container) return;

    const outcomeContainer = narrativeColumn.lastElementChild as HTMLElement | null;
    const outcomeParagraphs = outcomeContainer ? directParagraphs(outcomeContainer) : [];
    const host = document.createElement("div");
    host.dataset.mobileSystemDeckHost = "true";
    container.insertBefore(host, grid);
    grid.dataset.mobileNarrativeOriginalSystem = "true";

    setModel({
      host,
      imageSrc: section.querySelector<HTMLImageElement>("img")?.getAttribute("src") ?? "",
      steps: stepElements.map(extractNarrative),
      outcome: text(outcomeParagraphs[1] ?? outcomeParagraphs.at(-1)),
      href: outcomeContainer?.querySelector<HTMLAnchorElement>('a[href^="/work/"]')?.getAttribute("href") ?? "/work",
    });

    return () => {
      host.remove();
      delete grid.dataset.mobileNarrativeOriginalSystem;
    };
  }, []);

  if (!model) return null;
  const step = model.steps[active] ?? model.steps[0];
  const visual = SYSTEM_STATES[active] ?? SYSTEM_STATES[0];
  if (!step) return null;

  return createPortal(
    <div className="mt-8 lg:hidden" data-mobile-system-deck="true">
      <div className="relative overflow-hidden rounded-[1.45rem] border" style={{ borderColor: "rgba(198,169,122,0.28)", backgroundColor: "#172027" }}>
        {model.imageSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={model.imageSrc} alt="Brand-system evidence diagram" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        )}
        <div aria-hidden="true" className="absolute inset-0" style={{ background: "linear-gradient(145deg, rgba(16,21,26,0.26), rgba(16,21,26,0.95) 76%)" }} />

        <div className="relative p-5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={visual.word}
              initial={animate ? { opacity: 0, y: 8 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={animate ? { opacity: 0, y: -6 } : undefined}
              transition={{ duration: animate ? 0.4 : 0, ease: EASE_ORGANIC }}
            >
              <p className="text-[0.58rem] font-medium uppercase tracking-[0.17em]" style={{ color: WORK.sand }}>{visual.eyebrow}</p>
              <p className="mt-1 font-display text-[2.85rem] leading-none tracking-[-0.04em] text-white">{visual.word}</p>
              <p className="mt-2 text-[0.82rem] leading-relaxed text-white/68">{visual.line}</p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 grid gap-2.5">
            {SYSTEM_CARDS.map(([label, detail], index) => (
              <div
                key={label}
                className="rounded-xl border p-3.5 transition-colors duration-300"
                style={{
                  borderColor: active >= index ? "rgba(198,169,122,0.42)" : "rgba(255,255,255,0.12)",
                  backgroundColor: active >= index ? "rgba(31,58,40,0.82)" : "rgba(8,13,16,0.48)",
                }}
              >
                <p className="text-[0.54rem] font-medium uppercase tracking-[0.14em]" style={{ color: WORK.sand }}>
                  {String(index + 1).padStart(2, "0")} · {label}
                </p>
                <p className="mt-1 text-[0.74rem] leading-relaxed text-white/72">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2" role="group" aria-label="Choose a system-building case-study stage">
        {model.steps.map((item, index) => {
          const selected = active === index;
          return (
            <button
              key={`${item.label}-${index}`}
              type="button"
              aria-pressed={selected}
              aria-controls="mobile-system-deck-panel"
              onClick={() => setActive(index)}
              className="min-h-11 rounded-xl border px-2 py-2 font-display text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                borderColor: selected ? WORK.sand : "rgba(198,169,122,0.22)",
                backgroundColor: selected ? "rgba(198,169,122,0.12)" : "transparent",
                color: selected ? WORK.sand : "rgba(242,240,232,0.58)",
                outlineColor: WORK.sand,
              }}
              aria-label={`${String(index + 1).padStart(2, "0")}: ${item.label}`}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.article
          id="mobile-system-deck-panel"
          key={`${active}-${step.label}`}
          role="region"
          aria-label={`${step.label}: ${step.title}`}
          initial={animate ? { opacity: 0, y: 10 } : false}
          animate={{ opacity: 1, y: 0 }}
          exit={animate ? { opacity: 0, y: -8 } : undefined}
          transition={{ duration: animate ? 0.42 : 0, ease: EASE_ORGANIC }}
          className="mt-4 rounded-[1.35rem] border p-5"
          style={{ borderColor: "rgba(198,169,122,0.3)", backgroundColor: "rgba(23,32,39,0.92)" }}
        >
          <p className="flex items-center justify-between gap-4 text-[0.58rem] font-medium uppercase tracking-[0.17em]" style={{ color: WORK.sand }}>
            <span>{step.label}</span>
            <span className="font-display text-sm" aria-hidden="true">{String(active + 1).padStart(2, "0")} / 03</span>
          </p>
          <h3 className="mt-3 font-display text-2xl font-normal leading-tight text-white min-[430px]:text-3xl">{step.title}</h3>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-white/76">{step.body}</p>
        </motion.article>
      </AnimatePresence>

      <div className="mt-4 rounded-[1.35rem] border p-5" style={{ borderColor: "rgba(198,169,122,0.3)", backgroundColor: "rgba(198,169,122,0.08)" }}>
        <p className="text-[0.58rem] font-medium uppercase tracking-[0.17em]" style={{ color: WORK.sand }}>Outcome on record</p>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-white/82">{model.outcome}</p>
        <a href={model.href} className="mt-5 inline-flex min-h-11 items-center text-sm font-medium" style={{ color: WORK.sand }}>
          Read the full case study <span aria-hidden="true" className="ml-2">→</span>
        </a>
      </div>
    </div>,
    model.host,
  );
}

export function WorkMobileNarrativeEnhancers() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MOBILE_ENHANCEMENT_CSS }} />
      <SignatureDeck />
      <SystemDeck />
    </>
  );
}

export function CaseStudyMobileNarrativeEnhancer() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MOBILE_ENHANCEMENT_CSS }} />
      <CaseStudyDeck />
    </>
  );
}
