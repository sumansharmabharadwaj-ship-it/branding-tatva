"use client";

import { useEffect, useRef, useState } from "react";

// The single-beat sibling to PinnedSlider/PinnedJourney/MeadowClosing/
// ElementsIntroPinned — for a section that has exactly one thing to
// show (a quote, an interactive split-panel), not several stages to
// crossfade between. A wrapper taller than its sticky child is enough
// to hold that one thing in place for a felt beat before releasing;
// unlike the multi-stage components, this needs no scroll-tick JS
// listener or per-stage opacity math at all — plain CSS sticky does
// the whole job.
//
// The wrapper's height is measured from the sticky child via
// ResizeObserver rather than trusting a caller-supplied height string —
// a mismatch between an assumed height and the child's real rendered
// height is exactly what produced large blank gaps of the page's own
// cream background after this pattern first shipped (the wrapper ran
// out of scroll distance before or after the child actually needed it).
// The sticky child is also floored at min-h-screen and centered, so
// content shorter than one viewport (a single quote, say) gets held as
// a full frame with `bg` filling the letterboxed space above/below it,
// instead of leaving a gap that exposes whatever's behind the wrapper.
// Content taller than one viewport isn't clipped — min-height only sets
// a floor, never a ceiling.
//
// Callers decide when to render this at all (desktop/motion-allowed
// only, matching every other pinned component's convention) rather
// than this component checking reduced-motion itself, since it has no
// opinion on what's inside it.
export function PinnedHold({
  // Scroll OS fatigue gate: 70vh of held travel per beat pushed Home's
  // sticky share to 55% of the page against the OS's 40% budget. 45vh
  // keeps a real, felt hold on every beat while returning roughly a
  // quarter viewport of scroll to free flow at each of the holds.
  extra = "45vh",
  bg = "bg-soil",
  children,
}: {
  extra?: string;
  bg?: string;
  children: React.ReactNode;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | null>(null);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setContentHeight(entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="relative"
      style={{
        height:
          contentHeight != null
            ? `calc(${contentHeight}px + ${extra})`
            : `calc(100vh + ${extra})`,
      }}
    >
      <div
        ref={innerRef}
        className={`sticky top-0 flex min-h-screen flex-col justify-center overflow-hidden ${bg}`}
      >
        {children}
      </div>
    </div>
  );
}
