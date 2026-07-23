// A small fixed corner mark — crosshair + wordmark, the quiet
// "someone thought about every pixel" detail the reference sites
// (trionn.com) use. Purely decorative and static, unlike ScrollProgress
// or SparkCursor — it isn't conveying information or tracking input, so
// it stays a plain server component with no client-side logic at all.
// Bottom-left, matching AmbientAudio's own bottom-6 spacing on the
// opposite corner, and the same soil/80 + ivory/20 chip treatment so it
// reads as part of the same fixed-chrome family rather than a one-off.
// z-20, below the header (z-40) and the cursor (z-29 to z-31) so it
// never competes with anything actually interactive. Hidden below the
// sm breakpoint — a fourth fixed element in the corner of an already
// tight mobile viewport is clutter, not craft.
export function PrecisionMark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-6 left-6 z-20 hidden items-center gap-2 rounded-full border border-ivory/20 bg-soil/80 px-3 py-2 shadow-elevation-sm backdrop-blur-md sm:flex"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <circle cx="6" cy="6" r="1.2" fill="#C28A28" />
        <line x1="6" y1="0" x2="6" y2="2.8" stroke="#F4EFE6" strokeWidth="1" strokeOpacity="0.55" />
        <line x1="6" y1="9.2" x2="6" y2="12" stroke="#F4EFE6" strokeWidth="1" strokeOpacity="0.55" />
        <line x1="0" y1="6" x2="2.8" y2="6" stroke="#F4EFE6" strokeWidth="1" strokeOpacity="0.55" />
        <line x1="9.2" y1="6" x2="12" y2="6" stroke="#F4EFE6" strokeWidth="1" strokeOpacity="0.55" />
      </svg>
      <span className="font-body text-[0.6rem] font-medium uppercase tracking-[0.22em] text-ivory/70">
        Branding Tatva
      </span>
    </div>
  );
}
