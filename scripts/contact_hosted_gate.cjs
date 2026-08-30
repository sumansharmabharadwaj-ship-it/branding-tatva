const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = (process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const AUDIT_COMMIT = process.env.AUDIT_COMMIT || "unknown";
const OUTPUT_DIR = path.join(process.cwd(), "contact-hosted-audit");
const PHONE_DIGITS = "918447725381";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function normalise(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

async function waitForPrelude(page, label) {
  const loader = page.locator("[data-page-load-veil]");
  if ((await loader.count()) > 0) {
    await loader.waitFor({ state: "detached", timeout: 12_000 }).catch(() => {});
  }
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(500);
  assert((await loader.count()) === 0, `${label}: page-load veil did not clear`);
}

async function assertNoOverflow(page, label) {
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  assert(
    dimensions.document <= dimensions.viewport + 3 && dimensions.body <= dimensions.viewport + 3,
    `${label}: horizontal overflow ${JSON.stringify(dimensions)}`,
  );
}

async function visible(locator) {
  if ((await locator.count()) === 0) return false;
  return locator.first().evaluate((node) => {
    const style = getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
  });
}

async function auditViewport(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    hasTouch: viewport.touch,
    reducedMotion: viewport.reducedMotion || "no-preference",
  });
  const page = await context.newPage();
  const pageErrors = [];
  const sameOriginFailures = [];

  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("requestfailed", (request) => {
    try {
      const errorText = request.failure()?.errorText || "failed";
      // VideoWarden intentionally retires offscreen media and Next can cancel
      // speculative route prefetches. Chromium reports both as ERR_ABORTED;
      // they are lifecycle cancellations, not broken same-origin requests.
      if (errorText === "net::ERR_ABORTED") return;
      const requestUrl = new URL(request.url());
      const base = new URL(BASE_URL);
      if (requestUrl.origin === base.origin) {
        sameOriginFailures.push(`${errorText} ${request.url()}`);
      }
    } catch {}
  });

  try {
    const response = await page.goto(`${BASE_URL}/contact`, {
      waitUntil: "domcontentloaded",
      timeout: 90_000,
    });
    assert(response && response.ok(), `${viewport.name}: /contact returned ${response?.status()}`);
    await waitForPrelude(page, viewport.name);

    let reducedMotionState = null;
    if (viewport.reducedMotion === "reduce") {
      reducedMotionState = await page.evaluate(() => ({
        matches: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        playingVideos: Array.from(document.querySelectorAll("main video")).filter(
          (video) => !video.paused,
        ).length,
        scrollSnapType: getComputedStyle(document.documentElement).scrollSnapType,
      }));
      assert(reducedMotionState.matches, `${viewport.name}: reduced-motion media query is not active`);
      assert(reducedMotionState.playingVideos === 0, `${viewport.name}: media is still playing under reduced motion`);
      assert(
        reducedMotionState.scrollSnapType === "none",
        `${viewport.name}: cinematic scroll snap remains active under reduced motion (${reducedMotionState.scrollSnapType})`,
      );
    }

    const bodyText = normalise(await page.locator("body").innerText());
    const lower = bodyText.toLowerCase();
    const h1 = page.locator("main h1");
    assert((await h1.count()) === 1 && (await visible(h1)), `${viewport.name}: one visible Contact H1 was not rendered`);
    assert(/30[ -]?minute/.test(lower), `${viewport.name}: the public 30-minute consultation duration is missing`);
    assert(!/20[ -]?minute/.test(lower), `${viewport.name}: stale 20-minute consultation copy remains`);
    assert(lower.includes("timezone") || lower.includes("time zone"), `${viewport.name}: scheduling timezone guidance is missing`);

    const telLinks = page.locator('a[href^="tel:"]');
    const whatsappLinks = page.locator('a[href*="wa.me"], a[href*="whatsapp.com"]');
    const emailLinks = page.locator('a[href^="mailto:"]');
    assert((await telLinks.count()) > 0, `${viewport.name}: direct telephone action is missing`);
    assert((await whatsappLinks.count()) > 0, `${viewport.name}: WhatsApp action is missing`);
    assert((await emailLinks.count()) > 0, `${viewport.name}: email fallback is missing`);

    const telHref = (await telLinks.first().getAttribute("href")) || "";
    const whatsappHref = (await whatsappLinks.first().getAttribute("href")) || "";
    assert(telHref.replace(/\D/g, "").includes(PHONE_DIGITS), `${viewport.name}: telephone action uses the wrong number (${telHref})`);
    assert(whatsappHref.replace(/\D/g, "").includes(PHONE_DIGITS), `${viewport.name}: WhatsApp action uses the wrong number (${whatsappHref})`);
    const phoneNumber = page.locator("[data-contact-phone-number]").first();
    const phoneNumberState =
      (await phoneNumber.count()) === 1
        ? await phoneNumber.evaluate((node) => {
            const style = getComputedStyle(node);
            return {
              display: style.display,
              text: node.textContent || "",
              visibility: style.visibility,
            };
          })
        : null;
    assert(
      phoneNumberState &&
        phoneNumberState.display !== "none" &&
        phoneNumberState.visibility !== "hidden" &&
        normalise(phoneNumberState.text).replace(/\D/g, "").includes(PHONE_DIGITS),
      `${viewport.name}: the public phone number is not visibly rendered ${JSON.stringify(phoneNumberState)}`,
    );

    const schedulingTargets = page.locator(
      'iframe[src*="calendly.com"], a[href*="calendly.com"], [id*="schedule" i], [id*="book" i]',
    );
    assert((await schedulingTargets.count()) > 0, `${viewport.name}: no Calendly embed, fallback, or scheduling anchor was found`);

    const form = page.locator("main form").first();
    assert((await form.count()) === 1 && (await visible(form)), `${viewport.name}: contact form is missing`);
    const email = form.locator('input[type="email"], input[name*="email" i]').first();
    const message = form.locator('textarea, [contenteditable="true"][role="textbox"]').first();
    const submit = form.locator('button[type="submit"], input[type="submit"]').first();
    assert((await email.count()) === 1, `${viewport.name}: form email field is missing`);
    assert((await message.count()) === 1, `${viewport.name}: form message field is missing`);
    assert((await submit.count()) === 1, `${viewport.name}: form submit control is missing`);

    await email.fill("not-an-email");
    await submit.click();
    await page.waitForTimeout(250);
    const invalidState = await email.evaluate((node) => ({
      ariaInvalid: node.getAttribute("aria-invalid"),
      valid: typeof node.checkValidity === "function" ? node.checkValidity() : true,
    }));
    const errorSignals = page.locator('[role="alert"], [aria-live], [id*="error" i], [class*="error" i]');
    assert(
      invalidState.valid === false || invalidState.ariaInvalid === "true" || (await errorSignals.count()) > 0,
      `${viewport.name}: invalid email submission exposes no browser or accessible error state`,
    );

    const keyActions = [telLinks.first(), whatsappLinks.first(), submit];
    for (const control of keyActions) {
      if (!(await visible(control))) continue;
      const box = await control.boundingBox();
      assert(box && box.width >= 40 && box.height >= 40, `${viewport.name}: primary contact control is below a practical touch target ${JSON.stringify(box)}`);
    }

    await assertNoOverflow(page, viewport.name);
    assert(pageErrors.length === 0, `${viewport.name}: page exceptions ${JSON.stringify(pageErrors.slice(0, 6))}`);
    assert(sameOriginFailures.length === 0, `${viewport.name}: same-origin request failures ${JSON.stringify(sameOriginFailures.slice(0, 6))}`);

    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    await page.screenshot({
      path: path.join(OUTPUT_DIR, `${viewport.name}.png`),
      fullPage: true,
      animations: "disabled",
    });

    return {
      viewport: viewport.name,
      telHref,
      whatsappHref,
      schedulingTargets: await schedulingTargets.count(),
      formPresent: true,
      invalidEmailRejected: true,
      reducedMotionState,
    };
  } finally {
    await context.close();
  }
}

