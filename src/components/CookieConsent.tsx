"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";

// Analytics used to mount for everyone the moment a page loaded, which
// means measurement started before anyone agreed to it. This gate holds
// it back until a visitor chooses, and remembers the choice.
//
// The choice lives in localStorage rather than in a cookie of its own:
// storing a cookie in order to record a decision about cookies is the
// kind of thing that reads as carelessness, and localStorage carries no
// data to any server at all.
//
// Declining is a real answer here, not a quieter version of accepting.
// A decline mounts nothing, so no measurement runs for that visitor at
// all, and the banner stays gone.

const STORAGE_KEY = "bt-analytics-consent";
type Choice = "granted" | "declined";

export function CookieConsent() {
  // Server and first client render agree on null, so nothing about this
  // can cause a hydration mismatch. The stored choice arrives after
  // mount, which is also when the banner is allowed to appear.
  const [choice, setChoice] = useState<Choice | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "granted" || stored === "declined") setChoice(stored);
    } catch {
      // Storage can be unavailable in private mode. The banner simply
      // asks again next visit rather than assuming agreement.
    }
    setReady(true);
  }, []);

  function decide(next: Choice) {
    setChoice(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // The session still respects the choice even when it cannot be
      // written down.
    }
  }

  return (
    <>
      {choice === "granted" && <Analytics />}

      {ready && choice === null && (
        <div
          role="dialog"
          aria-label="Analytics choice"
          className="fixed inset-x-3 bottom-3 z-100 mx-auto max-w-2xl rounded-2xl border p-4 shadow-elevation-lg backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:p-5"
          style={{ borderColor: "rgba(198,169,122,0.35)", backgroundColor: "rgba(27,27,27,0.94)" }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-ivory/85">
              This site measures which pages earn attention. Nothing goes to advertisers, and the booking
              calendar works either way.{" "}
              <Link href="/privacy" className="link-underline" style={{ color: "#C6A97A" }}>
                Read the privacy note
              </Link>
              .
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => decide("declined")}
                className="rounded-full border border-ivory/25 px-5 py-2 text-xs font-medium uppercase tracking-[0.14em] text-ivory/80 transition-colors duration-300 hover:border-ivory/50 hover:text-ivory focus-visible:outline focus-visible:outline-2"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={() => decide("granted")}
                className="rounded-full px-5 py-2 text-xs font-medium uppercase tracking-[0.14em] transition-opacity duration-300 hover:opacity-90 focus-visible:outline focus-visible:outline-2"
                style={{ backgroundColor: "#C6A97A", color: "#1B1B1B" }}
              >
                Allow
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
