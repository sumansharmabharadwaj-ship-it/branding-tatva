"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { CHANNEL_FAMILIES, BUSINESS_TYPES } from "@/data/marketingChannels";
import { track } from "@/lib/analytics";
import { WORK } from "@/sections/Work/palette";
import { motionTokens } from "@/lib/motionTokens";
import { WaystoneField, type Waystone } from "@/components/motion/WaystoneField";

// Business type waystones: one teaching line each, and the real count
// of channels in that architecture from the data itself.
const TYPE_TEACH: Record<string, string> = {
  "founder-service": "Authority earns the enquiry.",
  "consumer-product": "The shelf and the feed alike.",
  hospitality: "Found with intent, felt on arrival.",
  wellness: "Trust builds through teaching.",
  b2b: "Long decisions reward documents.",
  local: "Found nearby, remembered weekly.",
};

const TYPE_STONES: Waystone[] = BUSINESS_TYPES.map((t) => ({
  id: t.id,
  title: t.label,
  teach: TYPE_TEACH[t.id] ?? "",
  meta: `${t.channelIds.length} channels in this architecture`,
}));

// The marketing ecosystem explorer (conversion rebuild §11) — proof
// that the practice understands how a brand system reaches people.
// The visitor selects a business type; the seven channel families
// reorder and illuminate into that type's architecture, each family
// carrying its purpose, its typical outputs, and an honest delivery
// label. Illustrative strategy throughout: zero growth predictions,
// zero fabricated numbers. Accessible: pressed states, aria live,
// everything visible without hover, reduced motion switches states
// instantly.
export function MarketingEcosystem() {
  const [typeId, setTypeId] = useState(BUSINESS_TYPES[0].id);
  const prefersReducedMotion = useHydratedReducedMotion();
  const type = BUSINESS_TYPES.find((t) => t.id === typeId) ?? BUSINESS_TYPES[0];

  function pick(id: string) {
    setTypeId(id);
    track("channel_strategy_viewed", { businessType: id });
  }

  const ordered = [
    ...type.channelIds.map((id) => CHANNEL_FAMILIES.find((c) => c.id === id)).filter((c) => c != null),
    ...CHANNEL_FAMILIES.filter((c) => !type.channelIds.includes(c.id)),
  ];

  return (
    <section className="py-16 sm:py-24" style={{ backgroundColor: WORK.forest }}>
      <Container className="max-w-6xl">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.2em]" style={{ color: WORK.sage }}>
            Marketing proof
          </p>
          <h2 className="mt-2 max-w-2xl font-display text-display-sm font-normal text-white">
            A brand system earns value when people repeatedly encounter it.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed" style={{ color: "rgba(242,240,232,0.75)" }}>
            Choose a business type; the channel architecture reorders around it. Illustrative strategy, stated with
            honest delivery boundaries.
          </p>
        </Reveal>

        <div className="mt-8">
          <WaystoneField
            stones={TYPE_STONES}
            activeId={typeId}
            onSelect={pick}
            ariaLabel="Business type"
          />
        </div>

        <p aria-live="polite" className="mt-5 max-w-xl border-l-2 pl-4 text-sm leading-relaxed" style={{ borderColor: WORK.sand, color: "rgba(242,240,232,0.85)" }}>
          {type.rationale}
        </p>

        <div className="mt-8">
          {ordered.map((family) => {
            const rank = type.channelIds.indexOf(family.id);
            const lit = rank > -1;
            return (
              <motion.div
                key={family.id}
                layout={prefersReducedMotion ? false : "position"}
                transition={{ duration: motionTokens.durationBase, ease: motionTokens.easeOrganic }}
                className="border-t py-5"
                style={{ borderColor: "rgba(143,174,131,0.2)", opacity: lit ? 1 : 0.45 }}
              >
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  {lit && (
                    <span className="font-display text-sm" style={{ color: WORK.sand }} aria-hidden="true">
                      {String(rank + 1).padStart(2, "0")}
                    </span>
                  )}
                  <p className="font-display text-xl font-normal text-white sm:text-2xl">{family.name}</p>
                  <span className="rounded-full border px-2.5 py-0.5 text-[0.62rem] uppercase tracking-[0.12em]" style={{ borderColor: "rgba(198,169,122,0.5)", color: WORK.sand }}>
                    {family.label}
                  </span>
                </div>
                {lit && (
                  <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_1.2fr] sm:gap-8">
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(242,240,232,0.85)" }}>
                      {family.purpose}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(242,240,232,0.6)" }}>
                      {family.outputs.join(" · ")}
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
          <div className="h-px" style={{ backgroundColor: "rgba(143,174,131,0.2)" }} aria-hidden="true" />
        </div>
      </Container>
    </section>
  );
}
