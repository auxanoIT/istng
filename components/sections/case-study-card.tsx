import Image from "@/components/ui/site-image";
import { ArrowUpRight, BriefcaseBusiness, MapPin } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { getCaseStudyMedia } from "@/lib/case-study-media";
import type { CaseStudy } from "@/lib/types";

type CaseStudyCardProps = {
  caseStudy: CaseStudy;
  featured?: boolean;
  headingAs?: "h2" | "h3";
};

export function CaseStudyCard({
  caseStudy,
  featured = false,
  headingAs: Heading = "h2",
}: CaseStudyCardProps) {
  const media = getCaseStudyMedia(caseStudy);

  return (
    <article className={`group flex h-full flex-col overflow-hidden rounded-xl border border-brand-border bg-white transition-shadow duration-300 hover:shadow-lg ${featured && !caseStudy.textOnly ? "lg:grid lg:grid-cols-2" : ""}`}>
      {!caseStudy.textOnly && <div className={`relative aspect-[16/10] overflow-hidden bg-[var(--color-cloud)] ${featured ? "lg:aspect-auto lg:min-h-[340px]" : ""}`}>
        <Image
          src={media.src}
          alt={media.alt}
          fill
          quality={82}
          sizes={
            featured
              ? "(min-width: 1280px) 42vw, 100vw"
              : "(min-width: 1280px) 30vw, (min-width: 768px) 50vw, 100vw"
          }
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>}
      <div className="flex flex-1 flex-col border-t-4 border-[var(--brand-orange)] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#906300]">
          {caseStudy.clientDisplayName ||
            caseStudy.client ||
            caseStudy.industry ||
            "Infrastructure project"}
        </p>
        <Heading className="mt-3 text-2xl font-semibold leading-tight text-[var(--color-ink)]">
          {caseStudy.title}
        </Heading>
        <p className="mb-6 mt-4 text-sm leading-7 text-[var(--color-muted)]">
          {caseStudy.summary}
        </p>
        <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
          <span className="inline-flex items-center gap-2">
            <BriefcaseBusiness className="h-3.5 w-3.5 shrink-0 text-[var(--color-electric)]" />
            {caseStudy.industry || "Case Study"}
          </span>
          {caseStudy.location ? (
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[var(--color-electric)]" />
              {caseStudy.location}
            </span>
          ) : null}
        </div>
        {caseStudy.projectPeriod && <p className="mb-5 text-xs text-brand-support">{caseStudy.projectPeriod}</p>}
        <ButtonLink
          href={`/resources/case-studies/${caseStudy.slug}`}
          variant="secondary"
          className="mt-auto self-start"
        >
          View Case Study
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </ButtonLink>
      </div>
    </article>
  );
}
