"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

const CARD_FILM_REQUEST_EVENT = "insight-card-media:request-play";

type InsightCardMediaProps = {
  image: string;
  alt: string;
  video?: string;
  sizes: string;
};

export function InsightCardMedia({
  image,
  alt,
  video,
  sizes,
}: InsightCardMediaProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const prefersReducedMotion = useHydratedReducedMotion();

  useEffect(() => {
    const stage = stageRef.current;
    const film = videoRef.current;
    const card = stage?.closest<HTMLElement>("a");

    if (!stage || !card) return;
    if (prefersReducedMotion) {
      setIsPlaying(false);
      return;
    }
    const activeFilm = film;
    const activeCard = card;
    const touchFirst = window.matchMedia("(hover: none), (pointer: coarse)");
    let pointerFrame = 0;
    let scrollFrame = 0;
    let velocityFrame = 0;
    let scrollVelocity = 0;
    let previousScrollY = window.scrollY;
    let previousScrollTime = performance.now();
    let lastVelocityUpdate = previousScrollTime;

    activeCard.dataset.cardMotion = "ready";
    activeCard.dataset.cardRevealed = "false";

    function clamp(value: number, minimum = 0, maximum = 1) {
      return Math.min(maximum, Math.max(minimum, value));
    }

    function renderScrollPosition() {
      const rect = activeCard.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const cardCenter = rect.top + rect.height / 2;
      const travelRange = Math.max(viewportHeight * 0.7, rect.height);
      const position = clamp(
        (cardCenter - viewportHeight / 2) / travelRange,
        -1,
        1,
      );
      const focus = 1 - Math.abs(position);
      const currentScrollY = window.scrollY;
      const currentTime = performance.now();
      const elapsed = Math.max(16, currentTime - previousScrollTime);
      const distance = currentScrollY - previousScrollY;
      const velocity = clamp(Math.abs(distance) / elapsed / 1.35);
      scrollVelocity = velocity;
      lastVelocityUpdate = currentTime;

      activeCard.style.setProperty("--card-scroll-focus", focus.toFixed(3));
      activeCard.style.setProperty(
        "--card-scroll-y",
        `${(position * -8).toFixed(2)}px`,
      );
      activeCard.style.setProperty(
        "--card-scroll-tilt",
        `${(position * -0.7).toFixed(3)}deg`,
      );
      activeCard.style.setProperty(
        "--card-scroll-velocity",
        scrollVelocity.toFixed(3),
      );
      activeCard.dataset.cardFocus = focus >= 0.46 ? "true" : "false";
      activeCard.dataset.cardDirection = distance < 0 ? "back" : "forward";
      activeCard.dataset.cardScrollState =
        scrollVelocity > 0.04 ? "moving" : "settled";

      previousScrollY = currentScrollY;
      previousScrollTime = currentTime;
      scrollFrame = 0;
      requestVelocitySettle();
    }

    function settleVelocity() {
      const idleFor = performance.now() - lastVelocityUpdate;
      if (idleFor < 72) {
        velocityFrame = requestAnimationFrame(settleVelocity);
        return;
      }

      scrollVelocity *= 0.78;
      if (scrollVelocity < 0.012) scrollVelocity = 0;
      activeCard.style.setProperty(
        "--card-scroll-velocity",
        scrollVelocity.toFixed(3),
      );
      activeCard.dataset.cardScrollState =
        scrollVelocity > 0 ? "moving" : "settled";

      velocityFrame =
        scrollVelocity > 0 ? requestAnimationFrame(settleVelocity) : 0;
    }

    function requestVelocitySettle() {
      if (velocityFrame) return;
      velocityFrame = requestAnimationFrame(settleVelocity);
    }

    function requestScrollRender() {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(renderScrollPosition);
    }

    function renderPointer(event: PointerEvent) {
      const rect = activeCard.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));

      activeCard.style.setProperty("--card-lens-x", `${(x * 100).toFixed(2)}%`);
      activeCard.style.setProperty("--card-lens-y", `${(y * 100).toFixed(2)}%`);
      activeCard.style.setProperty("--card-image-x", `${((x - 0.5) * -8).toFixed(2)}px`);
      activeCard.style.setProperty("--card-image-y", `${((y - 0.5) * -6).toFixed(2)}px`);
      pointerFrame = 0;
    }

    function handlePointerMove(event: PointerEvent) {
      if (pointerFrame) cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => renderPointer(event));
    }

    function resetPointer() {
      if (pointerFrame) cancelAnimationFrame(pointerFrame);
      pointerFrame = 0;
      activeCard.style.setProperty("--card-lens-x", "50%");
      activeCard.style.setProperty("--card-lens-y", "38%");
      activeCard.style.setProperty("--card-image-x", "0px");
      activeCard.style.setProperty("--card-image-y", "0px");
    }

    function playFilm() {
      if (!activeFilm) return;
      // The sitewide VideoWarden gives an explicitly explored foreground film
      // priority over ambient section media. This keeps the explored card responsive and the interaction scoped. Add that intent before play so
      // its synchronous arbitration keeps this card alive.
      activeFilm.dataset.videoPriority = "foreground";
      window.dispatchEvent(
        new CustomEvent(CARD_FILM_REQUEST_EVENT, { detail: activeFilm }),
      );

      activeFilm
        .play()
        .then(() => setIsPlaying(!activeFilm.paused))
        .catch(() => setIsPlaying(false));
    }

    function pauseFilm() {
      if (!activeFilm) return;
      delete activeFilm.dataset.videoPriority;
      activeFilm.pause();
      setIsPlaying(false);
    }

    function handlePointerLeave() {
      pauseFilm();
      resetPointer();
    }

    function handlePlaying() {
      setIsPlaying(true);
    }

    function handlePause() {
      setIsPlaying(false);
    }

    function handleFilmRequest(event: Event) {
      if (
        activeFilm &&
        event instanceof CustomEvent &&
        event.detail instanceof HTMLVideoElement &&
        event.detail !== activeFilm
      ) {
        pauseFilm();
      }
    }

    const observer = activeFilm && touchFirst.matches
      ? new IntersectionObserver(
          ([entry]) => {
            if (entry?.isIntersecting && entry.intersectionRatio >= 0.62) {
              playFilm();
            } else {
              pauseFilm();
            }
          },
          {
            rootMargin: "-22% 0px -22% 0px",
            threshold: [0, 0.62, 1],
          },
        )
      : null;

    const revealObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        activeCard.dataset.cardRevealed = "true";
        revealObserver.disconnect();
      },
      { rootMargin: "0px 0px -8%", threshold: 0.14 },
    );

    revealObserver.observe(activeCard);
    renderScrollPosition();
    window.addEventListener("scroll", requestScrollRender, { passive: true });
    window.addEventListener("resize", requestScrollRender);

    if (observer) {
      observer.observe(stage);
    } else {
      activeCard.addEventListener("pointerenter", playFilm);
      activeCard.addEventListener("pointermove", handlePointerMove);
      activeCard.addEventListener("pointerleave", handlePointerLeave);
    }
    activeCard.addEventListener("focus", playFilm);
    activeCard.addEventListener("blur", pauseFilm);
    activeFilm?.addEventListener("playing", handlePlaying);
    activeFilm?.addEventListener("pause", handlePause);
    window.addEventListener(CARD_FILM_REQUEST_EVENT, handleFilmRequest);

    return () => {
      observer?.disconnect();
      revealObserver.disconnect();
      window.removeEventListener("scroll", requestScrollRender);
      window.removeEventListener("resize", requestScrollRender);
      activeCard.removeEventListener("pointerenter", playFilm);
      activeCard.removeEventListener("pointermove", handlePointerMove);
      activeCard.removeEventListener("pointerleave", handlePointerLeave);
      activeCard.removeEventListener("focus", playFilm);
      activeCard.removeEventListener("blur", pauseFilm);
      activeFilm?.removeEventListener("playing", handlePlaying);
      activeFilm?.removeEventListener("pause", handlePause);
      window.removeEventListener(CARD_FILM_REQUEST_EVENT, handleFilmRequest);
      if (pointerFrame) cancelAnimationFrame(pointerFrame);
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
      if (velocityFrame) cancelAnimationFrame(velocityFrame);
      delete activeCard.dataset.cardMotion;
      delete activeCard.dataset.cardRevealed;
      delete activeCard.dataset.cardFocus;
      delete activeCard.dataset.cardDirection;
      delete activeCard.dataset.cardScrollState;
      activeCard.style.removeProperty("--card-lens-x");
      activeCard.style.removeProperty("--card-lens-y");
      activeCard.style.removeProperty("--card-image-x");
      activeCard.style.removeProperty("--card-image-y");
      activeCard.style.removeProperty("--card-scroll-focus");
      activeCard.style.removeProperty("--card-scroll-y");
      activeCard.style.removeProperty("--card-scroll-tilt");
      activeCard.style.removeProperty("--card-scroll-velocity");
      if (activeFilm) {
        delete activeFilm.dataset.videoPriority;
        activeFilm.pause();
      }
    };
  }, [prefersReducedMotion, video]);

  return (
    <div
      ref={stageRef}
      className={`insight-card-media ${isPlaying ? "insight-card-media--playing" : ""}`}
    >
      <Image
        src={image}
        alt={alt}
        fill
        sizes={sizes}
        className="insight-card-media__poster object-cover"
      />
      {video && !prefersReducedMotion ? (
        <video
          ref={videoRef}
          className="insight-card-media__film"
          muted
          loop
          playsInline
          preload="metadata"
          poster={image}
          aria-hidden="true"
        >
          <source src={video} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}