async function auditStatefulExperience(browser) {
  const context = await browser.newContext({
    viewport: { width: 1180, height: 820 },
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  const deliveryAttempts = [];

  await page.route("**/api/contact", async (route) => {
    const request = route.request();
    if (request.method() !== "POST") return route.continue();

    deliveryAttempts.push({
      body: request.postDataJSON(),
      submissionId: request.headers()["x-contact-submission"] || null,
    });
    const attempt = deliveryAttempts.length;

    if (attempt === 1) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({}),
      });
    }
    if (attempt === 2) {
      return route.fulfill({
        status: 502,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Delivery failed. Please try again shortly or email Suman directly.",
          requestId: "8f223600-0000-4000-8000-000000000002",
        }),
      });
    }
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        requestId: "8f223600-0000-4000-8000-000000000003",
      }),
    });
  });

  try {
    const response = await page.goto(`${BASE_URL}/contact#write`, {
      waitUntil: "domcontentloaded",
      timeout: 90_000,
    });
    assert(response && response.ok(), `stateful flow: /contact returned ${response?.status()}`);
    await waitForPrelude(page, "stateful flow");

    const form = page.locator("main form").first();
    const name = form.locator('[name="name"]');
    const email = form.locator('[name="email"]');
    const description = form.locator('[name="description"]');
    const submit = form.locator('button[type="submit"]');
    const draftStatus = page.locator("[data-contact-draft-status]");
    const draftValues = {
      name: "Contact QA Visitor",
      email: "contact.qa@example.com",
      description: "Testing a saved enquiry draft and its delivery recovery states.",
    };

    await name.fill(draftValues.name);
    await email.fill(draftValues.email);
    await description.fill(draftValues.description);
    await page.locator('[data-contact-draft-status][data-state="saved"]').waitFor({ state: "attached", timeout: 5_000 });
    assert((await draftStatus.getAttribute("data-state")) === "saved", "stateful flow: draft never reached saved state");
    assert(normalise(await draftStatus.innerText()) === "Saved in this tab.", "stateful flow: saved-draft copy is not truthful");
    assert(await page.getByRole("button", { name: "Clear note" }).isVisible(), "stateful flow: saved draft cannot be cleared");

    await page.reload({ waitUntil: "domcontentloaded" });
    await waitForPrelude(page, "stateful draft restore");
    await page.locator('[data-contact-draft-status][data-state="restored"]').waitFor({ state: "attached", timeout: 5_000 });
    assert((await name.inputValue()) === draftValues.name, "stateful flow: name was not restored");
    assert((await email.inputValue()) === draftValues.email, "stateful flow: email was not restored");
    assert((await description.inputValue()) === draftValues.description, "stateful flow: question was not restored");
    assert(
      normalise(await draftStatus.innerText()) === "Your unfinished note was restored in this tab.",
      "stateful flow: restored-draft copy is not truthful",
    );

    await submit.click();
    const recovery = page.locator('[role="alert"]').filter({ hasText: "Your note is still here." });
    await recovery.waitFor({ state: "visible", timeout: 5_000 });
    assert(
      normalise(await recovery.innerText()).includes("Something went wrong. Please try again."),
      "stateful flow: a 200 response without ok:true produced misleading recovery copy",
    );
    assert(
      await page.getByRole("button", { name: "Try sending again" }).isVisible(),
      "stateful flow: retry action is missing after an unconfirmed delivery",
    );
    await page.waitForFunction(
      () => document.activeElement?.getAttribute("role") === "alert",
      undefined,
      { timeout: 2_000 },
    ).catch(() => {});
    assert(
      await recovery.evaluate((node) => document.activeElement === node),
      "stateful flow: delivery recovery did not receive focus",
    );

    await page.getByRole("button", { name: "Try sending again" }).click();
    const providerRecovery = page.locator('[role="alert"]').filter({ hasText: "Delivery failed." });
    await providerRecovery.waitFor({ state: "visible", timeout: 5_000 });
    assert(
      normalise(await providerRecovery.innerText()).includes("Delivery failed."),
      "stateful flow: provider rejection copy is missing",
    );
    assert(
      normalise(await providerRecovery.innerText()).includes("Reference 8f2236000000"),
      "stateful flow: provider failure reference is missing",
    );

    await page.getByRole("button", { name: "Try sending again" }).click();
    const success = page.locator("[data-contact-form-success]");
    await success.waitFor({ state: "visible", timeout: 5_000 });
    assert(
      normalise(await success.innerText()).toLowerCase().includes("your note has arrived"),
      "stateful flow: confirmed delivery did not render success",
    );
    await page.waitForFunction(
      () => document.activeElement?.hasAttribute("data-contact-form-success") === true,
      undefined,
      { timeout: 2_000 },
    ).catch(() => {});
    assert(
      await success.evaluate((node) => document.activeElement === node),
      "stateful flow: success confirmation did not receive focus",
    );
    assert(deliveryAttempts.length === 3, `stateful flow: expected 3 delivery attempts, received ${deliveryAttempts.length}`);
    const submissionIds = deliveryAttempts.map((attempt) => attempt.submissionId);
    assert(
      submissionIds.every((submissionId) => submissionId && submissionId === submissionIds[0]),
      `stateful flow: retry submission identity drifted ${JSON.stringify(submissionIds)}`,
    );
    assert(
      deliveryAttempts.every((attempt) => JSON.stringify(attempt.body) === JSON.stringify(deliveryAttempts[0].body)),
      "stateful flow: retry payload changed without visitor edits",
    );
    assert(
      await page.evaluate(() => sessionStorage.getItem("branding-tatva:contact-note:v1") === null),
      "stateful flow: confirmed success did not clear the saved draft",
    );

    await page.getByRole("button", { name: "Write another note" }).click();
    await page.waitForFunction(
      () => document.activeElement?.getAttribute("name") === "name",
      undefined,
      { timeout: 2_000 },
    ).catch(() => {});
    assert(
      await name.evaluate((node) => document.activeElement === node),
      "stateful flow: starting another note did not return focus to the first field",
    );

    return {
      draftSaved: true,
      draftRestored: true,
      falseSuccessRejected: true,
      providerFailureRecovered: true,
      stableRetrySubmissionId: submissionIds[0],
      confirmedSuccessClearedDraft: true,
      successFocusManaged: true,
    };
  } finally {
    await context.close();
  }
}

