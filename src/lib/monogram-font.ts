// Fetches Cormorant Garamond as TTF for the icon ImageResponse
// renderers (satori reads ttf/otf/woff, never woff2 — requesting the
// Google Fonts stylesheet with a legacy user agent returns ttf URLs).
// Returns null on any failure so the icons can still render with the
// renderer's fallback instead of erroring the route.
export async function monogramFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&display=swap",
      { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/534" } }
    ).then((r) => r.text());
    const url = css.match(/src:\s*url\(([^)]+\.ttf)\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}
