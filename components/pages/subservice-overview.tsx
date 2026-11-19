import Image from "@/components/ui/site-image";
import { OverviewExplorer, type OverviewEntry } from "@/components/pages/overview-explorer";
import { OverviewBanner, OverviewHeading, OverviewParagraphs, OverviewSection, type OverviewAction, type OverviewCopy } from "@/components/pages/overview-layout";
import { OverviewFaq } from "@/components/pages/overview-resources";
import { ButtonLink } from "@/components/ui/button-link";
import type { ServiceNavMedia } from "@/lib/types";

type Banner = OverviewCopy & { image: ServiceNavMedia; actions: OverviewAction[] };

export type SubserviceOverviewContent = {
  hero: Banner;
  benefits: OverviewCopy & { items: OverviewCopy[] };
  process: OverviewCopy & { entries: OverviewEntry[]; label: string };
  gallery?: OverviewCopy & { items: (OverviewCopy & { image: ServiceNavMedia })[]; action: OverviewAction; relatedAction?: OverviewAction };
  faq?: OverviewCopy & { items: OverviewCopy[]; action: OverviewAction };
  closing: Banner;
};

export function SubserviceOverview({ content }: { content: SubserviceOverviewContent }) {
  const { hero, benefits, process, gallery, faq, closing } = content;

  return (
    <>
      <OverviewBanner copy={hero} image={hero.image} actions={hero.actions} hero fadeToNavy />

      <OverviewSection id="service-benefits" tone="navy">
        <OverviewHeading copy={benefits} id="service-benefits-title" inverse />
        <ul className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {benefits.items.map((item) => (
            <li key={item.title} className="border-t border-white/25 pt-4">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <OverviewParagraphs paragraphs={item.paragraphs} className="mt-2 text-slate-200" />
            </li>
          ))}
        </ul>
      </OverviewSection>

      <OverviewSection id="service-process">
        <OverviewHeading copy={process} id="service-process-title" />
        <OverviewExplorer label={process.label} entries={process.entries} controlsClassName="lg:sticky lg:top-24" />
      </OverviewSection>

      {gallery && (
        <OverviewSection id="service-gallery">
          <OverviewHeading copy={gallery} id="service-gallery-title" />
          <ul className="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {gallery.items.map(({ title, image, paragraphs }) => (
              <li key={title}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-brand-surface">
                  <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 290px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <OverviewParagraphs paragraphs={paragraphs} className="mt-2 text-brand-support" />
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href={gallery.action.href} className="rounded-md shadow-none">{gallery.action.label}</ButtonLink>
            {gallery.relatedAction && <ButtonLink href={gallery.relatedAction.href} variant="outline" className="rounded-md shadow-none">{gallery.relatedAction.label}</ButtonLink>}
          </div>
        </OverviewSection>
      )}

      {faq && <OverviewFaq id="service-faq" copy={faq} action={faq.action} renderAllAnswers />}

      <OverviewBanner copy={closing} image={closing.image} actions={closing.actions} />
    </>
  );
}
