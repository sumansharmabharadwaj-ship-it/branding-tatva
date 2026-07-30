// The single-beat sibling to PinnedSlider/PinnedJourney/MeadowClosing/
// ElementsIntroPinned — for a section that has exactly one thing to
// show (a quote, an interactive split-panel), not several stages to
// crossfade between. A wrapper taller than its sticky child is enough
// to hold that one thing in place for a felt beat before releasing;
// unlike the multi-stage components, this needs no scroll-tick JS
// listener or per-stage opacity math at all — plain CSS sticky does
// the whole job.
//
// Callers decide when to render this at all (desktop/motion-allowed
// only, matching every other pinned component's convention) rather
// than this component checking reduced-motion itself, since it has no
// opinion on what's inside it.
export function PinnedHold({
  height,
  extra = "70vh",
  children,
}: {
  height: string;
  extra?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative" style={{ height: `calc(${height} + ${extra})` }}>
      <div className="sticky top-0">{children}</div>
    </div>
  );
}
