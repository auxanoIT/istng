// Search snippets are separate from the longer, visible page headings.
// Keep these route-specific edits consistent across standard and service templates.
const searchCopy: Record<string, { title?: string; description?: string }> = {
  "/industries/technology-partners": { title: "Technology Partner Support Nigeria | Integrated Solutions Technology" },
  "/industries/telecommunications-isps": { title: "Telecom & ISP Solutions Nigeria | Integrated Solutions Technology" },
  "/industries/oems-technology-vendors": { title: "OEM Field Support Nigeria | Integrated Solutions Technology" },
  "/services/server-storage-hardware": {
    title: "Server & Storage Services Nigeria | Integrated Solutions Technology",
    description: "Enterprise server and storage supply, repair, deployment and procurement support in Nigeria. Discuss your hardware requirements with Integrated Solutions Technology.",
  },
  "/services/infrastructure-audit-optimisation": { title: "Data Centre Audits & Optimisation Nigeria | Integrated Solutions Technology" },
  "/industries/system-integrators": {
    title: "System Integrator Support Nigeria | Integrated Solutions Technology",
    description: "Local deployment, Smart Hands, network and hardware support for system integrators delivering infrastructure projects in Nigeria.",
  },
  "/industries/technology-companies": { title: "IT Infrastructure for Tech Companies Nigeria | Integrated Solutions Technology" },
  "/services/audio-visual-services-livestreaming": { title: "AV & Livestreaming Services Lagos | Integrated Solutions Technology" },
  "/resources/insights/how-to-choose-a-data-centre-deployment-provider-in-nigeria": { title: "Choosing a Data Centre Provider in Nigeria | Integrated Solutions Technology" },
  "/resources/insights/how-much-does-data-centre-deployment-cost-nigeria": { title: "Data Centre Deployment Cost Nigeria: 7 Factors | Integrated Solutions Technology" },
  "/industries/religious-organizations": { title: "IT for Religious Organisations Nigeria | Integrated Solutions Technology" },
  "/industries/managed-service-providers": { title: "Local MSP Technical Support Nigeria | Integrated Solutions Technology" },
  "/services/data-centre-security-safety": {
    title: "Data Centre Security Services Nigeria | Integrated Solutions Technology",
    description: "Data centre access control, CCTV, mantraps, fire alarms and security deployment in Nigeria. Discuss your site's requirements with Integrated Solutions Technology.",
  },
  "/services/network-infrastructure-connectivity": {
    title: "Network Infrastructure & Cabling Nigeria | Integrated Solutions Technology",
    description: "Network installation, configuration, fibre and copper cabling, labelling and remediation for data centres and businesses in Nigeria.",
  },
  "/industries/financial-services": { title: "IT for Financial Services Nigeria | Integrated Solutions Technology" },
  "/resources": { title: "IT Guides & Case Studies Nigeria | Integrated Solutions Technology" },
  "/services/smart-hands-technical-support/planned-maintenance-support": { title: "Data Centre Maintenance Support Nigeria | Integrated Solutions Technology" },
  "/services/smart-hands-technical-support": {
    description: "Onsite Smart Hands and data centre technical support in Nigeria for operators, enterprises and remote engineering teams. Discuss your project.",
  },
  "/services/data-centre-deployment": {
    description: "Data centre deployment in Nigeria: rack-and-stack, equipment installation, server deployment, testing and verification. Discuss your project.",
  },
};

export function resolveSearchCopy(path: string, title: string, description: string) {
  const copy = searchCopy[path];
  return { title: copy?.title ?? title, description: copy?.description ?? description };
}
