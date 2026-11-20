"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./about-motion.module.css";

export function AboutMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const page = root.current;
    if (!page || !("IntersectionObserver" in window)) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sections = Array.from(page.querySelectorAll<HTMLElement>(":scope > section, :scope > #about-trust > section")).slice(1);
    let observer: IntersectionObserver | undefined;

    function reset() {
      observer?.disconnect();
      sections.forEach(section => section.removeAttribute("data-about-reveal"));
    }

    function start() {
      reset();
      if (preference.matches) return;
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.aboutReveal = "visible";
          observer?.unobserve(entry.target);
        }
      }, { rootMargin: "0px 0px -24px 0px", threshold: 0.04 });

      for (const section of sections) {
        // Keep the hero, restored scroll positions and already-visible content stable.
        if (section.getBoundingClientRect().top < window.innerHeight - 24) {
          section.dataset.aboutReveal = "settled";
        } else {
          section.dataset.aboutReveal = "pending";
          observer.observe(section);
        }
      }
    }

    start();
    preference.addEventListener("change", start);
    return () => {
      reset();
      preference.removeEventListener("change", start);
    };
  }, []);

  return <div ref={root} className={styles.page}>{children}</div>;
}
