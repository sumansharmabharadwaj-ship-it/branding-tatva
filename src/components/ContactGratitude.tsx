"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/Container";
import { TrackedLink } from "@/components/TrackedLink";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
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
const COMPLETION_SETTLE_MS = 920;
const REVISIT_ENTER_PROGRESS = 0.455;
const REVISIT_EXIT_PROGRESS = 0.485;
/* The final scene sits directly above the compact footer, so its usable
   progress tops out a little above 0.54 on a desktop viewport. Keep the last
   beat inside that real range: every acknowledgement can resolve through
   natural scrolling instead of requiring a click to finish the sequence. */
const SCROLL_RECEIVE_THRESHOLDS = [0.24, 0.34, 0.44, 0.52] as const;

function GratitudeWord({
  word,
  index,
  progress,
  reducedMotion,
}: {
  word: string;
  index: number;
  progress: MotionValue<number>;
  reducedMotion: boolean;
}) {
  const start = 0.12 + index * 0.065;
  const y = useTransform(progress, [start, start + 0.46], ["0.65em", "0em"]);
  const opacity = useTransform(progress, [start, start + 0.38], [0.18, 1]);

  return (
    <span className="inline-block overflow-hidden pb-[0.12em] align-top">
      <motion.span
        data-contact-gratitude-word
        className="inline-block"
        style={reducedMotion ? { y: 0, opacity: 1 } : { y, opacity }}
      >
        {word}
      </motion.span>
    </span>
  );
}

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
  const status = selected ? "close" : active ? "reading" : visited ? "received" : "open";

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      aria-label={`${selected ? "Close" : "Open"} acknowledgement for ${note.label}${noteState}`}
      aria-current={active ? "step" : undefined}
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
      data-contact-gratitude-note-active={active ? "true" : undefined}
      data-contact-gratitude-visited={visited ? "true" : undefined}
      data-cursor-label={selected ? "Close note" : visited ? "Reopen note" : "Receive note"}
      className="group relative grid min-h-16 w-full grid-cols-[1.7rem_1fr] items-center gap-2 overflow-hidden px-3 py-3 text-left text-ivory focus-visible:z-10 focus-visible:outline-none sm:min-h-[4.5rem] sm:grid-cols-[2.25rem_1fr_auto] sm:gap-3 sm:px-4 lg:min-h-[5.35rem] lg:border-t lg:border-white/18 lg:px-1 lg:last:border-b"
      initial={false}
      animate={{ color: active ? "rgb(246,242,234)" : "rgba(246,242,234,0.94)" }}
      transition={{ duration: reducedMotion ? 0 : 0.32, ease: EASE_AIR }}
      whileTap={reducedMotion ? undefined : { scale: 0.985 }}
      style={reducedMotion ? { y: 0, opacity: 1 } : { y, opacity, willChange: "transform, opacity" }}
    >
      {active ? (
        <>
          <motion.span
            layoutId="contact-gratitude-focus-baton"
            aria-hidden="true"
            data-contact-gratitude-focus-baton
            className="absolute inset-0 bg-gradient-to-r from-sandstone/[0.16] via-ivory/[0.07] to-transparent"
            initial={false}
            transition={{ duration: reducedMotion ? 0 : 0.48, ease: EASE_AIR }}
          />
          <motion.span
            layoutId="contact-gratitude-reading-head"
            aria-hidden="true"
            data-contact-gratitude-reading-head
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] hidden h-px origin-left lg:block"
            initial={false}
            transition={{ duration: reducedMotion ? 0 : 0.48, ease: EASE_AIR }}
          />
        </>
      ) : null}
      <motion.span
        aria-hidden="true"
        data-contact-gratitude-receipt
        className="pointer-events-none absolute inset-y-2 left-0 w-[46%] origin-left bg-gradient-to-r from-sandstone/20 to-transparent"
        initial={false}
        animate={{
          opacity: visited && !active ? 0.72 : 0,
          scaleX: visited ? 1 : 0,
        }}
        transition={{ duration: reducedMotion ? 0 : 0.62, ease: EASE_AIR }}
      />
      <motion.span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-px origin-top bg-sandstone"
        initial={false}
        animate={{ scaleY: active || visited ? 1 : 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.44, ease: EASE_AIR }}
      />
      <span
        aria-hidden="true"
        data-contact-gratitude-receipt-mark
        className="relative grid h-6 w-6 place-items-center overflow-hidden text-[0.625rem] font-medium tracking-[0.12em] text-sandstone sm:text-[0.6875rem]"
      >
        <motion.span
          className="[grid-area:1/1]"
          initial={false}
          animate={{ y: visited ? -20 : 0, opacity: visited ? 0 : 1 }}
          transition={{ duration: reducedMotion ? 0 : 0.38, ease: EASE_AIR }}
        >
          0{index + 1}
        </motion.span>
        <motion.span
          className="[grid-area:1/1]"
          initial={false}
          animate={{ y: visited ? 0 : 20, opacity: visited ? 1 : 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.48, ease: EASE_AIR }}
        >
          <Check className="h-3.5 w-3.5" strokeWidth={1.6} />
        </motion.span>
      </span>
      <span
        data-contact-gratitude-note-label
        className="relative font-display text-[1.08rem] font-normal leading-[1.02] sm:text-xl lg:text-[1.42rem]"
      >
        {note.label}
      </span>
      <span
        aria-hidden="true"
        data-contact-gratitude-note-status
        className="relative hidden overflow-hidden text-right text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-sandstone sm:grid"
      >
        <span className="invisible [grid-area:1/1]">received</span>
        {/* Keep the state word truthful during rapid scroll handoffs. The
            shared focus baton carries the motion between rows, while the
            outgoing label resolves immediately instead of leaving two
            acknowledgements marked as reading. */}
        <span data-contact-gratitude-note-status-state className="block [grid-area:1/1]">
          {status}
        </span>
      </span>
    </motion.button>
  );
}

