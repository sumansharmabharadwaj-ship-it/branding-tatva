import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { AmbientElementShader } from "@/components/AmbientElementShader";
import { Fireflies } from "@/components/Fireflies";
import { TexturedDark } from "@/components/TexturedDark";
import { WeakBrandingCost } from "@/sections/Services/WeakBrandingCost";
import { PerceptionLadder } from "@/sections/Services/PerceptionLadder";
import { PackageSelector } from "@/sections/Services/PackageSelector";
import { DeliverablesReveal } from "@/sections/Services/DeliverablesReveal";
import { BrandHealthCheck } from "@/sections/Services/BrandHealthCheck";
import { RiskRemovalFAQ } from "@/sections/Services/RiskRemovalFAQ";
import { StrategySessionPreview } from "@/sections/Services/StrategySessionPreview";
import { StrategyRoomCTA } from "@/sections/Services/StrategyRoomCTA";
import { WorkEngagementMap } from "@/sections/Work/WorkEngagementMap";

export function WorkServicesJourney() {
  return (
    <>
      <section id="mechanism" className="relative scroll-mt-24 overflow-hidden bg-soil py-20 sm:py-28">
        <BackgroundVideo video="/videos/pixabay-roots-stream.mp4" poster="/images/pixabay-roots-stream-poster.jpg" />
        <div className="absolute inset-0 bg-soil/82" />
        <AmbientElementShader opacity={0.11} />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-4 left-0 select-none whitespace-nowrap font-display text-[clamp(3rem,11vw,9rem)] font-bold uppercase leading-none text-ivory/[0.06] sm:-top-8"
        >
          Mechanism
        </span>
        <div className="relative">
          <WeakBrandingCost />
        </div>
      </section>

      <section id="recognition" className="relative scroll-mt-24 overflow-hidden bg-soil">
        <BackgroundVideo video="/videos/higgsfield-lone-pine.mp4" poster="/images/higgsfield-lone-pine-poster.jpg" />
        <div className="absolute inset-0 bg-soil/82" />
        <div className="relative">
          <PerceptionLadder />
        </div>
      </section>

      <section id="services" className="relative scroll-mt-24 overflow-hidden bg-soil py-20 sm:py-28">
        <BackgroundVideo video="/videos/pixabay-emerald-river.mp4" poster="/images/pixabay-emerald-river-poster.jpg" />
        <div className="absolute inset-0 bg-soil/82" />
        <AmbientElementShader opacity={0.12} />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-4 right-0 select-none whitespace-nowrap font-display text-[clamp(3rem,11vw,9rem)] font-bold uppercase leading-none text-ivory/[0.06] sm:-top-8"
        >
          Choose
        </span>
        <div className="relative">
          <PackageSelector />
        </div>
      </section>

      <section id="deliverables" className="relative scroll-mt-24 overflow-hidden bg-background-alt py-20 sm:py-28">
        <div className="paper-grain" aria-hidden="true" />
        <div className="relative">
          <DeliverablesReveal dark={false} />
          <WorkEngagementMap />
        </div>
      </section>

      <section id="health-check" className="relative scroll-mt-24 overflow-hidden bg-soil py-20 sm:py-28">
        <BackgroundVideo video="/videos/higgsfield-forest-stream.mp4" poster="/images/higgsfield-forest-stream-poster.jpg" />
        <div className="absolute inset-0 bg-soil/82" />
        <AmbientElementShader opacity={0.13} />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-4 left-0 select-none whitespace-nowrap font-display text-[clamp(3rem,11vw,9rem)] font-bold uppercase leading-none text-ivory/[0.06] sm:-top-8"
        >
          Check
        </span>
        <div className="relative">
          <BrandHealthCheck />
        </div>
      </section>

      <section id="questions" className="relative scroll-mt-24 overflow-hidden bg-soil py-20 sm:py-28">
        <div className="aurora-glow" aria-hidden="true" />
        <div className="light-rays" aria-hidden="true" />
        <Fireflies />
        <AmbientElementShader opacity={0.14} />
        <Container className="relative max-w-2xl">
          <Reveal>
            <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Risk removal</p>
            <h2 className="mt-2 text-display-sm font-display font-normal text-ivory">Is this the right fit?</h2>
            <p className="mt-4 text-ivory/85">
              Direct answers before you decide whether a first conversation is worthwhile.
            </p>
          </Reveal>
          <div className="mt-8">
            <RiskRemovalFAQ dark />
          </div>
          <div className="mt-16 border-t border-ivory/15 pt-12 sm:mt-20 sm:pt-16">
            <StrategySessionPreview dark />
          </div>
        </Container>
      </section>

      <TexturedDark image="/images/own-golden-branches.jpg" video="/videos/own-golden-branches.mp4" className="py-20 sm:py-28">
        <StrategyRoomCTA />
      </TexturedDark>
    </>
  );
}
