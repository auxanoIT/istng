import Link from "@/components/ui/site-link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  className?: string;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 max-w-full items-center justify-center rounded-full px-5 py-3 text-center text-sm font-semibold leading-snug transition duration-200 motion-reduce:transition-none",
        variant === "primary" &&
          "bg-[var(--brand-orange)] text-[var(--brand-navy)] shadow-[0_8px_24px_color-mix(in_srgb,var(--brand-navy)_12%,transparent)] hover:bg-[var(--brand-orange-hover)]",
        variant === "secondary" &&
          "border border-brand-navy bg-brand-navy text-white hover:bg-brand-support",
        variant === "outline" &&
          "border border-brand-navy bg-transparent text-brand-navy hover:bg-brand-surface",
        variant === "ghost" &&
          "text-[var(--color-ink)] hover:bg-[color:color-mix(in_srgb,var(--brand-navy)_4%,transparent)]",
        className,
      )}
    >
      {children}
    </Link>
  );
}
