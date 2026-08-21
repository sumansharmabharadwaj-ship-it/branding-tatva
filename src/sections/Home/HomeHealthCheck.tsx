import { BackgroundVideo } from "@/components/BackgroundVideo";
import { BrandHealthCheck } from "@/sections/Services/BrandHealthCheck";

export function HomeHealthCheck() {
  return (
    <section
      id="brand-health-check"
      aria-label="Brand health check"
      className="relative flex min-h-svh scroll-mt-24 items-center overflow-hidden bg-soil py-20 sm:py-24"
    >
      <BackgroundVideo
        video="/videos/cinematic-waterlight.mp4"
        poster="/images/cinematic-waterlight-poster.jpg"
        imagePosition="50% 52%"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(16,21,26,0.96) 0%, rgba(16,21,26,0.84) 54%, rgba(16,21,26,0.62) 100%), linear-gradient(180deg, rgba(16,21,26,0.28) 0%, rgba(16,21,26,0.9) 100%)",
        }}
      />
      <div className="relative w-full">
        <BrandHealthCheck resultHref="/work#services" />
      </div>
    </section>
  );
}
