"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  MessageCircle,
  PenLine,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/Container";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { EASE_AIR } from "@/lib/motion";
import { site } from "@/data/site";

type PathwayId = "book" | "speak" | "write";

type Pathway = {
  id: PathwayId;
  index: string;
  label: string;
  title: string;
  description: string;
  detail: string;
  Icon: LucideIcon;
};

const pathways: Pathway[] = [
  {
    id: "book",
    index: "01",
    label: "Book a conversation",
    title: "Choose a calm half hour for the brand question taking up space.",
    description:
      "The conversation begins with where the brand stands today and ends with a clear next move.",
    detail: `${site.consultationMinutes} minutes · your timezone · direct with Suman`,
    Icon: CalendarDays,
  },
  {
    id: "speak",
    index: "02",
    label: "Speak directly",
    title: "Reach Suman while the thought is still fresh.",
    description:
      "A call or WhatsApp message works when a long brief would slow the conversation down.",
    detail: site.phone.display,
    Icon: MessageCircle,
  },
  {
    id: "write",
    index: "03",
    label: "Write a short note",
    title: "Put the uncertainty into your own words.",
    description:
      "A few lines about what you are building and what feels unclear are enough to begin.",
    detail: "Three details · read personally · reply by email",
    Icon: PenLine,
  },
];

