import type { InfrastructureSubservicePage } from "@/components/pages/infrastructure-subservice";
import { solutionPillars } from "@/data/enterprise-solutions";
import { overviewImages as photo } from "@/data/overview-images";
import type { ServiceNavMedia } from "@/lib/types";
import copy from "./network-subservice-copy.json";

type NetworkBrief = keyof typeof copy;
type NetworkAssets = {
  slug: string;
  description: string;
  hero: ServiceNavMedia;
  process: ServiceNavMedia[];
  gallery: ServiceNavMedia[];
};

const detail = (file: string, alt: string): ServiceNavMedia => ({ src: `/image/service-details/${file}.webp`, alt });
const rack = detail("network-cabling-rack", "Labelled patch panels and neatly routed copper and fibre cables");
const switches = detail("network-equipment-switches-routers", "Enterprise network switches and routers staged for installation");
const accessPoints = detail("network-equipment-access-points", "Business Wi-Fi access points and network equipment");
const fibreComponents = detail("network-cabling-backbone", "Fibre patch cords, couplers and distribution equipment");
const transceivers = detail("consumables-sfp-transceivers", "Fibre transceivers and colour-coded optical patch cords");
const copperComponents = detail("consumables-patch-cables", "Ethernet patch leads and connectors");
const cabinet = detail("network-equipment-firewalls", "Rack-mounted network switches and security appliances");
const office = detail("network-config-small-business", "Business workstations and connected office equipment");
const front = { src: "/image/our-work/integrated-solutions-data-centre-rack-r07-11-front.webp", alt: "Front of an installed rack showing equipment and ports" };
const rear = { src: "/image/our-work/integrated-solutions-data-centre-rack-r08-11-rear.webp", alt: "Rear of an installed rack showing cable routing and equipment connections" };
const comparison = { src: "/image/operation-teams/network-rack-remediation-comparison.webp", alt: "Illustrated comparison of cabling before and after rack remediation" };
const wirelessEquipment = { src: "/image/case-studies/integrated-generated/network-wireless-equipment-supply-illustration.webp", alt: "Enterprise wireless access points and networking equipment" };

const pages: Record<NetworkBrief, NetworkAssets> = {
  design: {
    slug: "network-design-with-diagram",
    description: "Network design and installation in Nigeria for offices and enterprise facilities, from site surveys and equipment planning to configuration and testing.",
    hero: photo.planning,
    process: [photo.planning, photo.consulting, switches, photo.monitoring],
    gallery: [photo.planning, switches, office, photo.monitoring],
  },
  lan: {
    slug: "structured-lan-cabling",
    description: "Structured LAN cabling in Nigeria with Cat6 and Cat6A Ethernet, network outlets, patch panels, cable testing and labelling for businesses.",
    hero: photo.copper,
    process: [photo.planning, copperComponents, rack, photo.copper],
    gallery: [office, copperComponents, rack, photo.copper],
  },
  fibre: {
    slug: "fibre-optic-cabling",
    description: "Fibre optic cabling in Nigeria for business backbones and links between buildings, with fibre termination, patching and verification.",
    hero: photo.fibre,
    process: [photo.planning, photo.fibre, transceivers, fibreComponents],
    gallery: [photo.fibre, fibreComponents, rack, transceivers],
  },
  wireless: {
    slug: "wireless-networks",
    description: "Business Wi-Fi design and installation in Nigeria, including site surveys, access point deployment, guest networks and coverage testing.",
    hero: photo.wireless,
    process: [photo.wireless, accessPoints, wirelessEquipment, photo.monitoring],
    gallery: [photo.wireless, wirelessEquipment, photo.monitoring, accessPoints],
  },
  upgrades: {
    slug: "network-configurations",
    description: "Network configuration and upgrades in Nigeria, including switch, router and VLAN setup, hardware upgrades and connectivity checks.",
    hero: photo.monitoring,
    process: [photo.monitoring, cabinet, switches, photo.copper],
    gallery: [switches, cabinet, front, photo.monitoring],
  },
  equipment: {
    slug: "network-equipment-installation",
    description: "Network equipment installation in Nigeria for switches, routers, access points and network appliances, with rack mounting and connection checks.",
    hero: switches,
    process: [photo.planning, switches, photo.wireless, rack],
    gallery: [switches, cabinet, photo.wireless, rear],
  },
  labelling: {
    slug: "cable-labelling-port-mapping",
    description: "Cable labelling and switch port mapping in Nigeria, including cable tracing, patch-panel identification and records for easier troubleshooting.",
    hero: rack,
    process: [photo.copper, rack, front, photo.planning],
    gallery: [photo.copper, rack, front, photo.planning],
  },
  remediation: {
    slug: "rack-cabling-remediation",
    description: "Cable routing and rack remediation in Nigeria to organise patch cords, improve access and document connections in existing network cabinets.",
    hero: comparison,
    process: [photo.copper, rear, comparison, photo.monitoring],
    gallery: [comparison, rear, copperComponents, photo.copper],
  },
};

const pillar = solutionPillars.find(({ slug }) => slug === "network-structured-cabling")!;
const pagePaths = new Map(
  (Object.keys(pages) as NetworkBrief[]).map((key) => {
    const service = pillar.items.find(({ slug }) => slug === pages[key].slug);
    if (!service) throw new Error(`Missing Network navigation route for ${pages[key].slug}`);
    return [service.href, key] as const;
  }),
);

export const networkSubservicePaths = [...pagePaths.keys()];

export function getNetworkSubservice(path: string): InfrastructureSubservicePage | undefined {
  const key = pagePaths.get(path);
  if (!key) return undefined;

  const brief = copy[key];
  const assets = pages[key];
  const consultation = `/book-consultation?${new URLSearchParams({ infrastructureService: assets.slug })}#project-enquiry`;
  return {
    path,
    name: brief.name,
    seoTitle: `${brief.name} in Nigeria`,
    description: assets.description,
    parent: { name: pillar.label, path: pillar.href },
    content: {
      hero: {
        title: brief.hero.title,
        paragraphs: [assets.description],
        image: assets.hero,
        actions: [
          { label: brief.hero.primary, href: consultation },
          { label: brief.hero.secondary, href: "#service-process" },
        ],
      },
      benefits: brief.benefits,
      process: {
        title: brief.process.title,
        paragraphs: brief.process.paragraphs,
        label: `${brief.name} stages`,
        entries: brief.process.entries.map(({ cta, ...entry }, index) => ({
          ...entry,
          image: assets.process[index],
          action: { label: cta, href: consultation },
        })),
      },
      gallery: {
        ...brief.gallery,
        paragraphs: brief.gallery.paragraphs,
        items: brief.gallery.items.map((item, index) => ({ ...item, image: assets.gallery[index] })),
        action: { label: brief.gallery.cta, href: consultation },
      },
      faq: { ...brief.faq, action: { label: brief.faq.cta, href: consultation } },
      closing: {
        title: brief.closing.title,
        paragraphs: brief.closing.paragraphs,
        image: rack,
        actions: [{ label: brief.closing.primary, href: consultation }, { label: brief.closing.secondary, href: pillar.href }],
      },
    },
  };
}
