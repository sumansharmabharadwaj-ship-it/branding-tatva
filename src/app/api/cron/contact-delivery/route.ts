import { NextRequest } from "next/server";
import { fetchWithTimeout, jsonNoStore } from "@/lib/api-protection";
import { probeContactDeliveryProvider } from "@/lib/contact-delivery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const ROUTE = "/api/cron/contact-delivery";

type LogLevel = "info" | "error";

function monitorLog(
  level: LogLevel,
  event: string,
  fields: Record<string, unknown>,
) {
  const line = JSON.stringify({
    level,
    event,
    route: ROUTE,
    ...fields,
  });
  if (level === "error") console.error(line);
  else console.info(line);
}

export async function GET(request: NextRequest) {
  const startedAt = Date.now();
  const requestId = crypto.randomUUID();
  const vercelRequestId = request.headers.get("x-vercel-id") || null;
  const logContext = { requestId, vercelRequestId };
  const cronSecret = process.env.CRON_SECRET?.trim();

  if (!cronSecret) {
    monitorLog("error", "contact_delivery_monitor_unconfigured", {
      ...logContext,
      durationMs: Date.now() - startedAt,
    });
    return jsonNoStore(
      { ok: false, status: "unconfigured", requestId },
      { status: 503 },
    );
  }

  if (request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    monitorLog("error", "contact_delivery_monitor_unauthorized", {
      ...logContext,
      durationMs: Date.now() - startedAt,
    });
    return jsonNoStore(
      { ok: false, status: "unauthorized", requestId },
      { status: 401 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const replyTo = process.env.CONTACT_TO_EMAIL?.trim();
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL?.trim() ||
    "Branding Tatva <contact@brandingtatva.com>";

  if (!apiKey || !replyTo) {
    monitorLog("error", "contact_delivery_monitor_missing_configuration", {
      ...logContext,
      durationMs: Date.now() - startedAt,
      resendConfigured: Boolean(apiKey),
      replyDestinationConfigured: Boolean(replyTo),
    });
    return jsonNoStore(
      { ok: false, status: "unconfigured", requestId },
      { status: 503 },
    );
  }

  monitorLog("info", "contact_delivery_monitor_started", logContext);

  try {
    const delivery = await probeContactDeliveryProvider(
      {
        apiKey,
        fromEmail,
        replyTo,
        scope: process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown",
      },
      fetchWithTimeout,
    );

    if (!delivery.ok) {
      monitorLog("error", "contact_delivery_monitor_rejected", {
        ...logContext,
        durationMs: Date.now() - startedAt,
        providerStatus: delivery.providerStatus,
      });
      return jsonNoStore(
        { ok: false, status: "degraded", requestId },
        { status: 503 },
      );
    }

    monitorLog("info", "contact_delivery_monitor_accepted", {
      ...logContext,
      durationMs: Date.now() - startedAt,
      deliveryId: delivery.deliveryId,
    });
    return jsonNoStore({ ok: true, status: "healthy", requestId });
  } catch (error) {
    monitorLog("error", "contact_delivery_monitor_failed", {
      ...logContext,
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    });
    return jsonNoStore(
      { ok: false, status: "degraded", requestId },
      { status: 503 },
    );
  }
}
