"use client";

import { useEffect, useRef } from "react";
import { useMotionPreference } from "@/components/MotionPreference";

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, summary, [data-magnetic]';

export function SparkCursor() {
  const { pref } = useMotionPreference();
  const sunRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const osReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sun = sunRef.current;
    const label = labelRef.current;
    if (!sun || !label) return;

    const cursorSun: HTMLDivElement = sun;
    const cursorLabel: HTMLDivElement = label;
    let active = false;
    let keyboardMode = false;
    let observedInteractiveTarget: HTMLElement | null = null;
    let activeLabelCopy = "";
    let labelWidth = 0;
    let labelHeight = 0;
    let pointerX = 0;
    let pointerY = 0;

    function positionLabel() {
      const edge = 12;
      const gap = 24;
      const halfWidth = labelWidth / 2;
      const minX = edge + halfWidth;
      const maxX = window.innerWidth - edge - halfWidth;
      const x = Math.min(Math.max(pointerX, minX), Math.max(minX, maxX));
      const below = pointerY + gap;
      const above = pointerY - gap - labelHeight;
      const y = below + labelHeight <= window.innerHeight - edge
        ? below
        : Math.max(edge, above);

      cursorLabel.style.transform =
        `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0) translateX(-50%)`;
    }

    function measureLabel() {
      const bounds = cursorLabel.getBoundingClientRect();
      labelWidth = bounds.width;
      labelHeight = bounds.height;
      positionLabel();
    }

    function sync() {
      active =
        finePointer.matches &&
        !osReduced.matches &&
        pref !== "reduced" &&
        !keyboardMode;
      document.documentElement.classList.toggle("sun-cursor-active", active);
      if (!active) {
        cursorSun.style.opacity = "0";
        cursorLabel.style.opacity = "0";
      } else {
        cursorSun.style.removeProperty("opacity");
        cursorLabel.style.removeProperty("opacity");
      }
    }

    function move(event: PointerEvent) {
      if (event.pointerType === "mouse" && keyboardMode) {
        keyboardMode = false;
        sync();
      }
      if (!active) return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      cursorSun.style.opacity = "1";
      cursorSun.style.transform =
        `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      syncInteractiveTarget(event.target instanceof Element ? event.target : null);
      positionLabel();
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab") return;
      keyboardMode = true;
      sync();
    }

    function syncInteractiveTarget(targetElement: Element | null) {
      const target = targetElement?.closest<HTMLElement>(INTERACTIVE_SELECTOR) ?? null;
      if (target !== observedInteractiveTarget) {
        labelObserver.disconnect();
        observedInteractiveTarget = target;
        if (observedInteractiveTarget) {
          labelObserver.observe(observedInteractiveTarget, {
            attributes: true,
            attributeFilter: ["aria-label", "data-cursor-label"],
          });
        }
      }
      cursorSun.classList.toggle("spark-cursor-core--hover", Boolean(target));
      const copy =
        target?.dataset.cursorLabel ||
        target?.getAttribute("aria-label") ||
        "";
      const nextCopy = copy.slice(0, 24);
      if (nextCopy !== activeLabelCopy) {
        activeLabelCopy = nextCopy;
        cursorLabel.textContent = nextCopy;
        cursorLabel.classList.toggle("spark-cursor-label--visible", Boolean(nextCopy));
        measureLabel();
      }
    }

    const labelObserver = new MutationObserver(() => {
      if (observedInteractiveTarget) syncInteractiveTarget(observedInteractiveTarget);
    });

    function over(event: PointerEvent) {
      if (!active || !(event.target instanceof Element)) return;
      syncInteractiveTarget(event.target);
    }

    function out(event: PointerEvent) {
      if (!(event.relatedTarget instanceof Element)) {
        cursorSun.style.opacity = "0";
        cursorLabel.classList.remove("spark-cursor-label--visible");
        activeLabelCopy = "";
        observedInteractiveTarget = null;
        labelObserver.disconnect();
      }
    }

    sync();
    finePointer.addEventListener("change", sync);
    osReduced.addEventListener("change", sync);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("resize", positionLabel, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerout", out, { passive: true });

    return () => {
      finePointer.removeEventListener("change", sync);
      osReduced.removeEventListener("change", sync);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("resize", positionLabel);
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
      labelObserver.disconnect();
      document.documentElement.classList.remove("sun-cursor-active");
    };
  }, [pref]);

  return (
    <>
      <div ref={sunRef} aria-hidden="true" className="spark-cursor-core sun-cursor" />
      <div ref={labelRef} aria-hidden="true" className="spark-cursor-label" />
    </>
  );
}
