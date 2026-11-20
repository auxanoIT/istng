import { ArrowRight } from "lucide-react";
import Image from "@/components/ui/site-image";
import Link from "@/components/ui/site-link";
import { Container } from "@/components/ui/container";
import { JsonLd } from "@/components/ui/json-ld";
import { serviceDirectory } from "@/data/service-directory";
import { absoluteUrl } from "@/lib/utils";
import styles from "./services-directory.module.css";

export function ServicesDirectory() {
  return (
    <div className={styles.page}>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Solar energy and technology services",
        url: absoluteUrl("/services"),
        itemListElement: serviceDirectory.map((service, index) => ({
          "@type": "ListItem", position: index + 1, name: service.label, url: absoluteUrl(service.href),
        })),
      }} />
      <Container>
        <header className={styles.intro}>
          <h1>Energy That Powers You.<br />Technology That Connects You.</h1>
          <p>Explore our solar energy and technology services.</p>
        </header>
        <div className={styles.rows}>
          {serviceDirectory.map((service, index) => (
            <section key={service.slug} aria-labelledby={`directory-${service.slug}`} className={styles.row}>
              <figure className={styles.photo}>
                <Image src={service.image.src} alt={service.image.alt} fill preload={index === 0} sizes="(min-width: 1280px) 568px, (min-width: 768px) 45vw, 100vw" className={styles.image} style={{ objectPosition: service.image.objectPosition }} />
              </figure>
              <div className={styles.copy}>
                <h2 id={`directory-${service.slug}`}>{service.label}</h2>
                <p>{service.description}</p>
                <Link className={styles.link} href={service.href} aria-label={`Explore ${service.label}`}>
                  Explore solutions <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
            </section>
          ))}
        </div>
      </Container>
      <section aria-labelledby="directory-consultation" className={styles.consultation}>
        <Container>
          <h2 id="directory-consultation">Let’s find the right solution for your project.</h2>
          <Link href="/book-consultation" className={styles.consultationLink}>Discuss your requirements <ArrowRight size={18} aria-hidden="true" /></Link>
        </Container>
      </section>
    </div>
  );
}
