from __future__ import annotations

from pathlib import Path


path = Path("scripts/services_page_gate.cjs")
text = path.read_text()

old = '''  // Strategy Room: the final chapter owns the full viewport, retains
  // the generated arrival frame, and starts with touch-safe choices.
  const book = page.locator("#book");
  await scrollTo(page, book, `${label}/book`);
  assert((await jumpNav.count()) === 0, `${label}: fixed section navigation remains over the Strategy Room`);
  assert((await book.getByRole("heading", { level: 2, name: /Open the strategy room/i }).count()) === 1, `${label}: Strategy Room heading is missing`);
  const strategyChoices = book.locator('button[data-strategy-control="true"]');
  await waitForCount(strategyChoices, 6, `${label}: Strategy Room opening choices`);
  await assertTouchTargets(strategyChoices, 40, `${label}: Strategy Room choices`);
  if (viewport.screenshots) await captureViewport(page, `services-${viewport.name}-strategy-room.png`);'''

new = '''  // Strategy Room: the final chapter previews who the call is for,
  // preparation, what happens inside it, and the useful outcome before
  // asking for three quick answers. The completed answers become a
  // visible, copyable brief beside the live calendar and a quiet email
  // alternative carries the same context without sending it to analytics.
  const book = page.locator("#book");
  await scrollTo(page, book, `${label}/book`);
  assert((await jumpNav.count()) === 0, `${label}: fixed section navigation remains over the Strategy Room`);
  assert((await book.getByRole("heading", { level: 2, name: /Open the strategy room/i }).count()) === 1, `${label}: Strategy Room heading is missing`);

  const callPreview = book.locator('[data-strategy-call-preview="true"]');
  await callPreview.waitFor({ state: "visible", timeout: 8_000 });
  const previewPoints = callPreview.locator(":scope > div");
  await waitForCount(previewPoints, 4, `${label}: Strategy Room call-preview points`);
  await waitForVisibleText(callPreview, "No polished brief", `${label}: Strategy Room preparation guidance`);
  await waitForVisibleText(callPreview, "A clear recommendation", `${label}: Strategy Room outcome guidance`);

  let strategyChoices = book.locator('button[data-strategy-control="true"]');
  await waitForCount(strategyChoices, 6, `${label}: Strategy Room opening choices`);
  await assertTouchTargets(strategyChoices, 40, `${label}: Strategy Room choices`);

  await book.getByRole("button", { name: "I need to reposition", exact: true }).click();
  await waitForVisibleText(book, "What matters most right now?", `${label}: Strategy Room priority question`);
  await book.getByRole("button", { name: "Building recognition", exact: true }).click();
  await waitForVisibleText(book, "What's the main focus?", `${label}: Strategy Room focus question`);
  await book.getByRole("button", { name: "Positioning & identity", exact: true }).click();

  const strategyBrief = book.locator('[data-strategy-brief="true"]');
  await strategyBrief.waitFor({ state: "visible", timeout: 8_000 });
  for (const value of ["I need to reposition", "Building recognition", "Positioning & identity"]) {
    await waitForVisibleText(strategyBrief, value, `${label}: Strategy Room brief value ${value}`);
  }
  const briefRows = strategyBrief.locator("dl > div");
  await waitForCount(briefRows, 3, `${label}: Strategy Room brief rows`);
  const copyBrief = strategyBrief.locator('[data-strategy-copy-brief="true"]');
  await assertTouchTargets(copyBrief, 40, `${label}: Strategy Room copy-brief control`);
  await copyBrief.click();
  const copyStatus = strategyBrief.locator('[data-strategy-copy-status="true"]');
  assert(((await copyStatus.textContent()) || "").trim().length > 0, `${label}: Strategy Room copy status is empty`);

  const emailAlternative = book.locator('[data-strategy-email-alternative="true"]');
  await emailAlternative.waitFor({ state: "visible", timeout: 5_000 });
  await assertTouchTargets(emailAlternative, 40, `${label}: Strategy Room email alternative`);
  const emailHref = (await emailAlternative.getAttribute("href")) || "";
  assert(emailHref.startsWith("mailto:suman@brandingtatva.com"), `${label}: Strategy Room email alternative is not addressed correctly`);
  assert(decodeURIComponent(emailHref).includes("I need to reposition"), `${label}: Strategy Room email alternative dropped the call context`);
  assert((await book.locator(".calendly-inline-widget").count()) === 1, `${label}: Strategy Room live calendar is missing`);

  if (viewport.screenshots) await captureViewport(page, `services-${viewport.name}-strategy-room.png`);'''

if text.count(old) != 1:
    raise SystemExit(f"Strategy Room browser contract: expected one match, found {text.count(old)}")
text = text.replace(old, new, 1)

old_results = '''    strategyRoomQuestions: 3,
  };'''
new_results = '''    strategyRoomQuestions: 3,
    strategyCallPreviewPoints: 4,
    strategyBriefRows: 3,
    strategyEmailAlternative: true,
  };'''
if text.count(old_results) != 1:
    raise SystemExit(f"Strategy Room result fields: expected one match, found {text.count(old_results)}")
text = text.replace(old_results, new_results, 1)

path.write_text(text)
print("Services Strategy Room call-preview browser contract applied.")
