import { useEffect, useRef, useState } from "react";
import TopBar from "../../components/TopBar/TopBar.jsx";
import BottomNav from "../../components/BottomNav/BottomNav.jsx";
import Toast from "../../components/Toast/Toast.jsx";
import LevelHero from "../../components/LevelHero/LevelHero.jsx";
import NextLevelReward from "../../components/NextLevelReward/NextLevelReward.jsx";
import LevelRoadmap from "../../components/LevelRoadmap/LevelRoadmap.jsx";
import PlayAndEarn from "../../components/PlayAndEarn/PlayAndEarn.jsx";
import EarnMoreXP from "../../components/EarnMoreXP/EarnMoreXP.jsx";
import XPActivity from "../../components/XPActivity/XPActivity.jsx";
import LevelUpModal from "../../components/LevelUpModal/LevelUpModal.jsx";
import Wallet from "../../components/Wallet/Wallet.jsx";
import ProfilePage from "../ProfilePage/ProfilePage.jsx";
import {
  DashboardSkeleton,
  ErrorState,
} from "../../components/StateViews/StateViews.jsx";
import { useLevelData } from "../../hooks/useLevelData.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCenterHighlight } from "../../hooks/useCenterHighlight.js";
import { todaysBoost } from "../../data/levelData.js";
import styles from "./LevelDashboard.module.css";

// Fixed XP-requirement step applied every time a level is crossed.
// Dummy/demo value — a real backend would supply the next threshold.
const XP_STEP = 2000;

function findRoadmapEntry(roadmap, level) {
  return roadmap?.find((r) => r.level === level);
}

/**
 * Owns all "real" dashboard progress state (level/XP/roadmap position),
 * the XP activity log, and orchestrates the mini-game + quick-earn
 * actions that feed XP back into that state. Game internals stay
 * isolated inside PlayAndEarn/GameContainer — only the final result of
 * a run reaches this component via onReward.
 *
 * Home remains the dashboard page. Profile is a dedicated /profile view;
 * the home dashboard ends with the Wallet section and does not render Profile.
 */