export function ContactPathways() {
  const [activeId, setActiveId] = useState<PathwayId>("book");
  const prefersReducedMotion = useHydratedReducedMotion();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const active = pathways.find((pathway) => pathway.id === activeId) ?? pathways[0];
  const panelId = "contact-pathway-panel";

  function moveToPathway(index: number) {
    const nextIndex = (index + pathways.length) % pathways.length;
    const next = pathways[nextIndex];
    setActiveId(next.id);
    tabRefs.current[nextIndex]?.focus();
  }

  function handleTabKeyDown(index: number, event: KeyboardEvent<HTMLButtonElement>) {
    if (["ArrowRight", "ArrowDown"].includes(event.key)) {
      event.preventDefault();
      moveToPathway(index + 1);
      return;
    }

    if (["ArrowLeft", "ArrowUp"].includes(event.key)) {
      event.preventDefault();
      moveToPathway(index - 1);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      moveToPathway(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      moveToPathway(pathways.length - 1);
    }
  }

  return (
    <Container className="relative flex min-h-[62svh] items-center py-14 sm:py-16">
      <div className="grid w-full gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-14">
        <div className="max-w-md">
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.24em] text-soil/65">
            Three ways to begin
          </p>
          <h2 id="contact-pathways-heading" className="mt-4 font-display text-[clamp(2.35rem,4.7vw,4.5rem)] font-normal leading-[0.98] text-soil">
            Start where the conversation feels natural.
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-soil/70 sm:text-base">
            The route can be immediate, considered, or somewhere between. Every enquiry reaches Suman directly.
          </p>
        </div>

        <div className="overflow-hidden rounded-[1.75rem] border border-white/55 bg-[#F6F2EA]/72 shadow-[0_28px_90px_rgba(42,35,26,0.16)] backdrop-blur-3xl">
          <div className="grid lg:grid-cols-[0.76fr_1.24fr]">
            <div
              role="tablist"
              aria-label="Ways to contact Branding Tatva"
              className="grid grid-cols-3 gap-2 border-b border-soil/10 p-3 lg:flex lg:flex-col lg:border-b-0 lg:border-r lg:p-4"
            >
              {pathways.map((pathway, index) => {
                const selected = pathway.id === activeId;
                const Icon = pathway.Icon;
                return (
                  <button
                    key={pathway.id}
                    ref={(node) => {
                      tabRefs.current[index] = node;
                    }}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    tabIndex={selected ? 0 : -1}
                    id={`contact-pathway-tab-${pathway.id}`}
                    aria-controls={panelId}
                    onClick={() => setActiveId(pathway.id)}
                    onFocus={() => setActiveId(pathway.id)}
                    onMouseEnter={() => setActiveId(pathway.id)}
                    onKeyDown={(event) => handleTabKeyDown(index, event)}
                    className={`group relative flex min-h-[5.5rem] min-w-0 flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl px-2 py-2 text-center transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay lg:min-h-0 lg:flex-none lg:flex-row lg:justify-start lg:gap-3 lg:px-4 lg:py-4 lg:text-left ${
                      selected ? "text-ivory" : "text-soil hover:bg-white/55"
                    }`}
                  >
                    {selected && (
                      <motion.span
                        layoutId="contact-pathway-active"
                        aria-hidden="true"
                        className="absolute inset-0 rounded-2xl bg-soil shadow-[0_12px_30px_rgba(34,39,31,0.16)]"
                        transition={{ duration: prefersReducedMotion ? 0 : 0.42, ease: EASE_AIR }}
                      />
                    )}
                    <span
                      className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 lg:h-9 lg:w-9 ${
                        selected ? "border-ivory/20 bg-ivory/10" : "border-soil/15 bg-white/35"
                      }`}
                    >
                      <Icon aria-hidden="true" className="h-4 w-4" strokeWidth={1.45} />
                    </span>
                    <span className="relative z-10 min-w-0">
                      <span className={`hidden text-[0.62rem] uppercase tracking-[0.2em] lg:block ${selected ? "text-ivory/55" : "text-soil/45"}`}>
                        {pathway.index}
                      </span>
                      <span className="block text-[0.68rem] font-medium leading-[1.2] sm:text-xs lg:mt-1 lg:text-sm lg:leading-snug">
                        {pathway.label}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="relative min-h-[23rem] p-5 sm:min-h-[25rem] sm:p-9 lg:min-h-[28rem] lg:p-10">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active.id}
                  id={panelId}
                  role="tabpanel"
                  aria-labelledby={`contact-pathway-tab-${active.id}`}
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12, filter: "blur(5px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8, filter: "blur(4px)" }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.42, ease: EASE_AIR }}
                  className="flex h-full flex-col"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[0.68rem] font-medium uppercase tracking-[0.22em] text-clay">
                      {active.label}
                    </span>
                    <span className="font-display text-2xl text-soil/25" aria-hidden="true">
                      {active.index}
                    </span>
                  </div>

                  <p className="mt-6 max-w-xl font-display text-[clamp(2rem,3.6vw,3.35rem)] font-normal leading-[1.02] text-soil sm:mt-8">
                    {active.title}
                  </p>
                  <p className="mt-5 max-w-lg text-sm leading-relaxed text-soil/68 sm:text-base">
                    {active.description}
                  </p>
                  <p className="mt-auto pt-6 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-soil/48 sm:pt-8">
                    {active.detail}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {active.id === "book" && (
                      <>
                        <a
                          href={site.calendlyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex min-h-12 items-center justify-center rounded-full bg-soil px-5 py-3 text-sm font-medium text-ivory transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-action-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-clay"
                        >
                          See available times
                          <ArrowUpRight aria-hidden="true" className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </a>
                        <a
                          href="#call"
                          className="inline-flex min-h-12 items-center justify-center rounded-full border border-soil/15 bg-white/35 px-5 py-3 text-sm font-medium text-soil transition-colors duration-300 hover:bg-white/65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-clay"
                        >
                          See the call flow
                          <ArrowDown aria-hidden="true" className="ml-2 h-4 w-4" />
                        </a>
                      </>
                    )}

                    {active.id === "speak" && (
                      <>
                        <a
                          href={`tel:${site.phone.tel}`}
                          aria-label={`Call Suman at ${site.phone.display}`}
                          className="inline-flex min-h-12 items-center justify-center rounded-full bg-soil px-5 py-3 text-sm font-medium text-ivory transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-action-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-clay"
                        >
                          <Phone aria-hidden="true" className="mr-2 h-4 w-4" />
                          Call Suman
                        </a>
                        <a
                          href={site.phone.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-12 items-center justify-center rounded-full border border-soil/15 bg-white/35 px-5 py-3 text-sm font-medium text-soil transition-colors duration-300 hover:bg-white/65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-clay"
                        >
                          WhatsApp
                          <ArrowUpRight aria-hidden="true" className="ml-2 h-4 w-4" />
                        </a>
                      </>
                    )}

                    {active.id === "write" && (
                      <>
                        <a
                          href="#write"
                          className="inline-flex min-h-12 items-center justify-center rounded-full bg-soil px-5 py-3 text-sm font-medium text-ivory transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-action-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-clay"
                        >
                          Start the note
                          <ArrowDown aria-hidden="true" className="ml-2 h-4 w-4" />
                        </a>
                        <a
                          href={`mailto:${site.email}`}
                          className="inline-flex min-h-12 items-center justify-center rounded-full border border-soil/15 bg-white/35 px-5 py-3 text-sm font-medium text-soil transition-colors duration-300 hover:bg-white/65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-clay"
                        >
                          Email instead
                          <ArrowUpRight aria-hidden="true" className="ml-2 h-4 w-4" />
                        </a>
                      </>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
