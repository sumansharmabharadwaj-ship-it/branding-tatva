"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { track } from "@/lib/analytics";

// Calendly's own widget.js resizes this div's height to fit whatever
// step of the booking flow is showing when data-resize="true" is set.
// The script can finish downloading before the cross-origin iframe has
// actually painted, so script load alone is not treated as visual
// readiness. A MutationObserver waits for Calendly's iframe and keeps a
// useful, branded loading surface in front of it until the iframe's own
// load event fires. If a blocker or firewall prevents that event, the
// visitor still has a full-size direct scheduling link rather than a
// silent cream void.

export function CalendlyEmbed({ url, onReady }: { url: string; onReady?: () => void }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [widgetReady, setWidgetReady] = useState(false);
  const [scriptFailed, setScriptFailed] = useState(false);

  // Calendly's embed announces a finished booking through postMessage,
  // the one signal that separates opening the calendar from actually
  // scheduling. Origin checked so arbitrary frames cannot fire it.
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin === "https://calendly.com" && e.data?.event === "calendly.event_scheduled") {
        track("booking_completed");
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Observe the wrapper because Calendly inserts its iframe after its
  // external script evaluates. Passing the non-null root into the
  // callback keeps the DOM contract explicit even when the observer
  // executes after this effect's initial synchronous guard.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    setWidgetReady(false);
    setScriptFailed(false);
    let iframe: HTMLIFrameElement | null = null;

    function markReady() {
      setWidgetReady(true);
      onReady?.();
    }

    function bindIframe(root: HTMLDivElement) {
      const nextIframe = root.querySelector<HTMLIFrameElement>("iframe");
      if (!nextIframe || nextIframe === iframe) return;
      if (iframe) iframe.removeEventListener("load", markReady);
      iframe = nextIframe;
      iframe.addEventListener("load", markReady, { once: true });
    }

    bindIframe(wrapper);
    const observer = new MutationObserver(() => bindIframe(wrapper));
    observer.observe(wrapper, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      if (iframe) iframe.removeEventListener("load", markReady);
    };
  }, [onReady, url]);

  const schedulingUrl = `${url}?hide_gdpr_banner=1&hide_landing_page_details=1&background_color=F6F2EA&text_color=27221E&primary_color=8A6B3D`;

  return (
    // overflow-x-auto, not overflow-hidden. Calendly's own 320px
    // minimum can exceed a narrow card; horizontal scrolling preserves
    // the full booking interface instead of clipping it.
    <div
      ref={wrapperRef}
      data-calendar-embed="true"
      className="relative mt-8 overflow-x-auto rounded-2xl border"
      style={{ borderColor: "rgba(198,169,122,0.45)", backgroundColor: "#F6F2EA" }}
    >
      {!widgetReady && (
        <div
          className="absolute inset-0 z-10 flex min-h-[min(560px,72svh)] items-center justify-center px-6 py-10 text-center"
          data-calendar-loading=""
          style={{ backgroundColor: "#F6F2EA" }}
          aria-live="polite"
        >
          <div className="max-w-sm">
            <span
              aria-hidden="true"
              className="mx-auto block h-2 w-2 animate-pulse rounded-full"
              style={{ backgroundColor: "#8A6B3D" }}
            />
            <p className="mt-5 text-xs font-medium uppercase tracking-[0.2em] text-[#8A6B3D]">
              Scheduling
            </p>
            <p className="mt-3 font-display text-2xl font-normal text-[#27221E]">
              {scriptFailed ? "The embedded calendar has not loaded." : "Opening the calendar."}
            </p>
            <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-[#4A433D]">
              Open Calendly directly if a browser extension or network policy blocks the embedded version.
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-[#8A6B3D]/40 px-5 py-2.5 text-sm font-medium text-[#5F482B] transition-colors duration-300 hover:border-[#8A6B3D] hover:bg-[#8A6B3D]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8A6B3D]"
            >
              Open the scheduling page
              <ArrowUpRight aria-hidden="true" className="ml-2 h-4 w-4" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      )}
      <div
        className="calendly-inline-widget"
        data-url={schedulingUrl}
        data-resize="true"
        style={{ minWidth: "320px", minHeight: "min(560px, 72svh)" }}
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
        onError={() => setScriptFailed(true)}
      />
    </div>
  );
}
