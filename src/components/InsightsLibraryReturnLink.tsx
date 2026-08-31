"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readInsightsLibraryState } from "@/lib/insights-library-state";

export function InsightsLibraryReturnLink({
  className,
}: {
  className?: string;
}) {
  const [href, setHref] = useState("/insights");

  useEffect(() => {
    if (readInsightsLibraryState()) {
      setHref("/insights#insights-library-scene");
    }
  }, []);

  return (
    <Link href={href} className={className}>
      Insights
    </Link>
  );
}
