import Link from "@/components/ui/site-link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";

export function ResourceIntro({ title, heading, description }: { title: string; heading: string; description: string }) {
  return <header className="bg-brand-navy py-16 text-white sm:py-24">
    <Container>
      <nav aria-label="Breadcrumb"><Link href="/resources" className="text-sm font-semibold text-brand-orange underline-offset-4 hover:underline">← All resources</Link></nav>
      <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-white/75">{title}</p>
      <h1 className="mt-4 max-w-4xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl">{heading}</h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">{description}</p>
    </Container>
  </header>;
}

export function ResourceEmpty({ message }: { message: string }) {
  return <div className="rounded-xl border border-brand-border bg-white p-6 sm:p-10">
    <p className="text-brand-support">{message}</p>
    <Link href="/book-consultation" className="mt-4 inline-flex items-center gap-2 font-semibold text-brand-navy underline decoration-brand-orange underline-offset-4">Book a technical consultation <ArrowRight className="size-4" aria-hidden /></Link>
  </div>;
}
