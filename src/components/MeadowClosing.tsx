"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "@/components/SmoothScrollProvider";

// Replaces two rejected WebGL attempts at this closing beat (abstract
// element shapes, then a hand-built 3D butterfly) — both read as
// cartoonish and, worse, didn't actually feel tied to scroll the way
// this page's other pinned sections (PinnedJourney) do. Rather than a
// third attempt at a literal 3D object, this leans into what the
// reference sites sent for this page (rabenrifaie.com, voyeurverite.com,
// storytelling.noomoagency.com) actually do well: confident scroll-
// linked video and typography, not toy geometry. The meadow video stays
// — direct feedback that it was the one thing landing — now doing a
// slow scroll-driven zoom while a short closing line reveals in two
// unmistakable beats as you scroll through, the same rect-top/viewport-
// height progress math and direct-ref-mutation discipline PinnedJourney
// already established (no React state on scroll ticks, no GSAP
// ScrollTrigger pin — see that file's own comment for why). Dropping
// three/@react-three/fiber entirely also removes the real loading-gap
// this section had before at its root, rather than mitigating it with
// prefetch tricks.
function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export function MeadowClosing() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLParagraphElement>(null);
  const line2Ref = useRef<HTMLParagraphElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    function setLine(el: HTMLElement | null, progress: number, start: number, end: number) {
      if (!el) return;
      const eased = smoothstep(start, end, progress);
      el.style.opacity = String(eased);
      el.style.transform = `translateY(${(1 - eased) * 18}px)`;
    }

    function update() {
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      const raw = -rect.top / window.innerHeight;
      const progress = Math.min(1, Math.max(0, raw));

      if (videoRef.current) {
        videoRef.current.style.transform = `scale(${1 + progress * 0.12})`;
      }
      if (overlayRef.current) {
        overlayRef.current.style.opacity = String(0.3 + Math.min(progress / 0.6, 1) * 0.25);
      }
      setLine(line1Ref.current, progress, 0.15, 0.42);
      setLine(line2Ref.current, progress, 0.5, 0.72);
    }

    update();
    const unsubscribe = lenis?.on("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      unsubscribe?.();
      window.removeEventListener("resize", update);
    };
  }, [lenis]);

  return (
    <div ref={wrapperRef} className="relative bg-soil" style={{ height: "200vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ willChange: "transform" }}
          src="/videos/pixabay-alpine-wildflowers.mp4"
          poster="/images/pixabay-alpine-wildflowers-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
        />
        <div ref={overlayRef} className="absolute inset-0 bg-soil" style={{ opacity: 0.3 }} />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="max-w-xl text-center">
            <p
              ref={line1Ref}
              className="font-display text-[clamp(1.6rem,4.2vw,2.9rem)] font-normal leading-[1.3] text-ivory"
              style={{ opacity: 0 }}
            >
              Everything on this page took time to become one thing.
            </p>
            <p
              ref={line2Ref}
              className="mt-4 font-display text-[clamp(1.8rem,4.8vw,3.3rem)] italic font-normal text-clay"
              style={{ opacity: 0 }}
            >
              Yours can too.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
