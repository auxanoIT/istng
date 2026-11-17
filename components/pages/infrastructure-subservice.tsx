import { SubserviceOverview, type SubserviceOverviewContent } from "@/components/pages/subservice-overview";
import { JsonLd } from "@/components/ui/json-ld";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";
import { ContextualResources } from "@/components/resources/resource-connections";

export type InfrastructureSubservicePage = {
  path: string;
  name: string;
  seoTitle: string;
  description: string;
  parent: { name: string; path: string };
  content: SubserviceOverviewContent;
};

export function infrastructureSubserviceMetadata({ path, seoTitle, description, content }: InfrastructureSubservicePage) {
  return buildMetadata({
    path,
    title: seoTitle,
    description,
    imagePath: content.hero.image.src,
    imageAlt: content.hero.image.alt,
  });
}

export function InfrastructureSubservice({ page }: { page: InfrastructureSubservicePage }) {
  const { path, name, description, content, parent } = page;
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
            { "@type": "ListItem", position: 2, name: parent.name, item: absoluteUrl(parent.path) },
            { "@type": "ListItem", position: 3, name, item: url },
          ],
        },
      ]} />
      <SubserviceOverview content={content} />
      <ContextualResources service={path} />
    </>
  );
}
