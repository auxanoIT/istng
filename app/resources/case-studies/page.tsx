import Image from "@/components/ui/site-image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { CaseStudyCard } from "@/components/sections/case-study-card";
import { CaseStudyCollection } from "@/components/sections/case-study-collection";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { JsonLd } from "@/components/ui/json-ld";
import { additionalInstallationRecords, installationPortfolio } from "@/data/integrated-case-studies";
import { getCaseStudies } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";
import styles from "./projects.module.css";

const path = "/resources/case-studies";
const description = "Explore solar, inverter and battery installation case studies for homes, businesses and healthcare facilities in Lagos, Abuja, Kogi and Kaduna.";
export const metadata = buildMetadata({
  title: "Solar & Backup Power Case Studies Nigeria | Integrated Solutions Technology",
  description, path,
  imagePath: installationPortfolio[0].src, imageAlt: installationPortfolio[0].alt,
  keywords: ["solar installation case studies Nigeria", "solar projects Lagos", "residential solar installation projects", "commercial solar case studies", "hospital inverter battery backup Nigeria"],
});
export const revalidate = 60;

export default async function CaseStudiesPage() {
  const projects = await getCaseStudies();
  const featured = projects.find(project => project.featured) ?? projects[0];
  return <>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: "Solar and backup power case studies in Nigeria", description, url: absoluteUrl(path), mainEntity: { "@type": "ItemList", itemListElement: projects.map((project, index) => ({ "@type": "ListItem", position: index + 1, name: project.title, url: absoluteUrl(path + "/" + project.slug) })) } }} />
    <section className={styles.hero} aria-labelledby="projects-title">
      <Container className={styles.heroGrid}>
        <div>
          <h1 id="projects-title">Real Projects.<br />Powering Everyday Possibilities.</h1>
          <p>See how solar energy, inverters and battery storage come together for homes, businesses and essential services across Nigeria.</p>
          <ButtonLink href="#project-library" className="mt-7 rounded-md">Explore our projects <ArrowDown size={17} className="ml-3" aria-hidden="true" /></ButtonLink>
          <div className={styles.heroTopics}><span>Residential</span><span>Commercial</span><span>Institutional</span></div>
        </div>
        <figure className={styles.heroPhoto}>
          <Image src={installationPortfolio[0].src} alt={installationPortfolio[0].alt} width={960} height={1280} preload sizes="(min-width: 1024px) 44vw, 100vw" quality={85} className={styles.heroImage} />
        </figure>
      </Container>
    </section>
    {featured && <section className="bg-brand-soft-white py-14 sm:py-20" aria-labelledby="featured-project-title">
      <Container>
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div><h2 id="featured-project-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">{featured.slug === "ernneka-shop-office-solar-installation-lagos" ? "One business. Two different power needs." : "A closer look at the project."}</h2><p className="mt-3 max-w-2xl text-brand-support">Explore the requirement, the equipment selected and the scope delivered.</p></div>
          <a href="#project-library" className="inline-flex min-h-11 items-center gap-2 font-semibold underline underline-offset-4">View all projects <ArrowUpRight size={18} aria-hidden="true" /></a>
        </div>
        <CaseStudyCard caseStudy={featured} featured headingAs="h3" />
      </Container>
    </section>}
    <section id="project-library" className="scroll-mt-24 py-14 sm:py-20" aria-labelledby="project-library-title">
      <Container>
        <div className="mb-8 max-w-3xl"><h2 id="project-library-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">Find a project that feels like yours.</h2><p className="mt-4 text-brand-support">Explore each requirement, the equipment installed and the scope delivered. Every environment starts with a different need.</p></div>
        <CaseStudyCollection projects={projects.map(({ slug, title, client, clientDisplayName, industry, category, location, projectPeriod, summary, image, cardImage, textOnly, imageIsIllustrative }) => ({ slug, title, client, clientDisplayName, industry, category, location, projectPeriod, summary, image, cardImage, textOnly, imageIsIllustrative }))} />
      </Container>
    </section>
    <section className="bg-brand-navy py-14 text-white sm:py-20" aria-labelledby="installation-portfolio-title">
      <Container>
        <div className="mb-8 grid items-end gap-4 lg:grid-cols-2"><h2 id="installation-portfolio-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">A closer look at the work.</h2><p className="max-w-xl text-sm leading-7 text-slate-200">Solar panels, inverter installations and battery systems.</p></div>
        <div className={styles.portfolio}>
          {installationPortfolio.map((image, index) => <figure key={image.src} className={styles.portfolioPhoto}>
            <div><Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" quality={82} className="object-cover" /></div>
            <figcaption><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{image.alt}</figcaption>
          </figure>)}
        </div>
      </Container>
    </section>
    <section className="bg-brand-soft-white py-14 sm:py-20" aria-labelledby="more-installations-title">
      <Container>
        <h2 id="more-installations-title" className="text-2xl font-semibold sm:text-3xl">More from our installation record.</h2>
        <p className="mt-3 max-w-2xl text-brand-support">Further inverter installations from the supplied project register.</p>
        <div className="mt-7 grid gap-5 md:grid-cols-2">{additionalInstallationRecords.map(record => <article key={record.title} className="rounded-lg border border-brand-border bg-white p-6"><p className="text-sm text-brand-support">{record.period}</p><h3 className="mt-2 text-xl font-semibold">{record.title}</h3><p className="mt-3 font-medium">{record.equipment}</p><p className="mt-2 text-sm leading-6 text-brand-support">{record.note}</p></article>)}</div>
      </Container>
    </section>
    <section className="py-14 sm:py-20" aria-labelledby="projects-enquiry-title"><Container className="grid items-center gap-7 lg:grid-cols-[1fr_auto]"><div><h2 id="projects-enquiry-title" className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">Your requirements. The right next step.</h2><p className="mt-4 max-w-2xl text-brand-support">Tell us what you need to power. We’ll help you explore a system suited to your home, business or facility.</p></div><ButtonLink href="/book-consultation" className="justify-self-start rounded-md">Discuss your project <ArrowUpRight size={18} className="ml-3" aria-hidden="true" /></ButtonLink></Container></section>
  </>;
}
