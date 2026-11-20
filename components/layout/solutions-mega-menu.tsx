"use client";

import Image from "@/components/ui/site-image";
import Link from "@/components/ui/site-link";
import { useState } from "react";
import styles from "./solutions-mega-menu.module.css";
import { ChevronRight } from "lucide-react";

import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Container } from "@/components/ui/container";
import type { SolutionPillar } from "@/data/enterprise-solutions";
import { cn } from "@/lib/utils";

type SolutionsMegaMenuProps = {
  categories: SolutionPillar[];
  active?: boolean;
};

export function SolutionsMegaMenu({
  categories,
  active = false,
}: SolutionsMegaMenuProps) {
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.slug ?? "");

  const activeCategory =
    categories.find((category) => category.slug === activeCategoryId) ?? categories[0];


  if (!activeCategory) {
    return null;
  }

  const activeCategoryImage = activeCategory.image;

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger
        className={cn(
          "text-[var(--color-muted)]",
          active && "bg-white text-[var(--color-ink)] shadow-[0_12px_30px_color-mix(in_srgb,var(--brand-navy)_8%,transparent)]",
        )}
        onMouseEnter={() => setActiveCategoryId(categories[0]?.slug ?? "")}
        onFocus={() => setActiveCategoryId(categories[0]?.slug ?? "")}
      >
        Solutions
      </NavigationMenuTrigger>
      <NavigationMenuContent className="fixed inset-x-0 top-20 mt-0 w-full">
        <div
          className={`${styles.reveal} max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-b border-[var(--brand-border)] bg-[var(--brand-white)]`}
        >
          <Container className="grid min-h-[23.75rem] gap-6 py-10 lg:grid-cols-[220px_minmax(0,1fr)]">
            <div className="border-r border-[color:color-mix(in_srgb,var(--brand-navy)_12%,transparent)] pr-4">
              <p className="text-[0.68rem] font-semibold text-[var(--color-muted)]">
                Solution groups
              </p>
              <div className="mt-4 space-y-1">
                {categories.map((category) => {
                  const isActive = category.slug === activeCategory.slug;

                  return (
                    <button
                      key={category.slug}
                      type="button"
                      aria-pressed={isActive}
                      onMouseEnter={() => setActiveCategoryId(category.slug)}
                      onFocus={() => setActiveCategoryId(category.slug)}
                      onClick={() => setActiveCategoryId(category.slug)}
                      className={cn(
                        "group flex min-h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-md border-l-4 px-3 py-2 text-left text-sm font-semibold leading-snug transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy",
                        isActive
                          ? "border-brand-orange bg-brand-navy text-white"
                          : "border-transparent text-brand-navy hover:border-brand-orange hover:bg-brand-tint",
                      )}
                    >
                      <span>{category.label}</span>
                      <ChevronRight
                        size={16}
                        aria-hidden="true"
                        className={cn("shrink-0 transition-opacity", isActive ? "text-brand-orange" : "opacity-35 group-hover:opacity-100")}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

              <div
                key={activeCategory.slug}
                className={`${styles.reveal} grid grid-cols-[minmax(0,1.15fr)_minmax(0,3fr)] items-start content-start gap-3`}
              >
                <NavigationMenuLink
                  asChild
                  className="group block self-start overflow-hidden rounded-md border border-brand-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy"
                >
                  <Link href={activeCategory.href} aria-label={`Overview: ${activeCategory.label}`}>
                    <span className="block bg-brand-orange/25 px-4 py-4 font-medium text-brand-navy transition-colors group-hover:bg-brand-orange/40">
                      Overview
                    </span>
                    <span className="relative block aspect-[3/2] w-full overflow-hidden">
                      <Image
                        src={activeCategoryImage.src}
                        alt=""
                        fill
                        sizes="255px"
                        className="object-cover transition duration-300 group-hover:scale-[1.03]"
                      />
                    </span>
                  </Link>
                </NavigationMenuLink>

                <div className="grid auto-rows-[minmax(4.5rem,auto)] grid-cols-3 content-start gap-3">
                {activeCategory.items.map((service) => {
                  const serviceImage = service.image;

                  return (
                    <NavigationMenuLink
                      key={service.href}
                      asChild
                      className="group rounded-md border border-[var(--brand-border)] bg-[var(--brand-white)] transition-colors hover:border-[#d5b773] hover:bg-[var(--brand-tint)]"
                    >
                      <Link
                        href={service.href}
                        className="flex min-w-0 items-center justify-between gap-3 px-4 py-2"
                      >
                        <span className="min-w-0 text-[0.85rem] font-medium leading-snug text-[var(--brand-navy)] transition-colors group-hover:text-[var(--brand-orange-text)]">
                          {service.title}
                        </span>
                        <span className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md bg-white/80">
                          <Image
                            src={serviceImage.src}
                            alt=""
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </span>
                      </Link>
                    </NavigationMenuLink>
                  );
                })}
                </div>
              </div>
          </Container>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
