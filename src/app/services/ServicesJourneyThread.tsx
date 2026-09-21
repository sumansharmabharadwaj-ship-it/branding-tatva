import {
  BadgeCheck,
  GitBranch,
  Layers3,
  ListChecks,
  Network,
  Route,
  ScanSearch,
  Sparkles,
  Sprout,
} from "lucide-react";

const GLYPHS = [
  { scene: "opening", Icon: Sprout },
  { scene: "situation", Icon: GitBranch },
  { scene: "offerings", Icon: Network },
  { scene: "desire", Icon: Route },
  { scene: "verified-outcome", Icon: BadgeCheck },
  { scene: "authority", Icon: Layers3 },
  { scene: "education", Icon: ScanSearch },
  { scene: "audit", Icon: ListChecks },
  { scene: "book", Icon: Sparkles },
] as const;

/**
 * One continuous, decorative progress signal for the Services journey.
 *
 * The runtime publishes page progress and the active chapter on <html>.
 * The stable line then changes its Lucide symbol to match each chapter's
 * meaning, without adding another autonomous animation loop to the page.
 */
export function ServicesJourneyThread() {
  return (
    <div data-services-journey-thread="true" aria-hidden="true">
      <span data-services-thread-rail="true">
        <span data-services-thread-progress="true" />
      </span>
      <span data-services-thread-focus="true">
        {GLYPHS.map(({ scene, Icon }) => (
          <span key={scene} data-services-thread-glyph={scene}>
            <Icon strokeWidth={1.35} />
          </span>
        ))}
      </span>
    </div>
  );
}
