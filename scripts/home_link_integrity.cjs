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

const REQUIRED_HOME_IDS = [
  "opening",
  "diagnosis",
  "evidence",
  "studio",
  "paths",
  "framework",
  "elements",
  "process",
  "questions",
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

  for (const id of REQUIRED_HOME_IDS) {
    assert(
      html.includes(`id="${id}"`) || html.includes(`data-home-chapter="${id}"`),
      `homepage is missing chapter ${id}`,
    );
  }

  const serverRenderedLinks = [
    'href="/contact"',
    'href="/work"',
    'href="/about"',
  ];

  for (const link of serverRenderedLinks) {
    assert(html.includes(link), `homepage is missing ${link}`);
  }

  console.log("Homepage route and server-rendered link gate passed.");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
