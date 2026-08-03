import { BackgroundVideo } from "@/components/BackgroundVideo";
import Link from "next/link";

// Suman's layout reference (Aug 2026): a hard vertical split, never a
// centered block floating on full bleed video. Left is a dark panel
// carrying the question and the single action; right is the desk
// itself, uncropped and lit. The two halves meet on a clean edge, so
// the photo reads as evidence of the work rather than wallpaper behind
// the words.
export function ClarityCTA() {
  return (
    <section className="relative grid items-stretch lg:grid-cols-2" style={{ backgroundColor: "#141210" }}>
      <div className="flex items-center px-6 py-16 sm:py-24 sm:px-12 lg:px-16 lg:py-24 xl:px-24">
        <div className="max-w-md">
          <p className="text-xs font-medium uppercase tracking-[0.25em]" style={{ color: "#C6A97A" }}>
            Need clarity?
          </p>
          <h2 className="mt-5 font-display text-[clamp(2rem,4.2vw,3.4rem)] font-normal leading-[1.08] text-ivory">
            Unsure which scope fits?
          </h2>
          <span aria-hidden="true" className="mt-6 block h-px w-16" style={{ backgroundColor: "#C6A97A" }} />
          <p className="mt-6 text-sm leading-relaxed text-ivory/75 sm:text-base">
            Twenty minutes settles it.
            <br />
            Honest feedback either way.
          </p>
          <Link
            href="/contact"
            className="group mt-8 inline-flex items-center gap-3 rounded-full border px-7 py-3 text-xs font-medium uppercase tracking-[0.18em] transition-colors duration-300 hover:bg-[#C6A97A]/10"
            style={{ borderColor: "rgba(198,169,122,0.8)", color: "#C6A97A" }}
          >
            Discuss the right scope
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>

      <div className="relative min-h-[22rem] lg:min-h-[34rem]">
        {/* The desk was a frozen photo next to a decision the visitor
            is being asked to make. It now moves: the same frame, drifting
            slowly, so the right half reads as a room rather than a print. */}
        <BackgroundVideo
          video="/videos/higgsfield-idea-sketch.mp4"
          poster="/images/higgsfield-idea-sketch.jpg"
          imagePosition="center 55%"
          parallax
        />
        {/* The seam: the dark panel dissolves a short way into the photo
            so the split reads as one frame rather than two images. */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 hidden w-32 lg:block"
          style={{ backgroundImage: "linear-gradient(90deg, #141210 0%, transparent 100%)" }}
        />
      </div>
    </section>
  );
}
