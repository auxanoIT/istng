import Link from "next/link";
import { Container } from "@/components/ui/container";
import { WorkGallery } from "@/components/sections/work-gallery";
import { getWorkGallery } from "@/lib/work-gallery";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";

// Request-driven refresh for sites whose Sanity webhook has not yet been updated.
export const revalidate = 60;
export const metadata = buildMetadata({
  title: "Our Work | Integrated Solutions Technology Photo Gallery",
  description: "Explore Integrated Solutions Technology solar panel, inverter and battery installation photographs in our project gallery.",
  path: "/resources/our-work",
  imagePath: "/image/case-studies/integrated/solar-panel-installation-team.webp",
  imageAlt: "Installers positioning solar panels on a rooftop",
});

export default async function OurWorkPage() {
  const albums = await getWorkGallery();
  const structuredData = {
    "@context": "https://schema.org", "@type": "ImageGallery",
    name: "Integrated Solutions Technology — Our Work", url: absoluteUrl("/resources/our-work"),
    description: "Solar panel, inverter and battery installation photographs supplied by Integrated Solutions Technology.",
    image: albums.map(album => ({ "@type": "ImageObject", contentUrl: absoluteUrl(album.photos[0].src), caption: album.photos[0].alt })),
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <section className="bg-[var(--brand-white)] pb-12 pt-16 sm:pb-16 sm:pt-24">
      <Container>
        <h1 className="max-w-4xl text-5xl font-semibold leading-[1.08] tracking-tight text-[var(--brand-navy)] sm:text-7xl">Our team.<br />Onsite. <span className="text-[var(--brand-orange-text)]">At work.</span></h1>
        <p className="mt-7 max-w-2xl text-base leading-8 text-[var(--color-muted)] sm:text-lg">A look behind the work. Real moments from our team delivering, installing and supporting the infrastructure our clients depend on.</p>
      </Container>
    </section>
    <section aria-label="Our work photo albums" className="bg-[var(--brand-white)] pb-20 sm:pb-28"><Container><WorkGallery albums={albums} /></Container></section>
    <section className="border-t border-black/10 py-12"><Container className="flex flex-wrap items-center justify-between gap-5"><p className="text-lg">Want the story behind our projects?</p><Link href="/resources/case-studies" className="font-semibold underline decoration-[var(--brand-orange)] decoration-2 underline-offset-8">Explore our case studies →</Link></Container></section>
  </>;
}
