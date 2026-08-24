"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";

type TrackedLinkProps = Omit<ComponentProps<typeof Link>, "onClick"> & {
  event: AnalyticsEvent;
  eventProps?: Record<string, string | number | boolean>;
};

// A plain link that also reports one named conversion event — lets
// server components (page heroes, closing CTAs) participate in
// measurement without becoming client components themselves.
export function TrackedLink({
  event,
  eventProps,
  ...linkProps
}: TrackedLinkProps) {
  return (
    <Link {...linkProps} onClick={() => track(event, eventProps)} />
  );
}
