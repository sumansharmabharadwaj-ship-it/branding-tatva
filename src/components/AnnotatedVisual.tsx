import Image from "next/image";

// A photo annotated with dot-and-line callouts instead of another boxed
// card grid — the same "explain a point by pointing at it" technique
// alethia.earth/solutions/nature-based uses on its own hero tree, per
// direct feedback asking for exactly this instead of cards. Two
// callouts only (not three) — matches what that reference actually
// shows on screen at once, and keeps the layout from feeling crowded
// around a single photo. Desktop only for the dot/line treatment;
// mobile stacks the photo then each callout as plain text below it,
// since precise dot positions don't survive a full-width reflow.

export type VisualCallout = {
  dotTop: string;
  dotLeft: string;
  side: "left" | "right";
  title: string;
  text: string;
};

export function AnnotatedVisual({
  image,
  alt,
  callouts,
}: {
  image: string;
  alt: string;
  callouts: [VisualCallout, VisualCallout];
}) {
  const [left, right] = callouts;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="hidden items-center gap-10 md:grid md:grid-cols-[1fr_minmax(20rem,26rem)_1fr]">
        <CalloutText callout={left} />
        <div className="relative aspect-[4/3] w-full">
          <Image src={image} alt={alt} fill sizes="30vw" className="object-contain" />
          <Dot top={left.dotTop} left={left.dotLeft} lineTo="left" />
          <Dot top={right.dotTop} left={right.dotLeft} lineTo="right" />
        </div>
        <CalloutText callout={right} />
      </div>

      <div className="space-y-8 md:hidden">
        <div className="relative mx-auto aspect-[4/3] w-full max-w-sm">
          <Image src={image} alt={alt} fill sizes="90vw" className="object-contain" />
        </div>
        {[left, right].map((c) => (
          <div key={c.title}>
            <p className="font-display text-lg text-soil">{c.title}</p>
            <p className="mt-1 text-sm text-foreground-secondary">{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Dot({ top, left, lineTo }: { top: string; left: string; lineTo: "left" | "right" }) {
  return (
    <span
      aria-hidden="true"
      className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-clay"
      style={{ top, left }}
    >
      <span
        className="absolute top-1/2 h-px bg-clay/50"
        style={{
          width: "3rem",
          [lineTo === "left" ? "right" : "left"]: "100%",
        }}
      />
    </span>
  );
}

function CalloutText({ callout }: { callout: VisualCallout }) {
  return (
    <div className={callout.side === "left" ? "text-right" : "text-left"}>
      <p className="font-display text-lg text-soil">{callout.title}</p>
      <p className="mt-1 text-sm text-foreground-secondary">{callout.text}</p>
    </div>
  );
}
