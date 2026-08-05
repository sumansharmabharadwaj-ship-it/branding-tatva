"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const STORAGE_KEY = "ambient-audio-enabled";

export function AmbientAudio() {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const enabledRef = useRef(false);

  const publishState = useCallback((next: boolean) => {
    enabledRef.current = next;
    setEnabled(next);
    window.dispatchEvent(
      new CustomEvent("bt:ambient-audio-state", {
        detail: { enabled: next },
      }),
    );
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      window.localStorage.setItem(STORAGE_KEY, "false");
      publishState(false);
      return;
    }

    void audio.play().then(
      () => {
        window.localStorage.setItem(STORAGE_KEY, "true");
        publishState(true);
      },
      () => publishState(false),
    );
  }, [publishState]);

  useEffect(() => {
    setReady(true);
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const audio = audioRef.current;

    if (stored === "true" && audio) {
      void audio.play().then(
        () => publishState(true),
        () => publishState(false),
      );
    } else {
      publishState(false);
    }
  }, [publishState]);

  useEffect(() => {
    function onToggle() {
      toggle();
    }

    function onQuery() {
      window.dispatchEvent(
        new CustomEvent("bt:ambient-audio-state", {
          detail: { enabled: enabledRef.current },
        }),
      );
    }

    window.addEventListener("bt:ambient-audio-toggle", onToggle);
    window.addEventListener("bt:ambient-audio-query", onQuery);
    return () => {
      window.removeEventListener("bt:ambient-audio-toggle", onToggle);
      window.removeEventListener("bt:ambient-audio-query", onQuery);
    };
  }, [toggle]);

  if (!ready) return null;

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/ambient-zen-moment.mp3"
        loop
        preload="none"
      />
      <button
        type="button"
        data-ambient-audio-toggle
        onClick={toggle}
        aria-label={enabled ? "Mute ambient sound" : "Play ambient sound"}
        aria-pressed={enabled}
        className="fixed bottom-5 right-0 z-40 flex h-10 w-9 items-center justify-center rounded-l-full border border-r-0 border-ivory/18 bg-soil/78 text-ivory/72 shadow-elevation-sm backdrop-blur-md transition-[opacity,background-color,border-color,transform] duration-300 hover:border-ivory/36 hover:bg-soil hover:text-ivory"
      >
        {enabled ? (
          <Volume2 size={16} strokeWidth={1.7} />
        ) : (
          <VolumeX size={16} strokeWidth={1.7} />
        )}
      </button>
    </>
  );
}
