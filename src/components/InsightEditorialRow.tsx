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
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

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
  node.style.setProperty("--editorial-lift", "0");
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
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const focusedRef = useRef(false);
  const queueDepthRef = useRef<(() => void) | null>(null);
  const prefersReducedMotion = useHydratedReducedMotion();
  const topicName = TOPIC_NAMES[post.topicSlug] ?? post.element;
  const readingTime = post.readingTime.replace(/\s+read$/i, "");

  useEffect(() => {
    const node = linkRef.current;
    if (!node) return;

    if (prefersReducedMotion) {
      pointerRef.current = null;
      node.dataset.revealed = "true";
      resetDepth(node);
      node.style.setProperty("--editorial-scroll-y", "0px");
      node.style.setProperty("--editorial-scroll-rotate", "0deg");
      return;
    }

    let frame = 0;
    let visible = false;
    let lastFrameTime = 0;
    let needsMeasurement = true;
    const current = { x: 0, y: 0, scroll: 0, lift: 0 };
    const target = { ...current };
    const styleValues = new Map<string, string>();

    const writeStyle = (property: string, value: string) => {
      if (styleValues.get(property) === value) return;
      styleValues.set(property, value);
      node.style.setProperty(property, value);
    };

    const renderDepth = (timestamp: number) => {
      frame = 0;
      if (!visible || document.hidden) return;

      // Read geometry only after input or a viewport change. Settling frames
      // interpolate the cached targets without measuring the layout again.
      if (needsMeasurement) {
        needsMeasurement = false;
        const rect = node.getBoundingClientRect();
        const viewportHeight = Math.max(1, window.innerHeight);
        target.scroll = Math.max(-1, Math.min(1,
          (viewportHeight / 2 - rect.top - rect.height / 2) / viewportHeight,
        ));
        const pointer = pointerRef.current;
        const pointerInside = pointer &&
          pointer.x >= rect.left && pointer.x <= rect.right &&
          pointer.y >= rect.top && pointer.y <= rect.bottom;
        if (pointerInside) {
          target.x = (pointer.x - rect.left) / Math.max(1, rect.width) - 0.5;
          target.y = (pointer.y - rect.top) / Math.max(1, rect.height) - 0.5;
        } else {
          pointerRef.current = null;
          target.x = 0;
          target.y = 0;
        }
        target.lift = pointerInside || focusedRef.current ? 1 : 0;
        node.dataset.depthActive = String(target.lift === 1);
      }

      const elapsed = lastFrameTime ? Math.min(50, timestamp - lastFrameTime) : 1000 / 60;
      lastFrameTime = timestamp;
      let settling = false;
      for (const key of ["x", "y", "scroll", "lift"] as const) {
        const ease = 1 - Math.exp(-elapsed / (key === "lift" ? 140 : 100));
        current[key] += (target[key] - current[key]) * ease;
        if (Math.abs(target[key] - current[key]) < 0.002) current[key] = target[key];
        else settling = true;
      }

      writeStyle("--editorial-depth-x", `${(current.x * 9).toFixed(2)}px`);
      writeStyle("--editorial-depth-y", `${(current.y * 7).toFixed(2)}px`);
      writeStyle("--editorial-rotate-x", `${(-current.y * 3).toFixed(2)}deg`);
      writeStyle("--editorial-rotate-y", `${(current.x * 4).toFixed(2)}deg`);
      writeStyle("--editorial-scroll-y", `${(current.scroll * 10).toFixed(2)}px`);
      writeStyle("--editorial-scroll-rotate", `${(current.scroll * 0.75).toFixed(2)}deg`);
      writeStyle("--editorial-lift", current.lift.toFixed(3));

      if (settling) frame = requestAnimationFrame(renderDepth);
      else lastFrameTime = 0;
    };
    // Pointer, focus, and scroll share one animation; leave and blur settle too.
    const updateScrollDepth = () => {
      needsMeasurement = true;
      if (!visible || frame || document.hidden) return;
      frame = requestAnimationFrame(renderDepth);
    };
    queueDepthRef.current = updateScrollDepth;

    const suspendDepth = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastFrameTime = 0;
      pointerRef.current = null;
      for (const key of ["x", "y", "scroll", "lift"] as const) {
        current[key] = 0;
        target[key] = 0;
      }
      styleValues.clear();
      resetDepth(node);
      node.style.setProperty("--editorial-scroll-y", "0px");
      node.style.setProperty("--editorial-scroll-rotate", "0deg");
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting);
        if (visible) {
          node.dataset.revealed = "true";
          updateScrollDepth();
        } else {
          suspendDepth();
        }
      },
      { threshold: 0 },
    );

    observer.observe(node);
    updateScrollDepth();
    window.addEventListener("scroll", updateScrollDepth, { passive: true });
    window.addEventListener("resize", updateScrollDepth, { passive: true });
    const handleVisibility = () => {
      if (document.hidden) {
        suspendDepth();
      } else updateScrollDepth();
    };
    const handleWindowBlur = () => {
      pointerRef.current = null;
      focusedRef.current = false;
      updateScrollDepth();
    };
    const handleWindowFocus = () => {
      focusedRef.current = document.activeElement === node && node.matches(":focus-visible");
      updateScrollDepth();
    };
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      queueDepthRef.current = null;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", updateScrollDepth);
      window.removeEventListener("resize", updateScrollDepth);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [prefersReducedMotion]);

  function handlePointerMove(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType === "touch") return;
    if (prefersReducedMotion) return;
    pointerRef.current = { x: event.clientX, y: event.clientY };
    queueDepthRef.current?.();
  }

  function handleFocus(event: FocusEvent<HTMLAnchorElement>) {
    focusedRef.current = event.currentTarget.matches(":focus-visible");
    if (prefersReducedMotion) return;
    event.currentTarget.dataset.revealed = "true";
    queueDepthRef.current?.();
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
      onPointerLeave={() => {
        pointerRef.current = null;
        queueDepthRef.current?.();
      }}
      onFocus={handleFocus}
      onBlur={() => {
        focusedRef.current = false;
        queueDepthRef.current?.();
      }}
    >
      <span className="insight-editorial-row__copy">
        <span className="insight-editorial-row__eyebrow">
          <span>{String(rowNumber).padStart(2, "0")}</span>
          <span aria-hidden="true">/</span>
          {topicName}
        </span>
        <span className="insight-editorial-row__title-line">
          <strong>{visual.shortTitle ?? post.title}</strong>
        </span>
        <span className="insight-editorial-row__description">
          {visual.description ?? post.excerpt}
        </span>
        <span className="insight-editorial-row__meta">
          <span className="insight-editorial-row__read">
            Read essay
            <ArrowRight aria-hidden="true" />
          </span>
          <span className="insight-editorial-row__duration">{readingTime}</span>
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
