import { useEffect } from "react";
import { Sparkles } from "lucide-react";
import styles from "./Toast.module.css";

/** Small auto-dismissing notice, e.g. for nav destinations not built yet. */
function Toast({ message, onDone, duration = 2200 }) {
  useEffect(() => {
    const t = setTimeout(() => onDone?.(), duration);
    return () => clearTimeout(t);
  }, [onDone, duration]);

  if (!message) return null;

  return (
    <div className={styles.wrap} role="status">
      <Sparkles size={15} />
      {message}
    </div>
  );
}

export default Toast;