function LevelDashboard() {
  const { status, data, retry } = useLevelData();
  const { user, awardReward } = useAuth();
  const [progress, setProgress] = useState(null);
  const [activity, setActivity] = useState([]);
  const [pendingLevelUp, setPendingLevelUp] = useState(null);
  const [bestScore, setBestScore] = useState(0);
  const [activeNav, setActiveNav] = useState("home");
  const [toastMessage, setToastMessage] = useState(null);
  const [page, setPage] = useState(() => window.location.pathname === "/profile" ? "profile" : "home");

  const playAndEarnRef = useRef(null);
  const earnRef = useRef(null);
  const rewardsRef = useRef(null);
  const activityRef = useRef(null);
  const walletRef = useRef(null);

  useCenterHighlight(Boolean(progress));

  // initialize local progress state once the simulated fetch resolves
  useEffect(() => {
    if (status === "ready" && data && user && !progress) {
      const level = user.level || 1;
      const nextLevel = level + 1;
      const nextEntry = findRoadmapEntry(data.roadmap, nextLevel);
      const currentEntry = findRoadmapEntry(data.roadmap, level);
      setProgress({
        level,
        levelName: currentEntry?.name || data.currentLevelName,
        xp: user.xp || 0,
        requiredXP: level * XP_STEP,
        nextLevel,
        nextLevelName: nextEntry?.name || `Level ${nextLevel}`,
        nextLevelReward: nextEntry?.reward || data.nextLevelReward,
      });
      setBestScore(user.bestScore || 0);
      setActivity([]);
    }
  }, [status, data]);

  const logActivity = ({ label, xp = 0, ves = 0, gems = 0, meta }) => {
    setActivity((prev) => [
      { id: `local-${Date.now()}-${Math.random()}`, label, xp, ves, gems, meta, time: "Just now" },
      ...prev,
    ]);
  };

  const applyServerUser = (serverUser) => {
    if (!serverUser || !data) return;
    const level = serverUser.level || 1;
    const nextLevel = level + 1;
    const currentEntry = findRoadmapEntry(data.roadmap, level);
    const nextEntry = findRoadmapEntry(data.roadmap, nextLevel);
    setProgress((prev) => ({
      ...(prev || {}),
      level,
      levelName: currentEntry?.name || `Level ${level}`,
      xp: serverUser.xp || 0,
      requiredXP: level * XP_STEP,
      nextLevel,
      nextLevelName: nextEntry?.name || `Level ${nextLevel}`,
      nextLevelReward: nextEntry?.reward || prev?.nextLevelReward || data.nextLevelReward,
    }));
    setBestScore(serverUser.bestScore || 0);
  };

  const addXP = async (amount, extraRewards = {}) => {
    if (!amount || !progress) return null;
    const result = await awardReward({ xp: amount, ...extraRewards });
    applyServerUser(result.user);
    if (result.leveledUp) {
      const level = result.user.level;
      const entry = findRoadmapEntry(data.roadmap, level);
      setPendingLevelUp({
        level,
        levelName: entry?.name || `Level ${level}`,
        rewards: [entry?.reward].filter(Boolean),
        perks: data.nextLevelPerks || [],
      });
    }
    return result;
  };

  const handleQuickEarn = (feature) => {
    if (feature.status === "coming-soon") return;

    if (feature.id === "play-earn") {
      playAndEarnRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    addXP(feature.xp).then(() => {
      logActivity({ label: feature.title, xp: feature.xp });
    }).catch((error) => {
      setToastMessage(error.message || "Could not save the reward.");
    });
  };

  const handleGameReward = async (run) => {
    const { score, xpEarned, gemsEarned, vesEarned, bonusReward } = run;
    const bonusVEs = bonusReward?.type === "VEs" ? bonusReward.amount : 0;
    const bonusGems = bonusReward?.type === "Gems" ? bonusReward.amount : 0;

    try {
      const result = await awardReward({
        xp: xpEarned,
        gems: gemsEarned + bonusGems,
        veCoins: vesEarned + bonusVEs,
        bestScore: score,
      });
      applyServerUser(result.user);

      if (result.leveledUp) {
        const entry = findRoadmapEntry(data.roadmap, result.user.level);
        setPendingLevelUp({
          level: result.user.level,
          levelName: entry?.name || `Level ${result.user.level}`,
          rewards: [entry?.reward].filter(Boolean),
          perks: data.nextLevelPerks || [],
        });
      }

      setBestScore((prev) => Math.max(prev, result.user.bestScore || score));

      const parts = [];
      if (xpEarned > 0) parts.push(`+${xpEarned} XP`);
      if (gemsEarned > 0) parts.push(`+${gemsEarned} Gems`);
      if (vesEarned > 0) parts.push(`+${vesEarned} VEs`);
      if (bonusReward) parts.push(`+${bonusReward.amount} bonus ${bonusReward.type}`);
      logActivity({
        label: "XP Catcher Reward",
        xp: xpEarned,
        ves: vesEarned + bonusVEs,
        gems: gemsEarned + bonusGems,
        meta: parts.join(" · ") || undefined,
      });
    } catch (error) {
      setToastMessage(error.message || "Could not save the game reward.");
    }
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const onPopState = () => {
      const nextPage = window.location.pathname === "/profile" ? "profile" : "home";
      setPage(nextPage);
      setActiveNav(nextPage === "profile" ? "profile" : "home");
      setToastMessage(null);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const openProfile = () => {
    window.history.pushState({}, "", "/profile");
    setPage("profile");
    setActiveNav("profile");
    setToastMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goHome = () => {
    if (window.location.pathname !== "/") {
      window.history.pushState({}, "", "/");
    }
    setPage("home");
    setActiveNav("home");
    setToastMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigate = (key) => {
    setToastMessage(null);

    if (key === "profile") {
      openProfile();
      return;
    }

    if (page === "profile") {
      goHome();
      if (key === "home") return;
      window.setTimeout(() => {
        if (key === "earn") earnRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        if (key === "rewards") rewardsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        if (key === "wallet") walletRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
      setActiveNav(key);
      return;
    }

    setActiveNav(key);

    if (key === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (key === "earn") {
      earnRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (key === "rewards") {
      rewardsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (key === "wallet") {
      walletRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleToastDone = () => {
    setToastMessage(null);
    setActiveNav("home");
  };

  if (status === "loading") {
    return (
      <div className="container-page">
        <DashboardSkeleton />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="container-page">
        <ErrorState onRetry={retry} />
      </div>
    );
  }

  if (!progress) return null;

  if (page === "profile") {
    return (
      <>
        <ProfilePage
          progress={progress}
          activity={activity}
          boost={todaysBoost}
          onBack={goHome}
        />
        <BottomNav activeKey="profile" onNavigate={handleNavigate} />
      </>
    );
  }

  const progressPct = Math.min(
    100,
    Math.round((progress.xp / progress.requiredXP) * 100),
  );

  return (
    <div className="container-page">
      <TopBar activity={activity} onNavigate={handleNavigate} />

      <div className={styles.gridHero}>
        <LevelHero
          level={progress.level}
          levelName={progress.levelName}
          currentXP={progress.xp}
          requiredXP={progress.requiredXP}
          nextLevel={progress.nextLevel}
          boost={todaysBoost}
          onViewActivity={() =>
            activityRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        />

        <div ref={playAndEarnRef} className={styles.playAndEarnCol}>
          <PlayAndEarn
            onReward={handleGameReward}
            onBack={handleBackToTop}
            bestScore={bestScore}
            progress={{
              currentXP: progress.xp,
              requiredXP: progress.requiredXP,
              levelName: progress.levelName,
              nextLevelName: progress.nextLevelName,
            }}
          />
        </div>
      </div>

      <div className={styles.gridTwo}>
        <LevelRoadmap roadmap={data.roadmap} currentLevel={progress.level} />
        <div ref={rewardsRef}>
          <NextLevelReward
            nextLevel={progress.nextLevel}
            reward={progress.nextLevelReward}
            progressPct={progressPct}
          />
        </div>
      </div>

      <div className={styles.gridTwoEven}>
        <div ref={earnRef}>
          <EarnMoreXP features={data.earningFeatures} onQuickEarn={handleQuickEarn} />
        </div>
        <div ref={activityRef}>
          <XPActivity activity={activity} />
        </div>
      </div>

      <div ref={walletRef}>
        <Wallet activity={activity} />
      </div>

      {pendingLevelUp && (
        <LevelUpModal
          level={pendingLevelUp.level}
          levelName={pendingLevelUp.levelName}
          rewards={pendingLevelUp.rewards}
          perks={pendingLevelUp.perks}
          onContinue={() => setPendingLevelUp(null)}
        />
      )}

      <Toast message={toastMessage} onDone={handleToastDone} />

      <BottomNav activeKey={activeNav} onNavigate={handleNavigate} />
    </div>
  );
}

export default LevelDashboard;
