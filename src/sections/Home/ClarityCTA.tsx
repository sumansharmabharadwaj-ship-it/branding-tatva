import { BackgroundVideo } from "@/components/BackgroundVideo";
import Link from "next/link";

const LENSES = [
  {
    label: "Psychology",
    meaning: "How attention, choice, and memory behave.",
  },
  {
    label: "Literature",
    meaning: "How language creates tone, tension, and recall.",
  },
  {
    label: "Strategy",
    meaning: "How separate decisions reinforce one market position.",
  },
] as const;

// This scene sits directly after verified work. Its job is therefore
// authority, rather than another invitation. The case studies answer
// "can the work create change?" and this bridge answers the next
// question: "what kind of thinking produced those decisions?"
export function ClarityCTA() {
  return (
    <section
      aria-labelledby="thinking-behind-work"
      className="relative overflow-hidden"
      style={{ backgroundColor: "#17140f" }}
    >
      <div className="grid min-h-[46rem] items-stretch lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative z-10 flex items-center px-6 py-20 sm:px-12 sm:py-24 lg:px-16 xl:px-24">
          <div className="max-w-xl">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-sandstone">
              Behind the evidence
            </p>
            <h2
              id="thinking-behind-work"
              className="mt-5 font-display text-[clamp(2.35rem,4.8vw,4.35rem)] font-normal leading-[1.02] text-ivory"
            >
              Results show what changed.
              <span className="mt-2 block italic text-clay">The decisions reveal why.</span>
            </h2>
            <p className="mt-7 max-w-lg text-base leading-relaxed text-ivory/72 sm:text-lg">
              Every project is read through three connected lenses. Together they turn scattered observations into one position people can understand and remember.
            </p>

            <div className="mt-10 border-y border-ivory/12">
              {LENSES.map((lens, index) => (
                <div
                  key={lens.label}
                  className="group grid grid-cols-[2.5rem_1fr] gap-4 border-b border-ivory/10 py-5 last:border-b-0 sm:grid-cols-[3rem_9rem_1fr]"
                >
                  <span className="font-display text-xl text-sandstone/70">0{index + 1}</span>
                  <span className="font-display text-xl text-ivory sm:text-2xl">{lens.label}</span>
                  <span className="col-start-2 text-sm leading-relaxed text-ivory/58 sm:col-start-3">
                    {lens.meaning}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="group mt-9 inline-flex min-h-11 items-center gap-3 rounded-full border border-sandstone/70 px-7 py-3 text-xs font-medium uppercase tracking-[0.18em] text-sandstone transition-colors duration-300 hover:bg-sandstone/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sandstone"
            >
              See how Suman thinks
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>

        <div className="relative min-h-[30rem] lg:min-h-full">
          <BackgroundVideo
            video="/videos/higgsfield-idea-sketch.mp4"
            poster="/images/higgsfield-idea-sketch.jpg"
            imagePosition="center 55%"
            parallax
          />

          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, #17140f 0%, rgba(23,20,15,0.4) 22%, rgba(23,20,15,0.08) 58%, rgba(23,20,15,0.28) 100%)",
            }}
          />

          <div className="absolute inset-x-6 bottom-8 sm:inset-x-10 sm:bottom-10 lg:left-auto lg:right-10 lg:w-[23rem]">
            <div className="rounded-[1.5rem] border border-ivory/18 bg-soil/72 p-5 backdrop-blur-md sm:p-6">
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-sandstone">
                The working principle
              </p>
              <p className="mt-3 font-display text-2xl leading-snug text-ivory sm:text-3xl">
                Observe widely. Decide narrowly. Repeat coherently.
              </p>
              <div className="mt-5 flex items-center gap-3" aria-hidden="true">
                <span className="h-2 w-2 rounded-full bg-sandstone" />
                <span className="h-px flex-1 bg-gradient-to-r from-sandstone/80 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
