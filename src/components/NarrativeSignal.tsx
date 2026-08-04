"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const SCENE_COLORS = ["#C6A97A", "#B85A34", "#24394D", "#C28A28", "#5C6B4A", "#AD6F5C"];

export function NarrativeSignal() {
  const reduced = useHydratedReducedMotion();
  const [sceneIndex, setSceneIndex] = useState(0);
  const [interactive, setInteractive] = useState(false);
  const [pressed, setPressed] = useState(false);
  const pointerX = useMotionValue(-100);
  const pointerY = useMotionValue(-100);
  const previous = useRef({ x: -100, y: -100, time: performance.now() });
  const [speed, setSpeed] = useState(0);

  const cursorX = useSpring(pointerX, { stiffness: 520, damping: 38, mass: 0.28 });
  const cursorY = useSpring(pointerY, { stiffness: 520, damping: 38, mass: 0.28 });
  const trailX = useSpring(pointerX, { stiffness: 150, damping: 28, mass: 0.7 });
  const trailY = useSpring(pointerY, { stiffness: 150, damping: 28, mass: 0.7 });
  const cursorOpacity = useTransform(cursorX, (x) => (x < 0 ? 0 : 1));

  const color = useMemo(() => SCENE_COLORS[sceneIndex % SCENE_COLORS.length], [sceneIndex]);
  const cursorScale = interactive ? 1.7 : pressed ? 0.72 : 1;
  const trailScale = Math.min(1.9, 0.8 + speed / 900);

  useEffect(() => {
    if (reduced) return;

    const updateScene = () => {
      const scenes = Array.from(document.querySelectorAll<HTMLElement>("main > section, main > div[id]"));
      const focusY = window.innerHeight * 0.48;
      let active = 0;
      let closest = Number.POSITIVE_INFINITY;

      scenes.forEach((scene, index) => {
        const rect = scene.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height * 0.45 - focusY);
        if (distance < closest) {
          closest = distance;
          active = index;
        }
      });

      setSceneIndex(active);
    };

    const move = (event: PointerEvent) => {
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);

      const now = performance.now();
      const dt = Math.max(16, now - previous.current.time);
      const dx = event.clientX - previous.current.x;
      const dy = event.clientY - previous.current.y;
      setSpeed(Math.min(1200, (Math.hypot(dx, dy) / dt) * 1000));
      previous.current = { x: event.clientX, y: event.clientY, time: now };

      const target = event.target as HTMLElement | null;
      setInteractive(Boolean(target?.closest("a, button, input, textarea, select, [role='button']")));
    };

    const down = () => setPressed(true);
    const up = () => setPressed(false);

    updateScene();
    window.addEventListener("scroll", updateScene, { passive: true });
    window.addEventListener("resize", updateScene);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScene);
      window.removeEventListener("resize", updateScene);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [pointerX, pointerY, reduced]);

  if (reduced) return null;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[99] hidden h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border lg:block"
        animate={{ scale: trailScale, borderColor: color, opacity: interactive ? 0.22 : 0.38 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        style={{
          x: trailX,
          y: trailY,
          boxShadow: `0 0 34px ${color}44`,
          background: `${color}0f`,
        }}
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border lg:block"
        animate={{ scale: cursorScale, borderColor: color }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        style={{
          x: cursorX,
          y: cursorY,
          opacity: cursorOpacity,
          boxShadow: `0 0 18px ${color}88, inset 0 0 8px ${color}55`,
          background: interactive ? `${color}2b` : "rgba(20,17,14,0.18)",
        }}
      >
        <motion.span
          className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
          animate={{ backgroundColor: color, scale: interactive ? 0.7 : [0.8, 1.18, 0.8] }}
          transition={{ backgroundColor: { duration: 0.5 }, scale: interactive ? { duration: 0.2 } : { duration: 2.2, repeat: Infinity, ease: "easeInOut" } }}
        />
      </motion.div>

      <style jsx global>{`
        @media (min-width: 1024px) and (pointer: fine) {
          html, body, a, button, input, textarea, select, [role='button'] { cursor: none !important; }
        }
      `}</style>
    </>
  );
}
