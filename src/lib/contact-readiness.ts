export const CONTACT_MONITOR_SCHEDULE = "production-daily" as const;
export const CONTACT_RATE_LIMIT_SCOPE = "instance-local" as const;

type ContactEnvironment = Readonly<Record<string, string | undefined>>;

/**
 * Public, secrets-free configuration evidence for release verification.
 *
 * `configured` deliberately means only that the required values are present.
 * Provider health is established separately by the authenticated monitor.
 */
export function getContactReadiness(
  environment: ContactEnvironment = process.env,
) {
  const deliveryConfigured = Boolean(
    environment.RESEND_API_KEY?.trim() && environment.CONTACT_TO_EMAIL?.trim(),
  );

  return {
    deliveryConfigured,
    monitorConfigured: Boolean(
      deliveryConfigured && environment.CRON_SECRET?.trim(),
    ),
    monitorSchedule: CONTACT_MONITOR_SCHEDULE,
    rateLimitScope: CONTACT_RATE_LIMIT_SCOPE,
  } as const;
}
