"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { LinkButton } from "@/components/Button";
import { DustMotes } from "@/components/DustMotes";
import { track } from "@/lib/analytics";

const decisions = [
  "Positioning that gives the business one clear place to own",
  "Identity and voice that stay recognisable across every touchpoint",
  "A practical system your marketing can keep amplifying",
];

export function FinalInvitation() {
  const reduced = useReducedMotion();

  return (
    <section className="relative isolate min-h-svh overflow-hidden bg-soil text-ivory">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/higgsfield-silver-tide.mp4"
        poster="/images/higgsfield-silver-tide-poster.jpg"
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,17,14,0.28),rgba(20,17,14,0.62)_42%,rgba(20,17,14,0.96))]" />
      <DustMotes />

      <div aria-hidden="true" className="absolute inset-x-0 top-[18%] mx-auto h-px max-w-6xl overflow-hidden bg-ivory/10">
        <motion.span
          className="block h-full origin-left bg-sandstone"
          initial={{ scaleX: reduced ? 1 : 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <div className="relative mx-auto flex min-h-svh w-full max-w-6xl items-center px-6 py-24 sm:px-8 lg:px-10">
        <div className="grid w-full gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-20">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-sandstone">The next decision</p>
            <motion.h2
              initial={reduced ? false : { opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 max-w-3xl font-display text-[clamp(2.8rem,6.5vw,6rem)] font-normal leading-[0.98]"
            >
              Your business already leaves an impression.
              <span className="mt-3 block italic text-sandstone">Let&apos;s make it intentional.</span>
            </motion.h2>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-ivory/74 sm:text-lg">
              A focused first conversation to identify what the market currently remembers, what is getting lost, and which strategic decision will create the greatest commercial shift.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <LinkButton
                href="/contact"
                trackEvent="hero_booking_click"
                trackProps={{ page: "home", placement: "final_invitation" }}
              >
                Book the Brand Strategy Session
              </LinkButton>
              <Link
                href="/work"
                onClick={() => track("contextual_cta_clicked", { page: "home", destination: "work", placement: "final_invitation" })}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-ivory/25 px-5 text-sm font-medium text-ivory transition duration-300 hover:border-sandstone hover:bg-ivory/8 focus-visible:border-sandstone"
              >
                Review the evidence first
              </Link>
            </div>
            <p className="mt-4 text-sm text-ivory/58">Twenty minutes. Direct with Suman. No pitch deck and no pressure.</p>
          </div>

          <motion.aside
            initial={reduced ? false : { opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border border-ivory/12 bg-soil/48 p-6 shadow-2xl backdrop-blur-md sm:p-8"
          >
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-sandstone">What leaves the call clearer</p>
            <ol className="mt-6 space-y-5">
              {decisions.map((decision, index) => (
                <li key={decision} className="grid grid-cols-[2rem_1fr] gap-3 border-t border-ivory/10 pt-5 first:border-t-0 first:pt-0">
                  <span className="font-display text-xl text-sandstone/80">{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-sm leading-relaxed text-ivory/78">{decision}</span>
                </li>
              ))}
            </ol>
            <div className="mt-8 rounded-2xl bg-ivory/7 p-4">
              <p className="font-display text-xl text-ivory">A useful answer, even when the answer is “not yet.”</p>
              <p className="mt-2 text-sm leading-relaxed text-ivory/58">The first conversation is designed to create clarity before commitment.</p>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
