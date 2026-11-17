import copy from "./enterprise-overview-copy.json";
import { solutionPillars } from "./enterprise-solutions";
import { overviewImages as photo } from "./overview-images";
import type { ServiceNavMedia } from "@/lib/types";

type Item = { title: string; paragraphs: string[]; tagline?: string; cta?: string };
type Section = { title: string; paragraphs: string[] };
type OverviewDraft = {
  hero: Section & { ctas: string[] };
  reliability: Section & { items: Item[] };
  benefits: Section & { items: Item[] };
  services: Section & { items: Item[] };
  system: Section & { items: Item[]; ctas?: string[] };
  environments: Section & { items: Item[] };
  decisions: Section & { items: Item[]; ctas: string[] };
  related: Section & { items: Item[] };
  faq: Section & { items: Item[]; ctas: string[] };
  closing: Section & { ctas: string[] };
};

const extraServices: Record<string, Item> = {
  "Fibre Optic Cabling": { title: "Fibre Optic Cabling", paragraphs: ["Plan and install fibre links between racks, floors or buildings, including termination, labelling and agreed link testing."], cta: "Explore Fibre Optic Solutions" },
  "Equipment Moves, Adds & Changes": { title: "Equipment Moves, Adds & Changes", paragraphs: ["Coordinate rack changes, equipment moves and additions around the systems already in use."] },
  "Network Equipment Installation": { title: "Network Equipment Installation", paragraphs: ["Install switches, routers and wireless access points where your network design requires them."] },
  "Cable Labelling & Port Mapping": { title: "Cable Labelling & Port Mapping", paragraphs: ["Label cables and record port connections so technicians can trace links and manage changes."] },
  "Rack & Cabling Remediation": { title: "Rack & Cabling Remediation", paragraphs: ["Reorganise rack cabling and improve routing, access and labelling for future work."] },
  "Cable Routing & Rack Remediation": { title: "Cable Routing & Rack Remediation", paragraphs: ["Reorganise cable routes and rack layouts so connections are easier to trace and service."] },
  "Rack Accessories & Consumables Supply": { title: "Rack Accessories & Consumables Supply", paragraphs: ["Source compatible rack accessories, patch leads, transceivers and cable management supplies."] },
  "Fire Alarm & Safety Systems": { title: "Fire Alarm & Safety Systems", paragraphs: ["Plan, install and test fire detection and alarm equipment against the agreed facility requirements."] },
  "Automated Door & Gate Systems": { title: "Automated Door & Gate Systems", paragraphs: ["Plan and install automated doors and gates to suit the property and its access requirements."] },
  "Mantrap Door Installation & Servicing": { title: "Mantrap Door Installation & Servicing", paragraphs: ["Install and service interlocking entry doors for areas that need controlled access."] },
  "Smart Hands & Remote-Team Support": { title: "Smart Hands & Remote-Team Support", paragraphs: ["Give remote teams an onsite technician for agreed inspections, equipment checks and physical work."] },
  "Installation Documentation & Project Handover": { title: "Installation Documentation & Project Handover", paragraphs: ["Document installed equipment and connections, and hand over the records your team needs to operate them."] },
  "Firewall Supply, Installation & Licensing": { title: "Firewall Supply, Installation & Licensing", paragraphs: ["Source suitable firewall equipment and licences, and coordinate installation and renewal requirements."] },
};

const detail = (name: string, alt: string): ServiceNavMedia => ({ src: `/image/service-details/${name}.webp`, alt });
const industry = (name: string): ServiceNavMedia => ({ src: `/image/industries/${name}.webp`, alt: "" });
const media = (image: string | ServiceNavMedia, folder: "detail" | "industry"): ServiceNavMedia =>
  typeof image === "string" ? (folder === "detail" ? detail(image, "") : industry(image)) : image;

type ImageChoice = string | ServiceNavMedia;
type Visuals = {
  hero: ServiceNavMedia;
  support: ImageChoice;
  close: ImageChoice;
  foundations: ImageChoice[];
  benefits: ImageChoice[];
  services: Record<string, ServiceNavMedia>;
  details: ImageChoice[];
  audiences: ImageChoice[];
  priorities: string[];
  intro: string;
};

