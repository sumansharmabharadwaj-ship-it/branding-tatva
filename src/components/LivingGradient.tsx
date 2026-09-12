import type { CSSProperties } from "react";
import styles from "./LivingGradient.module.css";

/* The eight fields below are read directly off Suman's reference board
 * (Sep 2026), one per plate she sent, translated into this site's own
 * palette rather than sampled from the references themselves. That
 * translation is the standing rule on this project: take the technique,
 * keep the earthy identity. A reference's literal hues have been
 * rejected here before for exactly this reason.
 *
 * Every value is an existing brand token (globals.css) or a colour from
 * the codified living-brand palette in CLAUDE.md — no new brand colour
 * is introduced by this file.
 */
export type LivingGradientPreset =
  | "orangery"
  | "canopy"
  | "cyanotype"
  | "understory"
  | "dusk"
  | "verdure"
  | "plantation"
  | "wanderlust";

type FieldVars = {
  /** Flat colour behind everything; also drives the vignette and edge falloff. */
  base: string;
  a: string;
  b: string;
  c: string;
  /** The drifting light shaft — the god ray / window light in the references. */
  light: string;
  /** Light plates need far less grain before it reads as dirt rather than film. */
  grain: number;
};

const FIELDS: Record<LivingGradientPreset, FieldVars> = {
  // Plate 1 — the dark botanical orangery. Near-black green ground with
  // a warm lamp bloom, the way the orchid plate is lit from one side.
  orangery: { base: "#14180F", a: "#1F3A28", b: "#C28A28", c: "#556B4A", light: "#D4B99A", grain: 0.06 },

  // Plate 2 — god rays through a wet forest. Cooler, with the shaft
  // doing most of the visible work.
  canopy: { base: "#101A12", a: "#1F3A28", b: "#8FAE83", c: "#556B4A", light: "#F2F0E8", grain: 0.055 },

  // Plate 3 — the Plura cyanotype. The one genuinely cool field in the
  // set; maps onto the site's existing Indigo rather than a new blue.
  cyanotype: { base: "#16202A", a: "#24394D", b: "#7D9BAF", c: "#B5B3AA", light: "#DDE2DC", grain: 0.05 },

  // Plate 4 — jungle depth behind glass cards. Deepest of the set;
  // built to sit under frosted panels, not under bare type.
  understory: { base: "#0E1714", a: "#1F3A28", b: "#5C6B4A", c: "#24394D", light: "#8FAE83", grain: 0.05 },

  // Plate 5 — the warm sunset mountains. The most literally "gradient"
  // reference on the board, and the warmest field here.
  dusk: { base: "#2A1D18", a: "#B85A34", b: "#CD7A4C", c: "#C6A97A", light: "#D4B99A", grain: 0.05 },

  // Plate 6 — frosted glass over backlit leaves.
  verdure: { base: "#18231A", a: "#556B4A", b: "#7D8E52", c: "#8FAE83", light: "#F2F0E8", grain: 0.05 },

  // Plate 7 — the sage plantation editorial. Mid-tone rather than dark;
  // the only field meant to carry dark type as easily as light.
  plantation: { base: "#48553B", a: "#7D8E52", b: "#8FAE83", c: "#B5B3AA", light: "#F2F0E8", grain: 0.04 },

  // Plate 8 — the bone Wanderlust poster. A light field, for the cream
  // chapters that currently read as flat paper.
  wanderlust: { base: "#EDE7DA", a: "#D4B99A", b: "#E8DED0", c: "#C6A97A", light: "#FFFDF7", grain: 0.03 },
};

export type LivingGradientProps = {
  preset?: LivingGradientPreset;
  /** Drop the light shaft on fields where a sweep would fight the content. */
  shaft?: boolean;
  /** Override the preset's grain, 0 to disable. */
  grain?: number;
  /**
   * Layer the drifting colour over existing media instead of replacing
   * it: the opaque base fill and the vignette both drop out, so footage
   * underneath still reads. Use where a section already has approved
   * footage and the wash on top of it is a dead static gradient.
   */
  plain?: boolean;
  /** Field opacity. Lower it when layering over media that must stay legible. */
  opacity?: number;
  className?: string;
};

/**
 * A slow, living background field for a section that would otherwise be
 * a flat colour.
 *
 * Render it as the FIRST child of a `position: relative` section, with
 * the section's real content after it. It deliberately takes no
 * children and never wraps content: wrapping a section's background in
 * anything that can animate to zero opacity is the exact pattern that
 * has made whole sections vanish on this site before, so this component
 * cannot be used that way even by accident.
 */
export function LivingGradient({
  preset = "canopy",
  shaft = true,
  grain,
  plain = false,
  opacity,
  className,
}: LivingGradientProps) {
  const field = FIELDS[preset];
  const grainAmount = grain ?? field.grain;

  const style = {
    "--lg-base": field.base,
    "--lg-a": field.a,
    "--lg-b": field.b,
    "--lg-c": field.c,
    "--lg-light": field.light,
    "--lg-grain": grainAmount,
    ...(opacity === undefined ? null : { opacity }),
  } as CSSProperties;

  return (
    <div
      aria-hidden="true"
      data-living-gradient={preset}
      className={[styles.field, plain ? styles.plain : null, className]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      <div className={`${styles.blob} ${styles.blobA}`} />
      <div className={`${styles.blob} ${styles.blobB}`} />
      <div className={`${styles.blob} ${styles.blobC}`} />
      {shaft ? <div className={styles.shaft} /> : null}
      <div className={styles.vignette} />
      {grainAmount > 0 ? <div className={styles.grain} /> : null}
    </div>
  );
}
