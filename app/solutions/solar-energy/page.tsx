import type { Metadata } from "next";

import { SolarOverview } from "@/components/pages/solar-overview";
import { solarHeroImage, solarMetaDescription, solarMetaTitle } from "@/data/solar-overview";
import { solarOverviewPath } from "@/data/solar-routes";
import { buildMetadata } from "@/lib/seo";

const baseMetadata = buildMetadata({
  title: solarMetaTitle,
  description: solarMetaDescription,
  path: solarOverviewPath,
  imagePath: solarHeroImage.src,
  imageAlt: solarHeroImage.alt,
  keywords: ["solar installation Nigeria", "hybrid solar inverters", "solar battery storage"],
});

export const metadata: Metadata = {
  ...baseMetadata,
  title: { absolute: solarMetaTitle },
  description: solarMetaDescription,
  openGraph: { ...baseMetadata.openGraph, description: solarMetaDescription },
  twitter: { ...baseMetadata.twitter, description: solarMetaDescription },
};

export default function SolarEnergyPage() {
  return <SolarOverview />;
}
