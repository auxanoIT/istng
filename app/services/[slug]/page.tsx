import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getInfrastructureSubservice } from "@/data/infrastructure-subservices";
import { InfrastructureSubservice, infrastructureSubserviceMetadata } from "@/components/pages/infrastructure-subservice";
import {
  Network,
  ShieldCheck,
  Wrench,
  BadgeCheck,
  ClipboardCheck,
  Flame,
} from "lucide-react";

import { PartnerLogoMarquee } from "@/components/sections/partner-logo-marquee";
import { EnterpriseOverview } from "@/components/pages/enterprise-overview";
import { getEnterpriseOverview } from "@/data/enterprise-overview";
import { ServiceCapabilityFlow } from "@/components/sections/service-capability-flow";
import { ServiceSeoAnswerBlock } from "@/components/sections/service-seo-answer-block";
import { Container } from "@/components/ui/container";
import { JsonLd } from "@/components/ui/json-ld";
import { getServiceBySlug } from "@/lib/content";
import { primarySolutionPages } from "@/data/site-routes";
import { buildMetadata } from "@/lib/seo";
import {
  buildServiceSeoDescription,
  buildServiceSeoKeywords,
  buildServiceSeoTitle,
} from "@/lib/service-seo";
import { absoluteUrl } from "@/lib/utils";
import { findPillar, parentForService } from "@/data/service-pillars";
import { PillarPage } from "@/components/services/pillar/pillar-page";
import { pillarMetadata, PillarSchema } from "@/components/services/pillar/pillar-seo";
import { integratedServiceContent } from "@/lib/integrated-service-brand";
import { SubserviceHero } from "@/components/services/subservice-hero";
import { productionServiceAt } from "@/data/subservice-production";
import { ProductionServicePage, productionMetadata } from "@/components/services/production-service-page";
import { ContextualResources } from "@/components/resources/resource-connections";
import type {
  Service,
  ServiceCapabilitySection,
  ServiceCategory,
  ServiceNavMedia,
} from "@/lib/types";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = false;

const categoryStyles: Record<
  ServiceCategory,
  {
    icon: typeof ShieldCheck;
    accent: string;
    tint: string;
    image: string;
    imageAlt: string;
  }
> = {
  Infrastructure: {
    icon: ShieldCheck,
    accent: "var(--brand-orange)",
    tint: "rgba(47,107,255,0.1)",
    image: "/image/IT Infrastructure.png",
    imageAlt:
      "Biometric access control device in a secure infrastructure environment",
  },
  "Fire Alarm & Safety": {
    icon: Flame,
    accent: "var(--brand-orange)",
    tint: "rgba(220,38,38,0.1)",
    image: "/image/service-details/fire-alarm-hero-call-point.webp",
    imageAlt: "Red manual fire alarm call point mounted on a clean commercial wall",
  },
  Networking: {
    icon: Network,
    accent: "var(--brand-orange)",
    tint: "rgba(249,115,22,0.11)",
    image: "/image/networking.png",
    imageAlt: "Network rack with structured orange cabling",
  },
  "Hardware Systems": {
    icon: Wrench,
    accent: "var(--brand-orange)",
    tint: "rgba(24,182,126,0.12)",
    image: "/image/computer_and_server.png",
    imageAlt: "Computer and server hardware systems",
  },
  "Software & Licenses": {
    icon: BadgeCheck,
    accent: "var(--brand-orange)",
    tint: "rgba(124,58,237,0.1)",
    image: "/image/software_and_licenses.jpg",
    imageAlt: "Software licensing and cloud services workspace",
  },
  "Managed & Advisory": {
    icon: ClipboardCheck,
    accent: "var(--brand-orange)",
    tint: "rgba(15,118,110,0.12)",
    image: "/image/It_management.jpg",
    imageAlt: "IT management professional reviewing service activity",
  },
};

function buildFallbackSections(
  service: Service,
  image: string,
  imageAlt: string,
): ServiceCapabilitySection[] {
  return [
    {
      id: "delivery-model",
      navLabel: "Delivery model",
      title: `How ${service.title.toLowerCase()} is scoped.`,
      lead: service.summary,
      body: [service.description],
      image: {
        src: image,
        alt: imageAlt,
      },
    },
    {
      id: "handover-control",
      navLabel: "Handover",
      title: "What should be clear at completion.",
      lead: "A finished scope should leave the environment usable, supportable, and easier to govern.",
      body: [
        "Integrated Solutions Technology documents the technical outcome in a way that helps internal teams, external vendors, and future support work from the same operating picture.",
      ],
      image: {
        src: image,
        alt: imageAlt,
      },
    },
    {
      id: "operating-fit",
      navLabel: "Operating fit",
      title: "Where this service creates measurable value.",
      lead: service.positioning,
      body: [
        "The strongest results come when the service is matched to the environment, the operational pressure behind it, and the accountability expected after deployment.",
      ],
      image: {
        src: image,
        alt: imageAlt,
      },
    },
  ];
}

function getServiceHeroImage(
  service: Service,
  fallbackImage: ServiceNavMedia,
): ServiceNavMedia {
  return (
    service.heroImage ??
    service.capabilitySections?.find((section) => section.image)?.image ??
    fallbackImage
  );
}

