// Scene dissolve, second generation. The first version was a static
// gradient of the previous chapter's mood color at the top of each
// section — spatial continuity only. This one is scroll-linked: the
// veil is fully present while the boundary sits low in the viewport
// (the previous scene still holding the frame) and releases as the
// visitor travels into the chapter — the old scene letting go rather
// than a painted-on band. Opacity-only on a static gradient; under
// reduced motion it simply stays at full strength as the original
// static dissolve.
export function SceneVeil({
  color,
  heightClass = "h-[16vh]",
  endOpacity = 0.15,
}: {
  color: string;
  heightClass?: string;
  endOpacity?: number;
}) {
  return (
    <div
      aria-hidden="true"
      data-services-dissolve="arrival"
      data-services-dissolve-end={endOpacity}
      data-services-dissolve-rest={1}
      className={`pointer-events-none absolute inset-x-0 top-0 ${heightClass}`}
      style={{
        opacity: 1,
        background: `linear-gradient(180deg, ${color} 0%, transparent 100%)`,
      }}
    />
  );
}
