from __future__ import annotations

from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected one match, found {count}")
    return text.replace(old, new, 1)


def update_package_selector() -> None:
    path = Path("src/sections/Services/PackageSelector.tsx")
    text = path.read_text()

    text = replace_once(
        text,
        'import { ElementGlyph } from "@/components/ElementGlyph";\n',
        'import { ElementGlyph } from "@/components/ElementGlyph";\n'
        'import { PackageComparisonDeck } from "@/sections/Services/PackageComparisonDeck";\n',
        "Package comparison deck import",
    )

    old = '''            <motion.div
              key="compare"
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={transition}
              className="grid gap-4 lg:grid-cols-3"
            >
              {packages.map((pkg) => (
                <div
                  key={pkg.slug}
                  className="flex flex-col rounded-2xl border-t-2 p-6 backdrop-blur-md"
                  style={{ borderColor: pkg.color, backgroundColor: blendHex(pkg.color, "#0F151C", 12) }}
                >
                  <p className="font-display text-lg font-normal text-ivory">{pkg.name}</p>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-xs text-ivory/70">{pkg.billing === "monthly" ? "from" : "begins at"}</span>
                    <span className="font-display text-xl font-normal text-ivory">
                      {formatPrice(region, pkg.slug as PackageSlug)}
                    </span>
                    {pkg.billing === "monthly" && <span className="text-xs text-ivory/70">/mo</span>}
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-ivory/75">{pkg.forWho}</p>
                  <ul className="mt-4 flex-1 space-y-1.5 border-t border-ivory/10 pt-4">
                    {pkg.includes.map((item) => (
                      <li key={item} className="text-xs leading-relaxed text-ivory/85 before:mr-2 before:content-['•']">
                        {item}
                      </li>
                    ))}
                  </ul>
                  <LinkButton
                    href="/contact"
                    className="mt-5 self-start"
                    style={{ backgroundColor: pkg.color }}
                  >
                    Start with {pkg.name}
                  </LinkButton>
                </div>
              ))}
            </motion.div>'''

    new = '''            <motion.div
              key="compare"
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={transition}
            >
              <PackageComparisonDeck region={region} />
            </motion.div>'''

    text = replace_once(text, old, new, "Package comparison block")
    path.write_text(text)


def update_services_gate() -> None:
    path = Path("scripts/services_page_gate.cjs")
    text = path.read_text()

    old = '''  const compareButton = desire.getByRole("button", { name: "Compare all three side by side", exact: true });
  await compareButton.click();
  assert((await compareButton.getAttribute("aria-pressed")) === "true", `${label}: comparison did not expose its pressed state`);
  for (const name of ["Foundation", "Full Brand System", "Brand Partnership"]) {
    assert((await desire.getByRole("link", { name: new RegExp(`Start with ${name}`, "i") }).count()) === 1, `${label}: comparison is missing ${name}`);
  }
  if (viewport.screenshots) await captureViewport(page, `services-${viewport.name}-package-comparison.png`);'''

    new = '''  const compareButton = desire.getByRole("button", { name: "Compare all three side by side", exact: true });
  await compareButton.click();
  assert((await compareButton.getAttribute("aria-pressed")) === "true", `${label}: comparison did not expose its pressed state`);

  const comparisonDeck = desire.locator('[data-package-comparison-deck="true"]');
  await comparisonDeck.waitFor({ state: "visible", timeout: 8_000 });
  const comparisonCards = comparisonDeck.locator('[data-package-comparison-card="true"]');
  await waitForCount(comparisonCards, 3, `${label}: package comparison cards`);
  const comparisonLinks = comparisonDeck.getByRole("link", { name: /Start with /i });
  await waitForCount(comparisonLinks, 3, `${label}: package comparison links`);
  await assertTouchTargets(comparisonLinks, 40, `${label}: package comparison links`);
  for (const name of ["Foundation", "Full Brand System", "Brand Partnership"]) {
    assert(
      (await comparisonDeck.getByRole("link", { name: new RegExp(`Start with ${name}`, "i") }).count()) === 1,
      `${label}: comparison is missing ${name}`,
    );
  }

  const comparisonControls = comparisonDeck.locator('[data-package-comparison-controls="true"]');
  if (viewport.width < 1024) {
    assert((await visibleCount(comparisonControls)) === 1, `${label}: compact comparison controls are not visible`);
    const comparisonArrows = comparisonControls.getByRole("button");
    await waitForCount(comparisonArrows, 2, `${label}: package comparison arrows`);
    await assertTouchTargets(comparisonArrows, 40, `${label}: package comparison arrows`);
    const comparisonDots = comparisonDeck.getByRole("group", { name: "Choose a package comparison" }).getByRole("button");
    await waitForCount(comparisonDots, 3, `${label}: package comparison position controls`);
    await assertTouchTargets(comparisonDots, 40, `${label}: package comparison position controls`);
    const track = comparisonDeck.getByRole("list", { name: "All three package comparisons" });
    const trackMetrics = await track.evaluate((node) => ({
      clientWidth: node.clientWidth,
      scrollWidth: node.scrollWidth,
    }));
    assert(
      trackMetrics.scrollWidth > trackMetrics.clientWidth,
      `${label}: compact package comparison is not horizontally scrollable`,
    );
    await comparisonControls.getByRole("button", { name: "Next package", exact: true }).click();
    assert(
      (await comparisonDeck.getAttribute("data-active-index")) === "1",
      `${label}: package comparison did not advance to the second card`,
    );
  } else {
    assert((await visibleCount(comparisonControls)) === 0, `${label}: mobile comparison controls remain visible on desktop`);
    const cardBoxes = await comparisonCards.evaluateAll((nodes) =>
      nodes.map((node) => {
        const rect = node.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      }),
    );
    const yValues = cardBoxes.map((box) => box.y);
    assert(
      Math.max(...yValues) - Math.min(...yValues) < 3,
      `${label}: desktop package cards are no longer side by side ${JSON.stringify(cardBoxes)}`,
    );
  }

  if (viewport.screenshots) await captureViewport(page, `services-${viewport.name}-package-comparison.png`);'''

    text = replace_once(text, old, new, "Package comparison browser audit")
    text = replace_once(
        text,
        '    packageChoices: 3,\n    perceptionRungs: 4,',
        '    packageChoices: 3,\n    packageComparisonCards: 3,\n    compactPackageComparison: true,\n    perceptionRungs: 4,',
        "Package comparison result fields",
    )

    path.write_text(text)


def validate() -> None:
    contracts = {
        Path("src/sections/Services/PackageSelector.tsx"): [
            "PackageComparisonDeck",
            "<PackageComparisonDeck region={region} />",
        ],
        Path("scripts/services_page_gate.cjs"): [
            'data-package-comparison-deck="true"',
            "compact package comparison is not horizontally scrollable",
            "packageComparisonCards: 3",
            "compactPackageComparison: true",
        ],
    }
    for path, needles in contracts.items():
        text = path.read_text()
        for needle in needles:
            if needle not in text:
                raise SystemExit(f"{path}: missing contract {needle!r}")


if __name__ == "__main__":
    update_package_selector()
    update_services_gate()
    validate()
    print("Services mobile package comparison applied.")
