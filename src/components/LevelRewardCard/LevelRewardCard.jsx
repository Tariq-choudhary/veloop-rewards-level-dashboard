import { Coins, Gem, RotateCw, Sparkles } from "lucide-react";
import styles from "./LevelRewardCard.module.css";

const ICONS = {
  VEs: Coins,
  Gems: Gem,
  Spins: RotateCw,
};

/**
 * Small reusable "N <RewardType>" chip used across the roadmap,
 * next-level reward panel, and game result screen.
 */
function LevelRewardCard({ reward, size = "md", locked = false }) {
  if (!reward) return null;
  const Icon = ICONS[reward.type] || Sparkles;

  return (
    <span
      className={`${styles.chip} ${styles[size]} ${locked ? styles.locked : ""}`}
    >
      <Icon size={size === "lg" ? 20 : 16} strokeWidth={2.25} />
      <span>
        {reward.amount} {reward.type}
      </span>
    </span>
  );
}

export default LevelRewardCard;
