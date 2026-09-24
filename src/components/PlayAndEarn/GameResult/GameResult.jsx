import { ArrowLeft, RotateCcw, Star, Trophy } from "lucide-react";
import Confetti from "../../Confetti/Confetti.jsx";
import SparkleField from "../../SparkleField/SparkleField.jsx";
import LevelRewardCard from "../../LevelRewardCard/LevelRewardCard.jsx";
import { playClick } from "../../../utils/audio.js";
import styles from "../Game.module.css";

/**
 * "Challenge Complete" screen: final score (with a "New Best!" callout
 * when this run beats the previous best), a reward breakdown (XP / Gems
 * / VEs earned this run, plus any bonus), and an optional mini progress
 * bar toward the next level once the dashboard has applied the reward.
 */
function GameResult({ run, progress, onPlayAgain, onBack }) {
  const { score, xpEarned, gemsEarned, vesEarned, bonusReward, isNewBest } = run;

  // Bonus VEs share the same reward type as caught coins — combine them
  // into one chip (with a small note) instead of showing two "VEs" chips.
  const bonusIsVEs = bonusReward?.type === "VEs";
  const totalVEs = vesEarned + (bonusIsVEs ? bonusReward.amount : 0);
  const otherBonus = bonusReward && !bonusIsVEs ? bonusReward : null;

  const pct =
    progress && progress.requiredXP
      ? Math.min(100, Math.round((progress.currentXP / progress.requiredXP) * 100))
      : null;

  return (
    <div className={`${styles.panel} ${styles.resultPanel}`}>
      <SparkleField count={16} />
      <Confetti count={28} />

      <div className={styles.trophyWrap}>
        <span className={styles.trophyGlow} aria-hidden="true" />
        <span className={`${styles.trophyBadge} glowPulse`}>
          <span className="lightSweep" aria-hidden="true" />
          <Trophy size={34} />
        </span>
      </div>

      <h3 className={styles.completeHeading}>MISSION COMPLETE!</h3>
      <p className={styles.desc}>Outstanding!</p>

      <div className={styles.scoreRow}>
        <span className={styles.scoreLabel}>Final Score</span>
        <span className={styles.scoreBig}>{score}</span>
        {isNewBest && (
          <span className={styles.newBestTag}>
            <Star size={12} /> New Best!
          </span>
        )}
      </div>

      <div className={styles.rewardRow}>
        {xpEarned > 0 && <LevelRewardCard reward={{ type: "XP", amount: xpEarned }} size="lg" />}
        {gemsEarned > 0 && <LevelRewardCard reward={{ type: "Gems", amount: gemsEarned }} size="lg" />}
        {totalVEs > 0 && <LevelRewardCard reward={{ type: "VEs", amount: totalVEs }} size="lg" />}
        {otherBonus && <LevelRewardCard reward={otherBonus} size="lg" />}
      </div>
      {bonusIsVEs && (
        <p className={styles.bonusNote}>Includes +{bonusReward.amount} VEs bonus for a high score</p>
      )}

      {pct !== null && (
        <div className={styles.resultProgress}>
          <div className={styles.resultProgressLabels}>
            <span>{progress.levelName || "CURRENT RANK"}</span>
            <span>{progress.nextLevelName || "Next Level"}</span>
          </div>
          <div className={styles.resultProgressTrack}>
            <div className={styles.resultProgressFill} style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      <div className={styles.btnRow}>
        <button
          type="button"
          className={styles.primaryBtn}
          onClick={() => {
            playClick();
            onPlayAgain();
          }}
        >
          <span className="lightSweep" aria-hidden="true" />
          <RotateCcw size={16} /> Play Again
        </button>
        {onBack && (
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => {
              playClick();
              onBack();
            }}
          >
            <ArrowLeft size={16} /> BACK TO HQ
          </button>
        )}
      </div>
    </div>
  );
}

export default GameResult;
