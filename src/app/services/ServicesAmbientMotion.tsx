"use client";

import { useEffect } from "react";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

/** Keep large background animations local to the reader's viewport. */
export function ServicesAmbientMotion() {
  const reducedMotion = useHydratedReducedMotion();

  useEffect(() => {
    const root = document.getElementById("main-content");
    if (!root) return;

    const fields = new Map<HTMLElement, boolean>();

    function syncField(field: HTMLElement, nearby: boolean) {
      const interacting = document.documentElement.dataset.servicesFormInteraction === "true";
      const state = nearby && !document.hidden && !reducedMotion && !interacting ? "running" : "paused";
      if (field.dataset.servicesGradientMotion !== state) {
        field.dataset.servicesGradientMotion = state;
      }
    }

    const visibilityObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const field = entry.target as HTMLElement;
        if (!fields.has(field)) continue;
        fields.set(field, entry.isIntersecting);
        syncField(field, entry.isIntersecting);
      }
    }, { rootMargin: "15% 0px" });

    function registerFields() {
      // Optional evidence sections mount later. Release detached fields as
      // well, so opening and closing them never retains animation layers.
      for (const field of fields.keys()) {
        if (root?.contains(field)) continue;
        visibilityObserver.unobserve(field);
        fields.delete(field);
        delete field.dataset.servicesGradientMotion;
      }
      root?.querySelectorAll<HTMLElement>("[data-living-gradient]").forEach((field) => {
        if (fields.has(field)) return;
        fields.set(field, false);
        syncField(field, false);
        visibilityObserver.observe(field);
      });
    }

    function syncVisibility() {
      fields.forEach((nearby, field) => syncField(field, nearby));
    }

    registerFields();
    const contentObserver = new MutationObserver(registerFields);
    contentObserver.observe(root, { childList: true, subtree: true });
    const interactionObserver = new MutationObserver(syncVisibility);
    interactionObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-services-form-interaction"],
    });
    document.addEventListener("visibilitychange", syncVisibility);

    return () => {
      contentObserver.disconnect();
      interactionObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", syncVisibility);
      fields.forEach((_, field) => { delete field.dataset.servicesGradientMotion; });
      fields.clear();
    };
  }, [reducedMotion]);

  return null;
}
