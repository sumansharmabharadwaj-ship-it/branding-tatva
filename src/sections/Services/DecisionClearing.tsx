"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "@/components/SmoothScrollProvider";
import { faqs } from "@/data/faqs";
import { track } from "@/lib/analytics";

// The decision clearing — a full recomposition of "Is this the right
// fit?" per the direct redesign brief. A sticky editorial panel on the
// left holds the heading, the three category selectors, and the real
// call preview; the right side runs the same real questions
// (data/faqs.ts, untouched) as three scroll chapters of large rows,
// each with an always visible preview phrase drawn from its own
// answer. Scroll moves the active category automatically via
// IntersectionObserver (rect based, no pin, Lenis untouched);
// selecting a category glides to its chapter through Lenis. One
// answer open at a time; height, opacity and blur carry the reveal;
// aria-expanded and focus states throughout; reduced motion collapses
// every animation to zero duration.
const GROUPS = [
  {
    id: "working-together",
    label: "Working together",
    questions: [
      "Can you help a brand new business?",
      "Can you help an existing brand that already has an identity?",
      "Can we work remotely?",
      "What should I prepare before we start?",
    ],
  },
  {
    id: "scope-deliverables",
    label: "Scope & deliverables",
    questions: [
      "What does branding actually include?",
      "Do you design logos?",
      "Can you actually implement, or just strategize?",
      "Do you manage ongoing content and campaigns?",
    ],
  },
  {
    id: "timeline-results",
    label: "Timeline & results",
    questions: ["How long does a project take?", "Will branding increase revenue?", "How long before I see results?"],
  },
] as const;

