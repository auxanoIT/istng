"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { ResourceProjectCard, resourceIcons } from "@/components/resources/resource-menu-content";
import type { ResourceGroup } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ResourcesMegaMenu({ groups, active = false }: { groups: ResourceGroup[]; active?: boolean }) {
  return <NavigationMenuItem>
    <NavigationMenuTrigger className={cn("text-[var(--color-muted)]", active && "bg-white text-brand-navy shadow-sm")}>Resources</NavigationMenuTrigger>
    <NavigationMenuContent className="fixed inset-x-0 top-20 mt-0 w-full">
      <div className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-y border-brand-border bg-white shadow-lg">
        <Container className="grid grid-cols-2 gap-x-12 gap-y-7 py-8 xl:grid-cols-[1fr_1fr_1fr_1.2fr]">
          {groups.map(group => <div key={group.id}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand-support">{group.label}</p>
            <ul className="space-y-1">{group.links.map(link => {
              const Icon = resourceIcons[link.id as keyof typeof resourceIcons];
              return <li key={link.id}><NavigationMenuLink asChild>
                <Link href={link.href} className="group flex min-h-11 items-center gap-3 rounded-md px-2 text-sm font-semibold text-brand-navy hover:bg-brand-surface">
                  {Icon && <Icon className="size-4 shrink-0 text-[var(--brand-orange-text)]" aria-hidden />}
                  <span>{link.label}</span>
                  <ArrowUpRight className="ml-auto size-3.5 shrink-0 opacity-0 transition group-hover:opacity-100" aria-hidden />
                </Link>
              </NavigationMenuLink></li>;
            })}</ul>
          </div>)}
          <ResourceProjectCard compact />
        </Container>
      </div>
    </NavigationMenuContent>
  </NavigationMenuItem>;
}
