"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import Link from "next/link";
import { useInView } from "framer-motion";
import styles from "./PackageSelector.module.css";
import { PackageComparisonDeck } from "@/sections/Services/PackageComparisonDeck";
import { packages } from "@/data/services";
import { projects } from "@/data/projects";
import { track } from "@/lib/analytics";
import { usePricing } from "@/components/PricingProvider";
import { RegionSelector } from "@/components/RegionSelector";
import { formatPrice, type PackageSlug } from "@/data/pricing";
import {
  SERVICES_SITUATION_EVENT,
  SERVICES_SITUATION_STORAGE_KEY,
  PACKAGE_TO_SITUATION,
  SITUATION_TO_PACKAGE,
  SITUATION_TO_PROOF_SLUG,
  isServicesSituation,
  publishServicesSituation,
  readCompletedHomeDiagnosis,
  servicesContactHref,
  type ServicesSituationDetail,
  type ServicesSituationId,
} from "@/lib/servicesJourney";

// Three choices map to the three real packages. The carried diagnosis and
// explicit choices determine the recommendation; scrolling keeps it intact.
const CHOICES = [
  { slug: "brand-beginning", label: "Launching a new business", shortLabel: "Idea", element: "earth" },
  { slug: "brand-clarity", label: "Repositioning an established business", shortLabel: "Reposition", element: "water" },
  { slug: "brand-partnership", label: "Stopping drift across channels", shortLabel: "Ongoing", element: "space" },
] as const;

