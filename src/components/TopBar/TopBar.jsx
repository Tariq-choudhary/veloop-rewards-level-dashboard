import { useEffect, useRef, useState } from "react";
import { Bell, Volume2, VolumeX } from "lucide-react";
import { isSoundMuted, setSoundMuted, playClick } from "../../utils/audio.js";
import styles from "./TopBar.module.css";
import { useAuth } from "../../context/AuthContext.jsx";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

/**
 * App chrome: greeting, sound control, and notification bell.
 * Navigation is handled by the BottomNav, so the hamburger menu
 * and navigation drawer are not needed here.
 */
function TopBar({ activity = [] }) {
  const { user } = useAuth();
  const [bellOpen, setBellOpen] = useState(false);
  const [muted, setMuted] = useState(() => isSoundMuted());
  const wrapRef = useRef(null);

  const recent = activity.filter((a) => a.time === "Just now");
  const unread = recent.length;

  useEffect(() => {
    function onDocClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setBellOpen(false);
      }
    }

    function onKey(e) {
      if (e.key === "Escape") {
        setBellOpen(false);
      }
    }

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const toggleMuted = () => {
    const next = !muted;
    setMuted(next);
    setSoundMuted(next);

    if (!next) {
      playClick();
    }
  };

  return (
    <div ref={wrapRef} className={styles.wrap}>
      <div className={styles.row}>
        <div className={styles.greeting}>
          <h1 className={styles.greetingTitle}>
            <span className={styles.greetingWord}>{getGreeting()},</span>{" "}
            <span className={styles.velooperWord}>{user?.name || "VELooper"}</span>
          </h1>

          <p className={styles.greetingSub}>
            Level up your journey and unlock epic rewards every day.
          </p>
        </div>

        <button
          type="button"
          className={styles.iconBtn}
          aria-label={muted ? "Unmute sound" : "Mute sound"}
          onClick={toggleMuted}
        >
          {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
        </button>

        <div className={styles.bellWrap}>
          <button
            type="button"
            className={styles.iconBtn}
            aria-label={`Notifications${unread ? `, ${unread} new` : ""}`}
            aria-expanded={bellOpen}
            onClick={() => {
              playClick();
              setBellOpen((o) => !o);
            }}
          >
            <Bell size={19} />

            {unread > 0 && (
              <span className={styles.badge}>
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>

          {bellOpen && (
            <div
              className={styles.bellPanel}
              role="dialog"
              aria-label="Recent notifications"
            >
              <div className={styles.bellPanelHeader}>
                Notifications
              </div>

              {recent.length === 0 ? (
                <p className={styles.bellEmpty}>
                  You&apos;re all caught up.
                </p>
              ) : (
                <ul className={styles.bellList}>
                  {recent.map((item) => (
                    <li key={item.id}>
                      <span className={styles.bellLabel}>
                        {item.label}
                      </span>

                      <span className={styles.bellMeta}>
                        {item.meta ||
                          (item.ves
                            ? `+${item.ves} VEs`
                            : `+${item.xp} XP`)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopBar;