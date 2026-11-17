import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { resourceIndustryOptions, resourceServiceOptions } from "@/data/resource-relationships";
import { resourcePath, resourceSections } from "@/data/resource-sections";
import type { BlogPost } from "@/lib/types";
import { getRelatedResourceCards } from "@/lib/resources";
import { Container } from "@/components/ui/container";

export function ResourceConnections({ resource, legacyService }: {
  resource: Pick<BlogPost, "relatedIndustries" | "relatedServices" | "relatedReading">;
  legacyService?: { href: string; title: string };
}) {
  const reading = (resource.relatedReading ?? []).filter(item => item?.slug && item.title && Object.hasOwn(resourceSections, item.section));
  const industries = resourceIndustryOptions.filter(item => resource.relatedIndustries?.includes(item.value))
    .map(({ title, value }) => ({ title, href: `/industries/${value}` }));
  const services = resourceServiceOptions.filter(item => resource.relatedServices?.includes(item.value))
    .map(({ title, value }) => ({ title, href: value }));
  if (legacyService && !services.some(item => item.href === legacyService.href)) services.push(legacyService);
  const groups = [
    { title: "Keep reading", links: reading.map(item => ({ title: item.title, href: resourcePath(item.section, item.slug) })) },
    { title: "Relevant industries", links: industries },
    { title: "Related solutions", links: services },
  ].filter(group => group.links.length);
  if (!groups.length) return null;
  return <aside className="mt-12 grid gap-6 rounded-xl border border-brand-border bg-brand-surface p-5 sm:grid-cols-2 sm:p-7" aria-label="Related information">
    {groups.map(({ title, links }) => <div key={title}>
      <h2 className="text-sm font-semibold text-brand-navy">{title}</h2>
      <ul className="mt-2 space-y-2">{links.map(({ title, href }) => <li key={href}>
        <Link href={href} className="inline-flex items-start gap-2 text-sm leading-6 text-brand-support underline decoration-brand-orange underline-offset-4 hover:text-brand-navy">
          {title}<ArrowUpRight className="mt-1 size-3.5 shrink-0" aria-hidden />
        </Link>
      </li>)}</ul>
    </div>)}
  </aside>;
}

export async function ContextualResources({ industry, service }: { industry?: string; service?: string }) {
  const cards = await getRelatedResourceCards({ industry, service });
  if (!cards.length) return null;
  return <section className="border-y border-brand-border bg-brand-surface py-14 sm:py-20">
    <Container>
      <h2 className="text-3xl font-semibold tracking-tight text-brand-navy sm:text-4xl">Related Resources</h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{cards.map(card => <li key={`${card.section}/${card.slug}`}>
        <Link href={resourcePath(card.section, card.slug)} className="group flex h-full items-start justify-between gap-3 rounded-lg border border-brand-border bg-white p-5 hover:border-brand-orange">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-orange-text)]">{resourceSections[card.section].title}</p>
            <h3 className="mt-2 text-lg font-semibold text-brand-navy">{card.title}</h3>
            {card.excerpt && <p className="mt-2 line-clamp-3 text-sm leading-6 text-brand-support">{card.excerpt}</p>}
          </div>
          <ArrowUpRight className="size-4 shrink-0 text-brand-navy group-hover:text-[var(--brand-orange-text)]" aria-hidden />
        </Link>
      </li>)}</ul>
    </Container>
  </section>;
}
