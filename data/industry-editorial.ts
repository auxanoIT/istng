import type { IndustryProfile, ServiceNavMedia } from "@/lib/types";
import { industryNavigation } from "./industry-navigation";
import { overviewImages } from "./overview-images";
import copy from "./industry-page-copy.json";

type IndustrySlug = keyof typeof copy;

const industries = industryNavigation.flatMap(({ entries }) => [...entries]);

const photo = (src: string, alt: string): ServiceNavMedia => ({ src, alt });
const assets = {
  n: { href: "/services/network-infrastructure-connectivity", image: overviewImages.copper },
  v: { href: "/solutions/fibre-optic-cabling", image: overviewImages.fibre },
  w: { href: "/solutions/wireless-networks", image: overviewImages.wireless },
  h: { href: "/services/server-storage-hardware", image: photo("/integrated-assets/images/solutions/enterprise-storage-arrays.webp", "Rack-mounted enterprise storage and equipment") },
  c: { href: "/solutions/solar-energy/commercial-solar", image: photo("/integrated-assets/images/solar-campus.webp", "Solar panels on commercial rooftops") },
  i: { href: "/solutions/solar-energy/industrial-solar", image: photo("/integrated-assets/images/solutions/factory-rooftop-solar.webp", "Solar panels on a factory roof") },
  r: { href: "/solutions/solar-energy/residential-solar", image: photo("/image/operation-teams/journey-residential.webp", "Cutaway illustration of residential solar and battery backup") },
  s: { href: "/services/data-centre-security-safety", image: photo("/integrated-assets/images/solutions/security-monitoring-operator.webp", "Nigerian operator reviewing security camera feeds") },
  a: { href: "/services/automated-gates-sliding-doors", image: photo("/integrated-assets/images/solutions/residential-sliding-gate.webp", "Automatic sliding gate at a Nigerian property") },
  t: { href: "/solutions/it-services-support", image: overviewImages.helpdesk },
  e: { href: "/services/data-centre-project-lifecycle-management/installation-documentation-handover", image: overviewImages.planning },
  d: { href: "/services/data-centre-deployment", image: photo("/image/service-pillars/data-centre-rack-and-stack-deployment-nigeria.webp", "Technicians mounting equipment in a server rack") },
  f: { href: "/services/firewall-sales-licenses", image: photo("/image/service-details/network-equipment-firewalls.webp", "Firewall appliances installed in a network rack") },
};

type AssetKey = keyof typeof assets;
type IndustryPageConfig = { description: string; solutions: AssetKey[]; gallery: AssetKey[] };

