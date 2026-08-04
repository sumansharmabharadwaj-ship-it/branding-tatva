"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Analytics } from "@vercel/analytics/next";
import { useFooterInView } from "@/hooks/useFooterInView";

export const CONSENT_STORAGE_KEY = "bt-consent-v2";
const LEGACY_STORAGE_KEY = "bt-analytics-consent";

export type ConsentPreferences = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

const emptyPreferences = (): ConsentPreferences => ({
  necessary: true,
  analytics: false,
  marketing: false,
  updatedAt: new Date().toISOString(),
});

function readStoredConsent(): ConsentPreferences | null {
  try {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<ConsentPreferences>;
      if (typeof parsed.analytics === "boolean" && typeof parsed.marketing === "boolean") {
        return {
          necessary: true,
          analytics: parsed.analytics,
          marketing: parsed.marketing,
          updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
        };
      }
    }

    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy === "granted" || legacy === "declined") {
      const migrated: ConsentPreferences = {
        necessary: true,
        analytics: legacy === "granted",
        marketing: false,
        updatedAt: new Date().toISOString(),
      };
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(migrated));
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
      return migrated;
    }
  } catch {
    return null;
  }

  return null;
}

export function CookieConsent() {
  const [preferences, setPreferences] = useState<ConsentPreferences | null>(null);
  const [draft, setDraft] = useState<ConsentPreferences>(emptyPreferences);
  const [ready, setReady] = useState(false);
  const [managing, setManaging] = useState(false);
  const footerInView = useFooterInView();

  useEffect(() => {
    const stored = readStoredConsent();
    if (stored) {
      setPreferences(stored);
      setDraft(stored);
    }
    setReady(true);
  }, []);

  function persist(next: ConsentPreferences) {
    setPreferences(next);
    setDraft(next);
    setManaging(false);

    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // The in-memory choice still applies for this visit when storage is unavailable.
    }
  }

  function acceptAll() {
    persist({ necessary: true, analytics: true, marketing: true, updatedAt: new Date().toISOString() });
  }

  function rejectNonEssential() {
    persist({ necessary: true, analytics: false, marketing: false, updatedAt: new Date().toISOString() });
  }

  function saveDraft() {
    persist({ ...draft, necessary: true, updatedAt: new Date().toISOString() });
  }

  function reopenPreferences() {
    setDraft(preferences ?? emptyPreferences());
    setManaging(true);
  }

  const showInitialBanner = ready && preferences === null && !managing;

  return (
    <>
      {preferences?.analytics && <Analytics />}

      {showInitialBanner && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-copy"
          className="fixed inset-x-3 bottom-3 z-100 mx-auto max-w-3xl rounded-2xl border p-5 shadow-elevation-lg backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:p-6"
          style={{ borderColor: "rgba(198,169,122,0.38)", backgroundColor: "rgba(27,27,27,0.96)" }}
        >
          <p id="cookie-consent-title" className="font-display text-xl text-ivory">
            Your privacy, your choice
          </p>
          <p id="cookie-consent-copy" className="mt-2 max-w-2xl text-sm leading-relaxed text-ivory/75">
            Necessary storage keeps the site working. Analytics helps me understand which pages earn attention.
            Marketing remains off unless you choose it. The booking calendar works either way.{" "}
            <Link href="/privacy" className="link-underline" style={{ color: "#C6A97A" }}>
              Read the privacy and cookie note
            </Link>
            .
          </p>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={acceptAll}
              className="rounded-full px-5 py-2.5 text-xs font-medium uppercase tracking-[0.14em] transition-opacity duration-300 hover:opacity-90 focus-visible:outline focus-visible:outline-2"
              style={{ backgroundColor: "#C6A97A", color: "#1B1B1B" }}
            >
              Accept all
            </button>
            <button
              type="button"
              onClick={rejectNonEssential}
              className="rounded-full border border-ivory/25 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-ivory/85 transition-colors duration-300 hover:border-ivory/55 hover:text-ivory focus-visible:outline focus-visible:outline-2"
            >
              Reject non-essential
            </button>
            <button
              type="button"
              onClick={() => setManaging(true)}
              className="rounded-full px-5 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-ivory/70 underline decoration-ivory/30 underline-offset-4 transition-colors hover:text-ivory focus-visible:outline focus-visible:outline-2"
            >
              Manage preferences
            </button>
          </div>
        </div>
      )}

      {ready && managing && (
        <div className="fixed inset-0 z-100 flex items-end justify-center bg-black/55 p-3 sm:items-center sm:p-6">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-preferences-title"
            className="w-full max-w-xl rounded-2xl border p-5 shadow-elevation-lg sm:p-7"
            style={{ borderColor: "rgba(198,169,122,0.35)", backgroundColor: "#1B1B1B" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-ivory/45">Privacy controls</p>
                <h2 id="cookie-preferences-title" className="mt-2 font-display text-2xl text-ivory">
                  Manage preferences
                </h2>
              </div>
              {preferences && (
                <button
                  type="button"
                  onClick={() => setManaging(false)}
                  className="rounded-full border border-ivory/20 px-3 py-1.5 text-xs text-ivory/70 hover:border-ivory/45 hover:text-ivory"
                  aria-label="Close cookie preferences"
                >
                  Close
                </button>
              )}
            </div>

            <div className="mt-6 space-y-4">
              <label className="flex gap-4 rounded-2xl border border-ivory/12 p-4">
                <input type="checkbox" checked disabled className="mt-1" />
                <span>
                  <span className="block text-sm font-medium text-ivory">Necessary</span>
                  <span className="mt-1 block text-sm leading-relaxed text-ivory/60">
                    Required for preferences, security, forms, navigation and core site functions. Always active.
                  </span>
                </span>
              </label>

              <label className="flex cursor-pointer gap-4 rounded-2xl border border-ivory/12 p-4 hover:border-ivory/25">
                <input
                  type="checkbox"
                  checked={draft.analytics}
                  onChange={(event) => setDraft((current) => ({ ...current, analytics: event.target.checked }))}
                  className="mt-1"
                />
                <span>
                  <span className="block text-sm font-medium text-ivory">Analytics</span>
                  <span className="mt-1 block text-sm leading-relaxed text-ivory/60">
                    Loads Vercel Analytics to measure page views and site interactions. Off until you choose it.
                  </span>
                </span>
              </label>

              <label className="flex cursor-pointer gap-4 rounded-2xl border border-ivory/12 p-4 hover:border-ivory/25">
                <input
                  type="checkbox"
                  checked={draft.marketing}
                  onChange={(event) => setDraft((current) => ({ ...current, marketing: event.target.checked }))}
                  className="mt-1"
                />
                <span>
                  <span className="block text-sm font-medium text-ivory">Marketing</span>
                  <span className="mt-1 block text-sm leading-relaxed text-ivory/60">
                    Reserved for future advertising or remarketing tools. No marketing tracker is currently installed.
                  </span>
                </span>
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={saveDraft}
                className="rounded-full px-5 py-2.5 text-xs font-medium uppercase tracking-[0.14em] hover:opacity-90"
                style={{ backgroundColor: "#C6A97A", color: "#1B1B1B" }}
              >
                Save preferences
              </button>
              <button
                type="button"
                onClick={rejectNonEssential}
                className="rounded-full border border-ivory/25 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-ivory/80 hover:border-ivory/50 hover:text-ivory"
              >
                Reject non-essential
              </button>
            </div>
          </div>
        </div>
      )}

      {ready && preferences && !managing && (
        <button
          type="button"
          onClick={reopenPreferences}
          aria-label="Open privacy preferences"
          className={`group fixed right-[4.15rem] z-90 flex h-11 w-11 items-center justify-center rounded-full border border-[#22231F]/12 bg-[#F5F0E8]/92 text-[#22231F] shadow-[0_12px_34px_-18px_rgba(34,35,31,.65)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[#A47746]/45 hover:text-[#8E603D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A47746]/55 ${footerInView ? "pointer-events-none translate-y-3 opacity-0" : "opacity-100"}`}
          style={{ bottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <ShieldCheck size={17} strokeWidth={1.7} aria-hidden="true" />
          <span className="pointer-events-none absolute bottom-[calc(100%+0.55rem)] right-0 hidden whitespace-nowrap rounded-full border border-[#22231F]/10 bg-[#F5F0E8]/96 px-3 py-1.5 text-[0.55rem] font-medium uppercase tracking-[0.14em] text-[#22231F]/72 opacity-0 shadow-sm backdrop-blur-xl transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 sm:block">
            Privacy
          </span>
        </button>
      )}
    </>
  );
}
