import type { Metadata } from "next";

import { absoluteUrl } from "@/lib/utils";
import { resolveSearchCopy } from "@/lib/seo-copy";
import { isRetiredContentPath } from "@/data/site-routes";
import { getImageReplacement } from "@/lib/image-assets";

type MetadataOptions = {
  title: string;
  description: string;
  path?: string;
  imagePath?: string;
  imageAlt?: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
};

const defaultKeywords = [
  "Integrated Solutions Technology",
  "energy and technology solutions Nigeria",
];

// Reserve space for the ellipsis so the final string stays within 158 characters.
const maxMetaDescriptionLength = 155;

function normalizeMetaDescription(description: string) {
  const normalized = description.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxMetaDescriptionLength) {
    return normalized;
  }

  const clipped = normalized.slice(0, maxMetaDescriptionLength + 1);
  const lastSpace = clipped.lastIndexOf(" ");
  const trimmed =
    lastSpace > 120 ? clipped.slice(0, lastSpace) : clipped.slice(0, maxMetaDescriptionLength);

  return `${trimmed.replace(/[,.!?;:]+$/, "")}...`;
}

export function buildMetadata({
  title,
  description,
  path = "/",
  imagePath = "/opengraph-image",
  imageAlt = title,
  keywords = [],
  type = "website",
  publishedTime,
  modifiedTime,
  noIndex = false,
}: MetadataOptions): Metadata {
  ({ title, description } = resolveSearchCopy(path, title, description));
  noIndex = noIndex || isRetiredContentPath(path) || process.env.VERCEL_ENV === "preview";
  const pageUrl = absoluteUrl(path);
  const imageUrl = absoluteUrl(imagePath);
  imageAlt = getImageReplacement(imagePath)?.alt ?? imageAlt;
  const metaDescription = normalizeMetaDescription(description);
  const mergedKeywords = Array.from(
    new Set([...defaultKeywords, ...keywords].filter(Boolean)),
  );

  return {
    title: { absolute: /\bIntegrated Solutions Technology\b/i.test(title) ? title : `${title} | Integrated Solutions Technology` },
    description: metaDescription,
    keywords: mergedKeywords,
    applicationName: "Integrated Solutions Technology",
    authors: [{ name: "Integrated Solutions Technology" }],
    category: "Energy and technology solutions",
    classification: "Business",
    creator: "Integrated Solutions Technology",
    publisher: "Integrated Solutions Technology",
    referrer: "origin-when-cross-origin",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    robots: {
      index: !noIndex,
      follow: true,
      googleBot: {
        index: !noIndex,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description: metaDescription,
      url: pageUrl,
      siteName: "Integrated Solutions Technology",
      type,
      locale: "en_NG",
      countryName: "Nigeria",
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      images: [
        {
          url: imageUrl,
          ...(imagePath === "/opengraph-image" ? { width: 1200, height: 630 } : {}),
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: metaDescription,
      images: [
        {
          url: imageUrl,
          alt: imageAlt,
        },
      ],
    },
  };
}
