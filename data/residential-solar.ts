import type { SubserviceOverviewContent } from "@/components/pages/subservice-overview";
import { solarClosingImage } from "@/data/solar-overview";
import { solarOverviewPath, solarServicePath } from "@/data/solar-routes";

export const residentialSolarSlug = "residential-solar";
export const residentialSolarPath = solarServicePath(residentialSolarSlug);
export const residentialSolarTitle = "Residential Solar Installation";
export const residentialSolarDescription = "Residential solar installation in Nigeria with solar panels, hybrid inverters and battery storage sized around your home and backup needs.";

const consultation = "/book-consultation?environment=residential#project-enquiry";
const discuss = { label: "Discuss Your Home Solar Project", href: consultation };

export const residentialSolarContent: SubserviceOverviewContent = {
  hero: {
    title: "Reliable Solar Power. A Better Everyday Experience at Home.",
    paragraphs: [
      "We install solar and battery systems for homes in Nigeria to keep essential appliances running and reduce reliance on generators.",
    ],
    image: { src: "/image/operation-teams/journey-residential.webp", alt: "Illustrated Nigerian home with rooftop solar panels and battery storage" },
    actions: [discuss],
  },
  benefits: {
    title: "Make Your Home Less Dependent on Unreliable Electricity.",
    paragraphs: ["Make better use of sunlight with a solar system sized for your home."],
    items: [
      { title: "Reliable Backup Power", paragraphs: ["Keep essential household appliances running during grid interruptions with suitable inverter and battery storage capacity."] },
      { title: "Reduced Generator Dependence", paragraphs: ["Use available solar energy to reduce generator operating hours and help manage fuel expenses."] },
      { title: "Greater Everyday Comfort", paragraphs: ["Enjoy quieter living, better support for home working and fewer interruptions to important household activities."] },
      { title: "Designed Around Your Home", paragraphs: ["Get a solar solution planned around your appliances, electricity consumption and preferred backup duration."] },
    ],
  },
  process: {
    title: "From Understanding Your Home to Delivering the Right Solar Solution.",
    paragraphs: [],
    label: "Residential solar installation stages",
    entries: [
      {
        title: "Home Energy Assessment",
        tagline: "The Right System Begins With Knowing What You Need.",
        paragraphs: [
          "No two households use electricity in exactly the same way.",
          "We assess your appliances, electricity consumption, backup requirements and property conditions before recommending a suitable residential solar system.",
          "This helps determine the capacity needed to support your everyday activities without paying for unnecessary equipment.",
        ],
        image: { src: "/integrated-assets/images/solutions/solar-site-consultation-ankara.webp", alt: "Solar technician reviewing energy requirements with a customer" },
        action: { label: "Discuss Your Energy Requirements", href: consultation },
      },
      {
        title: "Solar System Design",
        tagline: "Every Component Selected for a Purpose.",
        paragraphs: [
          "Your solar installation should work as one complete system.",
          "We plan the appropriate combination of solar panels, inverter capacity, battery storage and electrical protection around your household's requirements.",
          "The result is a practical system design that considers daily electricity use, available installation space and future needs.",
        ],
        image: { src: "/integrated-assets/images/solutions/solar-power-house.webp", alt: "House showing rooftop solar panels, an inverter and battery storage" },
        action: { label: "Plan Your Home Solar System", href: consultation },
      },
      {
        title: "Professional Installation",
        tagline: "Your Home Solar System, Professionally Installed.",
        paragraphs: [
          "A dependable solar system needs more than quality equipment.",
          "We install rooftop solar panels, suitable indoor inverter and battery systems, electrical protection devices and supporting connections according to the agreed installation design.",
          "Careful installation and configuration help prepare your system for safe, effective operation.",
        ],
        image: { src: "/integrated-assets/images/rooftop-solar-technicians.webp", alt: "Solar technicians working on a rooftop array" },
        action: { label: "Discuss Your Installation", href: consultation },
      },
      {
        title: "Testing, Handover & Support",
        tagline: "Confidence in Your Solar System Starts Before Handover.",
        paragraphs: [
          "Installation is not complete simply because the equipment is connected.",
          "We check the system's operation, charging performance and intended backup functionality before guiding you through everyday use.",
          "Maintenance and technical assistance help you care for your solar investment over time.",
        ],
        image: { src: "/integrated-assets/images/solutions/hybrid-solar.webp", alt: "Technician checking a hybrid solar inverter" },
        action: { label: "Discuss Your Solar Project", href: consultation },
      },
    ],
  },
  closing: {
    title: "Let’s Plan Your Home Solar Project.",
    paragraphs: ["Tell us which appliances you want to keep running and how long you need backup power."],
    image: solarClosingImage,
    actions: [discuss, { label: "Explore Solar Energy & Power Solutions", href: solarOverviewPath }],
  },
};
