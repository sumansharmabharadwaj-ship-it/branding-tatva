"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { ShieldCheck, X } from "lucide-react";
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
 * The compact notice reports the privacy-preserving default without covering
 * the page. Its choices panel keeps analytics opt-in, essential-only use, and
 * category-by-category control together with equal visual weight.
 *
 * The decision is never final. Any part of the site can reopen this panel by
 * firing CONSENT_OPEN_EVENT, which is what the footer link does, so
 * withdrawing later is the same single action as granting was.
 */

type Draft = { analytics: boolean; marketing: boolean };

const NOTICE_COLLAPSE_Y = 96;
const NOTICE_EXPAND_Y = 32;

export function ConsentManager() {
  const pathname = usePathname();
  // Server and first client render agree on "undecided, nothing granted", so
  // there is no hydration mismatch and nothing loads before the check.
  const [consent, setConsent] = useState<ConsentState>(NO_CONSENT);
  const [ready, setReady] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [noticeCompact, setNoticeCompact] = useState(false);
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
      document.querySelector<HTMLElement>('[aria-label="Review measurement choices"]')?.focus();
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

  // Keep the privacy-preserving default legible on the opening scene. Once a
  // visitor begins the homepage journey, dock the notice into a persistent
  // 48px control so it cannot obscure the chapter instruments below. This is
  // deliberately driven by intent rather than a timer: nobody has to race a
  // disappearing message, and no consent choice is made on their behalf.
  useEffect(() => {
    if (!showBanner || pathname !== "/") {
      setNoticeCompact(false);
      return;
    }

    setNoticeCompact(false);
    const compactViewport = window.matchMedia("(min-width: 1024px)");
    let compact = false;
    let syncFrame: number | null = null;

    const syncNotice = () => {
      syncFrame = null;
      if (!compactViewport.matches) {
        compact = false;
        setNoticeCompact(false);
        return;
      }

      // Separate entry and return thresholds stop the control flickering when
      // a trackpad settles near the opening boundary.
      const nextCompact = compact
        ? window.scrollY > NOTICE_EXPAND_Y
        : window.scrollY > NOTICE_COLLAPSE_Y;
      if (nextCompact === compact) return;
      compact = nextCompact;
      setNoticeCompact(nextCompact);
    };

    const scheduleNoticeSync = () => {
      if (syncFrame !== null) return;
      syncFrame = window.requestAnimationFrame(syncNotice);
    };

    syncNotice();
    window.addEventListener("scroll", scheduleNoticeSync, { passive: true });
    compactViewport.addEventListener("change", scheduleNoticeSync);
    return () => {
      window.removeEventListener("scroll", scheduleNoticeSync);
      compactViewport.removeEventListener("change", scheduleNoticeSync);
      if (syncFrame !== null) window.cancelAnimationFrame(syncFrame);
    };
  }, [pathname, showBanner]);

  useEffect(() => {
    const root = document.documentElement;
    if (showBanner) {
      root.dataset.consentBanner = "visible";
      root.dataset.consentBannerCompact = noticeCompact ? "true" : "false";
    } else {
      delete root.dataset.consentBanner;
      delete root.dataset.consentBannerCompact;
    }
    return () => {
      delete root.dataset.consentBanner;
      delete root.dataset.consentBannerCompact;
    };
  }, [noticeCompact, showBanner]);

  return (
    <>
      {/* The single gate. Measurement exists only inside this condition. */}
      {consent.analytics && <Analytics />}

      {showBanner && (
        <div
          role="region"
          aria-label="Your choice about measurement"
          data-consent-compact={noticeCompact ? "true" : "false"}
          className="consent-notice fixed inset-x-3 bottom-3 z-[100] rounded-full border px-3 py-2 shadow-xl backdrop-blur-xl sm:right-5 sm:left-auto sm:w-auto"
          style={{ borderColor: "rgba(39,34,30,0.14)", backgroundColor: "rgba(244,239,230,0.94)" }}
        >
          <div className="flex min-h-10 items-center justify-between gap-3">
            <p
              aria-hidden={noticeCompact}
              className="consent-notice__message consent-notice__motion m-0 text-[0.69rem] leading-tight text-soil/76"
            >
              Analytics stays off.{" "}
              <Link
                href="/privacy"
                tabIndex={noticeCompact ? -1 : undefined}
                className="link-underline"
                style={{ color: "#9b5c43" }}
              >
                Privacy
              </Link>
            </p>
            <button
              type="button"
              aria-label="Review measurement choices"
              aria-haspopup="dialog"
              onClick={openPanel}
              className="consent-notice__action inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border border-soil/22 px-3 text-[0.58rem] font-medium uppercase tracking-[0.1em] text-soil/76 transition-colors duration-300 hover:border-soil/45 hover:text-soil focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ position: "relative", overflow: "hidden" }}
            >
              <span
                className="consent-notice__action-label consent-notice__motion"
                aria-hidden="true"
                style={{
                  display: "block",
                  maxWidth: noticeCompact ? 0 : "4.75rem",
                  overflow: "hidden",
                  opacity: noticeCompact ? 0 : 1,
                  transform: noticeCompact ? "translateX(0.45rem)" : "translateX(0)",
                  transition:
                    "opacity 220ms ease, transform 420ms cubic-bezier(0.22, 1, 0.36, 1), max-width 360ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                Choices
              </span>
              <ShieldCheck
                className="consent-notice__action-icon consent-notice__motion"
                size={17}
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  opacity: noticeCompact ? 1 : 0,
                  transform: noticeCompact
                    ? "translate(-50%, -50%) scale(1) rotate(0deg)"
                    : "translate(-50%, -50%) scale(0.72) rotate(-10deg)",
                  transition:
                    "opacity 220ms ease, transform 420ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              />
            </button>
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
                detail="Counts page views through Vercel Analytics so Suman can see which guides people use."
                checked={draft.analytics}
                onChange={(value) => setDraft((d) => ({ ...d, analytics: value }))}
              />
              <ConsentRow
                title="Marketing"
                detail="Advertising and audience trackers are not used today. This control stays visible so the choice remains yours if that changes."
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
