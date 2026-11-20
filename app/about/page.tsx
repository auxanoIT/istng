import { OverviewBanner, OverviewHeading } from "@/components/pages/overview-layout";
import { AboutIndustries } from "@/components/sections/about-industries";
import { AboutValues } from "@/components/sections/about-values";
import { AboutApproach } from "@/components/sections/about-approach";
import { AboutVisionMission } from "@/components/sections/about-vision-mission";
import { AboutPurpose } from "@/components/sections/about-purpose";
import { AboutCompany } from "@/components/sections/about-company";
import { AboutStory } from "@/components/sections/about-story";
import { TrustBanner } from "@/components/sections/trust-banner";
import { Container } from "@/components/ui/container";
import { JsonLd } from "@/components/ui/json-ld";
import copy from "@/data/about-company.json";
import { aboutContent } from "@/data/about-content";
import { homeTrustCopy } from "@/data/site-content";
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

      <AboutIndustries />

      <div id="about-trust" className="scroll-mt-24">
        <TrustBanner section={{
          _type: "trustBanner",
          title: homeTrustCopy.title,
          description: copy.trust.description,
          cta: { label: copy.trust.cta, href: "/services", variant: "primary" },
        }} />
      </div>

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
