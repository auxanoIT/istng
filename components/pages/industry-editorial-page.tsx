import { ChevronDown } from "lucide-react";
import { ConsultationForm } from "@/components/forms/consultation-form";
import { OverviewExplorer } from "@/components/pages/overview-explorer";
import { OverviewBanner, OverviewHeading, OverviewParagraphs, OverviewSection } from "@/components/pages/overview-layout";
import { OverviewFaq } from "@/components/pages/overview-resources";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import type { getIndustryEditorial } from "@/data/industry-editorial";
import type { IndustryProfile } from "@/lib/types";
import { cn } from "@/lib/utils";
import { IndustryOverviewExplorer } from "./industry-overview-explorer";

type Editorial = NonNullable<ReturnType<typeof getIndustryEditorial>>;

const enquiry = "#industry-enquiry";
const solutionsAnchor = "#industry-solutions";

function EnquiryLink({ label, className }: { label?: string; className?: string }) {
  return label ? <ButtonLink href={enquiry} className={cn("rounded-md shadow-none", className)}>{label}</ButtonLink> : null;
}

export function IndustryEditorialPage({ industry, copy }: { industry: IndustryProfile; copy: Editorial }) {
  const { hero, solutions, applications, challenges, approach, faq, closing } = copy;

  return (
    <>
      <OverviewBanner hero fadeToNavy copy={{ title: hero.title, paragraphs: [copy.description] }} image={industry.heroImage} actions={[
        { label: hero.primary!, href: enquiry },
        { label: hero.secondary!, href: solutionsAnchor },
      ]} />

      <OverviewSection id="industry-overview" tone="navy">
        <IndustryOverviewExplorer key={industry.slug} experience={copy.overviewExperience} industry={industry.title} enquiry={enquiry} />
      </OverviewSection>

      <OverviewSection id="industry-solutions">
        <OverviewHeading id="industry-solutions-title" copy={solutions} />
        <OverviewExplorer label={solutions.title} controlsClassName="lg:sticky lg:top-24" entries={solutions.items.map((item) => ({
          ...item,
          title: item.title[0] + item.title.slice(1).toLowerCase().replace(/\b(it|cctv|rfid|isp|pop)\b/g, (acronym) => acronym === "pop" ? "PoP" : acronym.toUpperCase()).replace(/wi-fi/g, "Wi-Fi"),
          action: { label: item.cta!, href: enquiry },
          relatedAction: { label: "View service details", href: item.href },
        }))} />
      </OverviewSection>

      <OverviewSection id="industry-applications" tone="warm">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.25fr] lg:gap-14">
          <div className="text-center lg:sticky lg:top-24 lg:self-start">
            <OverviewHeading id="industry-applications-title" copy={applications} />
            <EnquiryLink label={applications.cta} className="mt-6" />
          </div>
          <ul className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
            {applications.items.map((item) => (
              <li key={item.title} className="border-t border-brand-border pt-4">
                <h3 className="font-semibold">{item.title}</h3>
                <OverviewParagraphs paragraphs={item.paragraphs} className="mt-2 text-brand-support" />
              </li>
            ))}
          </ul>
        </div>
      </OverviewSection>

      <OverviewSection id="industry-challenges" tone="navy">
        <OverviewHeading inverse id="industry-challenges-title" copy={challenges} />
        <div className="mx-auto mt-8 max-w-5xl divide-y divide-white/20 border-y border-white/20">
          {challenges.items.map(({ title, problem, approach: response }, index) => (
            <details key={title} name="industry-challenges" open={index === 0} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-base font-semibold focus-visible:outline-brand-orange sm:text-lg [&::-webkit-details-marker]:hidden">
                {title}
                <ChevronDown aria-hidden="true" size={20} className="shrink-0 text-brand-orange transition-transform group-open:rotate-180 motion-reduce:transition-none" />
              </summary>
              <div className="grid gap-4 pb-6 sm:grid-cols-2 sm:gap-8">
                <div><h3 className="text-sm font-semibold text-brand-orange">The challenge</h3><OverviewParagraphs paragraphs={[problem]} className="mt-2 text-slate-200" /></div>
                <div><h3 className="text-sm font-semibold text-brand-orange">How we address it</h3><OverviewParagraphs paragraphs={[response]} className="mt-2 text-slate-200" /></div>
              </div>
            </details>
          ))}
        </div>
      </OverviewSection>

      <OverviewSection id="industry-approach">
        <OverviewHeading id="industry-approach-title" copy={approach} />
        <ol className="mt-8 grid gap-y-6 border-l border-brand-border pl-5 sm:grid-cols-2 sm:gap-x-8 sm:border-l-0 sm:pl-0 lg:grid-cols-5">
          {approach.items.map((item) => (
            <li key={item.title} className="relative sm:border-t sm:border-brand-border sm:pt-5">
              <span aria-hidden="true" className="absolute top-2 -left-5 size-2 -translate-x-1/2 rounded-full bg-brand-orange sm:top-0 sm:left-0 sm:translate-x-0 sm:-translate-y-1/2" />
              <h3 className="font-semibold">{item.title}</h3>
              <OverviewParagraphs paragraphs={item.paragraphs} className="mt-2 text-brand-support" />
            </li>
          ))}
        </ol>
        <div className="mt-8 text-center"><EnquiryLink label={approach.cta} /></div>
      </OverviewSection>

      <OverviewFaq id="industry-faq" copy={faq} action={{ label: faq.cta!, href: enquiry }} renderAllAnswers />

      <div id="industry-enquiry" className="scroll-mt-24 bg-white py-14 sm:py-20">
        <Container>
          <ConsultationForm
            title={industry.formTitle}
            description="Share a few details about your site and requirements so we can help you plan the next step."
            headingAlign="center"
          />
        </Container>
      </div>

      <OverviewBanner copy={closing} image={industry.heroImage} actions={[
        { label: closing.primary!, href: enquiry },
        { label: closing.secondary!, href: "/solutions" },
      ]} />
    </>
  );
}
