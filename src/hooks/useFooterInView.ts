"use client";

import { useEffect, useState } from "react";

/**
 * Fixed utilities should leave the last frame and footer unobstructed. The
 * controls remain available throughout the story, then quietly yield once
 * the footer itself enters the viewport.
 */
export function useFooterInView(): boolean {
  const [footerInView, setFooterInView] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => setFooterInView(entry.isIntersecting),
      { threshold: 0.02 },
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return footerInView;
}
