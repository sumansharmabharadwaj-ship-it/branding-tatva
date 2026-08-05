const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&#x27;", "'")
    .replaceAll("&quot;", '"');
}

function extractHrefs(html) {
  return Array.from(html.matchAll(/\shref=(?:"([^"]+)"|'([^']+)')/g), (match) =>
    decodeHtml(match[1] || match[2] || ""),
  );
}

function hasId(html, id) {
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\sid=(?:"${escaped}"|'${escaped}')`).test(html);
}

function shouldIgnore(href) {
  return (
    !href ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("javascript:") ||
    href.startsWith("data:") ||
    href.startsWith("//")
  );
}

async function fetchPage(url) {
  const response = await fetch(url, { redirect: "follow" });
  const text = await response.text();
  return { response, text };
}

async function main() {
  const homeUrl = new URL("/", BASE_URL);
  const { response: homeResponse, text: homeHtml } = await fetchPage(homeUrl);

  if (!homeResponse.ok) {
    throw new Error(`Homepage returned ${homeResponse.status}`);
  }

  const urls = new Map();
  for (const href of extractHrefs(homeHtml)) {
    if (shouldIgnore(href)) continue;

    const url = new URL(href, homeUrl);
    if (url.origin !== homeUrl.origin) continue;
    if (url.pathname.startsWith("/_next/")) continue;

    const key = `${url.pathname}${url.search}${url.hash}`;
    urls.set(key, url);
  }

  const failures = [];
  const checkedPages = new Map([[homeUrl.pathname, homeHtml]]);

  for (const [label, url] of urls) {
    let html = checkedPages.get(`${url.pathname}${url.search}`);

    if (!html) {
      const { response, text } = await fetchPage(url);
      if (!response.ok) {
        failures.push(`${label}: HTTP ${response.status}`);
        continue;
      }
      html = text;
      checkedPages.set(`${url.pathname}${url.search}`, html);
    }

    if (url.hash) {
      const id = decodeURIComponent(url.hash.slice(1));
      if (id && !hasId(html, id)) {
        failures.push(`${label}: missing #${id}`);
      }
    }
  }

  const requiredStaticDestinations = [
    "/contact",
    "/work",
    "/about",
    "/services",
    "/insights",
  ];

  for (const path of requiredStaticDestinations) {
    const emitted = Array.from(urls.values()).some((url) => url.pathname === path);
    if (!emitted) failures.push(`${path}: required homepage destination is absent`);
  }

  // The evidence archive renders one active case link at a time. Its client-side
  // interaction gate verifies that selecting each project swaps the href. This
  // server-side check confirms every possible destination still resolves.
  const interactiveCaseDestinations = [
    "/work/dr-haley-nutrition",
    "/work/myshopineurope",
    "/work/executive-springboard",
    "/work/herbalcart",
    "/work/plaxonic-content-portfolio",
  ];

  for (const path of interactiveCaseDestinations) {
    if (checkedPages.has(path)) continue;
    const url = new URL(path, homeUrl);
    const { response, text } = await fetchPage(url);
    if (!response.ok) {
      failures.push(`${path}: interactive case destination returned HTTP ${response.status}`);
      continue;
    }
    checkedPages.set(path, text);
  }

  console.log("# Branding Tatva homepage link integrity");
  console.log(`- Initially emitted internal destinations checked: ${urls.size}`);
  console.log(`- Interactive case-study destinations checked: ${interactiveCaseDestinations.length}`);
  console.log(`- Unique pages requested: ${checkedPages.size}`);
  console.log(`- Failures: ${failures.length}`);

  if (failures.length) {
    console.log("\n## Failures");
    failures.forEach((failure) => console.log(`- ${failure}`));
    process.exitCode = 1;
    return;
  }

  console.log("- Every static CTA, in-page anchor, and interactive case-study route resolved.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
