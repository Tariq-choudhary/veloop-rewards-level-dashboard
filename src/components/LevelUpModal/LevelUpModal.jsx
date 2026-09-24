import { useEffect } from "react";
import { Sparkles } from "lucide-react";
import Confetti from "../Confetti/Confetti.jsx";
import SparkleField from "../SparkleField/SparkleField.jsx";
import LevelRewardCard from "../LevelRewardCard/LevelRewardCard.jsx";
import { playLevelUp, playClick } from "../../utils/audio.js";
import styles from "./LevelUpModal.module.css";

/**
 * Level-up celebration. `rewards` is an array so a future backend can
 * award more than one reward type (e.g. VEs + Gems) at once without any
 * change here; `perks` is the short list of what the new level unlocks.
 */
function LevelUpModal({ level, levelName, rewards, perks, onContinue }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onContinue();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onContinue]);

  useEffect(() => {
    playLevelUp();
  }, []);

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <SparkleField count={16} />
        <Confetti count={30} />

        <p className={styles.eyebrow}>RANK UP!</p>
        <p className={styles.reached}>You&apos;ve reached</p>

        <div className={styles.pedestalWrap}>
          <span className={styles.pedestalGlow} aria-hidden="true" />
          <div className={`${styles.hex} glowPulse`}>
            <div className={styles.hexInner}>
              <span className="lightSweep" aria-hidden="true" />
              <span className={styles.hexLabel}>LEVEL</span>
              <span className={styles.hexValue}>{String(level).padStart(2, "0")}</span>
            </div>
          </div>
          <span className={styles.pedestalBase} aria-hidden="true" />
        </div>

        <p className={styles.name}>{levelName}</p>

        {rewards && rewards.length > 0 && (
          <div className={styles.rewardRow}>
            {rewards.map((reward, i) => (
              <LevelRewardCard key={`${reward.type}-${i}`} reward={reward} size="lg" />
            ))}
          </div>
        )}

        {perks && perks.length > 0 && (
          <ul className={styles.perkList}>
            {perks.map((perk) => (
              <li key={perk}>
                <Sparkles size={13} />
                {perk}
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          className={styles.continueBtn}
          onClick={() => {
            playClick();
            onContinue();
          }}
        >
          <span className="lightSweep" aria-hidden="true" />
          Claim Rewards
        </button>
      </div>
    </div>
  );
}

export default LevelUpModal;
