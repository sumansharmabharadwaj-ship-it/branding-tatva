import Image from "next/image";
import { ElementGlyph } from "@/components/ElementGlyph";
import { TiltCard } from "@/components/TiltCard";
import { TrackedLink } from "@/components/TrackedLink";
import type { InsightElement, InsightPost } from "@/data/insights";
import type { CSSProperties } from "react";

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
> & {
  frameworkTitle?: string;
  frameworkStepCount?: number;
};

type InsightCardProps = {
  post: InsightCardPost;
  featured?: boolean;
  showReadingOutcome?: boolean;
  readingCue?: string;
  imageOverride?: {
    src: string;
    alt: string;
  };
  tracking: {
    source: "insights_library" | "insights_topic" | "related_insights";
    context?: Record<string, string | number | boolean>;
  };
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

export function InsightCard({
  post,
  featured = false,
  showReadingOutcome = false,
  readingCue,
  imageOverride,
  tracking,
}: InsightCardProps) {
  const color = ELEMENT_COLORS[post.element];
  const topicName = TOPIC_NAMES[post.topicSlug] ?? post.element;

  return (
    <TiltCard glowColor={color} className="h-full">
      <TrackedLink
        href={`/insights/${post.slug}`}
        className={`insight-card group grid h-full overflow-hidden rounded-[1.5rem] border border-soil/10 bg-background-elevated shadow-elevation-sm ${
          showReadingOutcome ? "insight-card--decision-brief" : ""
        } ${
          featured
            ? "lg:grid-cols-[1.15fr_0.85fr]"
            : "grid-rows-[auto_1fr]"
        }`}
        style={
          {
            "--insight-card-accent": color,
          } as CSSProperties
        }
        event="insights_article_selected"
        eventProps={{
          ...tracking.context,
          source: tracking.source,
          article: post.slug,
          path: post.topicSlug,
        }}
      >
        <div
          className={`insight-card__image relative overflow-hidden bg-soil ${
            featured ? "min-h-[18rem] lg:min-h-[25rem]" : "aspect-[16/9]"
          }`}
        >
          <Image
            src={imageOverride?.src ?? post.heroImage}
            alt={imageOverride?.alt ?? post.heroImageAlt}
            fill
            sizes={
              featured
                ? "(min-width: 1024px) 58vw, 100vw"
                : "(min-width: 1024px) 32vw, (min-width: 640px) 50vw, 100vw"
            }
            className="object-cover transition duration-700 ease-earth group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-soil/75 via-soil/5 to-transparent" />
          {readingCue ? (
            <span className="absolute left-4 top-4 w-fit max-w-[58%] rounded-full border border-ivory/20 bg-soil/70 px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.13em] text-ivory shadow-elevation-sm backdrop-blur-md sm:left-5 sm:top-5">
              {readingCue}
            </span>
          ) : null}
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

        <div
          className={`insight-card__body flex flex-col ${
            featured ? "p-6 sm:p-7 lg:p-8" : "p-4"
          }`}
        >
          <time
            dateTime={post.updatedAt}
            className="insight-card__date text-xs font-medium uppercase tracking-[0.16em] text-foreground-secondary"
          >
            {formatDate(post.updatedAt)}
          </time>
          <h3
            className={`insight-card__title font-display font-normal leading-[1.08] text-soil ${
              featured
                ? "mt-3 text-[clamp(1.8rem,3vw,2.75rem)]"
                : "mt-3 line-clamp-2 text-[1.35rem]"
            }`}
          >
            {post.title}
          </h3>
          <p
            className={`insight-card__decision-copy mt-3 text-foreground-secondary ${
              featured
                ? "max-w-xl text-sm leading-6"
                : "line-clamp-2 text-sm leading-6"
            }`}
          >
            {showReadingOutcome && post.keyTakeaways[0] ? (
              <>
                <span className="insight-card__decision-label mr-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-clay">
                  Helps you decide
                </span>
                {post.keyTakeaways[0]}
              </>
            ) : (
              post.excerpt
            )}
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
          {showReadingOutcome && post.frameworkTitle ? (
            <span className="insight-card__footer mt-auto flex items-end justify-between gap-4 pt-4">
              <span className="insight-card__framework min-w-0">
                <span>
                  {post.frameworkStepCount
                    ? `${post.frameworkStepCount}-step framework`
                    : "Framework"}
                </span>
                <strong>{post.frameworkTitle}</strong>
              </span>
              <span className="insight-card__open" style={{ color }}>
                Open <span aria-hidden="true">→</span>
              </span>
            </span>
          ) : (
            <span
              className="mt-auto inline-flex items-center gap-2 pt-4 text-xs font-semibold uppercase tracking-[0.16em] transition-transform duration-300 group-hover:translate-x-1"
              style={{ color }}
            >
              Read the essay <span aria-hidden="true">→</span>
            </span>
          )}
        </div>
      </TrackedLink>
    </TiltCard>
  );
}