const visuals: Record<keyof typeof copy, Visuals> = {
  "data-centre-infrastructure": {
    hero: { src: "/image/service-pillars/data-centre-rack-and-stack-deployment-nigeria.webp", alt: "Nigerian technicians installing equipment in a server rack" },
    support: "data-centre-buildout", close: "data-centre-power",
    foundations: [photo.planning, "network-cabling-rack", photo.fibre, photo.copper],
    benefits: [photo.monitoring, "network-cabling-rack", "data-centre-buildout", photo.repair, "data-centre-cooling", "data-centre-power"],
    services: { "Data Centre Design & Infrastructure Planning": photo.planning, "Infrastructure Testing & Verification": photo.copper },
    details: [photo.monitoring, "data-centre-cooling", "network-cabling-rack", photo.copper],
    audiences: ["data-centre-infrastructure-nigeria", "corporate-offices", photo.consulting, "telecommunications-network-infrastructure-nigeria", photo.healthcare, "manufacturing-it-infrastructure-nigeria"],
    priorities: ["Setting up a new facility", "An overcrowded server room", "Installing new enterprise equipment", "Expanding operations", "Difficult infrastructure maintenance", "Replacing ageing equipment"],
    intro: "We plan and deploy data centre infrastructure around your space, equipment and day-to-day operations.",
  },
  "network-structured-cabling": {
    hero: detail("network-cabling-rack", "Structured copper and fibre cabling in a network rack"),
    support: photo.planning, close: "network-cabling-backbone",
    foundations: [photo.planning, "network-cabling-rack", photo.copper, photo.wireless],
    benefits: [photo.copper, photo.smallBusiness, photo.monitoring, photo.fibre, "network-cabling-rack", photo.consulting],
    services: {
      "Network Design & Installation": photo.planning,
      "Structured LAN Cabling": photo.copper,
      "Fibre Optic Cabling": photo.fibre,
      "Wireless Network Solutions": photo.wireless,
      "Network Configuration & Upgrades": photo.monitoring,
      "Network Equipment Installation": detail("network-equipment-switches-routers", "Network switches and routers ready for installation"),
      "Cable Labelling & Port Mapping": detail("network-cabling-rack", "Organised patch panel with labelled network connections"),
    },
    details: [photo.copper, "network-equipment-switches-routers", "network-equipment-firewalls", "network-equipment-access-points", "network-cabling-backbone", "network-cabling-rack"],
    audiences: ["corporate-offices", "data-centre-infrastructure-nigeria", "education", photo.healthcare, "hospitality", "manufacturing-it-infrastructure-nigeria"],
    priorities: ["Moving into a new office", "Unreliable network connections", "Cabling that is hard to manage", "More users and devices", "Outdated network equipment", "Connecting floors or buildings"],
    intro: "We design and install copper, fibre and wireless networks for the way your organisation works.",
  },
  "server-storage-hardware": {
    hero: detail("server-new-supply", "Enterprise server hardware ready for deployment"),
    support: photo.consulting, close: "storage-san-solutions",
    foundations: ["server-new-supply", "network-equipment-switches-routers", photo.repair, photo.consulting],
    benefits: ["it-hardware-devices", "storage-san-solutions", photo.monitoring, photo.consulting, "consumables-rack-hardware", photo.repair],
    services: {
      "Data Storage Solutions": detail("storage-san-solutions", "Enterprise storage systems and related equipment"),
      "IT Hardware & Equipment Procurement": detail("it-hardware-devices", "Computers and IT hardware ready for deployment"),
      "Server Configuration & Upgrades": photo.monitoring,
      "Hardware Maintenance & Repair": photo.repair,
      "Rack Accessories & Consumables Supply": detail("consumables-rack-hardware", "Rack mounting hardware and accessories"),
    },
    details: ["server-new-supply", "storage-san-solutions", "network-equipment-switches-routers", "it-hardware-devices", "consumables-rack-hardware", photo.upgrade],
    audiences: ["corporate-offices", photo.smallBusiness, "data-centre-infrastructure-nigeria", photo.consulting, "education", photo.healthcare, "manufacturing-it-infrastructure-nigeria"],
    priorities: ["Servers struggling with workloads", "Running out of storage", "Equipment that is hard to maintain", "Adding business applications", "Expanding the organisation", "Planning a hardware refresh"],
    intro: "We source, install and maintain servers, storage and IT hardware matched to your workloads.",
  },
  "security-surveillance": {
    hero: { src: "/integrated-assets/images/solutions/cctv-installation.webp", alt: "Nigerian technician installing an outdoor security camera" },
    support: photo.camera, close: "cctv-camera-coverage",
    foundations: ["cctv-camera-coverage", photo.camera, "cctv-storage-retention", "cctv-remote-viewing"],
    benefits: ["cctv-camera-coverage", "cctv-storage-retention", "door-access-credentials", "cctv-remote-viewing", photo.camera, "data-centre-power"],
    services: {
      "Security System Maintenance & Upgrades": photo.camera,
      "Automated Door & Gate Systems": detail("automated-gates-boom-barrier", "Automated vehicle entrance barrier"),
    },
    details: ["cctv-camera-coverage", "cctv-storage-retention", "storage-san-solutions", "network-cabling-rack", "cctv-remote-viewing", "data-centre-power"],
    audiences: ["real-estate-property-management", "corporate-offices", "retail", "warehousing-logistics", "education", "hospitality", photo.healthcare],
    priorities: ["Important areas lack camera coverage", "Footage is difficult to see", "Recording storage is limited", "Cameras frequently go offline", "The property has expanded", "The system is hard to maintain"],
    intro: "We install and maintain CCTV, recording and access control systems around your property’s needs.",
  },
  "it-services-support": {
    hero: photo.helpdesk, support: photo.consulting, close: photo.monitoring,
    foundations: [photo.consulting, photo.helpdesk, photo.monitoring, photo.upgrade],
    benefits: [photo.monitoring, photo.helpdesk, photo.consulting, photo.upgrade, photo.repair, "it-hardware-devices"],
    services: {
      "IT Consulting & Infrastructure Assessment": photo.consulting,
      "Managed IT Support & Maintenance": photo.monitoring,
      "Onsite IT Technical Support": photo.repair,
      "IT Infrastructure Upgrades": photo.upgrade,
      "Installation Documentation & Project Handover": photo.planning,
      "Firewall Supply, Installation & Licensing": detail("network-equipment-firewalls", "Network firewall equipment installed in a rack"),
    },
    details: [photo.helpdesk, photo.planning, photo.consulting, photo.upgrade, photo.copper, photo.monitoring],
    audiences: [photo.smallBusiness, "corporate-offices", "data-centre-infrastructure-nigeria", "retail", "education", photo.healthcare, "manufacturing-it-infrastructure-nigeria"],
    priorities: ["Recurring faults with computers or systems", "Network problems affect productivity", "The IT team needs extra expertise", "Moving into a new facility", "Equipment is becoming outdated", "Planning a technology expansion", "Infrastructure is difficult to manage"],
    intro: "We help teams assess, maintain and upgrade their IT through consulting, onsite assistance and ongoing support.",
  },
};

