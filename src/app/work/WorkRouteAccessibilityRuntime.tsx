"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const LAB_DOSSIERS_LABEL = "Concept study dossiers";
const LAB_PHASES_SUFFIX = "strategy phases";
const STUDY_PANEL_PREFIX = "study-panel-";

function normaliseText(value: string | null | undefined) {
  return value?.replace(/\s+/g, " ").trim() ?? "";
}

function findLabSection() {
  return (
    document
      .querySelector<HTMLElement>(`[aria-label="${LAB_DOSSIERS_LABEL}"]`)
      ?.closest<HTMLElement>("section") ?? null
  );
}

function phaseTablistFor(element: Element) {
  const tablist = element.closest<HTMLElement>('[role="tablist"]');
  if (!tablist) return null;
  const label = normaliseText(tablist.getAttribute("aria-label"));
  return label.endsWith(LAB_PHASES_SUFFIX) ? tablist : null;
}

function syncPhaseTabStops(section: HTMLElement) {
  section.querySelectorAll<HTMLElement>('[role="tablist"]').forEach((tablist) => {
    const label = normaliseText(tablist.getAttribute("aria-label"));
    if (!label.endsWith(LAB_PHASES_SUFFIX)) return;

    const tabs = Array.from(tablist.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    tabs.forEach((tab) => {
      tab.tabIndex = tab.getAttribute("aria-selected") === "true" ? 0 : -1;
    });
  });
}

function restoredScrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

function findTriggerForPanel(panelId: string) {
  return Array.from(document.querySelectorAll<HTMLButtonElement>("button[aria-controls]")).find(
    (button) => button.getAttribute("aria-controls") === panelId,
  );
}

function restoreStudyCover(panelId: string) {
  if (!window.matchMedia("(max-width: 767px)").matches) return;

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      const trigger = findTriggerForPanel(panelId);
      if (!trigger || !trigger.isConnected) return;
      const rect = trigger.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      trigger.focus({ preventScroll: true });
      trigger.scrollIntoView({
        behavior: restoredScrollBehavior(),
        block: "center",
        inline: "nearest",
      });
    });
  });
}

export function WorkRouteAccessibilityRuntime() {
  const pathname = usePathname();
  const labSectionRef = useRef<HTMLElement | null>(null);
  const dossierTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (pathname !== "/work") {
      labSectionRef.current = null;
      dossierTriggerRef.current = null;
      return;
    }

    let mutationObserver: MutationObserver | null = null;
    const installationFrame = window.requestAnimationFrame(() => {
      const section = findLabSection();
      labSectionRef.current = section;
      if (!section) return;

      syncPhaseTabStops(section);
      mutationObserver = new MutationObserver(() => syncPhaseTabStops(section));
      mutationObserver.observe(section, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["aria-selected"],
      });
    });

    function handleClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target.closest<HTMLButtonElement>("button") : null;
      if (!target) return;

      if (normaliseText(target.textContent) === "Close study") {
        const panel = target.closest<HTMLElement>(`[role="region"][id^="${STUDY_PANEL_PREFIX}"]`);
        if (panel?.id) restoreStudyCover(panel.id);
        return;
      }

      const section = labSectionRef.current;
      if (!section?.contains(target)) return;

      const dossierGrid = target.closest<HTMLElement>(`[aria-label="${LAB_DOSSIERS_LABEL}"]`);
      const controlledId = target.getAttribute("aria-controls") ?? "";
      if (dossierGrid && controlledId.startsWith("lab-")) {
        dossierTriggerRef.current = target;
        return;
      }

      const tablist = phaseTablistFor(target);
      if (tablist) {
        window.requestAnimationFrame(() => syncPhaseTabStops(section));
        return;
      }

      if (normaliseText(target.textContent) !== "Close dossier") return;

      const trigger = dossierTriggerRef.current;
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          if (!trigger || !document.contains(trigger)) return;
          trigger.focus({ preventScroll: true });
          trigger.scrollIntoView({
            behavior: restoredScrollBehavior(),
            block: "center",
            inline: "nearest",
          });
        });
      });
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;

      const target = event.target instanceof Element ? event.target.closest<HTMLButtonElement>('[role="tab"]') : null;
      const section = labSectionRef.current;
      if (!target || !section?.contains(target)) return;

      const tablist = phaseTablistFor(target);
      if (!tablist) return;

      const tabs = Array.from(tablist.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
      const currentIndex = tabs.indexOf(target);
      if (currentIndex < 0 || tabs.length === 0) return;

      event.preventDefault();

      let nextIndex = currentIndex;
      if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
      if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;

      const nextTab = tabs[nextIndex];
      if (!nextTab) return;
      nextTab.click();
      nextTab.focus({ preventScroll: true });
      window.requestAnimationFrame(() => syncPhaseTabStops(section));
    }

    document.addEventListener("click", handleClick, true);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(installationFrame);
      mutationObserver?.disconnect();
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("keydown", handleKeyDown);
      labSectionRef.current = null;
      dossierTriggerRef.current = null;
    };
  }, [pathname]);

  return null;
}
