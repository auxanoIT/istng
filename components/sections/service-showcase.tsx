"use client";

import Image from "next/image";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Fragment, useId, useState, type CSSProperties } from "react";

import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import type { ServiceShowcaseSection } from "@/lib/types";
import styles from "./service-showcase.module.css";

export function ServiceShowcase({ section }: { section: ServiceShowcaseSection }) {
  const sectionId = useId();
  const [selectedId, setSelectedId] = useState(section.items[0]?.id);

  if (!section.items.length) return null;

  const activeId = section.items.find((item) => item.id === selectedId)?.id ?? section.items[0].id;

  return (
    <section
      id="data-centre-infrastructure-services"
      className={styles.section}
      aria-labelledby={`${sectionId}-heading`}
    >
      <Container>
        <div data-section-heading className={styles.heading}>
          <h2 id={`${sectionId}-heading`}>{section.title}</h2>
          {section.description && <p className={styles.intro}>{section.description}</p>}
        </div>
        <div
          className={styles.explorer}
          style={{ "--service-count": section.items.length } as CSSProperties}
        >
          {section.items.map((item, index) => {
            const active = item.id === activeId;
            const buttonId = `${sectionId}-service-${index}`;
            const panelId = `${sectionId}-panel-${index}`;

            return (
              <Fragment key={item.id}>
                <button
                  id={buttonId}
                  type="button"
                  className={styles.service}
                  aria-expanded={active}
                  aria-controls={panelId}
                  onClick={() => setSelectedId(item.id)}
                >
                  <span className={styles.number} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{item.title}</span>
                  <ChevronRight className={styles.chevron} size={20} aria-hidden="true" />
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  inert={!active}
                  data-active={active}
                  className={styles.panel}
                >
                  <div className={styles.visual}>
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      fill
                      sizes="(min-width: 1280px) 760px, (min-width: 768px) 60vw, 95vw"
                      className={styles.image}
                    />
                  </div>
                  <div className={styles.content}>
                    <h3>{item.lead ?? item.title}</h3>
                    <p>{item.description}</p>
                    <ButtonLink href={item.ctaHref} className="gap-3 rounded-sm shadow-none">
                      {item.ctaLabel}
                      <ArrowRight size={18} className="shrink-0" aria-hidden="true" />
                    </ButtonLink>
                  </div>
                </div>
              </Fragment>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
