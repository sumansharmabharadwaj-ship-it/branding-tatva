"use client";

import dynamic from "next/dynamic";

// SparkCursor adds zero value to first paint — it's a cosmetic
// system-cursor replacement that only matters once someone actually
// moves the mouse. Code-splitting it out of the main bundle via
// next/dynamic (ssr: false) means its JS fetches and executes in the
// background instead of competing with the critical-path work that
// actually determines LCP. dynamic() with ssr: false has to live in a
// Client Component — layout.tsx itself is a Server Component, hence
// this one-line wrapper instead of calling dynamic() there directly.
const SparkCursor = dynamic(() => import("./SparkCursor").then((m) => m.SparkCursor), {
  ssr: false,
});

export function DeferredCursor() {
  return <SparkCursor />;
}
