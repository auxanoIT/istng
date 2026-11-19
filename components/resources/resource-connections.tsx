import Link from "@/components/ui/site-link";
import Image from "@/components/ui/site-image";
import { ArrowUpRight, FileText } from "lucide-react";
import { resourceIndustryOptions, resourceServiceOptions } from "@/data/resource-relationships";
import { resourcePath, resourceSections } from "@/data/resource-sections";
import type { BlogPost } from "@/lib/types";
import { getRelatedResourceCards } from "@/lib/resources";
import { Container } from "@/components/ui/container";
import { canonicalServicePath } from "@/lib/service-routes";
import { getRelatedSubserviceCards } from "@/data/related-subservices";
import { getIndustryRelatedServiceCards } from "@/data/industry-related-services";

export function ResourceConnections({ resource, legacyService }: {
  resource: Pick<BlogPost, "relatedIndustries" | "relatedServices" | "relatedReading">;
  legacyService?: { href: string; title: string };
}) {
  const reading = (resource.relatedReading ?? []).filter(item => item?.slug && item.title && Object.hasOwn(resourceSections, item.section));
  const industries = resourceIndustryOptions.filter(item => resource.relatedIndustries?.includes(item.value))
    .map(({ title, value }) => ({ title, href: `/industries/${value}` }));
  const services = resourceServiceOptions.filter(item => resource.relatedServices?.some(value => canonicalServicePath(value) === item.value))
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
  const cards = industry ? [] : await getRelatedResourceCards({ service });
  const relatedServices = industry ? getIndustryRelatedServiceCards(industry) : service ? getRelatedSubserviceCards(service) : [];
  const items = [
    ...relatedServices.map(card => ({ ...card, category: "Related service", action: "Explore service" })),
    ...cards.slice(0, relatedServices.length ? 3 : 6).map(card => {
      const words = (card.excerpt || "Practical guidance to help you plan your next project.").trim().split(/\s+/);
      return { title: card.title, href: resourcePath(card.section, card.slug), description: words.length > 20 ? words.slice(0, 20).join(" ") + "…" : words.join(" "), image: card.image?.src ? card.image : undefined, category: resourceSections[card.section].title, action: "View resource" };
    }),
  ];
  if (!items.length) return null;
  return <section className="border-y border-brand-border bg-brand-surface py-14 sm:py-20">
    <Container>
      <h2 className={`text-3xl font-semibold tracking-tight text-brand-navy sm:text-4xl ${industry ? "text-center" : ""}`}>Related Resources</h2>
      <p className={`mt-3 max-w-2xl leading-7 text-brand-support ${industry ? "mx-auto text-center" : ""}`}>{industry ? "Explore services matched to your industry's energy and technology needs." : "Explore complementary services and practical guidance for your project."}</p>
      <ul data-related-resources className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map(card => <li key={card.href}>
        <Link href={card.href} className="group flex h-full flex-col overflow-hidden rounded-xl border border-brand-border bg-white transition-colors hover:border-brand-orange focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-navy">
          <div className="relative aspect-video overflow-hidden bg-brand-navy">
            {card.image ? <Image src={card.image.src} alt={card.image.alt} fill sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" className="object-cover" style={{ objectPosition: card.image.objectPosition }} /> : <div className="flex h-full items-center justify-center text-white/80"><FileText size={40} strokeWidth={1.25} aria-hidden /></div>}
          </div>
          <div className="flex flex-1 flex-col p-5 sm:p-6">
          <p className="text-xs font-semibold tracking-wide text-[var(--brand-orange-text)]">{card.category}</p>
          <h3 className="mt-2 text-xl leading-snug font-semibold text-brand-navy">{card.title}</h3>
          <p className="mt-3 flex-1 text-sm leading-6 text-brand-support">{card.description}</p>
          <span className="mt-5 inline-flex items-center justify-between gap-3 border-t border-brand-border pt-4 text-sm font-semibold text-brand-navy">{card.action}<ArrowUpRight className="size-4 shrink-0 group-hover:text-[var(--brand-orange-text)]" aria-hidden /></span>
          </div>
        </Link>
      </li>)}</ul>
    </Container>
  </section>;
}
