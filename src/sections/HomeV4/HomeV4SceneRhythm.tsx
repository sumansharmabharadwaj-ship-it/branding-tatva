"use client";

import { useEffect } from "react";
import { useHydratedMotionPreference } from "@/hooks/useHydratedReducedMotion";

const DESKTOP = "(min-width: 1181px) and (min-height: 761px) and (pointer: fine)";
type Treatment = "title" | "fan" | "plate" | "portrait" | "row" | "rail";
type LayerSpec = readonly [selector: string, treatment: Treatment];
type SceneSpec = { selector: string; layers: readonly LayerSpec[] };

// Stable semantic hooks keep CSS-module names and the scenes' tab state private.
// Each plate settles before its reading interval. Existing sticky stories retain
// sole ownership of their content, media and stage selection.
const SCENES: readonly SceneSpec[] = [
  { selector: '[data-home-v4-chapter="opening"]', layers: [
    [".home-v4-opening__proof", "plate"],
  ] },
  { selector: '[data-home-v4-chapter="recognition"]', layers: [
    ["h2", "title"], ['[role="tab"]', "fan"], ['[role="tabpanel"]', "plate"],
  ] },
  { selector: '[data-home-v4-chapter="cost"]', layers: [
    ["h2", "title"], ['[data-home-cost-comparison]', "plate"], ['[data-home-cost-item]', "fan"],
  ] },
  { selector: '[data-scroll-story="foundation"]', layers: [
    ["h2", "title"], ['[role="tablist"]', "rail"], ['[role="tabpanel"]', "plate"],
  ] },
  { selector: '[data-scroll-story="paths"]', layers: [
    ["h2", "title"], ['[role="tablist"]', "rail"], ['[role="tabpanel"]', "plate"],
  ] },
  { selector: '[data-scroll-story="process"]', layers: [
    ["h2", "title"], ['[role="tablist"]', "rail"], ['[role="tabpanel"]', "plate"],
  ] },
  { selector: '[data-home-v4-chapter="evidence"]', layers: [
    ["h2", "title"], ['[role="tab"]', "fan"], ['[role="tabpanel"]', "plate"],
  ] },
  { selector: '.tatva-observatory', layers: [
    ["h2", "title"], [".tatva-observatory__force", "fan"],
  ] },
  { selector: '.tatva-pressure-lab', layers: [
    ["h2", "title"], [".tatva-pressure-lab__board", "plate"],
  ] },
  { selector: '.studio-cinematic', layers: [
    ["h2", "title"], ['[role="tabpanel"]', "plate"], [".studio-cinematic__portrait", "portrait"],
  ] },
  { selector: '[data-home-v4-chapter="decision"]', layers: [
    ["h2", "title"], ["[data-open]", "row"],
  ] },
  { selector: '[data-home-v4-chapter="invitation"]', layers: [
    ["h2", "title"], ["aside", "plate"],
  ] },
];

function clamp(value: number) { return Math.max(0, Math.min(1, value)); }
function ease(value: number) { const p = clamp(value); return p * p * (3 - 2 * p); }

