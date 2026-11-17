import records from "./integrated-case-studies.json";
import type { CaseStudy, ServiceNavMedia } from "@/lib/types";

const portfolioImage = (file: string, alt: string): ServiceNavMedia => ({
  src: `/image/case-studies/integrated/${file}.webp`, alt,
});

export const installationPortfolio = [
  portfolioImage("solar-panel-installation-team", "Installers positioning solar panels on a rooftop"),
  portfolioImage("hybrid-inverter-lithium-battery", "Wall-mounted hybrid inverter with a floor-standing battery"),
  portfolioImage("rooftop-panel-rows", "Two rows of solar panels mounted on a roof"),
  portfolioImage("inverter-wet-cell-battery-bank", "Inverter installation with a rack of wet-cell batteries"),
  portfolioImage("tiled-roof-solar-panels", "Solar panels mounted above a tiled residential roof"),
  portfolioImage("dual-inverter-battery-system", "Two wall-mounted inverters above a battery unit"),
  portfolioImage("urban-rooftop-solar", "Rooftop solar panels with surrounding urban buildings"),
  portfolioImage("indoor-inverter-battery", "Indoor wall-mounted inverter and battery installation"),
  portfolioImage("electrical-protection-inverter", "Inverter installed alongside electrical protection equipment"),
  portfolioImage("residential-roof-solar", "Solar panel array on a sloping residential roof"),
  portfolioImage("rooftop-solar-array", "Solar array fitted to a metal roof"),
  portfolioImage("indoor-power-equipment", "Indoor inverter and energy equipment on a utility wall"),
  portfolioImage("pitched-roof-panels", "Four solar panels mounted on a residential roof"),
];

// Client explicitly authorised relatable portfolio photography. The files do not
// identify their sites, so captions never claim a photograph shows that client.
const photoSelections: Record<string, number[]> = {
  "cihp-multi-location-inverter-battery-backup-nigeria": [3, 1],
  "piggytech-server-room-office-battery-backup-lagos": [1],
  "ernneka-shop-office-solar-installation-lagos": [7, 2],
  "river-valley-estate-residential-solar-installation": [7],
  "sunshine-estate-residential-hybrid-solar-installations": [12, 7],
  "magodo-phase-one-residential-solar-installation-lagos": [9, 7],
  "ajasa-command-residential-solar-battery-installation-lagos": [2, 1],
  "gateway-sparklight-estate-home-solar-installation": [4, 1],
  "kaduna-kawo-zaria-hospital-inverter-battery-installations": [3],
};

// Four targeted illustrations replace mismatched lead images. The five other
// project lead images and every supporting gallery photograph remain originals.
const leadIllustrations: Record<string, ServiceNavMedia> = {
  "cihp-multi-location-inverter-battery-backup-nigeria": portfolioImage("hospital-inverter-battery-illustration", "Illustration of an institutional inverter and twelve-battery backup bank"),
  "piggytech-server-room-office-battery-backup-lagos": portfolioImage("server-room-inverter-lithium-illustration", "Illustration of an inverter and lithium battery beside server racks"),
  "ernneka-shop-office-solar-installation-lagos": portfolioImage("commercial-solar-rooftop-illustration", "Illustration of a commercial building with a sixteen-panel rooftop solar array"),
  "river-valley-estate-residential-solar-installation": portfolioImage("nigerian-home-rooftop-solar-illustration", "Illustration of a Nigerian home with twelve rooftop solar panels"),
};

export const integratedCaseStudies: CaseStudy[] = records.map(record => {
  const photos = (photoSelections[record.slug] ?? []).map(index => installationPortfolio[index]);
  const illustration = leadIllustrations[record.slug];
  return {
    ...record,
    textOnly: !photos.length,
    image: illustration ?? photos[0],
    imageIsIllustrative: Boolean(illustration),
    imageCaption: illustration ? "AI-generated illustration" : "",
    gallery: (illustration ? photos : photos.slice(1)).map(image => ({ ...image, caption: image.alt })),
  };
});

export function mergeIntegratedCaseStudies(cmsRecords: CaseStudy[] = []): CaseStudy[] {
  const bySlug = new Map(integratedCaseStudies.map(record => [record.slug, record]));
  for (const record of cmsRecords) bySlug.set(record.slug, record);
  return [...bySlug.values()].filter(record => record.published === true);
}

export const additionalInstallationRecords = [
  { title: "DBO", period: "November 2023", equipment: "10 kVA hybrid inverter", note: "The supplied record does not list a location, solar panels or battery capacity." },
  { title: "Okota residential installation", period: "April 2025", equipment: "6 kVA hybrid inverter", note: "The supplied record does not list solar panels or battery capacity." },
];
