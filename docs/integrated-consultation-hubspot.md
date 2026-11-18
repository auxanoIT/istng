# Integrated Solutions Technology enquiry delivery

## Dedicated HubSpot account

Account: 149809153 (EU region). The owner confirmed this is the new Integrated Solutions Technology account on 18 November 2026. The previous website destination belonged to another business and must not be reused.

Published forms:

| Website channel | HubSpot form | Public form ID |
| --- | --- | --- |
| Homepage hero energy buttons | Integrated Solutions — Homepage Energy Enquiry | e6094f85-db77-4f49-848e-6202c5161114 |
| Booking, discussion and contact enquiries | Integrated Solutions — Booking & Discussion Enquiry | c71a1658-a193-490c-b7ce-6d1422887470 |

Both forms were visibly confirmed as published in HubSpot. New-contact creation is enabled. The hero form has no workflows. The booking form has an inactive draft follow-up workflow; it must stay OFF because the website sends transactional acknowledgements via Zoho.

The two public destinations are versioned in lib/consultation-hubspot.ts. Stale hosting variables cannot redirect these enquiries to an old account. lib/integrations.ts rejects any other portal or form ID. No HubSpot private token is required for the public Forms submission endpoint.

Standard contact fields are first name, last name, email, phone and message. Company, full name, service interest, source and the complete project or energy answers are preserved in the message. The form-submission history distinguishes the two entry points. No unrelated marketing subscription is created from enquiry consent.

## Zoho delivery

The owner approved Zoho for website emails. The current signed-in mailbox is elijaho@auxanosolutions.net, which receives mail forwarded from ask@istng.com. Receiving forwarded mail does not itself authorise that mailbox to send as ask@istng.com.

Notification recipients, updated at the owner's request:

- ask@istng.com
- elijaho@auxanosolutions.net
- support@istng.com

The owner subsequently selected elijaho@auxanosolutions.net as the outgoing sender, with the display name Integrated Solutions Technology. The prepared ask@istng.com sender remains unverified and is not used. Customer replies go to ask@istng.com. Outgoing messages use the Integrated Solutions Technology display name, confirmed business address and 08050274481. Booking acknowledgements confirm receipt only; they do not promise an appointment before a date and time are agreed.

lib/enquiry-email.ts uses authenticated Zoho SMTP with TLS, escaped HTML, a plain text alternative, and disabled file/URL reads. It reports provider acceptance separately for notifications and acknowledgements. It never sends an acknowledgement if neither CRM nor an owner mailbox accepted the enquiry. Partial internal-mail acceptance preserves the enquiry without claiming every recipient was notified.

Required private hosting settings:

- ZOHO_SMTP_HOST: exact outgoing host shown in the mailbox's SMTP configuration
- ZOHO_SMTP_PORT: 465 (TLS) or 587 (required STARTTLS)
- ZOHO_SMTP_USER: authenticated Zoho mailbox
- ZOHO_SMTP_PASSWORD: mailbox application-specific password, entered privately in Vercel

Do not place SMTP credentials in NEXT_PUBLIC variables, source control, screenshots or chat. A separate verified sender must be authorised before using ask@istng.com with another mailbox's credentials.

## Current verification state

- Both HubSpot forms are published, as observed in the account UI.
- Local regression checks cover the real API routing, consent, new account isolation, mail recipient list, HTML escaping, SMTP success/failure, fallback capture and form submission tracking.
- Vercel Production contains ZOHO_SMTP_HOST=smtppro.zoho.com, ZOHO_SMTP_PORT=465 and ZOHO_SMTP_USER=elijaho@auxanosolutions.net. ZOHO_SMTP_PASSWORD is saved with Vercel's Secret type, after the owner completed Zoho identity verification and generated the application password.
- The current local regression run passed all 66 tests. These use mocked providers and do not prove live CRM or email delivery.
- Browser checks at 390px and 1366px passed for both hero and booking forms: duplicate-click protection, visible success, preserved details after delivery failure, successful retry, and no horizontal overflow. The API was intercepted locally, so no real enquiry or email was sent by these checks.
- Integration commit 7e7df72 was pushed and built successfully in Vercel deployment Fpr3efWpi8zcmsotHqakV7F7ZLLN. A later redeployment of the older navbar commit briefly replaced it; the integration deployment was then promoted back to istng.com. The live hero was checked to confirm the new email-and-consent form was serving before test submissions.
- At 19:52 WAT on 18 November 2026, the live hero and booking forms each returned HTTP 200 with acknowledgementSent=true. The owner-controlled email address was used for both labelled Website Integration Test submissions.
- Both submissions were visibly present in the normal Submissions view of their separate forms in HubSpot account 149809153. The hero record retained its name, phone, company, solar service, hero source, selected energy goal, support answer and monthly-spend answer, with process consent. Its submission ID is 9c22df83-46aa-44f0-a4f3-c0e7f588169a. The booking form separately showed Book Consultation as its conversion page. Because the same email was used, HubSpot correctly associated both submissions with one contact (930012444898); their submission histories remain separate.
- Zoho Inbox showed both customer acknowledgements and both internal notifications. Zoho Sent delivery details confirmed delivery over TLS to all three notification recipient servers for each form: solar at 19:52:18–19 WAT and booking at 19:52:24 WAT. This verifies recipient-server delivery; it does not imply anyone has read a notification.

## Verification for future changes

1. Confirm the correct Zoho SMTP host for elijaho@auxanosolutions.net.
2. Add SMTP credentials to Vercel Production without revealing them in chat.
3. Run lint, typecheck, provider regressions, desktop/mobile form checks and a production build.
4. Push the reviewed change and verify the Vercel production deployment.
5. Submit one labelled hero test and one labelled booking test through the live website using an owner-controlled inbox.
6. Confirm both submissions in the new HubSpot account, all requested internal recipients, and receipt of each customer acknowledgement. HTTP success alone is not proof of inbox delivery.
