import catalogue from "../data/service-route-migration.json";

export const canonicalServicePages = catalogue.flatMap(group => [group, ...group.services]);
export const serviceRouteAliases: Record<string, string> = {
  "/solutions": "/services",
  "/solutions/business-energy": "/services/solar-energy/commercial-solar",
  "/solutions/enterprise-it": "/services/it-services-support",
  "/solutions/institutional-solutions": "/services/solar-energy",
  "/services/smart-hands-technical-support": "/services/it-services-support",
  "/services/smart-hands-technical-support/planned-maintenance-support": "/services/it-services-support/it-managed-services-staff-outsourcing",
  "/services/infrastructure-audit-optimisation": "/services/it-services-support/it-consultancy-audit-services",
  "/services/data-centre-project-lifecycle-management": "/services/it-services-support/it-project-management",
  "/industries/enterprise-it": "/industries/corporate-offices",
  "/industries/oems-technology-vendors": "/industries/technology-partners",
  "/industries/managed-service-providers": "/industries/technology-partners",
  "/industries/system-integrators": "/industries/technology-partners",
};
for (const page of canonicalServicePages) {
  if (page.legacyPath !== page.path) serviceRouteAliases[page.legacyPath] = page.path;
}
// Earlier solar links also used a flat /solutions/{subservice} address.
for (const page of catalogue[0].services) {
  serviceRouteAliases[`/solutions/${page.legacyPath.split("/").at(-1)}`] = page.path;
}

export function canonicalServicePath(source: string): string {
  if (/^https?:\/\//i.test(source)) {
    const url = new URL(source);
    if (!["istng.com", "www.istng.com"].includes(url.hostname)) return source;
    const destination = serviceRouteAliases[url.pathname];
    return destination ? new URL(destination + url.search + url.hash, url.origin).href : source;
  }
  const boundary = source.search(/[?#]/);
  const pathname = boundary < 0 ? source : source.slice(0, boundary);
  return serviceRouteAliases[pathname] ? serviceRouteAliases[pathname] + (boundary < 0 ? "" : source.slice(boundary)) : source;
}
