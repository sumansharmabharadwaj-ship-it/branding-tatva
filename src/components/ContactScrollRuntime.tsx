"use client";

import { useEffect } from "react";

const CAMERA_QUERY = "(min-width: 941px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const SCROLL_KEYS = new Set([
  "ArrowDown",
  "ArrowUp",
  "PageDown",
  "PageUp",
  "Home",
  "End",
  " ",
]);

/**
 * Enables a forgiving native snap only while the post-hero Contact film is in
 * view. It releases before the footer or a reading interaction, never pins
 * content, and owns hash recovery now that Lenis stands down on this route.
 */
export function ContactScrollRuntime() {
  useEffect(() => {
    const root = document.documentElement;
    const film = document.querySelector<HTMLElement>("[data-contact-film]");
    const scenes = Array.from(document.querySelectorAll<HTMLElement>("[data-contact-scene]"));
    if (!film || scenes.length === 0) return;
    const contactFilm = film;

    const cameraReady = window.matchMedia(CAMERA_QUERY);
    let frame = 0;
    let disposed = false;
    let hashAttempts = 0;
    let hashCancelled = false;
    let hashFrame = 0;
    let hashTimer = 0;

    const syncFormOwnership = () => {
      const formCard = contactFilm.querySelector<HTMLElement>("[data-contact-form-card]");
      if (!formCard) {
        delete root.dataset.contactFormOwnsViewport;
        return;
      }

      const viewportHeight = Math.max(1, window.visualViewport?.height ?? window.innerHeight);
      const rect = formCard.getBoundingClientRect();
      const visibleHeight = Math.max(
        0,
        Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0),
      );
      const minimumReadingArea = Math.min(180, viewportHeight * 0.24);
      const ownsViewport =
        rect.top <= viewportHeight * 0.82 && visibleHeight >= minimumReadingArea;

      if (ownsViewport) root.dataset.contactFormOwnsViewport = "true";
      else delete root.dataset.contactFormOwnsViewport;
    };

    const render = () => {
      frame = 0;
      syncFormOwnership();
      const motionAllowed = cameraReady.matches && root.dataset.motion !== "reduced";
      const interactionOwnsScroll = scenes.some(
        (scene) =>
          scene.dataset.contactReadingFocus === "true" ||
          Boolean(scene.querySelector('[data-contact-form-expanded="true"]')),
      );
      if (!motionAllowed || interactionOwnsScroll) {
        delete root.dataset.contactFilmSnap;
        return;
      }

      const viewportHeight = Math.max(window.innerHeight, 1);
      const firstSceneTop = scenes[0].offsetTop;
      const lastScene = scenes[scenes.length - 1];
      const releasePoint = lastScene.offsetTop + lastScene.offsetHeight - viewportHeight * 0.5;
      const insideFilm = window.scrollY >= firstSceneTop - 2 && window.scrollY < releasePoint;

      if (insideFilm && root.dataset.contactFilmSnap !== "true") {
        root.dataset.contactFilmSnap = "true";
      } else if (!insideFilm && root.dataset.contactFilmSnap) {
        delete root.dataset.contactFilmSnap;
      }
    };

    const requestRender = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(render);
    };

    function cancelHashRecovery() {
      hashCancelled = true;
      window.cancelAnimationFrame(hashFrame);
      window.clearTimeout(hashTimer);
    }

    function onManualKey(event: KeyboardEvent) {
      if (SCROLL_KEYS.has(event.key)) cancelHashRecovery();
    }

    function resolveHashTarget() {
      const rawHash = window.location.hash.slice(1);
      if (!rawHash) return null;

      let id = rawHash;
      try {
        id = decodeURIComponent(rawHash);
      } catch {}

      const target = document.getElementById(id);
      return target instanceof HTMLElement && contactFilm.contains(target) ? target : null;
    }

    function recoverHash() {
      if (disposed || hashCancelled || hashAttempts >= 6) return;
      const target = resolveHashTarget();
      if (!target) return;

      const top = target.getBoundingClientRect().top;
      const scrollMarginTop = Number.parseFloat(
        window.getComputedStyle(target).scrollMarginTop,
      );
      const intendedTop = Number.isFinite(scrollMarginTop) ? scrollMarginTop : 0;
      const delta = top - intendedTop;
      if (Math.abs(delta) <= 1) return;

      hashAttempts += 1;
      window.scrollTo({
        top: Math.max(0, window.scrollY + delta),
        behavior: "auto",
      });
      requestRender();

      if (hashAttempts < 6 && !hashCancelled) {
        hashTimer = window.setTimeout(recoverHash, 350);
      }
    }

    function scheduleHashRecovery() {
      if (!window.location.hash || hashCancelled) return;
      window.cancelAnimationFrame(hashFrame);
      hashFrame = window.requestAnimationFrame(recoverHash);
    }

    function restartHashRecovery() {
      hashAttempts = 0;
      hashCancelled = false;
      window.clearTimeout(hashTimer);
      window.cancelAnimationFrame(hashFrame);
      scheduleHashRecovery();
    }

    function onHashChange() {
      restartHashRecovery();
    }

    function onFilmClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor || !contactFilm.contains(anchor)) return;

      // Pointer-down correctly cancels an older recovery, but an intentional
      // chapter jump needs a fresh pass after the browser applies the new
      // fragment. The timeout also covers clicking the fragment already in
      // the URL, which does not emit another hashchange event.
      window.setTimeout(restartHashRecovery, 0);
    }

    const motionPreferenceObserver = new MutationObserver(requestRender);
    motionPreferenceObserver.observe(root, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });
    const interactionObserver = new MutationObserver(requestRender);
    scenes.forEach((scene) =>
      interactionObserver.observe(scene, {
        attributes: true,
        childList: true,
        subtree: true,
        attributeFilter: [
          "data-contact-reading-focus",
          "data-contact-form-expanded",
        ],
      }),
    );

    render();
    scheduleHashRecovery();
    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", requestRender);
    window.visualViewport?.addEventListener("resize", requestRender);
    window.addEventListener("wheel", cancelHashRecovery, { passive: true });
    window.addEventListener("touchstart", cancelHashRecovery, { passive: true });
    window.addEventListener("pointerdown", cancelHashRecovery, { passive: true });
    window.addEventListener("keydown", onManualKey);
    window.addEventListener("hashchange", onHashChange);
    contactFilm.addEventListener("click", onFilmClick);
    cameraReady.addEventListener("change", requestRender);
    if (document.readyState !== "complete") {
      window.addEventListener("load", scheduleHashRecovery);
    }
    void document.fonts?.ready?.then(() => {
      if (!disposed) scheduleHashRecovery();
    });

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(hashFrame);
      window.clearTimeout(hashTimer);
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", requestRender);
      window.visualViewport?.removeEventListener("resize", requestRender);
      window.removeEventListener("wheel", cancelHashRecovery);
      window.removeEventListener("touchstart", cancelHashRecovery);
      window.removeEventListener("pointerdown", cancelHashRecovery);
      window.removeEventListener("keydown", onManualKey);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("load", scheduleHashRecovery);
      contactFilm.removeEventListener("click", onFilmClick);
      cameraReady.removeEventListener("change", requestRender);
      motionPreferenceObserver.disconnect();
      interactionObserver.disconnect();
      delete root.dataset.contactFilmSnap;
      delete root.dataset.contactFormOwnsViewport;
    };
  }, []);

  return null;
}
