import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ResourceProjectCard, resourceIcons } from "@/components/resources/resource-menu-content";
import { Container } from "@/components/ui/container";
import { resourceGroups } from "@/data/resource-catalog";
import { buildMetadata } from "@/lib/seo";

const description = "Find articles, technical guides, project case studies, planning tools and downloadable checklists for energy and technology projects in Nigeria.";

export const metadata = buildMetadata({ title: "Energy & Technology Resources", description, path: "/resources" });

export default function ResourcesPage() {
  return <>
    <header className="bg-brand-navy py-16 text-white sm:py-24">
      <Container>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange">Resources</p>
        <h1 className="mt-4 max-w-4xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl">From the first question to your next project.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">{description}</p>
      </Container>
    </header>
    <section className="bg-brand-surface py-12 sm:py-20"><Container>
      <div className="grid gap-5 md:grid-cols-2">
        {resourceGroups.map(group => <section key={group.id} id={group.id} className="scroll-mt-28 rounded-xl border border-brand-border bg-white p-5 sm:p-7">
          <h2 className="text-2xl font-semibold tracking-tight text-brand-navy">{group.label}</h2>
          <ul className="mt-4 divide-y divide-brand-border">{group.links.map(link => {
            const Icon = resourceIcons[link.id as keyof typeof resourceIcons];
            return <li key={link.id}><Link href={link.href} className="group flex min-h-14 items-center gap-3 text-brand-navy hover:text-[var(--brand-orange-text)]">
              {Icon && <Icon className="size-5 shrink-0 text-[var(--brand-orange-text)]" aria-hidden />}{link.label}
              <ArrowRight className="ml-auto size-4 shrink-0 transition group-hover:translate-x-1" aria-hidden />
            </Link></li>;
          })}</ul>
        </section>)}
        <ResourceProjectCard />
      </div>
    </Container></section>
  </>;
}
