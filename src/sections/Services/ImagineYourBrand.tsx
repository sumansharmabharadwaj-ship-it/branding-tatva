"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import {
  SITUATIONS,
  CHANGES,
  JOURNEY_STAGES,
  DIAGNOSTICS,
  CHANGE_INSIGHTS,
  RECOMMENDED_CHANGE,
  baseDeliverableCount,
  buildProjectMap,
  type SituationId,
  type ChangeId,
} from "@/lib/recommendationEngine";
import { WaystoneField, type Waystone } from "@/components/motion/WaystoneField";
import { deliverables } from "@/data/deliverables";
import { packages } from "@/data/services";
import { usePricing } from "@/components/PricingProvider";
import { formatPrice } from "@/data/pricing";
import { track } from "@/lib/analytics";
import { motionTokens } from "@/lib/motionTokens";

// Imagine Your Brand — the signature builder (conversion rebuild §17).
// Two honest choices produce a personalized project map: the journey
// stages this path emphasises, the strategic questions it raises, the
// real deliverables it draws on, and the real package with the
// visitor's own regional figure. The entire map renders on screen
// BEFORE any email is requested; the capture only offers a copy, it
// never gates the value. Zero timeline estimates — the site's FAQ
// promises a real timeline after discovery, and this keeps that
// promise.
type Status = "idle" | "submitting" | "sent" | "error";

// Every waystone teaches in one line before it gets selected — the
// marker as an information object rather than a button label. Counts
// are real, computed from the engine's own deliverable maps.
const SITUATION_TEACH: Record<SituationId, string> = {
  launching: "Before anything gets designed.",
  repositioning: "When the old story reads wrong.",
  inconsistent: "When growth multiplied the voices.",
  "new-market": "When the category speaks a new code.",
  founder: "When the thinking is the product.",
  marketing: "When reach outruns recognition.",
};

const CHANGE_TEACH: Record<ChangeId, string> = {
  position: "One idea, owned.",
  recognition: "Known with the logo covered.",
  messaging: "Sentences only you would say.",
  identity: "Every surface, one meaning.",
  website: "Notice, understand, act.",
  "content-system": "Repetition that compounds.",
};

const SITUATION_STONES: Waystone[] = SITUATIONS.map((s) => ({
  id: s.id,
  title: s.label,
  teach: SITUATION_TEACH[s.id],
  meta: `${baseDeliverableCount(s.id)} deliverables on this path`,
}));

const CHANGE_STONES: Waystone[] = CHANGES.map((c) => ({
  id: c.id,
  title: c.label,
  teach: CHANGE_TEACH[c.id],
}));

