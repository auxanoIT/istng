export function scrollToOverviewButton(button: HTMLButtonElement) {
  if (window.matchMedia("(min-width: 64rem)").matches) return;

  // Wait for the newly selected content to expand and the previous panel to close.
  requestAnimationFrame(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    button.scrollIntoView({ block: "start", behavior: reducedMotion ? "instant" : "smooth" });
  });
}
