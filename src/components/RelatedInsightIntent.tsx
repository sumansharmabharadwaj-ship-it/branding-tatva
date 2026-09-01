"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { publishInsightsIntent } from "@/lib/insights-intent";

type RelatedInsightIntentProps = {
  children: ReactNode;
  position: number;
  topicSlug: string;
  topicName: string;
};

export function RelatedInsightIntent({
  children,
  position,
  topicSlug,
  topicName,
}: RelatedInsightIntentProps) {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const item = itemRef.current;
    if (!item) return;

    if (!("IntersectionObserver" in window)) {
      item.dataset.relatedMotion = "settled";
      return () => {
        delete item.dataset.relatedMotion;
      };
    }

    item.dataset.relatedMotion = "staged";
    let settleTimer = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        settleTimer = window.setTimeout(() => {
          item.dataset.relatedMotion = "settled";
        }, Math.max(0, position - 1) * 90);
        observer.disconnect();
      },
      { rootMargin: "-8% 0px -10%", threshold: 0.16 },
    );

    observer.observe(item);

    return () => {
      observer.disconnect();
      if (settleTimer) window.clearTimeout(settleTimer);
      delete item.dataset.relatedMotion;
    };
  }, [position]);

  return (
    <div
      ref={itemRef}
      className="insight-related-intent h-full"
      data-related-position={position}
      onClick={() => {
        publishInsightsIntent({
          topicSlug,
          query: "",
          label: topicName,
          origin: "insights-article",
        });
      }}
    >
      {children}
    </div>
  );
}
