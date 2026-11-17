"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { ButtonLink } from "@/components/ui/button-link";
import type { IndustryProfile } from "@/lib/types";
import { cn } from "@/lib/utils";
import { industryEditorialImage } from "@/data/industry-section-images";

type IndustryChallengeTabsProps = { industry: IndustryProfile };

export function IndustryChallengeTabs({
  industry,
}: IndustryChallengeTabsProps) {
  const tabs = industry.challengeTabs;
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id ?? "");
  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];

  if (!activeTab) return null;
  const image = industryEditorialImage(industry.slug, 'challenge');

  return (
    <section className="bg-white py-14 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mx-auto max-w-3xl text-balance text-[2.15rem] font-semibold leading-[1.08] tracking-[-0.045em] text-[var(--color-ink)] sm:text-5xl sm:leading-[1.05]">
            {industry.challengesTitle}
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-[var(--color-muted)] sm:text-lg">
            {activeTab.description}
          </p>
        </div>

        <div className="relative mt-8 overflow-hidden sm:mt-10">
          <div
            role="tablist"
            aria-label={`${industry.title} challenges`}
            className="flex gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:justify-center"
          >
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTabId(tab.id)}
                  className={cn(
                    "min-w-[13.5rem] rounded-full border px-6 py-4 text-sm font-semibold transition sm:min-w-[17rem]",
                    isActive
                      ? "border-brand-orange bg-brand-tint text-brand-navy"
                      : "border-[color:color-mix(in_srgb,var(--brand-navy)_16%,transparent)] bg-white text-[var(--color-ink)] hover:border-[color:color-mix(in_srgb,var(--brand-navy)_45%,transparent)]",
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
          <div className="pointer-events-none absolute right-0 top-0 flex h-[4.1rem] w-14 items-center justify-end bg-[linear-gradient(90deg,color-mix(in_srgb,var(--brand-white)_0%,transparent),var(--brand-white)_70%)] sm:hidden">
            <ArrowRight className="h-5 w-5 text-[var(--color-ink)]" />
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.26 }}
            className="mt-10 grid gap-9 lg:mt-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center"
          >
            <div className="relative min-h-[17rem] overflow-hidden rounded-lg bg-[var(--color-cloud)] shadow-[0_22px_60px_color-mix(in_srgb,var(--brand-navy)_8%,transparent)] sm:min-h-[24rem] lg:order-2">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                loading="lazy"
                className="object-cover"
                sizes="(min-width: 1280px) 620px, (min-width: 1024px) 50vw, calc(100vw - 32px)"
              />
            </div>
            <div>
              <h3 className="text-balance text-3xl font-semibold tracking-[-0.045em] text-[var(--color-ink)] sm:text-4xl">
                {activeTab.title}
              </h3>
              <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--color-muted)]">
                {activeTab.description}
              </p>
              <div className="mt-7 grid gap-4">
                {activeTab.points.map((point, index) => (
                  <motion.div
                    key={point.title}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.22, delay: 0.06 + index * 0.04 }}
                    className="grid gap-2 border-l-2 border-[var(--brand-orange)] pl-4"
                  >
                    <h4 className="text-base font-semibold text-[var(--color-ink)]">
                      {point.title}
                    </h4>
                    <p className="text-sm leading-7 text-[var(--color-muted)]">
                      {point.description}
                    </p>
                  </motion.div>
                ))}
              </div>
              <ButtonLink
                href={activeTab.ctaHref}
                className="mt-7 max-sm:w-full !bg-[var(--brand-orange)] !bg-none !px-5 !text-[var(--brand-navy)] !shadow-none hover:!bg-[var(--brand-orange-hover)]"
              >
                {activeTab.ctaLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </ButtonLink>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