async function auditKeyboardJourney(browser) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();

  try {
    const response = await page.goto(`${BASE_URL}/contact#choose`, {
      waitUntil: "domcontentloaded",
      timeout: 90_000,
    });
    assert(response && response.ok(), `keyboard journey: /contact returned ${response?.status()}`);
    await waitForPrelude(page, "keyboard journey");

    const chapterRail = page.locator("[data-contact-chapter-rail]");
    const writeChapter = chapterRail.locator('a[href="#write"]');
    await writeChapter.focus();
    await writeChapter.press("Enter");
    await page.waitForURL(/#write$/, { timeout: 5_000 });
    await page.waitForTimeout(450);
    assert(
      (await writeChapter.getAttribute("aria-current")) === "location",
      "keyboard journey: activated chapter is not exposed as current",
    );
    assert(
      normalise(await page.locator("[data-contact-chapter-status]").innerText()).includes("Chapter 2 of 4: Write"),
      "keyboard journey: chapter change was not announced",
    );

    await page.goto(`${BASE_URL}/contact#thanks`, { waitUntil: "domcontentloaded" });
    await waitForPrelude(page, "gratitude keyboard journey");
    const notes = page.locator("[data-contact-gratitude-note]");
    assert((await notes.count()) === 4, "keyboard journey: gratitude acknowledgements are incomplete");

    for (let index = 0; index < 4; index += 1) {
      const note = notes.nth(index);
      await note.focus();
      await page.waitForTimeout(50);
      assert((await note.getAttribute("aria-pressed")) === "true", `keyboard journey: note ${index + 1} did not open on focus`);
      if (index === 0) {
        await note.press("Escape");
        await page.waitForTimeout(50);
        assert((await note.getAttribute("aria-pressed")) === "false", "keyboard journey: Escape did not close the active acknowledgement");
        await note.focus();
      }
    }

    const progress = page.getByRole("progressbar", { name: "Acknowledgements received" });
    assert((await progress.getAttribute("aria-valuenow")) === "4", "keyboard journey: gratitude progress did not reach four");
    assert(
      (await progress.getAttribute("aria-valuetext")) === "All four acknowledgements received",
      "keyboard journey: gratitude completion is not announced clearly",
    );
    const next = page.locator("[data-contact-gratitude-next]");
    const nextLink = next.getByRole("link", { name: "Carry a question into the field notes" });
    assert((await next.getAttribute("aria-hidden")) === "false", "keyboard journey: completed gratitude handoff remains hidden");
    assert((await nextLink.getAttribute("tabindex")) !== "-1", "keyboard journey: completed gratitude handoff remains outside the tab order");
    await nextLink.focus();
    assert(
      await nextLink.evaluate((node) => document.activeElement === node),
      "keyboard journey: completed gratitude handoff cannot receive focus",
    );

    return {
      chapterKeyboardNavigation: true,
      chapterAnnouncement: true,
      gratitudeEscape: true,
      gratitudeCompletion: true,
      gratitudeHandoffFocusable: true,
    };
  } finally {
    await context.close();
  }
}

