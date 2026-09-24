import { useState } from "react";
import { Lock } from "lucide-react";
import LevelRewardCard from "../LevelRewardCard/LevelRewardCard.jsx";
import LevelInfo from "../LevelInfo/LevelInfo.jsx";
import ClosedChest from "./ClosedChest.jsx";
import OpenChest from "./OpenChest.jsx";
import CoinRain from "./CoinRain.jsx";
import styles from "./NextLevelReward.module.css";

function NextLevelReward({ nextLevel, reward, progressPct }) {
  // Opens on the first hover and stays open (and raining) from then on —
  // it never reverts to closed, even after the pointer leaves.
  const [revealed, setRevealed] = useState(false);

  return (
    <div
      className={`${styles.card} premiumCard`}
      onMouseEnter={() => setRevealed(true)}
      onFocus={() => setRevealed(true)}
      onClick={() => setRevealed(true)}
    >
      <div className={styles.header}>
        <span className={styles.title}>
          NEXT UNLOCK
          <LevelInfo text="The displayed reward is associated with the next level according to the current reward configuration." />
        </span>
      </div>

      <div className={styles.rewardBlock}>
        <div className={styles.iconWrap}>
          <Lock size={18} />
        </div>
        <LevelRewardCard reward={reward} size="lg" />
      </div>

      <p className={styles.unlockText}>
        Reach Level {String(nextLevel).padStart(2, "0")} to unlock
      </p>

      <div className={`${styles.preview} ${revealed ? styles.revealed : ""}`}>
        <span className={styles.chestGround} aria-hidden="true" />
        <ClosedChest className={`${styles.chestArt} ${styles.chestClosed}`} />
        <OpenChest className={`${styles.chestArt} ${styles.chestOpen}`} />
        <CoinRain />
      </div>

      <div className={styles.progressFooter}>
        <span className={styles.miniLabel}>Progress to Level {String(nextLevel).padStart(2, "0")}</span>
        <span className={styles.miniPct}>{progressPct}%</span>
      </div>
      <div className={styles.miniTrack}>
        <div className={styles.miniFill} style={{ width: `${progressPct}%` }} />
      </div>
    </div>
  );
}

export default NextLevelReward;
