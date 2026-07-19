import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

// Splits a heading into individual words and staggers them in on scroll,
// instead of the whole line fading up as one block — see SplitReveal.tsx
// for where this is used and why it's reserved for one or two headlines
// rather than applied everywhere. gsap.context() scopes the SplitText
// instance and the tween together so ctx.revert() (called on unmount)
// tears both down cleanly, restoring the original unsplit text node.
export function initSplitTextReveal(el: HTMLElement): gsap.Context {
  return gsap.context(() => {
    const split = new SplitText(el, { type: "words" });
    gsap.set(split.words, { opacity: 0, y: "0.4em" });
    gsap.to(split.words, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.045,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        once: true,
      },
    });

    return () => split.revert();
  }, el);
}
