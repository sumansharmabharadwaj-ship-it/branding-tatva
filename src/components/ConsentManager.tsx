"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { X } from "lucide-react";
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
 * Three doors, all equally reachable: allow analytics, keep only what the
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
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const openPanel = useCallback(() => {
    const current = readConsent();
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setDraft({ analytics: current.analytics, marketing: current.marketing });
    setPanelOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setPanelOpen(false);
    window.requestAnimationFrame(() => {
      if (previousFocusRef.current?.isConnected) {
        previousFocusRef.current.focus();
        return;
      }
      document.querySelector<HTMLElement>('[aria-label="Manage preferences"]')?.focus();
    });
  }, []);

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
    const onOpen = () => openPanel();

    window.addEventListener(CONSENT_CHANGED_EVENT, onChanged);
    window.addEventListener(CONSENT_OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener(CONSENT_CHANGED_EVENT, onChanged);
      window.removeEventListener(CONSENT_OPEN_EVENT, onOpen);
    };
  }, [openPanel]);

  const decide = useCallback((choice: Draft) => {
    setConsent(writeConsent(choice));
    setPanelOpen(false);
  }, []);

  // Escape closes the panel, focus lands inside it when it opens, and Tab
  // stays within the modal until the visitor saves, declines, or closes it.
  useEffect(() => {
    if (!panelOpen) return;
    const panel = panelRef.current;
    if (!panel) return;
    const focusableSelector =
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
    panel.querySelector<HTMLElement>(focusableSelector)?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closePanel();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (node) => node.getClientRects().length > 0,
      );
      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closePanel, panelOpen]);

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
          className="fixed inset-x-3 bottom-3 z-[100] rounded-2xl border px-3 py-2 shadow-xl backdrop-blur-xl sm:left-1/2 sm:right-auto sm:w-[min(43rem,calc(100vw-2.5rem))] sm:-translate-x-1/2 sm:px-3"
          style={{ borderColor: "rgba(39,34,30,0.14)", backgroundColor: "rgba(244,239,230,0.94)" }}
        >
          <div className="grid gap-1.5 sm:grid-cols-[minmax(0,1fr)_21rem] sm:items-center sm:gap-4">
            <div className="flex items-start justify-between gap-3 sm:items-center">
              <p className="text-[0.74rem] leading-relaxed text-soil/76">
                Analytics are off by default.{" "}
                <Link href="/privacy" className="link-underline" style={{ color: "#9b5c43" }}>
                  Privacy note
                </Link>
                .
              </p>
              <button
                type="button"
                aria-label="Manage preferences"
                aria-haspopup="dialog"
                onClick={openPanel}
                className="inline-flex min-h-6 shrink-0 items-center px-1 text-[0.6rem] font-medium uppercase tracking-[0.12em] text-soil/58 underline underline-offset-4 transition-colors duration-300 hover:text-soil focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Preferences
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {/* Refusing is one click, exactly like agreeing. */}
              <button
                type="button"
                onClick={() => decide({ analytics: false, marketing: false })}
                className="min-h-11 rounded-full border border-soil/22 px-3 py-2 text-[0.66rem] font-medium uppercase tracking-[0.08em] text-soil/78 transition-colors duration-300 hover:border-soil/45 hover:text-soil focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Keep analytics off
              </button>
              <button
                type="button"
                onClick={() => decide({ analytics: true, marketing: false })}
                className="min-h-11 rounded-full px-3 py-2 text-[0.66rem] font-medium uppercase tracking-[0.08em] transition-opacity duration-300 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ backgroundColor: "#9b5c43", color: "#fffaf2" }}
              >
                Allow analytics
              </button>
            </div>
          </div>
        </div>
      )}

      {panelOpen && (
        <>
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={closePanel}
            className="fixed inset-0 z-[100] cursor-default bg-soil/[0.32] backdrop-blur-sm"
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Measurement preferences"
            className="fixed inset-x-3 bottom-3 z-[101] mx-auto max-h-[calc(100dvh-1.5rem)] max-w-3xl overflow-y-auto rounded-2xl border p-5 shadow-2xl backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:p-6"
            style={{ borderColor: "rgba(198,169,122,0.35)", backgroundColor: "rgba(27,27,27,0.97)" }}
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-xl text-ivory">Measurement preferences</h2>
              <button
                type="button"
                onClick={closePanel}
                aria-label="Close preferences"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ivory/20 text-ivory/72 transition-colors duration-300 hover:border-ivory/45 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>

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
                className="min-h-11 rounded-full px-5 py-2 text-xs font-medium uppercase tracking-[0.14em] transition-opacity duration-300 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ backgroundColor: "#C6A97A", color: "#1B1B1B" }}
              >
                Save choices
              </button>
              <button
                type="button"
                onClick={() => decide({ analytics: false, marketing: false })}
                className="min-h-11 rounded-full border border-ivory/30 px-5 py-2 text-xs font-medium uppercase tracking-[0.14em] text-ivory/85 transition-colors duration-300 hover:border-ivory/60 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Essential only
              </button>
              {decided && (
                <button
                  type="button"
                  onClick={closePanel}
                  className="min-h-11 rounded-full px-5 py-2 text-xs font-medium uppercase tracking-[0.14em] text-ivory/70 underline underline-offset-4 transition-colors duration-300 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </>
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
  const inputId = `consent-${title.toLowerCase()}`;

  return (
    <li className="rounded-xl border border-ivory/10 p-3">
      <label htmlFor={inputId} className={`flex w-full items-start gap-3 ${locked ? "cursor-default" : "cursor-pointer"}`}>
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          disabled={locked}
          onChange={(event) => onChange?.(event.target.checked)}
          aria-describedby={`${inputId}-detail`}
          className="mt-0.5 h-5 w-5 shrink-0 accent-[#C6A97A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60"
        />
        <span>
          <span className="block text-sm font-medium text-ivory">{title}</span>
          <span id={`${inputId}-detail`} className="block text-xs leading-relaxed text-ivory/65">
            {detail}
          </span>
        </span>
      </label>
    </li>
  );
}
