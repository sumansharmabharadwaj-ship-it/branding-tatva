import type Lenis from "lenis";

type Check = () => void;

// Collapses every still-active useRevealTrigger/useLazyMount instance's
// Lenis "scroll" subscription into ONE subscription per Lenis instance,
// instead of each of the site's 69+ Reveal/ImageBreak/ClipReveal/
// PerspectiveReveal/ElementReveal/VideoBreak/lazy-media instances
// independently calling lenis.on("scroll", ...). See useRevealTrigger's
// and useLazyMount's own comments for why each needs a per-tick position
// check in the first place — this only changes how many separate Lenis
// listeners that turns into, not what any individual check does.
//
// Grouping every check into one function call also means all of their
// getBoundingClientRect() reads run back-to-back in one place, instead
// of being interleaved (by component mount order) with the synchronous
// style writes PinnedJourney/PinnedSlider/MeadowClosing each perform in
// their own separate "scroll" listeners — fewer forced layout
// recalculations stacking up per scroll tick as a result.
const registryByInstance = new WeakMap<Lenis, Set<Check>>();

export function registerScrollCheck(lenis: Lenis, check: Check): () => void {
  let checks = registryByInstance.get(lenis);
  if (!checks) {
    checks = new Set<Check>();
    registryByInstance.set(lenis, checks);
    lenis.on("scroll", () => {
      checks!.forEach((fn) => fn());
    });
    // No unsubscribe kept/called here on purpose: SmoothScrollProvider
    // owns the Lenis instance's whole lifecycle and destroy()s it wholly
    // on unmount; the WeakMap lets this entry (and Lenis's own listener
    // array) be reclaimed once nothing references that instance anymore,
    // rather than this module tracking a second, redundant teardown path.
  }
  checks.add(check);
  return () => checks!.delete(check);
}
