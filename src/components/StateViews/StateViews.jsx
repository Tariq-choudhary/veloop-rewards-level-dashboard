import { AlertTriangle, RotateCw } from "lucide-react";
import { playClick } from "../../utils/audio.js";
import styles from "./StateViews.module.css";

export function DashboardSkeleton() {
  return (
    <div className={styles.skeletonWrap} aria-busy="true" aria-label="Loading your level progress">
      <div className={`${styles.block} ${styles.hero}`} />
      <div className={styles.row}>
        <div className={`${styles.block} ${styles.tall}`} />
        <div className={`${styles.block} ${styles.tall}`} />
      </div>
      <div className={`${styles.block} ${styles.wide}`} />
      <div className={styles.row}>
        <div className={`${styles.block} ${styles.tall}`} />
        <div className={`${styles.block} ${styles.tall}`} />
      </div>
    </div>
  );
}

export function ErrorState({ onRetry }) {
  return (
    <div className={styles.errorWrap}>
      <AlertTriangle size={32} />
      <h2>Unable to Load Level Progress</h2>
      <p>We couldn&apos;t load your level information right now.</p>
      <button
        type="button"
        onClick={() => {
          playClick();
          onRetry();
        }}
        className={styles.retryBtn}
      >
        <RotateCw size={16} /> Try Again
      </button>
    </div>
  );
}
