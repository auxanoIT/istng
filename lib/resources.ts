import "server-only";
import { draftMode } from "next/headers";
import { previewToken, sanityFetch } from "@/sanity/lib/client";
import {
  editorialArticleQuery, editorialIndexQuery, planningResourceQuery, planningResourcesQuery,
  relatedResourceCardsQuery, resourceSitemapQuery,
} from "@/sanity/lib/queries";
import { editorialSections, planningSections, type EditorialSection, type PlanningSection, type ResourceSection } from "@/data/resource-sections";
import type { BlogPost } from "@/lib/types";
import { canonicalServicePath, serviceRouteAliases } from "@/lib/service-routes";

export type EditorialCard = Omit<BlogPost, "body" | "takeaways">;
export type ToolKind = "solar" | "infrastructure" | "security";
export type PlanningResource = Pick<BlogPost, "title" | "slug" | "excerpt" | "seo" | "updatedAt" | "relatedIndustries" | "relatedServices" | "relatedReading"> & {
  toolKind?: ToolKind;
  instructions?: string;
  checklist?: string[];
  file?: { url: string; originalFilename?: string; size?: number; mimeType?: string };
};
export type ResourceCard = { title: string; slug: string; excerpt?: string; section: ResourceSection };
type SitemapResource = Pick<ResourceCard, "title" | "slug" | "section"> & { image?: string; images?: string[]; updatedAt?: string };

async function preview() {
  return Boolean(previewToken && (await draftMode()).isEnabled);
}

export async function getEditorialIndex(section: EditorialSection) {
  return await sanityFetch<EditorialCard[]>({ query: editorialIndexQuery, params: { type: editorialSections[section].type }, preview: await preview(), tags: ["resources"] }) ?? [];
}

export async function getEditorialArticle(section: EditorialSection, slug: string) {
  return await sanityFetch<BlogPost>({ query: editorialArticleQuery, params: { type: editorialSections[section].type, slug }, preview: await preview(), tags: ["resources"] });
}

export async function getPlanningIndex(section: PlanningSection) {
  return await sanityFetch<PlanningResource[]>({ query: planningResourcesQuery, params: { type: planningSections[section].type }, preview: await preview(), tags: ["resources"] }) ?? [];
}

export async function getPlanningResource(section: PlanningSection, slug: string) {
  return await sanityFetch<PlanningResource>({ query: planningResourceQuery, params: { type: planningSections[section].type, slug }, preview: await preview(), tags: ["resources"] });
}

export async function getRelatedResourceCards({ industry = "", service = "" }: { industry?: string; service?: string }) {
  if (!industry && !service) return [];
  const canonical = canonicalServicePath(service);
  const serviceAliases = [...new Set([canonical, service, ...Object.keys(serviceRouteAliases).filter(path => serviceRouteAliases[path] === canonical)])].filter(Boolean);
  return await sanityFetch<ResourceCard[]>({
    query: relatedResourceCardsQuery,
    params: { industry, service, serviceAliases, legacyServices: serviceAliases.map(path => path.replace(/^\/services\//, "")) },
    tags: ["resources", "posts"],
  }) ?? [];
}

export async function getResourceSitemap() {
  return await sanityFetch<SitemapResource[]>({ query: resourceSitemapQuery, tags: ["resources"] }) ?? [];
}

export function pdfDownloadHref(file?: PlanningResource["file"]) {
  if (file?.mimeType !== "application/pdf") return undefined;
  try {
    const url = new URL(file.url);
    if (url.protocol !== "https:" || url.hostname !== "cdn.sanity.io" || !url.pathname.startsWith("/files/")) return undefined;
    url.searchParams.set("dl", file.originalFilename?.replace(/[^\p{L}\p{N} ._-]/gu, "") || "download.pdf");
    return url.toString();
  } catch {
    return undefined;
  }
}
