"use client";

import dynamic from "next/dynamic";
import { useLazyMount } from "@/hooks/useLazyMount";

// Phase 5 performance gate: Lighthouse traced 509ms of main thread
// script evaluation to the three.js chunk landing in the initial page
// bundle — AmbientElementShader gated its ANIMATION behind an
// IntersectionObserver, but the chunk itself still parsed and
// evaluated at load. This wrapper applies the FiveElementsMoment
// pattern instead: the dynamic() call only renders once the section
// scrolls near (useLazyMount's 600px rootMargin), so the three.js
// chunk is genuinely fetched and evaluated later, off the critical
// path. The wrapper div is absolute inset-0 (matching the shader's own
// canvas placement) so nothing shifts when the real canvas arrives.
const Shader = dynamic(() => import("@/components/AmbientElementShader").then((m) => m.AmbientElementShader), {
  ssr: false,
});

export function LazyAmbientShader({ opacity }: { opacity?: number }) {
  const [ref, shouldLoad] = useLazyMount();
  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0">
      {shouldLoad && <Shader opacity={opacity} />}
    </div>
  );
}
