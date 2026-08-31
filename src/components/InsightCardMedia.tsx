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

    if (!stage || !film || !card || prefersReducedMotion) return;
    const activeFilm = film;
    const touchFirst = window.matchMedia("(hover: none), (pointer: coarse)");
    let pointerFrame = 0;

    card.dataset.cardMotion = "ready";
    card.dataset.cardRevealed = "false";

    function renderPointer(event: PointerEvent) {
      const rect = card.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));

      card.style.setProperty("--card-lens-x", `${(x * 100).toFixed(2)}%`);
      card.style.setProperty("--card-lens-y", `${(y * 100).toFixed(2)}%`);
      card.style.setProperty("--card-image-x", `${((x - 0.5) * -8).toFixed(2)}px`);
      card.style.setProperty("--card-image-y", `${((y - 0.5) * -6).toFixed(2)}px`);
      pointerFrame = 0;
    }

    function handlePointerMove(event: PointerEvent) {
      if (pointerFrame) cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => renderPointer(event));
    }

    function resetPointer() {
      if (pointerFrame) cancelAnimationFrame(pointerFrame);
      pointerFrame = 0;
      card.style.setProperty("--card-lens-x", "50%");
      card.style.setProperty("--card-lens-y", "38%");
      card.style.setProperty("--card-image-x", "0px");
      card.style.setProperty("--card-image-y", "0px");
    }

    function playFilm() {
      // The sitewide VideoWarden gives an explicitly explored foreground film
      // priority over ambient section media. Add that intent before play so
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
        event instanceof CustomEvent &&
        event.detail instanceof HTMLVideoElement &&
        event.detail !== activeFilm
      ) {
        pauseFilm();
      }
    }

    const observer = touchFirst.matches
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
        card.dataset.cardRevealed = "true";
        revealObserver.disconnect();
      },
      { rootMargin: "0px 0px -8%", threshold: 0.14 },
    );

    revealObserver.observe(card);

    if (observer) {
      observer.observe(stage);
    } else {
      card.addEventListener("pointerenter", playFilm);
      card.addEventListener("pointermove", handlePointerMove);
      card.addEventListener("pointerleave", handlePointerLeave);
    }
    card.addEventListener("focus", playFilm);
    card.addEventListener("blur", pauseFilm);
    activeFilm.addEventListener("playing", handlePlaying);
    activeFilm.addEventListener("pause", handlePause);
    window.addEventListener(CARD_FILM_REQUEST_EVENT, handleFilmRequest);

    return () => {
      observer?.disconnect();
      revealObserver.disconnect();
      card.removeEventListener("pointerenter", playFilm);
      card.removeEventListener("pointermove", handlePointerMove);
      card.removeEventListener("pointerleave", handlePointerLeave);
      card.removeEventListener("focus", playFilm);
      card.removeEventListener("blur", pauseFilm);
      activeFilm.removeEventListener("playing", handlePlaying);
      activeFilm.removeEventListener("pause", handlePause);
      window.removeEventListener(CARD_FILM_REQUEST_EVENT, handleFilmRequest);
      if (pointerFrame) cancelAnimationFrame(pointerFrame);
      delete card.dataset.cardMotion;
      delete card.dataset.cardRevealed;
      card.style.removeProperty("--card-lens-x");
      card.style.removeProperty("--card-lens-y");
      card.style.removeProperty("--card-image-x");
      card.style.removeProperty("--card-image-y");
      delete activeFilm.dataset.videoPriority;
      activeFilm.pause();
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
