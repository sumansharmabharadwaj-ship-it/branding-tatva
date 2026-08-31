"use client";

import {
  useEffect,
  useRef,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  type Variants,
} from "framer-motion";
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
import { ContactKineticHeading } from "@/components/ContactKineticHeading";
import {
  ContactPathwayFilm,
  type ContactPathwayFilmProps,
} from "@/components/ContactPathwayFilm";
import { useContactSceneStage } from "@/hooks/useContactSceneStage";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useServicesContactPackage } from "@/hooks/useServicesContactPackage";
import { track } from "@/lib/analytics";
import { EASE_AIR } from "@/lib/motion";
import { calendlyHrefForServicesPackage } from "@/lib/servicesJourney";
import { packages } from "@/data/services";
import { site } from "@/data/site";

type PathwayId = "book" | "speak" | "write";

type Pathway = {
  id: PathwayId;
  index: string;
  tempo: string;
  label: string;
  title: string;
  description: string;
  bestWhen: string;
  detail: string;
  Icon: LucideIcon;
  film: ContactPathwayFilmProps;
};

const pathways: Pathway[] = [
  {
    id: "book",
    index: "01",
    tempo: "Scheduled",
    label: "Book a conversation",
    title: "Reserve half an hour to examine one brand decision with Suman.",
    description:
      "Trace the decision back to positioning, audience perception, and the recognition the brand needs to own.",
    bestWhen: "A live exchange will reveal more than another round of internal debate.",
    detail: `${site.consultationMinutes} minutes · your timezone · direct with Suman`,
    Icon: CalendarDays,
    film: {
      video: "/videos/generated/bt-contact-original-book.mp4",
      poster: "/images/generated/bt-contact-original-book-poster.jpg",
      caption: "Morning folio · a time held",
      playbackRate: 0.78,
      camera: "folio",
      hoverBoost: 0.04,
      imagePosition: "center",
    },
  },
  {
    id: "speak",
    index: "02",
    tempo: "Immediate",
    label: "Speak directly",
    title: "Call while the decision is still live.",
    description:
      "Use phone or WhatsApp for a direct question that does not need a polished brief.",
    bestWhen: "You know the point you want to test and want the shortest route to Suman.",
    detail: site.phone.display,
    Icon: MessageCircle,
    film: {
      video: "/videos/generated/bt-contact-original-speak.mp4",
      poster: "/images/generated/bt-contact-original-speak-poster.jpg",
      caption: "Two cups · speak directly",
      playbackRate: 0.82,
      camera: "conversation",
      hoverBoost: 0.1,
      imagePosition: "center 52%",
    },
  },
  {
    id: "write",
    index: "03",
    tempo: "Unhurried",
    label: "Write a short note",
    title: "Describe the gap between what you mean and what people perceive.",
    description:
      "Name the brand, the decision, and the part that keeps refusing to resolve.",
    bestWhen: "Writing helps you separate the real issue from the surrounding noise.",
    detail: "Three details · read personally · reply by email",
    Icon: PenLine,
    film: {
      video: "/videos/generated/bt-contact-original-write-card.mp4",
      poster: "/images/generated/bt-contact-original-write-card-poster.jpg",
      caption: "Open window · write slowly",
      playbackRate: 0.76,
      camera: "letter",
      hoverBoost: 0.05,
      imagePosition: "center",
    },
  },
];

const SWIPE_DISTANCE_PX = 46;
const SWIPE_AXIS_DOMINANCE = 1.3;
const TOUCH_DRAG_LIMIT_PX = 12;

const PATHWAY_SHOT_VARIANTS: Variants = {
  enter: (direction: number) => ({
    opacity: 0.42,
    x: direction * 18,
    scale: 0.992,
    clipPath:
      direction > 0
        ? "inset(0 16% 0 0 round 1.25rem)"
        : "inset(0 0 0 16% round 1.25rem)",
  }),
  centre: {
    opacity: 1,
    x: 0,
    scale: 1,
    clipPath: "inset(0 0% 0 0 round 0rem)",
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction * -12,
    scale: 0.996,
    clipPath:
      direction > 0
        ? "inset(0 0 0 12% round 1.1rem)"
        : "inset(0 12% 0 0 round 1.1rem)",
    transition: { duration: 0.22, ease: EASE_AIR },
  }),
};

