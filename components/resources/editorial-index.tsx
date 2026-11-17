import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpenText } from "lucide-react";
import { editorialSections, knowledgeKinds, resourcePath, type EditorialSection } from "@/data/resource-sections";
import { getEditorialIndex, type EditorialCard } from "@/lib/resources";
import { Container } from "@/components/ui/container";
import { ResourceIntro, ResourceEmpty } from "./resource-intro";

export async function EditorialIndex({ section }: { section: EditorialSection }) {
  const posts = await getEditorialIndex(section);
  const config = editorialSections[section];
  const featured = section === "insights" ? posts[0] : undefined;
  const items = featured ? posts.slice(1) : posts;
  const groups = section === "knowledge-centre"
    ? Object.keys(knowledgeKinds).map(kind => ({ label: kind === "faq" ? "Frequently asked questions" : kind === "glossary" ? "Glossary" : "Explainers", posts: items.filter(post => (post.entryKind ?? "faq") === kind) }))
    : [{ label: section === "guides" ? "Browse guides" : "More articles", posts: items }];
  return <>
    <ResourceIntro {...config} />
    <section className="bg-brand-surface py-12 sm:py-20"><Container>
      {featured && <EditorialCardView section={section} post={featured} featured />}
      {groups.filter(group => group.posts.length > 0).map(group => <div key={group.label} className={featured ? "mt-14" : "mb-12 last:mb-0"}>
        <h2 className="mb-6 text-3xl font-semibold tracking-tight text-brand-navy">{group.label}</h2>
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{group.posts.map(post => <li key={post.slug}><EditorialCardView section={section} post={post} /></li>)}</ul>
      </div>)}
      {!posts.length && <ResourceEmpty message={section === "knowledge-centre" ? "Published answers and definitions will appear here." : section === "guides" ? "Published technical guides will appear here." : "Published articles will appear here."} />}
    </Container></section>
  </>;
}

function EditorialCardView({ post, section, featured }: { post: EditorialCard; section: EditorialSection; featured?: boolean }) {
  const label = section === "knowledge-centre" && post.entryKind ? knowledgeKinds[post.entryKind] : post.category;
  const Heading = featured ? "h2" : "h3";
  return <Link href={resourcePath(section, post.slug)} className={`group block h-full overflow-hidden rounded-xl border border-brand-border bg-white transition hover:border-brand-orange ${featured ? "lg:grid lg:grid-cols-[1.15fr_1fr]" : ""}`}>
    {(post.coverImage?.src || featured) && <div className={`relative flex items-center justify-center bg-brand-navy text-white ${featured ? "min-h-52" : "aspect-[16/9]"}`}>
      {post.coverImage?.src
        ? <Image src={post.coverImage.src} alt={post.coverImage.alt || ""} fill sizes={featured ? "(min-width: 1024px) 55vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"} className="object-cover" />
        : <BookOpenText className="size-12 text-brand-orange" aria-hidden />}
    </div>}
    <div className={featured ? "p-6 sm:p-10" : "p-6"}>
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--brand-orange-text)]">{featured ? `Featured · ${label}` : label}</p>
      <Heading className={`mt-3 font-semibold tracking-tight text-brand-navy ${featured ? "text-3xl sm:text-4xl" : "text-xl"}`}>{post.title}</Heading>
      {post.excerpt && <p className="mt-3 line-clamp-3 leading-7 text-brand-support">{post.excerpt}</p>}
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-navy">{section === "insights" ? "Read article" : section === "guides" ? "Read guide" : "Read entry"}<ArrowUpRight className="size-4 group-hover:text-[var(--brand-orange-text)]" aria-hidden /></span>
    </div>
  </Link>;
}
