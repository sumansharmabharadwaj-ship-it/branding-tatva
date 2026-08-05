"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const STORAGE_KEY = "ambient-audio-enabled";

function announceState(enabled: boolean) {
  window.dispatchEvent(
    new CustomEvent("bt:ambient-audio-state", {
      detail: { enabled },
    }),
  );
}

// A sitewide, opt-in ambient track. Desktop keeps the direct floating sound
// button. Mobile exposes the same control through HomeAutoJourney's compact
// cinema menu so three fixed circles no longer sit over the reading column.
export function AmbientAudio() {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      setEnabled(false);
      window.localStorage.setItem(STORAGE_KEY, "false");
      return;
    }

    audio.play().then(
      () => {
        setEnabled(true);
        window.localStorage.setItem(STORAGE_KEY, "true");
      },
      () => setEnabled(false),
    );
  }, []);

  useEffect(() => {
    setReady(true);
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "true" && audioRef.current) {
      audioRef.current.play().then(
        () => setEnabled(true),
        () => setEnabled(false),
      );
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    announceState(enabled);
  }, [enabled, ready]);

  useEffect(() => {
    function onToggleRequest() {
      toggle();
    }

    function onStateRequest() {
      announceState(enabled);
    }

    window.addEventListener("bt:ambient-audio-toggle", onToggleRequest);
    window.addEventListener("bt:ambient-audio-query", onStateRequest);
    return () => {
      window.removeEventListener("bt:ambient-audio-toggle", onToggleRequest);
      window.removeEventListener("bt:ambient-audio-query", onStateRequest);
    };
  }, [enabled, toggle]);

  if (!ready) return null;

  return (
    <>
      <audio ref={audioRef} src="/audio/ambient-zen-moment.mp3" loop preload="none" />
      <button
        type="button"
        data-ambient-audio-control
        onClick={toggle}
        aria-label={enabled ? "Mute ambient sound" : "Play ambient sound"}
        aria-pressed={enabled}
        className="fixed bottom-6 right-6 z-40 hidden h-11 w-11 items-center justify-center rounded-full border border-ivory/20 bg-soil/80 text-ivory shadow-elevation-sm backdrop-blur-md transition-all duration-300 hover:border-ivory/40 hover:bg-soil lg:flex motion-reduce:flex"
      >
        {enabled ? (
          <Volume2 size={17} strokeWidth={1.75} />
        ) : (
          <VolumeX size={17} strokeWidth={1.75} />
        )}
      </button>
    </>
  );
}
