"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo, LogoMark, Sprig } from "@/components/Logo";
import { LinkButton } from "@/components/Button";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { projects } from "@/data/projects";
import { elements, type Element } from "@/data/elements";
import { process } from "@/data/process";
import { credentials } from "@/data/about";
import { faqs } from "@/data/faqs";
import { navigation, site } from "@/data/site";
import { track } from "@/lib/analytics";

const EASE = [0.16, 1, 0.3, 1] as const;
const SITUATION_KEY = "bt-situation";

const PALETTE = {
  cream: "#F4EFE6",
  paper: "#EAE1D4",
  sand: "#D4C2AA",
  forest: "#1E2A22",
  ink: "#22231F",
  moss: "#748067",
  clay: "#9D6B4C",
  gold: "#B4864C",
  stone: "#8E8578",
} as const;

const recognitionStates = [
  {
    id: "idea",
    number: "01",
    label: "We keep changing direction before anything settles",
    stage: "Building from an idea",
    symptom: "Possibility is doing the job positioning should be doing.",
    route: "Build the foundation",
    result: "One decision becomes the ground every identity, message, and launch inherits.",
    proof: "myshopineurope",
    accent: PALETTE.clay,
  },
  {
    id: "inconsistent",
    number: "02",
    label: "People see us, but every version feels different",
    stage: "An existing brand without one system",
    symptom: "Attention is arriving, but nothing stable is being stored in memory.",
    route: "Reposition the system",
    result: "Every channel begins reinforcing the same promise instead of introducing another personality.",
    proof: "herbalcart",
    accent: PALETTE.moss,
  },
  {
    id: "outgrown",
    number: "03",
    label: "The business has grown, but the brand still looks behind",
    stage: "A mature offer inside an earlier identity",
    symptom: "The market is meeting a version of the business that no longer exists.",
    route: "Bring the brand forward",
    result: "Position, expression, and experience catch up with the quality already present in the offer.",
    proof: "dr-haley-nutrition",
    accent: PALETTE.gold,
  },
] as const;

type SituationId = (typeof recognitionStates)[number]["id"];

const lenses = [
  {
    id: "notice",
    number: "01",
    title: "Notice",
    discipline: "Psychology",
    question: "What did attention choose before logic arrived?",
    catches: "Assumptions disguised as insight, and messaging that asks for trust before it has earned attention.",
    changes: "Positioning begins with observable behaviour rather than the founder's preferred description of the business.",
    accent: PALETTE.moss,
  },
  {
    id: "name",
    number: "02",
    title: "Name",
    discipline: "Literature",
    question: "Which words survive after the explanation disappears?",
    catches: "Generic category language, borrowed claims, and a voice that changes whenever the channel changes.",
    changes: "The brand gains one verbal centre that can travel without becoming repetitive.",
    accent: PALETTE.clay,
  },
  {
    id: "direct",
    number: "03",
    title: "Direct",
    discipline: "Film and content systems",
    question: "What should the audience see, feel, and do next?",
    catches: "Beautiful outputs with no sequence, no tension, and no believable destination.",
    changes: "Every asset becomes part of a journey rather than an isolated piece of content.",
    accent: PALETTE.gold,
  },
] as const;

type LensId = (typeof lenses)[number]["id"];

const servicePaths = [
  {
    id: "foundation",
    number: "01",
    title: "Build the foundation",
    body: "For founders starting with an idea, before the business has inherited a random identity by accident.",
    sequence: ["Question", "Position", "Identity", "Launch"],
    outcome: "A brand people can understand before they are asked to buy.",
    href: "/services#desire",
    accent: PALETTE.clay,
  },
  {
    id: "reposition",
    number: "02",
    title: "Reposition an existing brand",
    body: "For brands that feel unclear, inconsistent, or difficult to explain in one honest sentence.",
    sequence: ["Decode", "Refuse", "Align", "Signal"],
    outcome: "Recognition begins compounding instead of restarting on every channel.",
    href: "/services#situation",
    accent: PALETTE.moss,
  },
  {
    id: "continuity",
    number: "03",
    title: "Create ongoing consistency",
    body: "For brands that need content, judgement, and continuity without adding another disconnected layer.",
    sequence: ["Plan", "Create", "Learn", "Compound"],
    outcome: "Every new expression strengthens the same remembered meaning.",
    href: "/services#offerings",
    accent: PALETTE.gold,
  },
] as const;

const tatvaTransformations: Record<
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

function AmbientVideo({
  src,
  poster,
  position = "center",
  priority = false,
  className = "",
}: {
  src?: string;
  poster: string;
  position?: string;
  priority?: boolean;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const reduced = useHydratedReducedMotion();
  const near = useInView(wrapRef, { margin: "420px 0px 420px 0px" });

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduced) return;
    if (near) void video.play().catch(() => {});
    else video.pause();
  }, [near, reduced, src]);

  return (
    <div ref={wrapRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      <Image
        src={poster}
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: position }}
      />
      {!reduced && src ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload={priority ? "auto" : "metadata"}
          onCanPlay={() => setReady(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
          style={{ objectPosition: position }}
        />
      ) : null}
    </div>
  );
}

function HomeHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const light = !scrolled && !open;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-7 sm:pt-6">
        <div
          className={`mx-auto flex max-w-[94rem] items-center justify-between rounded-full border px-4 py-3 transition-all duration-500 sm:px-6 ${
            scrolled || open
              ? "border-soil/10 bg-[#F5F0E8]/92 text-soil shadow-[0_14px_50px_-28px_rgba(30,42,34,.42)] backdrop-blur-xl"
              : "border-white/16 bg-black/8 text-ivory backdrop-blur-sm"
          }`}
        >
          <Link href="/" className="flex items-center gap-3" aria-label="Branding Tatva home">
            <LogoMark size={34} light={light} />
            <span className={`hidden h-7 w-px min-[430px]:block ${light ? "bg-white/22" : "bg-soil/14"}`} aria-hidden="true" />
            <Logo light={light} className="hidden min-[430px]:inline-flex" />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
            {navigation
              .filter((item) => item.href !== "/" && item.href !== "/contact")
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-[0.66rem] font-medium uppercase tracking-[0.2em] transition-colors ${
                    light ? "text-ivory/78 hover:text-ivory" : "text-soil/62 hover:text-soil"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className={`hidden min-h-10 items-center rounded-full border px-5 text-[0.62rem] font-medium uppercase tracking-[0.18em] transition-all sm:inline-flex ${
                light
                  ? "border-white/28 bg-white/8 text-ivory hover:bg-white/16"
                  : "border-[#A47746]/35 bg-[#A47746] text-white hover:-translate-y-0.5"
              }`}
            >
              Start a project&nbsp; →
            </Link>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
                light ? "border-white/24 text-ivory" : "border-soil/12 text-soil"
              }`}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-0 z-40 bg-[#EDE5D8]/97 px-6 pb-10 pt-28 text-soil"
          >
            <div className="mx-auto flex h-full max-w-4xl flex-col justify-between">
              <nav aria-label="Menu" className="grid gap-1">
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 + index * 0.05, duration: 0.5, ease: EASE }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between border-b border-soil/10 py-4 font-display text-[clamp(2.4rem,8vw,5.4rem)] leading-none"
                    >
                      {item.label}
                      <span className="font-body text-xs uppercase tracking-[0.18em] text-soil/36">{String(index + 1).padStart(2, "0")}</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="flex flex-col gap-4 text-xs uppercase tracking-[0.18em] text-soil/46 sm:flex-row sm:justify-between">
                <span>{site.tagline}</span>
                <a href={`mailto:${site.email}`} className="text-soil/68">{site.email}</a>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function FilmProgress() {
  const reduced = useHydratedReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 130, damping: 28, mass: 0.22 });
  if (reduced) return null;

  return (
    <div className="pointer-events-none fixed right-5 top-1/2 z-40 hidden h-36 -translate-y-1/2 lg:block" aria-hidden="true">
      <div className="relative h-full w-px bg-soil/12">
        <motion.span className="absolute inset-0 origin-top bg-[#A47746]" style={{ scaleY }} />
      </div>
      <span className="absolute -left-5 -top-8 rotate-90 text-[0.5rem] uppercase tracking-[0.24em] text-soil/34">Film</span>
    </div>
  );
}

function BotanicalDivider({ label, dark = false }: { label: string; dark?: boolean }) {
  return (
    <div className={`relative isolate flex h-28 items-center overflow-hidden ${dark ? "bg-[#1E2A22] text-[#F4EFE6]" : "bg-[#F4EFE6] text-[#22231F]"}`} aria-hidden="true">
      <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-current/7" />
      <div className="mx-auto flex w-full max-w-[94rem] items-center gap-5 px-6 sm:px-10 lg:px-14">
        <span className="film-divider-line h-px flex-1 bg-current/12" />
        <Sprig className="h-9 w-5 opacity-38" />
        <span className="text-[0.54rem] uppercase tracking-[0.32em] opacity-46">{label}</span>
        <Sprig className="h-9 w-5 scale-x-[-1] opacity-38" />
        <span className="film-divider-line h-px flex-1 bg-current/12" />
      </div>
    </div>
  );
}

function DawnHero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useHydratedReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const cameraScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.16]);
  const cameraY = useTransform(scrollYProgress, [0, 1], [0, -48]);
  const firstOpacity = useTransform(scrollYProgress, [0, 0.38, 0.72], [1, 1, 0.14]);
  const firstY = useTransform(scrollYProgress, [0, 0.72], [0, -64]);
  const secondOpacity = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [0.12, 0.12, 1, 1]);
  const secondY = useTransform(scrollYProgress, [0.36, 0.72], [54, 0]);
  const frameInset = useTransform(
    scrollYProgress,
    [0, 0.58, 1],
    ["inset(0% 0% 0% 0% round 0px)", "inset(4% 4% 5% 4% round 26px)", "inset(9% 11% 11% 11% round 42px)"],
  );
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.24 });

  if (reduced) {
    return (
      <section className="relative min-h-svh overflow-hidden bg-[#1E2A22] text-ivory">
        <AmbientVideo
          src="/videos/higgsfield-himalayan-valley.mp4"
          poster="/images/higgsfield-himalayan-valley-poster.jpg"
          position="center 44%"
          priority
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,25,20,.76),rgba(17,25,20,.35)_58%,rgba(17,25,20,.2)),linear-gradient(180deg,rgba(17,25,20,.22),rgba(17,25,20,.72))]" />
        <div className="relative z-10 mx-auto flex min-h-svh max-w-[94rem] items-end px-6 pb-16 pt-32 sm:px-10 lg:px-14 lg:pb-20">
          <div className="max-w-5xl">
            <p className="text-[0.62rem] uppercase tracking-[0.3em] text-[#E1C89F]">Revealing essence. Creating impact.</p>
            <h1 className="mt-6 font-display text-[clamp(3.8rem,9vw,9rem)] font-normal leading-[0.86] tracking-[-0.055em]">
              We do not create brands.
              <span className="block italic text-[#E1C89F]">We reveal what is already true.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-sm leading-relaxed text-ivory/72 sm:text-base">Strategy, identity, voice, and experience shaped into one meaning people can recognise, trust, and remember.</p>
            <div className="mt-9 flex flex-wrap gap-4"><LinkButton href="/contact">Start with the real question</LinkButton><LinkButton href="/work" variant="secondary" className="border-ivory/28 text-ivory">See the evidence</LinkButton></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[190svh] bg-[#1E2A22] text-ivory">
      <div className="sticky top-0 h-svh min-h-[650px] overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: cameraScale, y: cameraY, clipPath: frameInset }}>
          <AmbientVideo
            src="/videos/higgsfield-himalayan-valley.mp4"
            poster="/images/higgsfield-himalayan-valley-poster.jpg"
            position="center 44%"
            priority
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,24,19,.82)_0%,rgba(16,24,19,.43)_54%,rgba(16,24,19,.18)_78%),linear-gradient(180deg,rgba(16,24,19,.18),transparent_42%,rgba(16,24,19,.7))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_30%,rgba(245,211,155,.22),transparent_30%)]" />
        </motion.div>

        <div className="film-sun-sweep pointer-events-none absolute -inset-y-24 left-[-28%] z-[2] w-[28%] rotate-[13deg] bg-gradient-to-b from-transparent via-[#F2D3A2]/20 to-transparent blur-3xl" aria-hidden="true" />

        <motion.div className="absolute inset-0 z-10 flex items-end px-6 pb-16 pt-32 sm:px-10 lg:px-14 lg:pb-20" style={{ opacity: firstOpacity, y: firstY }}>
          <div className="mx-auto w-full max-w-[94rem]">
            <p className="text-[0.6rem] uppercase tracking-[0.32em] text-[#E1C89F]">Revealing essence. Creating impact.</p>
            <h1 className="mt-6 max-w-6xl font-display text-[clamp(4rem,9.5vw,9.6rem)] font-normal leading-[0.84] tracking-[-0.06em]">
              We do not create brands.
              <span className="block italic text-[#E1C89F]">We reveal what is already true.</span>
            </h1>
            <div className="mt-8 flex max-w-5xl flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
              <p className="max-w-xl text-sm leading-relaxed text-ivory/72 sm:text-base">Strategy, identity, voice, and experience shaped into one meaning people can recognise, trust, and remember.</p>
              <div className="flex flex-wrap gap-4"><LinkButton href="/contact" trackEvent="hero_booking_click" trackProps={{ page: "home" }}>Start with the real question</LinkButton><LinkButton href="/work" variant="secondary" className="border-ivory/28 text-ivory hover:bg-ivory/10">See the evidence</LinkButton></div>
            </div>
          </div>
        </motion.div>

        <motion.div className="pointer-events-none absolute inset-0 z-20 flex items-center px-6 sm:px-10 lg:px-14" style={{ opacity: secondOpacity, y: secondY }}>
          <div className="mx-auto grid w-full max-w-[94rem] gap-10 lg:grid-cols-[1.08fr_.92fr] lg:items-end">
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.32em] text-[#E1C89F]">The first transformation</p>
              <p className="mt-6 max-w-5xl font-display text-[clamp(4rem,9vw,9rem)] font-normal leading-[0.84] tracking-[-0.06em]">
                Visibility becomes valuable only when it leaves a <span className="italic text-[#E1C89F]">memory.</span>
              </p>
            </div>
            <div className="lg:pb-3">
              <p className="text-sm leading-relaxed text-ivory/68 sm:text-base">Scroll into the system. Every scene explains how attention becomes recognition, and how recognition compounds into brand equity.</p>
            </div>
          </div>
        </motion.div>

        <div className="absolute right-6 top-1/2 z-30 hidden -translate-y-1/2 text-right lg:block">
          {['Strategy','Identity','Story','Experience','Growth'].map((word) => <p key={word} className="mb-4 text-[0.5rem] uppercase tracking-[0.3em] text-ivory/38">{word}</p>)}
        </div>

        <div className="absolute inset-x-6 bottom-5 z-30 flex items-center gap-4 sm:inset-x-10 lg:inset-x-14">
          <span className="text-[0.52rem] uppercase tracking-[0.22em] text-ivory/38">Essence</span>
          <div className="h-px flex-1 bg-ivory/14"><motion.div className="h-full origin-left bg-[#E1C89F]" style={{ scaleX: progress }} /></div>
          <span className="text-[0.52rem] uppercase tracking-[0.22em] text-ivory/38">Impact</span>
        </div>
      </div>
    </section>
  );
}

function MemoryGraph() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 36%"] });
  const draw = useSpring(scrollYProgress, { stiffness: 115, damping: 28, mass: 0.3 });

  return (
    <section ref={ref} className="film-paper relative overflow-hidden bg-[#F4EFE6] py-24 text-[#22231F] sm:py-32 lg:py-40">
      <div className="pointer-events-none absolute -right-20 top-10 h-96 w-96 rounded-full border border-[#22231F]/6" aria-hidden="true" />
      <div className="mx-auto grid max-w-[94rem] gap-12 px-6 sm:px-10 lg:grid-cols-[.88fr_1.12fr] lg:items-center lg:gap-16 lg:px-14">
        <div className="film-reveal">
          <p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-[#9D6B4C]">From visibility to remembrance</p>
          <h2 className="mt-5 max-w-3xl font-display text-[clamp(3.4rem,7vw,7rem)] font-normal leading-[0.9] tracking-[-0.05em]">Attention can spike. Recognition has to grow.</h2>
          <p className="mt-7 max-w-xl text-sm leading-relaxed text-[#22231F]/62 sm:text-base">A campaign can create a moment. A brand system stores that moment, repeats its meaning, and makes the next encounter easier to recognise.</p>
          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.4rem] border border-[#22231F]/10 bg-white/46 p-5"><p className="text-[0.54rem] uppercase tracking-[0.2em] text-[#22231F]/38">Without a system</p><p className="mt-3 font-display text-3xl leading-tight">Every launch starts from zero.</p></div>
            <div className="rounded-[1.4rem] border border-[#22231F]/10 bg-white/64 p-5"><p className="text-[0.54rem] uppercase tracking-[0.2em] text-[#9D6B4C]">With a system</p><p className="mt-3 font-display text-3xl leading-tight">Every signal strengthens the last.</p></div>
          </div>
        </div>

        <div className="film-reveal relative overflow-hidden rounded-[2rem] border border-[#22231F]/10 bg-[#E9DFD0] p-5 shadow-[0_28px_80px_-50px_rgba(34,35,31,.45)] sm:p-7">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-[#1E2A22]">
            <AmbientVideo src="/videos/pixabay-stream-mist-rays.mp4" poster="/images/pixabay-stream-mist-rays-poster.jpg" position="center" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(30,42,34,.05),rgba(30,42,34,.42))]" />
            <div className="absolute inset-x-5 bottom-5 rounded-[1.2rem] border border-white/18 bg-[#F4EFE6]/86 p-4 text-[#22231F] backdrop-blur-xl sm:inset-x-7 sm:bottom-7 sm:p-5">
              <div className="mb-4 flex items-center justify-between text-[0.52rem] uppercase tracking-[0.18em] text-[#22231F]/42"><span>Motion graph</span><span>Attention → memory</span></div>
              <svg viewBox="0 0 720 260" className="w-full" role="img" aria-label="A graph comparing short attention spikes with steadily compounding recognition">
                <path d="M34 222 H686" stroke="#22231F" strokeOpacity="0.14" />
                <path d="M34 32 V222" stroke="#22231F" strokeOpacity="0.14" />
                {[80,140,200].map((y) => <path key={y} d={`M34 ${y} H686`} stroke="#22231F" strokeOpacity="0.06" strokeDasharray="4 9" />)}
                <path d="M38 208 C92 194 104 48 144 206 C190 186 204 72 244 204 C300 184 310 92 354 198 C418 178 430 112 474 190 C530 174 550 138 598 178 C634 168 654 160 682 154" fill="none" stroke="#8E8578" strokeOpacity="0.28" strokeWidth="3" strokeDasharray="8 10" />
                <motion.path d="M38 212 C120 205 146 196 208 184 C278 170 318 158 372 136 C434 112 488 102 536 76 C584 50 626 44 682 34" fill="none" stroke="#9D6B4C" strokeWidth="5" strokeLinecap="round" style={{ pathLength: draw }} />
                {[{x:38,y:212},{x:208,y:184},{x:372,y:136},{x:536,y:76},{x:682,y:34}].map((node,index) => <motion.circle key={node.x} cx={node.x} cy={node.y} r="7" fill="#F4EFE6" stroke="#9D6B4C" strokeWidth="4" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ amount: 0.5 }} transition={{ delay: .18 + index * .12, duration: .45, ease: EASE }} />)}
                <text x="46" y="248" fill="#22231F" fillOpacity="0.42" fontSize="18">first encounter</text>
                <text x="554" y="248" fill="#22231F" fillOpacity="0.42" fontSize="18">remembered choice</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RecognitionClearing() {
  const [selected, setSelected] = useState<SituationId>("idea");
  const active = recognitionStates.find((state) => state.id === selected) ?? recognitionStates[0];

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SITUATION_KEY) as SituationId | null;
      if (saved && recognitionStates.some((item) => item.id === saved)) setSelected(saved);
    } catch {}
  }, []);

  function choose(id: SituationId) {
    setSelected(id);
    try { window.localStorage.setItem(SITUATION_KEY, id); } catch {}
    track("visitor_situation_selected", { situation: id, page: "home" });
  }

  const points = Array.from({ length: 14 }, (_, index) => ({
    x: 30 + ((index * 47) % 240),
    y: 28 + ((index * 71) % 150),
  }));

  return (
    <section className="film-paper relative overflow-hidden bg-[#EAE1D4] py-24 text-[#22231F] sm:py-32 lg:py-40">
      <div className="absolute -left-24 bottom-0 h-[34rem] w-[20rem] opacity-[0.08]" aria-hidden="true"><Sprig className="h-full w-full" /></div>
      <div className="mx-auto max-w-[94rem] px-6 sm:px-10 lg:px-14">
        <div className="film-reveal grid gap-9 lg:grid-cols-[.88fr_1.12fr] lg:items-end">
          <div><p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-[#9D6B4C]">Recognition arrives before explanation</p><h2 className="mt-5 max-w-4xl font-display text-[clamp(3.3rem,7vw,7rem)] font-normal leading-[0.9] tracking-[-0.05em]">Which sentence feels a little too familiar?</h2></div>
          <p className="max-w-xl text-sm leading-relaxed text-[#22231F]/60 sm:text-base lg:justify-self-end">Choose the line that catches first. The diagram shows what attention is doing, then the page carries that diagnosis into the service path.</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[.92fr_1.08fr]">
          <div className="film-reveal grid gap-3">
            {recognitionStates.map((state) => {
              const isActive = state.id === selected;
              return (
                <button key={state.id} type="button" onClick={() => choose(state.id)} aria-pressed={isActive} className={`group relative overflow-hidden rounded-[1.45rem] border p-5 text-left transition-all duration-500 sm:p-6 ${isActive ? "border-[#22231F]/22 bg-white/70 shadow-[0_20px_60px_-44px_rgba(34,35,31,.5)]" : "border-[#22231F]/8 bg-white/30 hover:bg-white/52"}`}>
                  <motion.span className="absolute inset-y-0 left-0 w-1 origin-bottom" style={{ backgroundColor: state.accent }} animate={{ scaleY: isActive ? 1 : .18 }} transition={{ duration: .5, ease: EASE }} />
                  <div className="flex gap-5 pl-3"><span className="pt-1 text-[0.54rem] uppercase tracking-[0.2em] text-[#22231F]/38">{state.number}</span><div><p className="text-[0.55rem] uppercase tracking-[0.18em]" style={{ color: state.accent }}>{state.stage}</p><p className="mt-3 font-display text-[clamp(1.7rem,3vw,2.8rem)] leading-[1.06]">“{state.label}”</p></div></div>
                </button>
              );
            })}
          </div>

          <div className="film-reveal relative overflow-hidden rounded-[1.8rem] border border-[#22231F]/10 bg-[#F5F0E8]/76 p-6 shadow-[0_24px_80px_-50px_rgba(34,35,31,.42)] sm:p-8">
            <div className="grid gap-8 md:grid-cols-[.9fr_1.1fr] md:items-center">
              <div className="relative aspect-square overflow-hidden rounded-full border border-[#22231F]/8 bg-white/42 p-5">
                <svg viewBox="0 0 300 210" className="h-full w-full" aria-hidden="true">
                  <circle cx="150" cy="105" r="78" fill="none" stroke="#22231F" strokeOpacity="0.08" />
                  <circle cx="150" cy="105" r="46" fill="none" stroke={active.accent} strokeOpacity="0.22" />
                  {points.map((point, index) => {
                    const targetX = selected === "idea" ? 86 + (index % 5) * 32 : selected === "inconsistent" ? 66 + (index % 7) * 30 : 150 + Math.cos(index * .9) * (32 + (index % 3) * 18);
                    const targetY = selected === "idea" ? 64 + Math.floor(index / 5) * 42 : selected === "inconsistent" ? 56 + (index % 2) * 94 : 105 + Math.sin(index * .9) * (32 + (index % 3) * 18);
                    return <motion.circle key={index} r={index === 0 ? 7 : 4.5} fill={index === 0 ? active.accent : "#22231F"} fillOpacity={index === 0 ? .9 : .36} animate={{ cx: targetX, cy: targetY }} initial={{ cx: point.x, cy: point.y }} transition={{ duration: .9, delay: index * .018, ease: EASE }} />;
                  })}
                  <motion.circle cx="150" cy="105" r="12" fill={active.accent} animate={{ scale: [1,1.35,1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
                </svg>
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={active.id} initial={{ opacity: .25, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: .2, y: -14 }} transition={{ duration: .48, ease: EASE }}>
                  <p className="text-[0.54rem] uppercase tracking-[0.2em] text-[#22231F]/38">What attention is doing</p>
                  <p className="mt-3 font-display text-3xl leading-tight sm:text-4xl">{active.symptom}</p>
                  <p className="mt-7 text-[0.54rem] uppercase tracking-[0.2em]" style={{ color: active.accent }}>The useful route</p>
                  <p className="mt-3 font-display text-3xl leading-tight sm:text-4xl">{active.route}</p>
                  <p className="mt-5 text-sm leading-relaxed text-[#22231F]/58">{active.result}</p>
                  <div className="mt-8 flex flex-wrap gap-3"><Link href={`/work/${active.proof}`} className="inline-flex min-h-11 items-center rounded-full bg-[#22231F] px-5 text-[0.6rem] font-medium uppercase tracking-[0.16em] text-[#F4EFE6]">See the proof ↗</Link><Link href="/services" className="inline-flex min-h-11 items-center rounded-full border border-[#22231F]/14 px-5 text-[0.6rem] font-medium uppercase tracking-[0.16em]">Trace the path →</Link></div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EvidenceFilm() {
  const featured = useMemo(() => projects.filter((project) => project.featured).slice(0, 3), []);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = featured[activeIndex] ?? featured[0];
  if (!active) return null;
  const stat = active.stats?.[0];

  return (
    <section className="film-paper relative overflow-hidden bg-[#F4EFE6] py-24 text-[#22231F] sm:py-32 lg:py-40">
      <div className="mx-auto max-w-[94rem] px-6 sm:px-10 lg:px-14">
        <div className="film-reveal grid gap-9 lg:grid-cols-[.82fr_1.18fr] lg:items-end">
          <div><p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-[#9D6B4C]">Proof before promise</p><h2 className="mt-5 max-w-4xl font-display text-[clamp(3.3rem,7vw,7rem)] font-normal leading-[0.9] tracking-[-0.05em]">The result is the last thing you should look at.</h2></div>
          <p className="max-w-xl text-sm leading-relaxed text-[#22231F]/60 sm:text-base lg:justify-self-end">Each case begins with the visible problem, moves through the diagnosis and decision, then earns the result instead of presenting it as a magic trick.</p>
        </div>

        <div className="film-reveal mt-12 overflow-hidden rounded-[2rem] border border-[#22231F]/10 bg-[#E9DFD0] p-4 sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[.82fr_1.18fr] lg:items-stretch">
            <div className="flex flex-col justify-between rounded-[1.55rem] bg-[#F5F0E8] p-6 sm:p-8">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={active.slug} initial={{ opacity: .25, y: 22 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: .2, y: -16 }} transition={{ duration: .52, ease: EASE }}>
                  <p className="text-[0.54rem] uppercase tracking-[0.22em] text-[#9D6B4C]">{active.industry}</p>
                  <h3 className="mt-5 font-display text-[clamp(3rem,6vw,6rem)] font-normal leading-[0.88] tracking-[-0.05em]">{active.title}</h3>
                  <p className="mt-6 text-sm leading-relaxed text-[#22231F]/60 sm:text-base">{active.hook ?? active.challenge}</p>
                  {stat ? <div className="mt-8 border-l-2 border-[#9D6B4C] pl-5"><p className="font-display text-5xl text-[#9D6B4C]">{stat.value}</p><p className="mt-1 text-xs leading-relaxed text-[#22231F]/50">{stat.label}</p></div> : null}
                  <Link href={`/work/${active.slug}`} className="mt-9 inline-flex min-h-11 items-center rounded-full bg-[#22231F] px-5 text-[0.6rem] font-medium uppercase tracking-[0.16em] text-[#F4EFE6]">Open the investigation ↗</Link>
                </motion.div>
              </AnimatePresence>

              <div className="mt-10 flex gap-2">
                {featured.map((project, index) => <button key={project.slug} type="button" onClick={() => setActiveIndex(index)} aria-label={`Show ${project.title}`} aria-pressed={index === activeIndex} className={`h-2 flex-1 rounded-full transition-colors ${index === activeIndex ? "bg-[#9D6B4C]" : "bg-[#22231F]/12"}`} />)}
              </div>
            </div>

            <div className="relative min-h-[28rem] overflow-hidden rounded-[1.55rem] bg-[#1E2A22] sm:min-h-[36rem]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div key={active.slug} className="absolute inset-0" initial={{ opacity: .18, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: .16, scale: 1.035 }} transition={{ duration: .75, ease: EASE }}>
                  {active.cardImage ? <Image src={active.cardImage} alt="" fill sizes="(min-width:1024px) 58vw, 100vw" className="object-cover" style={{ objectPosition: active.cardImagePosition ?? "center" }} /> : null}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_36%,rgba(17,23,19,.72))]" />
                  <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-6 text-[#F4EFE6] sm:inset-x-8 sm:bottom-8"><div><p className="text-[0.52rem] uppercase tracking-[0.2em] text-[#F4EFE6]/54">The evidence film</p><p className="mt-2 font-display text-3xl">{active.title}</p></div><span className="rounded-full border border-white/24 bg-black/18 px-4 py-2 text-[0.52rem] uppercase tracking-[0.16em] backdrop-blur-md">Case {String(activeIndex + 1).padStart(2,"0")}</span></div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LensDiagram({ id, accent }: { id: LensId; accent: string }) {
  if (id === "notice") {
    return <svg viewBox="0 0 320 230" className="h-full w-full" aria-hidden="true">{[38,68,98].map((r,index)=><motion.circle key={r} cx="160" cy="115" r={r} fill="none" stroke={accent} strokeOpacity={.22 + index*.12} strokeWidth="2" initial={{ pathLength:.08 }} whileInView={{ pathLength:1 }} viewport={{ amount:.4 }} transition={{ duration:1.15+index*.2,ease:EASE }}/>) }<motion.circle cx="160" cy="115" r="9" fill={accent} animate={{ scale:[1,1.5,1] }} transition={{ duration:3,repeat:Infinity,ease:"easeInOut" }}/></svg>;
  }
  if (id === "name") {
    return <svg viewBox="0 0 320 230" className="h-full w-full" aria-hidden="true">{[0,1,2,3,4].map((index)=><motion.line key={index} x1={36+index*16} y1={50+index*32} x2={284-index*20} y2={50+index*32} stroke={accent} strokeWidth={index===2?5:2} strokeLinecap="round" initial={{ pathLength:.05,opacity:.18 }} whileInView={{ pathLength:1,opacity:.76 }} viewport={{ amount:.4 }} transition={{ duration:1,delay:index*.08,ease:EASE }}/>) }<motion.circle cx="160" cy="114" r="32" fill="none" stroke={accent} strokeWidth="2" initial={{ scale:1.5,opacity:0 }} whileInView={{ scale:1,opacity:.7 }} viewport={{ amount:.4 }} transition={{ duration:1.1,ease:EASE }}/></svg>;
  }
  return <svg viewBox="0 0 320 230" className="h-full w-full" aria-hidden="true"><motion.path d="M24 178 C86 178 86 48 154 48 C222 48 218 178 296 178" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" initial={{ pathLength:.04 }} whileInView={{ pathLength:1 }} viewport={{ amount:.4 }} transition={{ duration:1.55,ease:EASE }}/>{[{x:24,y:178},{x:90,y:90},{x:154,y:48},{x:224,y:92},{x:296,y:178}].map((node,index)=><motion.circle key={node.x} cx={node.x} cy={node.y} r="7" fill={accent} initial={{ scale:0 }} whileInView={{ scale:1 }} viewport={{ amount:.4 }} transition={{ delay:.18+index*.12,duration:.42,ease:EASE }}/>)}</svg>;
}

function AuthorLenses() {
  const [activeId, setActiveId] = useState<LensId>("notice");
  const active = lenses.find((lens) => lens.id === activeId) ?? lenses[0];
  const featuredCredentials = credentials.filter((credential) => credential.featured);

  function choose(id: LensId) {
    setActiveId(id);
    track("home_author_lens_selected", { lens: id, page: "home" });
  }

  return (
    <section className="film-paper relative overflow-hidden bg-[#EAE1D4] py-24 text-[#22231F] sm:py-32 lg:py-40">
      <div className="mx-auto grid max-w-[94rem] gap-12 px-6 sm:px-10 lg:grid-cols-[1.06fr_.94fr] lg:items-stretch lg:gap-8 lg:px-14">
        <div className="film-reveal flex flex-col justify-between rounded-[2rem] border border-[#22231F]/10 bg-[#F5F0E8]/74 p-6 sm:p-8 lg:p-10">
          <div>
            <p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-[#9D6B4C]">The author behind the system</p>
            <h2 className="mt-5 max-w-4xl font-display text-[clamp(3.5rem,7vw,7.4rem)] font-normal leading-[0.88] tracking-[-0.055em]">I study attention before I design <span className="italic text-[#9D6B4C]">expression.</span></h2>
            <p className="mt-7 max-w-2xl text-sm leading-relaxed text-[#22231F]/60 sm:text-base">Psychology reads behaviour. Literature gives meaning a voice. Direction decides what the audience should experience next.</p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-[.86fr_1.14fr] md:items-center">
            <div className="h-60 rounded-[1.45rem] border border-[#22231F]/8 bg-white/42 p-4 sm:h-72"><AnimatePresence mode="wait" initial={false}><motion.div key={active.id} className="h-full" initial={{ opacity:.2,scale:.92 }} animate={{ opacity:1,scale:1 }} exit={{ opacity:.18,scale:1.06 }} transition={{ duration:.55,ease:EASE }}><LensDiagram id={active.id} accent={active.accent} /></motion.div></AnimatePresence></div>
            <AnimatePresence mode="wait" initial={false}><motion.div key={`${active.id}-copy`} initial={{ opacity:.2,x:22 }} animate={{ opacity:1,x:0 }} exit={{ opacity:.18,x:-16 }} transition={{ duration:.48,ease:EASE }}><p className="text-[0.54rem] uppercase tracking-[0.2em]" style={{ color: active.accent }}>{active.number} · {active.discipline}</p><p className="mt-3 font-display text-5xl leading-none">{active.title}.</p><p className="mt-5 font-display text-2xl leading-tight sm:text-3xl">{active.question}</p><div className="mt-6 grid gap-4 text-sm leading-relaxed text-[#22231F]/56"><p><span className="font-medium text-[#22231F]/78">It catches:</span> {active.catches}</p><p><span className="font-medium text-[#22231F]/78">It changes:</span> {active.changes}</p></div></motion.div></AnimatePresence>
          </div>

          <div className="mt-9 flex flex-wrap gap-2" role="tablist" aria-label="Choose a working lens">
            {lenses.map((lens)=><button key={lens.id} type="button" role="tab" aria-selected={active.id===lens.id} onClick={()=>choose(lens.id)} className={`min-h-11 rounded-full border px-5 text-[0.58rem] font-medium uppercase tracking-[0.16em] transition-all ${active.id===lens.id?"border-[#22231F] bg-[#22231F] text-[#F4EFE6]":"border-[#22231F]/12 bg-white/28 text-[#22231F]/58 hover:bg-white/62"}`}>{lens.title}</button>)}
          </div>
        </div>

        <div className="film-reveal relative min-h-[44rem] overflow-hidden rounded-[2rem] border border-[#22231F]/10 bg-[#1E2A22]">
          <Image src="/images/own-portrait.jpg" alt="Suman Sharma, founder of Branding Tatva" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" style={{ objectPosition:"center 24%" }} />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(30,42,34,.04),rgba(30,42,34,.16)_44%,rgba(30,42,34,.82))]" />
          <motion.div className="absolute -right-20 top-8 h-80 w-80 rounded-full border border-white/12" animate={{ rotate:360 }} transition={{ duration:44,repeat:Infinity,ease:"linear" }} aria-hidden="true" />
          <div className="absolute inset-x-6 bottom-6 rounded-[1.4rem] border border-white/16 bg-black/20 p-5 text-[#F4EFE6] backdrop-blur-lg sm:inset-x-8 sm:bottom-8 sm:p-6">
            <p className="text-[0.54rem] uppercase tracking-[0.2em] text-[#E1C89F]">The practice in one line</p>
            <p className="mt-3 font-display text-3xl leading-tight sm:text-4xl">Observe widely. Decide narrowly. Build consistently.</p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[0.5rem] uppercase tracking-[0.14em] text-[#F4EFE6]/44">{featuredCredentials.map((credential)=><span key={credential.label}>{credential.label} · {credential.detail}</span>)}</div>
            <Link href="/about" className="mt-6 inline-flex text-[0.58rem] font-medium uppercase tracking-[0.18em] text-[#E1C89F]">Read the full practice ↗</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function PathIcon({ index, accent }: { index: number; accent: string }) {
  if (index === 0) return <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true"><motion.path d="M50 82 V46 M50 62 C36 58 29 47 30 34 C43 35 50 43 50 54 M50 58 C64 55 72 44 71 31 C58 33 51 41 50 52" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" initial={{ pathLength:.08 }} whileInView={{ pathLength:1 }} viewport={{ amount:.5 }} transition={{ duration:1.2,ease:EASE }}/><path d="M28 82 H72" stroke={accent} strokeOpacity=".28" /></svg>;
  if (index === 1) return <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">{[{cx:40,cy:48},{cx:60,cy:48},{cx:50,cy:64}].map((circle,i)=><motion.circle key={i} {...circle} r="22" fill="none" stroke={accent} strokeWidth="2.5" initial={{ scale:.7,opacity:.2 }} whileInView={{ scale:1,opacity:.78 }} viewport={{ amount:.5 }} transition={{ delay:i*.1,duration:.75,ease:EASE }}/>)}</svg>;
  return <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true"><motion.path d="M50 14 L59 41 L86 50 L59 59 L50 86 L41 59 L14 50 L41 41 Z" fill="none" stroke={accent} strokeWidth="2.5" initial={{ pathLength:.04,rotate:-18 }} whileInView={{ pathLength:1,rotate:0 }} viewport={{ amount:.5 }} transition={{ duration:1.25,ease:EASE }}/><motion.circle cx="50" cy="50" r="8" fill={accent} animate={{ scale:[.8,1.35,.8] }} transition={{ duration:3.4,repeat:Infinity,ease:"easeInOut" }}/></svg>;
}

function ThreePaths() {
  const [recommended, setRecommended] = useState(1);

  useEffect(() => {
    try {
      const situation = window.localStorage.getItem(SITUATION_KEY);
      setRecommended(situation === "idea" ? 0 : situation === "inconsistent" || situation === "outgrown" ? 1 : 1);
    } catch {}
  }, []);

  return (
    <section className="film-paper relative overflow-hidden bg-[#F4EFE6] py-24 text-[#22231F] sm:py-32 lg:py-40">
      <div className="mx-auto max-w-[94rem] px-6 sm:px-10 lg:px-14">
        <div className="film-reveal grid gap-9 lg:grid-cols-[.82fr_1.18fr] lg:items-end">
          <div><p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-[#9D6B4C]">Three paths</p><h2 className="mt-5 max-w-4xl font-display text-[clamp(3.3rem,7vw,7rem)] font-normal leading-[0.9] tracking-[-0.05em]">The work meets the business wherever it stands.</h2></div>
          <p className="max-w-xl text-sm leading-relaxed text-[#22231F]/60 sm:text-base lg:justify-self-end">The route changes. The logic does not: uncover the truth, choose the position, make it recognisable, and protect the meaning as it grows.</p>
        </div>

        <div className="film-reveal relative mt-14 rounded-[2rem] border border-[#22231F]/10 bg-[#EAE1D4]/72 px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
          <svg viewBox="0 0 1000 180" className="pointer-events-none absolute left-[8%] right-[8%] top-[7.6rem] hidden w-[84%] lg:block" aria-hidden="true">
            <path d="M30 110 C190 16 282 164 430 82 C575 2 690 166 970 70" fill="none" stroke="#22231F" strokeOpacity=".1" strokeWidth="2" strokeDasharray="5 10" />
            <motion.path d="M30 110 C190 16 282 164 430 82 C575 2 690 166 970 70" fill="none" stroke="#9D6B4C" strokeWidth="3" strokeLinecap="round" initial={{ pathLength:.03 }} whileInView={{ pathLength:1 }} viewport={{ amount:.38 }} transition={{ duration:1.8,ease:EASE }} />
            {[30,500,970].map((x,index)=><motion.circle key={x} cx={x} cy={index===0?110:index===1?58:70} r="9" fill={servicePaths[index].accent} initial={{ scale:0 }} whileInView={{ scale:1 }} viewport={{ amount:.38 }} transition={{ delay:.28+index*.3,duration:.5,ease:EASE }}/>) }
          </svg>

          <div className="relative grid gap-5 lg:grid-cols-3">
            {servicePaths.map((path,index)=>{
              const suggested = index===recommended;
              return <motion.article key={path.id} className={`group relative overflow-hidden rounded-[1.65rem] border p-6 sm:p-7 ${suggested?"border-[#22231F]/20 bg-white/76 shadow-[0_20px_70px_-50px_rgba(34,35,31,.5)]":"border-[#22231F]/8 bg-white/42"}`} whileHover={{ y:-8 }} transition={{ duration:.45,ease:EASE }}>
                <div className="flex items-center justify-between"><span className="text-[0.54rem] uppercase tracking-[0.2em] text-[#22231F]/38">Path {path.number}</span>{suggested?<span className="rounded-full border border-[#22231F]/10 bg-white/58 px-3 py-1 text-[0.48rem] uppercase tracking-[0.15em]" style={{ color:path.accent }}>Suggested</span>:null}</div>
                <div className="mt-7 flex h-28 w-28 items-center justify-center rounded-full border border-[#22231F]/9 bg-[#F4EFE6] p-5"><PathIcon index={index} accent={path.accent} /></div>
                <h3 className="mt-7 font-display text-[clamp(2.6rem,4.2vw,4.6rem)] font-normal leading-[.92] tracking-[-.045em]">{path.title}</h3>
                <p className="mt-5 text-sm leading-relaxed text-[#22231F]/58">{path.body}</p>
                <div className="mt-7 flex flex-wrap gap-2">{path.sequence.map((step,stepIndex)=><span key={step} className="rounded-full border border-[#22231F]/9 bg-white/46 px-3 py-2 text-[0.5rem] uppercase tracking-[0.13em] text-[#22231F]/50"><span style={{ color:path.accent }}>{String(stepIndex+1).padStart(2,"0")}</span>&nbsp; {step}</span>)}</div>
                <p className="mt-7 border-t border-[#22231F]/9 pt-6 font-display text-2xl leading-tight">{path.outcome}</p>
                <Link href={path.href} onClick={()=>track("service_path_opened",{ path:path.id,recommended:suggested,page:"home" })} className="mt-7 inline-flex min-h-11 items-center gap-3 rounded-full border border-[#22231F]/13 px-5 text-[0.58rem] font-medium uppercase tracking-[0.16em] transition-colors hover:bg-[#22231F] hover:text-[#F4EFE6]">Explore path <span className="transition-transform group-hover:translate-x-1">→</span></Link>
              </motion.article>;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function TatvaDiagram({ slug, color }: { slug: Element["slug"]; color: string }) {
  if (slug === "earth") return <div className="relative h-full w-full" aria-hidden="true">{[0,1,2,3].map((index)=><motion.div key={index} className="absolute inset-x-[8%] rounded-[50%] border" style={{ bottom:`${9+index*18}%`,height:"36%",borderColor:`${color}${48+index*10}` }} initial={{ y:54,scaleX:1.28 }} animate={{ y:0,scaleX:1 }} transition={{ duration:.9,delay:index*.07,ease:EASE }}/>) }<motion.div className="absolute bottom-[10%] left-1/2 top-[12%] w-px" style={{ backgroundColor:color }} initial={{ scaleY:0 }} animate={{ scaleY:1 }} transition={{ duration:1.05,ease:EASE }}/></div>;
  if (slug === "water") return <div className="relative h-full w-full overflow-hidden" aria-hidden="true">{[0,1,2,3].map((index)=><motion.div key={index} className="absolute left-[-16%] w-[132%] rounded-[50%] border" style={{ top:`${14+index*20}%`,height:"27%",borderColor:`${color}${62-index*8}` }} animate={{ x:index%2?[28,-24,28]:[-26,24,-26] }} transition={{ duration:8+index,repeat:Infinity,ease:"easeInOut" }}/>)}</div>;
  if (slug === "fire") return <motion.div className="relative mx-auto h-full max-h-[25rem] w-full max-w-[25rem]" aria-hidden="true" animate={{ rotate:[-4,4,-4],scale:[.96,1.04,.96] }} transition={{ duration:7,repeat:Infinity,ease:"easeInOut" }}>{[0,1,2,3,4].map((index)=><span key={index} className="absolute left-1/2 top-1/2 h-[58%] w-[18%] origin-bottom -translate-x-1/2 -translate-y-full rounded-[50%_50%_35%_35%] border" style={{ rotate:`${index*72}deg`,borderColor:`${color}${40+index*8}` }}/>)}</motion.div>;
  if (slug === "air") return <motion.div className="relative h-full w-full" aria-hidden="true" animate={{ y:[28,-22,28] }} transition={{ duration:9,repeat:Infinity,ease:"easeInOut" }}>{[14,30,48,67,82].map((top,index)=><span key={top} className="absolute h-px rounded-full" style={{ top:`${top}%`,left:`${7+index*7}%`,width:`${58+index*5}%`,background:`linear-gradient(90deg,transparent,${color}BB,transparent)` }}/>)}</motion.div>;
  return <motion.div className="relative mx-auto h-full max-h-[27rem] w-full max-w-[27rem]" aria-hidden="true" animate={{ rotate:360 }} transition={{ duration:42,repeat:Infinity,ease:"linear" }}>{[18,31,46,64,82].map((size,index)=><span key={size} className="absolute left-1/2 top-1/2 rounded-full border" style={{ width:`${size}%`,height:`${size}%`,transform:"translate(-50%,-50%)",borderColor:`${color}${30+index*10}` }}/>) }<span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ backgroundColor:color,boxShadow:`0 0 48px ${color}` }}/></motion.div>;
}

function TatvaFilm() {
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

  const active = elements[activeIndex] ?? elements[0];
  const change = tatvaTransformations[active.slug];

  if (reduced || compact) {
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
              const item = tatvaTransformations[element.slug];
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
                        Tatva {String(index + 1).padStart(2, "0")} · {item.verb}
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
                          {item.before}
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
                          {item.after}
                        </p>
                      </div>
                      <p className="border-t border-[#22231F]/9 pt-4 text-xs leading-relaxed text-[#22231F]/48">
                        <span className="text-[#22231F]/74">
                          Without {element.name.split(" · ")[0]}:
                        </span>{" "}
                        {item.consequence}
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

  return (
    <section
      ref={ref}
      className="relative h-[430svh] bg-[#1E2A22] text-[#22231F]"
    >
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
            <AmbientVideo
              src={active.video}
              poster={active.image}
              position={active.imagePosition ?? "center"}
            />
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
                style={{
                  color:
                    index === activeIndex ? element.color : PALETTE.ink,
                }}
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

function ProcessMountain() {
  const ref=useRef<HTMLElement>(null);
  const { scrollYProgress }=useScroll({ target:ref,offset:["start 80%","end 35%"] });
  const draw=useSpring(scrollYProgress,{ stiffness:105,damping:26,mass:.3 });

  return <section ref={ref} className="film-paper relative overflow-hidden bg-[#EAE1D4] py-24 text-[#22231F] sm:py-32 lg:py-40"><div className="mx-auto max-w-[94rem] px-6 sm:px-10 lg:px-14"><div className="film-reveal mx-auto max-w-5xl text-center"><p className="text-[.6rem] font-medium uppercase tracking-[.3em] text-[#9D6B4C]">From valley to vantage point</p><h2 className="mt-5 font-display text-[clamp(3.3rem,7vw,7rem)] font-normal leading-[.9] tracking-[-.05em]">A project does not move forward. It moves deeper.</h2><p className="mx-auto mt-7 max-w-2xl text-sm leading-relaxed text-[#22231F]/58 sm:text-base">Each decision changes the altitude of the next. Skip one and the break appears later, where recognition should have compounded.</p></div>
    <div className="relative mt-16"><svg viewBox="0 0 1000 1480" className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-[80%] -translate-x-1/2 lg:block" aria-hidden="true"><path d="M90 1370 C260 1270 184 1120 360 1020 C530 920 380 790 566 670 C720 570 566 430 760 330 C858 280 876 172 910 88" fill="none" stroke="#22231F" strokeOpacity=".09" strokeWidth="4"/><motion.path d="M90 1370 C260 1270 184 1120 360 1020 C530 920 380 790 566 670 C720 570 566 430 760 330 C858 280 876 172 910 88" fill="none" stroke="#9D6B4C" strokeWidth="5" strokeLinecap="round" style={{ pathLength:draw }}/></svg><div className="space-y-8 sm:space-y-10">{process.map((stage,index)=>{const left=index%2===0;return <article key={stage.stage} className={`film-reveal relative grid gap-6 lg:min-h-[13rem] lg:grid-cols-2 lg:items-center ${left?"":"lg:[&>*:first-child]:order-2"}`}><div className={left?"lg:pr-20":"lg:pl-20"}><motion.div className="group relative aspect-[16/8.7] overflow-hidden rounded-[1.6rem] border border-[#22231F]/10 bg-[#1E2A22] shadow-[0_22px_70px_-48px_rgba(34,35,31,.5)]" whileHover={{ y:-7 }} transition={{ duration:.45,ease:EASE }}>{stage.poster?<Image src={stage.poster} alt="" fill sizes="(min-width:1024px) 46vw, 100vw" className="object-cover transition-transform duration-1000 group-hover:scale-[1.055]"/>:null}<div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(23,31,25,.62))]"/><span className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-black/20 px-4 py-2 font-display text-sm text-[#E1C89F] backdrop-blur-md">{String(index+1).padStart(2,"0")}</span></motion.div></div><div className={left?"lg:pl-20":"lg:pr-20 lg:text-right"}><p className="text-[.54rem] font-medium uppercase tracking-[.22em] text-[#9D6B4C]">Stage {String(index+1).padStart(2,"0")} · {stage.element}</p><h3 className="mt-4 font-display text-[clamp(3rem,6vw,5.8rem)] font-normal leading-[.9] tracking-[-.045em]">{stage.stage}</h3><p className={`mt-5 max-w-xl text-sm leading-relaxed text-[#22231F]/58 sm:text-base ${left?"":"lg:ml-auto"}`}>{stage.description}</p></div><motion.span className="absolute left-1/2 top-1/2 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#9D6B4C] bg-[#EAE1D4] lg:block" whileInView={{ scale:[.4,1.5,1] }} viewport={{ amount:.5 }} transition={{ duration:.7,ease:EASE }}/></article>})}</div></div>
    <div className="film-reveal mx-auto mt-16 max-w-4xl border-t border-[#22231F]/10 pt-12 text-center"><p className="text-[.56rem] uppercase tracking-[.22em] text-[#9D6B4C]">The summit is coherence</p><p className="mt-5 font-display text-[clamp(3rem,7vw,6.4rem)] leading-[.9]">Every decision now remembers the one before it.</p></div></div></section>;
}

function QuestionsAndInvitation() {
  const questions=["Can you help a brand new business?","Can you help an existing brand that already has an identity?","Can you actually implement, or just strategize?","How long does a project take?","Can we work remotely?"].map((question)=>faqs.find((faq)=>faq.question===question)).filter(Boolean);
  return <section className="film-paper relative overflow-hidden bg-[#F4EFE6] text-[#22231F]"><div className="mx-auto max-w-[94rem] px-6 py-24 sm:px-10 sm:py-32 lg:px-14 lg:py-40"><div className="film-reveal grid gap-10 lg:grid-cols-[.76fr_1.24fr]"><div><p className="text-[.6rem] font-medium uppercase tracking-[.3em] text-[#9D6B4C]">Common questions</p><h2 className="mt-5 font-display text-[clamp(3.3rem,7vw,6.8rem)] font-normal leading-[.9] tracking-[-.05em]">Answers to what matters most.</h2><p className="mt-7 max-w-sm text-sm leading-relaxed text-[#22231F]/58 sm:text-base">The final decision should feel clear, not pressured. Open the question still holding it back.</p></div><div className="divide-y divide-[#22231F]/10 rounded-[1.8rem] border border-[#22231F]/10 bg-white/44 px-5 sm:px-8">{questions.map((item,index)=>item?<details key={item.question} className="group py-6"><summary className="flex cursor-pointer list-none items-start gap-4 font-display text-2xl leading-tight marker:hidden sm:text-3xl"><span className="mt-1 font-body text-[.52rem] uppercase tracking-[.2em] text-[#9D6B4C]">{String(index+1).padStart(2,"0")}</span><span>{item.question}</span><span className="ml-auto text-xl text-[#9D6B4C] transition-transform group-open:rotate-45">+</span></summary><p className="ml-10 mt-5 max-w-3xl border-l border-[#9D6B4C]/36 pl-5 text-sm leading-relaxed text-[#22231F]/58 sm:text-base">{item.answer}</p></details>:null)}</div></div></div>
    <div className="relative min-h-[92svh] overflow-hidden bg-[#1E2A22] text-[#F4EFE6]"><AmbientVideo src="/videos/pixabay-sea-of-fog-sunrise.mp4" poster="/images/pixabay-sea-of-fog-sunrise-poster.jpg" position="center"/><div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,31,25,.14),rgba(22,31,25,.38)_48%,rgba(22,31,25,.78))]"/><div className="relative z-10 mx-auto flex min-h-[92svh] max-w-[94rem] items-end px-6 pb-16 pt-28 sm:px-10 sm:pb-20 lg:px-14"><div className="film-reveal max-w-6xl"><p className="text-[.6rem] uppercase tracking-[.3em] text-[#E1C89F]">The last frame belongs to them</p><h2 className="mt-6 font-display text-[clamp(3.8rem,9vw,9rem)] font-normal leading-[.84] tracking-[-.06em]">What should your audience remember after you leave the room?</h2><div className="mt-8 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between"><p className="max-w-xl text-sm leading-relaxed text-[#F4EFE6]/68 sm:text-base">Twenty minutes. A real diagnosis. No pitch deck waiting behind the curtain.</p><LinkButton href="/contact" trackEvent="closing_booking_click" trackProps={{ page:"home" }}>Begin with the real question</LinkButton></div></div></div></div>
  </section>;
}

