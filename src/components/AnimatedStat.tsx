"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

// Counts up from 0 to the real value once scrolled into view, instead of
// the number just sitting there static. Parses "104%", "1,350%", "2.81%"
// generically (prefix / numeric / suffix, preserving decimal precision
// and thousands separators) rather than hardcoding a format, since the
// case-study stats aren't uniform.

function parseStat(value: string) {
  const match = value.match(/^([^\d]*)([\d,]+\.?\d*)([^\d]*)$/);
  if (!match) return null;
  const [, prefix, numberPart, suffix] = match;
  const decimals = numberPart.includes(".") ? numberPart.split(".")[1].length : 0;
  const target = parseFloat(numberPart.replace(/,/g, ""));
  if (Number.isNaN(target)) return null;
  return { prefix, suffix, decimals, target };
}

function formatNumber(n: number, decimals: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function AnimatedStat({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();
  const parsed = parseStat(value);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!parsed || !isInView) return;
    if (prefersReducedMotion) {
      setDisplay(parsed.target);
      return;
    }
    const duration = 1400;
    const start = performance.now();
    let frame: number;
    function tick(now: number) {
      if (!parsed) return;
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(parsed.target * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, parsed, prefersReducedMotion]);

  if (!parsed) {
    return <span ref={ref}>{value}</span>;
  }

  return (
    <span ref={ref}>
      {parsed.prefix}
      {formatNumber(display, parsed.decimals)}
      {parsed.suffix}
    </span>
  );
}
