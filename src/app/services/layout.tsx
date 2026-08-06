import type { ReactNode } from "react";
import "./services-scroll-experience.css";
import "./services-scroll-fixes.css";
import { ServicesScrollExperience } from "@/sections/Services/ServicesScrollExperience";

export default function ServicesLayout({ children }: { children: ReactNode }) {
  return (
    <div data-services-scroll-root>
      <ServicesScrollExperience />
      {children}
    </div>
  );
}
