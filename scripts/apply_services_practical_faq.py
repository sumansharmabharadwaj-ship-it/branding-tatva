from __future__ import annotations

from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected one match, found {count}")
    return text.replace(old, new, 1)


def update_services_page() -> None:
    path = Path("src/app/services/page.tsx")
    text = path.read_text()

    text = replace_once(
        text,
        'import { BrandHealthCheck } from "@/sections/Services/BrandHealthCheck";\n',
        'import { BrandHealthCheck } from "@/sections/Services/BrandHealthCheck";\nimport { ServicesFAQ } from "@/sections/Services/ServicesFAQ";\nimport { servicesFaqs } from "@/data/servicesFaqs";\n',
        "Services FAQ imports",
    )

    text = replace_once(
        text,
        '  { href: "#health", label: "Health check" },\n  { href: "#audit", label: "Questions" },\n  { href: "#book", label: "Book a call" },',
        '  { href: "#health", label: "Health check" },\n  { href: "#questions", label: "Questions" },\n  { href: "#audit", label: "Recognition audit" },\n  { href: "#book", label: "Book a call" },',
        "Services chapter index",
    )

    text = replace_once(
        text,
        '''  const region = isRegion(savedRegion) ? savedRegion : regionFromCountry(hdrs.get("x-vercel-ip-country"));
  // The hero poster is the page's first paint''',
        '''  const region = isRegion(savedRegion) ? savedRegion : regionFromCountry(hdrs.get("x-vercel-ip-country"));
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: servicesFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: `${faq.answer} ${faq.detail}`,
      },
    })),
  };
  // The hero poster is the page's first paint''',
        "Services FAQ structured data",
    )

    text = replace_once(
        text,
        '''    <>
      <Header transparent />''',
        '''    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData).replace(/</g, "\\u003c") }}
      />
      <Header transparent />''',
        "Services FAQ schema script",
    )

    old = '''          <SceneHandoff color="#171A17" />
        </section>

        {/* The Brand Recognition Audit — the site's one secondary lead
            asset, placed right after the health check so a visitor who'''

    new = '''          <SceneHandoff color="#171A17" />
        </section>

        {/* Practical questions are the risk-removal chapter the page
            architecture always called for. No looping media competes
            with the answers: a quiet stone-and-grid field lets visitors
            resolve scope, process, investment, collaboration, and
            aftercare before the recognition-audit lead magnet. */}
        <section
          id="questions"
          data-services-scene="questions"
          className="relative scroll-mt-24 overflow-hidden py-20 sm:py-24 lg:flex lg:min-h-[100svh] lg:items-center"
          style={{ backgroundColor: MOOD.stone }}
        >
          <SceneVeil color="#171A17" heightClass="h-[12vh]" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-45"
            style={{
              backgroundImage:
                "radial-gradient(circle at 18% 16%, rgba(228,217,180,0.08), transparent 28%), linear-gradient(rgba(244,239,230,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(244,239,230,0.025) 1px, transparent 1px)",
              backgroundSize: "auto, 42px 42px, 42px 42px",
            }}
          />
          <div className="relative w-full">
            <ServicesFAQ />
          </div>
          <SceneHandoff color="#171A17" />
        </section>

        {/* The Brand Recognition Audit — the site's one secondary lead
            asset, placed after the practical questions so a visitor who'''

    text = replace_once(text, old, new, "Services FAQ section insertion")
    path.write_text(text)


