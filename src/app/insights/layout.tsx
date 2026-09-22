import type { Metadata } from "next";
import type { ReactNode } from "react";
import { site } from "@/data/site";

export const metadata: Metadata = {
  alternates: {
    types: {
      "application/rss+xml": `${site.url}/insights/feed.xml`,
    },
  },
};

export default function InsightsLayout({ children }: { children: ReactNode }) {
  return children;
}
