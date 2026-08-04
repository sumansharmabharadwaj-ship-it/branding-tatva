"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { LinkButton } from "@/components/Button";
import { AuditInvite } from "@/components/AuditInvite";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export type ClosingQuestion = {
  question: string;
  answer: string;
};

function QuestionBeat({
  item,
  index,
  progress,
  open,
  onToggle,
}: {
  item: ClosingQuestion;
  index: number;
  progress: MotionValue<number>;
  open: boolean;
  onToggle: () => void;
}) {
  const start = 0.04 + index * 0.105;
  const opacity = useTransform(progress, [start - 0.035, start, start + 0.11, start + 0.18], [0.18, 1, 1, 0.36]);
  const x = useTransform(progress, [start - 0.035, start + 0.025], [index % 2 === 0 ? -42 : 42, 0]);
  const scale = useTransform(progress, [start - 0.03, start + 0.035], [0.97, 1]);
  const answerId = `closing-answer-${index}`;

  return (
    <motion.div style={{ opacity, x, scale }} className={index % 2 === 0 ? "lg:mr-auto" : "lg:ml-auto"}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={answerId}
        className="group block w-full max-w-3xl text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-sandstone"
      >
        <span className="flex items-start gap-5">
          <span className="mt-2 text-[0.58rem] uppercase tracking-[0.25em] text-ivory/32">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-display text-[clamp(1.55rem,3.2vw,3.8rem)] font-normal leading-[1.03] tracking-[-0.035em] text-ivory/82 transition-colors duration-500 group-hover:text-ivory">
            {item.question}
          </span>
          <span className="ml-auto mt-2 text-xl text-sandstone transition-transform duration-500" style={{ transform: open ? "rotate(45deg)" : undefined }}>
            +
          </span>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={answerId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="ml-12 mt-5 max-w-2xl border-l border-sandstone/45 pl-6 text-sm leading-relaxed text-ivory/64 sm:text-base">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function ClosingSequence({ questions }: { questions: ClosingQuestion[] }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useHydratedReducedMotion();
  const compactLayout = useMediaQuery("(max-width: 1023px), (max-height: 719px)");
  const staticLayout = Boolean(reduced) || compactLayout;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const videoScale = useTransform(scrollYProgress, [0, 0.68, 1], [1.06, 1.015, 1]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.7, 0.94], [0.62, 0.38, 0.16]);
  const fogY = useTransform(scrollYProgress, [0, 1], [70, -60]);
  const questionsOpacity = useTransform(scrollYProgress, [0, 0.035, 0.68, 0.82], [0.35, 1, 1, 0]);
  const finalOpacity = useTransform(scrollYProgress, [0.7, 0.83, 1], [0, 1, 1]);
  const finalScale = useTransform(scrollYProgress, [0.7, 0.86], [0.96, 1]);
  const horizonWidth = useTransform(scrollYProgress, [0.68, 0.96], ["78%", "0%"]);

  if (staticLayout) {
    return (
      <section className="relative isolate overflow-hidden bg-[#11100e] px-6 py-24 text-ivory sm:px-10 sm:py-28">
        <div className="absolute inset-0">
          <Image
            src="/images/higgsfield-silver-tide-poster.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,11,10,.72),rgba(12,11,10,.94)_52%,rgba(12,11,10,.98))]" />

        <div className="relative z-10 mx-auto max-w-[90rem]">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-[0.62rem] font-medium uppercase tracking-[0.28em] text-sandstone">Before the room goes quiet</p>
              <h2 className="mt-4 max-w-3xl font-display text-[clamp(3rem,7vw,6.5rem)] font-normal leading-[0.92] tracking-[-0.045em]">
                Doubt deserves an answer. <span className="italic text-sandstone">Not a sales script.</span>
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-ivory/62 sm:text-base lg:justify-self-end">
              Open the question that is still holding the decision back. Every answer remains readable without scroll choreography.
            </p>
          </div>

          <div className="mt-10 divide-y divide-ivory/12 rounded-[1.6rem] border border-ivory/14 bg-black/24 px-5 backdrop-blur-md sm:px-7">
            {questions.map((item, index) => (
              <details key={item.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-start gap-4 font-display text-2xl leading-tight text-ivory marker:hidden sm:text-3xl">
                  <span className="mt-1 text-[0.58rem] font-body uppercase tracking-[0.22em] text-sandstone/66">{String(index + 1).padStart(2, "0")}</span>
                  <span>{item.question}</span>
                  <span className="ml-auto text-xl text-sandstone transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="ml-10 mt-4 max-w-3xl border-l border-sandstone/40 pl-5 text-sm leading-relaxed text-ivory/68 sm:text-base">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2 lg:items-end">
            <AuditInvite tone="dark" />
            <p className="text-sm lg:text-right">
              <Link href="/services#book" className="link-underline text-ivory/60 hover:text-ivory">
                Bring a different question to the first conversation
              </Link>
            </p>
          </div>

          <div className="mt-16 border-t border-ivory/14 pt-12 text-center">
            <p className="text-[0.62rem] font-medium uppercase tracking-[0.3em] text-sandstone">The last frame belongs to them</p>
            <h2 className="mx-auto mt-6 max-w-5xl font-display text-[clamp(3rem,7vw,7rem)] font-normal leading-[0.9] tracking-[-0.05em]">
              What should your audience remember after you leave the room?
            </h2>
            <p className="mx-auto mt-7 max-w-xl text-sm leading-relaxed text-ivory/58 sm:text-base">
              Twenty minutes. A real diagnosis. No pitch deck waiting behind the curtain.
            </p>
            <div className="mt-9">
              <LinkButton href="/contact" trackEvent="closing_booking_click" trackProps={{ page: "home" }}>
                Begin with the real question
              </LinkButton>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[330svh] bg-[#11100e]">
      <div className="sticky top-0 h-dvh overflow-hidden">
        <motion.video
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/higgsfield-silver-tide.mp4"
          poster="/images/higgsfield-silver-tide-poster.jpg"
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          style={{ scale: videoScale, opacity: videoOpacity }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,11,10,0.3)_0%,rgba(12,11,10,0.66)_55%,rgba(12,11,10,0.95)_100%)]" />
        <motion.div aria-hidden="true" className="absolute inset-x-[-15%] bottom-[-12%] h-[48%] rounded-[50%] bg-ivory/[0.055] blur-3xl" style={{ y: fogY }} />

        <motion.div className="absolute inset-0 z-10 px-6 pb-20 pt-20 sm:px-10 lg:px-16 lg:pt-24" style={{ opacity: questionsOpacity }}>
          <div className="mx-auto flex h-full max-w-[90rem] flex-col justify-center">
            <div className="mb-8 flex items-end justify-between gap-8 sm:mb-10">
              <div>
                <p className="text-[0.62rem] font-medium uppercase tracking-[0.28em] text-sandstone">Before the room goes quiet</p>
                <h2 className="mt-4 max-w-3xl font-display text-[clamp(2.15rem,5.4vw,5.8rem)] font-normal leading-[0.92] tracking-[-0.045em] text-ivory">
                  Doubt deserves an answer.<br />Not a sales script.
                </h2>
              </div>
              <p className="hidden max-w-xs text-right text-xs leading-relaxed text-ivory/42 md:block">
                Open the question that is still holding the decision back.
              </p>
            </div>

            <div className="space-y-5 sm:space-y-7 lg:space-y-8">
              {questions.map((item, index) => (
                <QuestionBeat
                  key={item.question}
                  item={item}
                  index={index}
                  progress={scrollYProgress}
                  open={openIndex === index}
                  onToggle={() => setOpenIndex((current) => (current === index ? null : index))}
                />
              ))}
            </div>

            <div className="mt-8 grid gap-5 border-t border-ivory/10 pt-5 sm:mt-10 lg:grid-cols-2 lg:items-end">
              <AuditInvite tone="dark" />
              <p className="text-sm lg:text-right">
                <Link href="/services#book" className="link-underline text-ivory/60 hover:text-ivory">
                  Bring a different question to the first conversation
                </Link>
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6 text-center" style={{ opacity: finalOpacity, scale: finalScale }}>
          <div className="pointer-events-auto max-w-4xl">
            <p className="text-[0.62rem] font-medium uppercase tracking-[0.3em] text-sandstone">The last frame belongs to them</p>
            <h2 className="mt-6 font-display text-[clamp(2.7rem,7.2vw,7.7rem)] font-normal leading-[0.9] tracking-[-0.055em] text-ivory">
              What should your audience remember after you leave the room?
            </h2>
            <p className="mx-auto mt-7 max-w-xl text-sm leading-relaxed text-ivory/58 sm:text-base">
              Twenty minutes. A real diagnosis. No pitch deck waiting behind the curtain.
            </p>
            <div className="mt-9">
              <LinkButton href="/contact" trackEvent="closing_booking_click" trackProps={{ page: "home" }}>
                Begin with the real question
              </LinkButton>
            </div>
          </div>
        </motion.div>

        <div className="absolute bottom-6 left-1/2 z-30 h-px w-[78%] -translate-x-1/2 bg-ivory/10">
          <motion.div className="mx-auto h-full bg-sandstone/75" style={{ width: horizonWidth }} />
        </div>
      </div>
    </section>
  );
}
