import { useMemo } from "react";

const COLORS = ["#f0c14b", "#9b6bf2", "#3ddc8a", "#5b8def", "#ffffff"];

/**
 * Lightweight celebratory confetti burst — pure CSS animation, no
 * dependency. Drop it inside any `position: relative` container; it fills
 * that container and animates once on mount (re-mount via `key` to replay).
 */
function Confetti({ count = 24 }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.4,
        duration: 1.4 + Math.random() * 0.8,
        color: COLORS[i % COLORS.length],
        rotate: Math.random() * 360,
      })),
    [count],
  );

  return (
    <div className="confettiField" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confettiPiece"
          style={{
            left: `${p.left}%`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export default Confetti;
