"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/Container";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import {
  servicesFaqCategories,
  servicesFaqs,
  type ServicesFaq,
  type ServicesFaqCategoryId,
} from "@/data/servicesFaqs";
import { track } from "@/lib/analytics";

function FAQItem({
  item,
  prefix,
  open,
  detailOpen,
  reduced,
  onToggle,
  onToggleDetail,
}: {
  item: ServicesFaq;
  prefix: "desktop" | "mobile";
  open: boolean;
  detailOpen: boolean;
  reduced: boolean;
  onToggle: () => void;
  onToggleDetail: () => void;
}) {
  const questionId = `${prefix}-services-faq-question-${item.id}`;
  const answerId = `${prefix}-services-faq-answer-${item.id}`;
  const detailId = `${prefix}-services-faq-detail-${item.id}`;

  return (
    <article
      data-services-faq-item="true"
      data-services-faq-id={item.id}
      data-services-faq-open={open ? "true" : "false"}
      className="border-b border-ivory/12 last:border-b-0"
    >
      <button
        id={questionId}
        type="button"
        aria-expanded={open}
        aria-controls={answerId}
        onClick={onToggle}
        className="group flex min-h-16 w-full items-start justify-between gap-5 rounded-xl px-1 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sandstone"
      >
        <span className="font-display text-lg font-normal leading-snug text-ivory transition-colors group-hover:text-sandstone sm:text-xl">
          {item.question}
        </span>
        <motion.span
          aria-hidden="true"
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: reduced ? 0 : 0.22 }}
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ivory/18 text-lg text-ivory/55 transition-colors group-hover:border-sandstone/55 group-hover:text-sandstone"
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={answerId}
            role="region"
            aria-labelledby={questionId}
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-5 pr-10">
              <p data-faq-direct-answer="true" className="max-w-2xl text-base leading-relaxed text-ivory/88">
                {item.answer}
              </p>

              <button
                type="button"
                aria-expanded={detailOpen}
                aria-controls={detailId}
                onClick={onToggleDetail}
                className="mt-3 inline-flex min-h-11 items-center rounded-full px-1 text-sm text-ivory/58 transition-colors hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
              >
                {detailOpen ? "Close the scope note" : "Read the scope note"}
                <span aria-hidden="true" className="ml-2">{detailOpen ? "↑" : "↓"}</span>
              </button>

              <AnimatePresence initial={false}>
                {detailOpen && (
                  <motion.div
                    id={detailId}
                    data-faq-deep-answer="true"
                    initial={reduced ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? undefined : { opacity: 0, y: -3 }}
                    transition={{ duration: reduced ? 0 : 0.2 }}
                    className="mt-1 max-w-2xl border-l-2 border-sandstone/45 pl-4"
                  >
                    <p className="text-sm leading-relaxed text-ivory/68">{item.detail}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <a
                data-faq-related-link="true"
                href={item.related.href}
                className="link-underline mt-4 inline-flex min-h-11 items-center text-sm text-sandstone transition-colors hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
              >
                {item.related.label}
                <span aria-hidden="true" className="ml-2">→</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

export function ServicesFAQ() {
  const [activeCategory, setActiveCategory] = useState<ServicesFaqCategoryId>(servicesFaqCategories[0].id);
  const [openId, setOpenId] = useState<string | null>(servicesFaqs[0]?.id ?? null);
  const [detailOpenId, setDetailOpenId] = useState<string | null>(null);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const activeItems = useMemo(
    () => servicesFaqs.filter((faq) => faq.category === activeCategory),
    [activeCategory],
  );
  const activeCategoryMeta = servicesFaqCategories.find((category) => category.id === activeCategory);

  function chooseCategory(category: ServicesFaqCategoryId) {
    const first = servicesFaqs.find((faq) => faq.category === category);
    setActiveCategory(category);
    setOpenId(first?.id ?? null);
    setDetailOpenId(null);
    track("capability_selected", {
      page: "services",
      capability: `FAQ: ${category}`,
      source: "services_faq_category",
    });
  }

  function toggleQuestion(item: ServicesFaq) {
    setOpenId((current) => (current === item.id ? null : item.id));
    setDetailOpenId(null);
    track("capability_selected", {
      page: "services",
      capability: `FAQ: ${item.question}`,
      source: "services_faq_question",
    });
  }

  function toggleDetail(item: ServicesFaq) {
    setDetailOpenId((current) => (current === item.id ? null : item.id));
  }

  return (
    <Container className="relative max-w-6xl">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-16">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Practical questions</p>
          <h2 className="mt-2 max-w-xl text-display-sm font-display font-normal text-ivory">
            The details that should feel clear before a call.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ivory/78">
            Direct answers first. Scope notes only where the distinction matters. No universal timeline, unlimited revision promise, or instant quotation disguised as certainty.
          </p>
        </div>

        {/* Desktop: a quiet sticky index changes one compact answer set.
            Mobile below keeps the same questions in natural reading
            order and removes the extra navigation layer entirely. */}
        <div data-services-faq-desktop="true" className="hidden gap-8 lg:grid lg:grid-cols-[14rem_minmax(0,1fr)]">
          <aside className="sticky top-28 self-start">
            <p className="text-[0.62rem] font-medium uppercase tracking-[0.17em] text-ivory/42">Question index</p>
            <div role="tablist" aria-label="Services FAQ categories" className="mt-3 space-y-1.5">
              {servicesFaqCategories.map((category) => {
                const selected = category.id === activeCategory;
                const count = servicesFaqs.filter((faq) => faq.category === category.id).length;
                return (
                  <button
                    key={category.id}
                    id={`services-faq-category-${category.id}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls="services-faq-category-panel"
                    onClick={() => chooseCategory(category.id)}
                    className={`group flex min-h-14 w-full items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone ${
                      selected
                        ? "border-sandstone/50 bg-sandstone/[0.08] text-ivory"
                        : "border-transparent text-ivory/55 hover:border-ivory/12 hover:bg-ivory/[0.035] hover:text-ivory"
                    }`}
                  >
                    <span>
                      <span className="block text-sm">{category.label}</span>
                      <span className="mt-0.5 block text-[0.65rem] leading-snug text-ivory/38">{category.note}</span>
                    </span>
                    <span className="font-display text-sm text-sandstone/75">0{count}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <section
            id="services-faq-category-panel"
            role="tabpanel"
            aria-labelledby={`services-faq-category-${activeCategory}`}
            data-services-faq-category={activeCategory}
            className="rounded-[1.75rem] border border-ivory/12 bg-[rgba(14,18,18,0.46)] px-5 py-4 backdrop-blur-md sm:px-6"
          >
            <div className="border-b border-ivory/10 pb-4">
              <p className="font-display text-2xl font-normal text-ivory">{activeCategoryMeta?.label}</p>
              <p className="mt-1 text-sm text-ivory/50">{activeCategoryMeta?.note}</p>
            </div>
            {activeItems.map((item) => (
              <FAQItem
                key={item.id}
                item={item}
                prefix="desktop"
                open={openId === item.id}
                detailOpen={detailOpenId === item.id}
                reduced={prefersReducedMotion}
                onToggle={() => toggleQuestion(item)}
                onToggleDetail={() => toggleDetail(item)}
              />
            ))}
          </section>
        </div>
      </div>

      <div data-services-faq-mobile="true" className="mt-9 lg:hidden">
        {servicesFaqCategories.map((category) => {
          const items = servicesFaqs.filter((faq) => faq.category === category.id);
          return (
            <section key={category.id} data-services-faq-mobile-category={category.id} className="mt-8 first:mt-0">
              <div className="flex items-end justify-between gap-4 border-b border-ivory/12 pb-3">
                <div>
                  <p className="font-display text-xl font-normal text-ivory">{category.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-ivory/45">{category.note}</p>
                </div>
                <span className="font-display text-sm text-sandstone/70">0{items.length}</span>
              </div>
              {items.map((item) => (
                <FAQItem
                  key={item.id}
                  item={item}
                  prefix="mobile"
                  open={openId === item.id}
                  detailOpen={detailOpenId === item.id}
                  reduced={prefersReducedMotion}
                  onToggle={() => toggleQuestion(item)}
                  onToggleDetail={() => toggleDetail(item)}
                />
              ))}
            </section>
          );
        })}
      </div>
    </Container>
  );
}
