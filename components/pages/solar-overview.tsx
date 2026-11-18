import { OverviewExplorer } from "@/components/pages/overview-explorer";
import {
  OverviewBanner, OverviewHeading, OverviewSection,
} from "@/components/pages/overview-layout";
import { SolarBenefits } from "@/components/pages/solar-benefits";
import { SolarDecision } from "@/components/pages/solar-decision";
import { SolarPowerExplainer } from "@/components/pages/solar-power-explainer";
import { SolarReliability } from "@/components/pages/solar-reliability";
import { OverviewFaq, OverviewRelated } from "@/components/pages/overview-resources";
import copy from "@/data/solar-overview-copy.json";
import {
  solarClosingImage, solarConsultationHref, solarEnvironmentEntries, solarHeroImage,
  solarRelatedEntries, solarServiceEntries,
} from "@/data/solar-overview";

const exploreHref = "#solar-services";

export function SolarOverview() {
  return (
    <>
      <OverviewBanner hero fadeToNavy copy={copy.hero} image={solarHeroImage} actions={[
        { label: copy.hero.ctas[0], href: solarConsultationHref },
        { label: copy.hero.ctas[1], href: exploreHref },
      ]} />

      <SolarReliability copy={copy.reliability} />

      <SolarBenefits copy={copy.benefits} />

      <OverviewSection id="solar-services">
        <OverviewHeading copy={copy.services} id="solar-services-title" />
        <OverviewExplorer entries={solarServiceEntries} label="Solar services" stickyControls controlsClassName="lg:mt-20 xl:mt-24" />
      </OverviewSection>

      <OverviewSection id="how-solar-works" tone="navy">
        <div className="mx-auto mb-3 h-0.5 w-10 bg-brand-orange" aria-hidden="true" />
        <OverviewHeading copy={{ ...copy.system, paragraphs: [] }} id="how-solar-works-title" inverse />
        <SolarPowerExplainer action={{ href: solarConsultationHref, label: copy.system.ctas[0] }} />
      </OverviewSection>

      <OverviewSection id="solar-environments">
        <OverviewHeading copy={copy.environments} id="solar-environments-title" />
        <OverviewExplorer entries={solarEnvironmentEntries} label="Who we power" imageFirst stickyControls />
      </OverviewSection>

      <SolarDecision />

      <OverviewRelated copy={copy.related} items={solarRelatedEntries} />

      <OverviewFaq id="solar-faq" copy={copy.faq} action={{ href: solarConsultationHref, label: copy.faq.ctas[0] }} />

      <OverviewBanner copy={copy.closing} image={solarClosingImage} actions={[
        { label: copy.closing.ctas[0], href: solarConsultationHref },
        { label: copy.closing.ctas[1], href: exploreHref },
      ]} />
    </>
  );
}
