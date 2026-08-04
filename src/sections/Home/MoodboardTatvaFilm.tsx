"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { elements, type Element } from "@/data/elements";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const EASE = [0.16, 1, 0.3, 1] as const;
const INK = "#22231F";
const PAPER = "#F4EFE6";
const CLAY = "#9D6B4C";

const transformations: Record<
  Element["slug"],
  { verb: string; before: string; after: string; consequence: string }
> = {
  earth: {
    verb: "Anchor",
    before: "Assumptions scattered beneath the business",
    after: "One position every later decision can stand on",
    consequence: "Every campaign starts by renegotiating who the brand is.",
  },
  water: {
    verb: "Carry",
    before: "Touchpoints behaving like unrelated encounters",
    after: "One expectation flowing through the whole journey",
    consequence: "Every platform teaches the customer a different version of you.",
  },
  fire: {
    verb: "Distinguish",
    before: "Category-safe expression that earns no second look",
    after: "A signal strong enough to interrupt habit",
    consequence: "Clarity stays invisible and attention goes to the louder alternative.",
  },
  air: {
    verb: "Translate",
    before: "Strategy understood only inside the business",
    after: "Language customers can repeat after the brand leaves",
    consequence: "Five channels develop five personalities and memory never settles.",
  },
  space: {
    verb: "Compound",
    before: "Isolated moments of attention",
    after: "Recognition accumulating across time",
    consequence: "Every launch pays again for awareness the last one failed to store.",
  },
};

function ActiveBackdrop({ element }: { element: Element }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useHydratedReducedMotion();
  const visible = useInView(wrapRef, { margin: "80px 0px 80px 0px" });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reduced || !visible) {
      video.pause();
      return;
    }
    void video.play().catch(() => {});
    return () => video.pause();
  }, [element.slug, reduced, visible]);

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden">
      <Image
        src={element.image}
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: element.imagePosition ?? "center" }}
      />
      {!reduced && element.video ? (
        <video
          ref={videoRef}
          key={element.video}
          src={element.video}
          poster={element.image}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: element.imagePosition ?? "center" }}
        />
      ) : null}
    </div>
  );
}

