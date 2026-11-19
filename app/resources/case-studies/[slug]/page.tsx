import Image from "@/components/ui/site-image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { CaseStudyCard } from "@/components/sections/case-study-card";
import { SolutionCardGrid } from "@/components/sections/solution-card-grid";
import { getCaseStudyServiceCards } from "@/data/case-study-service-cards";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { JsonLd } from "@/components/ui/json-ld";
import { getCaseStudyMedia } from "@/lib/case-study-media";
import { getCaseStudies, getCaseStudyBySlug, getCaseStudySlugs } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";
import { findPillar } from "@/data/service-pillars";
import styles from "./case-study.module.css";

type PageProps = { params: Promise<{ slug: string }> };
export const revalidate = 60;
export async function generateStaticParams() { return (await getCaseStudySlugs()).map(slug => ({ slug })); }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getCaseStudyBySlug(slug);
  if (!project) return buildMetadata({ title: "Case study not found", description: "The requested case study could not be found.", path: "/resources/case-studies/" + slug, noIndex: true });
  const media = getCaseStudyMedia(project);
  return buildMetadata({
    title: project.seo?.metaTitle || project.title,
    description: project.seo?.metaDescription || project.summary,
    imagePath: project.textOnly ? "/opengraph-image" : media.src,
    imageAlt: media.alt,
    modifiedTime: project.updatedAt,
    path: "/resources/case-studies/" + project.slug, type: "article",
    keywords: [project.industry, project.location, ...(project.relatedServiceLinks?.map(service => service.title) ?? [])].filter((value): value is string => Boolean(value)),
  });
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const [project, allProjects] = await Promise.all([getCaseStudyBySlug(slug), getCaseStudies()]);
  if (!project) notFound();
  const media = getCaseStudyMedia(project);
  const url = absoluteUrl("/resources/case-studies/" + project.slug);
  const related = allProjects.filter(item => item.slug !== project.slug).sort((a, b) => Number(b.category === project.category) - Number(a.category === project.category)).slice(0, 2);
  const services = project.relatedServiceLinks ?? (project.relatedServices ?? []).flatMap(slug => {
    const pillar = findPillar(slug);
    return pillar ? [{ title: pillar.title, href: "/services/" + slug }] : [];
  });
  const chapters = [["project-overview","At a glance"],["project-challenge","The requirement"],["project-solution","The solution"],["project-result","The delivered scope"]];
  const serviceCards = getCaseStudyServiceCards(services);
  return <>
    <JsonLd data={[
      { "@context":"https://schema.org", "@type":"Article", "@id":url + "#article", headline:project.title, description:project.summary, url, mainEntityOfPage:url, about:{ "@type":"Thing", name:project.industry }, ...(project.textOnly ? {} : { image:[absoluteUrl(media.src)] }), ...(project.updatedAt ? { dateModified:project.updatedAt } : {}), contentLocation:project.location ? { "@type":"Place", name:project.location } : undefined, author:{ "@type":"Organization", "@id":absoluteUrl("/") + "#organization", name:"Integrated Solutions Technology" }, publisher:{ "@id":absoluteUrl("/") + "#organization" } },
      { "@context":"https://schema.org", "@type":"BreadcrumbList", itemListElement:[{ "@type":"ListItem", position:1, name:"Home", item:absoluteUrl("/") },{ "@type":"ListItem", position:2, name:"Case Studies", item:absoluteUrl("/resources/case-studies") },{ "@type":"ListItem", position:3, name:project.title, item:url }] },
    ]} />
    <section className={styles.hero} aria-labelledby="case-study-title">
      <Container>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}><Link href="/resources/case-studies">Case studies</Link><span aria-hidden="true">/</span><span>{project.clientDisplayName ?? project.client ?? project.industry}</span></nav>
        <div className={project.textOnly ? styles.textHero : styles.heroGrid}>
          <div><h1 id="case-study-title">{project.title}</h1><p className={styles.intro}>{project.summary}</p><ButtonLink href="/book-consultation" className="mt-7 rounded-md">Discuss a similar project <ArrowUpRight size={18} className="ml-3" aria-hidden="true" /></ButtonLink></div>
          {!project.textOnly && <figure className={styles.heroFigure}><div><Image src={media.src} alt={media.alt} fill preload quality={85} sizes="(min-width: 1024px) 44vw, 100vw" className="object-cover" /></div></figure>}
        </div>
      </Container>
    </section>
    <article className={styles.story}>
      <Container>
        <dl className={styles.facts}>{[["Client",project.clientDisplayName ?? project.client],["Environment",project.industry],["Location",project.location],["Project period",project.projectPeriod]].map(([label,value]) => value ? <div key={label}><dt>{label}</dt><dd>{value}</dd></div> : null)}</dl>
        <div className={styles.storyGrid}>
          <aside className={styles.sidebar}><nav aria-label="On this case study"><p>Inside the project</p>{chapters.map(([id,label]) => <a key={id} href={"#" + id}>{label}<ArrowRight size={15} aria-hidden="true" /></a>)}</nav></aside>
          <div className={styles.chapters}>
            <section id="project-overview" className={styles.chapter} aria-labelledby="project-overview-title">
              <h2 id="project-overview-title">The installation at a glance.</h2>
              {!!project.metrics?.length && <dl className={styles.metrics}>{project.metrics.map(metric => <div key={metric.label}><dd>{metric.value}</dd><dt>{metric.label}</dt>{metric.description && <dd className={styles.metricNote}>{metric.description}</dd>}</div>)}</dl>}
              {!!project.specifications?.length && <div className={styles.configurations}>{project.specifications.map(spec => <section key={spec.site} className={styles.configuration}><h3>{spec.site}</h3><dl>{[["Inverter",spec.inverter],["Battery",spec.battery],["Solar PV",spec.solar]].map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>)}</div>}
              {!project.specifications?.length && <p>{project.summary}</p>}
              {!!project.specifications?.some(spec => spec.solar.includes("kWp")) && <p className={styles.technicalNote}>PV nameplate capacity is calculated from panel quantity × rated wattage. It describes the installed panel rating, rather than measured daily generation.</p>}
            </section>
            {project.challenge && <section id="project-challenge" className={styles.chapter} aria-labelledby="project-challenge-title"><h2 id="project-challenge-title">The requirement.</h2>{project.challenge.split(/\n\s*\n/).map(paragraph => <p key={paragraph}>{paragraph}</p>)}</section>}
            <section id="project-solution" className={styles.chapter} aria-labelledby="project-solution-title"><h2 id="project-solution-title">How the solution came together.</h2>{project.solutionNarrative?.map(paragraph => <p key={paragraph}>{paragraph}</p>)}{!!project.solution?.length && <ul className={styles.scope}>{project.solution.map(item => <li key={item}>{item}</li>)}</ul>}</section>
            {(project.result || project.outcome) && <section id="project-result" className={styles.chapter} aria-labelledby="project-result-title"><h2 id="project-result-title">The delivered scope.</h2>{(project.result || project.outcome || "").split(/\n\s*\n/).map(paragraph => <p key={paragraph}>{paragraph}</p>)}</section>}
            {!!project.gallery?.length && <section className={styles.chapter} aria-labelledby="project-gallery-title"><h2 id="project-gallery-title">System details, up close.</h2><div className={styles.gallery}>{project.gallery.map(image => <figure key={image.src}><div><Image src={image.src} alt={image.alt} fill quality={82} sizes="(min-width: 1024px) 29vw, (min-width: 640px) 44vw, 100vw" className="object-cover" /></div><figcaption>{image.caption ?? image.alt}</figcaption></figure>)}</div></section>}
            {project.quote?.text && <figure className={styles.quote}><blockquote>{project.quote.text}</blockquote><figcaption>{[project.quote.author,project.quote.role].filter(Boolean).join(" · ")}</figcaption></figure>}
            {project.evidenceNote && <aside className={styles.technicalNote}><strong>Record detail</strong><p>{project.evidenceNote}</p></aside>}
            {!!serviceCards.length && <section id="project-services" className={styles.chapter} aria-labelledby="project-services-title"><h2 id="project-services-title">Explore the solutions behind the project.</h2><span className="block h-1 w-12 rounded-full bg-brand-orange" aria-hidden="true" /><SolutionCardGrid cards={serviceCards} headingAs="h3" variant="project" /></section>}
          </div>
        </div>
      </Container>
    </article>
    <section className={styles.enquiry} aria-labelledby="project-enquiry-title"><Container className="grid items-center gap-7 lg:grid-cols-[1fr_auto]"><div><h2 id="project-enquiry-title">A different project. The same care.</h2><p>Tell us about your site, the equipment you need to power and your priorities. We’ll help you plan the right next step.</p></div><ButtonLink href="/book-consultation" className="justify-self-start rounded-md">Let’s discuss your project <ArrowUpRight size={18} className="ml-3" aria-hidden="true" /></ButtonLink></Container></section>
    {!!related.length && <section className="bg-brand-soft-white py-14 sm:py-20" aria-labelledby="related-projects-title"><Container><div className="mb-8 flex flex-wrap items-center justify-between gap-4"><h2 id="related-projects-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">More projects to explore.</h2><Link href="/resources/case-studies" className="inline-flex min-h-11 items-center gap-2 font-semibold underline underline-offset-4">All case studies <ArrowRight size={17} aria-hidden="true" /></Link></div><div className="grid gap-6 md:grid-cols-2">{related.map(item => <CaseStudyCard key={item.slug} caseStudy={item} headingAs="h3" />)}</div></Container></section>}
  </>;
}
