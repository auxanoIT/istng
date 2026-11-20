import Link from "@/components/ui/site-link";
import { ArrowRight } from "lucide-react";
import { OverviewBanner, OverviewHeading, OverviewSection } from "@/components/pages/overview-layout";
import { AboutValues } from "@/components/sections/about-values";
import { AboutApproach } from "@/components/sections/about-approach";
import { AboutVisionMission } from "@/components/sections/about-vision-mission";
import { AboutPurpose } from "@/components/sections/about-purpose";
import { AboutCompany } from "@/components/sections/about-company";
import { AboutStory } from "@/components/sections/about-story";
import { AboutTeam } from "@/components/sections/about-team";
import { PartnerLogoMarquee } from "@/components/sections/partner-logo-marquee";
import { Container } from "@/components/ui/container";
import { JsonLd } from "@/components/ui/json-ld";
import copy from "@/data/about-company.json";
import { aboutContent } from "@/data/about-content";
import { industryNavigation } from "@/data/industry-navigation";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";

const title = "About Integrated Solutions Technology | Nigeria";
const description = "Discover Integrated Solutions Technology, a Nigerian provider of solar energy, IT infrastructure, networking, security and technical support solutions.";
const path = "/about";
const heroImage = { src: aboutContent.hero.image, alt: aboutContent.hero.alt };

export const metadata = buildMetadata({
  title,
  description,
  path,
  imagePath: heroImage.src,
  imageAlt: heroImage.alt,
  keywords: [
    "Integrated Solutions Technology",
    "technology solutions company Nigeria",
    "solar energy solutions provider Nigeria",
    "IT infrastructure services Nigeria",
    "networking and security solutions company",
    "enterprise technology solutions",
  ],
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "@id": `${absoluteUrl(path)}#about`,
        name: title,
        url: absoluteUrl(path),
        description,
        image: absoluteUrl(heroImage.src),
        mainEntity: { "@id": `${absoluteUrl("/")}#organization` },
      }} />

      <OverviewBanner hero fadeToNavy copy={copy.hero} image={heroImage} actions={[
        { label: copy.hero.actions[0], href: "/services" },
        { label: copy.hero.actions[1], href: "/book-consultation" },
      ]} />

      <AboutStory />

      <AboutCompany />

      <AboutPurpose />

      <AboutVisionMission />

      <AboutValues />

      <AboutApproach />

      <OverviewSection id="about-industries">
        <OverviewHeading id="about-industries-title" copy={copy.industries} />
        <details className="mx-auto mt-7 max-w-5xl rounded-lg border border-brand-border bg-brand-soft-white open:bg-white">
          <summary className="cursor-pointer p-5 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange-text">{copy.industries.cta}</summary>
          <div className="grid gap-6 border-t border-brand-border p-5 sm:grid-cols-2 lg:grid-cols-3">
            {industryNavigation.map(({ id, label, entries }) => (
              <div key={id}>
                <h3 className="font-semibold">{label}</h3>
                <ul className="mt-2">
                  {entries.map(([slug, name]) => (
                    <li key={slug}>
                      <Link href={`/industries/${slug}`} className="inline-flex min-h-10 items-center gap-2 text-sm text-brand-support underline-offset-4 hover:underline">
                        {name}<ArrowRight size={15} aria-hidden="true" className="shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </details>
      </OverviewSection>

      <PartnerLogoMarquee staticDisplay />
      <OverviewSection id="about-team">
        <OverviewHeading id="about-team-title" copy={aboutContent.people} />
        <div className="mt-8"><AboutTeam /></div>
      </OverviewSection>

      <div className="bg-brand-soft-white text-brand-navy">
        <Container className="grid gap-8 py-14 sm:py-20 lg:grid-cols-2 lg:gap-14">
          <section aria-labelledby="about-commitment-title">
            <OverviewHeading id="about-commitment-title" copy={copy.commitment} align="left" />
          </section>
          <section aria-labelledby="about-future-title">
            <OverviewHeading id="about-future-title" copy={copy.future} align="left" />
          </section>
        </Container>
      </div>

      <OverviewBanner
        copy={copy.closing}
        image={{ src: aboutContent.collaboration.image, alt: aboutContent.collaboration.alt }}
        actions={[
          { label: copy.closing.actions[0], href: "/book-consultation" },
          { label: copy.closing.actions[1], href: "/services" },
        ]}
      />
      <p className="bg-brand-navy px-5 py-5 text-center text-sm text-white">{copy.closing.statement}</p>
    </>
  );
}
