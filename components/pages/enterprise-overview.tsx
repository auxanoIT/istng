import Image from "next/image";

import { OverviewBenefits } from "@/components/pages/overview-benefits";
import { OverviewExplorer } from "@/components/pages/overview-explorer";
import { OverviewBanner, OverviewHeading, OverviewParagraphs, OverviewSection } from "@/components/pages/overview-layout";
import { OverviewFaq, OverviewRelated } from "@/components/pages/overview-resources";
import { OverviewDecision } from "@/components/pages/solar-decision";
import { ButtonLink } from "@/components/ui/button-link";
import type { EnterpriseOverviewData } from "@/data/enterprise-overview";

const exploreHref = "#overview-services";

export function EnterpriseOverview({ overview }: { overview: EnterpriseOverviewData }) {
  const { pillar, draft, enquiry, heroImage, foundations, services, environments, related, system, intro, supportImage, closingImage, benefitImages, priorities } = overview;

  return (
    <>
      <OverviewBanner hero fadeToNavy copy={{ ...draft.hero, paragraphs: [intro] }} image={heroImage} actions={[
        { label: draft.hero.ctas[0], href: enquiry },
        { label: draft.hero.ctas[1], href: exploreHref },
      ]} />

      <OverviewSection id="project-foundations" tone="navy">
        <OverviewHeading copy={{ ...draft.reliability, paragraphs: [] }} id="project-foundations-title" inverse />
        <div className="lg:hidden">
          <OverviewExplorer entries={foundations} label="Project foundations" inverse />
        </div>
        <div className="mx-auto mt-9 hidden max-w-6xl gap-8 lg:grid lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-12">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg sm:aspect-video lg:aspect-[4/3]">
            <Image src={supportImage.src} alt="" fill sizes="(min-width: 1024px) 580px, 100vw" className="object-cover" />
          </div>
          <ul className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:gap-y-8">
            {draft.reliability.items.map((item) => (
              <li key={item.title} className="border-t border-white/25 pt-4">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <OverviewParagraphs paragraphs={item.paragraphs.slice(0, 1)} className="mt-2 text-slate-200" />
              </li>
            ))}
          </ul>
        </div>
      </OverviewSection>

      <OverviewBenefits id="overview-benefits" copy={{ ...draft.benefits, paragraphs: [] }} images={benefitImages} />

      <OverviewSection id="overview-services">
        <OverviewHeading copy={{ ...draft.services, paragraphs: [] }} id="overview-services-title" />
        <OverviewExplorer entries={services} label={pillar.label} stickyControls controlsClassName="lg:mt-20 xl:mt-24" />
      </OverviewSection>

      <OverviewSection id="project-explained" tone="navy">
        <div className="mx-auto mb-3 h-0.5 w-10 bg-brand-orange" aria-hidden="true" />
        <OverviewHeading copy={{ ...draft.system, paragraphs: [] }} id="project-explained-title" inverse />
        <OverviewExplorer entries={system} label="How it works" inverse imageFirst controlsClassName="lg:self-center" />
        {draft.system.ctas?.[0] && (
          <div className="mt-7 text-center">
            <ButtonLink href={enquiry} className="rounded-md shadow-none">{draft.system.ctas[0]}</ButtonLink>
          </div>
        )}
      </OverviewSection>

      <OverviewSection id="project-environments">
        <OverviewHeading copy={{ ...draft.environments, paragraphs: [] }} id="project-environments-title" />
        <OverviewExplorer entries={environments} label="Environments we support" imageFirst stickyControls />
      </OverviewSection>

      <OverviewDecision id="project-priorities" title={draft.decisions.title} question="What would you like to address?"
        image={{ ...supportImage, alt: "" }} priorities={priorities} service={pillar.label} action={draft.decisions.ctas[0]} />

      <OverviewRelated copy={{ ...draft.related, paragraphs: [draft.related.paragraphs[0]].filter(Boolean) }} items={related} />

      <OverviewFaq id="overview-faq" copy={{ ...draft.faq, paragraphs: [] }} action={{ label: draft.faq.ctas[0], href: enquiry }} />

      <OverviewBanner copy={{ ...draft.closing, paragraphs: [pillar.description] }} image={closingImage} actions={[
        { label: draft.closing.ctas[0], href: enquiry },
        { label: draft.closing.ctas[1], href: exploreHref },
      ]} />
    </>
  );
}
