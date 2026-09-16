const TAB_STOP_SELECTOR = "a[href], button, input, select, textarea, [tabindex]";

export function isAvailableHomeTabStop(element: HTMLElement) {
  return element.tabIndex >= 0 &&
    !element.matches(":disabled") &&
    !element.closest('[inert], [aria-hidden="true"]') &&
    element.getClientRects().length > 0 &&
    window.getComputedStyle(element).visibility === "visible";
}

/** Leave fixed controls at the current reading position, in either direction. */
export function focusHomeReading(backward = false) {
  const viewport = window.innerHeight;
  const readingLine = viewport * 0.42;
  const regions = Array.from(document.querySelectorAll<HTMLElement>(
    "[data-home-v4-chapter], footer",
  )).map((element) => ({ element, rect: element.getBoundingClientRect() }))
    .filter(({ rect }) => rect.bottom > 0 && rect.top < viewport && rect.height > 0);
  const region = regions.find(({ rect }) => rect.top <= readingLine && rect.bottom > readingLine)
    ?? regions.sort((a, b) =>
      (Math.min(viewport, b.rect.bottom) - Math.max(0, b.rect.top)) -
      (Math.min(viewport, a.rect.bottom) - Math.max(0, a.rect.top)),
    )[0];
  if (!region) return false;
  // At the opening, reverse Tab retains the ordinary path to the site header.
  if (backward && region.element.dataset.homeV4Chapter === "opening") return false;

  const candidates = Array.from(region.element.querySelectorAll<HTMLElement>(TAB_STOP_SELECTOR))
    .filter(isAvailableHomeTabStop);
  if (backward) candidates.reverse();
  // Fixed page controls occupy the bottom edge. Prefer a target already clear
  // of that edge; native scroll margins handle a target that needs more room.
  const readingBottom = viewport - 80;
  const visible = candidates.find((element) => {
    const rect = element.getBoundingClientRect();
    return rect.top >= 80 && rect.bottom <= readingBottom;
  });
  const nearest = visible ?? candidates.map((element) => {
    const rect = element.getBoundingClientRect();
    return { element, distance: Math.max(80 - rect.top, rect.bottom - readingBottom, 0) };
  }).sort((a, b) => a.distance - b.distance)[0]?.element;
  const destination = nearest ?? region.element.querySelector<HTMLElement>("h1, h2");
  if (!destination) return false;

  // A reading-only chapter still needs a semantic landing place. This is a
  // temporary programmatic stop, removed on blur, never an extra Tab stop.
  const temporaryStop = !nearest && !destination.hasAttribute("tabindex");
  if (temporaryStop) destination.setAttribute("tabindex", "-1");
  destination.focus({ preventScroll: true });
  if (document.activeElement !== destination) {
    if (temporaryStop) destination.removeAttribute("tabindex");
    return false;
  }
  if (temporaryStop) destination.addEventListener("blur", () => destination.removeAttribute("tabindex"), { once: true });
  const rect = destination.getBoundingClientRect();
  if (rect.top < 80 || rect.bottom > readingBottom) {
    destination.scrollIntoView({ block: "nearest", behavior: "instant" });
  }
  return true;
}
