import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { LeadForm } from "@/components/forms/lead-form";
import { OverviewBanner } from "@/components/pages/overview-layout";
import { IndustryEditorialPage } from "@/components/pages/industry-editorial-page";
import { ContextualResources } from "@/components/resources/resource-connections";
import { IndustryChallengeTabs } from "@/components/sections/industry-challenge-tabs";
import { Container } from "@/components/ui/container";
import { JsonLd } from "@/components/ui/json-ld";
import { SectionHeading } from "@/components/ui/section-heading";
import { getIndustryBySlug, getIndustries } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";
import { industryEditorialImage, industrySolutionImage } from "@/data/industry-section-images";
import { getIndustryEditorial } from "@/data/industry-editorial";
type IndustryPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = false;

export async function generateStaticParams() {
  const industries = await getIndustries();

  return industries.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: IndustryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const industry = await getIndustryBySlug(slug);

  if (slug === "multi-site-smes") {
    permanentRedirect("/industries/multi-site-businesses");
  }

  if (!industry) {
    return buildMetadata({
      title: "Industry not found",
      description: "The requested industry page could not be found.",
      path: `/industries/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: industry.seoTitle,
    description: industry.metaDescription,
    path: industry.href,
    imagePath: industry.heroImage.src,
    imageAlt: industry.heroImage.alt,
    keywords: [
      industry.primaryKeyword,
      ...industry.longTailKeywords,
      ...industry.environmentExamples,
      ...industry.primaryServiceSlugs,
    ],
  });
}

export default async function IndustryPage({ params }: IndustryPageProps) {
  const { slug } = await params;
  if (slug === "multi-site-smes") permanentRedirect("/industries/multi-site-businesses");
  const industry = await getIndustryBySlug(slug);

  if (!industry) {
    notFound();
  }

  const featureItems = industry.whyReasons;
  const supportingImage = industryEditorialImage(industry.slug, 'why');
  const editorial = getIndustryEditorial(slug);

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: industry.seoTitle,
            description: industry.heroDescription,
            url: absoluteUrl(industry.href),
            image: absoluteUrl(industry.heroImage.src),
            about: industry.environmentExamples,
            provider: {
              "@type": "Organization",
              name: "Integrated Solutions Technology",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: absoluteUrl("/"),
              },
              {
                "@type": "ListItem",
                position: 2,
                name: industry.title,
                item: absoluteUrl(industry.href),
              },
            ],
          },
        ]}
      />
      {editorial ? <IndustryEditorialPage industry={industry} copy={editorial} /> : <>
      <OverviewBanner
        hero
        fadeToNavy
        copy={{ title: industry.heroTitle, paragraphs: [industry.shortDescription] }}
        image={industry.heroImage}
        actions={[
          { href: "/book-consultation", label: "Book Consultation" },
          { href: "#industry-challenges", label: "Explore Industry Challenges" },
        ]}
      />

      <div id="industry-challenges">
        <IndustryChallengeTabs industry={industry} />
      </div>

      <section className="bg-[var(--brand-surface)] py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-white shadow-[0_22px_70px_color-mix(in_srgb,var(--brand-navy)_8%,transparent)] sm:min-h-[24rem]">
            <Image
              src={supportingImage.src}
              alt={supportingImage.alt}
              fill
              loading="lazy"
              className="object-cover"
              sizes="(min-width: 1280px) 620px, (min-width: 1024px) 50vw, calc(100vw - 40px)"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--brand-navy)_20%,transparent),color-mix(in_srgb,var(--brand-navy)_0%,transparent))]" />
          </div>

          <div>
            <h2 className="text-balance text-4xl font-semibold tracking-[-0.05em] text-[var(--color-ink)] sm:text-5xl">
              {industry.whyTitle}
            </h2>
            <p className="mt-5 text-base leading-8 text-[var(--color-muted)]">
              {industry.whyDescription}
            </p>

            <div className="mt-8 grid gap-6">
              {featureItems.map((item) => {
                return (
                  <div key={item.title} className="border-l-2 border-[var(--brand-orange)] pl-4">
                    <div>
                      <h3 className="text-base font-semibold text-[var(--color-ink)]">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <Container>
          <SectionHeading
            title={industry.solutionsTitle}
            description={industry.solutionsDescription}
            align="center"
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {industry.solutions.map((service) => {
              const cardImage = industrySolutionImage(service.href);
              return (
                <article
                  key={service.href}
                  className="overflow-hidden rounded-lg border border-[color:color-mix(in_srgb,var(--brand-navy)_8%,transparent)] bg-white shadow-[0_18px_50px_color-mix(in_srgb,var(--brand-navy)_6%,transparent)]"
                >
                  <div className="relative min-h-[13.5rem] bg-[var(--color-cloud)]">
                    <Image
                      src={cardImage.src}
                      alt={cardImage.alt}
                      fill
                      loading="lazy"
                      className="object-cover"
                      sizes="(min-width: 1280px) 400px, (min-width: 1024px) 31vw, calc(100vw - 40px)"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--color-ink)]">
                      {service.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                      {service.description}
                    </p>
                    <Link
                      href={service.href}
                      className="mt-6 inline-flex items-center text-sm font-semibold text-[var(--color-electric)]"
                    >
                      {service.linkLabel}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="bg-[var(--brand-surface)] py-16 sm:py-24">
        <Container>
          <LeadForm
            context="consultation"
            title={industry.formTitle}
            description={industry.formDescription}
            className="mx-auto max-w-5xl rounded-lg max-md:[&_form]:grid-cols-1 [&_select]:w-full [&_select]:min-w-0"
            headingAlign="center"
            showEyebrow={false}
            submitLabel={industry.formCta}
          />
        </Container>
      </section>
      </>}
      <ContextualResources industry={slug} />
    </>
  );
}
