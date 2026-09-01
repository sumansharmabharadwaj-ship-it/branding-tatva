import type { ReactNode } from "react";
import "./services-scroll-compression.css";
import "./services-discipline-journey.css";
import "./services-anchor-contract.css";
import "./services-luminous-clarity.css";
import "./services-journey-thread.css";
import { ServicesExperienceRuntime } from "./ServicesExperienceRuntime";
import { ServicesMediaDirector } from "./ServicesMediaDirector";
import { ServicesJourneyThread } from "./ServicesJourneyThread";

export default function ServicesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ServicesJourneyThread />
      <ServicesMediaDirector />
      <ServicesExperienceRuntime />
    </>
  );
}
