"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/Container";
import { ElementGlyph } from "@/components/ElementGlyph";
import { ElementRowBackground } from "@/components/ElementRowBackground";
import { useLenis } from "@/components/SmoothScrollProvider";
import type { Element } from "@/data/elements";

const DECISIONS = {
  earth: {
    decision: "Position",
    question: "What should this business stand for in the mind of the market?",
    weakness: "Without Earth, identity and content begin making separate promises.",
  },
  water: {
    decision: "Experience",
    question: "How should the meaning survive every customer touchpoint?",
    weakness: "Without Water, the brand changes personality whenever the channel changes.",
  },
  fire: {
    decision: "Expression",
    question: "What deserves attention, and which signal earns the second look?",
    weakness: "Without Fire, the brand may remain correct, polished, and easy to ignore.",
  },
  air: {
    decision: "Voice",
    question: "Which language frames the value before price frames it instead?",
    weakness: "Without Air, the business is described by whoever happens to speak next.",
  },
  space: {
    decision: "Recognition",
    question: "Which meaning should remain after the campaign has disappeared?",
    weakness: "Without Space, activity accumulates while memory keeps returning to zero.",
  },
} as const;

function TatvaDiagram({ slug, color }: { slug: Element["slug"]; color: string }) {
  if (slug === "earth") {
    return (
      <svg viewBox="0 0 520 320" className="h-full w-full" aria-hidden="true">
        {[0, 1, 2, 3].map((index) => (
          <motion.path
            key={index}
            d={`M44 ${236 - index * 38} C142 ${178 - index * 22} 214 ${258 - index * 18} 304 ${194 - index * 19} C378 ${142 - index * 10} 430 ${188 - index * 12} 478 ${132 - index * 13}`}
            fill="none"
            stroke={index === 0 ? color : "rgba(244,239,230,.28)"}
            strokeWidth={index === 0 ? 4 : 2}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.15, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
        {[150, 260, 374].map((x, index) => (
          <motion.path
            key={x}
            d={`M${x} 160 C${x - 26} 205 ${x - 14} 244 ${x - 52} 284 M${x} 160 C${x + 24} 208 ${x + 10} 250 ${x + 48} 286`}
            fill="none"
            stroke="rgba(244,239,230,.38)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, delay: 0.35 + index * 0.12 }}
          />
        ))}
        <motion.circle cx="260" cy="160" r="12" fill={color} animate={{ scale: [0.88, 1.12, 0.88] }} transition={{ duration: 3, repeat: Infinity }} />
      </svg>
    );
  }

  if (slug === "water") {
    return (
      <svg viewBox="0 0 520 320" className="h-full w-full" aria-hidden="true">
        <path d="M36 190 C118 76 178 278 258 156 C334 42 386 236 486 106" fill="none" stroke="rgba(244,239,230,.20)" strokeWidth="4" strokeLinecap="round" />
        <motion.path
          d="M36 190 C118 76 178 278 258 156 C334 42 386 236 486 106"
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
        />
        {[{ x: 36, y: 190 }, { x: 164, y: 191 }, { x: 258, y: 156 }, { x: 382, y: 159 }, { x: 486, y: 106 }].map((point, index) => (
          <motion.g key={point.x}>
            <circle cx={point.x} cy={point.y} r="10" fill="#121a16" stroke="rgba(244,239,230,.32)" strokeWidth="2" />
            <motion.circle
              cx={point.x}
              cy={point.y}
              r="5"
              fill={color}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 + index * 0.13 }}
            />
          </motion.g>
        ))}
        <motion.circle
          r="8"
          fill="#F4EFE6"
          animate={{ cx: [36, 164, 258, 382, 486], cy: [190, 191, 156, 159, 106] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    );
  }

  if (slug === "fire") {
    return (
      <svg viewBox="0 0 520 320" className="h-full w-full" aria-hidden="true">
        {[0, 1, 2].map((ring) => (
          <motion.circle
            key={ring}
            cx="260"
            cy="160"
            r={42 + ring * 48}
            fill="none"
            stroke={ring === 0 ? color : "rgba(244,239,230,.20)"}
            strokeWidth={ring === 0 ? 4 : 2}
            initial={{ opacity: 0, scale: 0.72 }}
            animate={{ opacity: [0.28, 0.86, 0.28], scale: [0.86, 1.04, 0.86] }}
            transition={{ duration: 3.6 + ring, repeat: Infinity, delay: ring * 0.28 }}
          />
        ))}
        {Array.from({ length: 12 }).map((_, index) => {
          const angle = (index / 12) * Math.PI * 2;
          const x1 = 260 + Math.cos(angle) * 54;
          const y1 = 160 + Math.sin(angle) * 54;
          const x2 = 260 + Math.cos(angle) * 142;
          const y2 = 160 + Math.sin(angle) * 142;
          return (
            <motion.line
              key={index}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={index % 3 === 0 ? color : "rgba(244,239,230,.22)"}
              strokeWidth={index % 3 === 0 ? 3 : 1.5}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: index * 0.045 }}
            />
          );
        })}
        <motion.circle cx="260" cy="160" r="22" fill={color} animate={{ scale: [0.92, 1.1, 0.92] }} transition={{ duration: 2.4, repeat: Infinity }} />
      </svg>
    );
  }

  if (slug === "air") {
    return (
      <svg viewBox="0 0 520 320" className="h-full w-full" aria-hidden="true">
        {[
          "M34 104 C122 34 208 174 312 98 C382 48 430 82 486 54",
          "M34 164 C138 94 210 232 320 154 C390 106 436 142 486 118",
          "M34 224 C128 158 220 278 326 214 C396 174 438 204 486 186",
        ].map((path, index) => (
          <motion.path
            key={path}
            d={path}
            fill="none"
            stroke={index === 1 ? color : "rgba(244,239,230,.24)"}
            strokeWidth={index === 1 ? 4 : 2}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.1, delay: index * 0.12 }}
          />
        ))}
        {["Frame", "Name", "Repeat"].map((word, index) => (
          <motion.text
            key={word}
            x={80 + index * 150}
            y={index === 1 ? 152 : index === 0 ? 101 : 213}
            fill={index === 1 ? color : "rgba(244,239,230,.70)"}
            fontSize="20"
            letterSpacing="3"
            initial={{ opacity: 0, x: 48 + index * 150 }}
            animate={{ opacity: 1, x: 80 + index * 150 }}
            transition={{ duration: 0.75, delay: 0.3 + index * 0.15 }}
          >
            {word.toUpperCase()}
          </motion.text>
        ))}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 520 320" className="h-full w-full" aria-hidden="true">
      {[142, 108, 76, 46].map((radius, index) => (
        <motion.circle
          key={radius}
          cx="260"
          cy="160"
          r={radius}
          fill="none"
          stroke={index === 3 ? color : "rgba(244,239,230,.22)"}
          strokeWidth={index === 3 ? 4 : 2}
          initial={{ opacity: 0, scale: 1.16 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: index * 0.14, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
      {Array.from({ length: 18 }).map((_, index) => {
        const angle = (index / 18) * Math.PI * 2;
        const distance = 128 - (index % 4) * 14;
        return (
          <motion.circle
            key={index}
            cx={260 + Math.cos(angle) * distance}
            cy={160 + Math.sin(angle) * distance}
            r="3.5"
            fill="rgba(244,239,230,.72)"
            animate={{ opacity: [0.18, 0.8, 0.18], scale: [0.75, 1.15, 0.75] }}
            transition={{ duration: 3.4 + (index % 5), repeat: Infinity, delay: index * 0.08 }}
          />
        );
      })}
      <motion.circle cx="260" cy="160" r="15" fill={color} animate={{ scale: [0.88, 1.1, 0.88] }} transition={{ duration: 3.2, repeat: Infinity }} />
    </svg>
  );
}

function TatvaCard({ element, index }: { element: Element; index: number }) {
  const content = DECISIONS[element.slug];
  return (
    <article className="relative min-h-[42rem] overflow-hidden border-t border-ivory/10 bg-soil text-ivory">
      <ElementRowBackground image={element.image} video={element.video} color={element.color} imagePosition={element.imagePosition} />
      <div className="relative flex min-h-[42rem] items-end px-6 py-14">
        <div className="max-w-2xl rounded-[1.7rem] border border-ivory/14 bg-soil/68 p-6 backdrop-blur-2xl sm:p-8">
          <div className="flex items-center gap-4">
            <span className="text-[0.58rem] uppercase tracking-[0.22em] text-ivory/42">0{index + 1}</span>
            <ElementGlyph slug={element.slug} className="h-9 w-9" style={{ color: element.color }} />
          </div>
          <h3 className="mt-5 font-display text-5xl leading-[0.9] tracking-[-0.04em]">{element.name}</h3>
          <p className="mt-5 font-display text-2xl italic text-ivory/84">{element.poetic}</p>
          <p className="mt-6 text-sm leading-relaxed text-ivory/68">{content.question}</p>
          <p className="mt-5 border-t border-ivory/12 pt-5 text-sm leading-relaxed text-ivory/52">{content.weakness}</p>
        </div>
      </div>
    </article>
  );
}

export function TatvaStory({ elements }: { elements: Element[] }) {
  const wrapperRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const lenis = useLenis();
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ["start start", "end end"] });
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(elements.length - 1, Math.floor(value * elements.length));
    setActiveIndex((current) => (current === next ? current : next));
  });

  const active = elements[activeIndex] ?? elements[0];
  if (!active) return null;
  const content = DECISIONS[active.slug];

  function choose(index: number) {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const top = window.scrollY + wrapper.getBoundingClientRect().top;
    const travel = Math.max(1, wrapper.offsetHeight - window.innerHeight);
    const destination = top + travel * (index / Math.max(1, elements.length - 1));
    if (lenis) lenis.scrollTo(destination, { duration: 0.8 });
    else window.scrollTo({ top: destination, behavior: reduce ? "auto" : "smooth" });
  }

  if (reduce) {
    return <section>{elements.map((element, index) => <TatvaCard key={element.slug} element={element} index={index} />)}</section>;
  }

  return (
    <section ref={wrapperRef} className="relative hidden h-[320vh] bg-soil text-ivory md:block">
      <div className="sticky top-0 h-dvh overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.slug}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.035, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.02, filter: "blur(8px)" }}
            transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
          >
            <ElementRowBackground
              image={active.image}
              video={active.video}
              color={active.color}
              imagePosition={active.imagePosition}
              active
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,19,15,.92)_0%,rgba(13,19,15,.68)_52%,rgba(13,19,15,.48)_100%)]" />

        <Container className="relative flex h-full max-w-[94rem] items-center py-24">
          <div className="grid w-full gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-20">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`copy-${active.slug}`}
                initial={{ opacity: 0, y: 24, filter: "blur(9px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -18, filter: "blur(7px)" }}
                transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-[0.62rem] uppercase tracking-[0.24em] text-ivory/42">0{activeIndex + 1} / 05</span>
                  <ElementGlyph slug={active.slug} className="h-11 w-11" style={{ color: active.color }} />
                </div>
                <p className="mt-5 text-[0.62rem] font-medium uppercase tracking-[0.25em]" style={{ color: active.color }}>
                  {content.decision}
                </p>
                <h2 className="mt-4 max-w-3xl font-display text-[clamp(4rem,8vw,8.8rem)] font-normal leading-[0.82] tracking-[-0.055em] text-ivory">
                  {active.name}
                </h2>
                <p className="mt-6 max-w-xl font-display text-[clamp(1.7rem,3vw,3.2rem)] italic leading-[1.04] text-ivory/84">
                  {active.poetic}
                </p>
                <p className="mt-7 max-w-xl text-base leading-relaxed text-ivory/72">{content.question}</p>
                <p className="mt-6 max-w-xl border-t border-ivory/14 pt-6 text-sm leading-relaxed text-ivory/52">{content.weakness}</p>
              </motion.div>
            </AnimatePresence>

            <div className="rounded-[2rem] border border-ivory/12 bg-soil/42 p-5 shadow-2xl backdrop-blur-2xl sm:p-7">
              <div className="h-[25rem] overflow-hidden rounded-[1.4rem] border border-ivory/10 bg-black/12 p-4 sm:h-[29rem] sm:p-6">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={`diagram-${active.slug}`} className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <TatvaDiagram slug={active.slug} color={active.color} />
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="mt-5 grid grid-cols-5 gap-2" role="tablist" aria-label="Choose a Tatva decision">
                {elements.map((element, index) => {
                  const selected = index === activeIndex;
                  return (
                    <button
                      key={element.slug}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => choose(index)}
                      className={`rounded-[1rem] border px-2 py-3 text-center transition-colors duration-400 ${
                        selected ? "border-ivory/24 bg-ivory/[0.08]" : "border-ivory/8 bg-black/8 hover:border-ivory/18"
                      }`}
                    >
                      <ElementGlyph slug={element.slug} className="mx-auto h-7 w-7" style={{ color: element.color }} />
                      <span className="mt-2 block text-[0.52rem] uppercase tracking-[0.14em] text-ivory/54">{element.slug}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>

        <div className="absolute inset-x-8 bottom-7 flex items-center gap-4 text-[0.54rem] uppercase tracking-[0.22em] text-ivory/38">
          <span>Position</span>
          <div className="h-px flex-1 overflow-hidden bg-ivory/12">
            <motion.div className="h-full origin-left bg-sandstone" style={{ scaleX: progress }} />
          </div>
          <span>Recognition</span>
        </div>
      </div>
    </section>
  );
}