/** Native-scroll choreography, with no spacers, wheel interception or timers. */
export function HomeV4SceneRhythm() {
  const { hydrated, prefersReducedMotion } = useHydratedMotionPreference();

  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-home-v4]");
    if (!root || !hydrated || prefersReducedMotion) return;
    const desktop = window.matchMedia(DESKTOP);
    let frame = 0;
    let disposed = false;
    const scenes = SCENES.flatMap((spec, sceneIndex) => {
      const element = root.querySelector<HTMLElement>(spec.selector);
      if (!element) return [];
      const layers = spec.layers.flatMap(([selector, treatment]) => {
        const matches = Array.from(element.querySelectorAll<HTMLElement>(selector));
        return matches.map((node, index) => ({
          node, treatment, index, spread: index - (matches.length - 1) / 2,
          side: sceneIndex % 2 ? 1 : -1, appliedY: 0, last: "",
        }));
      });
      return [{ element, layers }];
    });
    const handoffs = Array.from(root.querySelectorAll<HTMLElement>(".home-v4-handoff"));
    const footerTitle = document.querySelector<HTMLElement>("footer h2");
    // The footer title is a separate reading beat, scoped to the mounted home.
    if (footerTitle) scenes.push({ element: footerTitle.parentElement!, layers: [{
      node: footerTitle, treatment: "title", index: 0, spread: 0, side: 1, appliedY: 0, last: "",
    }] });

    function render() {
      frame = 0;
      if (document.hidden || disposed) return;
      const viewport = Math.max(1, window.innerHeight);
      const wide = desktop.matches;
      const focused = document.activeElement;
      // Finish all reads before writes, including compact per-element geometry.
      const measurements = scenes.map((scene) => ({
        scene, top: scene.element.getBoundingClientRect().top,
        layers: scene.layers.map((layer) => ({
          layer,
          top: wide ? 0 : layer.node.getBoundingClientRect().top - layer.appliedY,
          focused: layer.node === focused || layer.node.contains(focused),
        })),
      }));
      const seamPositions = handoffs.map((node) => ({ node, top: node.getBoundingClientRect().top }));

      measurements.forEach(({ scene, top, layers }) => {
        const entering = 1 - ease((viewport * 0.96 - top) / (viewport * 0.74));
        scene.element.dataset.homeMotionScene = "ready";
        layers.forEach(({ layer, top: layerTop, focused: hasFocus }) => {
          const { node, treatment, index, spread, side } = layer;
          const amount = hasFocus ? 0 : wide
            ? clamp(entering * (1 + (treatment === "fan" || treatment === "row" ? index * 0.09 : 0)))
            : 1 - ease((viewport * 0.96 - layerTop) / (viewport * 0.3));
          let x = 0;
          let y = amount * (wide ? 68 : 22);
          let rotate = 0;
          let scale = 1;
          if (wide) {
            if (treatment === "rail") {
              y = 28 * amount;
            } else if (treatment === "fan") {
              x = spread * 42 * amount;
              y = (74 + Math.abs(spread) * 18) * amount;
              rotate = spread * 3.2 * amount;
              scale = 1 - 0.06 * amount;
            } else if (treatment === "plate") {
              x = side * 72 * amount;
              y = 100 * amount;
              rotate = side * 2.2 * amount;
              scale = 1 - 0.075 * amount;
            } else if (treatment === "portrait") {
              x = 86 * amount;
              y = 40 * amount;
              rotate = -4 * amount;
              scale = 1 - 0.12 * amount;
            } else if (treatment === "row") {
              x = (36 + index * 12) * amount;
              y = (28 + index * 9) * amount;
            }
          }
          const value = `${x.toFixed(2)}|${y.toFixed(2)}|${rotate.toFixed(3)}|${scale.toFixed(4)}`;
          if (layer.last === value) return;
          layer.last = value;
          layer.appliedY = y;
          node.dataset.homeMotionLayer = treatment;
          node.style.setProperty("--scene-x", `${x.toFixed(2)}px`);
          node.style.setProperty("--scene-y", `${y.toFixed(2)}px`);
          node.style.setProperty("--scene-turn", `${rotate.toFixed(3)}deg`);
          node.style.setProperty("--scene-scale", scale.toFixed(4));
        });
      });
      seamPositions.forEach(({ node, top }) => {
        node.style.setProperty("--scene-thread", ease((viewport - top) / (viewport * 0.72)).toFixed(4));
      });
    }

    function schedule() {
      if (!disposed && !frame && !document.hidden) frame = window.requestAnimationFrame(render);
    }
    const resize = new ResizeObserver(schedule);
    scenes.forEach(({ element }) => resize.observe(element));
    root.dataset.sceneChoreography = "ready";
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    document.addEventListener("focusin", schedule);
    document.addEventListener("focusout", schedule);
    document.addEventListener("visibilitychange", schedule);
    desktop.addEventListener("change", schedule);
    void document.fonts.ready.then(schedule);
    schedule();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("focusin", schedule);
      document.removeEventListener("focusout", schedule);
      document.removeEventListener("visibilitychange", schedule);
      desktop.removeEventListener("change", schedule);
      delete root.dataset.sceneChoreography;
      scenes.forEach(({ element, layers }) => {
        delete element.dataset.homeMotionScene;
        layers.forEach(({ node }) => {
          delete node.dataset.homeMotionLayer;
          ["--scene-x", "--scene-y", "--scene-turn", "--scene-scale"].forEach((property) => node.style.removeProperty(property));
        });
      });
      handoffs.forEach((node) => node.style.removeProperty("--scene-thread"));
    };
  }, [hydrated, prefersReducedMotion]);

  return null;
}
