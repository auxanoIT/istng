"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { TawkChat } from "@/components/layout/tawk-chat";

import { persistAnalyticsConsent as persistConsent, readAnalyticsConsent as readConsent, type AnalyticsConsent as CookieConsent } from '@/lib/analytics-consent';
import { trackContactClick } from '@/lib/lead-analytics';

function GoogleAnalytics() {
  // Public identifier for the dedicated istng.com property (not Auxano/Ideal).
  const gaId = "G-YWBE572JH3";

  useEffect(() => {
    if (!gaId) return;
    function onClick(event: MouseEvent) {
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(link instanceof HTMLAnchorElement)) return;
      if (link.protocol === "tel:") trackContactClick("phone");
      else if (link.protocol === "mailto:") trackContactClick("email");
      else if (["wa.me", "api.whatsapp.com", "web.whatsapp.com"].includes(link.hostname)) trackContactClick("whatsapp");
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [gaId]);

  return gaId ? (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="lazyOnload" />
      <Script id="ga4" strategy="lazyOnload">
        {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${gaId}');`}
      </Script>
    </>
  ) : null;
}

function TrackingScripts() {
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
  const hubspotTrackingId = "149809153";

  return (
    <>
      {clarityId ? (
        <Script id="clarity" strategy="lazyOnload">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "${clarityId}");`}
        </Script>
      ) : null}
      {hubspotTrackingId ? (
        <Script id="hubspot-tracking" strategy="lazyOnload" src={`https://js.hs-scripts.com/${hubspotTrackingId}.js`} />
      ) : null}
      <Analytics />
      <SpeedInsights />
      <TawkChat />
    </>
  );
}

export function CookieConsentManager() {
  const [consent, setConsent] = useState<CookieConsent | null | undefined>();

  useEffect(() => {
    queueMicrotask(() => setConsent(readConsent()));
  }, []);

  function handleAccept() {
    persistConsent("accepted");
    setConsent("accepted");
  }

  if (consent === "accepted") {
    return (
      <>
        <GoogleAnalytics />
        <TrackingScripts />
      </>
    );
  }
  if (consent === undefined || consent === "declined") return null;

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 rounded-lg border border-white/12 bg-[var(--brand-navy)] p-5 text-white shadow-[0_24px_80px_color-mix(in_srgb,var(--brand-navy)_28%,transparent)] sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold">Cookie privacy</p>
            <p className="mt-2 text-sm leading-6 text-white/72">
              We use optional analytics and Tawk.to live chat. Accept to enable
              these additional features, or decline to browse without them.
              {" "}<a href="/privacy" className="underline">Privacy &amp; cookies</a>
            </p>
          </div>
          <div className="flex shrink-0 gap-3">
            <button type="button" onClick={() => { persistConsent("declined"); setConsent("declined"); }} className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/16 px-5 text-sm font-semibold text-white transition hover:border-white/34 hover:bg-white/8">
              Decline
            </button>
            <button type="button" onClick={handleAccept} className="inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--brand-orange)] px-5 text-sm font-semibold text-[var(--brand-navy)] transition hover:bg-[var(--brand-orange-hover)]">
              Accept
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
