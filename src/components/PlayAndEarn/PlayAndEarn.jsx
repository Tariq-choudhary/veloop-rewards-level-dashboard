import GameContainer from "./GameContainer/GameContainer.jsx";
import styles from "./PlayAndEarn.module.css";

function PlayAndEarn({ onReward, onBack, progress, bestScore }) {
  return (
    <section className={`${styles.card} premiumCard`}>
      <GameContainer onReward={onReward} onBack={onBack} progress={progress} bestScore={bestScore} />
    </section>
  );
}

export default PlayAndEarn;
