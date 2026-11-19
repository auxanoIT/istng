import { getServiceCards } from "./related-subservices";

const selections: Record<string, string[]> = {
  "corporate-offices": ["network-design-with-diagram", "enterprise-server-installation", "door-access-control"],
  manufacturing: ["industrial-solar", "fibre-optic-cabling", "surveillance-system-cctv"],
  "warehousing-logistics": ["wireless-networks", "surveillance-system-cctv", "commercial-solar"],
  retail: ["commercial-solar", "network-equipment-installation", "video-monitoring-recording"],
  healthcare: ["battery-storage", "structured-lan-cabling", "door-access-control"],
  education: ["wireless-networks", "commercial-solar", "sales-of-it-hardware"],
  "financial-services": ["firewall-sales-licenses", "server-storage-provisioning-deployment", "mantrap-installation-servicing"],
  government: ["structured-lan-cabling", "enterprise-server-installation", "surveillance-system-cctv"],
  "real-estate-property-management": ["residential-solar", "fibre-optic-cabling", "automated-gates-sliding-doors"],
  hospitality: ["commercial-solar", "wireless-networks", "door-access-control"],
  "data-centres": ["data-centre-planning", "rack-and-stack", "smart-hands"],
  "telecommunications-isps": ["fibre-optic-cabling", "network-equipment-installation", "smart-hands"],
  "residential-homes-gated-communities": ["residential-solar", "surveillance-system-cctv", "automated-gates-sliding-doors"],
  "religious-organizations": ["hybrid-solar-systems", "wireless-networks", "surveillance-system-cctv"],
  "technology-partners": ["smart-hands", "equipment-installation", "installation-documentation-handover"],
  "energy-utilities": ["industrial-solar", "network-design-with-diagram", "security-maintenance"],
  "agriculture-agribusiness": ["industrial-solar", "surveillance-system-cctv", "it-technical-services"],
};

export function getIndustryRelatedServiceCards(slug: string) {
  return getServiceCards(selections[slug] ?? []);
}
