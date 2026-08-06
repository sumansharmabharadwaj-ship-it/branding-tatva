"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { track } from "@/lib/analytics";

const STATES = [
  { id: "idea", label: "I am building from an idea", need: "Positioning decided before anything gets designed, so every later choice inherits a direction.", path: "Foundation", pathNote: "The starting package: discovery, positioning, core identity.", proof: { slug: "myshopineurope", line: "MyShopInEurope began with the same decision: a complete brand foundation, with positioning settled around craft and origin before the platform sold a thing." } },
  { id: "inconsistent", label: "My brand exists but feels inconsistent", need: "One system aligning what already exists, so every channel says the same thing.", path: "Full Brand System", pathNote: "Audit, repositioning, and voice alignment across channels.", proof: { slug: "herbalcart", line: "HerbalCart got a full campaign reset built on one repositioning: public perception moved from herbal supplement toward a modern wellness brand." } },
  { id: "outgrown", label: "The business has grown beyond its current position", need: "A position that matches what the business has become, then an identity that carries it.", path: "Full Brand System", pathNote: "A full audit and repositioning, built for where the business is heading.", proof: { slug: "dr-haley-nutrition", line: "Dr. Haley Nutrition sharpened its position and posted less: engagement climbed from 0.71% to 2.81%, and every post earned 104% more followers." } },
] as const;

export const SITUATION_KEY = "bt-situation";
const AUTO_ROTATE_MS = 7200;
const MANUAL_PAUSE_MS = 20000;

