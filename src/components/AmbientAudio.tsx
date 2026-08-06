"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const STORAGE_KEY = "ambient-audio-enabled";

type AmbientStateEvent = CustomEvent<{ enabled?: boolean }>;

function readStoredPreference() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStoredPreference(enabled: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(enabled));
  } catch {
    // The audio choice still applies for the current visit when storage is unavailable.
  }
}

export function AmbientAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const enabledRef = useRef(false);

  const publishState = useCallback((next: boolean) => {
    enabledRef.current = next;
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
      writeStoredPreference(false);
      publishState(false);
      return;
    }

    void audio.play().then(
      () => {
        writeStoredPreference(true);
        publishState(true);
      },
      () => publishState(false),
    );
  }, [publishState]);

  useEffect(() => {
    const stored = readStoredPreference();
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

  return <audio ref={audioRef} src="/audio/ambient-zen-moment.mp3" loop preload="none" />;
}

export function AmbientAudioButton({ accent }: { accent?: string }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    function onState(event: Event) {
      setEnabled(Boolean((event as AmbientStateEvent).detail?.enabled));
    }

    window.addEventListener("bt:ambient-audio-state", onState);
    window.dispatchEvent(new CustomEvent("bt:ambient-audio-query"));
    return () => window.removeEventListener("bt:ambient-audio-state", onState);
  }, []);

  function toggle() {
    window.dispatchEvent(new CustomEvent("bt:ambient-audio-toggle"));
  }

  return (
    <button
      type="button"
      data-ambient-audio-toggle
      onClick={toggle}
      aria-label={enabled ? "Mute ambient sound" : "Play ambient sound"}
      aria-pressed={enabled}
      title={enabled ? "Mute ambient sound" : "Play ambient sound"}
      className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ivory/12 text-ivory/75 transition-[background-color,border-color,transform,color] duration-300 hover:-translate-y-0.5 hover:border-ivory/30 hover:bg-ivory/[0.06] hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ color: accent, outlineColor: accent }}
    >
      {enabled ? <Volume2 size={17} strokeWidth={1.7} /> : <VolumeX size={17} strokeWidth={1.7} />}
    </button>
  );
}
