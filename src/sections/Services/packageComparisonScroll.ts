type ComparisonOptions = {
  initialIndex: number;
  reducedMotion: boolean;
  onActive: (index: number) => void;
};

// Native scrolling owns the movement. This controller only keeps the chosen
// package stable until arrival and measures card geometry when it changes.
export function bindPackageComparisonScroll(
  track: HTMLDivElement,
  cards: HTMLElement[],
  options: ComparisonOptions,
) {
  let active = options.initialIndex;
  let requested: number | null = null;
  let reduced = options.reducedMotion;
  let centres: number[] = [];
  let width = 0;
  let maxLeft = 0;
  let geometry = "";
  let frame = 0;
  let timer = 0;
  let measurePending = false;
  let disposed = false;

  function select(index: number) {
    if (active === index) return;
    active = index;
    options.onActive(index);
  }

  function target(index: number) {
    return Math.max(0, Math.min(maxLeft, centres[index] - width / 2));
  }

  function nearest() {
    if (maxLeft <= 1) return active;
    const centre = track.scrollLeft + width / 2;
    return centres.reduce((closest, value, index) =>
      Math.abs(value - centre) < Math.abs(centres[closest] - centre) ? index : closest, 0);
  }

  function measure() {
    width = track.clientWidth;
    maxLeft = Math.max(0, track.scrollWidth - width);
    centres = cards.map(card => card.offsetLeft + card.clientWidth / 2);
    const next = `${width}:${maxLeft}:${centres.join(":")}`;
    const changed = next !== geometry;
    geometry = next;
    return changed;
  }

  function settle(force = false) {
    // An interrupted earlier animation may emit scrollend after a new choice.
    if (!force && requested !== null && Math.abs(track.scrollLeft - target(requested)) > 2) return;
    window.clearTimeout(timer);
    timer = 0;
    requested = null;
    select(nearest());
  }

  function awaitSettle() {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => settle(true), 180);
  }

  function goTo(index: number, immediate = false) {
    const next = Math.max(0, Math.min(cards.length - 1, index));
    requested = next;
    select(next);
    track.scrollTo({ left: target(next), behavior: immediate || reduced ? "instant" : "smooth" });
    if (immediate || reduced || Math.abs(track.scrollLeft - target(next)) <= 2) settle();
    else awaitSettle();
  }

  function paint() {
    frame = 0;
    if (measurePending) {
      measurePending = false;
      if (measure()) {
        goTo(requested ?? active, true);
        return;
      }
    }
    if (requested === null) select(nearest());
    awaitSettle();
  }

  function schedule() {
    if (!disposed && !frame) frame = window.requestAnimationFrame(paint);
  }

  function interrupt() {
    if (requested !== null) {
      requested = null;
      track.scrollTo({ left: track.scrollLeft, behavior: "instant" });
    }
    window.clearTimeout(timer);
    timer = 0;
    select(nearest());
  }

  function onKey(event: KeyboardEvent) {
    if (event.target !== track || maxLeft <= 1) return;
    const next = event.key === "ArrowRight" ? active + 1
      : event.key === "ArrowLeft" ? active - 1
        : event.key === "Home" ? 0
          : event.key === "End" ? cards.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    goTo(next);
  }

  function onFocus(event: FocusEvent) {
    const index = cards.findIndex(card => card.contains(event.target as Node));
    if (index >= 0) goTo(index, true);
  }

  const onScrollEnd = () => settle();
  const observer = new ResizeObserver(() => {
    measurePending = true;
    schedule();
  });
  measure();
  options.onActive(active);
  goTo(active, true);
  [track, ...cards].forEach(node => observer.observe(node));
  track.addEventListener("scroll", schedule, { passive: true });
  track.addEventListener("scrollend", onScrollEnd);
  track.addEventListener("pointerdown", interrupt, { passive: true });
  track.addEventListener("wheel", interrupt, { passive: true });
  track.addEventListener("keydown", onKey);
  track.addEventListener("focusin", onFocus);

  return {
    goTo,
    setReducedMotion(value: boolean) {
      reduced = value;
      if (reduced && requested !== null) goTo(requested, true);
    },
    dispose() {
      disposed = true;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      observer.disconnect();
      track.removeEventListener("scroll", schedule);
      track.removeEventListener("scrollend", onScrollEnd);
      track.removeEventListener("pointerdown", interrupt);
      track.removeEventListener("wheel", interrupt);
      track.removeEventListener("keydown", onKey);
      track.removeEventListener("focusin", onFocus);
    },
  };
}
