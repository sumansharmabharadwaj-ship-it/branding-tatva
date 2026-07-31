"use client";

import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { AmbientElementShader } from "@/components/AmbientElementShader";

// "Education" objection — why premium-reading brands look different.
// Reframed from the brief's literal "looks expensive / feels expensive"
// ladder (trips the banned-adjective list — "expensive," close enough
// to "premium," reads as the exact agency-cliché register this site's
// copy standard exists to avoid) into the site's own established
// recognition/mental-availability vocabulary. Sits on the one Three.js
// ambient shader moment (AmbientElementShader) as a quiet backdrop —
// color and light, not literal 3D objects.
const RUNGS = [
  { label: "Unknown", text: "Zero recall, zero association. Where every brand starts." },
  { label: "Recognized", text: "Seen enough times to register. Still replaceable by the next thing seen." },
  { label: "Remembered", text: "Recalled without being shown again. Mental availability doing its actual job." },
  { label: "Preferred", text: "The default choice, decided before any comparison even starts." },
] as const;

export function PerceptionLadder() {
  return (
    <div className="relative overflow-hidden bg-soil py-20 sm:py-28">
      <AmbientElementShader opacity={0.16} />
      <Container className="relative max-w-2xl">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Education</p>
          <h2 className="mt-2 text-display-sm font-display font-normal text-ivory">
            Why some brands look different.
          </h2>
          <p className="mt-4 text-ivory/75">
            A position on the same ladder every brand climbs, deliberately or by accident.
          </p>
        </Reveal>

        <div className="mt-12 space-y-8 border-l-2 border-ivory/15 pl-6 sm:pl-8">
          {RUNGS.map((rung, i) => (
            <Reveal key={rung.label} delay={i * 0.1}>
              <p className="font-display text-xl font-normal text-ivory sm:text-2xl">{rung.label}</p>
              <p className="mt-1 text-sm text-ivory/70 sm:text-base">{rung.text}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  );
}
