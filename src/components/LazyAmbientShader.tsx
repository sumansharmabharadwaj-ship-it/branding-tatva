"use client";

import { useEffect } from "react";
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

// Warm the three.js chunk during browser idle time after load — a real
// GPU-probe trace caught a ~1.1s scroll hitch exactly where the first
// shader section approaches: the deferred chunk (509ms eval) was
// parsing mid-scroll. Idle-warming keeps it off the critical load path
// (the Phase 5 win stands) while guaranteeing it is parsed before any
// visitor can scroll to it. Module-level once-flag so six instances
// schedule one warm.
let warmed = false;
function warmChunkOnIdle() {
  if (warmed || typeof window === "undefined") return;
  warmed = true;
  const warm = () => {
    void import("@/components/AmbientElementShader");
  };
  if ("requestIdleCallback" in window) {
    (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(warm, { timeout: 4000 });
  } else {
    setTimeout(warm, 2500);
  }
}

export function LazyAmbientShader({ opacity }: { opacity?: number }) {
  const [ref, shouldLoad] = useLazyMount();
  useEffect(() => {
    warmChunkOnIdle();
  }, []);
  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0">
      {shouldLoad && <Shader opacity={opacity} />}
    </div>
  );
}
