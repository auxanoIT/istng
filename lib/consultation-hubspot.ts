// Public identifiers for the new, dedicated Integrated Solutions HubSpot account.
export const integratedHubSpotPortalId = "149809153";

export function consultationHubSpotDestination() {
  return {
    portalId: integratedHubSpotPortalId,
    formId: "c71a1658-a193-490c-b7ce-6d1422887470",
  };
}

export function heroHubSpotDestination() {
  return {
    portalId: integratedHubSpotPortalId,
    formId: "e6094f85-db77-4f49-848e-6202c5161114",
  };
}

export function consultationHubSpotSubscriptionTypeId(): number | undefined {
  // Transactional replies do not enrol a visitor in a marketing subscription.
  return undefined;
}

export function enquiryHubSpotFields(details: {
  name: string; company: string; email: string; phone: string;
  serviceInterest: string; message: string; context: string;
}) {
  const [firstName, ...rest] = details.name.trim().split(/\s+/);
  return [
    { name: "firstname", value: firstName },
    ...(rest.length ? [{ name: "lastname", value: rest.join(" ") }] : []),
    { name: "email", value: details.email },
    { name: "phone", value: details.phone },
    { name: "message", value: [
      `Full name: ${details.name}`, `Company: ${details.company}`,
      `Service interest: ${details.serviceInterest}`, `Website source: ${details.context}`,
      "", details.message,
    ].join("\n") },
  ];
}
