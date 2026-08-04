"use client";

import { useEffect } from "react";

type Situation = "idea" | "inconsistent" | "outgrown";

const HASH_TO_SITUATION: Record<string, Situation> = {
  "#desire": "idea",
  "#situation": "inconsistent",
  "#offerings": "outgrown",
};

export function HomeChoiceMemory() {
  useEffect(() => {
    function rememberChoice(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.pathname !== "/services") return;

      const situation = HASH_TO_SITUATION[url.hash];
      if (!situation) return;

      try {
        window.localStorage.setItem("bt-situation", situation);
      } catch {}

      window.dispatchEvent(
        new CustomEvent("bt:situation", {
          detail: {
            situation,
            source: "path-choice",
            href: `${url.pathname}${url.hash}`,
          },
        }),
      );
    }

    document.addEventListener("click", rememberChoice, true);
    return () => document.removeEventListener("click", rememberChoice, true);
  }, []);

  return null;
}
