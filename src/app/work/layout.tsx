import type { ReactNode } from "react";
import { WorkRouteAccessibilityRuntime } from "./WorkRouteAccessibilityRuntime";
import "./work-mobile-index.css";

export default function WorkLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <WorkRouteAccessibilityRuntime />
      {children}
    </>
  );
}
