export function isVideoVisuallyEligible(video: HTMLVideoElement) {
  if (document.hidden || !video.muted || !video.loop) return false;

  const rect = video.getBoundingClientRect();
  if (
    rect.width < 2 ||
    rect.height < 2 ||
    rect.bottom <= 0 ||
    rect.top >= window.innerHeight
  ) {
    return false;
  }

  const decorativeRoot = video.closest<HTMLElement>(
    "[data-video-decorative-root]",
  );
  const ambientRoot = video.closest<HTMLElement>(
    "[data-home-ambient-film], [data-home-film-constellation]",
  );

  let node: HTMLElement | null = video;
  while (node && node !== document.body) {
    if (node.getAttribute("aria-hidden") === "true") {
      const visuallyDecorative =
        node === video || node === decorativeRoot || node === ambientRoot;
      if (!visuallyDecorative) return false;
    }

    const style = window.getComputedStyle(node);
    if (
      style.display === "none" ||
      style.visibility === "hidden" ||
      Number.parseFloat(style.opacity || "1") <= 0.025
    ) {
      return false;
    }

    node = node.parentElement;
  }

  return true;
}
