import { NextRequest, NextResponse } from "next/server";

type RateBucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateBucket>();
const DEFAULT_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_LIMIT = 6;
const DEFAULT_MAX_BYTES = 32_000;
const MAX_RATE_BUCKETS = 2_000;

type JsonBodyResult =
  | { ok: true; value: unknown }
  | { ok: false; status: 400 | 413; error: string };

function getClientAddress(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim() || "unknown";
}

function pruneExpiredBuckets(now: number) {
  if (buckets.size < 500) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }

  // A serverless instance should never retain an unbounded collection when
  // hostile clients continuously rotate addresses. Preserve the newest
  // windows and evict the oldest insertion once the defensive ceiling is hit.
  while (buckets.size >= MAX_RATE_BUCKETS) {
    const oldestKey = buckets.keys().next().value;
    if (typeof oldestKey !== "string") break;
    buckets.delete(oldestKey);
  }
}

export function jsonNoStore(
  body: Record<string, unknown>,
  init: { status?: number; headers?: HeadersInit } = {},
) {
  const headers = new Headers(init.headers);
  headers.set("Cache-Control", "no-store");
  headers.set("X-Content-Type-Options", "nosniff");
  return NextResponse.json(body, { ...init, headers });
}

export function guardJsonRequest(
  request: NextRequest,
  options: {
    scope: string;
    limit?: number;
    windowMs?: number;
    maxBytes?: number;
  },
) {
  const contentType = request.headers.get("content-type")?.toLowerCase() || "";
  if (!contentType.includes("application/json")) {
    return jsonNoStore(
      { error: "Please submit the form from the website." },
      { status: 415 },
    );
  }

  const contentLength = Number(request.headers.get("content-length") || "0");
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    return jsonNoStore(
      { error: "That submission is too large. Shorten the message before sending it again." },
      { status: 413 },
    );
  }

  const now = Date.now();
  pruneExpiredBuckets(now);

  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS;
  const limit = options.limit ?? DEFAULT_LIMIT;
  const key = `${options.scope}:${getClientAddress(request)}`;
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  if (current.count >= limit) {
    const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    return jsonNoStore(
      { error: "Several requests arrived from this connection. Wait fifteen minutes before sending another." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  current.count += 1;
  buckets.set(key, current);
  return null;
}

/**
 * Reads the actual request stream with a hard byte ceiling. Content-Length is
 * only an early hint: chunked requests and some proxies omit it entirely.
 */
export async function readJsonBody(
  request: NextRequest,
  maxBytes = DEFAULT_MAX_BYTES,
): Promise<JsonBodyResult> {
  if (!request.body) {
    return { ok: false, status: 400, error: "The server could not read the form data." };
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel().catch(() => undefined);
        return {
          ok: false,
          status: 413,
          error: "That submission is too large. Shorten the message before sending it again.",
        };
      }
      chunks.push(value);
    }
  } catch {
    return { ok: false, status: 400, error: "The server could not read the form data." };
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return { ok: true, value: JSON.parse(new TextDecoder().decode(body)) };
  } catch {
    return { ok: false, status: 400, error: "The server could not read the form data." };
  }
}

export async function fetchWithTimeout(
  input: string,
  init: RequestInit,
  timeoutMs = 10_000,
) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export function singleLine(value: string) {
  return value.replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ").trim();
}
