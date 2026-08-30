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
import { Container } from "@/components/Container";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { EASE_AIR } from "@/lib/motion";
import { cn } from "@/lib/utils";

type GratitudeNote = {
  label: string;
  response: string;
  position: string;
  x: number[];
  y: number[];
  rotate: number[];
};

const NOTES: GratitudeNote[] = [
  {
    label: "your time",
    response: "Your time was felt here, never counted.",
    position: "xl:left-[5%] xl:top-[20%]",
    x: [-58, 0, 0, 28],
    y: [22, 0, 0, -16],
    rotate: [-4, 0, 0, 2],
  },
  {
    label: "your curiosity",
    response: "Curiosity is already a beginning.",
    position: "xl:right-[5%] xl:top-[24%]",
    x: [54, 0, 0, -24],
    y: [30, 0, 0, -12],
    rotate: [4, 0, 0, -2],
  },
  {
    label: "your honesty",
    response: "Honesty gives the work somewhere true to begin.",
    position: "xl:bottom-[15%] xl:left-[11%]",
    x: [-42, 0, 0, 20],
    y: [-18, 0, 0, 14],
    rotate: [3, 0, 0, -1.5],
  },
  {
    label: "your unfinished thought",
    response: "An unfinished thought is welcome exactly as it arrives.",
    position: "xl:bottom-[12%] xl:right-[9%]",
    x: [48, 0, 0, -26],
    y: [-24, 0, 0, 18],
    rotate: [-3, 0, 0, 1.5],
  },
];

type GratitudeNoteProps = {
  note: GratitudeNote;
  index: number;
  progress: MotionValue<number>;
  activeNote: number | null;
  visited: boolean;
  reducedMotion: boolean;
  onActiveNoteChange: (index: number | null) => void;
};

function GratitudeNote({
  note,
  index,
  progress,
  activeNote,
  visited,
  reducedMotion,
  onActiveNoteChange,
}: GratitudeNoteProps) {
  const x = useTransform(progress, [0, 0.36, 0.74, 1], note.x);
  const y = useTransform(progress, [0, 0.36, 0.74, 1], note.y);
  const rotate = useTransform(progress, [0, 0.36, 0.74, 1], note.rotate);
  const scale = useTransform(progress, [0, 0.34, 0.78, 1], [0.9, 1, 1, 0.97]);
  const active = activeNote === index;
  const noteState = visited && !active ? ", already received" : "";

  return (
    <motion.button
      type="button"
      aria-label={`${active ? "Close" : "Open"} acknowledgement for ${note.label}${noteState}`}
      aria-pressed={active}
      aria-controls="contact-gratitude-response"
      onClick={() => onActiveNoteChange(active ? null : index)}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") onActiveNoteChange(index);
      }}
      onPointerLeave={(event) => {
        if (
          event.pointerType === "mouse" &&
          document.activeElement !== event.currentTarget
        ) {
          onActiveNoteChange(null);
        }
      }}
      onFocus={() => onActiveNoteChange(index)}
      onBlur={() => onActiveNoteChange(null)}
      data-contact-gratitude-note
      data-contact-gratitude-visited={visited ? "true" : undefined}
      data-cursor-label={active ? "Close note" : "Open note"}
      className={cn(
        "relative flex min-h-16 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-soil/20 px-4 py-3 text-center text-ivory shadow-[0_16px_48px_rgba(10,18,12,0.14)] backdrop-blur-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sandstone sm:min-h-[4.5rem] sm:px-5 xl:absolute xl:w-[13rem]",
        note.position,
      )}
      initial={false}
      animate={{
        backgroundColor: active ? "rgba(246,242,234,0.92)" : "rgba(39,34,30,0.2)",
        borderColor: active
          ? "rgba(246,242,234,0.68)"
          : visited
            ? "rgba(212,185,154,0.5)"
            : "rgba(255,255,255,0.25)",
        color: active
          ? "rgb(39,34,30)"
          : visited
            ? "rgb(226,204,176)"
            : "rgb(246,242,234)",
      }}
      transition={{ duration: reducedMotion ? 0 : 0.32, ease: EASE_AIR }}
      whileTap={reducedMotion ? undefined : { scale: 0.98 }}
      style={reducedMotion ? undefined : { x, y, rotate, scale, willChange: "transform" }}
    >
      <motion.span
        className="block font-display text-base font-normal leading-tight sm:text-lg"
        animate={{ y: active ? 0 : 1, scaleX: active ? 1.035 : 1 }}
        transition={{ duration: reducedMotion ? 0 : 0.3, ease: EASE_AIR }}
      >
        {note.label}
      </motion.span>
    </motion.button>
  );
}

const DEFAULT_RESPONSE = "Take the clarity with you. The rest can arrive in its own time.";
const COMPLETE_RESPONSE = "Every part of what you brought belongs here.";
const RESPONSES = [DEFAULT_RESPONSE, ...NOTES.map((note) => note.response), COMPLETE_RESPONSE];
const ALL_NOTES_VISITED = (1 << NOTES.length) - 1;

/**
 * A non-conversion ending for Contact. The visitor's attention is treated as
 * something received, rather than another metric: the sentence assembles with
 * scroll, while four small acknowledgements offer optional hover/tap details.
 */
