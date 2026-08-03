"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { LinkButton } from "@/components/Button";
import { AuditInvite } from "@/components/AuditInvite";

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

  return (
    <motion.div style={{ opacity, x, scale }} className={index % 2 === 0 ? "lg:mr-auto" : "lg:ml-auto"}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
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
  const reduced = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const videoScale = useTransform(scrollYProgress, [0, 0.68, 1], [1.06, 1.015, 1]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.7, 0.94], [0.62, 0.38, 0.16]);
  const fogY = useTransform(scrollYProgress, [0, 1], [70, -60]);
  const questionsOpacity = useTransform(scrollYProgress, [0, 0.035, 0.68, 0.82], [0.35, 1, 1, 0]);
  const finalOpacity = useTransform(scrollYProgress, [0.7, 0.83, 1], [0, 1, 1]);
  const finalScale = useTransform(scrollYProgress, [0.7, 0.86], [0.96, 1]);
  const horizonWidth = useTransform(scrollYProgress, [0.68, 0.96], ["78%", "0%"]);

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
          style={reduced ? { opacity: 0.3 } : { scale: videoScale, opacity: videoOpacity }}
          ref={(node) => {
            if (node && node.paused) void node.play().catch(() => {});
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,11,10,0.3)_0%,rgba(12,11,10,0.66)_55%,rgba(12,11,10,0.95)_100%)]" />
        <motion.div
          aria-hidden="true"
          className="absolute inset-x-[-15%] bottom-[-12%] h-[48%] rounded-[50%] bg-ivory/[0.055] blur-3xl"
          style={reduced ? undefined : { y: fogY }}
        />

        <motion.div
          className="absolute inset-0 z-10 px-6 pb-20 pt-20 sm:px-10 lg:px-16 lg:pt-24"
          style={reduced ? { opacity: 1 } : { opacity: questionsOpacity }}
        >
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

        <motion.div
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6 text-center"
          style={reduced ? { opacity: 1 } : { opacity: finalOpacity, scale: finalScale }}
        >
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
          <motion.div className="mx-auto h-full bg-sandstone/75" style={{ width: reduced ? "0%" : horizonWidth }} />
        </div>
      </div>
    </section>
  );
}
