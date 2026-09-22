function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function opacityValue(value: string | undefined, fallback: number) {
  const parsed = value === undefined ? NaN : Number(value);
  return Number.isFinite(parsed) ? clamp(parsed) : fallback;
}

/** Decorative fades share the page's read/write pass and visibility lifecycle. */
export function createServicesSceneDissolves(scenes: HTMLElement[]) {
  const layers = scenes.flatMap((scene, sceneIndex) =>
    Array.from(scene.querySelectorAll<HTMLElement>("[data-services-dissolve]")).map((element) => {
      const arrival = element.dataset.servicesDissolve === "arrival";
      return {
        element,
        sceneIndex,
        arrival,
        end: opacityValue(element.dataset.servicesDissolveEnd, arrival ? 0.15 : 0.46),
        rest: opacityValue(element.dataset.servicesDissolveRest, arrival ? 1 : 0.28),
        initialOpacity: element.style.opacity,
        paintedOpacity: element.style.opacity,
      };
    }),
  );

  function measure(viewportHeight: number, sceneBounds: DOMRect[], reducedMotion: boolean) {
    const viewport = Math.max(1, viewportHeight);
    return layers.flatMap((layer) => {
      if (!layer.element.isConnected) return [];
      // Reduced motion and constant gradients need no layout measurements,
      // even when the visitor changes their preference halfway down the page.
      if (reducedMotion) return [{ layer, opacity: String(layer.rest) }];
      if (layer.arrival && layer.end === 1) return [{ layer, opacity: "1" }];
      if (!layer.arrival && layer.end === 0) return [{ layer, opacity: "0" }];

      const scene = sceneBounds[layer.sceneIndex];
      if (!scene || scene.bottom < -viewport * 0.15 || scene.top > viewport * 1.15) return [];

      const bounds = layer.element.getBoundingClientRect();
      // Keep the original arrival (95% -> 20%) and departure (98% -> 50%)
      // timing, including the departure layer's height in its travel range.
      const progress = layer.arrival
        ? clamp((viewport * 0.95 - bounds.top) / (viewport * 0.75))
        : clamp((viewport * 0.98 - bounds.top) / (viewport * 0.48 + bounds.height));
      const opacity = layer.arrival ? 1 + (layer.end - 1) * progress : layer.end * progress;
      return [{ layer, opacity: opacity.toFixed(4) }];
    });
  }

  function paint(measurements: ReturnType<typeof measure>) {
    for (const { layer, opacity } of measurements) {
      if (layer.paintedOpacity === opacity) continue;
      layer.element.style.opacity = opacity;
      layer.paintedOpacity = opacity;
    }
  }

  function dispose() {
    for (const layer of layers) layer.element.style.opacity = layer.initialOpacity;
  }

  return { measure, paint, dispose };
}
