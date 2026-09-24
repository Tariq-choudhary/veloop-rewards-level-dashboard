import { useMemo } from "react";

/**
 * Ambient twinkling sparkle particles — a persistent, low-key light
 * texture (distinct from Confetti's one-shot celebration burst). Drop it
 * inside any `position: relative; overflow: hidden` container.
 */
function SparkleField({ count = 14 }) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 2 + Math.random() * 3,
        delay: Math.random() * 2.6,
        duration: 2 + Math.random() * 1.6,
      })),
    [count],
  );

  return (
    <div className="sparkleField" aria-hidden="true">
      {dots.map((d) => (
        <span
          key={d.id}
          className="sparkleDot"
          style={{
            top: `${d.top}%`,
            left: `${d.left}%`,
            width: `${d.size}px`,
            height: `${d.size}px`,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export default SparkleField;
