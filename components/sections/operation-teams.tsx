"use client";

import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { useEffect, useRef } from "react";

import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { operationTeams } from "@/data/operation-teams";
import styles from "./operation-teams.module.css";

const cablePath = "M 500 0 C 500 25 750 12 750 49 C 750 90 500 73 500 100";
const chapterColors = ["#fff1e1", "#ffe3cc", "#d8e9f4", "#e1eddf", "#d5e3f3"];
const clampProgress = (value: number) => Math.min(1, Math.max(0, value));

export function OperationTeams() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const section = sectionRef.current;

    const waypoints = Array.from(section.querySelectorAll<HTMLElement>("[data-waypoint]"));
    const segments = Array.from(section.querySelectorAll<HTMLElement>("[data-cable-segment]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    function paint() {
      frame = 0;
      const readingLine = window.innerHeight * 0.58;
      const stops = waypoints.map((waypoint) => {
        const { top, height } = waypoint.getBoundingClientRect();
        return top + height / 2;
      });
      const bounds = segments.map((segment) => segment.getBoundingClientRect());
      const nextStop = stops.findIndex((position) => position > readingLine);
      const from = nextStop === -1 ? stops.length - 1 : Math.max(0, nextStop - 1);
      const to = Math.max(from, nextStop);
      const blend = from === to ? 0 : clampProgress((readingLine - stops[from]) / (stops[to] - stops[from]));

      section.style.setProperty(
        "--journey-wash",
        `color-mix(in srgb, ${chapterColors[from]}, ${chapterColors[to]} ${(blend * 100).toFixed(2)}%)`,
      );
      segments.forEach((segment, index) => {
        const { top, height } = bounds[index];
        const fill = height ? clampProgress((readingLine - top) / height) : 0;
        segment.style.setProperty("--cable-fill", fill.toFixed(4));
      });
      waypoints.forEach((waypoint, index) => {
        waypoint.toggleAttribute("data-reached", stops[index] <= readingLine);
      });
    }

    function schedulePaint() {
      if (!frame) frame = requestAnimationFrame(paint);
    }

    const observer = new ResizeObserver(schedulePaint);
    function syncMotion() {
      cancelAnimationFrame(frame);
      frame = 0;
      window.removeEventListener("scroll", schedulePaint);
      observer.disconnect();
      if (reducedMotion.matches) {
        section.removeAttribute("data-scroll-motion");
        section.style.removeProperty("--journey-wash");
        return;
      }
      paint();
      section.setAttribute("data-scroll-motion", "");
      window.addEventListener("scroll", schedulePaint, { passive: true });
      observer.observe(section);
      observer.observe(document.body);
    }

    syncMotion();
    reducedMotion.addEventListener("change", syncMotion);
    return () => {
      reducedMotion.removeEventListener("change", syncMotion);
      window.removeEventListener("scroll", schedulePaint);
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      id="built-around-your-operation"
      aria-labelledby="operation-journey-title"
    >
      <Container>
        <header data-section-heading className={styles.header}>
          <h2 id="operation-journey-title">Different Needs. The Right Solutions for Every Environment.</h2>
          <p className={styles.intro}>
            Every home, business and institution has unique energy and technology requirements.
            We deliver solutions tailored to how you live, work and operate.
          </p>
        </header>

        <ol className={styles.journey} role="list">
          {operationTeams.map((stop, index) => (
            <li className={styles.stop} key={stop.id}>
              <article className={styles.chapter} aria-labelledby={`journey-${stop.id}`}>
                <div className={styles.waypoint} aria-hidden="true">
                  <div className={styles.cableStem} data-cable-segment />
                  <span data-waypoint>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className={styles.visual}>
                  <Image
                    src={`/image/operation-teams/${stop.image}`}
                    alt={stop.alt}
                    width={720}
                    height={360}
                    sizes="(min-width: 1280px) 550px, (min-width: 900px) 45vw, 90vw"
                    className={styles.image}
                  />
                </div>
                <div className={styles.copy}>
                  <p className={styles.audience}>{stop.label}</p>
                  <h3 id={`journey-${stop.id}`}>{stop.headline}</h3>
                  {stop.paragraphs.map((paragraph) => <p className={styles.description} key={paragraph}>{paragraph}</p>)}
                  <p className={styles.benefitLabel}>Key Benefits</p>
                  <ul className={styles.benefits}>
                    {stop.benefits.map((benefit) => (
                      <li key={benefit}><Check size={16} aria-hidden="true" /><span>{benefit}</span></li>
                    ))}
                  </ul>
                  <ButtonLink href={stop.href} className="mt-6 gap-3 rounded-md shadow-none">
                    {stop.cta}
                    <ArrowRight size={17} className="shrink-0" aria-hidden="true" />
                  </ButtonLink>
                </div>
              </article>
              {index < operationTeams.length - 1 && (
                <div className={styles.connector} data-cable-segment aria-hidden="true">
                  <svg viewBox="0 0 1000 100" preserveAspectRatio="none" focusable="false">
                    <path className={styles.cableJacket} d={cablePath} vectorEffect="non-scaling-stroke" />
                    <path className={styles.cableCore} d={cablePath} vectorEffect="non-scaling-stroke" />
                    <path className={styles.cableCurrent} d={cablePath} pathLength="1" vectorEffect="non-scaling-stroke" />
                  </svg>
                </div>
              )}
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
