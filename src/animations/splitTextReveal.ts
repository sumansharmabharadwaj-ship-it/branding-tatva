import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

// Splits a heading into individual words and staggers them in on scroll,
// instead of the whole line fading up as one block — see SplitReveal.tsx
// (major headlines) and VideoBreak's wordFade quotes for where this is
// used and why it's reserved for a handful of moments rather than
// applied everywhere.
//
// SplitText is still GSAP's (it's the best tool for turning text into
// individually animatable word nodes), but the actual reveal is a plain
// CSS transition set directly via element.style, not a gsap.to() tween.
// That's a deliberate, verified choice, not a style preference: gsap.to()
// drives its tween through GSAP's own JS ticker (requestAnimationFrame
// under the hood), and confirmed by direct testing, that ticker can go
// fully idle in a backgrounded/occluded tab while Framer Motion's
// `animate`-prop reveals elsewhere on the site (see useRevealTrigger)
// kept working — Framer Motion hands simple opacity/transform animations
// to the browser's native Web Animations API, which the compositor
// keeps running independent of the page's own JS/rAF being throttled. A
// plain CSS transition gets the same compositor-level guarantee GSAP's
// JS-ticker tween doesn't. reveal() itself is still reachable from three
// independent paths (a ScrollTrigger, a plain IntersectionObserver, and
// a Lenis-driven position check) and is idempotent, so whichever fires
// first wins and the rest are no-ops — that redundancy stays valuable
// independent of which mechanism actually paints the result.
const REVEAL_DURATION = 0.7;
const REVEAL_STAGGER = 0.045;
const REVEAL_EASE = "cubic-bezier(0.17, 0.67, 0.35, 1)"; // power3.out equivalent

export function initSplitTextReveal(el: HTMLElement): { revert: () => void } {
  let split: SplitText | undefined;
  let revealed = false;

  function reveal() {
    if (revealed || !split) return;
    revealed = true;
    split.words.forEach((word, i) => {
      const w = word as HTMLElement;
      w.style.transition = `opacity ${REVEAL_DURATION}s ${REVEAL_EASE} ${i * REVEAL_STAGGER}s, transform ${REVEAL_DURATION}s ${REVEAL_EASE} ${i * REVEAL_STAGGER}s`;
      w.style.opacity = "1";
      w.style.transform = "translateY(0)";
    });
  }

  function checkPosition() {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) reveal();
  }

  const ctx = gsap.context(() => {
    split = new SplitText(el, { type: "words" });
    split.words.forEach((word) => {
      const w = word as HTMLElement;
      w.style.opacity = "0";
      w.style.transform = "translateY(0.4em)";
    });
    ScrollTrigger.create({ trigger: el, start: "top 85%", once: true, onEnter: reveal });
  }, el);

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) reveal();
    },
    { rootMargin: "0px 0px -15% 0px" }
  );
  observer.observe(el);
  checkPosition();
  const unsubscribeLenis = window.__lenisInstance?.on("scroll", checkPosition);

  return {
    revert() {
      observer.disconnect();
      unsubscribeLenis?.();
      ctx.revert();
    },
  };
}
