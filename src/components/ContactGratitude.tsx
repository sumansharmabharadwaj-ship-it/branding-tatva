"use client";

import {
  useCallback,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/Container";
import { TrackedLink } from "@/components/TrackedLink";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { EASE_AIR } from "@/lib/motion";

type GratitudeNote = {
  label: string;
  response: string;
};

const NOTES: GratitudeNote[] = [
  {
    label: "your time",
    response: "Time given to the right question is already part of the work.",
  },
  {
    label: "your curiosity",
    response: "Curiosity notices the gap before a brief can name it.",
  },
  {
    label: "your candour",
    response: "Candour gives the conversation something real to examine.",
  },
  {
    label: "your unfinished thought",
    response: "An unfinished thought can still reveal where perception has drifted.",
  },
];

const DEFAULT_RESPONSE =
  "Time, curiosity, candour, and an unfinished thought can all begin the work.";
const COMPLETE_RESPONSE = "That is enough for a precise first conversation.";
const RESPONSES = [DEFAULT_RESPONSE, ...NOTES.map((note) => note.response), COMPLETE_RESPONSE];
const ALL_NOTES_VISITED = (1 << NOTES.length) - 1;

type GratitudeNoteProps = {
  note: GratitudeNote;
  index: number;
  progress: MotionValue<number>;
  activeNote: number | null;
  selected: boolean;
  visited: boolean;
  reducedMotion: boolean;
  buttonRef: (node: HTMLButtonElement | null) => void;
  onActiveNoteChange: (index: number | null) => void;
  onBlurNote: () => void;
  onNavigate: (index: number, key: string) => void;
  onSelect: (index: number) => void;
};

function GratitudeNote({
  note,
  index,
  progress,
  activeNote,
  selected,
  visited,
  reducedMotion,
  buttonRef,
  onActiveNoteChange,
  onBlurNote,
  onNavigate,
  onSelect,
}: GratitudeNoteProps) {
  const arrivalStart = 0.1 + index * 0.045;
  const arrivalEnd = 0.38 + index * 0.045;
  const y = useTransform(progress, [arrivalStart, arrivalEnd, 0.88, 1], [24, 0, 0, -6]);
  const opacity = useTransform(
    progress,
    [arrivalStart, arrivalEnd, 0.94, 1],
    [0.2, 1, 1, 0.72],
  );
  const active = activeNote === index;
  const noteState = visited && !active ? ", already received" : "";

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      aria-label={`${selected ? "Close" : "Open"} acknowledgement for ${note.label}${noteState}`}
      aria-pressed={selected}
      aria-controls="contact-gratitude-response"
      onClick={() => onSelect(index)}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") onActiveNoteChange(index);
      }}
      onFocus={() => onActiveNoteChange(index)}
      onBlur={onBlurNote}
      onKeyDown={(event) => {
        if (
          event.key === "ArrowDown" ||
          event.key === "ArrowRight" ||
          event.key === "ArrowUp" ||
          event.key === "ArrowLeft" ||
          event.key === "Home" ||
          event.key === "End"
        ) {
          event.preventDefault();
          onNavigate(index, event.key);
        }
      }}
      data-contact-gratitude-note
      data-contact-gratitude-visited={visited ? "true" : undefined}
      data-cursor-label={selected ? "Close note" : "Receive note"}
      className="group relative grid min-h-16 w-full grid-cols-[1.7rem_1fr] items-center gap-2 overflow-hidden px-3 py-3 text-left text-ivory focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone sm:min-h-[4.5rem] sm:grid-cols-[2.25rem_1fr_auto] sm:gap-3 sm:px-4 lg:min-h-[5.35rem] lg:border-t lg:border-white/18 lg:px-1 lg:last:border-b"
      initial={false}
      animate={{ color: active ? "rgb(246,242,234)" : "rgba(246,242,234,0.82)" }}
      transition={{ duration: reducedMotion ? 0 : 0.32, ease: EASE_AIR }}
      whileTap={reducedMotion ? undefined : { scale: 0.985 }}
      style={reducedMotion ? undefined : { y, opacity, willChange: "transform, opacity" }}
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 origin-left bg-ivory/[0.09]"
        initial={false}
        animate={{ scaleX: active ? 1 : 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.46, ease: EASE_AIR }}
      />
      <motion.span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-px origin-top bg-sandstone"
        initial={false}
        animate={{ scaleY: active || visited ? 1 : 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.44, ease: EASE_AIR }}
      />
      <span className="relative text-[0.57rem] font-medium tracking-[0.18em] text-sandstone/78 sm:text-[0.62rem]">
        0{index + 1}
      </span>
      <span className="relative font-display text-[1.08rem] font-normal leading-[1.02] sm:text-xl lg:text-[1.42rem]">
        {note.label}
      </span>
      <motion.span
        aria-hidden="true"
        className="relative hidden text-[0.57rem] font-medium uppercase tracking-[0.16em] text-sandstone sm:block"
        initial={false}
        animate={{ opacity: visited ? 1 : 0.48, x: active ? 0 : -3 }}
        transition={{ duration: reducedMotion ? 0 : 0.3, ease: EASE_AIR }}
      >
        {visited ? "received" : "open"}
      </motion.span>
    </motion.button>
  );
}

