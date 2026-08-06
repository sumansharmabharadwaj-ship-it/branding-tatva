import "./services-scroll-compression.css";
import { ServicesExperienceRuntime } from "./ServicesExperienceRuntime";

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ServicesExperienceRuntime />
    </>
  );
}
