import { NextResponse } from "next/server";

import {
  buildHubSpotConsentOptions,
  getRequestIpAddress,
  submitToHubSpot,
  verifyTurnstile,
} from "@/lib/integrations";
import { leadSchema } from "@/lib/schemas";
import { formErrors } from "@/lib/form-errors";
import { consultationHubSpotDestination, heroHubSpotDestination, enquiryHubSpotFields } from "@/lib/consultation-hubspot";
import { sendEnquiryEmails } from "@/lib/enquiry-email";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = leadSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      formErrors(parsed.error.issues),
      { status: 400 },
    );
  }

  const isHuman = await verifyTurnstile(parsed.data.turnstileToken);

  if (!isHuman) {
    return NextResponse.json({ error: "Bot verification failed." }, { status: 400 });
  }

  const hubSpotSuccess = await submitToHubSpot({
    ...(parsed.data.context === "hero" ? heroHubSpotDestination() : consultationHubSpotDestination()),
    fields: enquiryHubSpotFields(parsed.data),
    pageUri: new URL(parsed.data.context === "hero" ? "/" : "/book-consultation", request.url).href,
    pageName: parsed.data.context === "hero" ? "Homepage Energy Enquiry" : "Book Consultation",
    hutk: parsed.data.hubspotTrackingCookie,
    ipAddress: getRequestIpAddress(request),
    legalConsentOptions: buildHubSpotConsentOptions(),
  });

  const delivery = await sendEnquiryEmails(parsed.data, hubSpotSuccess);
  if (!hubSpotSuccess && !delivery.storedByEmail) {
    return NextResponse.json({error:"Your enquiry could not be delivered. Please try again or contact us directly."},{status:503});
  }

  return NextResponse.json({ ok: true, acknowledgementSent: delivery.acknowledgementSent });
}
