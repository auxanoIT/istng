import type { SubserviceOverviewContent } from "@/components/pages/subservice-overview";
import { solutionPillars } from "@/data/enterprise-solutions";
import { overviewImages } from "@/data/overview-images";
import type { ServiceNavMedia } from "@/lib/types";
import copy from "./data-centre-subservice-copy.json";

type BriefKey = keyof typeof copy;
type PageAssets = {
  slug: string;
  seoTitle: string;
  description: string;
  hero: ServiceNavMedia;
  process: ServiceNavMedia[];
  gallery: ServiceNavMedia[];
};

const detail = (file: string, alt: string): ServiceNavMedia => ({ src: `/image/service-details/${file}.webp`, alt });
const deployment = (file: string, alt: string): ServiceNavMedia => ({ src: `/image/service-pillars/${file}.webp`, alt });
const room = detail("data-centre-buildout", "A server room with rows of equipment racks and an open service aisle");
const cooling = detail("data-centre-cooling", "Cooling equipment and server racks in a data centre aisle");
const power = detail("data-centre-power", "Data centre power equipment in a dedicated rack");
const cabling = detail("network-cabling-rack", "Structured copper and fibre cabling in a rack");
const equipment = detail("server-new-supply", "Enterprise servers staged for installation");
const switches = detail("network-equipment-switches-routers", "Network switches and supporting equipment");
const firewall = detail("network-equipment-firewalls", "Rack-mounted network and security appliances");
const audit = deployment("data-centre-infrastructure-audit-inspection-nigeria", "Nigerian engineer inspecting a data centre rack");
const installation = deployment("data-centre-rack-and-stack-deployment-nigeria", "Two Nigerian engineers mounting enterprise hardware in a rack");
const inService = deployment("integrated-live-data-centre-deployment-clean", "Nigerian technicians working beside active server racks");
const coordination = deployment("integrated-project-coordination-clean", "Nigerian project team coordinating data centre work");
const rackFront = { src: "/image/our-work/integrated-solutions-data-centre-rack-r07-11-front.webp", alt: "Front view of an installed rack showing mounted equipment" };
const rackRear = { src: "/image/our-work/integrated-solutions-data-centre-rack-r08-11-rear.webp", alt: "Rear of an installed rack showing connections and cable routes" };

const pages: Record<BriefKey, PageAssets> = {
  planning: {
    slug: "data-centre-planning",
    seoTitle: "Data Centre Design & Infrastructure Planning in Nigeria",
    description: "Plan your data centre in Nigeria with facility assessments, rack layouts, cabling routes and power and cooling coordination.",
    hero: overviewImages.planning,
    process: [audit, room, cooling, coordination],
    gallery: [audit, room, cabling, inService],
  },
  "server-room": {
    slug: "data-centre-services",
    seoTitle: "Server Room Setup & Deployment in Nigeria",
    description: "Set up a server room in Nigeria with rack installation, structured cabling, equipment deployment and checks before handover.",
    hero: room,
    process: [audit, cabling, installation, overviewImages.monitoring],
    gallery: [rackFront, rackRear, inService, audit],
  },
  "rack-and-stack": {
    slug: "rack-and-stack",
    seoTitle: "Data Centre Rack-and-Stack Services in Nigeria",
    description: "Rack-and-stack services in Nigeria for servers, storage and network appliances, from equipment staging and rack mounting to cabling and verification.",
    hero: installation,
    process: [equipment, installation, rackRear, audit],
    gallery: [rackFront, firewall, rackRear, audit],
  },
  "equipment-installation": {
    slug: "equipment-installation",
    seoTitle: "Data Centre Equipment Installation in Nigeria",
    description: "Install servers, storage and network appliances in Nigerian data centres, with equipment placement, connectivity checks and documented handover.",
    hero: inService,
    process: [equipment, installation, power, overviewImages.monitoring],
    gallery: [installation, equipment, switches, overviewImages.fibre],
  },
  testing: {
    slug: "equipment-testing-verification",
    seoTitle: "Data Centre Infrastructure Testing & Verification in Nigeria",
    description: "Verify data centre deployments in Nigeria with rack inspections, cable and port checks, equipment checks and documented findings before handover.",
    hero: audit,
    process: [room, overviewImages.copper, overviewImages.monitoring, coordination],
    gallery: [audit, overviewImages.copper, overviewImages.monitoring, coordination],
  },
  moves: {
    slug: "moves-adds-changes",
    seoTitle: "Data Centre Equipment Moves, Adds & Changes in Nigeria",
    description: "Plan equipment moves, rack additions and infrastructure changes in Nigerian data centres with reconnection checks and updated records.",
    hero: coordination,
    process: [installation, equipment, rackRear, overviewImages.monitoring],
    gallery: [installation, rackFront, rackRear, coordination],
  },
};

const pillar = solutionPillars.find(({ slug }) => slug === "data-centre-infrastructure")!;
const pagePaths = new Map(
  (Object.keys(pages) as BriefKey[]).map((key) => {
    const service = pillar.items.find(({ slug }) => slug === pages[key].slug);
    if (!service) throw new Error(`Missing Data Centre navigation route for ${pages[key].slug}`);
    return [service.href, key];
  }),
);

export const dataCentreSubservicePaths = [...pagePaths.keys()];

export function getDataCentreSubservice(path: string) {
  const key = pagePaths.get(path);
  if (!key) return undefined;

  const brief = copy[key];
  const assets = pages[key];
  const consultation = `/book-consultation?${new URLSearchParams({ infrastructureService: assets.slug })}#project-enquiry`;
  const content: SubserviceOverviewContent = {
    hero: {
      title: brief.hero.title,
      paragraphs: [assets.description],
      image: assets.hero,
      actions: [
        { label: brief.hero.primary, href: consultation },
        { label: brief.hero.secondary, href: key === "server-room" ? "#service-process" : pillar.href },
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
        action: { label: cta, href: cta === "Explore Infrastructure Support" ? "/solutions/it-services-support" : consultation },
      })),
    },
    gallery: {
      ...brief.gallery,
      paragraphs: brief.gallery.paragraphs,
      items: brief.gallery.items.map((item, index) => ({ ...item, image: assets.gallery[index] })),
      action: { label: brief.gallery.cta, href: consultation },
      relatedAction: undefined,
    },
    faq: { ...brief.faq, action: { label: brief.faq.cta, href: consultation } },
    closing: {
      title: brief.closing.title,
      paragraphs: brief.closing.paragraphs,
      image: room,
      actions: [{ label: brief.closing.primary, href: consultation }, { label: brief.closing.secondary, href: pillar.href }],
    },
  };
  return { path, name: brief.name, seoTitle: assets.seoTitle, description: assets.description, content, parent: { name: pillar.label, path: pillar.href } };
}
