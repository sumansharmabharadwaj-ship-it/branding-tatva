"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import {
  useEffect,
  useRef,
  type CSSProperties,
  type FocusEvent,
  type PointerEvent,
} from "react";
import { TrackedLink } from "@/components/TrackedLink";
import type { InsightCardPost } from "@/components/InsightCard";
import type { InsightEditorialVisual } from "@/data/insightEditorialVisuals";

const TOPIC_NAMES: Record<string, string> = {
  positioning: "Positioning",
  "customer-experience": "Customer experience",
  "distinctive-brand": "Distinctiveness",
  "brand-messaging": "Messaging",
  "brand-memory": "Brand memory",
};

type InsightEditorialRowProps = {
  post: InsightCardPost;
  visual: InsightEditorialVisual;
  rowNumber: number;
  tracking: {
    source: "insights_library";
    context?: Record<string, string | number | boolean>;
  };
  onOpen?: (post: InsightCardPost) => void;
};

function resetDepth(node: HTMLElement) {
  node.style.setProperty("--editorial-depth-x", "0px");
  node.style.setProperty("--editorial-depth-y", "0px");
  node.style.setProperty("--editorial-rotate-x", "0deg");
  node.style.setProperty("--editorial-rotate-y", "0deg");
  node.dataset.depthActive = "false";
}

export function InsightEditorialRow({
  post,
  visual,
  rowNumber,
  tracking,
  onOpen,
}: InsightEditorialRowProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const topicName = TOPIC_NAMES[post.topicSlug] ?? post.element;
  const readingTime = post.readingTime.replace(/\s+read$/i, "");

  useEffect(() => {
    const node = linkRef.current;
    if (!node) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) {
      node.dataset.revealed = "true";
      return;
    }

    let frame = 0;
    const updateScrollDepth = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        const rowCenter = rect.top + rect.height / 2;
        const distance = Math.max(
          -1,
          Math.min(1, (viewportCenter - rowCenter) / window.innerHeight),
        );
        node.style.setProperty(
          "--editorial-scroll-y",
          `${(distance * 10).toFixed(2)}px`,
        );
        node.style.setProperty(
          "--editorial-scroll-rotate",
          `${(distance * 0.75).toFixed(2)}deg`,
        );
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          node.dataset.revealed = "true";
          observer.disconnect();
        }
      },
      { threshold: 0.16 },
    );

    observer.observe(node);
    updateScrollDepth();
    window.addEventListener("scroll", updateScrollDepth, { passive: true });
    window.addEventListener("resize", updateScrollDepth, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", updateScrollDepth);
      window.removeEventListener("resize", updateScrollDepth);
    };
  }, []);

  function handlePointerMove(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType === "touch") return;
    const node = event.currentTarget;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    node.dataset.depthActive = "true";
    node.style.setProperty("--editorial-depth-x", `${(x * 9).toFixed(2)}px`);
    node.style.setProperty("--editorial-depth-y", `${(y * 7).toFixed(2)}px`);
    node.style.setProperty("--editorial-rotate-x", `${(-y * 3).toFixed(2)}deg`);
    node.style.setProperty("--editorial-rotate-y", `${(x * 4).toFixed(2)}deg`);
  }

  function handleFocus(event: FocusEvent<HTMLAnchorElement>) {
    event.currentTarget.dataset.depthActive = "true";
  }

  return (
    <TrackedLink
      ref={linkRef}
      href={`/insights/${post.slug}`}
      className="insight-editorial-row"
      data-depth-kind={visual.depthKind}
      data-depth-active="false"
      data-revealed="false"
      style={
        {
          "--editorial-panel-ratio": visual.aspectRatio,
        } as CSSProperties
      }
      event="insights_article_selected"
      eventProps={{
        ...tracking.context,
        source: tracking.source,
        article: post.slug,
        path: post.topicSlug,
      }}
      onClick={onOpen ? () => onOpen(post) : undefined}
      onPointerMove={handlePointerMove}
      onPointerLeave={(event) => resetDepth(event.currentTarget)}
      onFocus={handleFocus}
      onBlur={(event) => resetDepth(event.currentTarget)}
    >
      <span className="insight-editorial-row__copy">
        <span className="insight-editorial-row__eyebrow">
          <span>{String(rowNumber).padStart(2, "0")}</span>
          <span aria-hidden="true">—</span>
          {topicName}
        </span>
        <span className="insight-editorial-row__title-line">
          <strong>{visual.shortTitle ?? post.title}</strong>
          <ArrowRight aria-hidden="true" />
        </span>
        <span className="insight-editorial-row__description">
          {visual.description ?? post.excerpt}
        </span>
        <span className="insight-editorial-row__meta">
          {topicName}
          <span aria-hidden="true">·</span>
          {readingTime}
        </span>
      </span>

      <span className="insight-editorial-row__panel" aria-hidden="true">
        <span className="insight-editorial-row__panel-depth">
          <Image
            src={visual.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 64vw, 100vw"
            className="insight-editorial-row__panel-image insight-editorial-row__panel-image--base"
            priority={rowNumber === 1}
          />
          {visual.depthKind !== "image" ? (
            <>
              <span className="insight-editorial-row__panel-layer insight-editorial-row__panel-layer--middle">
                <Image
                  src={visual.src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 64vw, 100vw"
                  className="insight-editorial-row__panel-image"
                />
              </span>
              <span className="insight-editorial-row__panel-layer insight-editorial-row__panel-layer--near">
                <Image
                  src={visual.src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 64vw, 100vw"
                  className="insight-editorial-row__panel-image"
                />
              </span>
            </>
          ) : null}
        </span>
      </span>
      <span className="sr-only">{visual.alt}</span>
    </TrackedLink>
  );
}
