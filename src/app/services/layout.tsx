import type { ReactNode } from "react";
import "./services-scroll-compression.css";
import "./services-discipline-journey.css";
import { ServicesExperienceRuntime } from "./ServicesExperienceRuntime";

export default function ServicesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ServicesExperienceRuntime />
    </>
  );
}
