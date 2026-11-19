import { solutionPillars } from "./enterprise-solutions";
import copy from "./solar-overview-copy.json";
import { solarOverviewPath, solarServicePath } from "./solar-routes";
import { overviewImages } from "./overview-images";
import { getOverviewRelatedServices } from "./overview-related-services";

export const solarConsultationService = "Solar Energy & Power Solutions";
export const solarConsultationHref = `/book-consultation?${new URLSearchParams({ service: solarConsultationService })}#project-enquiry`;
export const solarMetaTitle = "Solar Energy Solutions & Installation in Nigeria | Integrated Solutions Technology";
export const solarMetaDescription = "Explore residential, commercial and industrial solar installation, hybrid inverters, battery storage and maintenance services from Integrated Solutions Technology in Nigeria.";
export const solarHeroImage = {
  src: "/integrated-assets/images/rooftop-solar-technicians.webp",
  alt: "Technicians working on a rooftop solar array",
};
export const solarClosingImage = {
  src: "/integrated-assets/images/solar-panels.webp",
  alt: "Rows of solar panels",
};

const solarItems = solutionPillars.find(({ href }) => href === solarOverviewPath)!.items;

const environmentDestinations = [
  { href: solarServicePath("residential-solar"), image: solarItems[0].image },
  { href: "/solutions/business-energy", image: { src: "/image/operation-teams/journey-small-business.webp", alt: "Illustration of energy infrastructure for a small business" } },
  { href: solarServicePath("industrial-solar"), image: { src: "/image/operation-teams/journey-industrial.webp", alt: "Illustration of energy infrastructure for an industrial site" } },
  { href: "/book-consultation?environment=institutions#project-enquiry", image: { src: "/image/industries/education.webp", alt: "Educational facility" } },
  { href: "/book-consultation?environment=institutions#project-enquiry", image: overviewImages.healthcare },
  { href: solarServicePath("commercial-solar"), image: solarItems[1].image },
];

export const solarServiceEntries = copy.services.items.map((item) => {
  const service = solarItems.find(({ title }) => title === item.title);
  if (!service) throw new Error(`Missing solar service destination: ${item.title}`);
  return { ...item, image: service.image, action: { label: item.ctas[0], href: service.href } };
});

export const solarEnvironmentEntries = copy.environments.items.map((item, index) => {
  const { image, href } = environmentDestinations[index];
  return { ...item, image, action: { label: item.ctas[0], href } };
});

export const solarRelatedEntries = getOverviewRelatedServices("solar-energy");
