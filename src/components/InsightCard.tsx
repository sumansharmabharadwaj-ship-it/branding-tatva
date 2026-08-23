import Image from "next/image";
import Link from "next/link";
import { ElementGlyph } from "@/components/ElementGlyph";
import { TiltCard } from "@/components/TiltCard";
import type { InsightElement, InsightPost } from "@/data/insights";

export type InsightCardPost = Pick<
  InsightPost,
  | "slug"
  | "title"
  | "excerpt"
  | "element"
  | "topicSlug"
  | "updatedAt"
  | "readingTime"
  | "heroImage"
  | "heroImageAlt"
  | "keyTakeaways"
  | "primaryKeyword"
  | "secondaryKeywords"
>;

type InsightCardProps = {
  post: InsightCardPost;
  featured?: boolean;
};

const ELEMENT_COLORS: Record<InsightElement, string> = {
  earth: "#B85A34",
  water: "#24394D",
  fire: "#C28A28",
  air: "#5C6B4A",
  space: "#AD6F5C",
};

const TOPIC_NAMES: Record<string, string> = {
  positioning: "Positioning",
  "customer-experience": "Customer experience",
  "distinctive-brand": "Distinctiveness",
  "brand-messaging": "Messaging",
  "brand-memory": "Brand memory",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function InsightCard({ post, featured = false }: InsightCardProps) {
  const color = ELEMENT_COLORS[post.element];
  const topicName = TOPIC_NAMES[post.topicSlug] ?? post.element;

  return (
    <TiltCard glowColor={color} className="h-full">
      <Link
        href={`/insights/${post.slug}`}
        className={`group grid h-full overflow-hidden rounded-[1.5rem] border border-soil/10 bg-background-elevated shadow-elevation-sm ${
          featured
            ? "lg:grid-cols-[1.15fr_0.85fr]"
            : "grid-rows-[auto_1fr]"
        }`}
      >
        <div
          className={`relative overflow-hidden bg-soil ${
            featured ? "min-h-[18rem] lg:min-h-[25rem]" : "aspect-[16/9]"
          }`}
        >
          <Image
            src={post.heroImage}
            alt={post.heroImageAlt}
            fill
            sizes={
              featured
                ? "(min-width: 1024px) 58vw, 100vw"
                : "(min-width: 1024px) 32vw, (min-width: 640px) 50vw, 100vw"
            }
            className="object-cover transition duration-700 ease-earth group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-soil/75 via-soil/5 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 p-5 text-ivory sm:p-6">
            <span className="inline-flex items-center gap-2 text-[0.65rem] font-medium uppercase tracking-[0.22em]">
              <ElementGlyph
                slug={post.element}
                className="h-4 w-4"
                strokeWidth={1.5}
                style={{ color }}
              />
              {topicName}
            </span>
            <span className="text-xs text-ivory/75">{post.readingTime}</span>
          </div>
        </div>

        <div className={`flex flex-col ${featured ? "p-6 sm:p-7 lg:p-8" : "p-4"}`}>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-foreground-secondary">
            {formatDate(post.updatedAt)}
          </p>
          <h3
            className={`font-display font-normal leading-[1.08] text-soil ${
              featured
                ? "mt-3 text-[clamp(1.8rem,3vw,2.75rem)]"
                : "mt-3 line-clamp-2 text-[1.35rem]"
            }`}
          >
            {post.title}
          </h3>
          <p
            className={`mt-3 text-foreground-secondary ${
              featured
                ? "max-w-xl text-sm leading-6"
                : "line-clamp-2 text-sm leading-6"
            }`}
          >
            {post.excerpt}
          </p>
          {featured && (
            <div className="mt-5 grid gap-2 border-t border-border pt-4">
              {post.keyTakeaways.slice(0, 3).map((takeaway, index) => (
                <p key={takeaway} className="flex gap-3 text-sm leading-6 text-soil/75">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: color }}
                    aria-hidden="true"
                  />
                  <span>
                    <span className="sr-only">Point {index + 1}: </span>
                    {takeaway}
                  </span>
                </p>
              ))}
            </div>
          )}
          <span
            className="mt-auto inline-flex items-center gap-2 pt-4 text-xs font-semibold uppercase tracking-[0.16em] transition-transform duration-300 group-hover:translate-x-1"
            style={{ color }}
          >
            Read the essay <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>
    </TiltCard>
  );
}