/**
 * Contact closes with a direct acknowledgement rather than a reward loop.
 * The statement assembles with native scroll, the four words are received in
 * sequence, and pointer, touch, or keyboard can hold one response for closer
 * reading. Both onward routes remain available throughout.
 */
export function ContactGratitude() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const ledgerRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const noteRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const visitedNotesRef = useRef(0);
  const scrollFocusRef = useRef<number | null>(null);
  const [activeNote, setActiveNote] = useState<number | null>(null);
  const [selectedNote, setSelectedNote] = useState<number | null>(null);
  const [visitedNotes, setVisitedNotes] = useState(0);
  const [lastReceivedNote, setLastReceivedNote] = useState<number | null>(null);
  const [scrollFocusNote, setScrollFocusNote] = useState<number | null>(null);
  const [isRevisiting, setIsRevisiting] = useState(false);
  const [announcedResponse, setAnnouncedResponse] = useState("");
  const [completionSettled, setCompletionSettled] = useState(false);
  const reducedMotion = useHydratedReducedMotion();
  const usesSingleColumn = useMediaQuery("(min-width: 1024px)");
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start end", "end start"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 108,
    damping: 27,
    mass: 0.36,
  });
  // On phones the notes sit below the copy. Follow their own viewport entry
  // so receipt and reverse playback happen above the fixed chapter controls.
  const { scrollYProgress: ledgerScrollProgress } = useScroll({
    target: ledgerRef,
    offset: ["start 65%", "end 50%"],
  });
  const ledgerProgress = useSpring(ledgerScrollProgress, {
    stiffness: 108,
    damping: 27,
    mass: 0.36,
  });
  const sequenceProgress = usesSingleColumn ? progress : ledgerProgress;
  const sequenceScrollProgress = usesSingleColumn ? scrollYProgress : ledgerScrollProgress;
  // In a stacked layout the section can be taller than the viewport. Reveal
  // reading content as it enters the frame, independent of the scene's height.
  const { scrollYProgress: statementScrollProgress } = useScroll({
    target: statementRef,
    offset: ["start 95%", "start 70%"],
  });
  const { scrollYProgress: nextScrollProgress } = useScroll({
    target: nextRef,
    offset: ["start 95%", "start 75%"],
  });
  const statementProgress = useSpring(statementScrollProgress, {
    stiffness: 108,
    damping: 27,
    mass: 0.36,
  });
  const nextProgress = useSpring(nextScrollProgress, {
    stiffness: 108,
    damping: 27,
    mass: 0.36,
  });
  // The heading has its own arrival window so the word reveal completes
  // while it is being read, even when the mobile section spans several screens.
  const { scrollYProgress: headingScrollProgress } = useScroll({
    target: headingRef,
    offset: ["start 94%", "start 56%"],
  });
  const headingProgress = useSpring(headingScrollProgress, {
    stiffness: 108,
    damping: 27,
    mass: 0.36,
  });

  /* Parker's strongest interaction idea is that travelling through a scene
     advances its story without asking for a click. Receive each
     acknowledgement as the closing landscape opens, while keeping pointer,
     touch and keyboard inspection available. A backwards scroll never erases
     what the visitor has already received. */
  useMotionValueEvent(sequenceProgress, "change", (currentProgress) => {
    if (reducedMotion) return;

    /* Receipt remains cumulative, but focus follows the visitor in both
       directions. Scrolling back through the closing scene therefore returns
       the shared baton and response to the earlier acknowledgement without
       pretending that it was never received. */
    const nextScrollFocus = SCROLL_RECEIVE_THRESHOLDS.reduce<number | null>(
      (focus, threshold, index) => (currentProgress >= threshold ? index : focus),
      null,
    );

    if (nextScrollFocus !== scrollFocusRef.current) {
      scrollFocusRef.current = nextScrollFocus;
      setScrollFocusNote(nextScrollFocus);
    }

    const receivedFromScroll = SCROLL_RECEIVE_THRESHOLDS.reduce(
      (mask, threshold, index) =>
        currentProgress >= threshold ? mask | (1 << index) : mask,
      0,
    );

    const newlyReceived = receivedFromScroll & ~visitedNotesRef.current;
    if (newlyReceived === 0) return;

    const nextVisitedNotes = visitedNotesRef.current | newlyReceived;
    visitedNotesRef.current = nextVisitedNotes;
    setVisitedNotes(nextVisitedNotes);
    const latestReceivedNote = NOTES.reduce(
      (latest, _note, index) => ((newlyReceived & (1 << index)) === 0 ? latest : index),
      0,
    );
    setLastReceivedNote(latestReceivedNote);
  });

  /* The spring can briefly rebound below the fourth threshold after it has
     completed. Use raw scroll progress and a small hysteresis window to tell
     an intentional upward revisit from that visual rebound. */
  useMotionValueEvent(sequenceScrollProgress, "change", (currentProgress) => {
    if (reducedMotion || !completionSettled) return;

    if (currentProgress <= REVISIT_ENTER_PROGRESS) {
      setIsRevisiting(true);
    } else if (currentProgress >= REVISIT_EXIT_PROGRESS) {
      setIsRevisiting(false);
    }
  });

  const thankX = useTransform(headingProgress, [0, 0.72], [-36, 0]);
  const thankRotate = useTransform(headingProgress, [0, 0.72], [-1.5, 0]);
  const youX = useTransform(headingProgress, [0.08, 0.8], [36, 0]);
  const youRotate = useTransform(headingProgress, [0.08, 0.8], [1.5, 0]);
  const resolveY = useTransform(progress, [0.12, 0.44, 0.82, 1], [30, 0, 0, -10]);
  const resolveOpacity = useTransform(progress, [0.12, 0.4, 0.9, 1], [0.24, 1, 1, 0.76]);
  const copyClip = useTransform(
    statementProgress,
    [0, 1],
    ["inset(0 100% 0 0%)", "inset(0 0% 0 0%)"],
  );
  const signalScale = useTransform(
    sequenceProgress,
    [0.1, SCROLL_RECEIVE_THRESHOLDS[NOTES.length - 1]],
    [0, 1],
  );
  const nextY = useTransform(nextProgress, [0, 1], [22, 0]);
  const nextOpacity = useTransform(nextProgress, [0, 1], [0, 1]);

  const allNotesVisited = visitedNotes === ALL_NOTES_VISITED;
  const sequenceFocusNote = completionSettled && !isRevisiting ? null : scrollFocusNote;
  const visualActiveNote = activeNote ?? sequenceFocusNote;
  const spineSettled = completionSettled && !isRevisiting && activeNote === null;
  // Keep one visual priority at a time. The onward route warms only after the
  // acknowledgement has finished, then yields while a visitor reopens a note.
  const nextReady = completionSettled && visualActiveNote === null;
  const visitedCount = NOTES.reduce(
    (count, _note, index) => count + ((visitedNotes & (1 << index)) === 0 ? 0 : 1),
    0,
  );
  const warmthOpacity =
    0.06 +
    visitedCount * 0.025 +
    (visualActiveNote === null ? 0 : 0.025) +
    (completionSettled ? 0.035 : 0);
  const responseIndex =
    activeNote === null
      ? sequenceFocusNote !== null
        ? sequenceFocusNote + 1
        : completionSettled
          ? RESPONSES.length - 1
          : lastReceivedNote === null
            ? 0
            : lastReceivedNote + 1
      : activeNote + 1;
  const activeResponse = RESPONSES[responseIndex];

  useEffect(() => {
    if (!allNotesVisited || completionSettled) return;

    const settleCompletion = () => {
      // Completion belongs to the scroll sequence. A note opened by pointer,
      // touch or keyboard stays readable until the visitor leaves or closes it.
      setIsRevisiting(
        !reducedMotion && sequenceScrollProgress.get() <= REVISIT_ENTER_PROGRESS,
      );
      setCompletionSettled(true);
    };

    const timer = window.setTimeout(
      settleCompletion,
      reducedMotion ? 0 : COMPLETION_SETTLE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [allNotesVisited, completionSettled, reducedMotion, sequenceScrollProgress]);

  const handleActiveNoteChange = useCallback((index: number | null) => {
    setActiveNote(index);
  }, []);

  const handleNoteSelect = useCallback(
    (index: number) => {
      const nextSelectedNote = selectedNote === index ? null : index;
      const nextVisitedNotes = visitedNotesRef.current | (1 << index);
      visitedNotesRef.current = nextVisitedNotes;
      setVisitedNotes(nextVisitedNotes);
      setLastReceivedNote(index);
      setAnnouncedResponse(nextSelectedNote === null ? "" : NOTES[index].response);
      setSelectedNote(nextSelectedNote);
      handleActiveNoteChange(nextSelectedNote);
      if (nextSelectedNote === null && sequenceScrollProgress.get() > REVISIT_ENTER_PROGRESS) {
        setIsRevisiting(false);
      }
    },
    [handleActiveNoteChange, sequenceScrollProgress, selectedNote],
  );

  const handleNoteBlur = useCallback(() => {
    setActiveNote(selectedNote);
  }, [selectedNote]);

  const handleNoteNavigate = useCallback(
    (index: number, key: string) => {
      // Match the two-column phone/tablet grid and the desktop list. Moving
      // vertically keeps the same column instead of stepping sideways.
      const verticalStep = usesSingleColumn ? 1 : 2;
      let nextIndex = index;

      if (key === "ArrowDown") {
        nextIndex = (index + verticalStep) % NOTES.length;
      } else if (key === "ArrowUp") {
        nextIndex = (index - verticalStep + NOTES.length) % NOTES.length;
      } else if (key === "ArrowRight") {
        nextIndex = (index + 1) % NOTES.length;
      } else if (key === "ArrowLeft") {
        nextIndex = (index - 1 + NOTES.length) % NOTES.length;
      } else if (key === "Home") {
        nextIndex = 0;
      } else if (key === "End") {
        nextIndex = NOTES.length - 1;
      }

      noteRefs.current[nextIndex]?.focus();
    },
    [usesSingleColumn],
  );

  function handleSceneClick(event: MouseEvent<HTMLDivElement>) {
    // A scroll gesture starts with pointerdown too. Dismiss only after a
    // completed click or tap so touch scrolling does not close a held note.
    const target = event.target;
    if (target instanceof Element && !target.closest("[data-contact-gratitude-note]")) {
      setSelectedNote(null);
      setActiveNote(null);
      // Clear the live region so reopening this same note can announce it again.
      setAnnouncedResponse("");
    }
  }

  function handleSceneKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" && activeNote !== null) {
      setSelectedNote(null);
      setActiveNote(null);
      setAnnouncedResponse("");
      if (sequenceScrollProgress.get() > REVISIT_ENTER_PROGRESS) {
        setIsRevisiting(false);
      }
    }
  }

  function handleNextActionFocus(event: FocusEvent<HTMLDivElement>) {
    const target = event.target;
    if (!(target instanceof HTMLAnchorElement) || !target.matches(":focus-visible")) return;

    // Let the browser finish its focus scroll, then account for the fixed
    // header. A short viewport can otherwise leave the preceding action hidden.
    window.requestAnimationFrame(() => {
      if (!target.isConnected || document.activeElement !== target) return;
      const viewport = window.visualViewport;
      const viewportTop = viewport?.offsetTop ?? 0;
      const header = document.querySelector<HTMLElement>("[data-site-header]");
      // Upward focus scrolling can bring a hidden header back into view.
      const headerBottom = header
        ? Math.max(header.offsetHeight, header.getBoundingClientRect().bottom)
        : 0;
      const safeTop = Math.max(viewportTop, headerBottom) + 12;
      const safeBottom = viewportTop + (viewport?.height ?? window.innerHeight) - 12;
      const rect = target.getBoundingClientRect();
      const delta = rect.top < safeTop
        ? rect.top - safeTop
        : rect.bottom > safeBottom
          ? rect.bottom - safeBottom
          : 0;

      if (Math.abs(delta) > 1) window.scrollBy({ top: delta, behavior: "auto" });
    });
  }

  return (
    <div
      ref={sceneRef}
      data-contact-gratitude
      data-contact-gratitude-motion={reducedMotion ? "reduced" : "full"}
      data-contact-gratitude-complete={allNotesVisited ? "true" : undefined}
      data-contact-gratitude-settled={completionSettled ? "true" : undefined}
      data-contact-gratitude-active={activeNote === null ? undefined : "true"}
      data-contact-gratitude-sequence-focus={
        sequenceFocusNote === null ? undefined : String(sequenceFocusNote + 1)
      }
      data-contact-gratitude-scroll-scrub="bidirectional"
      onClick={handleSceneClick}
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
          className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(22rem,0.72fr)] lg:gap-[clamp(3rem,6vw,7rem)]"
        >
          <div data-contact-gratitude-copy className="min-w-0 max-w-[48rem]">
            <p className="text-[0.64rem] font-medium uppercase tracking-[0.26em] text-sandstone sm:text-[0.68rem]">
              One last thought
            </p>

            <h2
              ref={headingRef}
              id="contact-gratitude-heading"
              aria-label="Thank you for staying with the question."
              data-contact-gratitude-heading
              className="mt-4 font-display font-normal text-ivory"
            >
              <span
                aria-hidden="true"
                className="flex gap-[0.16em] overflow-hidden pb-[0.08em] text-[clamp(3.5rem,18vw,4.6rem)] leading-[0.84] tracking-[-0.045em] sm:text-[clamp(4.6rem,10.2vw,9rem)]"
              >
                <motion.span
                  className="block"
                  style={
                    reducedMotion
                      ? { x: 0, rotate: 0 }
                      : { x: thankX, rotate: thankRotate, willChange: "transform" }
                  }
                >
                  Thank
                </motion.span>
                <motion.span
                  className="block italic text-sandstone"
                  style={
                    reducedMotion
                      ? { x: 0, rotate: 0 }
                      : { x: youX, rotate: youRotate, willChange: "transform" }
                  }
                >
                  you.
                </motion.span>
              </span>
              <span
                aria-hidden="true"
                className="mt-3 block max-w-[11.5em] text-[clamp(2rem,4.2vw,4.15rem)] leading-[1.02] tracking-[-0.025em] text-ivory/94"
              >
                {"for staying with the question.".split(" ").map((word, index) => (
                  <span key={word}>
                    {index > 0 ? " " : null}
                    <GratitudeWord
                      word={word}
                      index={index}
                      progress={headingProgress}
                      reducedMotion={reducedMotion}
                    />
                  </span>
                ))}
              </span>
            </h2>

            <motion.div
              ref={statementRef}
              data-contact-gratitude-statement
              className="mt-5 max-w-xl border-l border-sandstone/48 pl-4 sm:mt-7 sm:pl-5"
              // Removing a MotionValue can retain its last rendered value.
              // Reduced motion must explicitly restore the readable state.
              style={reducedMotion ? { clipPath: "none" } : { clipPath: copyClip, willChange: "clip-path" }}
            >
              <p className="text-sm leading-relaxed text-ivory/90 sm:text-base">
                Most brand decisions get rushed at the exact moment they need better language. You gave yours a little more room.
              </p>
            </motion.div>

            <motion.div
              ref={nextRef}
              onFocusCapture={handleNextActionFocus}
              data-contact-gratitude-next
              data-contact-gratitude-next-ready={nextReady ? "true" : undefined}
              aria-hidden="false"
              className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap"
              style={
                reducedMotion
                  ? { y: 0, opacity: 1 }
                  : { y: nextY, opacity: nextOpacity, willChange: "transform, opacity" }
              }
            >
              <TrackedLink
                href="#call"
                event="contact_route_selected"
                eventProps={{ source: "contact_gratitude", route: "booking" }}
                data-contact-gratitude-primary
                data-cursor-label="Book the conversation"
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-ivory px-5 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-soil transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-sandstone focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ivory"
              >
                <span className="relative z-10 text-balance text-center">Bring it to a 30 minute call</span>
                <ArrowRight
                  aria-hidden="true"
                  data-contact-gratitude-primary-arrow
                  className="relative z-10 h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={1.6}
                />
              </TrackedLink>
              <TrackedLink
                href="/insights"
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
            ref={ledgerRef}
            data-contact-gratitude-ledger
            className="min-w-0"
            style={reducedMotion ? { y: 0, opacity: 1 } : { y: resolveY, opacity: resolveOpacity }}
          >
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[0.61rem] font-medium uppercase tracking-[0.22em] text-sandstone">
                  What you brought
                </p>
                <p className="mt-2 max-w-xs font-display text-xl leading-tight text-ivory sm:text-2xl">
                  A useful first conversation begins here.
                </p>
              </div>
              <span
                aria-hidden="true"
                data-contact-gratitude-ledger-status
                className="hidden min-w-[10rem] overflow-hidden pb-1 text-right text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-ivory/90 sm:block"
              >
                <AnimatePresence initial={false} mode="wait">
                  <motion.span
                    key={completionSettled ? "settled" : "receiving"}
                    data-contact-gratitude-ledger-status-beat
                    className="block"
                    initial={reducedMotion ? false : { y: 6, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={reducedMotion ? undefined : { y: -6, opacity: 0 }}
                    transition={{ duration: reducedMotion ? 0 : 0.38, ease: EASE_AIR }}
                  >
                    {completionSettled ? "enough to begin" : "four acknowledgements"}
                  </motion.span>
                </AnimatePresence>
              </span>
            </div>

            <div
              data-contact-gratitude-notes
              data-contact-gratitude-flow="continuous"
              data-contact-gratitude-receipt="scroll-or-activation"
              onPointerLeave={(event) => {
                if (event.pointerType !== "mouse") return;

                const focusedIndex = noteRefs.current.findIndex(
                  (note) => note === document.activeElement,
                );
                // A hover preview should hand back to the focused or held
                // note. Keep an acknowledgement closed after Escape.
                setActiveNote((current) =>
                  current === null
                    ? null
                    : focusedIndex >= 0
                      ? focusedIndex
                      : selectedNote,
                );
              }}
              className="relative mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[1.35rem] border border-white/16 bg-white/12 backdrop-blur-xl sm:mt-5 lg:block lg:overflow-visible lg:rounded-none lg:border-0 lg:bg-transparent lg:backdrop-blur-none"
            >
              <motion.span
                aria-hidden="true"
                data-contact-gratitude-scroll-spine="continuous"
                data-contact-gratitude-scroll-spine-settled={
                  spineSettled ? "true" : undefined
                }
                className="pointer-events-none absolute inset-y-0 left-0 z-[2] hidden w-px origin-top bg-sandstone/75 lg:block"
                initial={false}
                animate={{
                  opacity: spineSettled ? 0.58 : 1,
                  boxShadow: spineSettled
                    ? "0 0 0 rgba(224, 190, 139, 0)"
                    : "0 0 18px rgba(224, 190, 139, 0.42)",
                }}
                transition={{ duration: reducedMotion ? 0 : 0.72, ease: EASE_AIR }}
                style={reducedMotion ? { scaleY: 1 } : { scaleY: signalScale }}
              />
              <LayoutGroup id="contact-gratitude-notes">
                {NOTES.map((note, index) => (
                  <GratitudeNote
                    key={note.label}
                    note={note}
                    index={index}
                    progress={sequenceProgress}
                    activeNote={visualActiveNote}
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
              </LayoutGroup>
            </div>

            <div
              id="contact-gratitude-response"
              data-contact-gratitude-response
              data-contact-gratitude-response-phase={
                activeNote !== null
                  ? "inspection"
                  : completionSettled && sequenceFocusNote !== null
                    ? "revisiting"
                    : completionSettled
                    ? "resolved"
                    : lastReceivedNote === null
                      ? "opening"
                      : "receiving"
              }
              data-contact-gratitude-response-direction="vertical"
              className="relative mt-4 grid min-h-[4.25rem] min-w-0 overflow-hidden border-l border-sandstone/48 pl-4 font-display text-lg italic leading-snug text-sandstone sm:min-h-[3.5rem] sm:text-xl"
            >
              <p className="sr-only" aria-live="off">
                {activeResponse}
              </p>
              <p className="sr-only" aria-live="polite" aria-atomic="true">
                {announcedResponse}
              </p>
              {RESPONSES.map((response, index) => {
                const active = index === responseIndex;
                const leavesLeft = index < responseIndex;

                return (
                  <motion.p
                    key={response}
                    aria-hidden="true"
                    data-contact-gratitude-response-beat
                    className="relative min-w-0 [grid-area:1/1]"
                    initial={false}
                    animate={
                      active
                        ? { clipPath: "inset(0% 0 0% 0)", y: 0, opacity: 1 }
                        : leavesLeft
                          ? { clipPath: "inset(0% 0 100% 0)", y: -9, opacity: 0 }
                          : { clipPath: "inset(100% 0 0% 0)", y: 9, opacity: 0 }
                    }
                    transition={{ duration: reducedMotion ? 0 : 0.46, ease: EASE_AIR }}
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
                  ? completionSettled
                    ? "All four acknowledgements received. Enough to begin."
                    : "All four acknowledgements received"
                  : `${visitedCount} of ${NOTES.length} acknowledgements received`
              }
              className="mt-3 grid grid-cols-[1fr_auto] items-center gap-4"
            >
              <motion.span
                aria-hidden="true"
                className="h-px overflow-hidden bg-ivory/18"
                style={
                  reducedMotion
                    ? { scaleX: 1 }
                    : {
                        scaleX: allNotesVisited ? 1 : signalScale,
                        transformOrigin: "0 50%",
                      }
                }
              >
                <motion.span
                  className="block h-full origin-left bg-sandstone"
                  initial={false}
                  animate={{ scaleX: visitedCount / NOTES.length }}
                  transition={{ duration: reducedMotion ? 0 : 0.5, ease: EASE_AIR }}
                />
              </motion.span>
              <motion.span
                aria-hidden="true"
                data-contact-gratitude-progress-label
                className="relative min-w-[8.75rem] overflow-hidden text-right text-[0.625rem] font-medium uppercase tracking-[0.14em] text-ivory/90 sm:text-[0.6875rem]"
                initial={false}
                animate={{ color: completionSettled ? "rgb(224, 190, 139)" : "rgba(246, 242, 234, 0.9)" }}
                transition={{ duration: reducedMotion ? 0 : 0.5, ease: EASE_AIR }}
              >
                <AnimatePresence initial={false} mode="wait">
                  <motion.span
                    key={completionSettled ? "complete" : visitedCount}
                    data-contact-gratitude-progress-beat
                    className="block"
                    initial={reducedMotion ? false : { y: 7, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={reducedMotion ? undefined : { y: -7, opacity: 0 }}
                    transition={{ duration: reducedMotion ? 0 : 0.34, ease: EASE_AIR }}
                  >
                    {completionSettled ? "04 / 04 · enough" : `0${visitedCount} / 04 received`}
                  </motion.span>
                </AnimatePresence>
              </motion.span>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