export function ImagineYourBrand() {
  const [situation, setSituation] = useState<SituationId | null>(null);
  const [change, setChange] = useState<ChangeId | null>(null);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [business, setBusiness] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const prefersReducedMotion = useHydratedReducedMotion();
  const { region } = usePricing();

  const map = situation && change ? buildProjectMap(situation, change) : null;
  const pkg = map ? packages.find((p) => p.slug === map.packageSlug) : null;
  const mapDeliverables = map
    ? map.deliverableIds.map((id) => deliverables.find((d) => d.id === id)).filter((d) => d != null)
    : [];

  function pickSituation(id: SituationId) {
    if (situation === null) track("imagine_your_brand_started");
    setSituation(id);
    if (change) track("imagine_your_brand_completed", { situation: id, change });
  }

  function pickChange(id: ChangeId) {
    setChange(id);
    if (situation) track("imagine_your_brand_completed", { situation, change: id });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent || status === "submitting" || !situation || !change) return;
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName,
          business: business || undefined,
          consent,
          source: "project-map",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      track("project_map_emailed", { situation, change });
      setStatus("sent");
    } catch {
      setError("The server was unreachable. Check your connection and try again.");
      setStatus("error");
    }
  }

  return (
    <Container className="max-w-6xl">
      <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Imagine your brand</p>
      <h2 className="mt-2 max-w-2xl text-display-sm font-display font-normal text-ivory">
        What could this look like inside your business?
      </h2>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-ivory/85">
        Two choices build your project map: the journey, the questions it raises, the deliverables it draws on, and
        the path that fits.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-ivory/60">01 · Your situation</p>
          <div className="mt-3">
            <WaystoneField
              stones={SITUATION_STONES}
              activeId={situation}
              onSelect={(id) => pickSituation(id as SituationId)}
              ariaLabel="Your situation"
            />
          </div>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-ivory/60">02 · The change you want</p>
          <div className="mt-3">
            {/* Once a situation is placed, the change this practice
                would usually recommend first carries a quiet marker —
                grounded in that situation's own diagnostic root cause,
                never pretend intelligence. */}
            <WaystoneField
              stones={CHANGE_STONES}
              activeId={change}
              onSelect={(id) => pickChange(id as ChangeId)}
              ariaLabel="The change you want"
              recommendedId={situation && !change ? RECOMMENDED_CHANGE[situation] : null}
            />
          </div>
        </div>
      </div>

      <div aria-live="polite" className="mt-10 min-h-[200px]">
        <AnimatePresence mode="wait">
          {map && pkg ? (
            <motion.div
              key={`${situation}-${change}`}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0 }}
              transition={{ duration: motionTokens.durationBase, ease: motionTokens.easeOrganic }}
              className="grid gap-8 rounded-2xl border border-ivory/15 p-6 backdrop-blur-md sm:p-8 lg:grid-cols-[1.3fr_1fr]"
              style={{ backgroundColor: "rgba(244,239,230,0.05)" }}
            >
              <div>
                {/* The first consultation before the consultation: the
                    map arrives as eight observations written in
                    sequence, the way a strategist would talk through a
                    desk, rather than a spec sheet appearing at once.
                    Pattern language throughout ("usually", "may") —
                    honest observation of the situation type, never a
                    claim about this visitor's specific business.
                    Reduced motion renders every beat instantly. */}
                {(() => {
                  const diag = DIAGNOSTICS[situation!];
                  const beats: { label: string; body: React.ReactNode }[] = [
                    { label: "What businesses in this situation usually struggle with", body: <p className="text-sm leading-relaxed text-ivory/90">{diag.struggle}</p> },
                    {
                      label: "The symptoms this pattern produces",
                      body: (
                        <ul className="space-y-1.5">
                          {diag.symptoms.map((sym) => (
                            <li key={sym} className="text-sm leading-relaxed text-ivory/85 before:mr-2 before:content-['·']">{sym}</li>
                          ))}
                        </ul>
                      ),
                    },
                    { label: "What customers may currently perceive", body: <p className="text-sm leading-relaxed text-ivory/90">{diag.perception}</p> },
                    { label: "The likely root cause", body: <p className="text-sm leading-relaxed text-ivory/90">{diag.rootCause}</p> },
                    {
                      label: "Where Branding Tatva would begin",
                      body: (
                        <ol className="flex flex-wrap items-center gap-y-2">
                          {JOURNEY_STAGES.map((stage, i) => {
                            const active = map.stages.includes(i);
                            return (
                              <li key={stage} className="flex items-center">
                                <span
                                  className={`rounded-full border px-2.5 py-1 text-xs transition-colors duration-500 ${
                                    active ? "border-sandstone/70 text-ivory" : "border-ivory/12 text-ivory/35"
                                  }`}
                                  style={active ? { backgroundColor: `${pkg.color}33` } : undefined}
                                >
                                  {stage}
                                </span>
                                {i < JOURNEY_STAGES.length - 1 && (
                                  <span aria-hidden="true" className="mx-1 text-ivory/25">→</span>
                                )}
                              </li>
                            );
                          })}
                        </ol>
                      ),
                    },
                    {
                      label: "The decisions that follow",
                      body: (
                        <ul className="space-y-2">
                          {map.questions.map((q) => (
                            <li key={q} className="text-sm leading-relaxed text-ivory/90">{q}</li>
                          ))}
                        </ul>
                      ),
                    },
                    {
                      label: "What you would actually receive",
                      body: (
                        <div className="flex flex-wrap gap-2">
                          {mapDeliverables.map((d) => (
                            <span key={d.id} className="rounded-2xl border border-ivory/20 px-3 py-1.5 text-xs text-ivory/85">{d.name}</span>
                          ))}
                        </div>
                      ),
                    },
                    {
                      label: "How this influences recognition, marketing, and growth",
                      body: (
                        <div className="space-y-2">
                          <p className="text-sm italic leading-relaxed text-sandstone/90">{CHANGE_INSIGHTS[change!]}</p>
                          {map.marketingLayer && (
                            <p className="text-sm leading-relaxed text-ivory/75">Optional marketing layer: {map.marketingLayer}</p>
                          )}
                        </div>
                      ),
                    },
                  ];
                  return (
                    <div className="space-y-5">
                      {beats.map((beat, i) => (
                        <motion.div
                          key={beat.label}
                          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10, filter: "blur(6px)", rotate: -0.3 }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)", rotate: 0 }}
                          transition={{
                            duration: motionTokens.durationBase,
                            delay: prefersReducedMotion ? 0 : 0.25 + i * 0.4,
                            ease: motionTokens.easeOrganic,
                          }}
                          className="border-l-2 border-sandstone/40 pl-4"
                        >
                          <p className="flex items-baseline gap-2 text-[0.62rem] font-medium uppercase tracking-[0.18em] text-ivory/55">
                            <span className="font-display text-xs text-sandstone/80" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                            {beat.label}
                          </p>
                          <div className="mt-1.5">{beat.body}</div>
                        </motion.div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              <div className="border-t border-ivory/12 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-ivory/60">The path that fits</p>
                <p className="mt-2 font-display text-2xl font-normal text-ivory">{pkg.name}</p>
                <p className="mt-1 text-sm text-ivory/70">
                  {pkg.billing === "monthly" ? "from " : "Projects begin at "}
                  <span className="text-ivory">{formatPrice(region, map.packageSlug)}</span>
                  {pkg.billing === "monthly" && "/mo"}
                </p>
                <p className="mt-3 border-l-2 border-sandstone/40 pl-3 text-xs leading-relaxed text-ivory/75">
                  {DIAGNOSTICS[situation!].why}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-ivory/60">
                  A real timeline follows the discovery conversation, scoped to your situation rather than a generic
                  estimate.
                </p>
                <div className="mt-4">
                  <LinkButton href="#book" trackEvent="contextual_cta_clicked" trackProps={{ source: "imagine_your_brand" }}>
                    Discuss this project map
                  </LinkButton>
                </div>

                {status === "sent" ? (
                  <p className="mt-6 border-t border-ivory/12 pt-5 text-sm leading-relaxed text-ivory/85">
                    A copy is on its way to {email} once you confirm the signup. The map stays right here either way.
                  </p>
                ) : (
                  <form onSubmit={submit} className="mt-6 border-t border-ivory/12 pt-5">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-ivory/60">
                      Email this project map to me
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <input
                        type="text"
                        required
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        autoComplete="given-name"
                        aria-label="First name"
                        className="border-b border-ivory/25 bg-transparent pb-2 text-sm text-ivory outline-none transition-colors placeholder:text-ivory/40 focus:border-sandstone"
                      />
                      <input
                        type="email"
                        required
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        aria-label="Email"
                        className="border-b border-ivory/25 bg-transparent pb-2 text-sm text-ivory outline-none transition-colors placeholder:text-ivory/40 focus:border-sandstone"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Business name, optional"
                      value={business}
                      onChange={(e) => setBusiness(e.target.value)}
                      autoComplete="organization"
                      aria-label="Business name, optional"
                      className="mt-3 w-full border-b border-ivory/25 bg-transparent pb-2 text-sm text-ivory outline-none transition-colors placeholder:text-ivory/40 focus:border-sandstone"
                    />
                    <label className="mt-4 flex items-start gap-2.5 text-xs leading-relaxed text-ivory/75">
                      <input
                        type="checkbox"
                        required
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-0.5 h-3.5 w-3.5 accent-[#D4B99A]"
                      />
                      <span>I agree to receive the map and occasional branding insights. One click unsubscribes.</span>
                    </label>
                    {error && <p className="mt-3 text-xs text-terracotta">{error}</p>}
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="mt-4 rounded-full border border-sandstone/60 px-5 py-2 text-sm text-sandstone transition-colors duration-300 hover:bg-sandstone/10 disabled:opacity-60"
                    >
                      {status === "submitting" ? "Sending…" : "Email my project map"}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-ivory/60">
              Pick a situation and a change. The map appears here, in full, before anything asks for your email.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </Container>
  );
}
