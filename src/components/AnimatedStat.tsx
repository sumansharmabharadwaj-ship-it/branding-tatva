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
  // Starts at the *real* number, not 0. The count-up below is a bonus
  // flourish layered on top if it actually gets to run — it is never
  // the thing that makes this number correct. A version that started
  // at 0 and waited for a rAF loop (even a rAF loop with a setTimeout
  // safety net) to eventually correct it was still wrong by
  // construction: on a long-backgrounded or heavily throttled tab, a
  // browser can suspend rAF *and* delay timers for extended stretches,
  // and during all of that the only real proof-of-work number on this
  // whole page was reading 0%. A stat a visitor is meant to trust
  // can't have a failure mode where the honest answer is "it's wrong
  // until something else fixes it" — so the default render is just the
  // real value, full stop, and the animation can only make it *look*
  // more alive, never make it *be* correct.
  const [display, setDisplay] = useState(parsed?.target ?? 0);

  useEffect(() => {
    if (!parsed || !isInView || prefersReducedMotion) return;
    const target = parsed.target;
    const duration = 1400;
    const start = performance.now();
    let frame: number;
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(target * eased);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setDisplay(target);
      }
    }
    frame = requestAnimationFrame(tick);
    // Belt and braces: if the rAF loop above stalls partway through
    // (rather than never starting at all, which the initial state
    // already covers), this snaps back to the real value shortly after
    // the animation should have finished, independent of whether rAF
    // ever got there itself.
    const settle = setTimeout(() => setDisplay(target), duration + 200);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(settle);
    };
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
