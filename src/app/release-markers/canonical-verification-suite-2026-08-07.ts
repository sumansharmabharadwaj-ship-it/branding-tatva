// Deployable source marker for the consolidated 7 August 2026 preview lane.
// Keeping this inside src ensures the permanent Vercel branch alias receives
// the exact application state that has the 30-minute Contact contract, the
// canonical Insights authority library, and the production-server API gate.
export const canonicalVerificationSuite20260807 = {
  contactContract: "30-minute-canonical",
  insightsAuthority: "27-guide-library",
  apiGate: "production-server",
} as const;
