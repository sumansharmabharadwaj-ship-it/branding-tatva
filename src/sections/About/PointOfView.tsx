import Link from "next/link";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { projects } from "@/data/projects";

// About redesign, chapter two: the practice's point of view as three
// claims, each tied to a real engagement rather than abstract theory —
// the execution brief's own requirement. Every project line renders
// from data/projects.ts.
const CLAIMS = [
  {
    claim: "Perception precedes preference.",
    detail:
      "People decide what a brand is long before they decide whether they want it. HerbalCart sold sports supplements while buyers saw a herbal remedy shop; until that perception was reset, every product page fought the category in the buyer's head.",
    slug: "herbalcart",
  },
  {
    claim: "Language frames value.",
    detail:
      "The same marketplace described as cheap access reads disposable; described through craft and origin, it carries a story a buyer can resell. MyShopInEurope's entire repositioning turned on that single verbal choice.",
    slug: "myshopineurope",
  },
  {
    claim: "Consistency creates memory.",
    detail:
      "Dr. Haley Nutrition posted 48% less and earned 104% more followers per post. Memory rewards one position repeated with discipline, far more than volume.",
    slug: "dr-haley-nutrition",
  },
] as const;

export function PointOfView() {
  return (
    <Container className="max-w-6xl">
      <Reveal>
        <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Point of view</p>
        <h2 className="mt-2 max-w-2xl text-display-sm font-display font-normal text-ivory">
          Three claims this practice stakes its work on.
        </h2>
      </Reveal>
      <div className="mt-12 grid gap-10 lg:grid-cols-3">
        {CLAIMS.map((item, i) => {
          const project = projects.find((p) => p.slug === item.slug);
          return (
            <Reveal key={item.slug} delay={i * 0.09}>
              <div className="flex h-full flex-col border-t border-ivory/15 pt-6">
                <p className="font-display text-sm text-ivory/40" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-display text-2xl font-normal leading-snug text-ivory">{item.claim}</h3>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-ivory/85">{item.detail}</p>
                {project && (
                  <Link
                    href={`/work/${project.slug}`}
                    className="link-underline mt-5 inline-flex items-center gap-2 text-sm text-sandstone transition-colors duration-300 hover:text-ivory"
                  >
                    {project.title} <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>
    </Container>
  );
}
