"use client";

import Script from "next/script";
import { useState } from "react";

// Calendly's own widget.js resizes this div's height to fit whatever
// step of the booking flow is showing (picking a date vs. a longer
// timezone-heavy confirmation screen) when data-resize="true" is set —
// confirmed against Calendly's own advanced-embed docs, which say the
// script handles this internally and nothing needs to listen for its
// postMessage events by hand. That script starts the div at height: 0
// and only grows it once the (cross-origin, so unobservable from here)
// iframe posts its real content height back — if that message is ever
// blocked or delayed (ad blockers commonly block Calendly's own
// scripts, a slow connection, a corporate firewall), the whole booking
// widget silently collapses to nothing with no visible failure, the
// same class of "looks fine in the DOM, renders as a blank gap" bug
// already fixed elsewhere on this site (useLazyMount, useRevealTrigger).
// min-height here is a hard floor CSS won't let Calendly's own height
// override shrink below, so worst case this renders at the old fixed
// size with the iframe scrolling internally — never a blank collapse.
// svh rather than vh so that floor can't end up taller than what's
// actually visible once mobile Safari's address bar reappears
// mid-scroll. A pulse skeleton covers the blank gap between mount and
// the widget script actually painting a page. Loaded with
// strategy="afterInteractive" rather than "lazyOnload" — this is the
// entire point of the Contact page, a real person trying to book a
// real call, so it shouldn't wait on the browser's own idle-time
// heuristic on a page that's already busy with video/animation and may
// rarely go truly idle.

export function CalendlyEmbed({ url }: { url: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative mt-8 overflow-hidden rounded-lg border-t-2 border-action-primary bg-background-elevated shadow-elevation-sm">
      {!loaded && (
        <div
          className="absolute inset-0 animate-pulse bg-background-alt"
          style={{ height: "min(700px, 90svh)" }}
          aria-hidden="true"
        />
      )}
      <div
        className="calendly-inline-widget"
        data-url={`${url}?hide_gdpr_banner=1`}
        data-resize="true"
        style={{ minWidth: "320px", minHeight: "min(700px, 90svh)" }}
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