export async function generateStaticParams() {
  return primarySolutionPages.filter(page => /^\/services\/[^/]+$/.test(page.href)).map(page => ({ slug: page.href.split("/")[2] }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const subservice = getInfrastructureSubservice(`/services/${slug}`);
  if (subservice) return infrastructureSubserviceMetadata(subservice);
  const pillar = findPillar(slug);
  const overview = getEnterpriseOverview(`/services/${slug}`);
  if (overview) return buildMetadata({
    title: overview.pillar.label,
    description: overview.intro,
    path: overview.pillar.href,
    imagePath: overview.heroImage.src,
    imageAlt: overview.heroImage.alt,
    keywords: pillar?.keywords,
  });
  if (pillar) return pillarMetadata(pillar);
  const production = productionServiceAt(`/services/${slug}`);
  if (production) return productionMetadata(production);
  const service = await getServiceBySlug(slug);

  if (!service) {
    return buildMetadata({
      title: "Service not found",
      description: "The requested service page could not be found.",
      path: `/services/${slug}`,
      noIndex: true,
    });
  }

  const style = categoryStyles[service.category];
  const heroImage = getServiceHeroImage(service, {
    src: style.image,
    alt: style.imageAlt,
  });

  return buildMetadata({
    title: buildServiceSeoTitle(service),
    description: buildServiceSeoDescription(service),
    path: `/services/${service.slug}`,
    imagePath: heroImage.src,
    imageAlt: heroImage.alt,
    keywords: buildServiceSeoKeywords(service),
  });
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const subservice = getInfrastructureSubservice(`/services/${slug}`);
  if (subservice) return <InfrastructureSubservice page={subservice} />;
  const pillar = findPillar(slug);
  const overview = getEnterpriseOverview(`/services/${slug}`);
  if (overview) return (
    <>
      {pillar && <PillarSchema pillar={pillar} />}
      <EnterpriseOverview overview={overview} />
    </>
  );
  if (pillar) return <PillarPage pillar={pillar} />;
  const service = integratedServiceContent(await getServiceBySlug(slug));
  const parent = parentForService(slug);

  if (!service) {
    notFound();
  }

  const production = productionServiceAt(`/services/${slug}`);
  if (production) return <ProductionServicePage page={production} images={service.capabilitySections?.map(section => section.image)} />;

  const style = categoryStyles[service.category];
  const heroImage = getServiceHeroImage(service, {
    src: style.image,
    alt: style.imageAlt,
  });
  const capabilitySections =
    service.capabilitySections ??
    buildFallbackSections(service, heroImage.src, heroImage.alt);
  const serviceUrl = absoluteUrl(`/services/${service.slug}`);
  const organizationId = `${absoluteUrl("/")}#organization`;

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.title,
            serviceType: service.category,
            provider: {
              "@type": "Organization",
              "@id": organizationId,
              name: "Integrated Solutions Technology",
            },
            areaServed: [
              { "@type": "Country", name: "Nigeria" },
              { "@type": "City", name: "Lagos" },
              { "@type": "City", name: "Abuja" },
              { "@type": "City", name: "Port Harcourt" },
            ],
            availableChannel: {
              "@type": "ServiceChannel",
              serviceUrl,
            },
            audience: service.industries.map((industry) => ({
              "@type": "Audience",
              audienceType: industry,
            })),
            url: serviceUrl,
            description: buildServiceSeoDescription(service),
            image: absoluteUrl(heroImage.src),
            serviceOutput: service.deliverables,
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
                name: "Services",
                item: absoluteUrl("/solutions"),
              },
              ...(parent ? [{
                "@type": "ListItem",
                position: 3,
                name: parent.title,
                item: absoluteUrl(`/services/${parent.slug}`),
              }] : []),
              {
                "@type": "ListItem",
                position: parent ? 4 : 3,
                name: service.title,
                item: absoluteUrl(`/services/${service.slug}`),
              },
            ],
          },
        ]}
      />

      {parent ? <SubserviceHero title={service.title} description={service.description} image={heroImage} parent={{title:parent.title,href:`/services/${parent.slug}`}} href={`/services/${service.slug}`} /> : <>
      <section className="overflow-hidden bg-[linear-gradient(125deg,var(--brand-navy),var(--brand-navy)_70%,var(--brand-navy))] text-white">
        <Container className="grid gap-10 pb-16 pt-32 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="max-w-3xl">
            <h1 className="text-balance text-5xl font-semibold tracking-[-0.06em] sm:text-6xl lg:text-7xl">
              {service.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              {service.description}
            </p>
          </div>

          <div className="relative min-h-[420px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 shadow-[0_30px_90px_color-mix(in_srgb,var(--brand-navy)_35%,transparent)]">
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              fill
              priority
              quality={70}
              className="object-cover opacity-90"
              sizes="(min-width: 1024px) 54vw, 100vw"
            />
          </div>
        </Container>
      </section>
      </>}

      <ServiceCapabilityFlow service={service} sections={capabilitySections} />
      <ServiceSeoAnswerBlock service={service} />
      <ContextualResources service={`/services/${slug}`} />
      <PartnerLogoMarquee />
    </>
  );
}
