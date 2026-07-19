import gsap from "gsap";

// The page-enter treatment for template.tsx. Deliberately enter-only —
// no exit tracking, no AnimatePresence across routes. A prior attempt
// at that broke against the App Router's Server Component streaming
// model (see template.tsx's own comment for the full account); template.tsx
// remounting fresh on every navigation is the documented, low-risk
// mechanism instead, so this only ever animates something freshly
// mounted, never something being torn down.
//
// Fade + a light blur-to-sharp settle + a small scale/rise — the same
// "arriving into focus" language as the page-load veil's reveal, just
// applied per navigation instead of only on first load.
//
// The element must already be rendered at PAGE_ENTER_FROM (a static
// inline style, not something this function sets) before this runs —
// animating from a gsap.set() inside a useEffect would flash the fully-
// visible content for one frame first. Starting from the CSS the very
// first paint already used means there's nothing to flash.
export const PAGE_ENTER_FROM = {
  opacity: 0,
  transform: "translateY(14px) scale(0.98)",
  filter: "blur(8px)",
} as const;

export function initPageEnter(el: HTMLElement): gsap.core.Tween {
  return gsap.to(el, {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    duration: 0.6,
    ease: "power2.out",
  });
}
