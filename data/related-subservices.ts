import { solutionPillars } from "./enterprise-solutions";
import { getOverviewRelatedServices } from "./overview-related-services";
import { getInfrastructureSubservice } from "./infrastructure-subservices";
import { getSolarSubservice } from "./solar-subservices";
import { solarServiceSlugs } from "./solar-routes";
import { canonicalServicePath } from "@/lib/service-routes";
import { serviceCardSummaries } from "./service-card-summaries";
import { resolveSiteImagePath } from "@/lib/image-assets";

function serviceCard(title: string, href: string) {
  const pillar = solutionPillars.find(group => group.items.some(item => item.href === href))!;
  const item = pillar.items.find(item => item.href === href)!;
  const solar = pillar.slug === "solar-energy" ? solarServiceSlugs.find(slug => slug === item.slug) : undefined;
  const image = solar ? getSolarSubservice(solar).content.hero.image : getInfrastructureSubservice(href)?.content.hero.image;
  return { title, href, description: serviceCardSummaries[item.slug], image: image ?? item.image };
}

export function getRelatedSubserviceCards(source: string) {
  const path = canonicalServicePath(source);
  const pillar = solutionPillars.find(group => group.href === path || group.items.some(item => item.href === path));
  if (!pillar) return [];
  const index = pillar.items.findIndex(item => item.href === path);
  const recommendations = getOverviewRelatedServices(pillar.slug);
  if (index < 0) return recommendations.map(item => serviceCard(item.title, item.action.href));
  const candidates = pillar.slug === "solar-energy"
    ? ["hybrid-solar-systems", "battery-storage", "solar-maintenance"]
      .flatMap(slug => pillar.items.filter(item => item.slug === slug && item.href !== path))
    : Array.from({ length: pillar.items.length - 1 }, (_, offset) => pillar.items[(index + offset + 1) % pillar.items.length]);
  const complementary = serviceCard(recommendations[0].title, recommendations[0].action.href);
  const usedImages = new Set([resolveSiteImagePath(complementary.image.src)]);
  const siblings = candidates.map(item => serviceCard(item.title, item.href)).filter(card => {
    const image = resolveSiteImagePath(card.image.src);
    if (usedImages.has(image)) return false;
    usedImages.add(image);
    return true;
  }).slice(0, 2);
  return [...siblings, complementary];
}
