from __future__ import annotations

from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected one match, found {count}")
    return text.replace(old, new, 1)


def main() -> None:
    path = Path("scripts/services_page_gate.cjs")
    text = path.read_text()

    old = '''  // Offerings: all six disciplines stay visible inside one compact
  // explorer, and changing a tab replaces the explanation without adding
  // six document-length rows to the journey.
  const offerings = page.locator("#offerings");
  await scrollTo(page, offerings, `${label}/offerings`);
  const disciplineTabs = offerings.getByRole("tab");
  await waitForCount(disciplineTabs, 6, `${label}: service-discipline tabs`);
  await assertTouchTargets(disciplineTabs, 40, `${label}: service-discipline tabs`);
  assert((await disciplineTabs.first().getAttribute("aria-selected")) === "true", `${label}: first discipline is not selected`);
  const websiteTab = offerings.getByRole("tab", { name: "Website Development", exact: true });
  await websiteTab.click();
  assert((await websiteTab.getAttribute("aria-selected")) === "true", `${label}: Website Development tab did not activate`);
  const disciplinePanel = offerings.getByRole("tabpanel");
  await waitForVisibleText(disciplinePanel, "The most visited stop on a customer's whole journey", `${label}: service-discipline panel`);
  for (const service of [
    "Brand Strategy & Identity",
    "Content Strategy",
    "Social Media Marketing",
    "Website Development",
    "Content Creation",
    "Marketing Strategy",
  ]) {
    assert(((await offerings.textContent()) || "").includes(service), `${label}: offering ${service} is missing`);
  }
  if (viewport.screenshots) await captureViewport(page, `services-${viewport.name}-offerings.png`);'''

    new = '''  // Offerings: all six disciplines stay visible together. Below the
  // desktop breakpoint they occupy a two-by-three control field rather
  // than six full-width rows, while one substantial explanation changes
  // beneath them. Desktop retains its vertical editorial index.
  const offerings = page.locator("#offerings");
  await scrollTo(page, offerings, `${label}/offerings`);
  const disciplineExplorer = offerings.locator('[data-service-discipline-explorer="true"]');
  const disciplineIndex = disciplineExplorer.locator('[data-service-discipline-index="true"]');
  const disciplineTabs = disciplineIndex.locator('[data-service-discipline-tab="true"]');
  await waitForCount(disciplineTabs, 6, `${label}: service-discipline tabs`);
  await assertTouchTargets(disciplineTabs, 40, `${label}: service-discipline tabs`);
  assert(
    (await disciplineTabs.first().getAttribute("aria-selected")) === "true",
    `${label}: first discipline is not selected`,
  );

  const disciplineBoxes = await disciplineTabs.evaluateAll((nodes) =>
    nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    }),
  );
  const disciplineColumns = new Set(disciplineBoxes.map((box) => Math.round(box.x / 4) * 4));
  const disciplineRows = new Set(disciplineBoxes.map((box) => Math.round(box.y / 4) * 4));

  if (viewport.width < 1024) {
    assert(
      disciplineColumns.size === 2 && disciplineRows.size === 3,
      `${label}: mobile service disciplines are not a two-by-three grid ${JSON.stringify(disciplineBoxes)}`,
    );
    const disciplineIndexBox = await disciplineIndex.boundingBox();
    assert(
      disciplineIndexBox && disciplineIndexBox.height < 330,
      `${label}: mobile service index still behaves like a six-row tower ${JSON.stringify(disciplineIndexBox)}`,
    );

    await disciplineTabs.first().focus();
    await page.keyboard.press("ArrowDown");
    assert(
      (await disciplineExplorer.getAttribute("data-active-discipline-index")) === "2",
      `${label}: ArrowDown did not move through the compact service grid by one row`,
    );
    assert(
      (await disciplineTabs.nth(2).getAttribute("aria-selected")) === "true",
      `${label}: Social Media Marketing did not become selected through keyboard navigation`,
    );
    await page.keyboard.press("End");
    assert(
      (await disciplineExplorer.getAttribute("data-active-discipline-index")) === "5",
      `${label}: End did not move to Marketing Strategy`,
    );
    assert(
      (await disciplineTabs.nth(5).getAttribute("aria-selected")) === "true",
      `${label}: Marketing Strategy was not selected through End`,
    );
    await page.keyboard.press("Home");
    assert(
      (await disciplineExplorer.getAttribute("data-active-discipline-index")) === "0",
      `${label}: Home did not return to the first service discipline`,
    );
  } else {
    assert(
      disciplineColumns.size === 1 && disciplineRows.size === 6,
      `${label}: desktop service disciplines no longer form one vertical index ${JSON.stringify(disciplineBoxes)}`,
    );
    await disciplineTabs.first().focus();
    await page.keyboard.press("End");
    assert(
      (await disciplineExplorer.getAttribute("data-active-discipline-index")) === "5",
      `${label}: desktop service index does not support End`,
    );
    await page.keyboard.press("Home");
    assert(
      (await disciplineExplorer.getAttribute("data-active-discipline-index")) === "0",
      `${label}: desktop service index does not support Home`,
    );
  }

  const websiteTab = disciplineIndex.getByRole("tab", { name: "Website Development", exact: true });
  await websiteTab.click();
  assert(
    (await websiteTab.getAttribute("aria-selected")) === "true",
    `${label}: Website Development tab did not activate`,
  );
  assert(
    (await disciplineExplorer.getAttribute("data-active-discipline-index")) === "3",
    `${label}: service discipline index did not record Website Development`,
  );
  const disciplinePanel = disciplineExplorer.locator('[data-service-discipline-panel="true"]');
  await waitForVisibleText(
    disciplinePanel,
    "The most visited stop on a customer's whole journey",
    `${label}: service-discipline panel`,
  );
  for (const service of [
    "Brand Strategy & Identity",
    "Content Strategy",
    "Social Media Marketing",
    "Website Development",
    "Content Creation",
    "Marketing Strategy",
  ]) {
    assert(((await offerings.textContent()) || "").includes(service), `${label}: offering ${service} is missing`);
  }
  if (viewport.screenshots) await captureViewport(page, `services-${viewport.name}-offerings.png`);'''

    text = replace_once(text, old, new, "responsive service-discipline browser audit")
    text = replace_once(
        text,
        '    offerings: 6,\n    screenFitScenes: 10,',
        '    offerings: 6,\n    compactOfferingGrid: true,\n    offeringKeyboardNavigation: true,\n    screenFitScenes: 10,',
        "responsive offerings result fields",
    )
    path.write_text(text)

    updated = path.read_text()
    for needle in (
        'data-service-discipline-explorer="true"',
        "mobile service disciplines are not a two-by-three grid",
        "ArrowDown did not move through the compact service grid by one row",
        "compactOfferingGrid: true",
        "offeringKeyboardNavigation: true",
    ):
        if needle not in updated:
            raise SystemExit(f"Missing responsive service-grid gate contract: {needle}")

    print("Services responsive offering-grid gate applied.")


if __name__ == "__main__":
    main()
