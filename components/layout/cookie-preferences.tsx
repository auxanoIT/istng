"use client";

import { ANALYTICS_CONSENT_KEY } from "@/lib/analytics-consent";

export function CookiePreferences() {
  function reset() {
    try { window.localStorage.removeItem(ANALYTICS_CONSENT_KEY); } catch { /* Cookie fallback. */ }
    document.cookie = `${ANALYTICS_CONSENT_KEY}=; Max-Age=0; Path=/; SameSite=Lax`;
    // Reload also removes already loaded optional scripts before a new choice.
    window.location.reload();
  }
  return <button type="button" onClick={reset} className="min-h-11 underline underline-offset-4">Cookie preferences</button>;
}
