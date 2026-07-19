"use client";

import { useState } from "react";

// Calendly's inline embed is app-like UI, not fixed-ratio media, so a
// min(700px, 90vh) style keeps it from ever exceeding the viewport on
// short screens without switching to Calendly's own auto-resize script.
// A simple pulse skeleton covers the blank gap between mount and the
// iframe's own load event, so the container never reads as broken.

export function CalendlyEmbed({ url }: { url: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative mt-8 overflow-hidden rounded-lg border-t-2 border-action-primary bg-background-elevated shadow-elevation-sm">
      {!loaded && (
        <div
          className="absolute inset-0 animate-pulse bg-background-alt"
          style={{ height: "min(700px, 90vh)" }}
          aria-hidden="true"
        />
      )}
      <iframe
        src={`${url}?hide_gdpr_banner=1`}
        width="100%"
        style={{ height: "min(700px, 90vh)", display: "block" }}
        title="Book a call via Calendly"
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
