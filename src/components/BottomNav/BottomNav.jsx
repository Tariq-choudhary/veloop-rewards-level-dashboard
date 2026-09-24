import { NAV_ITEMS } from "../navConfig.js";
import { playClick } from "../../utils/audio.js";
import styles from "./BottomNav.module.css";

/**
 * Fixed bottom tab bar. Home, Earn, Rewards and Wallet stay on the dashboard;
 * Profile opens the dedicated /profile page.
 */
function BottomNav({ activeKey = "home", onNavigate }) {
  return (
    <nav className={styles.nav} aria-label="Primary">
      {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
        const active = key === activeKey;
        return (
          <button
            key={key}
            type="button"
            className={`${styles.item} ${active ? styles.active : ""}`}
            aria-current={active ? "page" : undefined}
            onClick={() => {
              playClick();
              onNavigate?.(key);
            }}
          >
            <Icon size={20} strokeWidth={active ? 2.4 : 2} />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNav;
