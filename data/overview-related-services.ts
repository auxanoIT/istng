import { solutionPillars } from "./enterprise-solutions";

// Recommend concrete next steps for each overview rather than repeating every pillar.
const recommendations: Record<string, { title: string; description: string }[]> = {
  "solar-energy": [
    { title: "Structured LAN Cabling", description: "Connect workstations, access points and business equipment with organised cabling alongside your power installation." },
    { title: "CCTV Installation & Surveillance", description: "Plan property monitoring alongside the backup power needed by your cameras and recording equipment." },
    { title: "Managed IT Support & Maintenance", description: "Keep the business technology supported by your energy system maintained and ready for everyday use." },
  ],
  "data-centre-infrastructure": [
    { title: "Fibre Optic Cabling", description: "Connect racks, floors and buildings with fibre links planned around your infrastructure layout." },
    { title: "Enterprise Server Supply & Installation", description: "Equip your completed server environment with hardware selected for your workloads and deployment requirements." },
    { title: "Access Control Systems", description: "Manage authorised entry to server rooms and equipment areas with suitable access control." },
  ],
  "network-structured-cabling": [
    { title: "Data Storage Solutions", description: "Support shared files and business applications with storage connected to your network environment." },
    { title: "CCTV Installation & Surveillance", description: "Extend your connectivity planning to IP cameras, recording equipment and property monitoring." },
    { title: "Managed IT Support & Maintenance", description: "Arrange troubleshooting and maintenance for the equipment and systems that depend on your connections." },
  ],
  "server-storage-hardware": [
    { title: "Data Centre Design & Infrastructure Planning", description: "Plan the space, rack layout and supporting infrastructure needed for your server and storage deployment." },
    { title: "Network Design & Installation", description: "Connect your computing and storage equipment through a network designed around users and workloads." },
    { title: "Hybrid Solar & Inverter Systems", description: "Assess suitable power and backup arrangements for designated IT equipment within your wider energy plan." },
  ],
  "security-surveillance": [
    { title: "Structured LAN Cabling", description: "Provide organised network connections for compatible IP cameras, recorders and monitoring points." },
    { title: "Data Storage Solutions", description: "Plan compatible storage capacity around recording requirements, retention settings and future expansion." },
    { title: "Solar Battery Storage Solutions", description: "Consider battery backup for designated security equipment when planning your property's power requirements." },
  ],
  "it-services-support": [
    { title: "Server Configuration & Upgrades", description: "Address changing workloads with server configuration and equipment upgrades matched to your environment." },
    { title: "Network Configuration & Upgrades", description: "Improve the connections behind everyday operations through practical network configuration and upgrades." },
    { title: "Security System Maintenance & Upgrades", description: "Extend your maintenance planning to cameras, recording systems and supporting security equipment." },
  ],
};

export function getOverviewRelatedServices(slug: string) {
  const services = solutionPillars.flatMap(pillar => pillar.items);
  return (recommendations[slug] ?? []).map(({ title, description }) => {
    const service = services.find(item => item.title === title);
    if (!service) throw new Error(`Missing related overview service: ${title}`);
    return {
      title,
      paragraphs: [description],
      image: service.image,
      action: { label: `Explore ${title}`, href: service.href },
    };
  });
}
