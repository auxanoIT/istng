"use client";

import { useState, type CSSProperties } from "react";
import Link from "@/components/ui/site-link";
import { ArrowUpRight } from "lucide-react";
import { homeServicePillars } from "@/data/home-service-pillars";
import { journeyProjects, projectStages } from "@/data/project-journey";
import styles from "./project-journey.module.css";

const stageViews = [
  { position: "27%", brightness: 0.82 },
  { position: "36%", brightness: 0.9 },
  { position: "45%", brightness: 1 },
  { position: "56%", brightness: 0.95 },
  { position: "64%", brightness: 1 },
  { position: "72%", brightness: 0.88 },
];

export function ProjectJourney() {
  const [projectIndex, setProjectIndex] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const project = journeyProjects[projectIndex];
  const stage = project.stages[stageIndex];
  const view = stageViews[stageIndex];
  const serviceHref = homeServicePillars.items.find((item) => item.id === project.serviceId)?.ctaHref
    ?? "/solutions";
  const stageNumber = String(stageIndex + 1).padStart(2, "0");

  return (
    <section id="the-project-journey" className={styles.section} aria-labelledby="project-journey-title">
      <span id="the-integrated-standard" className={styles.legacyAnchor} aria-hidden="true" />
      <header data-section-heading className={styles.header}>
        <h2 id="project-journey-title">See How Your Project Takes Shape.</h2>
        <p className={styles.intro}>From the first site visit to ongoing support, see what happens at every stage.</p>
      </header>

      <div className={styles.explorer}>
        <div className={styles.projects} role="group" aria-label="Project type">
          {journeyProjects.map((item, index) => (
            <button
              key={item.serviceId}
              type="button"
              aria-pressed={index === projectIndex}
              aria-controls="project-journey-details"
              onClick={() => {
                if (index === projectIndex) return;
                setProjectIndex(index);
                setStageIndex(0);
              }}
            >
              {item.title}
            </button>
          ))}
        </div>

        <div className={styles.scene}>
          <div className={styles.art} aria-hidden="true">
            {journeyProjects.map((item, index) => (
              <div
                key={item.serviceId}
                className={styles.image}
                data-active={index === projectIndex}
                style={{
                  "--journey-image": `url("${item.image}")`,
                  "--journey-position": view.position,
                  "--journey-brightness": view.brightness,
                } as CSSProperties}
              />
            ))}
          </div>

          <div className={styles.stages} role="group" aria-label="Delivery stage">
            {projectStages.map((name, index) => (
              <button
                key={name}
                type="button"
                aria-pressed={index === stageIndex}
                aria-controls="project-journey-details"
                onClick={() => setStageIndex(index)}
              >
                <span className={styles.dot} aria-hidden="true" />
                <span className={styles.stageNumber} aria-hidden="true">0{index + 1}</span>
                <span>{name}</span>
              </button>
            ))}
          </div>

          <article id="project-journey-details" className={styles.card} aria-live="polite" aria-atomic="true">
            <div key={`${projectIndex}-${stageIndex}`} className={styles.cardCopy}>
              <p className={styles.eyebrow}>{stageNumber} / 06 · {projectStages[stageIndex]}</p>
              <h3>{stage.heading}</h3>
              <p className={styles.description}>{stage.description}</p>
            </div>
            <Link href={serviceHref} className={styles.cta}>
              {project.cta}
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
