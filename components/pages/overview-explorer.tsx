"use client";

import { useId, useState } from "react";
import Image from "@/components/ui/site-image";
import { ChevronRight } from "lucide-react";

import { OverviewParagraphs, type OverviewAction, type OverviewCopy } from "@/components/pages/overview-layout";
import { scrollToOverviewButton } from "@/components/pages/scroll-to-overview-button";
import { ButtonLink } from "@/components/ui/button-link";
import type { ServiceNavMedia } from "@/lib/types";
import { cn } from "@/lib/utils";
import transition from "./overview-transition.module.css";

export type OverviewEntry = OverviewCopy & {
  image: ServiceNavMedia;
  tagline?: string;
  action?: OverviewAction;
  relatedAction?: OverviewAction;
  list?: string[];
  notes?: string[];
};

function ExplorerContent({ entry, inverse }: { entry: OverviewEntry; inverse: boolean }) {
  return (
    <div className={transition.reveal}>
      <div className="relative aspect-[16/8] overflow-hidden rounded-md bg-brand-surface">
        <Image src={entry.image.src} alt={entry.image.alt} fill sizes="(min-width: 1024px) 720px, 100vw" className="object-cover" />
      </div>
      <div className="mt-5 border-l-2 border-brand-orange pl-4">
        <h3 className="text-balance text-xl font-semibold">{entry.tagline ?? entry.title}</h3>
        <OverviewParagraphs paragraphs={entry.paragraphs} className={cn("mt-3", inverse ? "text-slate-200" : "text-brand-support")} />
        {entry.list && (
          <ul className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {entry.list.map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-relaxed">
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-orange" />
                {item}
              </li>
            ))}
          </ul>
        )}
        {entry.notes && <OverviewParagraphs paragraphs={entry.notes} className={cn("mt-4", inverse ? "text-slate-200" : "text-brand-support")} />}
        {(entry.action || entry.relatedAction) && (
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
            {entry.action && <ButtonLink href={entry.action.href} className="rounded-md shadow-none">{entry.action.label}</ButtonLink>}
            {entry.relatedAction && <ButtonLink href={entry.relatedAction.href} variant="outline" className="rounded-md shadow-none">{entry.relatedAction.label}</ButtonLink>}
          </div>
        )}
      </div>
    </div>
  );
}

export function OverviewExplorer({ entries, label, imageFirst = false, inverse = false, stickyControls = false, controlsClassName }: {
  entries: OverviewEntry[];
  label: string;
  imageFirst?: boolean;
  inverse?: boolean;
  stickyControls?: boolean;
  controlsClassName?: string;
}) {
  const [selected, setSelected] = useState(0);
  const panelId = useId();
  const entry = entries[selected];

  return (
    <div className={cn("mt-8 grid items-start gap-6 lg:gap-10", imageFirst ? "lg:grid-cols-[1.6fr_1fr]" : "lg:grid-cols-[1fr_1.6fr]")}>
      <div role="group" aria-label={label} className={cn(
        "grid grid-cols-1 gap-1",
        imageFirst && "lg:col-start-2 lg:row-start-1",
        stickyControls && "lg:sticky lg:top-28 lg:max-h-[calc(100svh-8rem)] lg:overflow-y-auto",
        controlsClassName,
      )}>
        {entries.map((item, index) => (
          <div key={item.title} className="min-w-0">
            <button
              type="button"
              aria-controls={`${panelId} ${panelId}-${index}`}
              aria-pressed={selected === index}
              onClick={(event) => {
                setSelected(index);
                scrollToOverviewButton(event.currentTarget);
              }}
              className={cn(
                "flex min-h-12 w-full cursor-pointer items-center justify-between gap-3 rounded-sm border-l-4 px-3 py-2.5 text-left text-sm font-semibold transition-colors motion-reduce:transition-none",
                inverse
                  ? selected === index ? "border-brand-orange bg-white/20 text-white" : "border-transparent bg-white/5 text-white hover:border-brand-orange hover:bg-white/10"
                  : selected === index ? "border-brand-orange bg-brand-navy text-white" : "border-transparent bg-brand-soft-white hover:border-brand-orange hover:bg-brand-tint",
              )}
            >
              {item.title}
              <ChevronRight size={17} aria-hidden="true" className={cn("shrink-0", selected === index && "rotate-90 text-brand-orange lg:rotate-0")} />
            </button>
            <div id={`${panelId}-${index}`} aria-live="polite" className="lg:hidden">
              {selected === index && (
                <div className={cn("rounded-b-md p-4", inverse ? "bg-white/5" : "bg-brand-tint")}>
                  <ExplorerContent entry={item} inverse={inverse} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div id={panelId} aria-live="polite" className={cn("hidden min-w-0 lg:block", imageFirst && "lg:col-start-1 lg:row-start-1")}>
        <ExplorerContent key={entry.title} entry={entry} inverse={inverse} />
      </div>
    </div>
  );
}