const primaryActionClass =
  "group inline-flex min-h-11 items-center justify-center rounded-full bg-soil px-3 py-2 text-center text-[0.72rem] font-medium leading-tight text-ivory transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-action-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-clay sm:min-h-12 sm:px-5 sm:py-3 sm:text-sm";
const secondaryActionClass =
  "inline-flex min-h-11 items-center justify-center rounded-full border border-soil/15 bg-white/35 px-3 py-2 text-center text-[0.72rem] font-medium leading-tight text-soil transition-colors duration-300 hover:bg-white/65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-clay sm:min-h-12 sm:px-5 sm:py-3 sm:text-sm";

function PathwayHandoff({
  pathway,
  detail,
  reducedMotion,
}: {
  pathway: Pathway;
  detail?: string;
  reducedMotion: boolean;
}) {
  const lineTransition = {
    duration: reducedMotion ? 0 : 0.56,
    ease: EASE_AIR,
  } as const;

  return (
    <div data-contact-pathway-handoff className="mt-auto pt-4 sm:pt-7">
      <div
        role="img"
        className="grid grid-cols-[auto_minmax(1rem,1fr)_auto_minmax(1rem,1fr)_auto] items-center gap-2 sm:gap-3"
        aria-label={`${pathway.label} carries the issue you bring toward the decision you need.`}
      >
        <span aria-hidden="true" className="text-[0.56rem] font-medium uppercase tracking-[0.15em] text-soil/42 sm:text-[0.62rem]">
          Your question
        </span>
        <span aria-hidden="true" className="relative h-px overflow-hidden bg-soil/12">
          <motion.span
            key={`${pathway.id}-in`}
            className="absolute inset-0 origin-right bg-clay/72"
            initial={reducedMotion ? undefined : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={lineTransition}
          />
        </span>
        <motion.span
          key={pathway.id}
          aria-hidden="true"
          initial={
            reducedMotion
              ? undefined
              : { clipPath: "inset(0 50% 0 50% round 999px)", scaleX: 0.86 }
          }
          animate={{ clipPath: "inset(0 0% 0 0% round 999px)", scaleX: 1 }}
          transition={{ duration: reducedMotion ? 0 : 0.44, ease: EASE_AIR }}
          className="rounded-full border border-clay/20 bg-clay/[0.08] px-2.5 py-1 text-[0.56rem] font-medium uppercase tracking-[0.15em] text-clay sm:px-3 sm:text-[0.62rem]"
        >
          {pathway.tempo}
        </motion.span>
        <span aria-hidden="true" className="relative h-px overflow-hidden bg-soil/12">
          <motion.span
            key={`${pathway.id}-out`}
            className="absolute inset-0 origin-left bg-clay/72"
            initial={reducedMotion ? undefined : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ ...lineTransition, delay: reducedMotion ? 0 : 0.1 }}
          />
        </span>
        <span aria-hidden="true" className="text-right text-[0.56rem] font-medium uppercase tracking-[0.15em] text-soil/42 sm:text-[0.62rem]">
          Next move
        </span>
      </div>

      <p className="mt-2.5 text-[0.6rem] font-medium uppercase tracking-[0.14em] text-soil/48 sm:mt-3 sm:text-[0.68rem] sm:tracking-[0.18em]">
        {detail ?? pathway.detail}
      </p>
    </div>
  );
}

type TouchGesture = {
  pointerId: number;
  startX: number;
  startY: number;
};

