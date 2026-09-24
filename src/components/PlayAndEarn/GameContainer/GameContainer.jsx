import { useState } from "react";
import GameStart from "../GameStart/GameStart.jsx";
import GamePlay from "../GamePlay/GamePlay.jsx";
import GameResult from "../GameResult/GameResult.jsx";
import GameFullscreen from "../GameFullscreen/GameFullscreen.jsx";
import { gameConfig } from "../../../data/levelData.js";

/**
 * Orchestrates the mini-game's three states: start -> playing -> result.
 * `onReward` is called once per completed run so the dashboard can add
 * the earned XP/Gems/VEs (and trigger a level-up if the threshold is
 * crossed). Game internals (phase, live score, item positions) stay
 * fully local here and are discarded once the game closes.
 */
function GameContainer({ onReward, onBack, progress, bestScore = 0 }) {
  const [phase, setPhase] = useState("start"); // start | playing | result
  const [lastRun, setLastRun] = useState(null);

  const handleFinish = (totals) => {
    const { score, xp, gems, ves } = totals;
    const earnedBonus = score >= gameConfig.bonusThreshold;
    const bonusReward = earnedBonus ? gameConfig.bonusReward : null;
    const isNewBest = score > bestScore;

    const run = {
      score,
      xpEarned: xp,
      gemsEarned: gems,
      vesEarned: ves,
      bonusReward,
      isNewBest,
    };

    setLastRun(run);
    setPhase("result");
    onReward?.(run);
  };

  const handleBack = () => {
    setPhase("start");
    onBack?.();
  };

  return (
    <>
      {phase === "start" && (
        <GameStart
          durationSeconds={gameConfig.durationSeconds}
          onStart={() => setPhase("playing")}
        />
      )}

      {phase === "playing" && (
        <GameFullscreen onClose={handleBack}>
          <GamePlay durationSeconds={gameConfig.durationSeconds} onFinish={handleFinish} />
        </GameFullscreen>
      )}

      {phase === "result" && lastRun && (
        <GameFullscreen onClose={handleBack}>
          <GameResult
            run={lastRun}
            progress={progress}
            onPlayAgain={() => setPhase("playing")}
            onBack={handleBack}
          />
        </GameFullscreen>
      )}
    </>
  );
}

export default GameContainer;