def update_gate() -> None:
    path = Path("scripts/services_page_gate.cjs")
    text = path.read_text()

    text = replace_once(
        text,
        '  "health",\n  "audit",',
        '  "health",\n  "questions",\n  "audit",',
        "Services FAQ section ID",
    )

    # Insert immediately before the Audit contract rather than matching
    # the preceding Health Check screenshot line. The compact Health
    # Check wraps that screenshot inside a desktop branch, while the
    # original diagnostic kept it at top level. The Audit comment is the
    # stable commercial boundary shared by both source generations.
    anchor = '''  // Audit: desktop keeps the useful checks and consent form together.'''

    faq_audit = '''  // Practical FAQ: desktop uses a sticky category index and one compact
  // category panel. Mobile removes that extra navigation layer and keeps
  // all nine questions in one linear accordion. Only one answer is open
  // at a time, the direct answer appears first, and deeper scope detail
  // plus a related path remain optional.
  const questions = page.locator("#questions");
  await scrollTo(page, questions, `${label}/questions`);
  const desktopFaq = questions.locator('[data-services-faq-desktop="true"]');
  const mobileFaq = questions.locator('[data-services-faq-mobile="true"]');

  if (viewport.width < 1024) {
    assert((await visibleCount(desktopFaq)) === 0, `${label}: desktop FAQ index remains visible on mobile`);
    assert((await visibleCount(mobileFaq)) === 1, `${label}: linear mobile FAQ is hidden`);
    const mobileCategories = mobileFaq.locator('[data-services-faq-mobile-category]');
    await waitForCount(mobileCategories, 5, `${label}: mobile FAQ categories`);
    const mobileItems = mobileFaq.locator('[data-services-faq-item="true"]');
    await waitForCount(mobileItems, 9, `${label}: mobile FAQ questions`);
    const mobileQuestionButtons = mobileItems.locator('button[aria-controls*="services-faq-answer"]');
    await waitForCount(mobileQuestionButtons, 9, `${label}: mobile FAQ question controls`);
    await assertTouchTargets(mobileQuestionButtons, 40, `${label}: mobile FAQ question controls`);
    assert((await visibleCount(mobileFaq.locator('[data-services-faq-open="true"]'))) === 1, `${label}: mobile FAQ opens more than one answer`);

    const priceQuestion = mobileFaq.getByRole("button", { name: "Is the displayed price the final quote?", exact: true });
    await priceQuestion.click();
    const priceItem = mobileFaq.locator('[data-services-faq-id="price-final"]');
    await waitForVisibleText(priceItem.locator('[data-faq-direct-answer="true"]'), "localized starting investments", `${label}: mobile FAQ direct answer`);
    assert((await visibleCount(mobileFaq.locator('[data-services-faq-open="true"]'))) === 1, `${label}: mobile FAQ answer did not replace the previous answer`);
    const scopeNote = priceItem.getByRole("button", { name: "Read the scope note", exact: true });
    await assertTouchTargets(scopeNote, 40, `${label}: mobile FAQ scope-note control`);
    await scopeNote.click();
    await waitForVisibleText(priceItem.locator('[data-faq-deep-answer="true"]'), "third-party production", `${label}: mobile FAQ deeper explanation`);
    assert((await priceItem.locator('[data-faq-related-link="true"]').count()) === 1, `${label}: mobile FAQ related path is missing`);
  } else {
    assert((await visibleCount(desktopFaq)) === 1, `${label}: desktop FAQ index is hidden`);
    assert((await visibleCount(mobileFaq)) === 0, `${label}: linear mobile FAQ remains visible on desktop`);
    const categoryTabs = desktopFaq.getByRole("tablist", { name: "Services FAQ categories" }).getByRole("tab");
    await waitForCount(categoryTabs, 5, `${label}: desktop FAQ categories`);
    await assertTouchTargets(categoryTabs, 40, `${label}: desktop FAQ categories`);
    assert((await categoryTabs.first().getAttribute("aria-selected")) === "true", `${label}: first FAQ category is not selected`);
    const categoryPanel = desktopFaq.getByRole("tabpanel");
    await waitForVisibleText(categoryPanel, "Do I need every service?", `${label}: desktop FAQ starting category`);

    const processTab = desktopFaq.getByRole("tab", { name: /How it works/i });
    await processTab.click();
    assert((await processTab.getAttribute("aria-selected")) === "true", `${label}: desktop FAQ process category did not activate`);
    const processItems = categoryPanel.locator('[data-services-faq-item="true"]');
    await waitForCount(processItems, 3, `${label}: desktop process questions`);
    assert((await visibleCount(categoryPanel.locator('[data-services-faq-open="true"]'))) === 1, `${label}: desktop FAQ category opens more than one answer`);
    const timelineQuestion = categoryPanel.getByRole("button", { name: "How long will the project take?", exact: true });
    await timelineQuestion.click();
    const timelineItem = categoryPanel.locator('[data-services-faq-id="project-timeline"]');
    await waitForVisibleText(timelineItem.locator('[data-faq-direct-answer="true"]'), "no universal timeline", `${label}: desktop FAQ direct answer`);
    const timelineDetail = timelineItem.getByRole("button", { name: "Read the scope note", exact: true });
    await timelineDetail.click();
    await waitForVisibleText(timelineItem.locator('[data-faq-deep-answer="true"]'), "Discover, Define, Design", `${label}: desktop FAQ project-route detail`);
    assert((await timelineItem.locator('[data-faq-related-link="true"]').count()) === 1, `${label}: desktop FAQ related path is missing`);
  }

  if (viewport.screenshots) await captureViewport(page, `services-${viewport.name}-questions.png`);

  // Audit: desktop keeps the useful checks and consent form together.'''

    text = replace_once(text, anchor, faq_audit, "Services FAQ browser contract")

    text = replace_once(
        text,
        '    healthQuestions: 4,\n    publicAuditChecks: 5,',
        '    healthQuestions: 4,\n    faqQuestions: 9,\n    faqCategories: 5,\n    desktopFaqIndex: true,\n    linearMobileFaq: true,\n    publicAuditChecks: 5,',
        "Services FAQ result fields",
    )
    path.write_text(text)


def validate() -> None:
    contracts = {
        Path("src/app/services/page.tsx"): [
            'id="questions"',
            "<ServicesFAQ />",
            'href: "#questions"',
            'label: "Recognition audit"',
            '"@type": "FAQPage"',
        ],
        Path("src/sections/Services/ServicesFAQ.tsx"): [
            'data-services-faq-desktop="true"',
            'data-services-faq-mobile="true"',
            'data-faq-direct-answer="true"',
            'data-faq-deep-answer="true"',
            'data-faq-related-link="true"',
        ],
        Path("scripts/services_page_gate.cjs"): [
            "mobile FAQ questions",
            "desktop FAQ categories",
            "faqQuestions: 9",
            "linearMobileFaq: true",
        ],
    }
    for path, needles in contracts.items():
        text = path.read_text()
        for needle in needles:
            if needle not in text:
                raise SystemExit(f"{path}: missing contract {needle!r}")


if __name__ == "__main__":
    update_services_page()
    update_gate()
    validate()
    print("Services practical FAQ integration applied.")
