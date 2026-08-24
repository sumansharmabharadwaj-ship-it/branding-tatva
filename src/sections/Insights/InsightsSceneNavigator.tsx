"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

export type InsightScene = {
  id: string;
  label: string;
  accent: string;
};

type InsightsSceneNavigatorProps = {
  scenes: InsightScene[];
};

const OBSERVER_THRESHOLDS = [0.08, 0.18, 0.32, 0.48, 0.64, 0.8];

export function InsightsSceneNavigator({ scenes }: InsightsSceneNavigatorProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const ratiosRef = useRef(new Map<string, number>());
  const prefersReducedMotion = useHydratedReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 26,
    restDelta: 0.001,
  });
  const activeScene = scenes[activeIndex] ?? scenes[0];

  useEffect(() => {
    const targets = scenes
      .map((scene) => document.getElementById(scene.id))
      .filter((target): target is HTMLElement => Boolean(target));

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratiosRef.current.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
        });

        let nextIndex = 0;
        let strongestRatio = -1;

        scenes.forEach((scene, index) => {
          const ratio = ratiosRef.current.get(scene.id) ?? 0;
          if (ratio > strongestRatio) {
            strongestRatio = ratio;
            nextIndex = index;
          }
        });

        if (strongestRatio <= 0) return;

        setActiveIndex((current) =>
          current === nextIndex ? current : nextIndex,
        );
      },
      {
        rootMargin: "-10% 0px -18% 0px",
        threshold: OBSERVER_THRESHOLDS,
      },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [scenes]);

  useEffect(() => {
    scenes.forEach((scene, index) => {
      const target = document.getElementById(scene.id);
      if (target) target.dataset.sceneActive = String(index === activeIndex);
    });
  }, [activeIndex, scenes]);

  function moveToScene(event: MouseEvent<HTMLAnchorElement>, index: number) {
    setActiveIndex(index);

    if (prefersReducedMotion) return;

    const target = document.getElementById(scenes[index]?.id ?? "");
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (!activeScene || scenes.length === 0) return null;

  return (
    <aside
      className="insights-scene-nav"
      aria-label="Insights page chapters"
      style={{ "--scene-accent": activeScene.accent } as CSSProperties}
    >
      <div className="insights-scene-nav__meta" aria-hidden="true">
        <span>Scene {String(activeIndex + 1).padStart(2, "0")}</span>
        <strong>{activeScene.label}</strong>
      </div>

      <nav className="insights-scene-nav__chapters">
        <span className="insights-scene-nav__thread" aria-hidden="true">
          <motion.i style={{ scaleY: progress }} />
        </span>
        <motion.span
          className="insights-scene-nav__marker"
          aria-hidden="true"
          animate={{ y: activeIndex * 35.68 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.62, ease: [0.22, 1, 0.36, 1] }
          }
        />
        {scenes.map((scene, index) => (
          <a
            key={scene.id}
            href={`#${scene.id}`}
            aria-label={`Scene ${index + 1}: ${scene.label}`}
            aria-current={index === activeIndex ? "location" : undefined}
            onClick={(event) => moveToScene(event, index)}
          >
            <i style={{ "--dot-accent": scene.accent } as CSSProperties} />
            <span>{scene.label}</span>
          </a>
        ))}
      </nav>

      <div className="insights-scene-nav__count" aria-hidden="true">
        <span>{String(activeIndex + 1).padStart(2, "0")}</span>
        <i />
        <span>{String(scenes.length).padStart(2, "0")}</span>
      </div>
    </aside>
  );
}
