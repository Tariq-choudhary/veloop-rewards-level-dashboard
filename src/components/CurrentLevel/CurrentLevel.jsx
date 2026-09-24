import { getBadgeSrc } from "../../assets/badges/index.js";
import styles from "./CurrentLevel.module.css";

/** Winged level badge + XP total, shown at the top of the reward card. */
function CurrentLevel({ level, name, currentXP }) {
  return (
    <div className={styles.row}>
      <div className={styles.badgeStage}>
        <span className={styles.badgeGlow} aria-hidden="true" />
        <img
          className={`${styles.badge} badge3d`}
          src={getBadgeSrc(level)}
          alt={`Level ${String(level).padStart(2, "0")} badge`}
        />
        <span className={styles.badgeShadow} aria-hidden="true" />
      </div>
      <div className={styles.textCol}>
        <span className={styles.name}>
          Level {String(level).padStart(2, "0")} · {name}
        </span>
        <span className={styles.xp}>{currentXP.toLocaleString()}XP</span>
      </div>
    </div>
  );
}

export default CurrentLevel;
