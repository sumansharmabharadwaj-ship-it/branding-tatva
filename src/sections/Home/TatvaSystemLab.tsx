"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/Container";
import { TatvaMechanism } from "./TatvaMechanism";

const FORCES = [
  {
    name: "Prithvi",
    role: "Foundation",
    color: "#C77752",
    mechanism: "Position held",
    contribution:
      "Foundation holds category, audience, belief and position in one durable decision system.",
    reading:
      "Clear strategic layers give every later expression a stable place to stand.",
  },
  {
    name: "Jal",
    role: "Flow",
    color: "#6F9B95",
    mechanism: "Experience connected",
    contribution:
      "Flow connects offers and touchpoints into one recognisable brand experience.",
    reading:
      "A continuous journey helps each encounter strengthen the meaning formed before it.",
  },
  {
    name: "Agni",
    role: "Distinction",
    color: "#D8A251",
    mechanism: "Attention shaped",
    contribution:
      "Distinction gives the right audience a clear reason to notice and remember.",
    reading:
      "A focused creative spark turns strategic difference into visible and verbal cues.",
  },
  {
    name: "Vayu",
    role: "Voice",
    color: "#A7AF87",
    mechanism: "Meaning carried",
    contribution:
      "A repeatable voice helps people carry the brand clearly beyond the first encounter.",
    reading:
      "A consistent verbal rhythm lets ideas travel through channels while keeping their character.",
  },
  {
    name: "Akash",
    role: "Recognition",
    color: "#C08A9E",
    mechanism: "Memory compounded",
    contribution:
      "Consistency turns repeated exposure into familiarity over time.",
    reading:
      "Shared rules create the space where repeated assets become familiar memory structures.",
  },
] as const;

