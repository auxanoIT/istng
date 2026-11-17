import legacy from "./service-pillar-navigation.json";
import { securityServiceImages } from "./security-service-images";
import { solarOverviewPath, solarServicePath } from "./solar-routes";
import type { ServiceNavMedia } from "@/lib/types";

type MenuService = { title: string; href: string; image: ServiceNavMedia; slug: string };
export type SolutionPillar = {
  slug: string;
  label: string;
  description: string;
  href: string;
  image: ServiceNavMedia;
  items: MenuService[];
};

const photo = (src: string, alt: string): ServiceNavMedia => ({ src, alt });
const energy = (file: string, alt: string) => photo(`/integrated-assets/images/${file}.webp`, alt);
const detail = (file: string, alt: string) => photo(`/image/service-details/${file}.webp`, alt);
const item = (title: string, href: string, image: ServiceNavMedia): MenuService => ({
  title, href, image, slug: href.split("/").at(-1)!,
});
const existing = (group: keyof typeof legacy, index: number, title?: string) => {
  const entry = legacy[group][index];
  return item(title ?? entry.title, entry.href, securityServiceImages[entry.href] ?? entry.image);
};
const shortPage = (slug: string, title: string, image: ServiceNavMedia) => item(title, `/solutions/${slug}`, image);

const rooftop = energy("rooftop-solar-technicians", "Technicians inspecting a rooftop solar array");
const network = detail("network-cabling-rack", "Structured network cabling in a rack");
const server = detail("server-new-supply", "Enterprise server equipment ready for installation");
const cctv = detail("cctv-camera-coverage", "Security camera positioned for building coverage");
const support = photo("/image/operation-teams/remote-team-onsite-support-nigeria.webp", "Onsite technician working beside network equipment");
const dataCentre = legacy["data-centre-deployment"][0].image;

export const solutionPillars: SolutionPillar[] = [
  {
    slug: "solar-energy",
    label: "Solar Energy & Power Solutions",
    description: "Solar generation, hybrid inverters and battery backup sized around how you use electricity.",
    href: solarOverviewPath,
    image: rooftop,
    items: [
      item("Residential Solar Installation", solarServicePath("residential-solar"), photo("/image/operation-teams/journey-residential.webp", "Home with rooftop solar and battery backup")),
      item("Commercial Solar Installation", solarServicePath("commercial-solar"), energy("solar-campus", "Commercial site with rooftop solar")),
      item("Industrial Solar Solutions", solarServicePath("industrial-solar"), energy("project-journey/solar-energy-wide", "Commercial building with rooftop panels and battery equipment")),
      item("Hybrid Solar & Inverter Systems", solarServicePath("hybrid-solar-systems"), energy("solutions/hybrid-solar", "Technician inspecting a hybrid inverter")),
      item("Solar Battery Storage Solutions", solarServicePath("battery-storage"), energy("solutions/battery-storage", "Battery storage cabinets in a utility room")),
      item("Solar Maintenance & System Upgrades", solarServicePath("solar-maintenance"), energy("solutions/solar-maintenance", "Technicians inspecting solar panels")),
    ],
  },
  {
    slug: "data-centre-infrastructure",
    label: "Data Centre & IT Infrastructure",
    description: "Plan, install and verify the physical infrastructure behind your critical IT systems.",
    href: "/services/data-centre-deployment",
    image: dataCentre,
    items: [
      shortPage("data-centre-planning", "Data Centre Design & Infrastructure Planning", legacy["data-centre-deployment"][3].image),
      item("Server Room Setup & Deployment", "/services/data-centre-services", detail("data-centre-buildout", "Data centre infrastructure and server racks")),
      existing("data-centre-deployment", 0, "Rack-and-Stack Services"),
      existing("data-centre-deployment", 1),
      existing("data-centre-deployment", 3, "Infrastructure Testing & Verification"),
      existing("data-centre-deployment", 4),
    ],
  },
  {
    slug: "network-structured-cabling",
    label: "Network & Structured Cabling",
    description: "Design and deploy dependable copper, fibre and wireless networks with clear documentation.",
    href: "/services/network-infrastructure-connectivity",
    image: network,
    items: [
      existing("network-infrastructure", 2, "Network Design & Installation"),
      existing("network-infrastructure", 4, "Structured LAN Cabling"),
      shortPage("fibre-optic-cabling", "Fibre Optic Cabling", network),
      shortPage("wireless-networks", "Wireless Network Solutions", photo("/image/case-studies/integrated-generated/network-wireless-equipment-supply-illustration.webp", "Enterprise wireless and network equipment")),
      existing("network-infrastructure", 3, "Network Configuration & Upgrades"),
      existing("network-infrastructure", 0),
      existing("network-infrastructure", 6),
      existing("network-infrastructure", 7, "Cable Routing & Rack Remediation"),
    ],
  },
  {
    slug: "server-storage-hardware",
    label: "Server, Storage & Hardware",
    description: "Source, deploy, upgrade and maintain the computing equipment your team depends on.",
    href: "/services/server-storage-hardware",
    image: server,
    items: [
      shortPage("enterprise-server-installation", "Enterprise Server Supply & Installation", server),
      existing("server-storage-hardware", 1, "Data Storage Solutions"),
      existing("server-storage-hardware", 2, "IT Hardware & Equipment Procurement"),
      existing("data-centre-deployment", 2, "Server Configuration & Upgrades"),
      existing("server-storage-hardware", 0, "Hardware Maintenance & Repair"),
      existing("server-storage-hardware", 3),
    ],
  },
  {
    slug: "security-surveillance",
    label: "Security & Surveillance",
    description: "Improve visibility and manage physical access with CCTV, recording and access systems.",
    href: "/services/data-centre-security-safety",
    image: cctv,
    items: [
      existing("security-access", 2, "CCTV Installation & Surveillance"),
      existing("security-access", 1, "Access Control Systems"),
      shortPage("video-monitoring-recording", "Video Monitoring & Recording Systems", detail("cctv-storage-retention", "Video recording and storage equipment")),
      shortPage("security-maintenance", "Security System Maintenance & Upgrades", detail("cctv-survey-support", "CCTV equipment being inspected")),
      existing("security-access", 5),
      existing("security-access", 4),
      existing("security-access", 3),
    ],
  },
  {
    slug: "it-services-support",
    label: "IT Services & Technical Support",
    description: "Get practical guidance, onsite assistance and ongoing support for your technology environment.",
    href: "/solutions/it-services-support",
    image: support,
    items: [
      existing("assessment-optimisation", 0, "IT Consulting & Infrastructure Assessment"),
      item("Managed IT Support & Maintenance", "/services/it-managed-services-staff-outsourcing", support),
      existing("smart-hands", 0, "Onsite IT Technical Support"),
      shortPage("it-infrastructure-upgrades", "IT Infrastructure Upgrades", server),
      existing("projects-lifecycle", 0, "IT Project Implementation & Support"),
      existing("smart-hands", 1),
      existing("projects-lifecycle", 1),
      existing("security-access", 0),
    ],
  },
];
