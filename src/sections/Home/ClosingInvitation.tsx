"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import { LogoMark } from "@/components/Logo";
import { site } from "@/data/site";

const STEPS = [
  {
    number: "01",
    title: "Bring the difficult question",
    body: "The part of the brand that currently feels hardest to explain, align, or trust.",
  },
  {
    number: "02",
    title: "Receive an honest first diagnosis",
    body: "We examine where perception breaks and which decision deserves attention first.",
  },
  {
    number: "03",
    title: "Leave with a clearer next move",
    body: "A useful direction, whether that becomes a project together or a decision you carry forward.",
  },
] as const;

export function ClosingInvitation() {
  const reduce = useReducedMotion();

  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-soil py-28 text-ivory sm:py-36">
      <BackgroundVideo
        video="/videos/higgsfield-silver-tide.mp4"
        poster="/images/higgsfield-silver-tide-poster.jpg"
        imagePosition="50% 12%"
        parallax
        push
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,16,13,.44)_0%,rgba(10,16,13,.34)_30%,rgba(10,16,13,.76)_68%,rgba(10,16,13,.96)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(198,169,122,.16),transparent_32%)]" />

      <Container className="relative max-w-[92rem]">
        <div className="mx-auto max-w-6xl text-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.88, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduce ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-ivory/16 bg-soil/48 shadow-[0_0_90px_rgba(198,169,122,.16)] backdrop-blur-xl"
          >
            <motion.div
              animate={reduce ? undefined : { rotate: [0, 2, 0, -2, 0], scale: [0.98, 1.04, 0.98] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="text-ivory"
            >
              <LogoMark size={72} light />
            </motion.div>
          </motion.div>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduce ? 0 : 0.72, delay: reduce ? 0 : 0.08 }}
            className="mt-9 text-[0.62rem] font-medium uppercase tracking-[0.3em] text-sandstone"
          >
            Final scene · the invitation
          </motion.p>
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: reduce ? 0 : 0.95, delay: reduce ? 0 : 0.14, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-5 max-w-5xl font-display text-[clamp(3.5rem,7.8vw,8rem)] font-normal leading-[0.84] tracking-[-0.055em] text-ivory"
          >
            Which meaning should your audience carry after you leave the room?
          </motion.h2>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduce ? 0 : 0.78, delay: reduce ? 0 : 0.24 }}
            className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-ivory/72 sm:text-lg"
          >
            The first conversation is a calm diagnosis of the brand as it exists now, the perception it creates, and the decision that could make everything else easier to align.
          </motion.p>

          <div className="mt-12 grid gap-3 text-left md:grid-cols-3">
            {STEPS.map((step, index) => (
              <motion.div
                key={step.number}
                initial={reduce ? false : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: reduce ? 0 : 0.68, delay: reduce ? 0 : 0.3 + index * 0.09 }}
                className="rounded-[1.45rem] border border-ivory/12 bg-soil/52 p-6 backdrop-blur-xl"
              >
                <span className="text-[0.54rem] uppercase tracking-[0.2em] text-sandstone">{step.number}</span>
                <h3 className="mt-4 font-display text-2xl leading-tight text-ivory sm:text-3xl">{step.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-ivory/58">{step.body}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduce ? 0 : 0.76, delay: reduce ? 0 : 0.58 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <LinkButton href="/contact">Book a Brand Strategy Session</LinkButton>
            <LinkButton href={`mailto:${site.email}`} variant="secondary" className="border-ivory/26 text-ivory hover:bg-ivory/10">
              Send the question by email
            </LinkButton>
          </motion.div>
          <p className="mt-5 text-sm text-ivory/48">Twenty minutes. A real diagnosis. A clear next step.</p>
        </div>
      </Container>
    </section>
  );
}
