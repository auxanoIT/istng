import { createClient } from "next-sanity";
import "server-only";
import { updateLegacyBrand } from "@/lib/site-brand";
import { apiVersion, dataset, projectId } from "../config";

export const previewToken = process.env.SANITY_API_READ_TOKEN;

export const isSanityEnabled = Boolean(projectId);

// Published content changes infrequently. This is request-driven cache expiry,
// not a scheduled job. A configured publish webhook can invalidate it sooner.
const PUBLISHED_CACHE_SECONDS = 24 * 60 * 60;

export function getSanityClient(preview = false) {
  if (!isSanityEnabled) {
    return null;
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    perspective: preview ? "drafts" : "published",
    token: preview ? previewToken : undefined,
  });
}

type SanityFetchOptions = {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
  preview?: boolean;
};

export async function sanityFetch<T>({
  query,
  params,
  tags,
  preview = false,
}: SanityFetchOptions) {
  // Only these collections are managed in the content studio.
  if (!tags?.some((tag) => ["posts", "caseStudies", "careerOpenings", "galleryAlbums", "resources"].includes(tag))) {
    return null;
  }
  const client = getSanityClient(preview);

  if (!client) {
    return null;
  }

  try {
    const content = await client.fetch<T>(query, params ?? {}, {
      next: {
        tags,
        revalidate: preview ? 0 : tags?.some(tag => ["resources", "posts", "caseStudies", "galleryAlbums"].includes(tag)) ? 60 : PUBLISHED_CACHE_SECONDS,
      },
    });
    return updateLegacyBrand(content);
  } catch (error) {
    if (preview) throw error;
    console.warn("Sanity published content is temporarily unavailable.", error instanceof Error ? error.name : "");
    return null;
  }
}
