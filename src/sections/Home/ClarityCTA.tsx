import Link from "next/link";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { Magnetic } from "@/components/Magnetic";
import { TexturedDark } from "@/components/TexturedDark";

// Suman's board, scene one: the decision moment. The CTA stops being
// a button on a background and becomes a scene at the desk — the open
// notebook footage, the question, and a handwritten aside promising
// what the call actually is. Board copy kept verbatim where she
// authored it ("Let's look at your brand together. No pitch. Just
// clarity."). The button is magnetic on pointer devices via the
// existing Magnetic primitive; touch and reduced motion get the same
// link without the pull.
export function ClarityCTA() {
  return (
    <TexturedDark
      image="/images/higgsfield-idea-sketch.jpg"
      video="/videos/higgsfield-idea-sketch.mp4"
      imagePosition="center 60%"
      className="py-20 sm:py-28"
    >
      <Container className="max-w-5xl">
        <div className="grid items-center gap-12 sm:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-sandstone">Need clarity?</p>
            <h2 className="mt-3 max-w-md font-display text-display-sm font-normal leading-[1.08] text-ivory">
              Not sure which scope is right yet?
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/80">
              Twenty minutes settles it. Honest feedback either way.
            </p>
            <div className="mt-7">
              <Magnetic>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border px-6 py-2.5 text-sm font-medium uppercase tracking-[0.14em] transition-colors duration-300 hover:bg-[#C6A97A]/10"
                  style={{ borderColor: "rgba(198,169,122,0.75)", color: "#C6A97A" }}
                >
                  Discuss the right scope <span aria-hidden="true">→</span>
                </Link>
              </Magnetic>
            </div>
          </Reveal>

          {/* The handwritten aside — the human voice in the margin,
              set in the serif italic the site already owns. */}
          <Reveal delay={0.15}>
            <div className="relative -rotate-3 justify-self-center sm:justify-self-end">
              <p className="max-w-[15rem] font-display text-2xl italic leading-snug text-ivory/90" style={{ textShadow: "0 1px 12px rgba(20,17,14,0.7)" }}>
                Let&apos;s look at your brand together. No pitch. Just clarity.
              </p>
              <svg
                aria-hidden="true"
                viewBox="0 0 80 40"
                className="mt-3 h-8 w-16 text-ivory/60"
                fill="none"
              >
                <path d="M4 6 C 30 34, 52 36, 72 22 M72 22 l-9 -2 M72 22 l-3 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
          </Reveal>
        </div>
      </Container>
    </TexturedDark>
  );
}
