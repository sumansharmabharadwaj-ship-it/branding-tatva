"use client";

import { Pause, Play } from "lucide-react";
import styles from "./VisualizerPlayback.module.css";

type VisualizerPlaybackProps = {
  current: number;
  total: number;
  durationMs: number;
  isRunning: boolean;
  progressKey: string;
  onToggle: () => void;
  label?: string;
  tone?: "light" | "dark";
  className?: string;
};

export function VisualizerPlayback({
  current,
  total,
  durationMs,
  isRunning,
  progressKey,
  onToggle,
  label = "Visualizer autoplay",
  tone = "light",
  className = "",
}: VisualizerPlaybackProps) {
  return (
    <div
      className={`${styles.root} ${styles[tone]} ${className}`}
      data-running={isRunning ? "true" : "false"}
      aria-label={label}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-label={isRunning ? `Pause ${label.toLowerCase()}` : `Play ${label.toLowerCase()}`}
        aria-pressed={isRunning}
      >
        {isRunning ? <Pause size={13} /> : <Play size={13} />}
      </button>
      <span className={styles.status}>{isRunning ? "Playing" : "Paused"}</span>
      <span className={styles.track} aria-hidden="true">
        <i
          key={progressKey}
          style={{ animationDuration: `${durationMs}ms` }}
        />
      </span>
      <strong>
        {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </strong>
    </div>
  );
}
