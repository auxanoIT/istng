export const industryNavigation = [
  {
    id: "commercial-industrial",
    label: "Commercial & Industrial",
    entries: [
      ["corporate-offices", "Corporate Offices & Enterprises"],
      ["manufacturing", "Manufacturing & Industrial Facilities"],
      ["warehousing-logistics", "Warehousing & Logistics"],
      ["retail", "Retail & Shopping Centres"],
    ],
  },
  {
    id: "essential-institutions",
    label: "Essential Services & Institutions",
    entries: [
      ["healthcare", "Healthcare & Medical Facilities"],
      ["education", "Education & Academic Institutions"],
      ["financial-services", "Banking, Finance & Fintech"],
      ["government", "Government & Public Institutions"],
    ],
  },
  {
    id: "property-hospitality-infrastructure",
    label: "Property, Hospitality & Critical Infrastructure",
    entries: [
      ["real-estate-property-management", "Real Estate & Property Development"],
      ["hospitality", "Hospitality & Leisure"],
      ["data-centres", "Data Centres & Cloud Infrastructure"],
      ["telecommunications-isps", "Telecommunications & Internet Service Providers (ISPs)"],
      ["residential-homes-gated-communities", "Residential Homes & Gated Communities"],
      ["religious-organizations", "Religious & Community Facilities"],
    ],
  },
  {
    id: "b2b",
    label: "Additional B2B Segment",
    entries: [["technology-partners", "Technology Partners & Remote Infrastructure Teams"]],
  },
  {
    id: "energy-agriculture",
    label: "Energy & Agriculture",
    entries: [
      ["energy-utilities", "Energy & Utilities"],
      ["agriculture-agribusiness", "Agriculture & Agribusiness"],
    ],
  },
] as const;