export function ContactPathways() {
  const prefersReducedMotion = useHydratedReducedMotion();
  const servicePackage = useServicesContactPackage();
  const selectedPackage = packages.find((entry) => entry.slug === servicePackage);
  const bookingHref = calendlyHrefForServicesPackage(site.calendlyUrl, servicePackage);
  const sceneRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const touchGestureRef = useRef<TouchGesture | null>(null);
  const previousIndexRef = useRef(0);
  const touchDragX = useMotionValue(0);
  const touchDragXSmooth = useSpring(touchDragX, {
    stiffness: 190,
    damping: 24,
    mass: 0.26,
  });
  const { activeIndex, choose } = useContactSceneStage({
    count: pathways.length,
    target: sceneRef,
    reducedMotion: prefersReducedMotion,
  });
  const active = pathways[activeIndex] ?? pathways[0];
  const activeDetail =
    active.id === "book" && selectedPackage
      ? `${selectedPackage.name} · ${site.consultationMinutes} minutes · your timezone`
      : active.detail;
  const direction = activeIndex >= previousIndexRef.current ? 1 : -1;
  const panelId = "contact-pathway-panel";

  useEffect(() => {
    previousIndexRef.current = activeIndex;
  }, [activeIndex]);

  function moveToPathway(index: number) {
    const nextIndex = (index + pathways.length) % pathways.length;
    choose(nextIndex);
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

  function handlePanelPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" || !event.isPrimary) return;
    touchGestureRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
    };
    touchDragX.set(0);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePanelPointerMove(event: PointerEvent<HTMLDivElement>) {
    const gesture = touchGestureRef.current;
    if (prefersReducedMotion || !gesture || gesture.pointerId !== event.pointerId) return;

    const travelX = event.clientX - gesture.startX;
    const travelY = event.clientY - gesture.startY;
    if (Math.abs(travelY) > Math.abs(travelX)) {
      touchDragX.set(0);
      return;
    }

    const pressingPastStart = activeIndex === 0 && travelX > 0;
    const pressingPastEnd = activeIndex === pathways.length - 1 && travelX < 0;
    const resistance = pressingPastStart || pressingPastEnd ? 0.045 : 0.11;
    touchDragX.set(
      Math.max(-TOUCH_DRAG_LIMIT_PX, Math.min(TOUCH_DRAG_LIMIT_PX, travelX * resistance)),
    );
  }

  function handlePanelPointerUp(event: PointerEvent<HTMLDivElement>) {
    const gesture = touchGestureRef.current;
    touchGestureRef.current = null;
    touchDragX.set(0);
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const travelX = event.clientX - gesture.startX;
    const travelY = event.clientY - gesture.startY;
    const horizontalIntent =
      Math.abs(travelX) >= SWIPE_DISTANCE_PX &&
      Math.abs(travelX) > Math.abs(travelY) * SWIPE_AXIS_DOMINANCE;

    if (!horizontalIntent) return;
    event.preventDefault();
    const nextIndex = Math.max(
      0,
      Math.min(pathways.length - 1, activeIndex + (travelX < 0 ? 1 : -1)),
    );
    if (nextIndex !== activeIndex) choose(nextIndex);
  }

  function cancelPanelGesture(event: PointerEvent<HTMLDivElement>) {
    if (touchGestureRef.current?.pointerId === event.pointerId) {
      touchGestureRef.current = null;
      touchDragX.set(0);
    }
  }

  return (
    <div ref={sceneRef} className="w-full">
      <Container className="contact-pathways-layout relative flex min-h-[100svh] items-center py-7 sm:py-14">
        <div data-contact-pathways-grid className="grid w-full gap-5 sm:gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-14">
          <div data-contact-pathways-intro className="max-w-md">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.24em] text-soil/65">
              Choose how to reach Suman
            </p>
            <ContactKineticHeading
              id="contact-pathways-heading"
              data-contact-pathways-heading
              lines={["Match the route", "to the decision", "in front of you."]}
              resolveClassName="text-clay"
              className="mt-3 font-display text-[clamp(2rem,8.7vw,2.55rem)] font-normal leading-[0.98] text-soil sm:mt-4 sm:text-[clamp(2.35rem,4.7vw,4.5rem)]"
            />
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-soil/70 sm:mt-5 sm:text-base">
              Reserve time, speak now, or write first. Every route reaches the person who would lead the work.
            </p>
          </div>

          <div data-contact-pathways-card className="overflow-hidden rounded-[1.5rem] border border-white/55 bg-[#F6F2EA]/72 shadow-[0_28px_90px_rgba(42,35,26,0.16)] backdrop-blur-3xl sm:rounded-[1.75rem]">
            <div className="grid lg:grid-cols-[0.76fr_1.24fr]">
              <div
                role="tablist"
                aria-label="Ways to contact Branding Tatva"
                data-contact-pathway-tabs
                className="grid grid-cols-3 gap-1.5 border-b border-soil/10 p-2.5 sm:gap-2 sm:p-3 lg:flex lg:flex-col lg:border-b-0 lg:border-r lg:p-4"
              >
                {pathways.map((pathway, index) => {
                  const selected = pathway.id === active.id;
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
                      onClick={() => choose(index)}
                      onFocus={() => choose(index)}
                      onMouseEnter={() => choose(index)}
                      onKeyDown={(event) => handleTabKeyDown(index, event)}
                      data-cursor-label={pathway.label}
                      className={`group relative flex min-h-[4.25rem] min-w-0 flex-col items-center justify-center gap-1.5 overflow-hidden rounded-xl px-1.5 py-1.5 text-center transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay sm:min-h-[5.5rem] sm:gap-2 sm:rounded-2xl sm:px-2 sm:py-2 lg:min-h-0 lg:flex-none lg:flex-row lg:justify-start lg:gap-3 lg:px-4 lg:py-4 lg:text-left ${
                        selected ? "text-ivory" : "text-soil hover:bg-white/55"
                      }`}
                    >
                      {selected ? (
                        <motion.span
                          layoutId="contact-pathway-active"
                          aria-hidden="true"
                          className="absolute inset-0 rounded-2xl bg-soil shadow-[0_12px_30px_rgba(34,39,31,0.16)]"
                          transition={{ duration: prefersReducedMotion ? 0 : 0.42, ease: EASE_AIR }}
                        />
                      ) : null}
                      <span
                        data-contact-pathway-tab-icon
                        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 lg:h-9 lg:w-9 ${
                          selected ? "border-ivory/20 bg-ivory/10" : "border-soil/15 bg-white/35"
                        }`}
                      >
                        <Icon aria-hidden="true" className="h-4 w-4" strokeWidth={1.45} />
                      </span>
                      <span className="relative z-10 min-w-0">
                        <span className={`hidden text-[0.62rem] uppercase tracking-[0.18em] lg:block ${selected ? "text-ivory/55" : "text-soil/45"}`}>
                          {pathway.index} · {pathway.tempo}
                        </span>
                        <span className="block text-[0.68rem] font-medium leading-[1.2] sm:text-xs lg:mt-1 lg:text-sm lg:leading-snug">
                          {pathway.label}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <motion.div
                id={panelId}
                role="tabpanel"
                aria-labelledby={`contact-pathway-tab-${active.id}`}
                data-contact-pathway-panel
                data-contact-touch-surface
                onPointerDown={handlePanelPointerDown}
                onPointerMove={handlePanelPointerMove}
                onPointerUp={handlePanelPointerUp}
                onPointerCancel={cancelPanelGesture}
                onLostPointerCapture={cancelPanelGesture}
                className="relative min-h-[24rem] touch-pan-y p-4 sm:min-h-[27rem] sm:p-9 lg:min-h-[28rem] lg:p-10"
                style={prefersReducedMotion ? undefined : { x: touchDragXSmooth }}
              >
                <AnimatePresence initial={false} custom={direction} mode="sync">
                  <motion.div
                    key={active.id}
                    data-contact-pathway-shot
                    custom={direction}
                    variants={PATHWAY_SHOT_VARIANTS}
                    initial={prefersReducedMotion ? false : "enter"}
                    animate="centre"
                    exit={prefersReducedMotion ? undefined : "exit"}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: EASE_AIR }}
                    style={{ transformOrigin: "50% 50%" }}
                    className="absolute inset-4 flex flex-col sm:inset-9 lg:inset-10"
                  >
                  <ContactPathwayFilm key={active.id} {...active.film} />

                  <div className="relative z-10 flex min-h-full flex-col pt-[6.75rem] sm:pr-[39%] sm:pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[0.68rem] font-medium uppercase tracking-[0.22em] text-clay">
                        {active.label}
                      </span>
                      <span className="font-display text-2xl text-soil/25 sm:hidden" aria-hidden="true">
                        {active.index}
                      </span>
                    </div>

                    <p data-contact-pathway-title className="mt-4 max-w-xl font-display text-[clamp(1.65rem,7.2vw,2.2rem)] font-normal leading-[1.02] text-soil sm:mt-7 sm:text-[clamp(1.85rem,3.2vw,2.75rem)]">
                      {active.title}
                    </p>
                    <p data-contact-pathway-description className="mt-3 max-w-lg text-[0.78rem] leading-relaxed text-soil/68 sm:mt-4 sm:text-sm lg:text-base">
                      {active.description}
                    </p>
                    <p data-contact-pathway-best className="mt-3 max-w-lg border-l border-clay/25 pl-3 text-[0.72rem] leading-relaxed text-soil/58 sm:text-xs lg:text-sm">
                      <span className="font-medium text-clay">Best when:</span>{" "}
                      {active.bestWhen}
                    </p>
                    {active.id === "book" && selectedPackage ? (
                      <p
                        data-contact-pathway-package
                        className="mt-3 w-fit max-w-full rounded-full border border-clay/18 bg-clay/[0.06] px-3 py-1.5 text-[0.64rem] font-medium leading-relaxed text-clay sm:text-xs"
                      >
                        Carrying your {selectedPackage.name} choice
                      </p>
                    ) : null}
                    <PathwayHandoff
                      pathway={active}
                      detail={activeDetail}
                      reducedMotion={prefersReducedMotion}
                    />

                    <div data-contact-pathway-actions className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:flex sm:flex-wrap sm:gap-3">
                      {active.id === "book" && (
                      <>
                        <a
                          href={bookingHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() =>
                            track("calendar_opened", {
                              source: "contact_pathways",
                              ...(servicePackage ? { package: servicePackage } : {}),
                            })
                          }
                          data-cursor-label="See available times"
                          className={primaryActionClass}
                        >
                          See available times
                          <ArrowUpRight aria-hidden="true" className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </a>
                        <a
                          href="#call"
                          onClick={() =>
                            track("contact_route_selected", {
                              source: "contact_pathways",
                              route: "call_flow",
                            })
                          }
                          data-cursor-label="See the call flow"
                          className={secondaryActionClass}
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
                          onClick={() =>
                            track("contact_route_selected", {
                              source: "contact_pathways",
                              route: "call",
                            })
                          }
                          data-cursor-label="Call Suman"
                          className={primaryActionClass}
                        >
                          <Phone aria-hidden="true" className="mr-2 h-4 w-4" />
                          Call Suman
                        </a>
                        <a
                          href={site.phone.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() =>
                            track("contact_route_selected", {
                              source: "contact_pathways",
                              route: "whatsapp",
                            })
                          }
                          data-cursor-label="Open WhatsApp"
                          className={secondaryActionClass}
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
                          onClick={() =>
                            track("contact_route_selected", {
                              source: "contact_pathways",
                              route: "write",
                            })
                          }
                          data-cursor-label="Start the note"
                          className={primaryActionClass}
                        >
                          Start the note
                          <ArrowDown aria-hidden="true" className="ml-2 h-4 w-4" />
                        </a>
                        <a
                          href={`mailto:${site.email}`}
                          onClick={() =>
                            track("contact_route_selected", {
                              source: "contact_pathways",
                              route: "email",
                            })
                          }
                          data-cursor-label="Email Suman"
                          className={secondaryActionClass}
                        >
                          Email instead
                          <ArrowUpRight aria-hidden="true" className="ml-2 h-4 w-4" />
                        </a>
                      </>
                    )}
                    </div>
                  </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
