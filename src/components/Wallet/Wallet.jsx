import { Coins, Gem, Gift, Sparkles, WalletCards } from "lucide-react";
import styles from "./Wallet.module.css";
import { useAuth } from "../../context/AuthContext.jsx";

function Wallet({ activity = [] }) {
  const { user } = useAuth();
  const ves = user?.veCoins ?? activity.reduce((sum, item) => sum + (item.ves || 0), 0);
  const gems = user?.gems ?? activity.reduce((sum, item) => sum + (item.gems || 0), 0);

  return (
    <section className={styles.section} aria-labelledby="wallet-title">
      <div className={styles.headerRow}>
        <div>
          <p className={styles.kicker}><WalletCards size={14} /> REWARD WALLET</p>
          <h2 id="wallet-title">Your Wallet</h2>
          <p className={styles.subtext}>Keep track of your VEs, Gems and reward balance.</p>
        </div>
        <div className={styles.liveBadge}><Sparkles size={14} /> LIVE BALANCE</div>
      </div>

      <div className={styles.balanceGrid}>
        <div className={`${styles.balanceCard} ${styles.ves}`}>
          <div className={styles.icon}><Coins size={21} /></div>
          <span>VE Coins</span>
          <strong>{ves.toLocaleString()}</strong>
          <small>Saved to your account</small>
        </div>
        <div className={`${styles.balanceCard} ${styles.gems}`}>
          <div className={styles.icon}><Gem size={21} /></div>
          <span>Gems</span>
          <strong>{gems.toLocaleString()}</strong>
          <small>Saved to your account</small>
        </div>
        <div className={`${styles.balanceCard} ${styles.rewards}`}>
          <div className={styles.icon}><Gift size={21} /></div>
          <span>Rewards</span>
          <strong>Unlocked</strong>
          <small>Keep leveling to unlock more</small>
        </div>
      </div>

      <div className={styles.noteCard}>
        <div className={styles.noteIcon}><WalletCards size={18} /></div>
        <div>
          <strong>Wallet redemption is coming next.</strong>
          <p>Your balance is already connected to dashboard activity, so future reward redemption can use the same data.</p>
        </div>
      </div>
    </section>
  );
}

export default Wallet;