type SelectionSource = "situation" | "manual" | null;
export function PackageSelector() {
  // Start with a complete recommendation and keep it in view until chosen.
  const [active, setActive] = useState<PackageSlug | null>(CHOICES[0].slug);
  const [selectionSource, setSelectionSource] = useState<SelectionSource>(null);
  const [compare, setCompare] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const choiceRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const inView = useInView(rootRef, { once: true, amount: 0.15 });
  const [routeReady, setRouteReady] = useState(false);
  const prefersReducedMotion = useHydratedReducedMotion();
  const activePackage = packages.find((pkg) => pkg.slug === active);
  const { region } = usePricing();

  useEffect(() => {
    function applySituation(situation: ServicesSituationId) {
      setActive(SITUATION_TO_PACKAGE[situation]);
      setSelectionSource("situation");
      setCompare(false);
      setExpanded(false);
    }

    function applyLinkedPackage() {
      const hash = window.location.hash.replace(/^#/, "");
      const linkedChoice = CHOICES.find(
        (choice) => `package-${choice.slug}` === hash,
      );

      if (!linkedChoice) return false;

      const linkedSituation = PACKAGE_TO_SITUATION[linkedChoice.slug];
      setActive(linkedChoice.slug);
      setSelectionSource("manual");
      setCompare(false);
      setExpanded(false);
      publishServicesSituation(linkedSituation, "services_package");
      return true;
    }

    if (!applyLinkedPackage()) {
      try {
        const saved = window.localStorage.getItem(SERVICES_SITUATION_STORAGE_KEY);
        const savedSituation = isServicesSituation(saved)
          ? saved
          : readCompletedHomeDiagnosis();
        if (savedSituation) applySituation(savedSituation);
      } catch {}
    }

    // The server renders Foundation as the useful no-JS fallback. Keep that
    // default visually neutral until the browser has had one synchronous pass
    // to resolve a linked or saved route, so returning visitors never see the
    // wrong recommendation flash before their actual package appears.
    setRouteReady(true);

    function onSituation(event: Event) {
      const detail = (event as CustomEvent<ServicesSituationDetail>).detail;
      if (!detail || !isServicesSituation(detail.situation)) return;
      if (detail.origin === "services_package") return;
      applySituation(detail.situation);
    }

    function onHashChange() {
      applyLinkedPackage();
    }

    window.addEventListener(SERVICES_SITUATION_EVENT, onSituation);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener(SERVICES_SITUATION_EVENT, onSituation);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  function choosePackage(slug: PackageSlug) {
    const situation = PACKAGE_TO_SITUATION[slug];
    setActive(slug);
    setSelectionSource("manual");
    setExpanded(false);
    setCompare(false);
    publishServicesSituation(situation, "services_package");
    track("package_viewed", { package: slug, situation, source: "manual" });
  }

  function handleChoiceKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % CHOICES.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + CHOICES.length) % CHOICES.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = CHOICES.length - 1;
    else return;
    event.preventDefault();
    choiceRefs.current[next]?.focus({ preventScroll: true });
    choosePackage(CHOICES[next].slug);
  }

  return (
    <div
      ref={rootRef}
      data-engagement-selector="true"
      data-package-route-ready={routeReady ? "true" : "false"}
      data-section-jump-yield="true"
      data-animate={inView && !prefersReducedMotion}
      aria-busy={!routeReady}
      className={`container-page ${styles.root}`}
    >
      <header className={styles.heading}>
        <p>Ways to work</p>
        <h2>Three engagements. Different decisions.</h2>
        <p className={styles.intro}>Choose your condition. See the scope and starting price.</p>
      </header>

      <div role="group" aria-label="Choose a package route" className={styles.choices}>
        {CHOICES.map((choice, index) => (
          <button
            ref={(node) => { choiceRefs.current[index] = node; }}
            key={choice.slug}
            id={`package-${choice.slug}`}
            type="button"
            aria-pressed={routeReady && active === choice.slug}
            aria-controls="package-recommendation"
            onClick={() => choosePackage(choice.slug)}
            onKeyDown={(event) => handleChoiceKey(event, index)}
            className={styles.choice}
          >
            <span aria-hidden="true">0{index + 1}</span>
            <strong>{choice.shortLabel}</strong>
            <small>{choice.label}</small>
          </button>
        ))}
      </div>

      <div className={styles.controls}>
        <RegionSelector />
        <button
          type="button"
          aria-pressed={compare}
          aria-controls="package-recommendation"
          onClick={() => {
            if (!compare) track("packages_compared");
            setCompare(!compare);
            setExpanded(false);
          }}
        >
          {compare ? "Return to selection" : "Compare all three"}
          <span aria-hidden="true">{compare ? "↩" : "↔"}</span>
        </button>
      </div>

      <p className={styles.selection} role="status">
        {selectionSource === "manual"
          ? "Your choice carries into the examples and booking brief."
          : selectionSource === "situation"
            ? "Your earlier choice is selected. Every engagement is here to compare."
            : "Select the condition closest to your business."}
      </p>

      <div id="package-recommendation" className={styles.recommendation}>
        {compare ? (
          <div className={styles.comparison}>
            <PackageComparisonDeck
              region={region}
              initialPackage={activePackage?.slug as PackageSlug | undefined}
            />
          </div>
        ) : (
          <div className={styles.cardStack}>
            {packages.map((pkg) => {
              const isActive = active === pkg.slug;
              const situation = PACKAGE_TO_SITUATION[pkg.slug as PackageSlug];
              const proof = projects.find((project) => project.slug === SITUATION_TO_PROOF_SLUG[situation]);
              return (
                <article
                  key={pkg.slug}
                  aria-hidden={!isActive}
                  inert={!isActive}
                  data-active={isActive}
                  data-engagement-card={pkg.slug}
                  className={styles.card}
                  aria-labelledby={`engagement-${pkg.slug}`}
                >
                  <div className={styles.summary}>
                    <p className={styles.eyebrow}>Selected engagement</p>
                    <h3 id={`engagement-${pkg.slug}`}>{pkg.name}</h3>
                    <p className={styles.price}>
                      <span>From</span>
                      <strong>{formatPrice(region, pkg.slug as PackageSlug)}</strong>
                      {pkg.billing === "monthly" && <span>/ month</span>}
                    </p>
                    <p className={styles.quotation}>Final quotation follows the discovery call.</p>
                    <p className={styles.description}>{pkg.description}</p>
                    {proof && <Link className={styles.proof} href={`/work/${proof.slug}`}>Project record: {proof.title} <span aria-hidden="true">↗</span></Link>}
                  </div>
                  <div className={styles.scope}>
                    <p className={styles.eyebrow}>Included scope</p>
                    <ol className={styles.inclusions}>
                      {pkg.includes.slice(0, 3).map((item, index) => (
                        <li key={item} style={{ "--scope-index": index } as CSSProperties}>
                          <span aria-hidden="true">0{index + 1}</span><span>{item}</span>
                        </li>
                      ))}
                    </ol>
                    <details
                      open={isActive && expanded}
                      onToggle={(event) => {
                        if (isActive) setExpanded(event.currentTarget.open);
                      }}
                      className={styles.more}
                    >
                      <summary>View all {pkg.includes.length} inclusions <span aria-hidden="true">+</span></summary>
                      <ol start={4} className={styles.inclusions}>
                        {pkg.includes.slice(3).map((item, index) => (
                          <li key={item}><span aria-hidden="true">0{index + 4}</span><span>{item}</span></li>
                        ))}
                      </ol>
                    </details>
                    <Link className={styles.start} href={servicesContactHref(pkg.slug as PackageSlug)}>
                      Start with {pkg.name}<span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <details className={styles.disclaimer}>
        <summary>Pricing notes <span aria-hidden="true">+</span></summary>
        <p>Prices are localised by market and shown in the selected currency. Final scope and quotation are confirmed
          after the discovery conversation. Taxes and third party production, media, printing, development, travel or
          licensing are listed separately where relevant.</p>
      </details>
    </div>
  );
}
