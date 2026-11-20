import Image from "@/components/ui/site-image";

import { ConsultationForm } from "@/components/forms/consultation-form";
import { PartnerLogoMarquee } from "@/components/sections/partner-logo-marquee";
import { JsonLd } from "@/components/ui/json-ld";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";
import styles from "./appointment.module.css";
import { productionServices } from "@/data/subservice-production";
import { solarConsultationService } from "@/data/solar-overview";
import { solarPriorities } from "@/data/solar-priorities";
import { operationTeams } from "@/data/operation-teams";
import { getEnterpriseOverview } from "@/data/enterprise-overview";
import { solutionPillars } from "@/data/enterprise-solutions";

const path = "/book-consultation";
const title = "Book a Solar & IT Consultation in Nigeria";
const description = "Request a consultation in Nigeria for solar power, IT infrastructure, data centres, networking, security or technical support.";
const planningPhoto = {
  src: "/image/value-we-deliver/planning.webp",
  alt: "A project team reviewing engineering plans together in Lagos",
};

export const metadata = buildMetadata({
  title,
  description,
  path,
  imagePath: planningPhoto.src,
  imageAlt: planningPhoto.alt,
});

export default async function BookConsultationPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const serviceName = typeof query.service === "string" ? query.service : undefined;
  const sectionName = typeof query.section === "string" ? query.section : undefined;
  const service = productionServices.find(page => page.hero.title === serviceName);
  const section = service?.sections.find(item => item.navLabel === sectionName);
  const environment = operationTeams.find(
    (stop) => stop.enquiryEnvironment && stop.enquiryEnvironment === query.environment,
  );
  const solarEnquiry = serviceName === solarConsultationService;
  const solarSubservice = solutionPillars.find(({ slug }) => slug === "solar-energy")
    ?.items.find(({ slug }) => slug === query.solarService);
  const infrastructureSubservice = solutionPillars
    .filter(({ slug }) => slug !== "solar-energy")
    .flatMap(({ items }) => items)
    .find(({ slug }) => slug === query.infrastructureService);
  const pillar = solutionPillars.find(({ label }) => label === serviceName);
  const overview = pillar && getEnterpriseOverview(pillar.href);
  const priorityIds = Array.isArray(query.priority) ? query.priority : [query.priority];
  const priorities = solarEnquiry ? solarPriorities : overview?.priorities ?? [];
  const selectedPriorities = priorities.filter(({ id }) => priorityIds.includes(id));
  const initialProjectBrief = selectedPriorities.length
    ? `${solarEnquiry ? "Solar priorities" : "Project priorities"}:\n${selectedPriorities.map(({ label }) => `- ${label}`).join("\n")}\n\nProject details:\n`
    : undefined;
  const initialService = service?.hero.title ?? solarSubservice?.title ?? infrastructureSubservice?.title ?? (environment ? `Energy Solutions for ${environment.label}` : solarEnquiry ? solarConsultationService : overview?.pillar.label);
  return (
    <div className={styles.page}>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: title,
            url: absoluteUrl(path),
            description,
            image: absoluteUrl(planningPhoto.src),
            about: [
              "Solar energy consultation",
              "IT infrastructure consultation",
              "Data centre infrastructure consultation",
              "Smart Hands consultation",
              "Network infrastructure consultation",
              "Security systems consultation",
            ],
            provider: {
              "@type": "Organization",
              "@id": `${absoluteUrl("/")}#organization`,
              name: "Integrated Solutions Technology",
            },
            potentialAction: {
              "@type": "CommunicateAction",
              target: absoluteUrl(path),
              name: "Request a technical consultation",
            },
          },
        ]}
      />
      <section className={styles.layout} aria-labelledby="consultation-title">
        <div className={styles.intro}>
          <h1 id="consultation-title">Let’s plan your project.</h1>
          <p>Talk to our team about your solar, IT infrastructure or technical support needs.</p>
        </div>
        <div id="project-enquiry" className={styles.formArea}>
          <ConsultationForm
            key={String(initialService)+':'+String(section?.navLabel)+':'+String(initialProjectBrief)}
            attributeContactRedirect
            initialService={initialService}
            initialSection={section?.navLabel}
            initialProjectBrief={initialProjectBrief}
            title="Request a consultation"
            description="Share a few details so we can help you plan the next step."
          />
        </div>
        <div className={styles.trust}>
          <h2>Trusted by 134 Clients.</h2>
          <p>Energy and technology solutions tailored to your business.</p>
        </div>
        <div className={styles.photo}>
          <Image src={planningPhoto.src} alt={planningPhoto.alt} fill sizes="(min-width: 1024px) 44vw, 100vw" className={styles.photoImage} />
        </div>
      </section>

      <PartnerLogoMarquee />
    </div>
  );
}
