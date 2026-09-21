// Submit every sitemap URL to IndexNow (Bing, Yandex, Seznam, Naver pick this up).
// Run AFTER a deploy that includes public/<key>.txt, so the key file is live:
//   node scripts/indexnow_ping.mjs
// Safe to re-run; IndexNow deduplicates submissions.

const HOST = "brandingtatva.com";
const KEY = "2ea5ac4044554559a9b5d2ce6157c1e5";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

async function main() {
  const keyRes = await fetch(KEY_LOCATION);
  const keyBody = (await keyRes.text()).trim();
  if (!keyRes.ok || keyBody !== KEY) {
    console.error(
      `Key file is not live yet at ${KEY_LOCATION} (status ${keyRes.status}). ` +
        "Deploy first, then re-run."
    );
    process.exit(1);
  }

  const sitemapRes = await fetch(`https://${HOST}/sitemap.xml`);
  const sitemap = await sitemapRes.text();
  const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1])
    .filter((u) => u.startsWith(`https://${HOST}`));
  if (urlList.length === 0) {
    console.error("No URLs found in sitemap.");
    process.exit(1);
  }

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
  });
  console.log(`Submitted ${urlList.length} URLs to IndexNow: HTTP ${res.status}`);
  if (!res.ok) {
    console.error(await res.text());
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
