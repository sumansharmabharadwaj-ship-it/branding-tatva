"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import {
  CONSENT_CHANGED_EVENT,
  CONSENT_OPEN_EVENT,
  NO_CONSENT,
  hasDecided,
  readConsent,
  writeConsent,
  type ConsentState,
} from "@/lib/consent";

/*
 * The consent layer, and the only place measurement is allowed to mount.
 *
 * Analytics used to sit directly in the root layout, so it loaded for every
 * visitor before anyone had been asked anything. It now mounts only once a
 * visitor has actively turned it on, which is the difference between asking
 * and announcing.
 *
 * Three doors, all equally reachable: accept everything, keep only what the
 * site needs to work, or open the categories and decide one at a time.
 * Refusing is a real answer that takes one click, the same as agreeing;
 * burying it behind the preferences panel would make the easy path the
 * agreeable one, which is the pattern the rules exist to stop.
 *
 * The decision is never final. Any part of the site can reopen this panel by
 * firing CONSENT_OPEN_EVENT, which is what the footer link does, so
 * withdrawing later is the same single action as granting was.
 */

type Draft = { analytics: boolean; marketing: boolean };

export function ConsentManager() {
  // Server and first client render agree on "undecided, nothing granted", so
  // there is no hydration mismatch and nothing loads before the check.
  const [consent, setConsent] = useState<ConsentState>(NO_CONSENT);
  const [ready, setReady] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>({ analytics: false, marketing: false });
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stored = readConsent();
    setConsent(stored);
    setDraft({ analytics: stored.analytics, marketing: stored.marketing });
    setReady(true);

    const onChanged = (event: Event) => {
      const next = (event as CustomEvent<ConsentState>).detail;
      setConsent(next);
      setDraft({ analytics: next.analytics, marketing: next.marketing });
    };
    const onOpen = () => {
      const current = readConsent();
      setDraft({ analytics: current.analytics, marketing: current.marketing });
      setPanelOpen(true);
    };

    window.addEventListener(CONSENT_CHANGED_EVENT, onChanged);
    window.addEventListener(CONSENT_OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener(CONSENT_CHANGED_EVENT, onChanged);
      window.removeEventListener(CONSENT_OPEN_EVENT, onOpen);
    };
  }, []);

  const decide = useCallback((choice: Draft) => {
    setConsent(writeConsent(choice));
    setPanelOpen(false);
  }, []);

  // Escape closes the panel, and focus lands inside it when it opens.
  useEffect(() => {
    if (!panelOpen) return;
    panelRef.current?.querySelector<HTMLElement>("button, input")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPanelOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panelOpen]);

  const decided = hasDecided(consent);
  const showBanner = ready && !decided && !panelOpen;

  return (
    <>
      {/* The single gate. Measurement exists only inside this condition. */}
      {consent.analytics && <Analytics />}

      {showBanner && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Your choice about measurement"
          className="fixed inset-x-3 bottom-3 z-[100] rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-xl sm:left-auto sm:right-5 sm:w-[min(25rem,calc(100vw-2.5rem))]"
          style={{ borderColor: "rgba(39,34,30,0.14)", backgroundColor: "rgba(244,239,230,0.94)" }}
        >
          <div className="flex flex-col gap-3">
          <p className="max-w-[22rem] text-[0.78rem] leading-relaxed text-soil/76">
            Optional analytics are off. Choose whether to enable them.{" "}
            <Link href="/privacy" className="link-underline" style={{ color: "#9b5c43" }}>
              Privacy note
            </Link>
            .
          </p>
          <div className="flex shrink-0 flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => decide({ analytics: true, marketing: true })}
              className="rounded-full px-4 py-2 text-[0.65rem] font-medium uppercase tracking-[0.12em] transition-opacity duration-300 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ backgroundColor: "#9b5c43", color: "#fffaf2" }}
            >
              Accept all
            </button>
            {/* Refusing is one click, exactly like agreeing. */}
            <button
              type="button"
              onClick={() => decide({ analytics: false, marketing: false })}
              className="rounded-full border border-soil/20 px-4 py-2 text-[0.65rem] font-medium uppercase tracking-[0.12em] text-soil/75 transition-colors duration-300 hover:border-soil/45 hover:text-soil focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Essential only
            </button>
            <button
              type="button"
              onClick={() => setPanelOpen(true)}
              className="rounded-full px-2 py-2 text-[0.62rem] font-medium uppercase tracking-[0.12em] text-soil/58 underline underline-offset-4 transition-colors duration-300 hover:text-soil focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Manage preferences
            </button>
          </div>
          </div>
        </div>
      )}

      {panelOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Measurement preferences"
          className="fixed inset-x-3 bottom-3 z-[101] mx-auto max-w-3xl rounded-2xl border p-5 shadow-2xl backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:p-6"
          style={{ borderColor: "rgba(198,169,122,0.35)", backgroundColor: "rgba(27,27,27,0.97)" }}
        >
          <h2 className="font-display text-xl text-ivory">Measurement preferences</h2>

          <ul className="mt-4 space-y-3">
            <ConsentRow
              title="Essential"
              detail="Keeps the site working and remembers this choice. Always on."
              checked
              locked
            />
            <ConsentRow
              title="Analytics"
              detail="Counts which pages hold attention, through Vercel Analytics, so the writing can earn its place."
              checked={draft.analytics}
              onChange={(value) => setDraft((d) => ({ ...d, analytics: value }))}
            />
            <ConsentRow
              title="Marketing"
              detail="Advertising and audience trackers. None run on this site today, and this stays your choice rather than an assumption."
              checked={draft.marketing}
              onChange={(value) => setDraft((d) => ({ ...d, marketing: value }))}
            />
          </ul>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => decide(draft)}
              className="rounded-full px-5 py-2 text-xs font-medium uppercase tracking-[0.14em] transition-opacity duration-300 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ backgroundColor: "#C6A97A", color: "#1B1B1B" }}
            >
              Save choices
            </button>
            <button
              type="button"
              onClick={() => decide({ analytics: false, marketing: false })}
              className="rounded-full border border-ivory/30 px-5 py-2 text-xs font-medium uppercase tracking-[0.14em] text-ivory/85 transition-colors duration-300 hover:border-ivory/60 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Essential only
            </button>
            {decided && (
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="rounded-full px-5 py-2 text-xs font-medium uppercase tracking-[0.14em] text-ivory/70 underline underline-offset-4 transition-colors duration-300 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function ConsentRow({
  title,
  detail,
  checked,
  locked = false,
  onChange,
}: {
  title: string;
  detail: string;
  checked: boolean;
  locked?: boolean;
  onChange?: (value: boolean) => void;
}) {
  return (
    <li className="flex items-start gap-3 rounded-xl border border-ivory/10 p-3">
      <input
        type="checkbox"
        checked={checked}
        disabled={locked}
        onChange={(event) => onChange?.(event.target.checked)}
        aria-describedby={`consent-${title.toLowerCase()}-detail`}
        className="mt-1 h-4 w-4 shrink-0 accent-[#C6A97A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60"
      />
      <span>
        <span className="block text-sm font-medium text-ivory">{title}</span>
        <span id={`consent-${title.toLowerCase()}-detail`} className="block text-xs leading-relaxed text-ivory/65">
          {detail}
        </span>
      </span>
    </li>
  );
}
