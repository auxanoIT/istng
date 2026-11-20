import { solutionPillars } from "@/data/enterprise-solutions";
import type { ServiceNavMedia } from "@/lib/types";

const details: Record<string, { description: string; image: ServiceNavMedia }> = {
  "solar-energy": {
    description: "Solar and battery systems planned around your power needs.",
    image: { src: "/integrated-assets/images/rooftop-solar-panel-technicians.webp", alt: "Nigerian solar technicians inspecting rooftop solar panels" },
  },
  "data-centre-infrastructure": {
    description: "Organised infrastructure for reliable digital operations.",
    image: { src: "/integrated-assets/images/solutions/data-centre-infrastructure-nigeria-hero.webp", alt: "Nigerian engineers reviewing equipment in a data centre", objectPosition: "70% 50%" },
  },
  "network-structured-cabling": {
    description: "Connections that keep your business working together.",
    image: { src: "/integrated-assets/images/brand-refresh/structured-network-rack.webp", alt: "Organised network patch panels and blue structured cabling" },
  },
  "server-storage-hardware": {
    description: "Enterprise equipment matched to your workloads.",
    image: { src: "/integrated-assets/images/brand-refresh/rackmount-server-supply.webp", alt: "Enterprise rackmount servers and installation rails" },
  },
  "security-surveillance": {
    description: "Better visibility and controlled access for your property.",
    image: { src: "/integrated-assets/images/technical-gallery/office-cctv-installation.webp", alt: "Nigerian technician installing a dome CCTV camera in an office", objectPosition: "50% 35%" },
  },
  "it-services-support": {
    description: "Practical expertise, maintenance and ongoing support.",
    image: { src: "/integrated-assets/images/overview/technology-consultation.webp", alt: "Nigerian technology specialists discussing infrastructure requirements with a client" },
  },
};

export const serviceDirectory = solutionPillars.map(pillar => ({ ...pillar, ...details[pillar.slug] }));
