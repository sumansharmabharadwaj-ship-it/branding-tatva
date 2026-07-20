"use client";

import { motion, useReducedMotion } from "framer-motion";

// Honest placeholder, not filled with invented quotes. Real client
// testimonials go here once collected; see the outreach note in
// PROJECT_PLAN.md. Fabricating attributed quotes would be a fake-review
// problem, not just a content gap, so this stays empty on purpose until
// real ones exist. A slow breathing pulse on the quote mark is the only
// concession to motion — enough to read as an intentional, waiting
// space rather than a dead one, without pretending there's content here.

export function Testimonials() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="flex items-center gap-4 rounded-lg border border-dashed border-border bg-background-alt px-6 py-5">
      <motion.p
        className="font-display text-3xl italic text-soil/25"
        animate={prefersReducedMotion ? undefined : { opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        &ldquo;
      </motion.p>
      <p className="text-sm font-medium uppercase tracking-wide text-foreground-secondary/70">
        Client quotes, coming soon
      </p>
    </div>
  );
}
