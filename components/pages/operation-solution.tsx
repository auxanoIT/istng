import Image from "@/components/ui/site-image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import type { operationTeams } from "@/data/operation-teams";

export function OperationSolution({ solution, backHref = "/#built-around-your-operation", backLabel = "Back to Built Around Your Needs" }: {
  solution: (typeof operationTeams)[number];
  backHref?: string;
  backLabel?: string;
}) {
  const enquiryHref = solution.enquiryEnvironment
    ? `/book-consultation?environment=${solution.enquiryEnvironment}#project-enquiry`
    : "/book-consultation#project-enquiry";

  return (
    <section className="bg-brand-soft-white py-14 text-brand-navy md:py-20" aria-labelledby="solution-title">
      <Container>
        <Link
          href={backHref}
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-navy hover:underline"
        >
          <ArrowLeft size={17} aria-hidden="true" /> {backLabel}
        </Link>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="mb-3 font-semibold">{solution.label}</p>
            <h1 id="solution-title" className="text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl lg:text-5xl">
              {solution.headline}
            </h1>
            {solution.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-4 max-w-prose leading-relaxed text-brand-support">{paragraph}</p>
            ))}
            <h2 className="mt-6 text-lg font-semibold">Key Benefits</h2>
            <ul className="mt-3 grid gap-2" role="list">
              {solution.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2">
                  <Check size={17} className="mt-1 shrink-0 text-brand-orange-text" aria-hidden="true" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href={enquiryHref} className="gap-2 rounded-md shadow-none">
                Discuss Your Requirements <ArrowRight size={17} aria-hidden="true" />
              </ButtonLink>
              {!solution.enquiryEnvironment && (
                <ButtonLink href="/solutions" variant="outline" className="rounded-md">
                  View IT Services
                </ButtonLink>
              )}
            </div>
          </div>
          <Image
            src={`/image/operation-teams/${solution.image}`}
            alt={solution.alt}
            width={720}
            height={360}
            sizes="(min-width: 1280px) 600px, (min-width: 1024px) 47vw, 90vw"
            className="h-auto w-full mix-blend-multiply"
          />
        </div>
      </Container>
    </section>
  );
}
