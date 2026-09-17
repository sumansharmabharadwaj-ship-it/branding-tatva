"use client";

import { useEffect } from "react";
import { useHydratedMotionPreference } from "@/hooks/useHydratedReducedMotion";

const DESKTOP = "(min-width: 1181px) and (min-height: 761px) and (pointer: fine)";
type Treatment = "title" | "heading" | "fan" | "plate" | "portrait" | "rail";
type LayerSpec = readonly [selector: string, treatment: Treatment];
type SceneSpec = { selector: string; ink?: "clay" | "sand"; reading?: string; layers: readonly LayerSpec[] };

// Stable semantic hooks keep CSS-module names and the scenes' tab state private.
// Each plate settles before its reading interval. Existing sticky stories retain
// sole ownership of their content, media and stage selection.
const SCENES: readonly SceneSpec[] = [
  { selector: '[data-home-v4-chapter="opening"]', ink: "sand", reading: ".home-v4-opening__lede", layers: [
    [".home-v4-opening__proof", "plate"],
  ] },
  { selector: '[data-home-v4-chapter="recognition"]', ink: "clay", layers: [
    [".home-v4-recognition__header > div", "heading"], ['[role="tab"]', "fan"], ['[role="tabpanel"]', "plate"],
  ] },
  { selector: '[data-home-v4-chapter="cost"]', ink: "clay", reading: "[data-home-cost-heading] h2 + p", layers: [
    ["[data-home-cost-heading]", "heading"], ['[data-home-cost-comparison]', "plate"], ['[data-home-cost-item]', "fan"],
  ] },
  { selector: '[data-home-v4-chapter="cost-stack"]', ink: "sand", reading: "[data-cost-intro] > p:last-child", layers: [
    ["[data-cost-intro]", "heading"],
  ] },
  { selector: '[data-scroll-story="foundation"]', ink: "clay", reading: "header h2 + p", layers: [
    ["header", "heading"], ['[role="tablist"]', "rail"], ['[role="tabpanel"]', "plate"],
  ] },
  { selector: '[data-scroll-story="paths"]', ink: "clay", reading: "header > p", layers: [
    // Path controls stay in place; the chapter owns its reading transitions.
    ["header", "heading"],
  ] },
  { selector: '[data-scroll-story="process"]', ink: "clay", reading: "header > p", layers: [
    // The method owns its camera and decision changes. Keep stage controls
    // and the reading panel anchored during the chapter entrance.
    ["header", "heading"],
  ] },
  { selector: '[data-home-v4-chapter="evidence"]', ink: "sand", reading: ".evidence-cinematic__intro > p", layers: [
    // The archive owns its photo reveal and measured reading transitions.
    [".evidence-cinematic__header", "heading"],
  ] },
  { selector: '.tatva-observatory', ink: "sand", reading: ".tatva-observatory__copy > h2 + p", layers: [
    [".tatva-observatory__copy", "heading"], [".tatva-observatory__force", "fan"],
  ] },
  { selector: '.tatva-pressure-lab', ink: "sand", reading: ".tatva-pressure-lab__copy > h2 + p", layers: [
    [".tatva-pressure-lab__copy", "heading"], [".tatva-pressure-lab__board", "plate"],
  ] },
  { selector: '.studio-cinematic', ink: "sand", reading: ".studio-cinematic__lede", layers: [
    // One reading column preserves the title/intro and proof/footer gaps.
    // Its own discipline transition stays inside this shared entrance.
    [".studio-cinematic__content", "heading"], [".studio-cinematic__portrait", "portrait"],
  ] },
  { selector: '[data-home-v4-chapter="decision"]', ink: "clay", reading: "header h2 + p", layers: [
    // Disclosure headings keep their hit areas still. Their own scroll ink,
    // rules and answer transitions carry the interaction below this entrance.
    ["header", "heading"],
  ] },
  { selector: '[data-home-v4-chapter="invitation"]', ink: "clay", reading: "[data-invitation-reading] > h2 + p", layers: [
    // The booking and proof links stay in a stationary sibling. The agenda
    // owns its reading light and keeps all three rows in their natural place.
    ["[data-invitation-reading]", "heading"],
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
      // Paint the original semantic text. No split words, duplicate accessible
      // names or formatting changes: wrapping and selection stay browser owned.
      const ink = spec.ink ? Array.from(element.querySelectorAll<HTMLElement>("h2")).map((heading) => ({
        anchor: heading,
        node: heading.querySelector<HTMLElement>("em") ?? heading,
        layer: layers.find(({ node }) => node === heading || node.contains(heading)),
        tone: spec.ink!, reading: false, progress: 0, last: "",
      })) : [];
      if (spec.ink && spec.reading) {
        element.querySelectorAll<HTMLElement>(spec.reading).forEach((node) => {
          ink.push({ anchor: node, node, layer: layers.find((layer) => layer.node.contains(node)),
            tone: spec.ink!, reading: true, progress: 0, last: "" });
        });
      }
      return [{ element, layers, ink, active: true }];
    });
    const footerTitle = document.querySelector<HTMLElement>("footer h2");
    // The footer title is a separate reading beat, scoped to the mounted home.
    if (footerTitle) scenes.push({ element: footerTitle.parentElement!, active: true, ink: [], layers: [{
      node: footerTitle, treatment: "title", index: 0, spread: 0, side: 1, appliedX: 0, appliedY: 0, appliedTurn: 0, appliedScale: 1, last: "",
    }] });

    function render(now: number) {
      frame = 0;
      if (document.hidden || disposed) return;
      const viewport = Math.max(1, window.innerHeight);
      const wide = desktop.matches;
      const focused = document.activeElement;
      const selection = document.getSelection();
      const readingRange = selection && !selection.isCollapsed && selection.rangeCount
        ? selection.getRangeAt(0) : null;
      const damping = lastTime ? 1 - Math.exp(-Math.min(now - lastTime, 64) / 65) : 1;
      lastTime = now;
      let settling = false;
      // Finish all reads before writes, including compact per-element geometry.
      const measurements = scenes.filter((scene) => scene.active || scene.element.contains(focused)).map((scene) => ({
        scene, top: scene.element.getBoundingClientRect().top,
        selected: Boolean(readingRange?.intersectsNode(scene.element)),
        readingFocused: focused instanceof HTMLElement && focused !== scene.element
          && focused.matches(":focus-visible") && scene.element.contains(focused),
        ink: scene.ink.map((text) => {
          const rect = text.anchor.getBoundingClientRect();
          // Subtract our reading group's entrance so paint never feeds back
          // into its own progress. Sticky headings retain their local position.
          return { text, top: rect.top - (text.layer?.appliedY ?? 0), height: rect.height,
            visible: rect.bottom > 0 && rect.top < viewport };
        }),
        layers: scene.layers.map((layer) => ({
          layer,
          top: wide ? 0 : layer.node.getBoundingClientRect().top - layer.appliedY,
          focused: layer.node === focused || layer.node.contains(focused),
        })),
      }));

      measurements.forEach(({ top, layers, ink, selected, readingFocused }) => {
        // Native selection owns its reading surface until the selection clears.
        // Keep its geometry and paint still without intercepting native scroll.
        if (selected) return;
        const entering = 1 - ease((viewport * 0.96 - top) / (viewport * 0.74));
        layers.forEach(({ layer, top: layerTop, focused: hasFocus }) => {
          const { node, treatment, index, spread, side } = layer;
          const amount = hasFocus ? 0 : wide
            ? clamp(entering * (1 + (treatment === "fan" ? index * 0.09 : 0)))
            : 1 - ease((viewport * 0.96 - layerTop) / (viewport * 0.3));
          let x = 0;
          let y = amount * (wide ? 106 : 32);
          let rotate = 0;
          let scale = 1;
          if (wide) {
            if (treatment === "heading") {
              // Eyebrow, title and introduction arrive as one reading group.
              // Match the rail's vertical travel so the heading cannot cross
              // its controls while the chapter is entering the viewport.
              x = side * -44 * amount;
              y = 40 * amount;
            } else if (treatment === "title") {
              x = side * -44 * amount;
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
            }
          }
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
          if (node.hasAttribute("data-home-cost-comparison")) {
            // Follow the card's actual eased position, including reverse scroll
            // and focus settling. The row accents use no second scroll loop.
            node.style.setProperty("--comparison-arrival", clamp(1 - y / (wide ? 150 : 32)).toFixed(4));
          }
        });
        ink.forEach(({ text, top: textTop, height, visible }) => {
          if (!visible || readingFocused) return;
          // The sweep completes in the reading zone and reverses with native
          // scroll. Pausing scroll also pauses the ink after a short settle.
          const target = text.reading
            ? ease((viewport * 0.88 - textTop) / Math.max(viewport * 0.56, height + viewport * 0.12))
            : ease((viewport * 0.94 - textTop) / Math.max(viewport * 0.62, height + viewport * 0.16));
          const next = text.last ? text.progress + (target - text.progress) * damping : target;
          text.progress = Math.abs(target - next) < 0.001 ? target : next;
          if (text.progress !== target) settling = true;
          const value = text.progress.toFixed(3);
          if (text.last === value) return;
          text.last = value;
          if (text.reading) {
            text.node.dataset.scrollReading = text.tone;
            text.node.style.setProperty("--reading-progress", value);
          } else {
            text.node.dataset.scrollInk = text.tone;
            text.node.style.setProperty("--ink-progress", value);
          }
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
    document.addEventListener("selectionchange", schedule);
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
      document.removeEventListener("selectionchange", schedule);
      document.removeEventListener("visibilitychange", schedule);
      desktop.removeEventListener("change", schedule);
      delete root.dataset.sceneChoreography;
      scenes.forEach(({ element, layers, ink }) => {
        delete element.dataset.homeMotionScene;
        ink.forEach(({ node }) => {
          delete node.dataset.scrollInk;
          delete node.dataset.scrollReading;
          node.style.removeProperty("--ink-progress");
          node.style.removeProperty("--reading-progress");
        });
        layers.forEach(({ node }) => {
          delete node.dataset.homeMotionLayer;
          ["--scene-x", "--scene-y", "--scene-turn", "--scene-scale", "--comparison-arrival"].forEach((property) => node.style.removeProperty(property));
        });
      });
    };
  }, [hydrated, prefersReducedMotion]);

  return null;
}
