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

  const requiredDestinations = [
    "/contact",
    "/work",
    "/about",
    "/services",
    "/insights",
    "/work/dr-haley-nutrition",
    "/work/myshopineurope",
    "/work/executive-springboard",
    "/work/herbalcart",
    "/work/plaxonic-content-portfolio",
  ];

  for (const path of requiredDestinations) {
    if (!urls.has(path)) {
      failures.push(`${path}: required homepage destination is absent`);
    }
  }

  console.log("# Branding Tatva homepage link integrity");
  console.log(`- Internal destinations checked: ${urls.size}`);
  console.log(`- Unique pages requested: ${checkedPages.size}`);
  console.log(`- Failures: ${failures.length}`);

  if (failures.length) {
    console.log("\n## Failures");
    failures.forEach((failure) => console.log(`- ${failure}`));
    process.exitCode = 1;
    return;
  }

  console.log("- Every homepage CTA, case-study route, and in-page anchor resolved.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
