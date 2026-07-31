"use client";

import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";

// Direct feedback wanted the visitor to feel invested before the
// booking calendar appears. Every line below describes the actual
// mechanism already built on this site (the same brand-stage, priority,
// and focus questions StrategyRoomCTA itself asks; the same "twenty
// minutes, no pitch deck" framing already established) — a preview of
// something real, not a new promise invented for this section alone.
const STEPS = [
  "You describe where the brand stands today, in your own words.",
  "I ask direct questions about positioning, audience, and where recognition is actually falling short.",
  "You get honest feedback either way, no sales pitch.",
  "If it makes sense to continue, we agree on what the first thirty days would actually look like.",
] as const;

// `dark` — see RiskRemovalFAQ's own comment; both moved off the light
// bg-background-alt tier together.
export function StrategySessionPreview({ dark = false }: { dark?: boolean }) {
  return (
    <Container className="max-w-2xl">
      <Reveal>
        <p className={`text-sm font-medium uppercase tracking-wide ${dark ? "text-sandstone" : "text-action-secondary"}`}>
          Before you book
        </p>
        <h2 className={`mt-2 text-display-sm font-display font-normal ${dark ? "text-ivory" : "text-soil"}`}>
          What actually happens on the call.
        </h2>
      </Reveal>
      <ol className="mt-8 space-y-5">
        {STEPS.map((step, i) => (
          <Reveal key={step} delay={i * 0.08}>
            <li className="flex items-start gap-4">
              <span className={`pt-0.5 font-display text-2xl font-normal leading-none ${dark ? "text-ivory/25" : "text-soil/25"}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className={dark ? "text-ivory/75" : "text-foreground-secondary"}>{step}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </Container>
  );
}
