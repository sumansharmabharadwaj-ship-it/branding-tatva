// The departure half of the scene dissolve system. SceneVeil (the
// arrival half) makes every chapter open wearing the previous
// chapter's color and release it as the visitor travels in; this makes
// every chapter CLOSE by anticipating the next one — a gradient of the
// NEXT chapter's mood color that fades in over the last stretch of the
// scene as the boundary approaches the viewport. Together the two
// halves give every boundary a bidirectional cross-dissolve: the next
// scene begins before the previous one has fully ended, and no cut is
// ever a cut. Scroll-linked, opacity-only; under reduced motion it
// rests as a moderate static blend so the color journey survives
// without the scrub.
export function SceneHandoff({
  color,
  heightClass = "h-[12vh]",
  endOpacity = 0.46,
  reducedOpacity = 0.28,
}: {
  color: string;
  heightClass?: string;
  endOpacity?: number;
  reducedOpacity?: number;
}) {
  return (
    <div
      aria-hidden="true"
      data-services-dissolve="departure"
      data-services-dissolve-end={endOpacity}
      data-services-dissolve-rest={reducedOpacity}
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 ${heightClass}`}
      style={{
        // The runtime owns the scroll animation. The server-rendered layer
        // also works as a quiet static transition before JavaScript arrives.
        opacity: reducedOpacity,
        background: `linear-gradient(0deg, ${color} 0%, transparent 100%)`,
      }}
    />
  );
}
