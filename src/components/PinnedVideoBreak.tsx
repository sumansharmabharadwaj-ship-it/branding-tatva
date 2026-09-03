"use client";

import { useReducedMotion } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { PinnedHold } from "./PinnedHold";
import { VideoBreak } from "./VideoBreak";

// Wraps a single-beat VideoBreak in PinnedHold — desktop/motion-allowed
// only, single-mount conditional (not the CSS-hidden dual-render
// pattern ElementsIntro.tsx uses for text content) specifically because
// VideoBreak renders a real <video autoPlay>: dual-mounting both the
// pinned and fallback variants would mean two concurrent video
// downloads/decodes even with one branch display:none. useMediaQuery
// avoids that by only ever mounting one.
export function PinnedVideoBreak(props: React.ComponentProps<typeof VideoBreak>) {
  const prefersReducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  if (prefersReducedMotion || !isDesktop) {
    return <VideoBreak {...props} />;
  }

  // The per-instance heights callers pass (72vh, 85vh, 145vh, ...) were
  // tuned for normal document flow before this got wrapped in a pin —
  // now that it's held in a full-screen sticky frame, anything shorter
  // than that frame leaves PinnedHold's own soil fill showing above and
  // below it, which stacks into a visible seam against whatever pinned
  // section comes next. Forcing 100vh here (fallback branch above keeps
  // props.height, since normal flow still benefits from the shorter,
  // tuned sizes) makes this fill the frame edge-to-edge instead.
  return (
    <PinnedHold>
      <VideoBreak {...props} height="100vh" />
    </PinnedHold>
  );
}
