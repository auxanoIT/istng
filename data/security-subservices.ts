import type { InfrastructureSubservicePage } from "@/components/pages/infrastructure-subservice";
import { solutionPillars } from "@/data/enterprise-solutions";
import { overviewImages } from "@/data/overview-images";
import type { ServiceNavMedia } from "@/lib/types";
import copy from "./security-subservice-copy.json";

type SecurityBrief = keyof typeof copy;
type SecurityAssets = {
  slug: string;
  description: string;
  hero: ServiceNavMedia;
  process: ServiceNavMedia[];
  gallery: ServiceNavMedia[];
};

const detail = (file: string, alt: string): ServiceNavMedia => ({ src: `/image/service-details/${file}.webp`, alt });
const scene = (file: string, alt: string): ServiceNavMedia => ({ src: `/integrated-assets/images/solutions/${file}.webp`, alt });

const homeCamera = scene("residential-cctv-camera", "Outdoor security camera near the entrance of a Nigerian home");
const cctvInstall = scene("cctv-installation", "Technician installing an exterior CCTV camera");
const cameraCoverage = detail("cctv-camera-coverage", "A weatherproof camera overlooking a commercial building entrance");
const recorder = detail("cctv-storage-retention", "Surveillance recording and storage equipment");
const remoteViewing = detail("cctv-remote-viewing", "Authorised operator reviewing security footage");
const monitoring = scene("security-monitoring-operator", "Nigerian security operator reviewing camera feeds");
const accessReader = detail("door-access-credentials", "Electronic credential reader next to a controlled door");
const accessSystem = scene("office-door-access", "Nigerian technician checking a credential reader at an office entrance");
const accessConsole = scene("access-management-console", "Nigerian facilities manager reviewing an access control dashboard");
const secureEntry = { src: "/image/service-pillars/data-centre-security-access-control-nigeria.webp", alt: "Technician at a controlled data centre entrance" };
const storageRack = detail("data-centre-buildout", "Equipment racks that can support surveillance storage");
const fireInspection = scene("fire-alarm-inspection", "Technician inspecting fire alarm equipment beside a manual call point");
const firePanel = scene("commercial-fire-alarm-panel", "Nigerian technician inspecting a fire alarm control panel");
const fireDetectors = detail("integrated-solutions-fire-detection-devices", "Smoke and heat detection equipment");
const fireCallPoint = detail("fire-alarm-hero-call-point", "Red manual fire alarm call point");
const gates = detail("automated-gates-swing-sliding", "Automated swing gates at a commercial property");
const residentialGate = scene("residential-sliding-gate", "Automated sliding gate at a Nigerian home");
const doors = detail("automated-gates-sliding-doors", "Automatic sliding entrance doors at a commercial building");
const gateControls = scene("gate-safety-inspection", "Nigerian technician inspecting a safety sensor beside an automatic gate");
const gateInspection = { src: "/image/our-work/gate-inspection.webp", alt: "Technician inspecting a gate actuator at the property perimeter" };
const mantrap = scene("mantrap-access-vestibule", "Two glass security doors in a controlled entry vestibule");
const mantrapService = scene("mantrap-entrance-inspection", "Nigerian technician checking a controlled entrance vestibule");

const pages: Record<SecurityBrief, SecurityAssets> = {
  cctv: {
    slug: "surveillance-system-cctv",
    description: "CCTV installation in Nigeria for homes and businesses, including coverage planning, camera installation, recording and authorised remote viewing.",
    hero: cctvInstall,
    process: [homeCamera, cameraCoverage, cctvInstall, remoteViewing],
    gallery: [homeCamera, cctvInstall, cameraCoverage, monitoring],
  },
  access: {
    slug: "door-access-control",
    description: "Door access control in Nigeria for offices and restricted areas, with card, PIN and biometric options, electronic locks and access management.",
    hero: secureEntry,
    process: [secureEntry, accessReader, accessSystem, accessConsole],
    gallery: [accessSystem, accessReader, secureEntry, accessConsole],
  },
  video: {
    slug: "video-monitoring-recording",
    description: "Video monitoring and recording systems in Nigeria, including DVR and NVR setup, storage planning, live viewing and footage retrieval.",
    hero: monitoring,
    process: [overviewImages.planning, recorder, monitoring, remoteViewing],
    gallery: [monitoring, recorder, storageRack, remoteViewing],
  },
  maintenance: {
    slug: "security-maintenance",
    description: "Security system maintenance and upgrades in Nigeria, including CCTV, video recorder servicing, access control diagnostics and replacement.",
    hero: overviewImages.camera,
    process: [overviewImages.camera, mantrapService, cctvInstall, monitoring],
    gallery: [overviewImages.camera, recorder, mantrapService, cctvInstall],
  },
  fire: {
    slug: "fire-alarm-safety-systems",
    description: "Fire alarm systems in Nigeria, including smoke and heat detection, control panels, alarm installation, testing and commissioning.",
    hero: fireInspection,
    process: [overviewImages.planning, firePanel, fireDetectors, fireInspection],
    gallery: [fireDetectors, firePanel, fireCallPoint, fireInspection],
  },
  gates: {
    slug: "automated-gates-sliding-doors",
    description: "Automated gate and door installation in Nigeria, including sliding and swing gates, commercial entrance doors and safety device checks.",
    hero: gates,
    process: [gateInspection, gates, doors, gateControls],
    gallery: [residentialGate, gates, doors, gateControls],
  },
  mantrap: {
    slug: "mantrap-installation-servicing",
    description: "Mantrap door installation and servicing in Nigeria for data centres and restricted areas, including access control integration and functional testing.",
    hero: mantrap,
    process: [overviewImages.planning, accessReader, mantrap, mantrapService],
    gallery: [mantrap, secureEntry, accessReader, mantrapService],
  },
};

const pillar = solutionPillars.find(({ slug }) => slug === "security-surveillance")!;
const pagePaths = new Map(
  (Object.keys(pages) as SecurityBrief[]).map((key) => {
    const service = pillar.items.find(({ slug }) => slug === pages[key].slug);
    if (!service) throw new Error(`Missing security navigation route for ${pages[key].slug}`);
    return [service.href, key] as const;
  }),
);

export const securitySubservicePaths = [...pagePaths.keys()];

export function getSecuritySubservice(path: string): InfrastructureSubservicePage | undefined {
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
        image: assets.hero,
        actions: [{ label: brief.closing.primary, href: consultation }, { label: brief.closing.secondary, href: pillar.href }],
      },
    },
  };
}
