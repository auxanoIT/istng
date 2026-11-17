import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { OverviewParagraphs } from "@/components/pages/overview-layout";
import type { ServiceNavMedia } from "@/lib/types";
import { cn } from "@/lib/utils";

export type SolutionCard = {
  title: string;
  href: string;
  image: ServiceNavMedia;
  paragraphs: string[];
  tagline?: string;
  cta?: string;
};

export function SolutionCardGrid({ cards, headingAs: Heading = "h2", variant = "standard" }: {
  cards: SolutionCard[];
  headingAs?: "h2" | "h3";
  variant?: "standard" | "project";
}) {
  const project = variant === "project";
  return (
    <ul className={project ? "mt-8 grid gap-6 sm:grid-cols-2" : "mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3"}>
      {cards.map(({ title, href, image, paragraphs, tagline, cta }) => (
        <li key={href}>
          <Link href={href} className={cn("group flex h-full flex-col overflow-hidden rounded-lg border border-brand-border bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange-text", project && "rounded-xl shadow-sm transition-shadow duration-300 hover:shadow-lg motion-reduce:transition-none")}>
            <div className={project ? "relative aspect-[16/10] overflow-hidden" : "relative aspect-video"}>
              <Image src={image.src} alt={image.alt} fill sizes={project ? "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"} quality={project ? 82 : 75} className={cn("object-cover", project && "transition-transform duration-500 group-hover:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none")} />
            </div>
            <div className={cn("flex flex-1 flex-col p-5", project && "sm:p-6")}>
              <Heading className={cn("flex items-start justify-between gap-3 text-lg font-semibold group-hover:underline", project && "text-xl leading-snug tracking-tight decoration-1 underline-offset-4")}>
                {title}
                {!cta && !project && <ArrowRight size={18} className="mt-1 shrink-0" aria-hidden="true" />}
              </Heading>
              {tagline && <p className="mt-3 font-medium">{tagline}</p>}
              <OverviewParagraphs paragraphs={paragraphs} className="mt-2 text-sm text-brand-support sm:text-sm" />
              {project ? <div className="mt-auto pt-5"><span className="flex items-center justify-between gap-3 border-t border-brand-border pt-4 text-sm font-semibold"><span>{cta ?? "Explore solution"}</span><span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-orange text-brand-navy transition-colors group-hover:bg-brand-orange-hover"><ArrowRight size={18} aria-hidden="true" /></span></span></div> : cta && <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold group-hover:underline">{cta}<ArrowRight size={17} aria-hidden="true" className="shrink-0" /></span>}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
