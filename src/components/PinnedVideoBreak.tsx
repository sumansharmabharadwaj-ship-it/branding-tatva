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

  return (
    <PinnedHold height={props.height ?? "70vh"}>
      <VideoBreak {...props} />
    </PinnedHold>
  );
}
