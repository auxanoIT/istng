import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/utils";
import { canonicalServicePath } from "@/lib/service-routes";
import { getCaseStudies, getIndustries } from "@/lib/content";
import { getResourceSitemap } from "@/lib/resources";
import { getWorkGallery } from "@/lib/work-gallery";
import { getCaseStudyMedia } from "@/lib/case-study-media";
import { primarySolutionPages, journeyPages } from "@/data/site-routes";
import { resourcePath, resourceSections, type ResourceSection } from "@/data/resource-sections";
import { getSolarSubservice } from "@/data/solar-subservices";
import { solarOverviewPath, solarServiceSlugs } from "@/data/solar-routes";
import { getInfrastructureSubservice } from "@/data/infrastructure-subservices";
import { getEnterpriseOverview } from "@/data/enterprise-overview";
import * as solarOverview from "@/data/solar-overview";
import { homeServicePillars } from "@/data/home-service-pillars";
import { operationTeams } from "@/data/operation-teams";
import { aboutContent } from "@/data/about-content";
import { aboutTeam } from "@/data/about-team";
import { installationPortfolio } from "@/data/integrated-case-studies";
import { getCaseStudyServiceCards } from "@/data/case-study-service-cards";
import { solutionPillars } from "@/data/enterprise-solutions";
import { getIndustryEditorial } from "@/data/industry-editorial";
import { industryEditorialImage, industrySolutionImage } from "@/data/industry-section-images";

type Entry = { path: string; images?: string[]; updatedAt?: string };
const imageUrl = (value: unknown): value is string => typeof value === "string" && /\.(?:webp|avif|png|jpe?g)(?:\?.*)?$/i.test(value) && (value.startsWith("/") || value.startsWith("https://"));
function contentImages(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(contentImages);
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, item]) =>
    ["src", "image", "imageSrc"].includes(key) && imageUrl(item) ? [item] : contentImages(item));
}
function solutionImages(path: string, fallback: string) {
  if (path === solarOverviewPath) return contentImages(solarOverview);
  const solarSlug = solarServiceSlugs.find(slug => path === solarOverviewPath + "/" + slug);
  if (solarSlug) return contentImages(getSolarSubservice(solarSlug).content);
  const subservice = getInfrastructureSubservice(path);
  if (subservice) return contentImages(subservice.content);
  const overview = getEnterpriseOverview(path);
  return overview ? contentImages(overview) : [fallback];
}
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, industries, resources, gallery] = await Promise.all([getCaseStudies(), getIndustries(), getResourceSitemap(), getWorkGallery()]);
  const entries: Entry[] = [
    { path: "/", images: ["/integrated-assets/images/solar-campus.webp", "/integrated-assets/images/nigerian-energy-engineer.webp", ...homeServicePillars.items.map(item => item.imageSrc), ...operationTeams.map(team => "/image/operation-teams/" + team.image)] },
    { path: "/solutions", images: solutionPillars.map(page => page.image.src) },
    { path: "/industries", images: industries.map(industry => industry.heroImage.src) },
    { path: "/about", images: [aboutContent.hero.image, aboutContent.story.image, aboutContent.visionMission.image, aboutContent.collaboration.image, ...aboutTeam.map(person => person.image)] },
    { path: "/book-consultation", images: ["/image/value-we-deliver/planning.webp"] },
    { path: "/careers", images: ["/image/service-details/managed-services-monitoring.webp"] },
    { path: "/site-map" },
    { path: "/resources" },
    ...primarySolutionPages.map(page => ({ path: page.href, images: solutionImages(page.href,page.image.src) })),
    ...journeyPages.map(page => ({ path: page.href, images: ["/image/operation-teams/" + page.image] })),
    ...industries.map(industry => {
      const editorial = getIndustryEditorial(industry.slug);
      return { path: industry.href, images: [industry.heroImage.src, ...(editorial ? contentImages({ ...editorial, gallery: undefined }) : [industryEditorialImage(industry.slug,"challenge").src, industryEditorialImage(industry.slug,"why").src, ...industry.solutions.map(item => industrySolutionImage(item.href).src)])] };
    }),
    { path: "/resources/case-studies", images: [...installationPortfolio.map(image => image.src), ...projects.filter(project => !project.textOnly).map(project => getCaseStudyMedia(project).src)] },
    ...projects.map(project => ({ path: "/resources/case-studies/" + project.slug, updatedAt: project.updatedAt, images: project.textOnly ? [] : [getCaseStudyMedia(project).src, ...getCaseStudyServiceCards(project.relatedServiceLinks ?? []).map(card => card.image.src)] })),
    { path: "/resources/our-work", images: gallery.map(album => album.photos[0].src) },
    ...gallery.map(album => ({ path: "/resources/our-work/" + album.id, images: album.photos.map(photo => photo.src) })),
    ...(Object.keys(resourceSections) as ResourceSection[]).filter(section => resources.some(resource => resource.section === section)).map(section => ({ path: resourcePath(section), images: resources.filter(resource => resource.section === section).flatMap(resource => resource.image ? [resource.image] : []) })),
    ...resources.map(resource => ({ path: resourcePath(resource.section,resource.slug), images: resource.images ?? (resource.image ? [resource.image] : []), updatedAt: resource.updatedAt })),
  ];
  const unique = new Map<string,Entry>();
  for (const entry of entries) {
    const canonicalPath = canonicalServicePath(entry.path);
    const previous = unique.get(canonicalPath);
    unique.set(canonicalPath,{ ...previous, ...entry, path: canonicalPath, images: [...new Set([...(previous?.images ?? []), ...(entry.images ?? [])].filter(imageUrl))] });
  }
  return [...unique.values()].sort((a,b) => a.path.localeCompare(b.path)).map(entry => ({
    url: absoluteUrl(entry.path),
    ...(entry.images?.length ? { images: [...new Set(entry.images.map(absoluteUrl))] } : {}),
    ...(entry.updatedAt && !Number.isNaN(Date.parse(entry.updatedAt)) ? { lastModified: entry.updatedAt } : {}),
  }));
}
