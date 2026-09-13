import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type ContactKineticHeadingProps = Omit<
  ComponentPropsWithoutRef<"h2">,
  "children"
> & {
  lines: readonly [string, string, string];
  resolveClassName: string;
};

/**
 * Contact's shared editorial headline: premise, tension, resolution.
 * The visible phrases are split for transform-only scroll choreography while
 * aria-label keeps the heading's spoken reading natural and uninterrupted.
 */
export function ContactKineticHeading({
  lines,
  resolveClassName,
  className,
  "aria-label": ariaLabel,
  ...headingProps
}: ContactKineticHeadingProps) {
  return (
    <h2
      {...headingProps}
      aria-label={ariaLabel ?? lines.join(" ")}
      data-contact-kinetic-heading
      data-contact-scene-heading
      className={className}
    >
      <span aria-hidden="true" data-contact-heading-stack>
        <span data-contact-heading-line="lead">{lines[0]}</span>
        <span data-contact-heading-line="body">{lines[1]}</span>
        <em
          data-contact-heading-line="resolve"
          className={cn("font-normal", resolveClassName)}
        >
          {lines[2]}
        </em>
      </span>
    </h2>
  );
}
