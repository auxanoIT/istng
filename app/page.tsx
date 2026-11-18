import { IntegratedSolutionsHome } from "@/components/pages/integrated-solutions-home";
import { homeServicePillars } from "@/data/home-service-pillars";
import { homeProjectCta } from "@/data/home-project-cta";
import { homeTrustCopy } from "@/data/site-content";
import { notFound } from "next/navigation";
import { SectionRenderer } from "@/components/sections/section-renderer";
import { FooterVideoCta } from "@/components/sections/footer-video-cta";
import { HeroMetricStrip } from "@/components/sections/hero-metric-strip";
import { PartnerLogoMarquee } from "@/components/sections/partner-logo-marquee";
import { getMarketingPage, getServices, getCaseStudies, getTestimonials, getFaqs } from "@/lib/content";
import { JsonLd } from "@/components/ui/json-ld";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";
import styles from "./home.module.css";

export const revalidate = false;

export const metadata = buildMetadata({
  title: "Solar Energy & IT Solutions Nigeria | Integrated Solutions Technology",
  description:
    "Solar installation, battery storage, data centre infrastructure, networking, security and IT support in Nigeria from Integrated Solutions Technology.",
  path: "/",
  keywords: [
    "solar energy solutions Nigeria",
    "solar installation Lagos",
    "data centre infrastructure services Nigeria",
    "data centre technical support Nigeria",
    "Smart Hands services Nigeria",
    "data centre installation services",
    "data centre engineers Lagos",
  ],
});

export default async function HomePage() {
  const [page, services, caseStudies, testimonials, faqs] = await Promise.all([
    getMarketingPage("home"), getServices(), getCaseStudies(), getTestimonials(), getFaqs(),
  ]);
  if (!page) notFound();
  const originalHero = page.sections.find((section) => section._type === "hero");

  return (
    <div className={styles.page}>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": absoluteUrl("/"),
            name: "Integrated Solutions Technology",
            url: absoluteUrl("/"),
            description:
              "Solar energy, battery storage, data centre infrastructure, networking, security and IT technical support across Nigeria.",
            about: [
              "Solar Energy",
              "Battery Storage",
              "Data Centre Deployment",
              "Smart Hands Services",
              "Structured Copper and Fibre Cabling",
              "Server and Storage Deployment",
              "Data Centre Security",
              "Infrastructure Audits",
            ],
            provider: {
              "@id": `${absoluteUrl("/")}#organization`,
            },
          },
        ]}
      />
      <IntegratedSolutionsHome />
      {originalHero?.metrics.length ? <HeroMetricStrip metrics={originalHero.metrics} /> : null}
      <PartnerLogoMarquee />
      <SectionRenderer
        homeOperationTeams
        homeProjectJourney
        homeValueWeDeliver
        sections={page.sections
          .filter((section) => section._type !== "hero")
          .map((section) => {
            switch (section._type) {
              case "serviceShowcase": return homeServicePillars;
              case "ctaBand": return homeProjectCta;
              case "trustBanner": return { ...section, ...homeTrustCopy };
              default: return section;
            }
          })}
        services={services}
        caseStudies={caseStudies}
        testimonials={testimonials}
        faqs={faqs}
      />
      <FooterVideoCta />
    </div>
  );
}
