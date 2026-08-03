"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { faqs } from "@/data/faqs";
import { answerVariants, answerTransition, TOGGLE_ROTATION } from "@/sections/FAQ/animations";

// Direct feedback that a flat 11-question accordion read as boring next
// to the rest of the page. Groups the same real questions from
// data/faqs.ts into three real categories by what they're actually
// about — a static mapping here, not a change to faqs.ts itself, so
// the shared <FAQ /> component (still used unmodified on Home) is
// unaffected. Every question and answer is identical to the flat
// version; only the grouping and accordion chrome are new.
const GROUPS = [
  {
    label: "Working together",
    questions: [
      "Can you help a brand new business?",
      "Can you help an existing brand that already has an identity?",
      "Can we work remotely?",
      "What should I prepare before we start?",
    ],
  },
  {
    label: "Scope & deliverables",
    questions: [
      "What does branding actually include?",
      "Do you design logos?",
      "Can you actually implement, or just strategize?",
      "Do you manage ongoing content and campaigns?",
    ],
  },
  {
    label: "Timeline & results",
    questions: ["How long does a project take?", "Will branding increase revenue?", "How long before I see results?"],
  },
] as const;

// `dark` mirrors the same prop ProcessSection already exposes — this
// section moved from the light bg-background-alt tier to the same
// bg-soil/video treatment as every other Services section (direct
// feedback that the one remaining light stretch still read as blank),
// so every hardcoded light-only color needs a dark-bg equivalent.
export function RiskRemovalFAQ({ dark = false }: { dark?: boolean }) {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Guided-discovery pacing (direct creative direction: "a conversation
  // unfolding, chapters not paragraphs"): each group carries its own
  // rhythm — the first arrives slow and quiet, the second brisker, the
  // third with a longer anticipatory rise — so the descent through the
  // section reads as pacing choices, never one repeated entrance. All
  // rect/viewport-driven (whileInView), content always present in the
  // DOM: the reveal choreography can stall at worst into fully-visible
  // static content, never a blank frame (the documented failure mode of
  // the abandoned sticky-scrub approach).
  const PACE = [
    { dur: 0.9, stagger: 0.13, rise: 14 },
    { dur: 0.6, stagger: 0.07, rise: 22 },
    { dur: 0.75, stagger: 0.1, rise: 18 },
  ] as const;

  return <Trail dark={dark} openQuestion={openQuestion} setOpenQuestion={setOpenQuestion} prefersReducedMotion={prefersReducedMotion} PACE={PACE} />;
}

// The journey layout (built to the approved reference board): question
// stations sit alternately left and right of a winding trail that draws
// itself with scroll — a golden-sage path through the meadow, glowing
// nodes igniting as each station is reached. The trail IS the progress
// tracker; nothing is a list. Stations carry their own glass so the
// meadow stays luminous everywhere text is absent (readability system).
// All rect/scroll-driven — content always present, worst case fully
// visible and static.
const TRAIL_D = "M50 0 C 18 130, 82 230, 50 360 C 20 480, 80 600, 50 720 C 24 830, 74 920, 50 1000";

function Trail({
  dark,
  openQuestion,
  setOpenQuestion,
  prefersReducedMotion,
  PACE,
}: {
  dark: boolean;
  openQuestion: string | null;
  setOpenQuestion: (q: string | null) => void;
  prefersReducedMotion: boolean | null;
  PACE: readonly { dur: number; stagger: number; rise: number }[];
}) {
  const trailRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trailRef, offset: ["start 0.75", "end 0.5"] });
  const drawnRaw = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const drawn = useSpring(drawnRaw, { stiffness: 55, damping: 20 });

  return (
    <div ref={trailRef} className="relative pt-16 lg:pt-20">
      {/* The trailhead flower (direct request): the journey grows out of
          a bloom at the section's start — five gold petals unfurling on
          arrival, the drawn path emerging from beneath them. */}
      <motion.svg
        aria-hidden="true"
        viewBox="0 0 48 48"
        className="pointer-events-none absolute left-1/2 top-0 hidden h-12 w-12 -translate-x-1/2 lg:block"
        initial={prefersReducedMotion ? undefined : { opacity: 0, rotate: -18 }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1, rotate: 0 }}
        viewport={{ once: true, margin: "0px 0px -8% 0px" }}
        transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
      >
        {[0, 72, 144, 216, 288].map((deg, pi) => (
          <g key={deg} transform={`rotate(${deg} 24 24)`}>
            <motion.ellipse
              cx="24"
              cy="13"
              rx="4.4"
              ry="9"
              fill="rgba(228,217,180,0.85)"
              style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
              initial={prefersReducedMotion ? undefined : { scale: 0 }}
              whileInView={prefersReducedMotion ? undefined : { scale: 1 }}
              viewport={{ once: true, margin: "0px 0px -8% 0px" }}
              transition={{ duration: 0.7, delay: 0.2 + pi * 0.1, ease: [0.22, 1, 0.36, 1] }}
            />
          </g>
        ))}
        <circle cx="24" cy="24" r="3.4" fill="#E4D9B4" />
      </motion.svg>
      {/* The trail — a faint track the full journey ahead, and the lit
          path the visitor has earned so far, drawn by scroll. Doubled
          stroke (soft golden glow beneath a bright draw line) per the
          direct note that the path read too faint over the meadow.
          Desktop only; on mobile stations stack and the trail steps
          aside. */}
      <svg
        className="pointer-events-none absolute bottom-0 left-1/2 top-10 hidden w-32 -translate-x-1/2 lg:block"
        viewBox="0 0 100 1000"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d={TRAIL_D} stroke="rgba(228,217,180,0.28)" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
        <motion.path
          d={TRAIL_D}
          stroke="rgba(228,217,180,0.25)"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={prefersReducedMotion ? undefined : { pathLength: drawn }}
        />
        <motion.path
          d={TRAIL_D}
          stroke="#E4D9B4"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={prefersReducedMotion ? undefined : { pathLength: drawn }}
        />
      </svg>
      <div className="space-y-14 lg:space-y-28">
      {GROUPS.map((group, gi) => {
        const pace = PACE[gi] ?? PACE[0];
        const stationOpen = openQuestion !== null && (group.questions as readonly string[]).includes(openQuestion);
        return (
        <Reveal
          key={group.label}
          delay={gi * 0.14}
          duration={0.9}
          className={`relative lg:w-[45%] ${gi % 2 === 1 ? "lg:ml-auto" : ""}`}
        >
          {/* The environment answers the visitor (creative constitution:
              reward exploration, never just scrolling): while a question
              at this station is open, a small bloom unfurls beside the
              trail node — five petals staggering open, folding away when
              the answer closes. The meadow acknowledging understanding. */}
          <AnimatePresence>
            {stationOpen && !prefersReducedMotion && (
              <motion.svg
                aria-hidden="true"
                viewBox="0 0 40 40"
                className={`absolute top-2 hidden h-10 w-10 lg:block ${gi % 2 === 1 ? "-left-[3.25rem]" : "-right-[3.25rem]"}`}
                initial={{ opacity: 0, rotate: -20 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                {[0, 72, 144, 216, 288].map((deg, pi) => (
                  <g key={deg} transform={`rotate(${deg} 20 20)`}>
                    <motion.ellipse
                      cx="20"
                      cy="11"
                      rx="3.6"
                      ry="7.5"
                      fill="rgba(228,217,180,0.75)"
                      style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.6, delay: 0.15 + pi * 0.09, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </g>
                ))}
                <motion.circle
                  cx="20"
                  cy="20"
                  r="2.6"
                  fill="#E4D9B4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                />
              </motion.svg>
            )}
          </AnimatePresence>
          {/* Station node: a firefly resting where the card meets the
              trail, breathing while its station is the active stop. */}
          <motion.span
            aria-hidden="true"
            className={`absolute top-7 hidden h-2 w-2 rounded-full bg-[#E4D9B4] lg:block ${gi % 2 === 1 ? "-left-4" : "-right-4"}`}
            animate={prefersReducedMotion ? undefined : { opacity: [0.4, 1, 0.4], boxShadow: [
              "0 0 6px rgba(228,217,180,0.4)",
              "0 0 16px rgba(228,217,180,0.9)",
              "0 0 6px rgba(228,217,180,0.4)",
            ] }}
            transition={{ duration: 3.1 + gi * 0.7, repeat: Infinity, ease: "easeInOut" }}
          />
          <div
            className="rounded-2xl p-6 backdrop-blur-md sm:p-7"
            style={dark ? { backgroundColor: "rgba(20,26,23,0.55)" } : undefined}
          >
          {/* The chapter heading assembles instead of appearing: the
              index number is already settled, the label condenses from
              wide scattered tracking into its final editorial set, and
              an accent hairline grows out from under it — typography
              arriving, not fading in. */}
          <div className="flex items-baseline gap-3">
            <span className={`font-display text-sm ${dark ? "text-ivory/50" : "text-action-secondary"}`} aria-hidden="true">
              0{gi + 1}
            </span>
            <motion.p
              className={`text-xs font-medium uppercase ${dark ? "text-ivory/70" : "text-action-secondary"}`}
              initial={prefersReducedMotion ? { letterSpacing: "0.18em" } : { letterSpacing: "0.42em", opacity: 0 }}
              whileInView={prefersReducedMotion ? undefined : { letterSpacing: "0.18em", opacity: 1 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {group.label}
            </motion.p>
          </div>
          <motion.div
            aria-hidden="true"
            className={`mt-2 h-px w-10 ${dark ? "bg-[#A0A690]/60" : "bg-action-secondary/50"}`}
            style={{ originX: 0 }}
            initial={prefersReducedMotion ? undefined : { scaleX: 0 }}
            whileInView={prefersReducedMotion ? undefined : { scaleX: 1 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Interaction language — "the fog clearing", this chapter's
              own motion identity: dividers draw themselves in like
              horizon lines emerging from mist, a soft glow blooms under
              the cursor (light through fog, matching the mist layers in
              the section backdrop), the question leans gently toward the
              reader, and open answers condense out of a blur instead of
              simply sliding down. No other section shares any of these. */}
          <div className="mt-3">
            {group.questions.map((question, qi) => {
              const item = faqs.find((f) => f.question === question);
              if (!item) return null;
              const isOpen = openQuestion === item.question;
              return (
                // Each question condenses out of the fog as the visitor
                // descends — the section reads as a guided sequence of
                // arrivals rather than one tall pre-rendered list.
                <motion.div
                  key={item.question}
                  className="relative py-1"
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: pace.rise, filter: "blur(4px)" }}
                  whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                  transition={{ duration: pace.dur, delay: 0.1 + qi * pace.stagger, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* The environment answers the click: opening a
                      question parts the mist around it — a soft pool of
                      light blooms behind the active row, as if the fog
                      thinned exactly where understanding arrived. The
                      environment participating in the interaction, per
                      direct creative direction, rather than sitting
                      behind it as wallpaper. */}
                  <AnimatePresence>
                    {isOpen && !prefersReducedMotion && (
                      <motion.div
                        aria-hidden="true"
                        className="pointer-events-none absolute -inset-x-6 -inset-y-2 rounded-2xl"
                        style={{
                          background:
                            "radial-gradient(ellipse 70% 60% at 30% 40%, rgba(222,230,220,0.13) 0%, rgba(222,230,220,0.05) 45%, transparent 75%)",
                        }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                      />
                    )}
                  </AnimatePresence>
                  <motion.div
                    aria-hidden="true"
                    className={`h-px ${dark ? "bg-ivory/15" : "bg-border"}`}
                    style={{ originX: 0 }}
                    initial={prefersReducedMotion ? undefined : { scaleX: 0 }}
                    whileInView={prefersReducedMotion ? undefined : { scaleX: 1 }}
                    viewport={{ once: true, margin: "0px 0px -6% 0px" }}
                    transition={{ duration: 1.1, delay: 0.15 + qi * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <button
                    type="button"
                    className={`group mt-1 flex w-full items-center justify-between rounded-2xl px-3 py-3.5 text-left text-[1.05rem] font-medium transition-all duration-500 ${
                      dark
                        ? `text-ivory hover:bg-ivory/[0.07] hover:shadow-[0_0_38px_rgba(222,230,236,0.08)] focus-visible:bg-ivory/[0.07] ${isOpen ? "bg-ivory/[0.05]" : ""}`
                        : "text-soil hover:bg-clay/8 focus-visible:bg-clay/8"
                    }`}
                    aria-expanded={isOpen}
                    onClick={() => setOpenQuestion(isOpen ? null : item.question)}
                  >
                    <span className="flex w-full items-center justify-between">
                      <span className="flex-1 pr-3 transition-transform duration-500 ease-out group-hover:translate-x-1.5">
                        {item.question}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`ml-4 shrink-0 text-lg transition-all duration-300 group-hover:opacity-100 ${
                          dark ? "text-ivory/70 opacity-70" : "text-action-primary"
                        }`}
                        style={{ transform: isOpen ? TOGGLE_ROTATION.open : TOGGLE_ROTATION.closed }}
                      >
                        +
                      </span>
                    </span>
                    {/* Hover reveals another layer of understanding
                        (direct creative direction): before the click,
                        resting the cursor on a question breathes out the
                        answer's own first sentence as a quiet whisper —
                        a preview drawn from the real answer text, hidden
                        again once the full answer is open. CSS-only so
                        it costs nothing and degrades to simply absent on
                        touch devices, where tapping already opens the
                        full answer directly. */}
                    {!isOpen && (
                      <span
                        aria-hidden="true"
                        className={`block max-h-0 overflow-hidden pr-10 text-sm font-normal leading-relaxed opacity-0 transition-all duration-500 ease-out group-hover:mt-1.5 group-hover:max-h-16 group-hover:opacity-60 ${
                          dark ? "text-ivory" : "text-foreground-secondary"
                        }`}
                      >
                        {item.answer.split(/(?<=\.)\s/)[0]}
                      </span>
                    )}
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        variants={prefersReducedMotion ? undefined : answerVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={answerTransition}
                        className="overflow-hidden px-3"
                      >
                        <motion.p
                          initial={prefersReducedMotion ? undefined : { opacity: 0, filter: "blur(6px)", y: 4 }}
                          animate={prefersReducedMotion ? undefined : { opacity: 1, filter: "blur(0px)", y: 0 }}
                          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                          className={`max-w-2xl pb-4 text-base leading-relaxed ${dark ? "text-ivory/90" : "text-foreground-secondary"}`}
                        >
                          {item.answer}
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
          </div>
        </Reveal>
        );
      })}
      </div>
    </div>
  );
}
