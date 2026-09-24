import { useRef } from "react";
import { Check, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { getBadgeSrc, lockBadgeSrc } from "../../assets/badges/index.js";
import LevelRewardCard from "../LevelRewardCard/LevelRewardCard.jsx";
import { playClick } from "../../utils/audio.js";
import styles from "./LevelRoadmap.module.css";

function statusFor(levelNumber, currentLevel) {
  if (levelNumber < currentLevel) return "completed";
  if (levelNumber === currentLevel) return "current";
  return "locked";
}

// Purely decorative "rarity" tier used for the badge stage's aura/ring
// color — climbs bronze -> silver -> gold -> diamond so later levels read
// as more valuable, independent of the badge artwork's own palette.
function tierFor(levelNumber) {
  if (levelNumber <= 2) return { color: "#c98a52", soft: "rgba(201, 138, 82, 0.35)" };
  if (levelNumber <= 4) return { color: "var(--silver)", soft: "rgba(199, 204, 214, 0.32)" };
  if (levelNumber <= 6) return { color: "var(--gold-strong)", soft: "rgba(8, 145, 178, 0.4)" };
  return { color: "var(--soft-blue)", soft: "rgba(91, 141, 239, 0.35)" };
}

function LevelRoadmap({ roadmap, currentLevel }) {
  const trackRef = useRef(null);

  const slide = (dir) => {
    playClick();
    trackRef.current?.scrollBy({ left: dir * 260, behavior: "smooth" });
  };

  return (
    <div className={`${styles.card} premiumCard`}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>Level Progression</h2>
          <p className={styles.subtitle}>Current, upcoming, and future levels</p>
        </div>
        <div className={styles.arrowRow}>
          <button type="button" className={styles.arrowBtn} aria-label="Scroll left" onClick={() => slide(-1)}>
            <ChevronLeft size={16} />
          </button>
          <button type="button" className={styles.arrowBtn} aria-label="Scroll right" onClick={() => slide(1)}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className={styles.track} ref={trackRef}>
        {roadmap.map((item, i) => {
          const status = statusFor(item.level, currentLevel);
          const locked = status === "locked";
          const tier = tierFor(item.level);
          const connectorFilled = item.level < currentLevel;

          return (
            <div
              key={item.level}
              className={`${styles.step} ${styles[status]}`}
              style={{ "--tier-color": tier.color, "--tier-soft": tier.soft }}
              data-connector={i < roadmap.length - 1 ? (connectorFilled ? "filled" : "empty") : undefined}
            >
              {status === "current" && (
                <span className={styles.hereTag}>
                  <Sparkles size={11} strokeWidth={2.4} />
                  You are here
                </span>
              )}
              <div className={styles.badgeStage}>
                <span className={styles.aura} aria-hidden="true" />
                <img
                  className={`${styles.badge} badge3d`}
                  data-locked={locked}
                  src={getBadgeSrc(item.level)}
                  alt={`Level ${String(item.level).padStart(2, "0")}`}
                />
                {status === "completed" && (
                  <span className={styles.checkBadge} aria-hidden="true">
                    <Check size={11} strokeWidth={3} />
                  </span>
                )}
                {locked && (
                  <img className={styles.lock} src={lockBadgeSrc} alt="" aria-hidden="true" />
                )}
              </div>
              <div className={styles.levelLabel}>
                Level {String(item.level).padStart(2, "0")}
              </div>
              <div className={styles.levelName}>{item.name}</div>
              <LevelRewardCard reward={item.reward} size="sm" locked={locked} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LevelRoadmap;
