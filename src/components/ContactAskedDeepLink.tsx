"use client";

import { useEffect } from "react";

// A <details> element ignores URL fragments on its own: a shared link to
// one of the short answers would land on a closed question with nothing
// visibly addressed. This opens the addressed answer on arrival and on
// in-page hash changes, then lets the anchor scroll land on it. The page
// uses native scroll (Lenis stands down on /contact), and the film's own
// scroll-behavior rule decides whether the travel glides.
export function ContactAskedDeepLink() {
  useEffect(() => {
    function openAddressedAnswer() {
      const hash = window.location.hash;
      if (!hash.startsWith("#asked-")) return;
      const target = document.getElementById(hash.slice(1));
      if (target instanceof HTMLDetailsElement) {
        target.open = true;
        target.scrollIntoView({ block: "start" });
      }
    }
    openAddressedAnswer();
    window.addEventListener("hashchange", openAddressedAnswer);
    return () => window.removeEventListener("hashchange", openAddressedAnswer);
  }, []);

  return null;
}
