"use client";

import { useEffect } from "react";
import { preconnect } from "react-dom";

const SCROLL_KEYS = new Set([
  // Focus navigation can scroll a control into view; it also owns the viewport.
  "Tab",
  "ArrowDown",
  "ArrowUp",
  "PageDown",
  "PageUp",
  "Home",
  "End",
  " ",
]);

/** Native scroll owns the viewport. This runtime tracks form visibility and
 * recovers initial fragment links after layout settles; it never snaps scenes. */
export function ContactScrollRuntime() {
  // Every primary action on Contact opens Calendly. Warming the connection
  // while the visitor is still reading means the DNS and TLS round trips are
  // already paid by the time they commit to a time.
  preconnect("https://calendly.com");
  preconnect("https://assets.calendly.com");

  useEffect(() => {
    const root = document.documentElement;
    const film = document.querySelector<HTMLElement>("[data-contact-film]");
    const scenes = Array.from(document.querySelectorAll<HTMLElement>("[data-contact-scene]"));
    if (!film || scenes.length === 0) return;
    const contactFilm = film;

    let frame = 0;
    let disposed = false;
    let hashAttempts = 0;
    let hashCancelled = false;
    let hashFrame = 0;
    let hashTimer = 0;
    let hashLastScrollY = -1;
    let hashMotionWaits = 0;

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
      delete root.dataset.contactFilmSnap;
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

      // A chapter glide may still be in flight — the film scrolls smoothly
      // between anchors now — and correcting mid flight with an auto scroll
      // would teleport straight through the animation. While the viewport is
      // still moving, wait; recovery only measures once the scroll has
      // settled. The wait has its own cap so a runaway animation can never
      // pin recovery forever.
      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - hashLastScrollY) > 2 && hashMotionWaits < 24) {
        hashLastScrollY = currentScrollY;
        hashMotionWaits += 1;
        hashTimer = window.setTimeout(recoverHash, 180);
        return;
      }

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
        behavior: "instant",
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
      hashLastScrollY = -1;
      hashMotionWaits = 0;
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

      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const id = anchor.hash.slice(1);
      let decoded = id;
      try { decoded = decodeURIComponent(id); } catch { return; }
      const destination = document.getElementById(decoded);
      if (!destination || !contactFilm.contains(destination)) return;
      event.preventDefault();
      cancelHashRecovery();
      if (window.location.hash !== anchor.hash) window.history.pushState(null, "", anchor.hash);
      const reduced = root.dataset.motion === "reduced" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      destination.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" });
      // Transfer keyboard navigation without making another scroll correction.
      if (!destination.hasAttribute("tabindex")) {
        destination.setAttribute("tabindex", "-1");
        destination.addEventListener("blur", () => destination.removeAttribute("tabindex"), { once: true });
      }
      destination.focus({ preventScroll: true });
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
          "data-invitation-pinned",
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
      motionPreferenceObserver.disconnect();
      interactionObserver.disconnect();
      delete root.dataset.contactFilmSnap;
      delete root.dataset.contactFormOwnsViewport;
    };
  }, []);

  return null;
}
