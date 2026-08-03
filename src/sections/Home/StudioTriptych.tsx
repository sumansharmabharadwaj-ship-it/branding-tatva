import { KenBurnsImage } from "@/components/KenBurnsImage";
import Link from "next/link";

// Suman's layout reference: the studio as a triptych — a dark quote
// card, a cream centre carrying the three pillars, and the working
// pinboard on the right. Replaces the floating-hotspot treatment; the
// three pillars say what the hotspots used to hide behind hover, and
// every claim here is one this practice already makes elsewhere.
const PILLARS = [
  {
    label: "Strategic thinking",
    line: "Rooted in psychology",
    icon: (
      <>
        <path d="M20 10c-3 0-5 2-5 4 -3 0-5 2-5 5 0 2 1 4 3 5 0 3 2 5 5 5 1 0 2 0 2-1V10z" />
        <path d="M20 10c3 0 5 2 5 4 3 0 5 2 5 5 0 2-1 4-3 5 0 3-2 5-5 5-1 0-2 0-2-1" />
      </>
    ),
  },
  {
    label: "Storytelling",
    line: "Crafted with purpose",
    icon: (
      <>
        <path d="M12 28l3-9 11-11 6 6-11 11-9 3z" />
        <path d="M24 10l6 6" />
      </>
    ),
  },
  {
    label: "Design intelligence",
    line: "Clarity in every detail",
    icon: (
      <>
        <circle cx="16" cy="20" r="7" />
        <circle cx="24" cy="20" r="7" />
        <circle cx="20" cy="14" r="7" />
      </>
    ),
  },
];

export function StudioTriptych() {
  return (
    <section className="grid items-stretch lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_minmax(0,1fr)]" style={{ backgroundColor: "#F2F0E8" }}>
      {/* The quote card — the practice's own argument, stated plainly. */}
      <div className="flex items-center p-8 lg:p-10">
        <div className="w-full rounded-2xl p-8" style={{ backgroundColor: "#1B1B1B" }}>
          <span aria-hidden="true" className="font-display text-4xl leading-none" style={{ color: "#C6A97A" }}>
            &ldquo;
          </span>
          <p className="mt-3 font-display text-xl font-normal leading-snug text-ivory">
            A brand is what people feel when they meet it, rather than what it says about itself.
          </p>
          <span aria-hidden="true" className="mt-6 block h-px w-12" style={{ backgroundColor: "#C6A97A" }} />
        </div>
      </div>

      {/* The centre: who runs the studio, and the three disciplines. */}
      <div className="px-6 py-14 text-center sm:px-10">
        <p className="text-xs font-medium uppercase tracking-[0.25em]" style={{ color: "#8a6b3d" }}>
          About Suman
        </p>
        <h2 className="mt-3 font-display text-[clamp(1.9rem,3.4vw,2.9rem)] font-normal text-soil">
          Strategy. Story. Soul.
        </h2>
        <span aria-hidden="true" className="mt-4 flex items-center justify-center gap-3">
          <span className="h-px w-12" style={{ backgroundColor: "#C6A97A" }} />
          <svg viewBox="0 0 24 20" className="h-4 w-5" fill="none" style={{ color: "#C6A97A" }}>
            <path d="M12 19V6M12 6C12 6 9 1 4 1c0 5 4 6 8 5zM12 6c0 0 3-5 8-5 0 5-4 6-8 5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="h-px w-12" style={{ backgroundColor: "#C6A97A" }} />
        </span>
        <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-foreground-secondary sm:text-base">
          A studio built on psychology, storytelling, and design thinking.
        </p>

        <ul className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-0">
          {PILLARS.map((p, i) => (
            <li key={p.label} className={`px-4 ${i > 0 ? "sm:border-l sm:border-soil/15" : ""}`}>
              <svg viewBox="0 0 40 40" className="mx-auto h-9 w-9" fill="none" stroke="#8a6b3d" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
                {p.icon}
              </svg>
              <p className="mt-4 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-soil">{p.label}</p>
              <p className="mt-1 text-sm text-foreground-secondary">{p.line}</p>
            </li>
          ))}
        </ul>

        <Link
          href="/about"
          className="link-underline mt-10 inline-flex items-center gap-2 text-sm font-medium"
          style={{ color: "#8a6b3d" }}
        >
          Explore the studio <span aria-hidden="true">→</span>
        </Link>
      </div>

      {/* The working wall. */}
      <div className="relative min-h-[18rem] lg:min-h-full">
        {/* Was a static fill image, the only motionless panel in the
            triptych. KenBurnsImage gives it the same slow drift the rest
            of the site's photography carries, and skips it entirely under
            reduced motion. */}
        <KenBurnsImage
          image="/images/own-portrait.jpg"
          gradient="linear-gradient(to top, rgba(20,18,16,0.30), rgba(20,18,16,0))"
          imagePosition="center 30%"
          className="absolute inset-0 h-full w-full"
          sizes="(min-width: 1024px) 25vw, 100vw"
        />
      </div>
    </section>
  );
}
