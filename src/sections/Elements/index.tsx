"use client";

import { VerticalUnfold } from "./VerticalUnfold";
import type { Element } from "@/data/elements";

export function ElementsSection({ elements }: { elements: Element[] }) {
  return (
    <div className="overflow-x-hidden">
      <VerticalUnfold elements={elements} />
    </div>
  );
}
