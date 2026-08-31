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
    const card = stage?.closest("a");

    if (!stage || !film || !card || prefersReducedMotion) return;
    const activeFilm = film;
    const touchFirst = window.matchMedia("(hover: none), (pointer: coarse)");

    function playFilm() {
      window.dispatchEvent(
        new CustomEvent(CARD_FILM_REQUEST_EVENT, { detail: activeFilm }),
      );

      activeFilm
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }

    function pauseFilm() {
      activeFilm.pause();
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

    if (observer) {
      observer.observe(stage);
    } else {
      card.addEventListener("pointerenter", playFilm);
      card.addEventListener("pointerleave", pauseFilm);
    }
    card.addEventListener("focus", playFilm);
    card.addEventListener("blur", pauseFilm);
    window.addEventListener(CARD_FILM_REQUEST_EVENT, handleFilmRequest);

    return () => {
      observer?.disconnect();
      card.removeEventListener("pointerenter", playFilm);
      card.removeEventListener("pointerleave", pauseFilm);
      card.removeEventListener("focus", playFilm);
      card.removeEventListener("blur", pauseFilm);
      window.removeEventListener(CARD_FILM_REQUEST_EVENT, handleFilmRequest);
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