function TatvaDiagram({ slug, color }: { slug: Element["slug"]; color: string }) {
  if (slug === "earth") {
    return (
      <div className="relative h-full w-full" aria-hidden="true">
        {[0, 1, 2, 3].map((index) => (
          <motion.div
            key={index}
            className="absolute inset-x-[8%] rounded-[50%] border"
            style={{
              bottom: `${9 + index * 18}%`,
              height: "36%",
              borderColor: `${color}${48 + index * 10}`,
            }}
            initial={{ y: 54, scaleX: 1.28 }}
            animate={{ y: 0, scaleX: 1 }}
            transition={{ duration: 0.9, delay: index * 0.07, ease: EASE }}
          />
        ))}
        <motion.div
          className="absolute bottom-[10%] left-1/2 top-[12%] w-px"
          style={{ backgroundColor: color }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.05, ease: EASE }}
        />
      </div>
    );
  }

  if (slug === "water") {
    return (
      <div className="relative h-full w-full overflow-hidden" aria-hidden="true">
        {[0, 1, 2, 3].map((index) => (
          <motion.div
            key={index}
            className="absolute left-[-16%] w-[132%] rounded-[50%] border"
            style={{
              top: `${14 + index * 20}%`,
              height: "27%",
              borderColor: `${color}${62 - index * 8}`,
            }}
            animate={{ x: index % 2 ? [28, -24, 28] : [-26, 24, -26] }}
            transition={{ duration: 8 + index, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>
    );
  }

  if (slug === "fire") {
    return (
      <motion.div
        className="relative mx-auto h-full max-h-[25rem] w-full max-w-[25rem]"
        aria-hidden="true"
        animate={{ rotate: [-4, 4, -4], scale: [0.96, 1.04, 0.96] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        {[0, 1, 2, 3, 4].map((index) => (
          <span
            key={index}
            className="absolute left-1/2 top-1/2 h-[58%] w-[18%] origin-bottom -translate-x-1/2 -translate-y-full rounded-[50%_50%_35%_35%] border"
            style={{
              rotate: `${index * 72}deg`,
              borderColor: `${color}${40 + index * 8}`,
            }}
          />
        ))}
      </motion.div>
    );
  }

  if (slug === "air") {
    return (
      <motion.div
        className="relative h-full w-full"
        aria-hidden="true"
        animate={{ y: [28, -22, 28] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        {[14, 30, 48, 67, 82].map((top, index) => (
          <span
            key={top}
            className="absolute h-px rounded-full"
            style={{
              top: `${top}%`,
              left: `${7 + index * 7}%`,
              width: `${58 + index * 5}%`,
              background: `linear-gradient(90deg, transparent, ${color}BB, transparent)`,
            }}
          />
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="relative mx-auto h-full max-h-[27rem] w-full max-w-[27rem]"
      aria-hidden="true"
      animate={{ rotate: 360 }}
      transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
    >
      {[18, 31, 46, 64, 82].map((size, index) => (
        <span
          key={size}
          className="absolute left-1/2 top-1/2 rounded-full border"
          style={{
            width: `${size}%`,
            height: `${size}%`,
            transform: "translate(-50%, -50%)",
            borderColor: `${color}${30 + index * 10}`,
          }}
        />
      ))}
      <span
        className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 48px ${color}` }}
      />
    </motion.div>
  );
}

function StaticTatvas() {
  return (
    <section className="film-paper bg-[#F4EFE6] py-24 text-[#22231F] sm:py-32">
      <div className="mx-auto max-w-[94rem] px-6 sm:px-10">
        <div className="film-reveal max-w-4xl">
          <p className="text-[0.6rem] uppercase tracking-[0.3em] text-[#9D6B4C]">
            The five Tatvas
          </p>
          <h2 className="mt-5 font-display text-[clamp(3.3rem,7vw,6.8rem)] leading-[0.9] tracking-[-0.05em]">
            Five decisions. One remembered brand.
          </h2>
        </div>

        <div className="mt-12 space-y-6">
          {elements.map((element, index) => {
            const change = transformations[element.slug];
            return (
              <article
                key={element.slug}
                className="film-reveal relative overflow-hidden rounded-[1.8rem] border border-[#22231F]/10 bg-[#EAE1D4]/70 p-6 sm:p-8"
              >
                <div className="grid gap-8 sm:grid-cols-[0.84fr_1.16fr] sm:items-center">
                  <div>
                    <p
                      className="text-[0.54rem] uppercase tracking-[0.22em]"
                      style={{ color: element.color }}
                    >
                      Tatva {String(index + 1).padStart(2, "0")} · {change.verb}
                    </p>
                    <h3 className="mt-4 font-display text-5xl leading-none">
                      {element.name.split(" · ")[0]}.
                    </h3>
                    <p className="mt-5 text-sm leading-relaxed text-[#22231F]/58">
                      {element.meaning}
                    </p>
                  </div>
                  <div className="grid gap-5">
                    <div>
                      <p className="text-[0.52rem] uppercase tracking-[0.18em] text-[#22231F]/34">
                        Before
                      </p>
                      <p className="mt-2 font-display text-2xl leading-tight text-[#22231F]/58">
                        {change.before}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-[0.52rem] uppercase tracking-[0.18em]"
                        style={{ color: element.color }}
                      >
                        After
                      </p>
                      <p className="mt-2 font-display text-2xl leading-tight">
                        {change.after}
                      </p>
                    </div>
                    <p className="border-t border-[#22231F]/9 pt-4 text-xs leading-relaxed text-[#22231F]/48">
                      <span className="text-[#22231F]/74">
                        Without {element.name.split(" · ")[0]}:
                      </span>{" "}
                      {change.consequence}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function MoodboardTatvaFilm() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useHydratedReducedMotion();
  const compact = useMediaQuery("(max-width: 767px), (max-height: 660px)");
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.25,
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (reduced || compact) return;
    const next = Math.min(
      elements.length - 1,
      Math.floor(Math.min(0.999, value) * elements.length),
    );
    setActiveIndex(next);
  });

  if (reduced || compact) return <StaticTatvas />;

  const active = elements[activeIndex] ?? elements[0];
  const change = transformations[active.slug];

  return (
    <section ref={ref} className="relative h-[430svh] bg-[#1E2A22] text-[#22231F]">
      <div className="sticky top-0 h-svh min-h-[680px] overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={active.slug}
            className="absolute inset-0"
            initial={{ opacity: 0.16, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.14, scale: 1.035 }}
            transition={{ duration: 0.82, ease: EASE }}
          >
            <ActiveBackdrop element={active} />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(244,239,230,.96)_0%,rgba(244,239,230,.88)_43%,rgba(244,239,230,.24)_72%,rgba(24,34,28,.48)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(244,239,230,.18),transparent_42%,rgba(24,34,28,.36))]" />

        <div className="absolute inset-x-6 top-7 z-30 flex items-center justify-between text-[0.52rem] uppercase tracking-[0.22em] sm:inset-x-10 lg:inset-x-14">
          <span className="text-[#22231F]/46">The five Tatvas</span>
          <span className="text-[#22231F]/46">
            {String(activeIndex + 1).padStart(2, "0")} / 05
          </span>
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-[94rem] items-center px-6 sm:px-10 lg:px-14">
          <div className="grid w-full gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-16">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${active.slug}-copy`}
                initial={{ opacity: 0.22, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0.18, y: -24 }}
                transition={{ duration: 0.62, ease: EASE }}
              >
                <p
                  className="text-[0.58rem] font-medium uppercase tracking-[0.28em]"
                  style={{ color: active.color }}
                >
                  {change.verb}
                </p>
                <h2 className="mt-5 font-display text-[clamp(4.7rem,10vw,10rem)] font-normal leading-[0.78] tracking-[-0.07em]">
                  {active.name.split(" · ")[0].toLowerCase()}.
                </h2>
                <p className="mt-8 max-w-xl font-display text-[clamp(2rem,3.7vw,3.9rem)] leading-[1.02]">
                  {active.poetic}
                </p>
                <p className="mt-6 max-w-xl text-sm leading-relaxed text-[#22231F]/58 sm:text-base">
                  {active.meaning}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="grid gap-7 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div className="relative h-[20rem] overflow-hidden rounded-[1.8rem] border border-[#22231F]/10 bg-[#F5F0E8]/66 p-5 backdrop-blur-xl sm:h-[25rem]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`${active.slug}-diagram`}
                    className="h-full w-full"
                    initial={{ opacity: 0.2, scale: 0.91 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0.18, scale: 1.06 }}
                    transition={{ duration: 0.64, ease: EASE }}
                  >
                    <TatvaDiagram slug={active.slug} color={active.color} />
                  </motion.div>
                </AnimatePresence>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${active.slug}-change`}
                  initial={{ opacity: 0.22, x: 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0.18, x: -18 }}
                  transition={{ duration: 0.52, ease: EASE }}
                  className="rounded-[1.5rem] border border-[#22231F]/10 bg-[#F5F0E8]/72 p-5 backdrop-blur-xl sm:p-6"
                >
                  <div>
                    <p className="text-[0.52rem] uppercase tracking-[0.18em] text-[#22231F]/34">
                      Before
                    </p>
                    <p className="mt-3 font-display text-2xl leading-tight text-[#22231F]/58">
                      {change.before}
                    </p>
                  </div>
                  <div className="mt-6">
                    <p
                      className="text-[0.52rem] uppercase tracking-[0.18em]"
                      style={{ color: active.color }}
                    >
                      After
                    </p>
                    <p className="mt-3 font-display text-2xl leading-tight">
                      {change.after}
                    </p>
                  </div>
                  <p className="mt-6 border-t border-[#22231F]/9 pt-5 text-xs leading-relaxed text-[#22231F]/48">
                    <span className="text-[#22231F]/74">
                      Without {active.name.split(" · ")[0]}:
                    </span>{" "}
                    {change.consequence}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-6 bottom-6 z-30 sm:inset-x-10 lg:inset-x-14">
          <div className="mb-4 flex items-center justify-between gap-3">
            {elements.map((element, index) => (
              <span
                key={element.slug}
                className={`text-[0.48rem] uppercase tracking-[0.13em] transition-opacity ${
                  index === activeIndex ? "opacity-100" : "opacity-30"
                }`}
                style={{ color: index === activeIndex ? element.color : INK }}
              >
                {String(index + 1).padStart(2, "0")} {element.name.split(" · ")[0]}
              </span>
            ))}
          </div>
          <div className="h-px bg-[#22231F]/12">
            <motion.div
              className="h-full origin-left bg-[#9D6B4C]"
              style={{ scaleX: progress }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
