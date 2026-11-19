import { subserviceGalleryImage } from "./subservice-gallery";
import type { InfrastructureSubservicePage } from "@/components/pages/infrastructure-subservice";
import { solutionPillars } from "@/data/enterprise-solutions";
import { overviewImages as photo } from "@/data/overview-images";
import type { ServiceNavMedia } from "@/lib/types";
import copy from "./hardware-subservice-copy.json";

type HardwareBrief = keyof typeof copy;
type HardwareAssets = {
  slug: string;
  description: string;
  hero: ServiceNavMedia;
  process: ServiceNavMedia[];
  gallery: ServiceNavMedia[];
};

const detail = (file: string, alt: string): ServiceNavMedia => ({ src: `/image/service-details/${file}.webp`, alt });
const galleryPhoto = (file: string, alt: string): ServiceNavMedia => ({ src: `/integrated-assets/images/solutions/${file}.webp`, alt });
const servers = detail("server-new-supply", "Rack servers staged for installation");
const tower = galleryPhoto("enterprise-tower-server", "Standalone tower server on an IT service bench");
const serverMemory = galleryPhoto("enterprise-server-memory", "Technician's hands inspecting server memory modules");
const airflow = galleryPhoto("rack-airflow-and-power", "Rack blanking panels and a vertical power distribution unit");
const storageArray = galleryPhoto("enterprise-storage-arrays", "Rack-mounted storage arrays with drive bays and an expansion shelf");
const nas = detail("storage-nas-solutions", "Network storage equipment in a server rack");
const san = detail("storage-san-solutions", "Enterprise storage network equipment");
const computers = detail("it-hardware-devices", "Business computers and workstation equipment");
const hardwareAccessories = detail("it-hardware-accessories", "IT peripherals, adapters and accessories");
const switches = detail("network-equipment-switches-routers", "Network switches, routers and supporting components");
const racks = detail("consumables-rack-hardware", "Rack shelves, mounting rails and fixings");
const cableManagers = detail("consumables-cable-management", "Cable management accessories for equipment racks");
const patchCords = detail("consumables-patch-cables", "Colour-coded patch cables and connectors");
const installation = {
  src: "/image/service-pillars/data-centre-rack-and-stack-deployment-nigeria.webp",
  alt: "Two Nigerian technicians installing equipment in a server rack",
};
const serverRoom = detail("data-centre-buildout", "Rows of installed server racks in a data centre");

const pages: Record<HardwareBrief, HardwareAssets> = {
  servers: {
    slug: "enterprise-server-installation",
    description: "Enterprise server supply and installation in Nigeria, including rack and tower server selection, component sourcing and physical deployment.",
    hero: servers,
    process: [photo.consulting, servers, installation, photo.monitoring],
    gallery: [servers, tower, serverMemory, installation],
  },
  storage: {
    slug: "server-storage-provisioning-deployment",
    description: "Enterprise data storage solutions in Nigeria, including NAS, SAN and server storage selection, capacity planning, installation and verification.",
    hero: storageArray,
    process: [photo.consulting, nas, storageArray, photo.monitoring],
    gallery: [nas, san, storageArray, photo.fibre],
  },
  procurement: {
    slug: "sales-of-it-hardware",
    description: "IT hardware procurement in Nigeria for business computers, enterprise servers, storage, network equipment and accessories.",
    hero: computers,
    process: [photo.consulting, computers, servers, hardwareAccessories],
    gallery: [computers, storageArray, switches, hardwareAccessories],
  },
  configuration: {
    slug: "server-installation-configuration",
    description: "Server configuration and upgrades in Nigeria, including operating system setup, memory and storage expansion, firmware checks and handover.",
    hero: serverMemory,
    process: [photo.consulting, photo.monitoring, serverMemory, installation],
    gallery: [photo.monitoring, serverMemory, storageArray, photo.repair],
  },
  repair: {
    slug: "server-sales-repair",
    description: "IT hardware maintenance and repair in Nigeria for servers and business computers, including diagnostics, component replacement and testing.",
    hero: photo.repair,
    process: [photo.repair, photo.upgrade, installation, photo.monitoring],
    gallery: [photo.repair, serverMemory, installation, photo.monitoring],
  },
  accessories: {
    slug: "sales-of-data-centre-consumables",
    description: "Rack accessories and consumables in Nigeria, including mounting rails, shelves, cable managers, blanking panels, PDUs and patch cords.",
    hero: racks,
    process: [racks, cableManagers, airflow, patchCords],
    gallery: [racks, cableManagers, airflow, patchCords],
  },
};

const pillar = solutionPillars.find(({ slug }) => slug === "server-storage-hardware")!;
const pagePaths = new Map(
  (Object.keys(pages) as HardwareBrief[]).map((key) => {
    const service = pillar.items.find(({ slug }) => slug === pages[key].slug);
    if (!service) throw new Error(`Missing hardware navigation route for ${pages[key].slug}`);
    return [service.href, key] as const;
  }),
);

export const hardwareSubservicePaths = [...pagePaths.keys()];

export function getHardwareSubservice(path: string): InfrastructureSubservicePage | undefined {
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
          action: { label: cta, href: cta === "Explore Storage System Options" ? "#service-gallery" : consultation },
        })),
      },
      gallery: {
        ...brief.gallery,
        paragraphs: brief.gallery.paragraphs,
        items: brief.gallery.items.map((item, index) => ({ ...item, image: subserviceGalleryImage(path, index, assets.gallery[index]) })),
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
