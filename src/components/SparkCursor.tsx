"use client";

import { useEffect, useRef } from "react";
import { useMotionPreference } from "@/components/MotionPreference";

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, summary, [data-magnetic]';
const TOUCH_GLOW_HOLD_MS = 520;

export function SparkCursor() {
  const { pref } = useMotionPreference();
  const sunRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // A tablet can keep touch as its primary pointer after a mouse connects.
    const finePointer = window.matchMedia("(any-pointer: fine)");
    const osReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sun = sunRef.current;
    const label = labelRef.current;
    if (!sun || !label) return;

    const cursorSun: HTMLDivElement = sun;
    const cursorLabel: HTMLDivElement = label;
    let active = false;
    let keyboardMode = false;
    let lastInput: "mouse" | "touch" | null = null;
    let touchPointerId: number | null = null;
    let touchFadeTimer: number | null = null;
    const contactPointers = new Set<number>();
    let observedInteractiveTarget: HTMLElement | null = null;
    let activeLabelCopy = "";
    let labelWidth = 0;
    let labelHeight = 0;
    let pointerX = 0;
    let pointerY = 0;
    let targetRefreshFrame: number | null = null;

    function motionAllowed() {
      return !osReduced.matches && pref !== "reduced";
    }

    function clearTouchTimer() {
      if (touchFadeTimer !== null) window.clearTimeout(touchFadeTimer);
      touchFadeTimer = null;
    }

    function hideTouch() {
      clearTouchTimer();
      touchPointerId = null;
      if (lastInput === "touch") cursorSun.style.opacity = "0";
    }

    function clearLabel() {
      labelObserver.disconnect();
      observedInteractiveTarget = null;
      activeLabelCopy = "";
      cursorLabel.textContent = "";
      cursorLabel.classList.remove("spark-cursor-label--visible");
      cursorSun.classList.remove("spark-cursor-core--hover");
    }

    function hideAll() {
      hideTouch();
      contactPointers.clear();
      lastInput = null;
      active = false;
      cursorSun.style.opacity = "0";
      cursorLabel.style.opacity = "0";
      clearLabel();
      document.documentElement.classList.remove("sun-cursor-active");
      if (targetRefreshFrame !== null) window.cancelAnimationFrame(targetRefreshFrame);
      targetRefreshFrame = null;
    }

    function positionTouch(event: PointerEvent) {
      // Lift the small sun clear of the finger without obscuring a control's
      // label. Keep the entire glow inside the current visible viewport.
      const viewport = window.visualViewport;
      const left = viewport?.offsetLeft ?? 0;
      const top = viewport?.offsetTop ?? 0;
      const width = viewport?.width ?? window.innerWidth;
      const height = viewport?.height ?? window.innerHeight;
      const edge = 24;
      const x = Math.max(left + edge, Math.min(event.clientX, left + width - edge));
      const y = Math.max(top + edge, Math.min(event.clientY - 32, top + height - edge));
      cursorSun.dataset.pointer = "touch";
      cursorSun.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0) translate(-50%, -50%)`;
      cursorSun.style.opacity = "1";
    }

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
      if (!motionAllowed()) {
        hideAll();
        return;
      }
      active =
        finePointer.matches &&
        lastInput === "mouse" &&
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
      if (event.pointerType !== "mouse") {
        if (event.pointerId === touchPointerId && motionAllowed()) positionTouch(event);
        return;
      }
      if (contactPointers.size > 0) return;
      hideTouch();
      keyboardMode = false;
      lastInput = "mouse";
      sync();
      if (!active) return;
      cursorSun.dataset.pointer = "mouse";
      pointerX = event.clientX;
      pointerY = event.clientY;
      cursorSun.style.opacity = "1";
      cursorSun.style.transform =
        `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      syncInteractiveTarget(event.target instanceof Element ? event.target : null);
      positionLabel();
    }

    function down(event: PointerEvent) {
      if (event.pointerType === "mouse") {
        move(event);
        return;
      }
      if (event.pointerType !== "touch" && event.pointerType !== "pen") return;
      contactPointers.add(event.pointerId);
      hideTouch();
      lastInput = "touch";
      keyboardMode = false;
      sync();
      clearLabel();
      // Pinch zoom and other multi-contact gestures keep native ownership.
      if (!event.isPrimary || contactPointers.size > 1 || !motionAllowed()) return;
      touchPointerId = event.pointerId;
      positionTouch(event);
    }

    function up(event: PointerEvent) {
      contactPointers.delete(event.pointerId);
      if (event.pointerId !== touchPointerId) return;
      touchPointerId = null;
      clearTouchTimer();
      touchFadeTimer = window.setTimeout(hideTouch, TOUCH_GLOW_HOLD_MS);
    }

    function cancel(event: PointerEvent) {
      contactPointers.delete(event.pointerId);
      if (event.pointerId === touchPointerId) hideTouch();
    }

    function resize() {
      hideTouch();
      positionLabel();
    }

    function visibility() {
      if (document.visibilityState === "hidden") hideAll();
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab") return;
      keyboardMode = true;
      hideAll();
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

    function refreshAfterClick(event: MouseEvent) {
      if (!active || event.detail === 0) return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (targetRefreshFrame !== null) window.cancelAnimationFrame(targetRefreshFrame);

      // A tab action can replace the control beneath a stationary pointer.
      // Let React commit the new panel before reading the visible target.
      targetRefreshFrame = window.requestAnimationFrame(() => {
        targetRefreshFrame = null;
        if (!active) return;
        syncInteractiveTarget(document.elementFromPoint(pointerX, pointerY));
        positionLabel();
      });
    }

    function over(event: PointerEvent) {
      if (event.pointerType !== "mouse" || !active || !(event.target instanceof Element)) return;
      syncInteractiveTarget(event.target);
    }

    function out(event: PointerEvent) {
      // Touch sends pointerout after release; allow its short glow to finish.
      if (event.pointerType === "mouse" && !(event.relatedTarget instanceof Element)) hideAll();
    }

    sync();
    finePointer.addEventListener("change", sync);
    osReduced.addEventListener("change", sync);
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    window.addEventListener("pointercancel", cancel, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("scroll", hideTouch, { passive: true });
    window.addEventListener("blur", hideAll);
    window.addEventListener("pagehide", hideAll);
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("visibilitychange", visibility);
    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerout", out, { passive: true });
    document.addEventListener("click", refreshAfterClick, { passive: true });

    return () => {
      finePointer.removeEventListener("change", sync);
      osReduced.removeEventListener("change", sync);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancel);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", hideTouch);
      window.removeEventListener("blur", hideAll);
      window.removeEventListener("pagehide", hideAll);
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("visibilitychange", visibility);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
      document.removeEventListener("click", refreshAfterClick);
      hideAll();
    };
  }, [pref]);

  return (
    <>
      <div ref={sunRef} aria-hidden="true" className="spark-cursor-core sun-cursor" />
      <div ref={labelRef} aria-hidden="true" className="spark-cursor-label" />
    </>
  );
}
