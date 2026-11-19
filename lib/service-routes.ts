import catalogue from "../data/service-route-migration.json";

export const canonicalServicePages = catalogue.flatMap(group => [group, ...group.services]);
export const serviceRouteAliases: Record<string, string> = { "/solutions": "/services" };
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
