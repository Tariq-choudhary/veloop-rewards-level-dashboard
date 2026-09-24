import {
  CheckSquare,
  ChevronRight,
  Coins,
  Flame,
  Gamepad2,
  Play,
  Star,
  Users,
  Zap,
} from "lucide-react";
import styles from "./XPActivity.module.css";

function isToday(time) {
  return typeof time === "string" && (time.startsWith("Today") || time === "Just now");
}

// Presentational icon/accent per activity, inferred from its label — the
// underlying activity record only needs a label, no extra "type" field.
function getActivityVisual(label = "") {
  const l = label.toLowerCase();
  if (l.includes("refer")) return { Icon: Users, accent: "green" };
  if (l.includes("daily") || l.includes("mission") || l.includes("task")) {
    return { Icon: CheckSquare, accent: "green" };
  }
  if (l.includes("catcher") || l.includes("coin")) return { Icon: Coins, accent: "gold" };
  if (l.includes("game")) return { Icon: Gamepad2, accent: "blue" };
  if (l.includes("streak")) return { Icon: Flame, accent: "orange" };
  if (l.includes("watch")) return { Icon: Play, accent: "purple" };
  return { Icon: Zap, accent: "gold" };
}

function XPActivity({ activity }) {
  if (!activity || activity.length === 0) {
    return (
      <section className={`${styles.card} premiumCard`}>
        <h2 className={styles.title}>Recent Activity</h2>
        <div className={styles.empty}>
          <Zap size={22} />
          <p>Your XP journey starts here.</p>
        </div>
      </section>
    );
  }

  const todaysEntries = activity.filter((item) => isToday(item.time));
  const todaysXP = todaysEntries.reduce((sum, item) => sum + (item.xp || 0), 0);
  const todaysVEs = todaysEntries.reduce((sum, item) => sum + (item.ves || 0), 0);

  return (
    <section className={`${styles.card} premiumCard`}>
      <h2 className={styles.title}>Recent Activity</h2>
      <ul className={styles.list}>
        {activity.map((item) => {
          const { Icon, accent } = getActivityVisual(item.label);
          const amountText = item.meta || (item.ves ? `+${item.ves} VEs` : `+${item.xp} XP`);
          return (
            <li key={item.id} className={styles.row}>
              <span className={`${styles.iconWrap} ${styles[accent]}`}>
                <Icon size={16} />
              </span>
              <div className={styles.info}>
                <span className={styles.label}>{item.label}</span>
                <span className={styles.time}>{item.time}</span>
              </div>
              <span className={styles.amount}>{amountText}</span>
              <ChevronRight size={16} className={styles.chevron} />
            </li>
          );
        })}
      </ul>

      <div className={styles.summary}>
        <span className={styles.summaryTitle}>Today&apos;s Summary</span>
        <div className={styles.summaryChips}>
          <span className={styles.summaryChip}>
            <span className={`${styles.summaryIcon} ${styles.purple}`}>
              <Star size={14} />
            </span>
            <span className={styles.summaryText}>
              <span className={styles.summaryValue}>{todaysXP} XP</span>
              <span className={styles.summaryLabel}>Total Earned</span>
            </span>
          </span>
          <span className={styles.summaryChip}>
            <span className={`${styles.summaryIcon} ${styles.gold}`}>
              <Coins size={14} />
            </span>
            <span className={styles.summaryText}>
              <span className={styles.summaryValue}>{todaysVEs} VEs</span>
              <span className={styles.summaryLabel}>Total Earned</span>
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}

export default XPActivity;
