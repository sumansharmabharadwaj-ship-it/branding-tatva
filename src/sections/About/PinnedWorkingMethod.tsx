"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { ClipReveal } from "@/components/ClipReveal";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { PinnedHold } from "@/components/PinnedHold";
import { experience } from "@/data/about";

// "Working method" + "Recent experience" — a single beat (portrait,
// method text, and the experience list all shown together, nothing
// sequential), so it fits PinnedHold directly rather than needing the
// full multi-stage crossfade machinery. The section's own
// overflow-hidden (kept for the redwood-canopy video) is safe to wrap
// here — it's PinnedHold's sticky child that would break under an
// overflow-hidden ANCESTOR, not the other way around; this section's
// own overflow-hidden is a descendant of the sticky wrapper, not an
// ancestor of it.
export function PinnedWorkingMethod() {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <WorkingMethodSection />;
  }

  return (
    <>
      <div className="hidden sm:block">
        <PinnedHold>
          <WorkingMethodSection pinned />
        </PinnedHold>
      </div>
      <div className="sm:hidden">
        <WorkingMethodSection />
      </div>
    </>
  );
}

function WorkingMethodSection({ pinned = false }: { pinned?: boolean }) {
  return (
    <section
      className={`relative flex overflow-hidden bg-soil ${pinned ? "min-h-screen items-center" : "py-20"}`}
    >
      <BackgroundVideo video="/videos/higgsfield-redwood-canopy.mp4" poster="/images/higgsfield-redwood-canopy-poster.jpg" />
      <div className="absolute inset-0 bg-soil/60" />
      <ClipReveal className="w-full">
        <Container className="relative grid gap-12 md:grid-cols-[auto_1fr]">
          <Reveal>
            <Image
              src="/images/own-portrait.jpg"
              alt="Suman Sharma"
              width={480}
              height={480}
              priority
              className="aspect-square w-40 rounded-full object-cover sm:w-48"
            />
          </Reveal>
          <div className="grid gap-12 sm:grid-cols-2">
            <Reveal delay={0.1}>
              <h2 className="text-display-sm font-display font-normal text-ivory">
                Working method
              </h2>
              <p className="mt-4 text-ivory/75">
                I start by asking what
                a business believes, who it&apos;s actually speaking to,
                and where its current story stops making sense, well
                before any mood board enters the room. The
                elemental system, earth, water, fire, air, space, is how I
                keep track of which part of that is solved and which
                still needs work.
              </p>
              <p className="mt-4 text-ivory/75">
                I use &ldquo;I&rdquo; instead of &ldquo;we.&rdquo; Branding
                Tatva is a personal practice, and every project has my
                direct attention.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <h2 className="text-display-sm font-display font-normal text-ivory">
                Recent experience
              </h2>
              <ul className="mt-4 space-y-4">
                {experience.map((role) => (
                  <li key={`${role.org}-${role.period}`} className="border-l-2 border-ivory/30 pl-4">
                    <p className="font-medium text-ivory">{role.role}</p>
                    <p className="text-sm text-ivory/70">
                      {role.org} &middot; {role.period}
                    </p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </ClipReveal>
    </section>
  );
}
