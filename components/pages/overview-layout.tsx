import Image from "@/components/ui/site-image";
import type { ReactNode } from "react";

import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import type { ServiceNavMedia } from "@/lib/types";
import { cn } from "@/lib/utils";

export type OverviewCopy = { title: string; eyebrow?: string; paragraphs: string[] };
export type OverviewAction = { href: string; label: string };

export function OverviewParagraphs({ paragraphs, className }: { paragraphs: string[]; className?: string }) {
  if (!paragraphs.length) return null;
  return (
    <div className={cn("space-y-3 text-sm leading-relaxed sm:text-base", className)}>
      {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    </div>
  );
}

export function OverviewHeading({ copy, id, align = "center", inverse = false }: {
  copy: OverviewCopy;
  id?: string;
  align?: "left" | "center";
  inverse?: boolean;
}) {
  return (
    <div className={cn(align === "center" && "mx-auto max-w-3xl text-center")}>
      {copy.eyebrow && (
        <p className={cn("mb-3 text-xs font-semibold tracking-[.16em]", inverse ? "text-brand-orange" : "text-brand-muted")}>
          {copy.eyebrow}
        </p>
      )}
      <h2 id={id} className="text-balance text-2xl font-semibold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
        {copy.title}
      </h2>
      <OverviewParagraphs paragraphs={copy.paragraphs} className={cn("mt-4", inverse ? "text-slate-200" : "text-brand-support")} />
    </div>
  );
}

export function OverviewSection({ id, children, tone = "white" }: {
  id: string;
  children: ReactNode;
  tone?: "white" | "warm" | "navy";
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn(
      "scroll-mt-24 py-14 sm:py-20",
      tone === "navy" ? "bg-brand-navy text-white" : "text-brand-navy",
      tone === "white" && "bg-white",
      tone === "warm" && "bg-brand-soft-white",
    )}>
      <Container>{children}</Container>
    </section>
  );
}

export function OverviewBanner({ copy, image, actions = [], hero = false, fadeToNavy = false }: {
  copy: OverviewCopy;
  image: ServiceNavMedia;
  actions?: OverviewAction[];
  hero?: boolean;
  fadeToNavy?: boolean;
}) {
  const Heading = hero ? "h1" : "h2";
  const headingId = hero ? "overview-title" : "overview-closing-title";
  return (
    <section aria-labelledby={headingId} className="relative isolate overflow-hidden bg-brand-navy text-white">
      <Image src={image.src} alt={hero ? image.alt : ""} fill sizes="100vw" preload={hero} className="object-cover" style={{ objectPosition: image.objectPosition }} />
      <div className={cn(
        "absolute inset-0 bg-linear-to-b",
        fadeToNavy
          ? "from-brand-navy/45 via-brand-navy/75 via-65% to-brand-navy"
          : "from-brand-navy/70 via-brand-navy/80 to-brand-navy/80",
      )} />
      <Container className={cn(
        "relative flex flex-col items-center justify-center py-16 text-center sm:py-24",
        hero && "min-h-[31rem] lg:min-h-[36rem]",
        fadeToNavy && "pb-24 lg:pb-32",
      )}>
        {copy.eyebrow && <p className="mb-5 border-b-2 border-brand-orange pb-3 text-xs font-semibold tracking-[.16em]">{copy.eyebrow}</p>}
        <Heading id={headingId} className={cn(
          "max-w-4xl text-balance font-semibold leading-[1.12] tracking-tight",
          hero ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl lg:text-5xl",
        )}>
          {copy.title}
        </Heading>
        <OverviewParagraphs paragraphs={copy.paragraphs} className="mt-5 max-w-3xl text-slate-100" />
        {actions.length > 0 && (
          <div className="mt-7 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
            {actions.map(({ label, href }, index) => (
              <ButtonLink key={label} href={href} variant={index === 0 ? "primary" : "outline"} className={cn(
                "w-full rounded-md shadow-none sm:w-auto",
                index > 0 && "border-white/70 text-white hover:bg-white/15",
              )}>{label}</ButtonLink>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
