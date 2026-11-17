import type { SolutionCard } from "@/components/sections/solution-card-grid";
import { solutionPillars } from "./enterprise-solutions";

const custom: Record<string, { description: string; file?: string; alt?: string }> = {
  "/solutions/solar-energy/hybrid-solar-systems": { description: "Solar, battery and backup power working together.", file: "hybrid-inverter-service-card", alt: "Hybrid inverter with neatly enclosed connections and electrical protection" },
  "/solutions/solar-energy/battery-storage": { description: "Store energy for the moments you need it most.", file: "battery-storage-service-card", alt: "Indoor lithium battery cabinet connected to electrical protection" },
  "/solutions/solar-energy/residential-solar": { description: "Solar power designed around your home and everyday needs." },
  "/solutions/solar-energy/commercial-solar": { description: "Solar energy planned around the way your business operates." },
  "/services/data-centre-deployment": { description: "Infrastructure planned around your digital operations." },
};

export function getCaseStudyServiceCards(services: { title: string; href: string }[]): SolutionCard[] {
  return services.flatMap(service => {
    const pillar = solutionPillars.find(pillar => pillar.href === service.href || pillar.items.some(item => item.href === service.href));
    if (!pillar) return [];
    const item = pillar.items.find(item => item.href === service.href);
    const content = custom[service.href];
    return [{
      ...service,
      paragraphs: [content?.description ?? pillar.description],
      cta: "Explore solution",
      image: content?.file ? { src: `/image/service-cards/${content.file}.webp`, alt: content.alt ?? service.title } : item?.image ?? pillar.image,
    }];
  });
}