const CALL_STEPS = [
  "You describe where the brand stands today, in your own words.",
  "I ask direct questions about positioning, audience, and where recognition is actually falling short.",
  "You get honest feedback either way, no sales pitch.",
  "If it makes sense to continue, we agree on what the first thirty days would actually look like.",
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

function previewOf(answer: string) {
  const first = answer.split(/(?<=\.)\s/)[0];
  return first.length < 24 ? answer.split(/(?<=\.)\s/).slice(0, 2).join(" ") : first;
}

export function DecisionClearing() {
  const [activeCategory, setActiveCategory] = useState<string>(GROUPS[0].id);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const prefersReducedMotion = useHydratedReducedMotion();
  const lenis = useLenis();
  const chapterRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Scroll spy: whichever chapter crosses the middle band of the
  // viewport owns the left panel's active state.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-chapter");
            if (id) setActiveCategory(id);
          }
        }
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    Object.values(chapterRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function jumpTo(id: string) {
    setActiveCategory(id);
    const el = chapterRefs.current[id];
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -110 });
    else el.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-20">
      {/* ——— The sticky editorial panel ——— */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-ivory/70">Risk removal</p>
        <h2 className="mt-2 text-display-sm font-display font-normal text-ivory sm:text-display-md">
          Is this the right fit?
        </h2>
        <p className="mt-4 max-w-sm text-base text-ivory/90">
          Real answers to the questions that come up before a first conversation.
        </p>

        {/* Category selectors — a quiet instrument, moss illumination on
            the active chapter, a thin organic line marking progress
            through the clearing. Horizontal on mobile, vertical on
            desktop. */}
        <div
          className="mt-8 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-2.5 lg:overflow-visible lg:pb-0"
          role="tablist"
          aria-label="Question categories"
        >
          {GROUPS.map((group) => {
            const active = activeCategory === group.id;
            return (
              <button
                key={group.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => jumpTo(group.id)}
                className={`relative shrink-0 rounded-2xl px-4 py-3 text-left text-sm transition-colors duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A0A690] lg:w-full ${
                  active ? "text-ivory" : "text-ivory/60 hover:text-ivory/85"
                }`}
                style={{
                  backgroundColor: active ? "rgba(85,107,74,0.22)" : "rgba(244,239,230,0.03)",
                  backdropFilter: active ? "blur(8px)" : undefined,
                }}
              >
                {active && (
                  <motion.span
                    layoutId="clearing-line"
                    aria-hidden="true"
                    className="absolute inset-y-2 left-0 w-[2px] rounded-full bg-[#A0A690]"
                    transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.35, ease: EASE }}
                  />
                )}
                <span className="pl-2">{group.label}</span>
              </button>
            );
          })}
        </div>

        {/* The call preview, folded beneath the selectors — the real
            mechanism a visitor is deciding about, kept in view while
            the questions answer the hesitation. */}
        <div className="mt-10 hidden border-t border-ivory/10 pt-8 lg:block">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-ivory/60">What happens on the call</p>
          <ol className="mt-4 space-y-3.5">
            {CALL_STEPS.map((step, i) => (
              <li key={step} className="flex items-start gap-3">
                <span className="pt-0.5 font-display text-lg font-normal leading-none text-ivory/30" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm leading-relaxed text-ivory/80">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* ——— The chapters ——— */}
      <div className="space-y-16 lg:space-y-24">
        {GROUPS.map((group, gi) => (
          <div
            key={group.id}
            data-chapter={group.id}
            ref={(el) => {
              chapterRefs.current[group.id] = el;
            }}
            className="scroll-mt-28"
          >
            <div className="flex items-baseline gap-3">
              <span className="font-display text-sm text-ivory/40" aria-hidden="true">
                0{gi + 1}
              </span>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-ivory/70">{group.label}</p>
            </div>
            <div className="mt-4">
              {group.questions.map((question, qi) => {
                const item = faqs.find((f) => f.question === question);
                if (!item) return null;
                const isOpen = openQuestion === item.question;
                const panelId = `clearing-${group.id}-${qi}`;
                return (
                  <motion.div
                    key={item.question}
                    className="relative"
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16, filter: "blur(3px)" }}
                    whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                    transition={{ duration: 0.72, delay: qi * 0.06, ease: EASE }}
                  >
                    {/* The clearing brightens behind the open row. */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.span
                          aria-hidden="true"
                          className="pointer-events-none absolute -inset-x-4 inset-y-0 rounded-2xl sm:-inset-x-6"
                          style={{ backgroundColor: "rgba(244,239,230,0.06)", backdropFilter: "blur(6px)" }}
                          initial={prefersReducedMotion ? undefined : { opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.35, ease: EASE }}
                        />
                      )}
                    </AnimatePresence>
                    <div className="h-px bg-ivory/10" aria-hidden="true" />
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => {
                        if (!isOpen) track("faq_opened", { question: item.question });
                        setOpenQuestion(isOpen ? null : item.question);
                      }}
                      className="group relative grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-3 py-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A0A690] sm:gap-5"
                    >
                      <span className="font-display text-base text-ivory/35" aria-hidden="true">
                        {String(qi + 1).padStart(2, "0")}
                      </span>
                      <span>
                        <span className="block font-display text-xl font-normal leading-snug text-ivory transition-transform duration-500 ease-out group-hover:translate-x-1 sm:text-2xl">
                          {item.question}
                        </span>
                        {!isOpen && (
                          <span className="mt-1.5 block max-w-xl text-sm leading-relaxed text-ivory/55">
                            {previewOf(item.answer)}
                          </span>
                        )}
                      </span>
                      <motion.span
                        aria-hidden="true"
                        className="pt-1 text-xl font-light text-ivory/60 transition-colors duration-300 group-hover:text-ivory"
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.35, ease: EASE }}
                      >
                        +
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={panelId}
                          initial={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
                          transition={{ duration: prefersReducedMotion ? 0 : 0.55, ease: EASE }}
                          className="relative overflow-hidden"
                        >
                          <motion.p
                            initial={prefersReducedMotion ? undefined : { filter: "blur(5px)", y: 6 }}
                            animate={{ filter: "blur(0px)", y: 0 }}
                            transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: 0.08, ease: EASE }}
                            className="max-w-2xl pb-7 pl-[3.25rem] pr-4 text-base leading-relaxed text-ivory/90 sm:pl-[3.75rem]"
                          >
                            {item.answer}
                          </motion.p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
              <div className="h-px bg-ivory/10" aria-hidden="true" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
