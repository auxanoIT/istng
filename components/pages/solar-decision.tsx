import Image from "next/image";

import { OverviewHeading, OverviewSection } from "@/components/pages/overview-layout";
import copy from "@/data/solar-overview-copy.json";
import { solarConsultationService } from "@/data/solar-overview";
import { solarPriorities } from "@/data/solar-priorities";

export function OverviewDecision({ id = "when-solar-makes-sense", title, question, image, priorities, service, action }: {
  id?: string;
  title: string;
  question: string;
  image: { src: string; alt: string };
  priorities: { id: string; label: string }[];
  service: string;
  action: string;
}) {
  return (
    <OverviewSection id={id} tone="warm">
      <div className="mx-auto mb-5 h-0.5 w-14 bg-brand-orange" aria-hidden="true" />
      <OverviewHeading
        id={`${id}-title`}
        copy={{ title, paragraphs: [] }}
      />
      <p id={`${id}-question`} className="mt-4 text-center text-base font-medium sm:text-lg">{question}</p>
      <div className="mx-auto mt-8 grid max-w-6xl gap-3 lg:grid-cols-[1.16fr_1fr] lg:gap-0 lg:overflow-hidden lg:rounded-xl">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl lg:aspect-auto lg:rounded-none">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1280px) 650px, (min-width: 1024px) 52vw, 100vw"
            className="object-cover object-[center_42%]"
          />
        </div>
        <form action="/book-consultation#project-enquiry" method="get" className="rounded-xl bg-brand-navy p-5 text-white sm:p-8 lg:rounded-none">
          <input type="hidden" name="service" value={service} />
          <fieldset aria-labelledby={`${id}-question`} className="min-w-0 divide-y divide-white/25">
            {priorities.map(({ id, label }) => (
              <label key={id} className="flex min-h-12 cursor-pointer items-center gap-3 py-2 text-sm font-semibold sm:min-h-14 sm:text-base">
                <input type="checkbox" name="priority" value={id} className="size-5 shrink-0 cursor-pointer accent-brand-orange focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange" />
                <span>{label}</span>
              </label>
            ))}
          </fieldset>
          <button type="submit" className="mt-5 min-h-12 w-full cursor-pointer rounded-lg bg-brand-orange px-4 py-3 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-orange-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:text-base">
            {action}
          </button>
        </form>
      </div>
    </OverviewSection>
  );
}

export function SolarDecision() {
  return <OverviewDecision
    title={copy.decisions.title}
    question="What’s changing about the way you use power?"
    image={{ src: "/integrated-assets/images/solutions/solar-site-consultation-ankara.webp", alt: "A solar technician showing a business owner something on a tablet inside her shop" }}
    priorities={solarPriorities}
    service={solarConsultationService}
    action={copy.decisions.ctas[0]}
  />;
}
