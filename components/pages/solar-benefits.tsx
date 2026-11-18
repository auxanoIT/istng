import { OverviewBenefits } from "@/components/pages/overview-benefits";
import type { OverviewCopy } from "@/components/pages/overview-layout";

const benefitImages = [
  "/integrated-assets/images/solutions/solar-storefront.webp",
  "/integrated-assets/images/solutions/battery-storage.webp",
  "/integrated-assets/images/solar-campus.webp",
  "/image/operation-teams/journey-residential.webp",
  "/image/industries/corporate-offices.webp",
  "/integrated-assets/images/rooftop-solar-technicians-no-battery.webp",
];

export function SolarBenefits({ copy }: { copy: OverviewCopy & { items: OverviewCopy[] } }) {
  return <OverviewBenefits id="solar-benefits" copy={copy} images={benefitImages} />;
}
