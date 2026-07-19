// Next.js remounts template.tsx fresh on every navigation (unlike
// layout.tsx, which persists) — the documented, low-risk mechanism for
// a per-page enter animation, versus fighting AnimatePresence's
// exit-tracking against App Router's Server Component streaming model.
// Sits between the root layout (Header, Footer, SmoothScrollProvider,
// SparkCursor — all untouched, stay mounted across navigations) and
// each page's own content, so only the page body gets this motion.
//
// The actual animation is a plain CSS class (.page-enter, defined in
// globals.css) rather than JS/GSAP. An earlier version drove this with
// a GSAP tween that only started once React hydrated — a real
// production Lighthouse run caught that as an 8.7s render delay on the
// hero heading, since the page body sat at opacity: 0 until that
// script ran. CSS animations start the moment the browser paints the
// element, no script execution required, and the sitewide
// prefers-reduced-motion rule already zeroes out animation-duration
// for every element on the site, so there's no separate reduced-motion
// branch to maintain here — this can be a plain server component.

export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
