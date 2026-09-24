import { Gem, Play, Sparkles, Timer, Trophy, ShoppingCart } from "lucide-react";
import { gameConfig } from "../../../data/levelData.js";
import { playClick } from "../../../utils/audio.js";
import styles from "../Game.module.css";

const COINS = [
  { left: "8%", top: "14%", size: 16, duration: 5.2, delay: -0.4 },
  { left: "88%", top: "10%", size: 13, duration: 6.1, delay: -2.1 },
  { left: "92%", top: "48%", size: 18, duration: 4.8, delay: -3.4 },
  { left: "4%", top: "52%", size: 12, duration: 5.6, delay: -1.2 },
  { left: "80%", top: "76%", size: 15, duration: 6.4, delay: -4.6 },
  { left: "14%", top: "82%", size: 11, duration: 5.0, delay: -0.9 },
];

/** Ambient drifting coins behind the game's start card — purely decorative. */
function CoinField() {
  return (
    <div className={styles.coinField} aria-hidden="true">
      {COINS.map((c, i) => (
        <span
          key={i}
          className={styles.driftCoin}
          style={{
            left: c.left,
            top: c.top,
            width: c.size,
            height: c.size,
            animationDuration: `${c.duration}s`,
            animationDelay: `${c.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function GameStart({ durationSeconds, onStart }) {
  return (
    <div className={styles.panel}>
      <CoinField />

      <div className={styles.gameIconRing}>
        <span className="lightSweep" aria-hidden="true" />
        <ShoppingCart size={32} strokeWidth={2.2} />
      </div>

      <h3 className={styles.heading}>{gameConfig.name}</h3>
      <p className={styles.desc}>Play to earn XP, Gems &amp; VEs</p>

      <button
        type="button"
        className={styles.primaryBtn}
        onClick={() => {
          playClick();
          onStart();
        }}
      >
        <span className="lightSweep" aria-hidden="true" />
        <Play size={18} /> Play Now
      </button>

      <ul className={styles.ruleChips}>
        <li>
          <Timer size={13} /> {durationSeconds}s
        </li>
        <li>
          <Gem size={13} /> XP, Gems &amp; VEs
        </li>
        <li>
          <Sparkles size={13} /> {gameConfig.multiplierValue}x drops
        </li>
        <li>
          <Trophy size={13} /> {gameConfig.bonusThreshold}+ bonus
        </li>
      </ul>
    </div>
  );
}

export default GameStart;
