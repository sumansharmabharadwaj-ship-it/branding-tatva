import { BackgroundVideo } from "@/components/BackgroundVideo";

// Suman's direction, Aug 2026: "create a dedicated content slot system
// rather than tightly coupling the layout to today's media." Every
// section that wants footage declares a named slot; the slot renders
// the film when one has been approved and placed, and renders nothing
// at all when the slot is still empty. A section never depends on a
// particular file existing, so commissioned or newly approved footage
// drops in as a data edit and the layout stays untouched either way.
//
// The empty state is deliberately nothing rather than a placeholder
// image: a grey box announcing missing media reads as a broken page,
// while a section that simply sits on its own ground reads as designed.

export type SlotFill = {
  video: string;
  poster: string;
  /** Where the footage sits in frame, e.g. "center 60%". */
  position?: string;
  /** Kept with the asset so provenance survives the handoff. */
  credit?: string;
};

export function MediaSlot({
  fill,
  scrim = 0.82,
  parallax = true,
}: {
  fill?: SlotFill;
  /** How hard the section's own ground sits over the footage. */
  scrim?: number;
  parallax?: boolean;
}) {
  if (!fill) return null;

  return (
    <>
      <BackgroundVideo
        video={fill.video}
        poster={fill.poster}
        imagePosition={fill.position ?? "center"}
        parallax={parallax}
      />
      <div aria-hidden="true" className="absolute inset-0" style={{ backgroundColor: `rgba(20,18,16,${scrim})` }} />
    </>
  );
}
