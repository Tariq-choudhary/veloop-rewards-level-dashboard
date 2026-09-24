import { useState } from "react";
import { Info } from "lucide-react";
import { playClick } from "../../utils/audio.js";
import styles from "./LevelInfo.module.css";

/** Small [i] icon that reveals an explanatory tooltip on hover/tap/focus. */
function LevelInfo({ text }) {
  const [open, setOpen] = useState(false);

  return (
    <span
      className={styles.wrap}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <button
        type="button"
        className={styles.trigger}
        aria-label="More information"
        onClick={() => {
          playClick();
          setOpen((o) => !o);
        }}
      >
        <Info size={14} />
      </button>
      {open && (
        <span role="tooltip" className={styles.tooltip}>
          {text}
        </span>
      )}
    </span>
  );
}

export default LevelInfo;
