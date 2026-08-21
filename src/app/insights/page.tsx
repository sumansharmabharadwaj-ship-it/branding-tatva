import type { Metadata } from "next";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Insights",
  description: "Original field notes on brand strategy, recognition, clarity, and the systems that make brands memorable.",
  alternates: { canonical: "/insights" },
  openGraph: {
    title: `Insights | ${site.name}`,
    description: "Original field notes on brand strategy, recognition, clarity, and the systems that make brands memorable.",
    type: "website",
  },
};

export { default } from "../blog/page";
