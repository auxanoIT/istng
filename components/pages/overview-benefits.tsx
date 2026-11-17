"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useId, useState } from "react";

import { OverviewHeading, OverviewSection, type OverviewCopy } from "@/components/pages/overview-layout";
import { scrollToOverviewButton } from "@/components/pages/scroll-to-overview-button";
import transition from "./overview-transition.module.css";

export function OverviewBenefits({ id, copy, images }: { id: string; copy: OverviewCopy & { items: OverviewCopy[] }; images: string[] }) {
  const previewId = useId();
  const [selected, setSelected] = useState(0);
  const benefit = copy.items[selected];

  return (
    <OverviewSection id={id} tone="warm">
      <div aria-hidden="true" className="mx-auto mb-6 h-0.5 w-14 bg-brand-orange" />
      <OverviewHeading copy={copy} id={`${id}-title`} />
      <div className="mx-auto mt-8 grid max-w-6xl gap-5 sm:mt-12 lg:grid-cols-[1.35fr_1fr] lg:items-center lg:gap-10">
        <figure id={previewId} aria-live="polite" className="relative isolate hidden flex-col justify-end overflow-hidden rounded-lg bg-brand-navy lg:flex lg:min-h-108">
          <div key={images[selected]} className={`absolute inset-0 ${transition.reveal}`}>
            <Image
              src={images[selected]}
              alt=""
              fill
              sizes="(min-width: 1280px) 640px, 55vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-brand-navy via-brand-navy/75 via-40% to-transparent to-80%" />
          <figcaption key={benefit.title} className={`relative px-8 py-8 text-white ${transition.reveal}`}>
            <h3 className="max-w-sm text-balance text-xl font-semibold leading-tight sm:text-3xl">{benefit.title}</h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/95 sm:text-base">{benefit.paragraphs[0]}</p>
          </figcaption>
        </figure>
        <ul aria-labelledby={`${id}-title`} className="min-w-0 divide-y divide-brand-border border-y border-brand-border">
          {copy.items.map((item, index) => (
            <li key={item.title}>
              <button
                type="button"
                aria-pressed={selected === index}
                aria-controls={`${previewId} ${previewId}-${index}`}
                onClick={(event) => {
                  setSelected(index);
                  scrollToOverviewButton(event.currentTarget);
                }}
                className="group flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 border-l-4 border-transparent px-4 py-3 text-left text-sm font-semibold transition-colors hover:bg-brand-tint/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-navy aria-pressed:border-brand-orange aria-pressed:bg-brand-tint motion-reduce:transition-none sm:px-5 sm:text-base lg:min-h-18"
              >
                {item.title}
                <ArrowRight size={18} aria-hidden="true" className="shrink-0 group-aria-pressed:rotate-90 group-aria-pressed:text-[var(--brand-orange-text)] lg:group-aria-pressed:rotate-0" />
              </button>
              <div id={`${previewId}-${index}`} aria-live="polite" className="lg:hidden">
                {selected === index && (
                  <div className={`border-l-4 border-brand-orange bg-brand-tint px-4 pb-4 sm:px-5 ${transition.reveal}`}>
                    <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-brand-navy">
                      <Image src={images[index]} alt="" fill sizes="(min-width: 640px) 90vw, calc(100vw - 76px)" className="object-cover" />
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-brand-support">{item.paragraphs[0]}</p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </OverviewSection>
  );
}
