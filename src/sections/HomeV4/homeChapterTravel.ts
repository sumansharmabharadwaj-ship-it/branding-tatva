const ARRIVAL_TOLERANCE_PX = 2;
const SETTLED_MS = 80;
const TRAVEL_LIMIT_MS = 3000;

/** Observe a single native scroll, including browsers without scrollend.
 * This never drives intermediate positions or retries a failed arrival. */
export function travelToHomeChapter(
  target: HTMLElement,
  animate: boolean,
  onArrival: (arrived: boolean) => void,
) {
  let active = true;
  let frame = 0;
  const started = performance.now();
  let settledSince = started;
  let previousY = window.scrollY;

  function stop() {
    if (!active) return;
    active = false;
    window.cancelAnimationFrame(frame);
    window.scrollTo({ top: window.scrollY, left: window.scrollX, behavior: "instant" });
  }

  function checkArrival(now: number) {
    frame = 0;
    if (!active) return;
    if (document.hidden || !target.isConnected || document.querySelector("dialog[open]") || document.documentElement.dataset.siteMenu === "open") {
      stop();
      onArrival(false);
      return;
    }

    const currentY = window.scrollY;
    if (Math.abs(currentY - previousY) > .25) settledSince = now;
    previousY = currentY;
    // Read the current layout: a chapter can change height while its media,
    // responsive frame, or fonts settle. Match native scroll alignment.
    const margin = parseFloat(window.getComputedStyle(target).scrollMarginTop) || 0;
    const padding = parseFloat(window.getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const maximum = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const destination = Math.max(0, Math.min(maximum, currentY + target.getBoundingClientRect().top - margin - padding));
    if (Math.abs(destination - currentY) <= ARRIVAL_TOLERANCE_PX && now - settledSince >= SETTLED_MS) {
      active = false;
      onArrival(true);
    } else if (now - started >= TRAVEL_LIMIT_MS) {
      stop();
      onArrival(false);
    } else {
      frame = window.requestAnimationFrame(checkArrival);
    }
  }

  target.scrollIntoView({ behavior: animate ? "smooth" : "instant", block: "start" });
  frame = window.requestAnimationFrame(checkArrival);
  return stop;
}