async function request(pathname, options = {}) {
  const response = await fetch(`${BASE_URL}${pathname}`, {
    redirect: "manual",
    ...options,
  });
  const text = await response.text();
  let body;
  try { body = JSON.parse(text); } catch { body = { text: text.slice(0, 500) }; }
  return { status: response.status, body, headers: Object.fromEntries(response.headers) };
}

function falseSuccess(result, label) {
  const serialised = JSON.stringify(result.body).toLowerCase();
  assert(
    !(result.status >= 400 && /"success"\s*:\s*true/.test(serialised)),
    `${label}: invalid request returned a fake success payload`,
  );
}

async function auditApiRejectionPaths() {
  const results = {};

  results.contactGet = await request("/api/contact", { method: "GET" });
  assert([404, 405].includes(results.contactGet.status), `contact API: GET should be rejected, status=${results.contactGet.status}`);

  results.contactWrongType = await request("/api/contact", {
    method: "POST",
    headers: { "content-type": "text/plain" },
    body: "not-json",
  });
  assert([400, 413, 415, 422].includes(results.contactWrongType.status), `contact API: wrong content type was not rejected, status=${results.contactWrongType.status}`);
  falseSuccess(results.contactWrongType, "contact API wrong content type");

  results.contactEmpty = await request("/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({}),
  });
  assert([400, 413, 415, 422].includes(results.contactEmpty.status), `contact API: empty request was not rejected, status=${results.contactEmpty.status}`);
  falseSuccess(results.contactEmpty, "contact API empty request");

  results.contactInvalid = await request("/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "A", email: "invalid", message: "x" }),
  });
  assert([400, 413, 415, 422].includes(results.contactInvalid.status), `contact API: invalid fields were not rejected, status=${results.contactInvalid.status}`);
  falseSuccess(results.contactInvalid, "contact API invalid fields");

  const oversized = JSON.stringify({ name: "Audit", email: "audit@example.invalid", message: "x".repeat(160_000) });
  results.contactOversized = await request("/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: oversized,
  });
  assert([400, 413, 415, 422].includes(results.contactOversized.status), `contact API: oversized request was not rejected, status=${results.contactOversized.status}`);
  falseSuccess(results.contactOversized, "contact API oversized request");

  results.newsletterInvalid = await request("/api/newsletter", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "invalid" }),
  });
  assert([400, 413, 415, 422].includes(results.newsletterInvalid.status), `newsletter API: invalid email was not rejected, status=${results.newsletterInvalid.status}`);
  falseSuccess(results.newsletterInvalid, "newsletter API invalid email");

  return Object.fromEntries(Object.entries(results).map(([key, value]) => [key, value.status]));
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
      : {}),
  });
  try {
    const viewports = [
      { name: "contact-desktop-1440x900", width: 1440, height: 900, touch: false },
      { name: "contact-mobile-390x844", width: 390, height: 844, touch: true },
      { name: "contact-mobile-reduced-390x844", width: 390, height: 844, touch: true, reducedMotion: "reduce" },
    ];
    const viewportResults = [];
    for (const viewport of viewports) {
      viewportResults.push(await auditViewport(browser, viewport));
    }
    const statefulExperience = await auditStatefulExperience(browser);
    const keyboardJourney = await auditKeyboardJourney(browser);
    const apiResults = await auditApiRejectionPaths();

    const report = {
      baseUrl: BASE_URL,
      commit: AUDIT_COMMIT,
      generatedAt: new Date().toISOString(),
      contactHostedGate: "passed",
      viewports: viewportResults,
      statefulExperience,
      keyboardJourney,
      apiRejectionPaths: apiResults,
      intentionallyNotPerformed: [
        "No contact message was submitted",
        "No newsletter subscription was created",
        "No Calendly appointment was booked",
      ],
    };

    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    fs.writeFileSync(path.join(OUTPUT_DIR, "contact-hosted-report.json"), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
