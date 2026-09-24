import { useCallback, useEffect, useRef, useState } from "react";
import { ShoppingCart, Timer } from "lucide-react";
import { gameConfig } from "../../../data/levelData.js";
import gemImg from "../../../assets/game-icons/gem.png";
import coinImg from "../../../assets/game-icons/coin.png";
import multiGemImg from "../../../assets/game-icons/gem-multi.png";
import multiCoinImg from "../../../assets/game-icons/coin-multi.png";
import starImg from "../../../assets/game-icons/star.png";
import { startGameMusic, stopGameMusic, playCatch, playMultiplier, playGameOver } from "../../../utils/audio.js";
import styles from "../Game.module.css";

const CART_WIDTH_PCT = 30; // catch band width, matches the cart's visual footprint
const ITEM_SPEED_PCT_PER_MS = 0.038;
const SPAWN_MS = 650;

// Source art is pre-normalized to a square, consistently-filled canvas
// (see src/assets/game-icons) — every falling item renders at the same
// visual size via a shared container, no per-type zoom hacks needed.
const ITEM_DISPLAY = {
  xp: { img: starImg, multiImg: starImg, label: "XP" },
  gem: { img: gemImg, multiImg: multiGemImg, label: "Gem" },
  coin: { img: coinImg, multiImg: multiCoinImg, label: "VE" },
};

/** Weighted random pick from gameConfig.itemTypes. */
function pickItemType() {
  const totalWeight = gameConfig.itemTypes.reduce((sum, t) => sum + t.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const type of gameConfig.itemTypes) {
    if (roll < type.weight) return type;
    roll -= type.weight;
  }
  return gameConfig.itemTypes[0];
}

/**
 * Functional mini-game: guide the golden shopping cart to catch falling
 * XP orbs, Gems, and VE coins for `durationSeconds`, then report the
 * run's totals back to the parent. A rare multiplier doubles a single
 * catch's reward. Runs on requestAnimationFrame (delta-time driven, not
 * a fixed setInterval tick) so motion stays smooth regardless of the
 * device's actual frame rate.
 */
