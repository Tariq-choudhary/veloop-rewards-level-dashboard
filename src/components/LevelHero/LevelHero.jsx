import { Crown, Info } from "lucide-react";
import CurrentLevel from "../CurrentLevel/CurrentLevel.jsx";
import XPProgress from "../XPProgress/XPProgress.jsx";
import TodaysBoost from "../TodaysBoost/TodaysBoost.jsx";
import SparkleField from "../SparkleField/SparkleField.jsx";
import styles from "./LevelHero.module.css";

function LevelHero({ level, levelName, currentXP, requiredXP, nextLevel, boost, onViewActivity }) {
  return (
    <section className={styles.hero}>
      <div className={`${styles.rewardCard} premiumCard`}>
        <SparkleField count={9} />
        <span className={`${styles.sweep} lightSweep`} aria-hidden="true" />

        <div className={styles.eyebrowRow}>
          <span className={styles.eyebrowIcon} aria-hidden="true">
            <Crown size={13} strokeWidth={2.4} />
          </span>
          <span className={styles.eyebrow}>PLAYER POWER LEVEL</span>
          <Info size={14} className={styles.infoIcon} aria-hidden="true" />
        </div>

        <CurrentLevel level={level} name={levelName} currentXP={currentXP} />
        <div className={styles.progressRow}>
          <XPProgress
            currentXP={currentXP}
            requiredXP={requiredXP}
            nextLevel={nextLevel}
            onViewActivity={onViewActivity}
          />
        </div>
      </div>

      {boost && (
        <div className={`${styles.boostCard} premiumCard`}>
          <TodaysBoost {...boost} />
        </div>
      )}
    </section>
  );
}

export default LevelHero;
