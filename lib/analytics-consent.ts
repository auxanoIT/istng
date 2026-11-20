export const ANALYTICS_CONSENT_KEY = "integrated_solutions_cookie_consent";
export type AnalyticsConsent = "accepted" | "declined";

export function readAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
    if (stored === "accepted" || stored === "declined") return stored;
  } catch { /* Cookies remain available when local storage is blocked. */ }
  if (typeof document === "undefined") return null;
  const stored = document.cookie.split("; ").find(value => value.startsWith(`${ANALYTICS_CONSENT_KEY}=`))?.split("=")[1];
  return stored === "accepted" || stored === "declined" ? stored : null;
}

export function persistAnalyticsConsent(value: AnalyticsConsent) {
  try { window.localStorage.setItem(ANALYTICS_CONSENT_KEY, value); } catch { /* Cookie fallback. */ }
  document.cookie = `${ANALYTICS_CONSENT_KEY}=${value}; Max-Age=31536000; Path=/; SameSite=Lax${window.location.protocol === "https:" ? "; Secure" : ""}`;
}
