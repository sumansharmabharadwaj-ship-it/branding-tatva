import { NextRequest, NextResponse } from "next/server";

type RateBucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateBucket>();
const DEFAULT_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_LIMIT = 6;
const DEFAULT_MAX_BYTES = 32_000;

function getClientAddress(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim() || "unknown";
}

function pruneExpiredBuckets(now: number) {
  if (buckets.size < 500) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
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

export async function readGuardedJsonRequest(
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
    return {
      response: jsonNoStore(
        { error: "Please submit the form from the website." },
        { status: 415 },
      ),
      body: null,
    };
  }

  const contentLength = Number(request.headers.get("content-length") || "0");
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    return {
      response: jsonNoStore(
        { error: "That submission is too large. Please shorten the message and try again." },
        { status: 413 },
      ),
      body: null,
    };
  }

  const now = Date.now();
  pruneExpiredBuckets(now);
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS;
  const limit = options.limit ?? DEFAULT_LIMIT;
  const key = `${options.scope}:${getClientAddress(request)}`;
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
  } else if (current.count >= limit) {
    const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    return {
      response: jsonNoStore(
        { error: "Too many attempts. Please wait a little before trying again." },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(current.resetAt / 1000)),
          },
        },
      ),
      body: null,
    };
  } else {
    current.count += 1;
    buckets.set(key, current);
  }

  const rawBody = await request.text().catch(() => null);
  if (rawBody === null) {
    return {
      response: jsonNoStore({ error: "Invalid submission." }, { status: 400 }),
      body: null,
    };
  }

  if (new TextEncoder().encode(rawBody).byteLength > maxBytes) {
    return {
      response: jsonNoStore(
        { error: "That submission is too large. Please shorten the message and try again." },
        { status: 413 },
      ),
      body: null,
    };
  }

  try {
    return { response: null, body: JSON.parse(rawBody) as unknown };
  } catch {
    return {
      response: jsonNoStore({ error: "Invalid submission." }, { status: 400 }),
      body: null,
    };
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
