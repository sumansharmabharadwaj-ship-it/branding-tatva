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
  const [folio, setFolio] = useState<number>();

  useEffect(() => {
    const libraryState = readInsightsLibraryState();
    if (libraryState) {
      setHref("/insights#insights-library-scene");
      setFolio(libraryState.folio + 1);
    }
  }, []);

  return (
    <Link
      href={href}
      className={className}
      aria-label={
        folio ? `Return to the Insights library, folio ${folio}` : undefined
      }
    >
      {folio ? `Insights · folio ${folio}` : "Insights"}
    </Link>
  );
}
