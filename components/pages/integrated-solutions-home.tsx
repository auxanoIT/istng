import Image from "next/image";
import { EnergyHero } from "./energy-hero";

import { Container } from "@/components/ui/container";

export function IntegratedSolutionsHome() {
  return (
    <div className="integrated-home-opening">
      <EnergyHero />
      <section className="integrated-hero-intro" aria-labelledby="integrated-intro-title">
        <div className="integrated-hero-intro__image">
          <Image
            src="/integrated-assets/images/nigerian-energy-engineer.webp"
            alt="Nigerian engineer checking a commercial battery storage system on a tablet"
            fill
            sizes="(min-width: 768px) 65vw, 100vw"
            className="object-cover"
          />
        </div>
        <Container className="relative">
          <div className="integrated-hero-intro__copy">
            <p className="integrated-hero-intro__eyebrow">WHAT WE DELIVER</p>
            <h2 id="integrated-intro-title">
              The Engineering Behind Reliable Energy & Connected Infrastructure.
            </h2>
            <p className="integrated-hero-intro__description">
              Integrated Solutions Technology designs, installs and maintains
              solar power systems, battery storage, IT infrastructure and data
              centre solutions for homes, businesses and institutions. We
              deliver reliable, efficient solutions tailored to each customer&apos;s
              needs, with professional support for long-term performance.
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}
