import Link from "@/components/ui/site-link";
import { ArrowUpRight, HardDrive, Headset, Network, Server, ShieldCheck, Sun } from "lucide-react";
import { articlesForTopic, insightTopicPath, insightTopics } from "@/data/insight-topics";
import type { EditorialCard } from "@/lib/resources";

const icons = [Sun, Server, Network, HardDrive, ShieldCheck, Headset];

export function InsightTopicNavigation({ posts }: { posts: EditorialCard[] }) {
  return <section aria-labelledby="insight-topics-title" className="mb-12" data-insight-topics>
    <h2 id="insight-topics-title" className="text-center text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl">Explore by service</h2>
    <p className="mx-auto mt-3 max-w-2xl text-center leading-7 text-brand-support">Find articles and practical guidance for the systems you want to understand.</p>
    <ul className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {insightTopics.map((topic, index) => {
        const Icon = icons[index];
        const count = articlesForTopic(posts, topic.slug).length;
        return <li key={topic.slug}><Link href={insightTopicPath(topic.slug)} className="group flex h-full flex-col rounded border border-brand-border bg-white p-5 transition-colors hover:border-brand-orange focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-navy">
          <Icon size={30} strokeWidth={1.5} className="text-brand-navy" aria-hidden="true" />
          <h3 className="mt-4 text-lg font-semibold leading-snug text-brand-navy">{topic.title}</h3>
          <p className="mt-3 flex-1 text-sm leading-6 text-brand-support">{topic.description}</p>
          <span className="mt-5 inline-flex items-center justify-between gap-3 text-sm font-semibold text-brand-navy">{count ? `${count} ${count === 1 ? "article" : "articles"}` : "View topic"}<ArrowUpRight size={18} aria-hidden="true" /></span>
        </Link></li>;
      })}
    </ul>
  </section>;
}
