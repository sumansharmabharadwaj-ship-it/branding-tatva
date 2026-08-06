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
      <audio ref={audioRef} src="/audio/ambient-zen-moment.mp3" loop preload="none" />
      <button
        type="button"
        data-ambient-audio-toggle
        onClick={toggle}
        aria-label={enabled ? "Mute ambient sound" : "Play ambient sound"}
        aria-pressed={enabled}
        className="fixed z-40 flex h-11 w-11 items-center justify-center rounded-full border border-ivory/20 bg-[#0B1814]/82 text-ivory/78 shadow-[0_12px_34px_rgba(0,0,0,0.26)] backdrop-blur-md transition-[background-color,border-color,transform,color] duration-300 hover:-translate-y-0.5 hover:border-ivory/38 hover:bg-[#10231D] hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#AFC19F]"
        style={{
          right: "max(0.9rem, env(safe-area-inset-right))",
          bottom: "max(0.9rem, env(safe-area-inset-bottom))",
        }}
      >
        {enabled ? <Volume2 size={17} strokeWidth={1.7} /> : <VolumeX size={17} strokeWidth={1.7} />}
      </button>
    </>
  );
}
