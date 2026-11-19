import Link from "@/components/ui/site-link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { industryNavigation } from "@/data/industry-navigation";
import { getIndustries } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata = buildMetadata({ title: "Solar & Technology Solutions by Industry in Nigeria", description: "Explore energy and technology solutions for homes, businesses, healthcare, education, industrial facilities and enterprise infrastructure in Nigeria.", path: "/industries" });
export default async function IndustriesPage() {
  const industries = await getIndustries();
  return <>
    <section className="bg-brand-navy py-16 text-white sm:py-24"><Container><h1 className="max-w-4xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl">Different environments.<br />The right solutions.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">Energy and technology planned around how your home, business or institution operates.</p><ButtonLink href="/book-consultation" className="mt-7 rounded-md">Discuss your requirements</ButtonLink></Container></section>
    <section className="bg-brand-soft-white py-14 sm:py-20"><Container className="space-y-12">{industryNavigation.map(group => <section key={group.id} aria-labelledby={group.id}><h2 id={group.id} className="mb-6 text-2xl font-semibold sm:text-3xl">{group.label}</h2><ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{group.entries.map(([slug,title]) => { const industry = industries.find(item => item.slug === slug); return <li key={slug}><Link href={`/industries/${slug}`} className="group flex h-full flex-col rounded-lg border border-brand-border bg-white p-6 transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange-text"><h3 className="text-xl font-semibold">{title}</h3>{industry?.shortDescription && <p className="mt-3 text-sm leading-7 text-brand-support">{industry.shortDescription}</p>}<ArrowUpRight size={20} className="mt-auto self-end pt-0.5 text-brand-orange-text" aria-hidden="true" /></Link></li>; })}</ul></section>)}</Container></section>
  </>;
}