function HomeFooter() {
  return <footer className="film-paper bg-[#F4EFE6] text-[#22231F]"><div className="mx-auto grid max-w-[94rem] gap-10 border-t border-[#22231F]/10 px-6 py-12 sm:px-10 lg:grid-cols-[1.1fr_.9fr] lg:px-14"><div><div className="flex items-center gap-3"><LogoMark size={42}/><Logo/></div><p className="mt-5 max-w-md text-sm leading-relaxed text-[#22231F]/54">A solo brand strategy practice led directly by Suman Sharma, from the first question to the system that carries it into the market.</p></div><div className="grid gap-8 sm:grid-cols-2 lg:justify-self-end"><div><p className="text-[.52rem] uppercase tracking-[.2em] text-[#22231F]/36">Navigate</p><div className="mt-4 grid gap-2">{navigation.filter((item)=>item.href!=="/").map((item)=><Link key={item.href} href={item.href} className="font-display text-xl hover:text-[#9D6B4C]">{item.label}</Link>)}</div></div><div><p className="text-[.52rem] uppercase tracking-[.2em] text-[#22231F]/36">Begin</p><a href={`mailto:${site.email}`} className="mt-4 block font-display text-xl hover:text-[#9D6B4C]">{site.email}</a><p className="mt-3 text-sm text-[#22231F]/48">Remote, worldwide.</p></div></div></div><div className="border-t border-[#22231F]/10 px-6 py-5 text-center text-[.52rem] uppercase tracking-[.18em] text-[#22231F]/38 sm:px-10 lg:px-14">© {new Date().getFullYear()} Branding Tatva · Rooted in truth · Designed to compound</div></footer>;
}

