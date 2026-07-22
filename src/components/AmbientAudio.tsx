"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const STORAGE_KEY = "ambient-audio-enabled";

// A small, sitewide opt-in toggle for a looping ambient track — never
// attempts autoplay-with-sound, which every browser blocks without a
// prior user gesture anyway, and which would read as intrusive on a
// marketing site regardless. Starts silent; a visitor who wants the
// calmer mood clicks in. Mounted directly in layout.tsx (a sibling of
// SmoothScrollProvider, same as DeferredCursor/PageLoadVeil) so it sits
// outside template.tsx's per-page page-enter wrapper and the <audio>
// element itself never remounts on client-side navigation — the track
// keeps playing seamlessly as someone moves between pages, and this
// button is never affected by the page-enter transform bug fixed
// elsewhere this session (fixed-position children of that wrapper lost
// their positioning after the entrance animation finished).
export function AmbientAudio() {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setReady(true);
    const stored = window.localStorage.getItem(STORAGE_KEY);
    // Only ever restores a previous *opt-in* — never turns itself on.
    // Browsers would block the attempt anyway without a fresh gesture,
    // so this is about respecting a returning visitor's choice, not
    // circumventing autoplay policy.
    if (stored === "true" && audioRef.current) {
      audioRef.current.play().then(
        () => setEnabled(true),
        () => setEnabled(false)
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
    } else {
      audio.play().then(
        () => {
          setEnabled(true);
          window.localStorage.setItem(STORAGE_KEY, "true");
        },
        () => setEnabled(false)
      );
    }
  }

  if (!ready) return null;

  return (
    <>
      <audio ref={audioRef} src="/audio/ambient-zen-moment.mp3" loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-label={enabled ? "Mute ambient sound" : "Play ambient sound"}
        aria-pressed={enabled}
        className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-ivory/20 bg-soil/80 text-ivory shadow-elevation-sm backdrop-blur-md transition-all duration-300 hover:border-ivory/40 hover:bg-soil"
      >
        {enabled ? <Volume2 size={17} strokeWidth={1.75} /> : <VolumeX size={17} strokeWidth={1.75} />}
      </button>
    </>
  );
}
