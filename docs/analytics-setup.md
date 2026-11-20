# Integrated Solutions Technology analytics

- Website: https://istng.com
- Dedicated Google Analytics account: 417035244
- GA4 property: 565283317
- Web stream: 16383072125
- Measurement ID: G-YWBE572JH3
- Reporting: Nigeria time, NGN. Business objectives: generate leads and understand traffic.
- Google Ads account in setup: 236-552-3605. Nigeria time, USD (explicitly approved). Billing must be completed by the owner; no campaign launch is approved yet.

The public GA identifier is versioned in `components/layout/cookie-consent-manager.tsx`; inherited environment overrides are ignored to prevent sending Integrated visits to another business's property. No server-side Analytics secret is required.

## Measurement

`generate_lead` is registered as a GA4 key event and sent only after the enquiry API returns `{ok:true}`. Parameters are fixed form attribution (`hero`, `consultation`, `contact`) and NGN currency; no invented lead value is assigned. Existing in-flight submission guards and bounded at-most-once analytics queue remain in place. This is an attempt to dispatch, not proof of Google receipt or a qualified sale.

`contact_click` records only `phone`, `email` or `whatsapp`. It is a secondary engagement signal, not a confirmed enquiry. It must not be imported as the primary Ads conversion.

Enhanced measurement retains automatic page views (including browser-history navigation), scrolls, outbound clicks, videos and downloads. Automatic form interaction and site-search events were disabled. Do not add a second page-view handler or a second lead tag. Import the GA4 `generate_lead` key event into the dedicated Ads account once linked; avoid simultaneously adding an equivalent direct Ads conversion as another primary action.

## Consent

Google Analytics and optional tracking/chat mount only after accepted cookie consent. Accepted and declined choices persist for up to one year, with cookie fallback if local storage is blocked. Lead events occurring before consent are not queued for later replay. Cookie preferences in the footer clear the saved choice and reload to unload optional scripts. The privacy notice explains cookie choices and enquiry processing.

## Validation

- `node --test scripts/lead-form-tracking.test.mjs`: API-confirmed successes, failures, duplicate suppression, delayed tag loading, queue expiration, consent and contact payloads.
- `node --test scripts/analytics-consent.browser.test.mjs`: real browser; no tag before consent, persistent decline, one accepted tag/config, phone click, client navigation. External services are stubbed; no artificial lead is delivered to production.
- Production build and lint completed during setup. Live receipt still needs checking after deployment.
