"use client";

import { openConsentPreferences } from "@/lib/consent";

/*
 * The way back. Consent that cannot be withdrawn as easily as it was given
 * is not really consent, so this sits in the footer of every page and
 * reopens the same panel the banner opens.
 */
export function ConsentPreferencesLink() {
  return (
    <button
      type="button"
      onClick={openConsentPreferences}
      className="text-xs text-ivory/70 underline decoration-ivory/40 underline-offset-2 transition-colors hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      Measurement preferences
    </button>
  );
}
