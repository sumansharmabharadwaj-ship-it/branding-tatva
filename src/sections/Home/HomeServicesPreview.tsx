import { BackgroundVideo } from "@/components/BackgroundVideo";
import { PackageSelector } from "@/sections/Services/PackageSelector";

export function HomeServicesPreview() {
  return (
    <section
      id="ways-to-work"
      aria-label="Ways to work with Branding Tatva"
      className="relative flex min-h-svh scroll-mt-24 items-center overflow-hidden bg-soil py-20 sm:py-24"
    >
      <BackgroundVideo
        video="/videos/higgsfield-element-earth.mp4"
        poster="/images/higgsfield-element-earth.jpg"
        imagePosition="50% 45%"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(26,25,21,0.94) 0%, rgba(26,25,21,0.82) 52%, rgba(26,25,21,0.72) 100%), linear-gradient(180deg, rgba(26,25,21,0.34) 0%, rgba(26,25,21,0.9) 100%)",
        }}
      />
      <div className="relative w-full">
        <PackageSelector
          eyebrow="Choose a starting point"
          heading="The work changes with the stage your brand is in."
          description="Choose the situation closest to today. You will see the outcome, scope, and a relevant project file before deciding whether to begin a conversation."
        />
      </div>
    </section>
  );
}
