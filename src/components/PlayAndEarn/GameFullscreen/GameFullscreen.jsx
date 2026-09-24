import { useEffect } from "react";
import { X } from "lucide-react";
import { playClick } from "../../../utils/audio.js";
import styles from "./GameFullscreen.module.css";

/**
 * Full-viewport stage the mini-game opens into once the player starts a
 * round — locks background scroll and closes on Escape/X, same as any
 * other overlay in the app (see LevelUpModal), just edge-to-edge instead
 * of a centered card since the play field needs the room.
 */
function GameFullscreen({ children, onClose }) {
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className={styles.stage} role="dialog" aria-modal="true">
      <button
        type="button"
        className={styles.closeBtn}
        aria-label="Close game"
        onClick={() => {
          playClick();
          onClose();
        }}
      >
        <X size={20} />
      </button>
      <div className={styles.inner}>{children}</div>
    </div>
  );
}

export default GameFullscreen;
