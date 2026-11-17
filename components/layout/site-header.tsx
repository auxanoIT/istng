"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";

import { IndustriesMegaMenu } from "@/components/layout/industries-mega-menu";
import { MobileNavigationSheet } from "@/components/layout/mobile-navigation-sheet";
import { ResourcesMegaMenu } from "@/components/layout/resources-mega-menu";
import { SolutionsMegaMenu } from "@/components/layout/solutions-mega-menu";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import type {
  IndustryProfile,
  NavItem,
  ResourceGroup,
} from "@/lib/types";
import type { SolutionPillar } from "@/data/enterprise-solutions";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  navigation: NavItem[];
  solutionCategories: SolutionPillar[];
  industries: IndustryProfile[];
  resourceGroups: ResourceGroup[];
};

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({
  navigation,
  solutionCategories,
  industries,
  resourceGroups,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--brand-navy)]/10 bg-brand-white">
      <Container className="flex h-20 items-center justify-between gap-4 2xl:gap-6">
        <Link
          href="/"
          aria-label="Integrated Solutions home"
          className="flex shrink-0 items-center gap-2 sm:gap-3"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/brand/integrated_solution_technology.png"
            alt=""
            width={52}
            height={52}
            loading="eager"
            className="!h-11 !w-auto object-contain"
          />
          <span className="text-[0.6875rem] font-semibold uppercase leading-tight tracking-wider text-[var(--brand-navy)] sm:text-xs">
            Integrated Solutions
          </span>
        </Link>

        <div className="hidden flex-1 justify-center xl:flex">
          <NavigationMenu delayDuration={80} skipDelayDuration={140}>
            <NavigationMenuList className="gap-0.5 2xl:gap-1">
              {navigation.map((item) => {
                const active =
                  item.kind === "solutions"
                    ? pathname.startsWith("/services") || pathname.startsWith("/solutions")
                    : item.kind === "industries"
                      ? pathname.startsWith("/industries")
                      : item.kind === "resources"
                        ? pathname.startsWith("/resources")
                        : isActivePath(pathname, item.href);

                if (item.kind === "solutions") {
                  return (
                    <SolutionsMegaMenu
                      key={item.label}
                      categories={solutionCategories}
                      active={active}
                    />
                  );
                }

                if (item.kind === "industries") {
                  return (
                    <IndustriesMegaMenu
                      key={item.label}
                      industries={industries}
                      active={active}
                    />
                  );
                }

                if (item.kind === "resources") {
                  return (
                    <ResourcesMegaMenu
                      key={item.label}
                      groups={resourceGroups}
                      active={active}
                    />
                  );
                }

                return (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink
                      asChild
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "text-brand-navy hover:decoration-brand-orange hover:underline hover:underline-offset-8",
                        active &&
                          "bg-white text-[var(--color-ink)] shadow-[0_12px_30px_color-mix(in_srgb,var(--brand-navy)_8%,transparent)]",
                      )}
                    >
                      <Link href={item.href}>{item.label}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden items-center gap-3 text-brand-navy xl:flex">
          <ButtonLink
            href="/book-consultation"
            className="whitespace-nowrap rounded-none bg-[var(--brand-orange)] text-[var(--brand-navy)] shadow-none hover:bg-[var(--brand-orange-hover)]"
          >
            Discuss Your Requirements
          </ButtonLink>
        </div>

        <div className="xl:hidden">
          <MobileNavigationSheet
            open={open}
            setOpen={setOpen}
            navigation={navigation}
            categories={solutionCategories}
            industries={industries}
            resourceGroups={resourceGroups}
            trigger={
              <button
                type="button"
                aria-label="Open menu"
                className={cn(
                  "inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--brand-navy)_8%,transparent)] bg-white",
                  open &&
                    "border-[color:color-mix(in_srgb,var(--brand-navy)_22%,transparent)] text-[var(--color-electric)]",
                )}
              >
                <Menu className="h-5 w-5" />
              </button>
            }
          />
        </div>
      </Container>
    </header>
  );
}
