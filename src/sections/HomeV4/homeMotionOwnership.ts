/** Atmospheric motion yields while the visitor owns a reading surface. */
export function homeReadingOwnsMotion(root: HTMLElement) {
  if (document.querySelector("dialog[open]")) return true;

  const focused = document.activeElement;
  if (focused instanceof HTMLElement && root.contains(focused) && focused.matches(":focus-visible")) return true;

  const selection = window.getSelection();
  return Boolean(
    selection && !selection.isCollapsed && selection.rangeCount &&
    selection.getRangeAt(0).intersectsNode(root),
  );
}

/** Pointer defaults can change focus visibility without moving focus. Callers
 * recheck ownership on their next frame as well as immediately on this signal. */
export function watchHomeMotionOwnership(onChange: () => void) {
  const events = ["focusin", "focusout", "selectionchange", "visibilitychange", "pointerdown"];
  events.forEach((event) => document.addEventListener(event, onChange));
  document.addEventListener("close", onChange, true);
  const dialogs = new MutationObserver(onChange);
  dialogs.observe(document.body, { attributes: true, attributeFilter: ["open"], subtree: true });

  return () => {
    events.forEach((event) => document.removeEventListener(event, onChange));
    document.removeEventListener("close", onChange, true);
    dialogs.disconnect();
  };
}
