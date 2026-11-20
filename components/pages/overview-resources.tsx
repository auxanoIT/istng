import Image from "@/components/ui/site-image";
import Link from "@/components/ui/site-link";
import { ArrowRight, ChevronDown } from "lucide-react";

import { OverviewHeading, OverviewParagraphs, OverviewSection, type OverviewAction, type OverviewCopy } from "@/components/pages/overview-layout";
import { ButtonLink } from "@/components/ui/button-link";
import { JsonLd } from "@/components/ui/json-ld";
import type { ServiceNavMedia } from "@/lib/types";
import styles from "./overview-faq.module.css";

export function OverviewRelated({ copy, items }: {
  copy: OverviewCopy;
  items: (OverviewCopy & { image: ServiceNavMedia; action: OverviewAction })[];
}) {
  return (
    <OverviewSection id="connected-technology">
      <OverviewHeading copy={copy} id="connected-technology-title" />
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.title}>
            <Link href={item.action.href} className="group flex h-full flex-col overflow-hidden rounded-lg border border-brand-border bg-white hover:border-brand-orange">
              <div className="relative aspect-video">
                <Image src={item.image.src} alt="" fill sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <OverviewParagraphs paragraphs={item.paragraphs} className="mt-2 flex-1 text-brand-support" />
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold group-hover:underline">
                  {item.action.label}<ArrowRight size={16} aria-hidden="true" />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </OverviewSection>
  );
}

export function OverviewFaq({ id, copy, action, renderAllAnswers = true }: {
  id: string;
  copy: OverviewCopy & { items: OverviewCopy[] };
  action: OverviewAction;
  renderAllAnswers?: boolean;
}) {
  return (
    <OverviewSection id={id} tone="warm">
      {renderAllAnswers && <JsonLd data={{
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: copy.items.map(item => ({
          "@type": "Question", name: item.title,
          acceptedAnswer: { "@type": "Answer", text: item.paragraphs.join(" ") },
        })),
      }} />}
      <OverviewHeading copy={copy} id={`${id}-title`} />
      <div className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-lg border border-brand-border bg-white">
        {copy.items.map((item, index) => (
          <details key={item.title} name={id} open={index === 0} className={styles.item}>
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-sm font-medium sm:px-6 sm:text-base">
              {item.title}<ChevronDown size={18} aria-hidden="true" className={styles.chevron} />
            </summary>
            <OverviewParagraphs paragraphs={item.paragraphs} className="px-4 pt-4 pb-4 text-brand-support sm:px-6" />
          </details>
        ))}
      </div>
      <div className="mt-7 text-center">
        <ButtonLink href={action.href} className="rounded-md shadow-none">{action.label}</ButtonLink>
      </div>
    </OverviewSection>
  );
}
