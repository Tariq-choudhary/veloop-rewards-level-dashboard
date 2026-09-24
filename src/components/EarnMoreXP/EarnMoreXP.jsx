import {
  Calendar,
  CheckSquare,
  ChevronRight,
  Flame,
  Gamepad2,
  Play,
  Search,
  Users,
} from "lucide-react";
import { playClick } from "../../utils/audio.js";
import styles from "./EarnMoreXP.module.css";

const ICONS = {
  play: Play,
  "check-square": CheckSquare,
  users: Users,
  gamepad: Gamepad2,
  flame: Flame,
  search: Search,
  calendar: Calendar,
};

// Presentational accent per feature icon — matches the purple/green/blue/
// orange reward-color system from the design reference. Purely a display
// concern; the underlying feature data stays untouched.
const ACCENTS = {
  play: "purple",
  "check-square": "green",
  users: "blue",
  gamepad: "blue",
  flame: "orange",
  search: "muted",
  calendar: "muted",
};

function EarnMoreXP({ features, onQuickEarn }) {
  return (
    <section className={`${styles.card} premiumCard`}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>POWER UP & EARN</h2>
        <p className={styles.subtitle}>
          CLEAR MISSIONS. STACK XP. UNLOCK REWARDS.
        </p>
      </div>

      <div className={styles.list}>
        {features.map((f) => {
          const Icon = ICONS[f.icon] || Play;
          const accent = ACCENTS[f.icon] || "gold";
          const isComingSoon = f.status === "coming-soon";
          return (
            <button
              key={f.id}
              type="button"
              className={`${styles.row} ${isComingSoon ? styles.soon : ""}`}
              disabled={isComingSoon}
              onClick={() => {
                playClick();
                onQuickEarn(f);
              }}
            >
              <span className={`${styles.iconWrap} ${styles[accent]}`}>
                <Icon size={20} />
              </span>

              <span className={styles.info}>
                <span className={styles.rowTitle}>
                  {f.title}
                  {isComingSoon && <span className={styles.soonTag}>Coming Soon</span>}
                </span>
                <span className={styles.rowDesc}>{f.description}</span>
              </span>

              <span className={styles.rowRight}>
                <span className={styles.xp}>+{f.xp} XP</span>
                <ChevronRight size={18} className={styles.chevron} />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default EarnMoreXP;
