"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

const SCENE_COLORS = ["#C6A97A", "#B85A34", "#24394D", "#C28A28", "#5C6B4A", "#AD6F5C"];
const SIGNAL_PATH = "M50 0 C18 90 82 160 48 250 C12 350 88 425 50 530 C18 620 84 705 48 810 C18 900 76 960 50 1080";

function sceneLabel(index: number) {
  return ["Arrival", "Recognition", "Evidence", "Decision", "Tatva", "Movement", "Invitation"][index] ?? "Signal";
}

export function NarrativeSignal() {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [interactive, setInteractive] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const cursorX = useSpring(mouseX, { stiffness: 420, damping: 34, mass: 0.35 });
  const cursorY = useSpring(mouseY, { stiffness: 420, damping: 34, mass: 0.35 });
  const cursorScale = useSpring(interactive ? 1.75 : 1, { stiffness: 360, damping: 24 });
  const lineRef = useRef<SVGPathElement>(null);

  const color = useMemo(() => SCENE_COLORS[sceneIndex % SCENE_COLORS.length], [sceneIndex]);
  const cursorOpacity = useTransform(cursorX, (x) => (x < 0 ? 0 : 1));

  useEffect(() => {
    if (reduced) return;

    const update = () => {
      const root = document.documentElement;
      const max = Math.max(1, root.scrollHeight - window.innerHeight);
      setProgress(Math.min(1, Math.max(0, window.scrollY / max)));

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
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
      const target = event.target as HTMLElement | null;
      setInteractive(Boolean(target?.closest("a, button, input, textarea, select, [role='button']")));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("pointermove", move);
    };
  }, [mouseX, mouseY, reduced]);

  useEffect(() => {
    cursorScale.set(interactive ? 1.75 : 1);
  }, [cursorScale, interactive]);

  if (reduced) return null;

  const dash = 1200;
  const offset = dash * (1 - progress);

  return (
    <>
      <div className="pointer-events-none fixed inset-y-0 right-3 z-[70] hidden w-12 lg:block" aria-hidden="true">
        <svg viewBox="0 0 100 1080" preserveAspectRatio="none" className="h-full w-full overflow-visible">
          <path d={SIGNAL_PATH} fill="none" stroke="rgba(244,239,230,0.11)" strokeWidth="1.1" />
          <motion.path
            ref={lineRef}
            d={SIGNAL_PATH}
            fill="none"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeDasharray={dash}
            animate={{ strokeDashoffset: offset, stroke: color }}
            transition={{ strokeDashoffset: { duration: 0.16, ease: "linear" }, stroke: { duration: 0.7 } }}
          />
          <motion.circle
            cx="50"
            cy={Math.max(20, progress * 1040)}
            r="5"
            fill={color}
            animate={{ fill: color, r: [4, 6, 4] }}
            transition={{ fill: { duration: 0.7 }, r: { duration: 2.4, repeat: Infinity, ease: "easeInOut" } }}
          />
          <motion.circle
            cx="50"
            cy={Math.max(20, progress * 1040)}
            r="13"
            fill="none"
            stroke={color}
            strokeWidth="0.8"
            animate={{ opacity: [0.65, 0], scale: [0.6, 1.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
        </svg>
        <motion.span
          className="absolute right-8 top-1/2 -translate-y-1/2 whitespace-nowrap text-[0.55rem] uppercase tracking-[0.28em] text-ivory/50"
          style={{ writingMode: "vertical-rl" }}
          key={sceneIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {sceneLabel(sceneIndex)}
        </motion.span>
      </div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border lg:block"
        style={{
          x: cursorX,
          y: cursorY,
          scale: cursorScale,
          opacity: cursorOpacity,
          borderColor: color,
          boxShadow: `0 0 18px ${color}80, inset 0 0 8px ${color}55`,
          background: interactive ? `${color}24` : "rgba(20,17,14,0.16)",
        }}
      >
        <motion.span
          className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
          animate={{ backgroundColor: color }}
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
