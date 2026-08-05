const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const ROUTES = [
  "/",
  "/about",
  "/services",
  "/work",
  "/contact",
  "/work/dr-haley-nutrition",
  "/work/myshopineurope",
  "/work/herbalcart",
];

const REQUIRED_HOME_CHAPTERS = [
  "opening",
  "recognition",
  "cost",
  "foundation",
  "paths",
  "process",
  "evidence",
  "tatva",
  "studio",
  "decision",
  "invitation",
];

(async () => {
  for (const route of ROUTES) {
    const response = await fetch(`${BASE_URL}${route}`, { redirect: "manual" });
    assert(
      response.status >= 200 && response.status < 400,
      `${route} returned ${response.status}`,
    );
  }

  const homepage = await fetch(`${BASE_URL}/`);
  const html = await homepage.text();

  for (const id of REQUIRED_HOME_CHAPTERS) {
    assert(
      html.includes(`data-home-v4-chapter="${id}"`),
      `V4 homepage is missing chapter ${id}`,
    );
  }

  const serverRenderedLinks = [
    'href="/contact"',
    'href="/work"',
    'href="/about"',
    'href="#recognition"',
    'href="#cost"',
    'href="#foundation"',
    'href="#evidence"',
    'href="/services#desire"',
  ];

  for (const link of serverRenderedLinks) {
    assert(html.includes(link), `V4 homepage is missing ${link}`);
  }

  console.log("V4 homepage route and server-rendered link gate passed.");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
