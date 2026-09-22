// Services uses native document scrolling. This short recovery window repairs
// layout shifts after a chapter link and gives up as soon as the visitor acts.
export function bindServicesAnchorRecovery(onRelease: () => void) {
  let target: HTMLElement | null = null;
  let timer = 0;
  let attempts = 0;
  let disposed = false;

  function clearTimer() {
    window.clearTimeout(timer);
    timer = 0;
  }

  function cancel() {
    clearTimer();
    if (!target) return;
    target = null;
    onRelease();
  }

  function align() {
    timer = 0;
    if (disposed || !target) return;
    if (document.hidden || !target.isConnected) {
      cancel();
      return;
    }

    const scrollRoot = document.scrollingElement ?? document.documentElement;
    const margin = Number.parseFloat(window.getComputedStyle(target).scrollMarginTop) || 0;
    const padding = Number.parseFloat(window.getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const maxScroll = Math.max(0, scrollRoot.scrollHeight - window.innerHeight);
    const destination = Math.min(maxScroll, Math.max(0,
      window.scrollY + target.getBoundingClientRect().top - margin - padding,
    ));

    if (Math.abs(window.scrollY - destination) > 1) {
      // Recovery is a position correction, never another smooth animation.
      window.scrollTo({ top: destination, behavior: "instant" });
    }

    attempts += 1;
    if (attempts < 6) timer = window.setTimeout(align, 280);
    else cancel();
  }

  function onKey(event: KeyboardEvent) {
    if (["Tab", "Enter", "Escape", "PageDown", "PageUp", "Home", "End", " ", "ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(event.key)) {
      cancel();
    }
  }

  function onVisibility() {
    if (document.hidden) cancel();
  }

  // Capture phase also catches scrollbar grabs and input inside components
  // that stop propagation. These listeners never prevent native input.
  const inputOptions = { capture: true, passive: true };
  window.addEventListener("wheel", cancel, inputOptions);
  window.addEventListener("pointerdown", cancel, inputOptions);
  window.addEventListener("touchstart", cancel, inputOptions);
  window.addEventListener("touchmove", cancel, inputOptions);
  window.addEventListener("keydown", onKey, true);
  document.addEventListener("visibilitychange", onVisibility);

  return {
    cancel,
    start(next: HTMLElement) {
      if (disposed) return;
      clearTimer();
      target = next;
      attempts = 0;
      timer = window.setTimeout(align, 0);
    },
    dispose() {
      disposed = true;
      clearTimer();
      target = null;
      window.removeEventListener("wheel", cancel, true);
      window.removeEventListener("pointerdown", cancel, true);
      window.removeEventListener("touchstart", cancel, true);
      window.removeEventListener("touchmove", cancel, true);
      window.removeEventListener("keydown", onKey, true);
      document.removeEventListener("visibilitychange", onVisibility);
    },
  };
}
