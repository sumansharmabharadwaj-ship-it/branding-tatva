import Image from "next/image";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { LinkButton } from "@/components/Button";

// Suman's board, scene five: the final invitation written inside the
// notebook instead of floating on flat color. The desk scene runs
// bright (the same sketch world the site opens its trust beat with, so
// the page's story ends where the thinking happens), and the booking
// line sits on a paper card angled like a page left open. Board copy
// kept verbatim.
export function NotebookClose() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <Image
        src="/images/higgsfield-idea-sketch.jpg"
        alt=""
        fill
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center 55%" }}
      />
      {/* Brightened, warm read — the closing room is lit, never dim. */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(244,239,230,0.42) 0%, rgba(244,239,230,0.18) 45%, rgba(39,34,30,0.38) 100%)",
        }}
      />
      <Container className="relative max-w-3xl">
        <Reveal>
          <div
            className="mx-auto max-w-xl -rotate-1 rounded-2xl border border-soil/10 px-8 py-10 text-center shadow-elevation-lg sm:px-12"
            style={{ backgroundColor: "rgba(250,247,240,0.94)" }}
          >
            <p className="font-display text-2xl italic leading-snug text-soil sm:text-3xl">
              The next documented decision could be about your brand.
            </p>
            <p className="mt-3 font-display text-lg italic text-foreground-secondary">
              Let&apos;s create clarity together.
            </p>
            <div className="mt-7">
              <LinkButton href="/contact" trackEvent="hero_booking_click" trackProps={{ page: "about", position: "notebook_close" }}>
                Book a Brand Strategy Session
              </LinkButton>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
