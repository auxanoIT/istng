import scenes from "./industry-overview-scenes.json";

export type IndustryFocus = "connectivity" | "power" | "security" | "visibility" | "growth" | "support" | "planning" | "protection" | "records";
export type ScenePoint = { x: number; y: number };
export type IndustryScene = {
  src: string; alt: string; width: number; height: number;
  anchors: Record<"network" | "solar" | "utility" | "entry" | "work" | "accessPoint" | "camera" | "growth" | "records", ScenePoint>;
};
type Configuration = { intro: string; labels: string[]; focus: IndustryFocus[] };
const configurations: Record<string, Configuration> = {
  "corporate-offices": { intro: "Power, connectivity, security and IT, planned around the way your teams work.", labels: ["Connected Teams", "Reliable Operations", "Controlled Environments", "Ready for Change"], focus: ["connectivity", "power", "security", "growth"] },
  manufacturing: { intro: "Energy, connectivity and technical infrastructure planned around your production environment.", labels: ["Production Continuity", "Connected Facilities", "Site Visibility", "Ready for Expansion"], focus: ["power", "connectivity", "visibility", "growth"] },
  "warehousing-logistics": { intro: "Connect warehouse teams, support essential equipment and manage visibility across your facility.", labels: ["Facility Connectivity", "Site Visibility", "Controlled Access", "Room to Grow"], focus: ["connectivity", "visibility", "security", "growth"] },
  retail: { intro: "Bring store connectivity, power and security together around everyday retail operations.", labels: ["Connected Systems", "Store Visibility", "Reliable Operations", "Easier Expansion"], focus: ["connectivity", "visibility", "power", "growth"] },
  healthcare: { intro: "Plan energy, connectivity and supporting technology around your facility's operational requirements.", labels: ["Operational Continuity", "Connected Departments", "Facility Security", "Practical Maintenance"], focus: ["power", "connectivity", "security", "support"] },
  education: { intro: "Support learning, administration and campus activity with connected energy and technology infrastructure.", labels: ["Digital Learning", "Everyday Operations", "Campus Security", "Ready for Growth"], focus: ["connectivity", "power", "security", "growth"] },
  "financial-services": { intro: "Coordinate branch connectivity, access controls and enterprise infrastructure around your operations.", labels: ["Connected Operations", "Network Protection", "Maintainable IT", "Physical Security"], focus: ["connectivity", "protection", "support", "security"] },
  government: { intro: "Support public institutions with coordinated power, connectivity, security and maintainable infrastructure.", labels: ["Institutional Operations", "Technical Records", "Facility Security", "Long-Term Maintenance"], focus: ["power", "records", "security", "support"] },
  "real-estate-property-management": { intro: "Plan the systems behind comfortable occupancy, connected buildings and practical property management.", labels: ["Early Planning", "Property Readiness", "Connected Buildings", "Easier Maintenance"], focus: ["planning", "power", "connectivity", "support"] },
  hospitality: { intro: "Connect guest services, support hotel equipment and coordinate the systems behind each stay.", labels: ["Guest Connectivity", "Hotel Operations", "Property Security", "Power Planning"], focus: ["connectivity", "support", "security", "power"] },
  "data-centres": { intro: "Coordinate physical deployment, technical records and onsite support around your infrastructure environment.", labels: ["Clear Deployment", "Remote-Team Support", "Infrastructure Records", "Operational Planning"], focus: ["planning", "support", "records", "growth"] },
  "telecommunications-isps": { intro: "Plan, connect and maintain the physical infrastructure behind your network operations.", labels: ["Planned Deployment", "Traceable Connections", "Remote-Team Support", "Future Expansion"], focus: ["planning", "connectivity", "support", "growth"] },
  "residential-homes-gated-communities": { intro: "Bring home energy, connectivity and property security together around everyday living.", labels: ["Household Power", "Property Visibility", "Controlled Entry", "Practical Maintenance"], focus: ["power", "visibility", "security", "support"] },
  "religious-organizations": { intro: "Support gatherings, facility teams and community activities with coordinated energy and technology systems.", labels: ["Support Gatherings", "Connected Teams", "Facility Management", "Future Activities"], focus: ["power", "connectivity", "security", "growth"] },
  "technology-partners": { intro: "Bring local execution, technical coordination and clear records to your remote infrastructure projects.", labels: ["Onsite Execution", "Agreed Project Scope", "Clear Communication", "Flexible Engagement"], focus: ["support", "planning", "records", "growth"] },
  "energy-utilities": { intro: "Coordinate energy systems with the connectivity, security and technical support your facility needs.", labels: ["Energy System Design", "Connected Infrastructure", "Facility Protection", "Clear Handover"], focus: ["power", "connectivity", "security", "records"] },
  "agriculture-agribusiness": { intro: "Plan energy, connectivity and facility monitoring around your agricultural workplace and equipment.", labels: ["Essential Power", "Connected Workplaces", "Facility Visibility", "Future Expansion"], focus: ["power", "connectivity", "visibility", "growth"] },
};

const sceneData: Record<string, IndustryScene> = scenes;
const corporate = [
  { title: "Keep your teams connected.", paragraphs: ["Structured networks help your people access the systems they need."] },
  { title: "Support everyday operations.", paragraphs: ["Plan power and supporting infrastructure around essential equipment and working hours."] },
  { title: "Manage access to your workplace.", paragraphs: ["Coordinate access control and surveillance around the areas your business needs to protect."] },
  { title: "Prepare for what comes next.", paragraphs: ["Plan equipment, connections and maintenance around changing teams and future business requirements."] },
];

export function getIndustryOverviewExperience(slug: string, overview: { title: string; items: { title: string; paragraphs: string[] }[] }) {
  const configuration = configurations[slug];
  const image = sceneData[slug];
  if (!configuration || !image) throw new Error(`Missing industry overview experience: ${slug}`);
  return {
    title: overview.title,
    intro: configuration.intro,
    image,
    items: overview.items.map((item, index) => ({
      ...(slug === "corporate-offices" ? corporate[index] : item),
      label: configuration.labels[index],
      focus: configuration.focus[index],
    })),
  };
}

export type IndustryOverviewExperience = ReturnType<typeof getIndustryOverviewExperience>;