export function TatvaSystemLab() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(sectionRef, { amount: 0.28 });
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const focused = focusedIndex === null ? null : FORCES[focusedIndex];
  const motionActive = inView && !prefersReducedMotion;

  useEffect(() => {
    function onChapter(event: Event) {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      if (detail?.id !== "framework") return;
      setFocusedIndex(null);
    }

    window.addEventListener("bt:home-chapter", onChapter as EventListener);
    return () => window.removeEventListener("bt:home-chapter", onChapter as EventListener);
  }, []);

  function choose(index: number | null) {
    setFocusedIndex((current) => (index !== null && current === index ? null : index));
  }

  return (
    <section
      ref={sectionRef}
      className="tatva-pressure-lab relative overflow-hidden border-t py-20 sm:py-28"
      data-media-id="BT-HOME-FIVE-TATVAS-MASTER-V2"
      style={{ backgroundColor: "#111A18", borderColor: "rgba(244,239,230,0.08)" }}
      aria-labelledby="tatva-system-lab-title"
    >
      <div className="tatva-pressure-lab__film" aria-hidden="true">
        <video
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          poster="/images/pexels-golden-fog-sea-poster.jpg"
        >
          <source src="/videos/pexels-golden-fog-sea.webm" type="video/webm" />
          <source src="/videos/pexels-golden-fog-sea.mp4" type="video/mp4" />
        </video>
        <span />
      </div>

      <Container className="relative max-w-[94rem]">
        <div className="grid gap-10 lg:grid-cols-[minmax(22rem,0.86fr)_minmax(34rem,1.14fr)] lg:items-center lg:gap-16">
          <div className="tatva-pressure-lab__copy">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#D4B99A]">
              Five strategic mechanisms
            </p>
            <h2
              id="tatva-system-lab-title"
              className="mt-3 max-w-xl font-display text-[clamp(2.35rem,4.5vw,4.5rem)] font-normal leading-[1.02] tracking-[-0.02em]"
            >
              Focus one force. See the work it carries.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 sm:text-base sm:leading-8">
              Each Tatva contributes through its own mechanism. Together they show
              how strategy becomes recognition.
            </p>

            <div className="tatva-pressure-lab__controls mt-7 grid gap-2 sm:grid-cols-2" role="group" aria-label="Five Tatva mechanisms">
              {FORCES.map((force, index) => {
                const active = focusedIndex === index;
                return (
                  <button
                    key={force.name}
                    type="button"
                    aria-pressed={active}
                    onClick={() => choose(index)}
                    className="tatva-pressure-lab__force group flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-left transition-[border-color,background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
                    style={{
                      borderColor: active ? `${force.color}99` : "rgba(244,239,230,0.12)",
                      backgroundColor: active ? `${force.color}1A` : "rgba(244,239,230,0.035)",
                      boxShadow: active ? `0 16px 44px ${force.color}13` : "none",
                    }}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className="h-2.5 w-2.5 rounded-full transition-transform duration-300 group-hover:scale-125"
                        style={{
                          backgroundColor: force.color,
                          border: `1px solid ${force.color}`,
                          boxShadow: active ? `0 0 14px ${force.color}99` : "none",
                        }}
                      />
                      <span>
                        <span className="block font-display text-lg leading-none">{force.name}</span>
                        <span className="mt-1 block text-[0.58rem] font-medium uppercase tracking-[0.14em]">
                          {force.role}
                        </span>
                      </span>
                    </span>
                    <span
                      className="text-[0.55rem] font-medium uppercase tracking-[0.14em]"
                      style={{ color: active ? force.color : "rgba(244,239,230,0.42)" }}
                    >
                      {active ? "In focus" : String(index + 1).padStart(2, "0")}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => choose(null)}
              className="tatva-pressure-lab__restore mt-4 text-xs font-medium uppercase tracking-[0.16em] underline underline-offset-4 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sandstone"
            >
              Show the complete system
            </button>
          </div>

          <div className="tatva-pressure-lab__board overflow-hidden rounded-[2rem] border p-4 backdrop-blur-xl sm:p-7">
            <div className="tatva-pressure-lab__board-top flex flex-wrap items-end justify-between gap-4 border-b pb-5">
              <div>
                <p className="text-[0.58rem] font-medium uppercase tracking-[0.18em]">
                  Active strategic mechanism
                </p>
                <motion.p
                  className="mt-2 font-display text-3xl leading-none sm:text-4xl"
                  animate={prefersReducedMotion ? undefined : { opacity: [0.72, 1], y: [3, 0] }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  {focused?.mechanism ?? "Five forces connected"}
                </motion.p>
              </div>
              <span className="tatva-pressure-lab__status rounded-full border px-3 py-2 text-[0.56rem] font-medium uppercase tracking-[0.14em]">
                {focused ? `${focused.name} · ${String((focusedIndex ?? 0) + 1).padStart(2, "0")} / 05` : "Complete system"}
              </span>
            </div>

            <div className="grid gap-6 pt-5 md:grid-cols-[minmax(17rem,1fr)_minmax(13rem,0.72fr)] md:items-center">
              <motion.div
                id="tatva-mechanism-panel"
                role="region"
                aria-label={focused ? `${focused.name}: ${focused.mechanism}` : "Complete five-Tatva system"}
                className="tatva-pressure-lab__diagram tatva-pressure-lab__mechanism relative mx-auto aspect-[4/3] w-full max-w-[36rem]"
                animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                <TatvaMechanism focusedIndex={focusedIndex} motionActive={motionActive} />
              </motion.div>

              <motion.div
                className="tatva-pressure-lab__reading rounded-2xl border p-5"
                style={{
                  borderColor: focused ? `${focused.color}77` : "rgba(143,162,131,0.32)",
                  background: focused
                    ? `radial-gradient(circle at 88% 4%, ${focused.color}20, transparent 44%), rgba(244,239,230,0.035)`
                    : "radial-gradient(circle at 88% 4%, rgba(143,162,131,0.16), transparent 44%), rgba(244,239,230,0.035)",
                }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
                aria-live="polite"
              >
                  <p
                    className="text-[0.58rem] font-medium uppercase tracking-[0.16em]"
                    style={{ color: focused?.color ?? "#9CAF91" }}
                  >
                    {focused ? `How ${focused.name} contributes` : "When all five contribute"}
                  </p>
                  <p className="mt-3 font-display text-2xl leading-tight">
                    {focused
                      ? focused.contribution
                      : "Each force carries a distinct job, then strengthens the same recognition system."}
                  </p>
                  <p className="mt-4 text-xs leading-relaxed">
                    {focused
                      ? focused.reading
                      : "Move through the five mechanisms to see how foundation, flow, distinction, voice and consistency work together."}
                  </p>
                  <Link
                    href="/services"
                    className="link-underline mt-5 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em]"
                    style={{ color: "#D4B99A" }}
                  >
                    Explore Brand Strategy &amp; Systems <span aria-hidden="true">→</span>
                  </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