function GamePlay({ durationSeconds, onFinish }) {
  const arenaRef = useRef(null);
  const itemsRef = useRef([]);
  const nextIdRef = useRef(1);
  const cartXRef = useRef(50);
  const totalsRef = useRef({ score: 0, xp: 0, gems: 0, ves: 0 });
  const rafRef = useRef(null);
  const lastTsRef = useRef(null);
  const spawnAccRef = useRef(0);

  const [cartX, setCartX] = useState(50);
  const [items, setItems] = useState([]);
  const [totals, setTotals] = useState({ score: 0, xp: 0, gems: 0, ves: 0 });
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [pop, setPop] = useState(null);

  const finish = useCallback(() => {
    playGameOver();
    onFinish(totalsRef.current);
  }, [onFinish]);

  // background piano loop plays for the duration of the round only
  useEffect(() => {
    startGameMusic();
    return () => stopGameMusic();
  }, []);

  // countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      finish();
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  // spawn + fall loop, driven by requestAnimationFrame for smooth motion
  useEffect(() => {
    const step = (ts) => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = Math.min(48, ts - lastTsRef.current); // clamp so a stalled tab can't "jump"
      lastTsRef.current = ts;

      spawnAccRef.current += dt;
      while (spawnAccRef.current >= SPAWN_MS) {
        spawnAccRef.current -= SPAWN_MS;
        const type = pickItemType();
        itemsRef.current = [
          ...itemsRef.current,
          { id: nextIdRef.current++, x: 10 + Math.random() * 80, y: -5, typeKey: type.key },
        ];
      }

      const next = [];
      let gained = null;

      for (const item of itemsRef.current) {
        const y = item.y + ITEM_SPEED_PCT_PER_MS * dt;
        const inCartBand = y >= 80 && y <= 94;
        const inCartX = Math.abs(item.x - cartXRef.current) < CART_WIDTH_PCT / 2;

        if (inCartBand && inCartX) {
          const type = gameConfig.itemTypes.find((t) => t.key === item.typeKey);
          const isMultiplier = Math.random() < gameConfig.multiplierChance;
          const mult = isMultiplier ? gameConfig.multiplierValue : 1;

          totalsRef.current = {
            score: totalsRef.current.score + type.score * mult,
            xp: totalsRef.current.xp + (type.xp || 0) * mult,
            gems: totalsRef.current.gems + (type.gems || 0) * mult,
            ves: totalsRef.current.ves + (type.ves || 0) * mult,
          };
          gained = { typeKey: type.key, mult };
          continue; // caught, remove from field
        }
        if (y < 104) next.push({ ...item, y });
      }

      itemsRef.current = next;
      setItems(next);
      if (gained) {
        setTotals({ ...totalsRef.current });
        setPop(gained);
        if (gained.mult > 1) playMultiplier();
        else playCatch(gained.typeKey);
        setTimeout(() => setPop(null), 480);
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, []);

  const moveCartTo = useCallback((clientX) => {
    const arena = arenaRef.current;
    if (!arena) return;
    const rect = arena.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.min(94, Math.max(6, pct));
    cartXRef.current = clamped;
    setCartX(clamped);
  }, []);

  const handlePointerMove = (e) => moveCartTo(e.clientX);
  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) moveCartTo(e.touches[0].clientX);
  };
  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      cartXRef.current = Math.max(6, cartXRef.current - 6);
      setCartX(cartXRef.current);
    }
    if (e.key === "ArrowRight") {
      cartXRef.current = Math.min(94, cartXRef.current + 6);
      setCartX(cartXRef.current);
    }
  };

  const coinType = gameConfig.itemTypes.find((t) => t.key === "coin");

  return (
    <div className={styles.playRoot}>
      <div className={styles.playHeader}>
        <span className={styles.playEyebrow}>{gameConfig.name.toUpperCase()}</span>
        <span className={`${styles.timerPill} ${timeLeft <= 5 ? styles.timerBad : ""}`}>
          <Timer size={13} />
          {timeLeft}s
        </span>
      </div>

      <div
        ref={arenaRef}
        className={styles.arena}
        onPointerMove={handlePointerMove}
        onTouchMove={handleTouchMove}
        tabIndex={0}
        role="application"
        aria-label="XP Catcher play area. Use arrow keys or drag to move the cart."
        onKeyDown={handleKeyDown}
      >
        {pop && (
          <div className={`${styles.popText} ${pop.mult > 1 ? styles.popTextBonus : ""}`}>
            {pop.mult > 1 ? (
              <img src={ITEM_DISPLAY[pop.typeKey].multiImg} alt="" className={styles.popImg} />
            ) : null}
            {pop.mult > 1 ? "2x BONUS!" : `+${ITEM_DISPLAY[pop.typeKey].label}`}
          </div>
        )}

        {items.map((it) => (
          <div
            key={it.id}
            className={styles.fallingItem}
            style={{ left: `${it.x}%`, top: `${it.y}%` }}
          >
            <img src={ITEM_DISPLAY[it.typeKey].img} alt="" className={styles.fallingItemImg} />
          </div>
        ))}

        <div className={styles.cart} style={{ left: `${cartX}%` }}>
          <span className={`${styles.cartGlow} ${pop ? styles.cartGlowCatch : ""}`} aria-hidden="true" />
          <span className={`${styles.cartRing} ${pop ? styles.cartRingCatch : ""}`} aria-hidden="true" />
          <ShoppingCart className={`${styles.cartIcon} ${pop ? styles.cartIconCatch : ""}`} size={92} strokeWidth={2.1} />
        </div>
      </div>

      <div className={styles.rulesBanner}>
        Catch the coins, gems &amp; XP orbs — score high for better rewards!
        <span className={styles.rulesHint}>← → arrow keys or drag to move the cart</span>
      </div>

      <div className={styles.scorePanel}>
        <span className={styles.scoreLabel}>Your Score</span>
        <span className={styles.scoreBigLive}>{totals.score}</span>
        <span className={styles.scoreCaption}>
          {totals.xp} XP &middot; {totals.gems} Gems &middot; {totals.ves} VEs earned
        </span>
      </div>

      <div className={styles.legendRow}>
        {coinType && (
          <span className={styles.legendChip}>
            <span className={styles.legendDotGold} />+{coinType.ves} VEs
          </span>
        )}
        <span className={styles.legendChip}>
          <span className={styles.legendDotPurple} />
          {gameConfig.multiplierValue}X Multiplier
        </span>
      </div>
    </div>
  );
}

export default GamePlay;
