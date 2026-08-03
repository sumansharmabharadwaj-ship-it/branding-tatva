"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ElementGlyph } from "@/components/ElementGlyph";
import { ElementRowBackground } from "@/components/ElementRowBackground";
import type { Element } from "@/data/elements";

const MOBILE_DECISIONS: Record<Element["slug"], { decision: string; question: string; weakness: string }> = {
  earth: {
    decision: "Position",
    question: "What should the business stand for in the mind of the market?",
    weakness: "Without Earth, identity and content begin making separate promises.",
  },
  water: {
    decision: "Experience",
    question: "How should the meaning survive every customer touchpoint?",
    weakness: "Without Water, each channel introduces a different personality.",
  },
  fire: {
    decision: "Expression",
    question: "Which signal earns attention and the second look?",
    weakness: "Without Fire, the brand may remain polished and easy to ignore.",
  },
  air: {
    decision: "Voice",
    question: "Which language frames value before price frames it instead?",
    weakness: "Without Air, the business is described by whoever speaks next.",
  },
  space: {
    decision: "Recognition",
    question: "Which meaning should remain after the campaign disappears?",
    weakness: "Without Space, activity accumulates while memory returns to zero.",
  },
};

export function TatvaMobileStory({ elements }: { elements: Element[] }) {
  const reduce = useReducedMotion();

  return (
    <section className="bg-soil text-ivory md:hidden">
      {elements.map((element, index) => {
        const content = MOBILE_DECISIONS[element.slug];
        return (
          <article key={element.slug} className="relative min-h-[44rem] overflow-hidden border-t border-ivory/10">
            <ElementRowBackground
              image={element.image}
              video={element.video}
              color={element.color}
              imagePosition={element.imagePosition}
            />
            <div className="relative flex min-h-[44rem] items-end px-5 py-10">
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(9px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: reduce ? 0 : 0.75, ease: [0.22, 1, 0.36, 1] }}
                className="w-full rounded-[1.7rem] border border-ivory/14 bg-soil/72 p-6 shadow-2xl backdrop-blur-2xl"
              >
                <div className="flex items-center justify-between gap-5">
                  <span className="text-[0.58rem] uppercase tracking-[0.22em] text-ivory/42">0{index + 1} / 05</span>
                  <ElementGlyph slug={element.slug} className="h-10 w-10" style={{ color: element.color }} />
                </div>
                <p className="mt-5 text-[0.58rem] font-semibold uppercase tracking-[0.22em]" style={{ color: element.color }}>
                  {content.decision}
                </p>
                <h2 className="mt-3 font-display text-5xl font-normal leading-[0.88] tracking-[-0.045em] text-ivory">
                  {element.name}
                </h2>
                <p className="mt-5 font-display text-2xl italic leading-tight text-ivory/84">{element.poetic}</p>
                <p className="mt-6 text-sm leading-relaxed text-ivory/72">{content.question}</p>
                <p className="mt-5 border-t border-ivory/12 pt-5 text-sm leading-relaxed text-ivory/52">{content.weakness}</p>
              </motion.div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
