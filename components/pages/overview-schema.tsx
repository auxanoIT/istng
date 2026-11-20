import { JsonLd } from "@/components/ui/json-ld";
import { absoluteUrl } from "@/lib/utils";

export function OverviewSchema({ name, description, path, image }: {
  name: string; description: string; path: string; image: string;
}) {
  const url = absoluteUrl(path);
  return <JsonLd data={[
    {
      "@context": "https://schema.org", "@type": "Service", "@id": `${url}#service`,
      name, description, url, image: absoluteUrl(image),
      provider: { "@id": `${absoluteUrl("/")}#organization` },
      areaServed: { "@type": "Country", name: "Nigeria" },
    },
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Services", item: absoluteUrl("/services") },
        { "@type": "ListItem", position: 3, name, item: url },
      ],
    },
  ]} />;
}
