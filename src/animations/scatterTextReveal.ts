import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

// Words scatter in from randomized offsets and rotations rather than
// SplitReveal's calm, uniform stagger — a single showcase gesture (see
// ScatterReveal.tsx), not a general replacement for it. Uses gsap.to()
// directly, unlike splitTextReveal.ts's deliberate CSS-transition
// indirection: per-word randomized transforms are computed at runtime
// and only GSAP's own tween engine interpolates them, and that's
// accepted here specifically because this reveal is scroll-gated,
// off the load-critical path, and non-blocking if a tab stalls mid-tween
// (words just hold their current position and finish resolving once the
// tab's ticker resumes) — the same risk trade already made for MorphSVG.
const SCATTER_DURATION = 0.9;
const SCATTER_STAGGER = 0.035;

export function initScatterTextReveal(el: HTMLElement): { revert: () => void } {
  let split: SplitText | undefined;
  let revealed = false;
  let tween: gsap.core.Tween | undefined;

  function reveal() {
    if (revealed || !split) return;
    revealed = true;
    tween = gsap.to(split.words, {
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 1,
      duration: SCATTER_DURATION,
      ease: "power3.out",
      stagger: { each: SCATTER_STAGGER, from: "random" },
    });
  }

  function checkPosition() {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.8) reveal();
  }

  const ctx = gsap.context(() => {
    split = new SplitText(el, { type: "words" });
    split.words.forEach((word) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * 70;
      gsap.set(word, {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        rotation: (Math.random() - 0.5) * 50,
        opacity: 0,
      });
    });
  }, el);

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) reveal();
    },
    { rootMargin: "0px 0px -15% 0px" }
  );
  observer.observe(el);
  checkPosition();

  return {
    revert() {
      observer.disconnect();
      tween?.kill();
      ctx.revert();
    },
  };
}
