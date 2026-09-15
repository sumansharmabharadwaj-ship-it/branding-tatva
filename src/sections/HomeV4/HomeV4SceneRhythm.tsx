"use client";

import { useEffect } from "react";
import { useHydratedMotionPreference } from "@/hooks/useHydratedReducedMotion";

const DESKTOP = "(min-width: 1181px) and (min-height: 761px) and (pointer: fine)";
type Treatment = "accent" | "title" | "fan" | "plate" | "portrait" | "row" | "rail";
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
    ["h2", "title"], ["h2 em", "accent"], ['[role="tab"]', "fan"], ['[role="tabpanel"]', "plate"],
  ] },
  { selector: '[data-home-v4-chapter="cost"]', layers: [
    ["h2", "title"], ["h2 em", "accent"], ['[data-home-cost-comparison]', "plate"], ['[data-home-cost-item]', "fan"],
  ] },
  { selector: '[data-home-v4-chapter="cost-stack"]', layers: [
    ["h2", "title"], ["h2 em", "accent"],
  ] },
  { selector: '[data-scroll-story="foundation"]', layers: [
    ["h2", "title"], ["h2 em", "accent"], ['[role="tablist"]', "rail"], ['[role="tabpanel"]', "plate"],
  ] },
  { selector: '[data-scroll-story="paths"]', layers: [
    ["h2", "title"], ["h2 em", "accent"], ['[role="tablist"]', "rail"], ['[role="tabpanel"]', "plate"],
  ] },
  { selector: '[data-scroll-story="process"]', layers: [
    ["h2", "title"], ["h2 em", "accent"], ['[role="tablist"]', "rail"], ['[role="tabpanel"]', "plate"],
  ] },
  { selector: '[data-home-v4-chapter="evidence"]', layers: [
    ["h2", "title"], ["h2 em", "accent"], ['[role="tab"]', "fan"], ['[role="tabpanel"]', "plate"],
  ] },
  { selector: '.tatva-observatory', layers: [
    ["h2", "title"], ["h2 em", "accent"], [".tatva-observatory__force", "fan"],
  ] },
  { selector: '.tatva-pressure-lab', layers: [
    ["h2", "title"], ["h2 em", "accent"], [".tatva-pressure-lab__board", "plate"],
  ] },
  { selector: '.studio-cinematic', layers: [
    ["h2", "title"], ["h2 em", "accent"], ['[role="tabpanel"]', "plate"], [".studio-cinematic__portrait", "portrait"],
  ] },
  { selector: '[data-home-v4-chapter="decision"]', layers: [
    ["h2", "title"], ["h2 em", "accent"], ["[data-open]", "row"],
  ] },
  { selector: '[data-home-v4-chapter="invitation"]', layers: [
    ["h2", "title"], ["h2 em", "accent"], ["aside", "plate"],
  ] },
  { selector: '[data-home-v4-chapter="diagnostic"]', layers: [
    ["h3", "title"],
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
    let lastTime = 0;
    let disposed = false;
    const scenes = SCENES.flatMap((spec, sceneIndex) => {
      const element = root.querySelector<HTMLElement>(spec.selector);
      if (!element) return [];
      const layers = spec.layers.flatMap(([selector, treatment]) => {
        const matches = Array.from(element.querySelectorAll<HTMLElement>(selector));
        return matches.map((node, index) => ({
          node, treatment, index, spread: index - (matches.length - 1) / 2,
          side: sceneIndex % 2 ? 1 : -1, appliedX: 0, appliedY: 0, appliedTurn: 0, appliedScale: 1, last: "",
        }));
      });
      return [{ element, layers, active: true }];
    });
    const footerTitle = document.querySelector<HTMLElement>("footer h2");
    // The footer title is a separate reading beat, scoped to the mounted home.
    if (footerTitle) scenes.push({ element: footerTitle.parentElement!, active: true, layers: [{
      node: footerTitle, treatment: "title", index: 0, spread: 0, side: 1, appliedX: 0, appliedY: 0, appliedTurn: 0, appliedScale: 1, last: "",
    }] });

    function render(now: number) {
      frame = 0;
      if (document.hidden || disposed) return;
      const viewport = Math.max(1, window.innerHeight);
      const wide = desktop.matches;
      const focused = document.activeElement;
      const damping = lastTime ? 1 - Math.exp(-Math.min(now - lastTime, 64) / 65) : 1;
      lastTime = now;
      let settling = false;
      // Finish all reads before writes, including compact per-element geometry.
      const measurements = scenes.filter((scene) => scene.active || scene.element.contains(focused)).map((scene) => ({
        scene, top: scene.element.getBoundingClientRect().top,
        layers: scene.layers.map((layer) => ({
          layer,
          top: wide ? 0 : layer.node.getBoundingClientRect().top - layer.appliedY,
          focused: layer.node === focused || layer.node.contains(focused),
        })),
      }));

      measurements.forEach(({ scene, top, layers }) => {
        const entering = 1 - ease((viewport * 0.96 - top) / (viewport * 0.74));
        layers.forEach(({ layer, top: layerTop, focused: hasFocus }) => {
          const { node, treatment, index, spread, side } = layer;
          const amount = hasFocus ? 0 : wide
            ? clamp(entering * (1 + (treatment === "fan" || treatment === "row" ? index * 0.09 : 0)))
            : 1 - ease((viewport * 0.96 - layerTop) / (viewport * 0.3));
          let x = 0;
          let y = amount * (wide ? 106 : 32);
          let rotate = 0;
          let scale = 1;
          if (wide) {
            if (treatment === "title") {
              x = side * -44 * amount;
            } else if (treatment === "accent") {
              x = side * 112 * amount;
              y = 12 * amount;
            } else if (treatment === "rail") {
              x = side * -64 * amount;
              y = 40 * amount;
            } else if (treatment === "fan") {
              x = spread * 76 * amount;
              y = (120 + Math.abs(spread) * 30) * amount;
              rotate = spread * 6.5 * amount;
              scale = 1 - 0.09 * amount;
            } else if (treatment === "plate") {
              x = side * 132 * amount;
              y = 150 * amount;
              rotate = side * 4.5 * amount;
              scale = 1 - 0.11 * amount;
            } else if (treatment === "portrait") {
              x = 128 * amount;
              y = 40 * amount;
              rotate = -7 * amount;
              scale = 1 - 0.17 * amount;
            } else if (treatment === "row") {
              x = (36 + index * 12) * amount;
              y = (28 + index * 9) * amount;
            }
          }
          // Inline accents compose with their heading only on wide screens.
          if (!wide && treatment === "accent") y = 0;
          // Ease the visual response, never the document's scroll position.
          // First paint and focused controls settle immediately. Following
          // frames converge quickly and stop scheduling when at rest.
          const blend = hasFocus || !layer.last ? 1 : damping;
          function settle(current: number, target: number, threshold: number) {
            const next = current + (target - current) * blend;
            if (Math.abs(target - next) <= threshold) return target;
            settling = true;
            return next;
          }
          x = settle(layer.appliedX, x, 0.08);
          y = settle(layer.appliedY, y, 0.08);
          rotate = settle(layer.appliedTurn, rotate, 0.008);
          scale = settle(layer.appliedScale, scale, 0.0002);
          const value = `${x.toFixed(2)}|${y.toFixed(2)}|${rotate.toFixed(3)}|${scale.toFixed(4)}`;
          if (layer.last === value) return;
          layer.last = value;
          layer.appliedX = x;
          layer.appliedY = y;
          layer.appliedTurn = rotate;
          layer.appliedScale = scale;
          node.dataset.homeMotionLayer = treatment;
          node.style.setProperty("--scene-x", `${x.toFixed(2)}px`);
          node.style.setProperty("--scene-y", `${y.toFixed(2)}px`);
          node.style.setProperty("--scene-turn", `${rotate.toFixed(3)}deg`);
          node.style.setProperty("--scene-scale", scale.toFixed(4));
        });
      });
      if (settling) schedule();
    }

    function schedule() {
      if (!disposed && !frame && !document.hidden) frame = window.requestAnimationFrame(render);
    }
    const sceneByElement = new Map(scenes.map((scene) => [scene.element, scene]));
    const visibility = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const scene = sceneByElement.get(entry.target as HTMLElement);
        if (scene) scene.active = entry.isIntersecting;
      });
      schedule();
    }, { rootMargin: "35% 0px" });
    scenes.forEach(({ element }) => {
      element.dataset.homeMotionScene = "ready";
      visibility.observe(element);
    });
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
      visibility.disconnect();
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
    };
  }, [hydrated, prefersReducedMotion]);

  return null;
}
