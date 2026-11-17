import type { InfrastructureSubservicePage } from "@/components/pages/infrastructure-subservice";
import { solutionPillars } from "@/data/enterprise-solutions";
import { overviewImages as photo } from "@/data/overview-images";
import type { ServiceNavMedia } from "@/lib/types";
import copy from "./it-support-subservice-copy.json";

type ITSupportBrief = keyof typeof copy;
type ITSupportAssets = {
  slug: string;
  description: string;
  hero: ServiceNavMedia;
  process: ServiceNavMedia[];
  gallery: ServiceNavMedia[];
};

const detail = (file: string, alt: string): ServiceNavMedia => ({ src: `/image/service-details/${file}.webp`, alt });
const sitePhoto = (file: string, alt: string): ServiceNavMedia => ({ src: `/image/our-work/${file}.webp`, alt });

const serverRoom = detail("data-centre-buildout", "Rows of equipment racks in a server room");
const workstations = detail("it-hardware-devices", "Business computers and workstation equipment");
const storage = { src: "/integrated-assets/images/solutions/enterprise-storage-arrays.webp", alt: "Rack-mounted enterprise storage arrays and drive bays" };
const serverMemory = { src: "/integrated-assets/images/solutions/enterprise-server-memory.webp", alt: "Technician inspecting server memory modules" };
const switches = detail("network-equipment-switches-routers", "Network switches and routers staged for deployment");
const installation = { src: "/image/service-pillars/data-centre-rack-and-stack-deployment-nigeria.webp", alt: "Two Nigerian technicians installing rack-mounted equipment" };
const coordination = { src: "/image/service-pillars/integrated-project-coordination-clean.webp", alt: "Project team coordinating data centre deployment work" };
const remoteHands = { src: "/image/operation-teams/remote-team-onsite-support-nigeria.webp", alt: "Nigerian onsite technician working beside network equipment" };
const rackFront = sitePhoto("integrated-solutions-data-centre-rack-r07-11-front", "Front view of an installed equipment rack");
const rackRear = sitePhoto("integrated-solutions-data-centre-rack-r08-11-rear", "Rear view of an installed rack showing organised cable routes");
const firewallAppliance = detail("software-firewall-enterprise", "Enterprise firewall appliance and network equipment");
const firewallRack = detail("network-equipment-firewalls", "Firewall appliances installed in a network rack");

const pages: Record<ITSupportBrief, ITSupportAssets> = {
  consulting: {
    slug: "it-consultancy-audit-services",
    description: "IT consulting and infrastructure assessments in Nigeria covering networks, servers, equipment inventories and practical upgrade priorities.",
    hero: photo.consulting,
    process: [photo.consulting, photo.copper, serverRoom, photo.planning],
    gallery: [photo.copper, serverRoom, workstations, photo.planning],
  },
  managed: {
    slug: "it-managed-services-staff-outsourcing",
    description: "Managed IT support in Nigeria with business help desk services, preventive maintenance, infrastructure monitoring and service reporting.",
    hero: photo.helpdesk,
    process: [photo.consulting, photo.helpdesk, photo.repair, photo.monitoring],
    gallery: [photo.helpdesk, photo.monitoring, photo.repair, photo.planning],
  },
  onsite: {
    slug: "it-technical-services",
    description: "Onsite IT support in Nigeria for workstations, business equipment and networks, including troubleshooting, hardware replacement and handover.",
    hero: photo.upgrade,
    process: [photo.repair, photo.upgrade, photo.copper, photo.planning],
    gallery: [photo.upgrade, photo.copper, photo.repair, photo.planning],
  },
  upgrades: {
    slug: "it-infrastructure-upgrades",
    description: "IT infrastructure upgrades in Nigeria for business networks, servers and storage, from assessment and equipment selection to testing and handover.",
    hero: serverMemory,
    process: [photo.consulting, switches, storage, installation],
    gallery: [switches, serverMemory, storage, installation],
  },
  projects: {
    slug: "it-project-management",
    description: "IT project implementation and support in Nigeria for network deployments, server and storage installations, and multi-site equipment rollouts.",
    hero: coordination,
    process: [photo.planning, installation, coordination, photo.monitoring],
    gallery: [photo.fibre, installation, workstations, photo.monitoring],
  },
  smartHands: {
    slug: "smart-hands",
    description: "Data centre Smart Hands in Nigeria for remote teams, with onsite equipment inspections, cable tracing, hardware assistance and task reporting.",
    hero: remoteHands,
    process: [remoteHands, installation, photo.fibre, coordination],
    gallery: [remoteHands, photo.copper, installation, coordination],
  },
  handover: {
    slug: "installation-documentation-handover",
    description: "IT installation documentation and handover in Nigeria, including as-built drawings, equipment inventories, port maps and test records.",
    hero: photo.planning,
    process: [photo.planning, rackFront, photo.copper, photo.consulting],
    gallery: [photo.planning, rackFront, rackRear, photo.consulting],
  },
  firewall: {
    slug: "firewall-sales-licenses",
    description: "Firewall supply, installation and licensing in Nigeria, including appliance selection, configuration, licence activation and handover.",
    hero: firewallRack,
    process: [photo.consulting, firewallAppliance, firewallRack, photo.monitoring],
    gallery: [firewallAppliance, firewallRack, photo.monitoring, photo.consulting],
  },
};

const pillar = solutionPillars.find(({ slug }) => slug === "it-services-support")!;
const pagePaths = new Map(
  (Object.keys(pages) as ITSupportBrief[]).map((key) => {
    const service = pillar.items.find(({ slug }) => slug === pages[key].slug);
    if (!service) throw new Error(`Missing IT support navigation route for ${pages[key].slug}`);
    return [service.href, key] as const;
  }),
);

export const itSupportSubservicePaths = [...pagePaths.keys()];

export function getITSupportSubservice(path: string): InfrastructureSubservicePage | undefined {
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
          action: { label: cta, href: cta.startsWith("Explore ") ? "#service-gallery" : consultation },
        })),
      },
      gallery: {
        ...brief.gallery,
        paragraphs: [...brief.gallery.paragraphs, "Images illustrate the equipment and work involved."],
        items: brief.gallery.items.map((item, index) => ({ ...item, image: assets.gallery[index] })),
        action: { label: brief.gallery.cta, href: consultation },
      },
      faq: { ...brief.faq, action: { label: brief.faq.cta, href: consultation } },
      closing: {
        title: brief.closing.title,
        paragraphs: brief.closing.paragraphs,
        image: serverRoom,
        actions: [{ label: brief.closing.primary, href: consultation }, { label: brief.closing.secondary, href: pillar.href }],
      },
    },
  };
}
