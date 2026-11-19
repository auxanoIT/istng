import Link from "@/components/ui/site-link";
import { Container } from "@/components/ui/container";
import { solutionPillars } from "@/data/enterprise-solutions";
import { industryNavigation } from "@/data/industry-navigation";
import { resourceLinks } from "@/data/resource-catalog";
import { getCaseStudies } from "@/lib/content";
import { getResourceSitemap } from "@/lib/resources";
import { resourcePath } from "@/data/resource-sections";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Website Directory", description: "Find Integrated Solutions Technology solar, IT infrastructure, networking, security, industry and project pages.", path: "/site-map" });
export const revalidate = 60;
const linkClass = "inline-flex min-h-10 items-center text-sm leading-6 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange-text";

export default async function SiteMapPage() {
  const [projects, resources] = await Promise.all([getCaseStudies(), getResourceSitemap()]);
  return <section className="bg-brand-soft-white py-14 text-brand-navy sm:py-20"><Container>
    <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Find your way around.</h1>
    <p className="mt-4 max-w-2xl text-brand-support">Explore our energy and technology services, industries and project resources.</p>
    <nav aria-label="Website directory" className="mt-10 space-y-10">
      <section><h2 className="text-2xl font-semibold">Get to know us</h2><ul className="mt-4 flex flex-wrap gap-x-7">{[["/","Home"],["/about","About us"],["/solutions","All solutions"],["/industries","Industries"],["/book-consultation","Book a consultation"],["/careers","Careers"]].map(([href,title]) => <li key={href}><Link href={href} className={linkClass}>{title}</Link></li>)}</ul></section>
      <section><h2 className="text-2xl font-semibold">Our solutions</h2><div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{solutionPillars.map(pillar => <section key={pillar.slug} className="rounded-lg border border-brand-border bg-white p-5"><h3 className="text-lg font-semibold"><Link href={pillar.href} className="underline-offset-4 hover:underline">{pillar.label}</Link></h3><ul className="mt-3">{pillar.items.map(item => <li key={item.href}><Link href={item.href} className={linkClass}>{item.title}</Link></li>)}</ul></section>)}</div></section>
      <section><h2 className="text-2xl font-semibold">Industries we serve</h2><div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{industryNavigation.map(group => <section key={group.id}><h3 className="font-semibold">{group.label}</h3><ul className="mt-3">{group.entries.map(([slug,title]) => <li key={slug}><Link href={`/industries/${slug}`} className={linkClass}>{title}</Link></li>)}</ul></section>)}</div></section>
      <section><h2 className="text-2xl font-semibold">Resources</h2><ul className="mt-4 grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3">{resourceLinks.map(resource => <li key={resource.href}><Link href={resource.href} className={linkClass}>{resource.label}</Link></li>)}</ul>{!!resources.length && <ul className="mt-4 grid gap-x-6 sm:grid-cols-2">{resources.map(resource => <li key={resource.section + resource.slug}><Link href={resourcePath(resource.section,resource.slug)} className={linkClass}>{resource.title}</Link></li>)}</ul>}</section>
      <section><h2 className="text-2xl font-semibold">Case studies</h2><ul className="mt-4 grid gap-x-6 sm:grid-cols-2">{projects.map(project => <li key={project.slug}><Link href={`/resources/case-studies/${project.slug}`} className={linkClass}>{project.title}</Link></li>)}</ul></section>
    </nav>
  </Container></section>;
}
