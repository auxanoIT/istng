import Link from "@/components/ui/site-link";
import { Download, FileText } from "lucide-react";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { planningSections, resourcePath, type PlanningSection } from "@/data/resource-sections";
import { getPlanningIndex, getPlanningResource, pdfDownloadHref, type PlanningResource } from "@/lib/resources";
import { buildMetadata } from "@/lib/seo";
import { ResourceConnections } from "./resource-connections";
import { ResourceIntro, ResourceEmpty } from "./resource-intro";

export async function PlanningIndex({ section }: { section: PlanningSection }) {
  const items = await getPlanningIndex(section);
  const Icon = FileText;
  return <>
    <ResourceIntro {...planningSections[section]} />
    <section className="bg-brand-surface py-12 sm:py-20"><Container>
      {items.length ? <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{items.map(item => <li key={item.slug} className="flex flex-col gap-4 rounded-xl border border-brand-border bg-white p-6">
        <Icon className="size-7 text-[var(--brand-orange-text)]" aria-hidden />
        <h2 className="text-xl font-semibold text-brand-navy"><Link href={resourcePath(section, item.slug)} className="hover:underline">{item.title}</Link></h2>
        <p className="flex-1 leading-7 text-brand-support">{item.excerpt}</p>
        <DownloadLink resource={item} />
      </li>)}</ul> : <ResourceEmpty message={"Published PDFs and checklists will appear here."} />}
    </Container></section>
  </>;
}

export async function getPlanningMetadata(section: PlanningSection, slug: string) {
  const resource = await getPlanningResource(section, slug);
  return buildMetadata({
    title: resource?.seo?.metaTitle || resource?.title || "Resource not found",
    description: resource?.seo?.metaDescription || resource?.excerpt || planningSections[section].description,
    path: resourcePath(section, slug),
    noIndex: !resource,
  });
}

export async function PlanningDetail({ section, slug }: { section: PlanningSection; slug: string }) {
  const resource = await getPlanningResource(section, slug);
  if (!resource) notFound();
  const config = planningSections[section];
  return <>
    <ResourceIntro title={config.title} heading={resource.title} description={resource.excerpt} />
    <section className="bg-brand-surface py-12 sm:py-20"><Container>
      <div className="mx-auto max-w-6xl">
        <Link href={resourcePath(section)} className="mb-6 inline-block text-sm font-semibold text-brand-navy underline underline-offset-4">← All downloads</Link>
        {resource.instructions && <p className="mb-6 whitespace-pre-line leading-7 text-brand-support">{resource.instructions}</p>}
        <div className="rounded-xl border border-brand-border bg-white p-6 sm:p-8"><DownloadLink resource={resource} /></div>
        <ResourceConnections resource={resource} />
        <ButtonLink href="/book-consultation" className="mt-8">Book a Technical Consultation</ButtonLink>
      </div>
    </Container></section>
  </>;
}

function DownloadLink({ resource }: { resource: PlanningResource }) {
  const link = pdfDownloadHref(resource.file);
  if (!link) return null;
  const size = resource.file?.size;
  return <a href={link} download className="inline-flex min-h-11 w-fit items-center gap-2 font-semibold text-brand-navy underline decoration-brand-orange underline-offset-4" aria-label={`Download ${resource.title} PDF`}>
    <Download className="size-4" aria-hidden /> Download PDF
    {size ? <span className="text-xs font-medium text-brand-support">({Math.max(1, Math.round(size / 1024)).toLocaleString("en-NG")} KB)</span> : null}
  </a>;
}
