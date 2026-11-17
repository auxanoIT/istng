import type { SubserviceOverviewContent } from "@/components/pages/subservice-overview";
import { residentialSolarContent, residentialSolarDescription, residentialSolarSlug, residentialSolarTitle } from "@/data/residential-solar";
import { solarOverviewPath, solarServicePath, solarServiceSlugs } from "@/data/solar-routes";
import type { ServiceNavMedia } from "@/lib/types";
import copy from "./solar-subservice-copy.json";

type SolarSlug = (typeof solarServiceSlugs)[number];
type SolarBriefSlug = keyof typeof copy;

const solarPhoto = (file: string, alt: string): ServiceNavMedia => ({ src: `/integrated-assets/images/${file}.webp`, alt });
const campus = solarPhoto("solar-campus", "Solar panels across commercial rooftops");
const rooftop = solarPhoto("rooftop-solar-technicians", "Solar installation crew on a rooftop");
const panels = solarPhoto("solar-panels", "Rows of installed solar panels");
const inverter = solarPhoto("solutions/hybrid-solar", "Wall-mounted hybrid inverter and electrical equipment");
const battery = solarPhoto("solutions/battery-storage", "Battery storage cabinets installed indoors");
const equipment = solarPhoto("solutions/solar-system-equipment", "Solar panel, inverter and battery storage equipment");
const maintenance = solarPhoto("solutions/solar-maintenance", "Technicians inspecting a rooftop solar array");
const assessment = solarPhoto("solutions/solar-site-consultation-ankara", "Nigerian technician discussing energy needs with a customer");
const factory = solarPhoto("project-journey/solar-energy-wide", "Illustration of a commercial facility with rooftop solar and battery equipment");
const warehouse = { src: "/image/operation-teams/journey-industrial.webp", alt: "Cutaway illustration of rooftop solar on an industrial facility" };
const factoryRoof = solarPhoto("solutions/factory-rooftop-solar", "Solar panels on a factory roof in a Nigerian industrial estate");
const plantRoom = solarPhoto("solutions/industrial-solar-equipment", "Industrial inverters and battery cabinets in a dedicated electrical room");
const commissioning = solarPhoto("solutions/solar-inverter-commissioning", "Nigerian technician checking a hybrid inverter and distribution cabinet");
const batteryInspection = solarPhoto("solutions/solar-battery-inspection", "Nigerian technician checking the charge status of lithium battery cabinets");

const media: Record<SolarBriefSlug, {
  description: string;
  hero: ServiceNavMedia;
  process: ServiceNavMedia[];
  gallery: ServiceNavMedia[];
  closing: ServiceNavMedia;
}> = {
  "commercial-solar": {
    description: "Commercial solar installation in Nigeria for offices, shops, hotels and schools. We size rooftop panels, hybrid inverters and batteries around your operations.",
    hero: campus, process: [assessment, equipment, rooftop, commissioning],
    gallery: [campus, plantRoom, rooftop, commissioning], closing: panels,
  },
  "industrial-solar": {
    description: "Industrial solar installation in Nigeria for factories and warehouses, designed around machinery loads, operating hours and existing power systems.",
    hero: factoryRoof, process: [warehouse, plantRoom, rooftop, commissioning],
    gallery: [factoryRoof, warehouse, plantRoom, commissioning], closing: factory,
  },
  "hybrid-solar-systems": {
    description: "Hybrid solar and inverter installation in Nigeria for homes and businesses using solar panels, battery storage and compatible grid or generator power.",
    hero: inverter, process: [assessment, equipment, rooftop, commissioning],
    gallery: [inverter, battery, equipment, commissioning], closing: campus,
  },
  "battery-storage": {
    description: "Solar battery storage in Nigeria, from lithium battery selection to installation and integration with compatible inverters for backup power after dark.",
    hero: battery, process: [assessment, equipment, plantRoom, batteryInspection],
    gallery: [battery, plantRoom, commissioning, batteryInspection], closing: panels,
  },
  "solar-maintenance": {
    description: "Solar maintenance and system upgrades in Nigeria, including panel inspections, inverter troubleshooting, battery checks and capacity upgrades.",
    hero: maintenance, process: [maintenance, commissioning, equipment, batteryInspection],
    gallery: [maintenance, inverter, batteryInspection, commissioning], closing: panels,
  },
};

export function getSolarSubservice(slug: SolarSlug): { name: string; description: string; content: SubserviceOverviewContent } {
  if (slug === residentialSolarSlug) {
    return { name: residentialSolarTitle, description: residentialSolarDescription, content: residentialSolarContent };
  }

  const brief = copy[slug];
  const images = media[slug];
  const consultation = `/book-consultation?${new URLSearchParams({ solarService: slug })}#project-enquiry`;
  const bannerActions = (primary: string, secondary: string, secondaryHref: string) => [
    { label: primary, href: consultation },
    { label: secondary, href: secondaryHref },
  ];

  return {
    name: brief.name,
    description: images.description,
    content: {
      hero: {
        title: brief.hero.title,
        paragraphs: [images.description],
        image: images.hero,
        actions: bannerActions(brief.hero.primary, brief.hero.secondary, slug === "commercial-solar" || slug === "industrial-solar" ? solarOverviewPath : "#service-process"),
      },
      benefits: { ...brief.benefits, paragraphs: brief.benefits.paragraphs.slice(-1) },
      process: {
        title: brief.process.title,
        paragraphs: brief.process.paragraphs.slice(-1),
        label: `${brief.name} stages`,
        entries: brief.process.entries.map(({ cta, ...entry }, index) => ({
          ...entry,
          image: images.process[index],
          action: {
            label: cta,
            href: cta.startsWith("Explore") && slug !== "solar-maintenance" ? solarServicePath("solar-maintenance") : consultation,
          },
        })),
      },
      gallery: {
        ...brief.gallery,
        paragraphs: [...brief.gallery.paragraphs, "Images illustrate the equipment and work involved."],
        items: brief.gallery.items.map((item, index) => ({ ...item, image: images.gallery[index] })),
        action: { label: brief.gallery.cta, href: consultation },
      },
      faq: { ...brief.faq, action: { label: brief.faq.cta, href: consultation } },
      closing: {
        title: brief.closing.title,
        paragraphs: brief.closing.paragraphs,
        image: images.closing,
        actions: bannerActions(brief.closing.primary, brief.closing.secondary, solarOverviewPath),
      },
    },
  };
}