const config: Record<IndustrySlug, IndustryPageConfig> = {
  "corporate-offices": {
    description: "Office solar, structured cabling, enterprise IT and access control for corporate workplaces in Nigeria.",
    solutions: ["n", "h", "c", "s", "t"],
    gallery: ["n", "h", "c", "s"],
  },
  "manufacturing": {
    description: "Industrial solar, factory networks, server infrastructure and site security for production facilities in Nigeria.",
    solutions: ["i", "n", "h", "s", "t"],
    gallery: ["i", "n", "s", "h"],
  },
  "warehousing-logistics": {
    description: "Warehouse Wi-Fi, loading-bay CCTV, access control and power infrastructure for logistics facilities in Nigeria.",
    solutions: ["w", "s", "a", "c", "t"],
    gallery: ["w", "s", "h", "c"],
  },
  "retail": {
    description: "Retail networking, CCTV, commercial solar and IT support for stores and shopping centres in Nigeria.",
    solutions: ["n", "s", "a", "c", "t"],
    gallery: ["n", "s", "c", "t"],
  },
  "healthcare": {
    description: "Solar backup, networks, server infrastructure and security for hospitals, clinics and laboratories in Nigeria.",
    solutions: ["n", "c", "h", "s", "t"],
    gallery: ["n", "c", "h", "s"],
  },
  "education": {
    description: "Solar power, campus Wi-Fi, computer equipment and facility security for Nigerian schools and universities.",
    solutions: ["n", "h", "c", "s", "t"],
    gallery: ["n", "h", "c", "s"],
  },
  "financial-services": {
    description: "Branch networking, firewall deployment, data centre infrastructure and access control for financial organisations in Nigeria.",
    solutions: ["n", "f", "d", "s", "t"],
    gallery: ["n", "d", "s", "t"],
  },
  "government": {
    description: "Networks, server deployment, solar power and electronic security for Nigerian government offices and public institutions.",
    solutions: ["n", "h", "d", "c", "s"],
    gallery: ["n", "d", "c", "s"],
  },
  "real-estate-property-management": {
    description: "Solar, building connectivity, surveillance and access systems for residential and commercial developments in Nigeria.",
    solutions: ["c", "n", "s", "a", "t"],
    gallery: ["r", "s", "n", "a"],
  },
  "hospitality": {
    description: "Hotel Wi-Fi, solar backup, surveillance and IT support for hospitality and leisure properties in Nigeria.",
    solutions: ["w", "h", "s", "c", "t"],
    gallery: ["w", "s", "c", "h"],
  },
  "data-centres": {
    description: "Rack-and-stack, cabling, server deployment and Smart Hands for data centres and cloud infrastructure in Nigeria.",
    solutions: ["d", "n", "h", "t", "e"],
    gallery: ["d", "n", "t", "e"],
  },
  "telecommunications-isps": {
    description: "Fibre cabling, network equipment deployment and field support for telecom operators and ISPs in Nigeria.",
    solutions: ["v", "n", "d", "c", "t"],
    gallery: ["v", "n", "d", "t"],
  },
  "residential-homes-gated-communities": {
    description: "Residential solar, battery backup, CCTV, automated gates and home networking for homes and gated communities in Nigeria.",
    solutions: ["r", "s", "a", "n", "t"],
    gallery: ["r", "s", "a", "n"],
  },
  "religious-organizations": {
    description: "Solar power, networking, surveillance and technical support for worship centres and community facilities in Nigeria.",
    solutions: ["c", "n", "s", "a", "t"],
    gallery: ["c", "n", "s", "h"],
  },
  "technology-partners": {
    description: "Local Smart Hands, equipment installation and infrastructure handover for technology partners and remote teams in Nigeria.",
    solutions: ["t", "d", "v", "h", "e"],
    gallery: ["d", "v", "t", "h"],
  },
  "energy-utilities": {
    description: "Solar, networking, security and technical support for energy project facilities and distributed sites in Nigeria.",
    solutions: ["i", "n", "s", "h", "t"],
    gallery: ["i", "n", "s", "t"],
  },
  "agriculture-agribusiness": {
    description: "Solar and battery storage, facility networking, surveillance and IT support for agribusiness operations in Nigeria.",
    solutions: ["i", "n", "s", "t", "h"],
    gallery: ["i", "h", "s", "n"],
  },
};

const extraProfiles = {
  "residential-homes-gated-communities": { base: "real-estate-property-management", image: photo("/integrated-assets/images/solutions/residential-cctv-camera.webp", "Nigerian home with a security camera by the entrance") },
  "technology-partners": { base: "technology-companies", image: photo("/image/operation-teams/remote-team-onsite-support-nigeria.webp", "Onsite technician inspecting network equipment") },
  "energy-utilities": { base: "manufacturing", image: assets.i.image },
  "agriculture-agribusiness": { base: "manufacturing", image: assets.c.image },
} as const;

const heroImages: Partial<Record<IndustrySlug, ServiceNavMedia>> = {
  "corporate-offices": overviewImages.planning,
};

export function getIndustryEditorial(slug: string) {
  const entry = industries.find(([key]) => key === slug);
  if (!entry) return undefined;
  const key = entry[0];
  const page = copy[key];
  const settings = config[key];

  return {
    ...page,
    description: settings.description,
    solutions: {
      ...page.solutions,
      items: page.solutions.items.map((item, index) => ({ ...item, ...assets[settings.solutions[index]] })),
    },
    gallery: {
      ...page.gallery,
      items: page.gallery.items.map((item, index) => ({ ...item, image: assets[settings.gallery[index]].image })),
    },
  };
}

export function applyIndustryEditorial(profiles: IndustryProfile[]) {
  return industries.flatMap(([slug, title]) => {
    const extra = slug in extraProfiles ? extraProfiles[slug as keyof typeof extraProfiles] : undefined;
    const base = profiles.find((profile) => profile.slug === (extra?.base ?? slug));
    if (!base) return [];
    return [{
      ...base,
      slug,
      href: `/industries/${slug}`,
      title,
      navLabel: title,
      heroTitle: copy[slug].hero.title,
      heroDescription: config[slug].description,
      shortDescription: config[slug].description,
      heroImage: heroImages[slug] ?? extra?.image ?? base.heroImage,
      seoTitle: `${title} Solutions in Nigeria`,
      metaDescription: config[slug].description,
      primaryKeyword: `${title} infrastructure in Nigeria`,
      longTailKeywords: [],
      environmentExamples: copy[slug].applications.items.map((item) => item.title),
    }];
  });
}
