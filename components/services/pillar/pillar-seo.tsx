import type { Metadata } from "next";
import { JsonLd } from "@/components/ui/json-ld";
import { absoluteUrl } from "@/lib/utils";
import { resolveSearchCopy } from "@/lib/seo-copy";
import { isRetiredContentPath } from "@/data/site-routes";
import type { ServicePillar } from "@/data/service-pillars";

export function pillarMetadata(pillar: ServicePillar): Metadata {
  const url = absoluteUrl(`/services/${pillar.slug}`);
  const image = { url: absoluteUrl(pillar.hero.src), alt: pillar.hero.alt };
  const { title, description } = resolveSearchCopy(`/services/${pillar.slug}`, pillar.seoTitle, pillar.description);
  return {
    title: { absolute: title }, description,
    keywords: pillar.keywords, alternates: { canonical: url },
    robots: { index: !isRetiredContentPath(`/services/${pillar.slug}`) && process.env.VERCEL_ENV !== "preview", follow: true },
    openGraph: { title, description, url, siteName: "Integrated Solutions Technology", locale: "en_NG", type: "website", images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export function PillarSchema({ pillar }: { pillar: ServicePillar }) {
  const url = absoluteUrl(`/services/${pillar.slug}`);
  return <JsonLd data={[
    { "@context": "https://schema.org", "@type": "Service", "@id": `${url}#service`, name: pillar.title, serviceType: pillar.title, description: pillar.description, url, image: absoluteUrl(pillar.hero.src), provider: { "@id": `${absoluteUrl("/")}#organization` }, areaServed: { "@type": "Country", name: "Nigeria" } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Services", item: absoluteUrl("/solutions") },
      { "@type": "ListItem", position: 3, name: pillar.title, item: url },
    ] },
  ]} />;
}
