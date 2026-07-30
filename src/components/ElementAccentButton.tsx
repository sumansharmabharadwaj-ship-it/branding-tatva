"use client";

import { LinkButton } from "./Button";
import { useCurrentElement } from "@/lib/currentElement";

// A LinkButton themed to the current month's element color instead of
// the sitewide flat clay-orange — direct feedback that every button in
// the footer/nav read as the same boring orange (or white) no matter
// what. Footer itself stays a server component; this is the one small
// client boundary that needs the current-date hook.
export function ElementAccentButton({ href, children }: { href: string; children: React.ReactNode }) {
  const element = useCurrentElement();
  return (
    <LinkButton href={href} style={{ backgroundColor: element.color }}>
      {children}
    </LinkButton>
  );
}
