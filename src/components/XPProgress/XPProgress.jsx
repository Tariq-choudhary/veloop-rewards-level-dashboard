import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { playClick } from "../../utils/audio.js";
import styles from "./XPProgress.module.css";

/** Animated XP bar: fills from 0 to the real percentage on mount/update. */
function XPProgress({
  currentXP,
  requiredXP,
  nextLevel,
  onViewActivity,
}) {
  const targetPct = Math.min(
    100,
    Math.round((currentXP / requiredXP) * 100)
  );

  const [pct, setPct] = useState(0);

  const remaining = Math.max(
    0,
    requiredXP - currentXP
  );

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setPct(targetPct);
    });

    return () => cancelAnimationFrame(id);
  }, [targetPct]);

  return (
    <div className={styles.wrap}>

      {/* XP percentage indicator */}
      <div
        className={styles.tick}
        style={{
          left: `clamp(18px, ${pct}%, calc(100% - 18px))`,
        }}
      >
        <span>{pct}%</span>

        <div
          className={styles.tickArrow}
          aria-hidden="true"
        />
      </div>

      {/* XP progress bar */}
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={targetPct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="XP progress"
      >
        <div
          className={styles.fill}
          style={{ width: `${pct}%` }}
        >
          <span
            className={styles.fillClip}
            aria-hidden="true"
          >
            <span className={styles.fillShine} />
          </span>

          {pct > 0 && (
            <span
              className={styles.fillEdge}
              aria-hidden="true"
            />
          )}
        </div>
      </div>

      {/* XP information + activity button */}
      <div className={styles.footerRow}>

        <span className={styles.remaining}>
          {remaining > 0 ? (
            <>
              <strong>
                {remaining.toLocaleString()} XP
              </strong>{" "}
              needed for level{" "}
              <span className={styles.nextLevel}>
                {String(nextLevel).padStart(2, "0")}
              </span>
            </>
          ) : (
            "Ready to level up!"
          )}
        </span>

        {onViewActivity && (
          <button
            type="button"
            className={styles.activityLink}
            onClick={() => {
              playClick();
              onViewActivity();
            }}
          >
            View Activity

            <ChevronRight
              size={13}
              strokeWidth={2.6}
            />
          </button>
        )}
      </div>
    </div>
  );
}

export default XPProgress;