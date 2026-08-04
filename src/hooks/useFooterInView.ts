"use client";

import { useEffect, useState } from "react";

/**
 * Fixed utilities should leave the last frame and footer unobstructed. The
 * controls remain available throughout the story, then quietly yield once
 * the footer itself enters the viewport. A small mutation observer rebinds
 * the intersection observer after client-side navigation replaces a page's
 * footer without remounting the sitewide utilities.
 */
export function useFooterInView(): boolean {
  const [footerInView, setFooterInView] = useState(false);

  useEffect(() => {
    let observedFooter: Element | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => setFooterInView(entry.isIntersecting),
      { threshold: 0.02 },
    );

    const bindFooter = () => {
      const nextFooter = document.querySelector("footer");
      if (nextFooter === observedFooter) return;

      if (observedFooter) observer.unobserve(observedFooter);
      observedFooter = nextFooter;
      setFooterInView(false);
      if (observedFooter) observer.observe(observedFooter);
    };

    bindFooter();
    const mutations = new MutationObserver(bindFooter);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
    };
  }, []);

  return footerInView;
}
