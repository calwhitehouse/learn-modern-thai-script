/** GA4 measurement ID — override via NEXT_PUBLIC_GA_MEASUREMENT_ID in production. */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "G-820K5GYWRP";

export function isAnalyticsEnabled(): boolean {
  return Boolean(GA_MEASUREMENT_ID);
}
