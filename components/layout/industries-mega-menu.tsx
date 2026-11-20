"use client";

import Link from "@/components/ui/site-link";
import { useState } from "react";

import { IndustryIcon } from "@/components/ui/industry-icon";
import { Container } from "@/components/ui/container";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { industryNavigation } from "@/data/industry-navigation";
import type { IndustryNavigationItem } from "@/lib/types";
import { cn } from "@/lib/utils";

type IndustriesMegaMenuProps = {
  industries: IndustryNavigationItem[];
  active?: boolean;
};

export function IndustriesMegaMenu({
  industries,
  active = false,
}: IndustriesMegaMenuProps) {
  const [activeGroup, setActiveGroup] = useState<(typeof industryNavigation)[number]>(industryNavigation[0]);
  const groupIndustries = activeGroup.entries.flatMap(([slug]) => {
    const industry = industries.find((entry) => entry.slug === slug);
    return industry ? [industry] : [];
  });

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger
        className={cn(
          "text-[var(--color-muted)]",
          active &&
            "bg-white text-[var(--color-ink)] shadow-[0_12px_30px_color-mix(in_srgb,var(--brand-navy)_8%,transparent)]",
        )}
      >
        Industries
      </NavigationMenuTrigger>
      <NavigationMenuContent className="fixed inset-x-0 top-20 mt-0 w-full">
        <div className="border-t border-b border-[color:color-mix(in_srgb,var(--brand-navy)_8%,transparent)] bg-white">
          <Container className="grid min-h-[23.75rem] items-start gap-8 py-10 lg:grid-cols-[230px_minmax(0,1fr)]">
            <div className="border-r border-[color:color-mix(in_srgb,var(--brand-navy)_12%,transparent)] pr-7">
              <p className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                Industries
              </p>
              <div className="grid gap-1">
                {industryNavigation.map((group) => (
                  <button
                    key={group.id}
                    type="button"
                    onMouseEnter={() => setActiveGroup(group)}
                    onFocus={() => setActiveGroup(group)}
                    onClick={() => setActiveGroup(group)}
                    className={cn(
                      "rounded-md px-3 py-3 text-left text-sm font-semibold leading-snug transition-colors",
                      activeGroup === group
                        ? "bg-[var(--color-cloud)] text-[var(--color-electric)]"
                        : "text-[var(--color-ink)] hover:bg-[color:color-mix(in_srgb,var(--brand-surface)_92%,transparent)]",
                    )}
                  >
                    {group.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid auto-rows-[minmax(4.5rem,auto)] grid-cols-3 content-start gap-3">
              {groupIndustries.map((industry) => (
                <NavigationMenuLink
                  key={industry.slug}
                  asChild
                  className="group rounded-md bg-[color:color-mix(in_srgb,var(--brand-surface)_92%,transparent)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--brand-muted)_98%,transparent)]"
                >
                  <Link
                    href={industry.href}
                    className="flex min-w-0 items-center gap-3 px-4 py-2"
                  >
                    <IndustryIcon
                      name={industry.icon}
                      className="h-6 w-6 shrink-0 text-[var(--color-ink)]"
                      strokeWidth={1.45}
                    />
                    <span className="min-w-0 text-[0.9rem] font-medium leading-snug text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-electric)]">
                      {industry.navLabel}
                    </span>
                  </Link>
                </NavigationMenuLink>
              ))}
            </div>
          </Container>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
