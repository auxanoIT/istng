import { solutionPillars } from "./enterprise-solutions";
import { getOverviewRelatedServices } from "./overview-related-services";
import { getInfrastructureSubservice } from "./infrastructure-subservices";
import { getSolarSubservice } from "./solar-subservices";
import { solarServiceSlugs } from "./solar-routes";
import { canonicalServicePath } from "@/lib/service-routes";

export function getRelatedSubserviceCards(source: string) {
  const path = canonicalServicePath(source);
  const pillar = solutionPillars.find(group => group.href === path || group.items.some(item => item.href === path));
  if (!pillar) return [];
  const index = pillar.items.findIndex(item => item.href === path);
  const recommendations = getOverviewRelatedServices(pillar.slug);
  if (index < 0) return recommendations.map(item => ({ title: item.title, href: item.action.href, description: item.paragraphs[0] }));
  const siblings = pillar.slug === "solar-energy"
    ? ["hybrid-solar-systems", "battery-storage", "solar-maintenance"]
      .flatMap(slug => pillar.items.filter(item => item.slug === slug && item.href !== path)).slice(0, 2)
    : [1, 2].map(offset => pillar.items[(index + offset) % pillar.items.length]);
  return [
    ...siblings.map(item => {
      const solar = pillar.slug === "solar-energy" ? solarServiceSlugs.find(slug => slug === item.slug) : undefined;
      const description = solar ? getSolarSubservice(solar).description : getInfrastructureSubservice(item.href)?.description;
      return { title: item.title, href: item.href, description: description ?? pillar.description };
    }),
    { title: recommendations[0].title, href: recommendations[0].action.href, description: recommendations[0].paragraphs[0] },
  ].filter(item => item.href !== path);
}
