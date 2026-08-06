"use client";

import Link from "next/link";
import { track, type AnalyticsEvent } from "@/lib/analytics";

// A plain link that also reports one named conversion event — lets
// server components (page heroes, closing CTAs) participate in
// measurement without becoming client components themselves.
export function TrackedLink({
  href,
  event,
  eventProps,
  className,
  children,
}: {
  href: string;
  event: AnalyticsEvent;
  eventProps?: Record<string, string | number | boolean>;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={className} onClick={() => track(event, eventProps)}>
      {children}
    </Link>
  );
}
