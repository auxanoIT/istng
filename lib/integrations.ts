import { consultationHubSpotDestination, heroHubSpotDestination, integratedHubSpotPortalId } from "./consultation-hubspot";

type HubSpotField = {
  name: string;
  value: string;
};

type HubSpotLegalConsentOptions = {
  consent: {
    consentToProcess: boolean;
    text: string;
    communications: Array<{
      value: boolean;
      subscriptionTypeId: number;
      text: string;
    }>;
  };
};

type HubSpotSubmitOptions = {
  portalId?: string;
  formId?: string;
  fields: HubSpotField[];
  pageUri: string;
  pageName: string;
  hutk?: string;
  ipAddress?: string;
  legalConsentOptions?: HubSpotLegalConsentOptions;
};

export async function verifyTurnstile(token?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    return true;
  }

  if (!token) {
    return false;
  }

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      secret,
      response: token,
    }),
  });

  const result = (await response.json()) as { success?: boolean };
  return Boolean(result.success);
}

export async function submitToHubSpot({
  portalId: configuredPortalId,
  formId,
  fields,
  pageUri,
  pageName,
  hutk,
  ipAddress,
  legalConsentOptions,
}: HubSpotSubmitOptions) {
  // Public destinations are versioned in code so stale hosting variables cannot
  // redirect customer enquiries into the former business's account.
  const portalId = configuredPortalId ?? integratedHubSpotPortalId;
  const finalFormId = formId ?? consultationHubSpotDestination().formId;

  if (portalId !== integratedHubSpotPortalId ||
      ![consultationHubSpotDestination().formId, heroHubSpotDestination().formId].includes(finalFormId)) {
    return false;
  }

  // The new account's two forms use standard contact properties. Preserve any
  // auxiliary tool fields inside the project message instead of submitting
  // unregistered properties, which HubSpot rejects for the entire enquiry.
  const standardNames = new Set(["firstname", "lastname", "email", "phone", "message"]);
  const extra = fields.filter(field => !standardNames.has(field.name));
  const submittedFields = fields.filter(field => standardNames.has(field.name));
  if (extra.length) {
    const message = submittedFields.find(field => field.name === "message");
    const summary = extra.map(field => `${field.name}: ${field.value}`).join("\n");
    const combined = [message?.value, summary].filter(Boolean).join("\n\n");
    const index = submittedFields.findIndex(field => field.name === "message");
    if (index >= 0) submittedFields[index] = { name: "message", value: combined };
    else submittedFields.push({ name: "message", value: combined });
  }

  try {
    const response = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${finalFormId}`,
      {
        method: "POST",
        signal: AbortSignal.timeout(10_000),
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: submittedFields,
          context: {
            ...(hutk ? { hutk } : {}),
            ...(ipAddress ? { ipAddress } : {}),
            pageUri,
            pageName,
          },
          ...(legalConsentOptions ? { legalConsentOptions } : {}),
        }),
      },
    );

    return response.ok;
  } catch {
    // Let callers use the delivery fallback without logging customer details.
    return false;
  }
}

export function buildHubSpotConsentOptions(defaultSubscriptionTypeId?: number) {
  const configuredSubscriptionTypeId = Number(
    defaultSubscriptionTypeId,
  );
  const subscriptionTypeId = Number.isSafeInteger(configuredSubscriptionTypeId) &&
    configuredSubscriptionTypeId > 0 ? configuredSubscriptionTypeId : undefined;

  return {
    consent: {
      consentToProcess: true,
      text: "I agree that Integrated Solutions Technology may store and process my personal data to respond to my request.",
      communications: subscriptionTypeId ? [
        {
          value: true,
          subscriptionTypeId,
          text: "I agree to receive email communication from Integrated Solutions Technology about my request.",
        },
      ] : [],
    },
  };
}

export function getRequestIpAddress(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const firstForwardedIp = forwardedFor?.split(",")[0]?.trim();

  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip") ??
    firstForwardedIp ??
    undefined
  );
}

export async function sendFallbackEmail(subject: string, lines: string[]) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INTEGRATED_LEAD_FALLBACK_EMAIL;
  const from = process.env.INTEGRATED_RESEND_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      signal: AbortSignal.timeout(10_000),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        text: lines.join("\n"),
      }),
    });

    return response.ok;
  } catch {
    return false;
  }
}
