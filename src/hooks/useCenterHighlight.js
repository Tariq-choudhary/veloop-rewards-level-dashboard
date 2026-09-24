import { useEffect } from "react";

/**
 * Mirrors the desktop ".premiumCard:hover h2::after" underline sweep on
 * touch devices, where there is no hover: toggles an "inViewCenter" class
 * on each .premiumCard as it crosses a thin band near the top-center of
 * the viewport (roughly where its heading sits once scrolled into view),
 * via IntersectionObserver's rootMargin trick.
 */
export function useCenterHighlight(active) {
  useEffect(() => {
    if (!active) return;
    if (typeof window === "undefined" || !window.matchMedia("(hover: none)").matches) return;

    const cards = document.querySelectorAll(".premiumCard");
    if (!cards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("inViewCenter", entry.isIntersecting);
        });
      },
      { rootMargin: "-18% 0px -72% 0px", threshold: 0 },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [active]);
}
