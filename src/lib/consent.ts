"use client";

/*
 * Consent state for the whole site.
 *
 * Measurement was mounting for every visitor the moment a page loaded, so
 * people were counted before anyone asked them. This is the record of what a
 * visitor actually agreed to, and nothing that needs agreement may read
 * anything else.
 *
 * Two rules shape the model. Nothing is on until a visitor turns it on, so
 * the default is a full set of false rather than an assumed yes. And a
 * decision can always be changed, so the record carries when it was made and
 * which version of the categories it was made against; if the categories
 * change materially, an old decision stops counting and the visitor is asked
 * again rather than silently carried over.
 *
 * The record lives in localStorage rather than in a cookie. Storing a cookie
 * in order to remember a decision about cookies reads as carelessness, and
 * localStorage never travels to a server.
 */

export type ConsentState = {
  analytics: boolean;
  marketing: boolean;
  /** ISO timestamp of the decision, or null while undecided. */
  decidedAt: string | null;
  version: number;
};

const STORAGE_KEY = "bt-consent";
/** Raise this only when the categories themselves change meaning. */
export const CONSENT_VERSION = 1;
export const CONSENT_CHANGED_EVENT = "bt:consent-changed";
export const CONSENT_OPEN_EVENT = "bt:consent-open";

export const NO_CONSENT: ConsentState = {
  analytics: false,
  marketing: false,
  decidedAt: null,
  version: CONSENT_VERSION,
};

export function readConsent(): ConsentState {
  if (typeof window === "undefined") return NO_CONSENT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return NO_CONSENT;
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    // A decision made against a different set of categories is not a
    // decision about these ones.
    if (parsed.version !== CONSENT_VERSION) return NO_CONSENT;
    return {
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
      decidedAt: typeof parsed.decidedAt === "string" ? parsed.decidedAt : null,
      version: CONSENT_VERSION,
    };
  } catch {
    // Storage can be unavailable in private mode. Asking again next visit
    // is the safe failure; assuming agreement is not.
    return NO_CONSENT;
  }
}

export function hasDecided(state: ConsentState) {
  return state.decidedAt !== null;
}

export function writeConsent(choice: { analytics: boolean; marketing: boolean }) {
  const next: ConsentState = {
    analytics: choice.analytics,
    marketing: choice.marketing,
    decidedAt: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // The visit still respects the choice even when it cannot be written down.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: next }));
  return next;
}

/** Withdrawing is the same act as granting, so it uses the same door. */
export function withdrawConsent() {
  return writeConsent({ analytics: false, marketing: false });
}

export function openConsentPreferences() {
  window.dispatchEvent(new CustomEvent(CONSENT_OPEN_EVENT));
}