export function ContactGratitude() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [activeNote, setActiveNote] = useState<number | null>(null);
  const [visitedNotes, setVisitedNotes] = useState(0);
  const reducedMotion = useHydratedReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start end", "end start"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 112,
    damping: 28,
    mass: 0.34,
  });

  const thankX = useTransform(progress, [0, 0.36, 0.72, 1], [-52, 0, 0, 22]);
  const thankRotate = useTransform(progress, [0, 0.36, 0.72, 1], [-3, 0, 0, 1]);
  const youX = useTransform(progress, [0, 0.36, 0.72, 1], [52, 0, 0, -22]);
  const youRotate = useTransform(progress, [0, 0.36, 0.72, 1], [3, 0, 0, -1]);
  const resolveY = useTransform(progress, [0, 0.4, 0.74, 1], [28, 0, 0, -12]);
  const resolveScaleX = useTransform(progress, [0, 0.4, 0.74, 1], [0.86, 1, 1, 0.97]);
  const copyClip = useTransform(
    progress,
    [0.18, 0.46, 0.78, 1],
    ["inset(0 50% 0 50%)", "inset(0 0% 0 0%)", "inset(0 0% 0 0%)", "inset(0 8% 0 8%)"],
  );
  const allNotesVisited = visitedNotes === ALL_NOTES_VISITED;
  const visitedCount = NOTES.reduce(
    (count, _note, index) => count + ((visitedNotes & (1 << index)) === 0 ? 0 : 1),
    0,
  );
  const warmthOpacity = 0.015 + visitedCount * 0.024 + (activeNote === null ? 0 : 0.018);
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

  function handleScenePointerDown(event: PointerEvent<HTMLDivElement>) {
    const target = event.target;
    if (target instanceof Element && !target.closest("[data-contact-gratitude-note]")) {
      setActiveNote(null);
    }
  }

  function handleSceneKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" && activeNote !== null) {
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
      className="relative flex min-h-[100svh] w-full items-center py-12 sm:py-16"
    >
      <motion.div
        aria-hidden="true"
        data-contact-gratitude-warmth
        className="pointer-events-none absolute inset-0 z-0 bg-sandstone mix-blend-soft-light"
        initial={false}
        animate={{ opacity: warmthOpacity }}
        transition={{ duration: reducedMotion ? 0 : 0.68, ease: EASE_AIR }}
      />

      <Container className="relative z-10 w-full">
        <div className="mx-auto flex max-w-[52rem] flex-col items-center text-center">
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.26em] text-sandstone">
            A small return
          </p>

          <h2
            id="contact-gratitude-heading"
            aria-label="Thank you for bringing your attention here."
            data-contact-gratitude-heading
            className="mt-5 font-display font-normal text-ivory"
          >
            <span aria-hidden="true" className="flex justify-center gap-[0.18em] text-[clamp(4rem,10.5vw,9rem)] leading-[0.78]">
              <motion.span
                className="block"
                style={reducedMotion ? undefined : { x: thankX, rotate: thankRotate, willChange: "transform" }}
              >
                Thank
              </motion.span>
              <motion.span
                className="block italic text-sandstone"
                style={reducedMotion ? undefined : { x: youX, rotate: youRotate, willChange: "transform" }}
              >
                you
              </motion.span>
            </span>
            <motion.span
              aria-hidden="true"
              className="mx-auto mt-3 block max-w-2xl text-[clamp(1.7rem,4vw,3.8rem)] leading-[0.96] text-ivory/92"
              style={
                reducedMotion
                  ? undefined
                  : {
                      y: resolveY,
                      scaleX: resolveScaleX,
                      transformOrigin: "50% 50%",
                      willChange: "transform",
                    }
              }
            >
              for bringing your attention here.
            </motion.span>
          </h2>

          <motion.div
            className="mt-7 max-w-xl"
            style={reducedMotion ? undefined : { clipPath: copyClip, willChange: "clip-path" }}
          >
            <p className="text-sm leading-relaxed text-ivory/76 sm:text-base">
              Whether we work together or this visit simply helped you name what matters, I am glad you found your way here.
            </p>
            <div
              id="contact-gratitude-response"
              data-contact-gratitude-response
              className="relative mt-3 min-h-[3.25rem] overflow-hidden font-display text-lg italic text-sandstone sm:min-h-[2rem] sm:text-xl"
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
                    className="absolute inset-x-0 top-0"
                    initial={false}
                    animate={
                      active
                        ? { clipPath: "inset(0 0% 0 0%)", x: 0 }
                        : leavesLeft
                          ? { clipPath: "inset(0 100% 0 0%)", x: -16 }
                          : { clipPath: "inset(0 0% 0 100%)", x: 16 }
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
              className="mx-auto mt-4 flex w-fit items-center gap-3 rounded-full border border-white/12 bg-soil/18 px-3 py-2 backdrop-blur-md"
            >
              <span aria-hidden="true" className="flex items-center gap-1.5">
                {NOTES.map((note, index) => {
                  const noteVisited = (visitedNotes & (1 << index)) !== 0;
                  return (
                    <motion.span
                      key={note.label}
                      className="block h-1.5 w-5 rounded-full"
                      initial={false}
                      animate={{
                        backgroundColor: noteVisited
                          ? "rgba(212,185,154,0.92)"
                          : "rgba(246,242,234,0.2)",
                        scaleX: noteVisited ? 1 : 0.72,
                      }}
                      transition={{
                        duration: reducedMotion ? 0 : 0.32,
                        ease: EASE_AIR,
                      }}
                    />
                  );
                })}
              </span>
              <span aria-hidden="true" className="text-[0.58rem] font-medium uppercase tracking-[0.16em] text-ivory/58">
                {allNotesVisited ? "All four received" : `${visitedCount} of ${NOTES.length}`}
              </span>
            </div>
          </motion.div>

          <div className="mt-8 grid w-full grid-cols-2 gap-2.5 sm:mt-10 sm:gap-3 xl:contents">
            {NOTES.map((note, index) => (
              <GratitudeNote
                key={note.label}
                note={note}
                index={index}
                progress={progress}
                activeNote={activeNote}
                visited={(visitedNotes & (1 << index)) !== 0}
                reducedMotion={reducedMotion}
                onActiveNoteChange={handleActiveNoteChange}
              />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