export function MoodboardHome() {
  return <><style jsx global>{`
    .film-paper {
      background-image:
        radial-gradient(circle at 18% 12%, rgba(180,134,76,.07), transparent 26%),
        radial-gradient(circle at 86% 76%, rgba(116,128,103,.08), transparent 30%),
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.82' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.12'/%3E%3C/svg%3E");
      background-blend-mode: normal, normal, multiply;
    }
    .film-reveal { opacity:1; transform:none; }
    @supports (animation-timeline: view()) {
      .film-reveal {
        animation-name: film-rise;
        animation-duration:1ms;
        animation-fill-mode:both;
        animation-timing-function:cubic-bezier(.16,1,.3,1);
        animation-timeline:view();
        animation-range:entry 2% cover 34%;
      }
    }
    @keyframes film-rise { from { opacity:.26; transform:translate3d(0,42px,0) scale(.982); } to { opacity:1; transform:translate3d(0,0,0) scale(1); } }
    .film-divider-line { animation:film-divider 5.6s ease-in-out infinite; transform-origin:center; }
    @keyframes film-divider { 0%,100%{ transform:scaleX(.68); opacity:.34; } 50%{ transform:scaleX(1); opacity:.82; } }
    .film-sun-sweep { animation:film-sweep 13s ease-in-out infinite; }
    @keyframes film-sweep { 0%,100%{ transform:translateX(-12%) rotate(13deg); opacity:.24; } 50%{ transform:translateX(290%) rotate(13deg); opacity:.76; } }
    @media (prefers-reduced-motion: reduce) {
      .film-reveal,.film-divider-line,.film-sun-sweep { animation:none!important; opacity:1!important; transform:none!important; }
    }
    :root[data-motion="reduced"] .film-reveal,
    :root[data-motion="reduced"] .film-divider-line,
    :root[data-motion="reduced"] .film-sun-sweep { animation:none!important; opacity:1!important; transform:none!important; }
  `}</style><HomeHeader/><FilmProgress/><main id="main-content"><DawnHero/><BotanicalDivider label="Memory"/><MemoryGraph/><BotanicalDivider label="Recognition"/><RecognitionClearing/><BotanicalDivider label="Evidence"/><EvidenceFilm/><BotanicalDivider label="The practice"/><AuthorLenses/><BotanicalDivider label="Three paths"/><ThreePaths/><BotanicalDivider label="The five Tatvas" dark/><TatvaFilm/><BotanicalDivider label="The journey"/><ProcessMountain/><QuestionsAndInvitation/></main><HomeFooter/></>;
}
