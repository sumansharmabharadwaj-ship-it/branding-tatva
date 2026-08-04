"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useFooterInView } from "@/hooks/useFooterInView";

const STORAGE_KEY = "ambient-audio-enabled";

// A sitewide opt-in sound control. It never attempts sound autoplay and
// restores a prior preference only when the browser allows it. The visual
// control shares the same compact utility language as privacy preferences,
// so the film is not bookended by unrelated floating pills.
export function AmbientAudio() {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const footerInView = useFooterInView();

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

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (enabled) {
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
  }

  if (!ready) return null;

  const label = enabled ? "Mute ambient sound" : "Play ambient sound";

  return (
    <>
      <audio ref={audioRef} src="/audio/ambient-zen-moment.mp3" loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-label={label}
        aria-pressed={enabled}
        className={`group fixed right-3 z-90 flex h-11 w-11 items-center justify-center rounded-full border border-[#22231F]/12 bg-[#F5F0E8]/92 text-[#22231F] shadow-[0_12px_34px_-18px_rgba(34,35,31,.65)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[#A47746]/45 hover:text-[#8E603D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A47746]/55 sm:right-5 ${footerInView ? "pointer-events-none translate-y-3 opacity-0" : "opacity-100"}`}
        style={{
          bottom: "max(0.75rem, env(safe-area-inset-bottom))",
          opacity: footerInView ? 0 : 1,
        }}
      >
        {enabled ? (
          <Volume2 size={17} strokeWidth={1.7} aria-hidden="true" />
        ) : (
          <VolumeX size={17} strokeWidth={1.7} aria-hidden="true" />
        )}
        <span className="pointer-events-none absolute bottom-[calc(100%+0.55rem)] right-0 hidden whitespace-nowrap rounded-full border border-[#22231F]/10 bg-[#F5F0E8]/96 px-3 py-1.5 text-[0.55rem] font-medium uppercase tracking-[0.14em] text-[#22231F]/72 opacity-0 shadow-sm backdrop-blur-xl transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 sm:block">
          {enabled ? "Sound on" : "Sound off"}
        </span>
      </button>
    </>
  );
}
