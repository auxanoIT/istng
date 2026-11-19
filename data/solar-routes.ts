export const solarOverviewPath = "/services/solar-energy";

export const solarServiceSlugs = [
  "residential-solar",
  "commercial-solar",
  "industrial-solar",
  "hybrid-solar-systems",
  "battery-storage",
  "solar-maintenance",
] as const;

export function solarServicePath(slug: (typeof solarServiceSlugs)[number]) {
  return `${solarOverviewPath}/${slug}`;
}