export function VisitorRecognition() {
  const [selected, setSelected] = useState<string>(STATES[0].id);
  const manualPauseUntilRef = useRef(0);
  const prefersReducedMotion = useHydratedReducedMotion();

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SITUATION_KEY);
      if (saved && STATES.some((state) => state.id === saved)) {
        setSelected(saved);
        manualPauseUntilRef.current = Date.now() + MANUAL_PAUSE_MS;
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      if (Date.now() < manualPauseUntilRef.current) return;
      setSelected((current) => {
        const currentIndex = Math.max(0, STATES.findIndex((state) => state.id === current));
        return STATES[(currentIndex + 1) % STATES.length].id;
      });
    }, AUTO_ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [prefersReducedMotion]);

  function pauseAutoplay(duration = MANUAL_PAUSE_MS) { manualPauseUntilRef.current = Date.now() + duration; }
  function pick(id: string) {
    pauseAutoplay();
    setSelected(id);
    track("visitor_situation_selected", { situation: id, page: "home" });
    try { window.localStorage.setItem(SITUATION_KEY, id); } catch {}
  }

  const activeIndex = Math.max(0, STATES.findIndex((state) => state.id === selected));
  const active = STATES[activeIndex];

  return (
    <section className="relative overflow-hidden bg-soil py-16 sm:py-24" onPointerEnter={() => pauseAutoplay(9000)} onFocusCapture={() => pauseAutoplay()}>
      <motion.div aria-hidden="true" className="pointer-events-none absolute -left-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(212,185,154,0.15), transparent 68%)" }} animate={prefersReducedMotion ? undefined : { x: [0, 72, 0], y: [0, -28, 0], scale: [1, 1.15, 1] }} transition={prefersReducedMotion ? undefined : { duration: 15, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div aria-hidden="true" className="pointer-events-none absolute -right-40 top-[12%] h-[28rem] w-[28rem] rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(92,107,74,0.18), transparent 70%)" }} animate={prefersReducedMotion ? undefined : { x: [0, -64, 0], y: [0, 38, 0], scale: [1.05, 0.94, 1.05] }} transition={prefersReducedMotion ? undefined : { duration: 18, repeat: Infinity, ease: "easeInOut" }} />

      <Container className="relative max-w-5xl">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Where you stand</p>
          <h2 className="mt-2 max-w-2xl text-display-sm font-display font-normal text-ivory">The first useful answer is where the brand is losing coherence.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ivory/65 sm:text-base">Watch the three starting points unfold, or choose yours. Each one reveals the strategic gap, the right intervention, and a real project that faced it.</p>
        </Reveal>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {STATES.map((state, index) => {
            const isActive = selected === state.id;
            return (
              <Reveal key={state.id} delay={index * 0.07}>
                <motion.button type="button" aria-pressed={isActive} onClick={() => pick(state.id)} onPointerEnter={() => pauseAutoplay(9000)} className={`relative h-full min-h-32 w-full overflow-hidden rounded-2xl border p-5 text-left transition-colors duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone sm:p-6 ${isActive ? "border-sandstone/60 bg-ivory/[0.09] text-ivory" : "border-ivory/15 bg-ivory/[0.03] text-ivory/82 hover:border-ivory/35 hover:bg-ivory/[0.06]"}`} animate={prefersReducedMotion ? undefined : { y: isActive ? -6 : 0, scale: isActive ? 1.025 : 1 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
                  <span className="text-[0.62rem] font-medium tracking-[0.18em] text-sandstone/75">{String(index + 1).padStart(2, "0")}</span>
                  <span className="mt-3 block font-display text-lg font-normal leading-snug sm:text-xl">{state.label}</span>
                  <span className="absolute inset-x-5 bottom-4 h-px overflow-hidden bg-ivory/12">
                    {isActive && <motion.span key={`${selected}-${state.id}`} className="block h-full origin-left bg-sandstone" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: prefersReducedMotion ? 0 : AUTO_ROTATE_MS / 1000, ease: "linear" }} />}
                  </span>
                </motion.button>
              </Reveal>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={active.id} initial={prefersReducedMotion ? undefined : { opacity: 0, y: 14, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8, filter: "blur(4px)" }} transition={{ duration: prefersReducedMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }} className="mt-8 overflow-hidden rounded-2xl border border-ivory/12 p-6 backdrop-blur-md sm:p-8" style={{ backgroundColor: "rgba(244,239,230,0.055)" }} aria-live="polite">
            <div className="grid gap-7 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
              <div>
                <p className="max-w-2xl text-base leading-relaxed text-ivory/92">{active.need}</p>
                <p className="mt-4 text-sm leading-relaxed text-ivory/68">The path for this: <span className="font-medium text-ivory">{active.path}</span>. {active.pathNote}</p>
                <div className="mt-5 border-l-2 border-sandstone/50 pl-4"><p className="text-xs font-medium uppercase tracking-[0.15em] text-ivory/55">Recorded proof</p><p className="mt-1 max-w-2xl text-sm leading-relaxed text-ivory/85">{active.proof.line}</p></div>
              </div>
              <div className="relative min-h-36 rounded-2xl border border-ivory/10 bg-soil/35 p-5">
                <p className="text-[0.62rem] font-medium uppercase tracking-[0.18em] text-sandstone">The movement</p>
                <div className="mt-5 flex items-center gap-2 text-[0.66rem] uppercase tracking-[0.12em] text-ivory/60"><span>Signal</span><motion.span aria-hidden="true" className="h-px flex-1 origin-left bg-sandstone/55" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: prefersReducedMotion ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }} /><span>Decision</span><motion.span aria-hidden="true" className="h-px flex-1 origin-left bg-sandstone/55" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: prefersReducedMotion ? 0 : 1.1, delay: prefersReducedMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }} /><span>System</span></div>
                <p className="mt-6 font-display text-2xl leading-tight text-ivory">{active.path}</p>
                <p className="mt-2 text-xs leading-relaxed text-ivory/55">The smallest coherent intervention that can make the next decisions easier.</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              <Link href={`/work/${active.proof.slug}`} className="inline-flex items-center gap-2 text-sm font-medium text-sandstone underline decoration-sandstone/40 underline-offset-4 transition-colors hover:text-ivory">See the decisions behind the result <span aria-hidden="true">→</span></Link>
              <Link href="/services" className="inline-flex items-center gap-2 text-sm font-medium text-sandstone underline decoration-sandstone/40 underline-offset-4 transition-colors hover:text-ivory">Explore the right service path <span aria-hidden="true">→</span></Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  );
}
