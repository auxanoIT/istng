import { notFound } from "next/navigation";

import { SubserviceOverview } from "@/components/pages/subservice-overview";
import { ContextualResources } from "@/components/resources/resource-connections";
import { JsonLd } from "@/components/ui/json-ld";
import { solarOverviewPath, solarServicePath, solarServiceSlugs } from "@/data/solar-routes";
import { getSolarSubservice } from "@/data/solar-subservices";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";

type SolarServiceProps = { params: Promise<{ subservice: string }> };

export function generateStaticParams() {
  return solarServiceSlugs.map((subservice) => ({ subservice }));
}

function getSolarService(subservice: string) {
  const slug = solarServiceSlugs.find((item) => item === subservice);
  if (!slug) notFound();

  return { path: solarServicePath(slug), ...getSolarSubservice(slug) };
}

export async function generateMetadata({ params }: SolarServiceProps) {
  const { subservice } = await params;
  const { path, name, description, content } = getSolarService(subservice);
  return buildMetadata({
    path,
    title: `${name} in Nigeria`,
    description,
    imagePath: content.hero.image.src,
    imageAlt: content.hero.image.alt,
  });
}

export default async function SolarServicePage({ params }: SolarServiceProps) {
  const { subservice } = await params;
  const { path, name, description, content } = getSolarService(subservice);
  const url = absoluteUrl(path);
  return (
    <>
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": `${url}#service`,
          name,
          description,
          url,
          image: absoluteUrl(content.hero.image.src),
          provider: { "@id": `${absoluteUrl("/")}#organization` },
          areaServed: { "@type": "Country", name: "Nigeria" },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: "Solar Energy & Power Solutions", item: absoluteUrl(solarOverviewPath) },
            { "@type": "ListItem", position: 3, name, item: url },
          ],
        },
      ]} />
      <SubserviceOverview content={content} />
      <ContextualResources service={path} />
    </>
  );
}
