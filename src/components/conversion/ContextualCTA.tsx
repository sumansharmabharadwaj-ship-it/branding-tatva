import { LinkButton } from "@/components/Button";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Container } from "@/components/Container";
import type { AnalyticsEvent } from "@/lib/analytics";

// The one shared conversion block the CTA strategy calls for (§24 /
// Scroll OS §19): soft, medium, and strong CTAs are copy and
// destination choices, not different components — one block, three
// intents. Placed after a specific piece of progress (a capability
// selection, a deliverables read, a diagnosis), never repeated
// section after section. Tracking runs through the site's existing
// analytics vocabulary (src/lib/analytics.ts) so every click lands in
// the same funnel as the rest of the site rather than a parallel event
// system.
export function ContextualCTA({
  eyebrow,
  heading,
  body,
  href,
  label,
  event,
  eventProps,
  tone = "dark",
  video,
  poster,
  imagePosition = "center",
}: {
  eyebrow?: string;
  heading: string;
  body?: string;
  href: string;
  label: string;
  event: AnalyticsEvent;
  eventProps?: Record<string, string | number | boolean>;
  tone?: "dark" | "light";
  video?: string;
  poster?: string;
  imagePosition?: string;
}) {
  const dark = tone === "dark";
  return (
    <section className="relative overflow-hidden py-14 sm:py-20" style={{ backgroundColor: dark ? "#171A17" : "#F2F0E8" }}>
      {video && poster && (
        <>
          <BackgroundVideo video={video} poster={poster} imagePosition={imagePosition} push />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background: dark
                ? "linear-gradient(110deg, rgba(12,18,14,0.94), rgba(16,26,20,0.78) 50%, rgba(10,15,12,0.91))"
                : "linear-gradient(110deg, rgba(242,240,232,0.96), rgba(242,240,232,0.82) 50%, rgba(242,240,232,0.94))",
            }}
          />
        </>
      )}
      <Container className="relative max-w-3xl text-center">
        {eyebrow && (
          <p
            className="text-xs font-medium uppercase tracking-[0.2em]"
            style={{ color: dark ? "#C6A97A" : "#7D8E52" }}
          >
            {eyebrow}
          </p>
        )}
        <h2
          className="mt-2 font-display text-2xl font-normal sm:text-3xl"
          style={{ color: dark ? "#F2F0E8" : "#1B1B1B" }}
        >
          {heading}
        </h2>
        {body && (
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed" style={{ color: dark ? "#F2F0E8CC" : "#3A3A3A" }}>
            {body}
          </p>
        )}
        <div className="mt-6">
          <LinkButton href={href} trackEvent={event} trackProps={eventProps}>
            {label}
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
