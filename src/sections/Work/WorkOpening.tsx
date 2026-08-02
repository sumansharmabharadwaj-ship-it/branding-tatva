"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";
import { useLenis } from "@/components/SmoothScrollProvider";
import { projects } from "@/data/projects";
import { WORK, EASE_ORGANIC } from "@/sections/Work/palette";

// Work Page 2.0 opening — the proposition, readable immediately, on
// the cream editorial ground the handoff specifies instead of another
// full bleed nature hero. The headline arrives line by line with a
// blur sharpening reveal; the visual panel is built from real project
// material (two case study stills layered like proofs on a desk) with
// a two to four pixel cursor drift on pointer devices. No loader, no
// delayed readability: text renders first, media settles around it.
const LINES = ["The work is easier", "to judge when the", "decisions are visible."];

export function WorkOpening() {
  const prefersReducedMotion = useReducedMotion();
  const lenis = useLenis();
  const panelRef = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);

  // 2 to 4px cursor drift, rAF coalesced, pointer devices only — the
  // panel leans almost imperceptibly toward the cursor, the handoff's
  // "restrained visual panel" behaviour.
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (prefersReducedMotion || e.pointerType !== "mouse") return;
    const el = panelRef.current;
    if (!el || raf.current) return;
    const { clientX, clientY } = e;
    raf.current = requestAnimationFrame(() => {
      raf.current = null;
      const rect = el.getBoundingClientRect();
      const dx = (clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const dy = (clientY - rect.top - rect.height / 2) / (rect.height / 2);
      el.style.setProperty("--drift-x", `${(dx * 4).toFixed(2)}px`);
      el.style.setProperty("--drift-y", `${(dy * 3).toFixed(2)}px`);
    });
  }

  const signature = projects.find((p) => p.slug === "dr-haley-nutrition");
  const second = projects.find((p) => p.slug === "myshopineurope");

  function explore(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = document.getElementById("index");
    if (!el) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(el, { offset: -80 });
    else el.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
  }

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: WORK.cream }}>
      {/* Controlled abstract light — one slow breathing radial, CSS
          only, the quiet ambient layer under the editorial type. */}
      {!prefersReducedMotion && (
        <div
          aria-hidden="true"
          className="bg-slow-push pointer-events-none absolute -right-[15%] -top-[20%] h-[70%] w-[60%] rounded-full"
          style={{
            background: `radial-gradient(ellipse at center, ${WORK.mist} 0%, rgba(221,226,220,0.4) 45%, transparent 70%)`,
          }}
        />
      )}
      <Container className="relative pb-20 pt-32 sm:pb-28 sm:pt-40">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <div>
            <motion.p
              initial={prefersReducedMotion ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-sm font-medium uppercase tracking-[0.2em]"
              style={{ color: WORK.olive }}
            >
              Selected work
            </motion.p>
            <h1
              className="mt-5 font-display text-[clamp(2.6rem,6vw,4.8rem)] font-normal leading-[1.05] tracking-[-0.01em]"
              style={{ color: WORK.charcoal }}
            >
              {LINES.map((line, i) => (
                <motion.span
                  key={line}
                  className="block"
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 18, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.8, delay: prefersReducedMotion ? 0 : 0.12 + i * 0.16, ease: EASE_ORGANIC }}
                >
                  {line}
                </motion.span>
              ))}
            </h1>
            <motion.p
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: prefersReducedMotion ? 0 : 0.7, ease: EASE_ORGANIC }}
              className="mt-6 max-w-md text-base leading-relaxed"
              style={{ color: WORK.wood }}
            >
              Selected engagements, independent studies, and strategic experiments across positioning, identity, language, digital experience, content, and recognition.
            </motion.p>
            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: prefersReducedMotion ? 0 : 0.9 }}
              className="mt-9"
            >
              <a
                href="#index"
                onClick={explore}
                className="group inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-medium text-white transition-transform duration-300 hover:translate-y-[-2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ backgroundColor: WORK.forest, outlineColor: WORK.moss }}
              >
                Explore selected work
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-0.5">
                  ↓
                </span>
              </a>
            </motion.div>
            <motion.p
              initial={prefersReducedMotion ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: prefersReducedMotion ? 0 : 1.05 }}
              className="mt-10 text-xs uppercase tracking-[0.15em]"
              style={{ color: WORK.stone }}
            >
              Conceived, written, designed, and directed by Suman Sharma
            </motion.p>
          </div>

          {/* Real project material as the opening visual: the signature
              study's still over a second engagement's, layered like
              proofs on a desk. Cursor drift moves the stack a few
              pixels; each layer drifts at its own rate for depth. */}
          <motion.div
            ref={panelRef}
            onPointerMove={onPointerMove}
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: prefersReducedMotion ? 0 : 0.45, ease: EASE_ORGANIC }}
            className="relative hidden aspect-[4/3] lg:block"
            style={{ ["--drift-x" as string]: "0px", ["--drift-y" as string]: "0px" }}
          >
            {second && (
              <Link
                href={`/work/${second.slug}`}
                className="absolute right-0 top-0 block w-[62%] overflow-hidden rounded-2xl shadow-[0_18px_50px_rgba(31,58,40,0.18)] transition-transform duration-500 hover:scale-[1.015]"
                style={{ transform: "translate3d(calc(var(--drift-x) * -0.6), calc(var(--drift-y) * -0.6), 0) rotate(1.2deg)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={second.cardImage} alt={`${second.title} project material`} className="block h-auto w-full" />
              </Link>
            )}
            {signature && (
              <Link
                href={`/work/${signature.slug}`}
                className="absolute bottom-0 left-0 block w-[68%] overflow-hidden rounded-2xl shadow-[0_24px_60px_rgba(31,58,40,0.24)] transition-transform duration-500 hover:scale-[1.015]"
                style={{ transform: "translate3d(var(--drift-x), var(--drift-y), 0) rotate(-1.4deg)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={signature.cardImage} alt={`${signature.title} project material`} className="block h-auto w-full" />
                <span
                  className="absolute bottom-0 left-0 right-0 px-5 py-3 text-xs font-medium uppercase tracking-[0.15em] text-white"
                  style={{ background: "linear-gradient(0deg, rgba(27,27,27,0.65) 0%, transparent 100%)" }}
                >
                  {signature.title}
                </span>
              </Link>
            )}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
