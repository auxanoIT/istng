import Image from "@/components/ui/site-image";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

import { Container } from "@/components/ui/container";
import styles from "./value-we-deliver.module.css";

const imageDirectory = "/image/value-we-deliver";

const outcomes = [
  {
    title: "Take Control of Energy Costs",
    headline: "Spend Less on Power. Invest More in What Matters.",
    paragraphs: [
      "Rising electricity and generator costs can place pressure on household and business budgets.",
      "With properly designed solar energy and battery storage systems, you can reduce dependence on fuel-powered generation and better manage ongoing energy expenses.",
      "This means less reliance on generator fuel, more efficient use of solar energy and greater confidence when planning your energy expenses.",
    ],
    image: "solar",
    alt: "Engineer checking a solar installation on a rooftop terrace",
    cta: "Explore Solar Energy Solutions",
    href: "/#data-centre-infrastructure-services",
  },
  {
    title: "Keep Operations Moving",
    headline: "Reliable Power for the Moments That Matter.",
    paragraphs: [
      "From household essentials to business equipment, power interruptions can disrupt important activities.",
      "We help customers plan energy and backup systems around their essential electricity requirements, supporting greater continuity and everyday convenience.",
      "The result is better power availability for essential appliances and equipment, helping you minimise interruptions to daily activities.",
    ],
    image: "backup",
    alt: "Battery storage cabinets beside an occupied workspace",
    cta: "Explore Backup Power Solutions",
    href: "/solutions/business-energy",
  },
  {
    title: "Build Connected Infrastructure",
    headline: "Technology That Works Together, Not in Isolation.",
    paragraphs: [
      "Reliable energy is only one part of an effective operating environment.",
      "Our networking, server, storage and infrastructure solutions help businesses build organised technology environments that support connectivity, collaboration and efficient operations.",
      "This creates a more connected and manageable technology environment that supports daily operations, maintenance and future expansion.",
    ],
    image: "infrastructure",
    alt: "Server racks connected by organised overhead cabling",
    cta: "Explore Enterprise Technology",
    href: "/solutions/enterprise-it",
  },
  {
    title: "Plan for Long-Term Performance",
    headline: "Solutions Designed for Today. Ready for Tomorrow.",
    paragraphs: [
      "A good infrastructure investment should consider more than immediate requirements.",
      "We approach system design with attention to equipment compatibility, maintainability, changing energy needs and future growth.",
      "By planning around your current requirements and future needs, we help you make informed technology investments that remain practical as your operations evolve.",
    ],
    image: "planning",
    alt: "Colleagues reviewing architectural plans around a table",
    cta: "Discuss Your Requirements",
    href: "/book-consultation#project-enquiry",
  },
];

export function ValueWeDeliver() {
  return (
    <section className={styles.section} id="the-value-we-deliver" aria-labelledby="value-we-deliver-title">
      <Container data-section-heading className={styles.header}>
        <h2 id="value-we-deliver-title">Smarter Energy. Stronger Operations. Greater Possibilities.</h2>
        <p className={styles.intro}>
          The right energy and technology solutions do more than meet immediate needs.
          They help reduce operating costs, improve reliability and give homes and businesses
          greater control over the systems they depend on.
        </p>
      </Container>
      <div className={styles.feature}>
        <div className={styles.panorama}>
          <Image
            src={`${imageDirectory}/facility.webp`}
            alt="Architectural illustration of a Lagos business facility with a solar array, battery room, server racks and a planning office"
            fill
            sizes="(min-width: 1536px) 1536px, 100vw"
          />
          <div className={styles.zones} aria-hidden="true">
            {outcomes.map(({ image }) => <span key={image} />)}
          </div>
        </div>
        <div className={styles.outcomes}>
          {outcomes.map(({ title, headline, paragraphs, image, alt, cta, href }) => (
            <article className={styles.outcome} key={image}>
              <div className={styles.closeup}>
                <Image src={`${imageDirectory}/${image}.webp`} alt={alt} fill sizes="100vw" />
              </div>
              <div className={styles.copy}>
                <h3>{title}</h3>
                <p className={styles.headline}>{headline}</p>
                <p>{paragraphs[0]}</p>
                <details className={styles.details}>
                  <summary aria-label={`Read more about ${title}`}>
                    <span className={styles.more}>Read more</span>
                    <span className={styles.less}>Read less</span>
                    <ChevronDown size={16} aria-hidden="true" />
                  </summary>
                  {paragraphs.slice(1).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </details>
                <Link href={href} className={styles.cta}>
                  <span>{cta}</span>
                  <ArrowRight size={19} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