const shortCopy = (item: Item): Item => ({ ...item, paragraphs: item.paragraphs.slice(0, 1) });
const drafts: Record<string, OverviewDraft> = copy;

export const enterpriseOverviewPaths = solutionPillars.filter(({ slug }) => slug in visuals).map(({ href }) => href);

export function getEnterpriseOverview(path: string) {
  const pillar = solutionPillars.find((entry) => entry.href === path);
  if (!pillar || !(pillar.slug in visuals)) return null;
  const draft = drafts[pillar.slug];
  const art = visuals[pillar.slug as keyof typeof visuals];
  const enquiry = `/book-consultation?${new URLSearchParams({ service: pillar.label })}#project-enquiry`;
  const heroImage = art.hero;
  const foundations = draft.reliability.items.map((item, index) => ({
    ...shortCopy(item), image: media(art.foundations[index], "detail"),
  }));

  const services = pillar.items.map((service) => {
    const item = extraServices[service.title] ?? draft.services.items.find(({ title }) => title === service.title);
    if (!item) throw new Error(`Missing overview copy for ${service.title}`);
    const description = item.paragraphs[1] ?? item.paragraphs[0];
    return { ...item, paragraphs: [description], image: art.services[service.title] ?? service.image, action: { label: item.cta ?? `Explore ${service.title}`, href: service.href } };
  });
  const environments = draft.environments.items.map((item, index) => ({
    ...shortCopy(item),
    image: media(art.audiences[index], "industry"),
    action: { label: "Discuss your requirements", href: enquiry },
  }));
  const related = draft.related.items.flatMap((item) => {
    const match = solutionPillars.find(({ label }) => label === item.title);
    return match ? [{ ...shortCopy(item), image: match.image, action: { label: item.cta ?? item.title, href: match.href } }] : [];
  });
  const system = draft.system.items.map((item, index) => ({
    ...shortCopy(item), image: media(art.details[index], "detail"),
  }));
  return {
    pillar, draft, enquiry, heroImage, foundations, services, environments, related, system,
    intro: art.intro,
    supportImage: media(art.support, "detail"),
    closingImage: media(art.close, "detail"),
    benefitImages: art.benefits.map((asset) => media(asset, "detail").src),
    priorities: art.priorities.map((label, index) => ({ id: `priority-${index + 1}`, label })),
  };
}

export type EnterpriseOverviewData = NonNullable<ReturnType<typeof getEnterpriseOverview>>;
