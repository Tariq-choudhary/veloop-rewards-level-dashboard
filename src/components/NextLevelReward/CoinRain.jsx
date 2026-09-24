import { useMemo } from "react";
import styles from "./NextLevelReward.module.css";

const GEM_CLASSES = ["gemGold", "gemGreen", "gemPurple"];

/**
 * A mix of gold coins and gems falling like rain from the open chest.
 * Purely visual — animation only actually plays once `active` is true
 * (see `.preview.revealed .coin`/`.gem` in NextLevelReward.module.css),
 * this just lays out the randomized positions/timing once per mount.
 */
function CoinRain({ count = 16 }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const isGem = i % 3 !== 0;
        return {
          id: i,
          isGem,
          gemClass: isGem ? GEM_CLASSES[i % GEM_CLASSES.length] : null,
          left: 22 + Math.random() * 56,
          size: isGem ? 8 + Math.random() * 5 : 9 + Math.random() * 6,
          delay: Math.random() * 1.8,
          duration: 1.3 + Math.random() * 0.9,
        };
      }),
    [count],
  );

  return (
    <div className={styles.coinRain} aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className={p.isGem ? `${styles.gem} ${styles[p.gemClass]}` : styles.coin}
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export default CoinRain;