/**
 * Contact closes with a direct acknowledgement rather than a reward loop.
 * The statement assembles with native scroll, the four words respond to
 * pointer, touch, and keyboard input, and both onward routes remain available.
 */
export function ContactGratitude() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const noteRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [activeNote, setActiveNote] = useState<number | null>(null);
  const [selectedNote, setSelectedNote] = useState<number | null>(null);
  const [visitedNotes, setVisitedNotes] = useState(0);
  const reducedMotion = useHydratedReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start end", "end start"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 108,
    damping: 27,
    mass: 0.36,
  });

  const thankX = useTransform(progress, [0, 0.34, 0.76, 1], [-72, 0, 0, 18]);
  const thankRotate = useTransform(progress, [0, 0.34, 0.76, 1], [-2.4, 0, 0, 0.8]);
  const youX = useTransform(progress, [0, 0.34, 0.76, 1], [72, 0, 0, -18]);
  const youRotate = useTransform(progress, [0, 0.34, 0.76, 1], [2.4, 0, 0, -0.8]);
  const resolveY = useTransform(progress, [0.12, 0.44, 0.82, 1], [30, 0, 0, -10]);
  const resolveOpacity = useTransform(progress, [0.12, 0.4, 0.9, 1], [0.24, 1, 1, 0.76]);
  const copyClip = useTransform(
    progress,
    [0.18, 0.48, 0.84, 1],
    ["inset(0 100% 0 0%)", "inset(0 0% 0 0%)", "inset(0 0% 0 0%)", "inset(0 10% 0 0%)"],
  );
  const signalScale = useTransform(progress, [0.1, 0.7], [0, 1]);
  const nextY = useTransform(progress, [0.22, 0.5, 0.9, 1], [22, 0, 0, -4]);
  const nextOpacity = useTransform(progress, [0.22, 0.46, 0.94, 1], [0, 1, 1, 0.82]);

  const allNotesVisited = visitedNotes === ALL_NOTES_VISITED;
  const visitedCount = NOTES.reduce(
    (count, _note, index) => count + ((visitedNotes & (1 << index)) === 0 ? 0 : 1),
    0,
  );
  const warmthOpacity = 0.06 + visitedCount * 0.025 + (activeNote === null ? 0 : 0.025);
  const responseIndex =
    activeNote === null
      ? allNotesVisited
        ? RESPONSES.length - 1
        : 0
      : activeNote + 1;
  const activeResponse = RESPONSES[responseIndex];

  const handleActiveNoteChange = useCallback((index: number | null) => {
    setActiveNote(index);
    if (index !== null) {
      setVisitedNotes((current) => current | (1 << index));
    }
  }, []);

  const handleNoteSelect = useCallback(
    (index: number) => {
      const nextSelectedNote = selectedNote === index ? null : index;
      setSelectedNote(nextSelectedNote);
      handleActiveNoteChange(nextSelectedNote);
    },
    [handleActiveNoteChange, selectedNote],
  );

  const handleNoteBlur = useCallback(() => {
    setActiveNote(selectedNote);
  }, [selectedNote]);

  const handleNoteNavigate = useCallback((index: number, key: string) => {
    const lastIndex = NOTES.length - 1;
    let nextIndex = index;

    if (key === "ArrowDown" || key === "ArrowRight") {
      nextIndex = (index + 1) % NOTES.length;
    } else if (key === "ArrowUp" || key === "ArrowLeft") {
      nextIndex = (index - 1 + NOTES.length) % NOTES.length;
    } else if (key === "Home") {
      nextIndex = 0;
    } else if (key === "End") {
      nextIndex = lastIndex;
    }

    noteRefs.current[nextIndex]?.focus();
  }, []);

  function handleScenePointerDown(event: PointerEvent<HTMLDivElement>) {
    const target = event.target;
    if (target instanceof Element && !target.closest("[data-contact-gratitude-note]")) {
      setSelectedNote(null);
      setActiveNote(null);
    }
  }

  function handleSceneKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" && activeNote !== null) {
      setSelectedNote(null);
      setActiveNote(null);
    }
  }

  return (
    <div
      ref={sceneRef}
      data-contact-gratitude
      data-contact-gratitude-complete={allNotesVisited ? "true" : undefined}
      data-contact-gratitude-active={activeNote === null ? undefined : "true"}
      onPointerDown={handleScenePointerDown}
      onKeyDown={handleSceneKeyDown}
      className="relative flex min-h-[100svh] w-full items-center py-10 sm:py-14"
    >
      <motion.div
        aria-hidden="true"
        data-contact-gratitude-warmth
        className="pointer-events-none absolute inset-0 z-0 bg-sandstone mix-blend-soft-light"
        initial={false}
        animate={{ opacity: warmthOpacity }}
        transition={{ duration: reducedMotion ? 0 : 0.72, ease: EASE_AIR }}
      />

      <Container className="relative z-10 w-full">
        <div
          data-contact-gratitude-layout
          className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(22rem,0.72fr)] lg:gap-[clamp(4rem,8vw,9rem)]"
        >
          <div data-contact-gratitude-copy className="max-w-[48rem]">
            <p className="text-[0.64rem] font-medium uppercase tracking-[0.26em] text-sandstone sm:text-[0.68rem]">
              One last thought
            </p>

            <h2
              id="contact-gratitude-heading"
              aria-label="Thank you for staying with the question."
              data-contact-gratitude-heading
              className="mt-4 font-display font-normal text-ivory"
            >
              <span
                aria-hidden="true"
                className="flex gap-[0.16em] overflow-hidden text-[clamp(4.6rem,10.6vw,9.5rem)] leading-[0.76] tracking-[-0.045em]"
              >
                <motion.span
                  className="block"
                  style={
                    reducedMotion
                      ? undefined
                      : { x: thankX, rotate: thankRotate, willChange: "transform" }
                  }
                >
                  Thank
                </motion.span>
                <motion.span
                  className="block italic text-sandstone"
                  style={
                    reducedMotion
                      ? undefined
                      : { x: youX, rotate: youRotate, willChange: "transform" }
                  }
                >
                  you.
                </motion.span>
              </span>
              <motion.span
                aria-hidden="true"
                className="mt-4 block max-w-[11.5em] text-[clamp(2rem,4.5vw,4.5rem)] leading-[0.94] tracking-[-0.025em] text-ivory/94"
                style={
                  reducedMotion
                    ? undefined
                    : { y: resolveY, opacity: resolveOpacity, willChange: "transform, opacity" }
                }
              >
                for staying with the question.
              </motion.span>
            </h2>

            <motion.div
              data-contact-gratitude-statement
              className="mt-5 max-w-xl border-l border-sandstone/48 pl-4 sm:mt-7 sm:pl-5"
              style={reducedMotion ? undefined : { clipPath: copyClip, willChange: "clip-path" }}
            >
              <p className="text-sm leading-relaxed text-ivory/76 sm:text-base">
                Most brand decisions get rushed at the exact moment they need better language. You gave yours a little more room.
              </p>
            </motion.div>

            <motion.div
              data-contact-gratitude-next
              aria-hidden="false"
              className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap"
              style={
                reducedMotion
                  ? undefined
                  : { y: nextY, opacity: nextOpacity, willChange: "transform, opacity" }
              }
            >
              <TrackedLink
                href="#call"
                event="contact_route_selected"
                eventProps={{ source: "contact_gratitude", route: "booking" }}
                data-cursor-label="Book the conversation"
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-ivory px-5 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-soil transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-sandstone focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ivory"
              >
                Bring it to a 30 minute call
                <ArrowRight
                  aria-hidden="true"
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={1.6}
                />
              </TrackedLink>
              <TrackedLink
                href="/insights"
                aria-label="Carry a question into the field notes"
                event="contact_route_selected"
                eventProps={{ source: "contact_gratitude", route: "insights" }}
                data-cursor-label="Open field notes"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-ivory/28 bg-soil/16 px-5 py-3 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-ivory backdrop-blur-lg transition-[transform,background-color,border-color] duration-300 hover:-translate-y-0.5 hover:border-sandstone/58 hover:bg-ivory/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sandstone"
              >
                Read the field notes
                <ArrowRight
                  aria-hidden="true"
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={1.5}
                />
              </TrackedLink>
            </motion.div>
          </div>

          <motion.div
            data-contact-gratitude-ledger
            className="min-w-0"
            style={reducedMotion ? undefined : { y: resolveY, opacity: resolveOpacity }}
          >
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[0.61rem] font-medium uppercase tracking-[0.22em] text-sandstone">
                  What you brought
                </p>
                <p className="mt-2 max-w-xs font-display text-xl leading-tight text-ivory/88 sm:text-2xl">
                  A useful first conversation begins here.
                </p>
              </div>
              <span className="hidden pb-1 text-[0.58rem] font-medium uppercase tracking-[0.18em] text-ivory/60 sm:block">
                four acknowledgements
              </span>
            </div>

            <div
              data-contact-gratitude-notes
              data-contact-gratitude-flow="continuous"
              onPointerLeave={(event) => {
                const focusedInside =
                  document.activeElement instanceof Node &&
                  event.currentTarget.contains(document.activeElement);

                if (event.pointerType === "mouse" && !focusedInside) {
                  setActiveNote(selectedNote);
                }
              }}
              className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[1.35rem] border border-white/16 bg-white/12 backdrop-blur-xl sm:mt-5 lg:block lg:overflow-visible lg:rounded-none lg:border-0 lg:bg-transparent lg:backdrop-blur-none"
            >
              {NOTES.map((note, index) => (
                <GratitudeNote
                  key={note.label}
                  note={note}
                  index={index}
                  progress={progress}
                  activeNote={activeNote}
                  selected={selectedNote === index}
                  visited={(visitedNotes & (1 << index)) !== 0}
                  reducedMotion={reducedMotion}
                  buttonRef={(node) => {
                    noteRefs.current[index] = node;
                  }}
                  onActiveNoteChange={handleActiveNoteChange}
                  onBlurNote={handleNoteBlur}
                  onNavigate={handleNoteNavigate}
                  onSelect={handleNoteSelect}
                />
              ))}
            </div>

            <div
              id="contact-gratitude-response"
              data-contact-gratitude-response
              className="relative mt-4 min-h-[4.25rem] overflow-hidden border-l border-sandstone/48 pl-4 font-display text-lg italic leading-snug text-sandstone sm:min-h-[3.5rem] sm:text-xl"
            >
              <p className="sr-only" aria-live="polite" aria-atomic="true">
                {activeResponse}
              </p>
              {RESPONSES.map((response, index) => {
                const active = index === responseIndex;
                const leavesLeft = index < responseIndex;

                return (
                  <motion.p
                    key={response}
                    aria-hidden="true"
                    className="absolute left-4 right-0 top-0"
                    initial={false}
                    animate={
                      active
                        ? { clipPath: "inset(0 0% 0 0%)", x: 0, opacity: 1 }
                        : leavesLeft
                          ? { clipPath: "inset(0 100% 0 0%)", x: -14, opacity: 0 }
                          : { clipPath: "inset(0 0% 0 100%)", x: 14, opacity: 0 }
                    }
                    transition={{ duration: reducedMotion ? 0 : 0.42, ease: EASE_AIR }}
                  >
                    {response}
                  </motion.p>
                );
              })}
            </div>

            <div
              data-contact-gratitude-progress
              role="progressbar"
              aria-label="Acknowledgements received"
              aria-valuemin={0}
              aria-valuemax={NOTES.length}
              aria-valuenow={visitedCount}
              aria-valuetext={
                allNotesVisited
                  ? "All four acknowledgements received"
                  : `${visitedCount} of ${NOTES.length} acknowledgements received`
              }
              className="mt-3 grid grid-cols-[1fr_auto] items-center gap-4"
            >
              <motion.span
                aria-hidden="true"
                className="h-px overflow-hidden bg-ivory/18"
                style={reducedMotion ? undefined : { scaleX: signalScale, transformOrigin: "0 50%" }}
              >
                <motion.span
                  className="block h-full origin-left bg-sandstone"
                  initial={false}
                  animate={{ scaleX: visitedCount / NOTES.length }}
                  transition={{ duration: reducedMotion ? 0 : 0.5, ease: EASE_AIR }}
                />
              </motion.span>
              <span aria-hidden="true" className="text-[0.58rem] font-medium uppercase tracking-[0.17em] text-ivory/64">
                0{visitedCount} / 04 received
              </span>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
