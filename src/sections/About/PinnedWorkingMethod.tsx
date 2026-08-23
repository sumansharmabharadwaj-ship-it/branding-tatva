"use client";

import Image from "next/image";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { ClipReveal } from "@/components/ClipReveal";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { experience } from "@/data/about";

// "Working method" + "Recent experience" — portrait, method text and
// the experience list all shown together, nothing sequential.
//
// This used to be wrapped in PinnedHold. The pinning budget says one
// immersive held sequence per key page, and the test for whether a pin
// earns its scroll is whether each held viewport reveals something new.
// This one never did: it stopped the page dead on a beat the visitor
// had already finished reading, which is the cost of a pin with none of
// the payoff. It now sits in normal flow and the About page keeps its
// one real held sequence for the closing meadow.
export function PinnedWorkingMethod() {
  return <WorkingMethodSection />;
}

function WorkingMethodSection({ pinned = false }: { pinned?: boolean }) {
  return (
    <section
      className={`relative flex overflow-hidden bg-soil ${pinned ? "min-h-screen items-center" : "py-20 sm:py-28"}`}
    >
      <BackgroundVideo video="/videos/higgsfield-redwood-canopy.mp4" poster="/images/higgsfield-redwood-canopy-poster.jpg" />
      <div className="absolute inset-0 bg-soil/80" />
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
          <div className="grid gap-10 sm:grid-cols-2 sm:gap-12">
            <Reveal delay={0.1}>
              <div>
                <h2 className="text-display-sm font-display font-normal text-ivory">
                  Working method
                </h2>
                <p className="mt-4 text-ivory/85">
                  I start by asking what a business believes, who it is
                  actually speaking to, and where its current story stops
                  making sense. Design begins only after that decision is clear.
                </p>
                <p className="mt-4 text-ivory/85">
                  Branding Tatva is a personal practice, so every project keeps
                  my direct attention from diagnosis through delivery.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div>
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
              </div>
            </Reveal>
          </div>
        </Container>
      </ClipReveal>
    </section>
  );
}
