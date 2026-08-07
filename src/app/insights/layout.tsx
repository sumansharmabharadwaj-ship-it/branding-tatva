import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  alternates: {
    types: {
      "application/rss+xml": "/insights/rss.xml",
    },
  },
};

export default function InsightsLayout({ children }: { children: ReactNode }) {
  return children;
}
