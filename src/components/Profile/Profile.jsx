import { useEffect, useMemo, useState } from "react";
import {
  Award,
  Bell,
  Check,
  ChevronRight,
  Edit3,
  Flame,
  Gamepad2,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import { isSoundMuted, setSoundMuted, playClick } from "../../utils/audio.js";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./Profile.module.css";

const DEFAULT_NAME = "VELooper";

function getInitials(name) {
  const clean = name.trim();
  if (!clean) return "V";
  return clean
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function Profile({ progress, activity = [], boost }) {
  const { user, logout } = useAuth();
  const [name, setName] = useState(() => user?.name || DEFAULT_NAME);
  const [draftName, setDraftName] = useState(name);
  const [editing, setEditing] = useState(false);
  const [muted, setMuted] = useState(() => isSoundMuted());

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  const stats = useMemo(() => {
    const totalXP = activity.reduce((sum, item) => sum + (item.xp || 0), 0) + (progress?.xp || 0);
    const totalVEs = activity.reduce((sum, item) => sum + (item.ves || 0), 0);
    const games = activity.filter((item) => /GAME|ARENA|CATCHER/i.test(item.label || "")).length;
    return { totalXP, totalVEs, games };
  }, [activity, progress]);

  const progressPct = progress?.requiredXP
    ? Math.min(100, Math.round((progress.xp / progress.requiredXP) * 100))
    : 0;

  const saveName = () => {
    const next = draftName.trim().slice(0, 24);
    if (!next) return;
    setName(next);
    setEditing(false);
    playClick();
  };

  const cancelEdit = () => {
    setDraftName(name);
    setEditing(false);
  };

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    setSoundMuted(next);
    if (!next) playClick();
  };

  return (
    <section className={styles.section} aria-labelledby="profile-title">
      <div className={styles.headerRow}>
        <div>
          <p className={styles.kicker}><UserRound size={14} /> PLAYER PROFILE</p>
          <h2 id="profile-title">Your VELooper HQ</h2>
          <p className={styles.subtext}>Track your progress, milestones and account preferences.</p>
        </div>
        <div className={styles.headerBadge}><Sparkles size={15} /> LIVE PROFILE</div>
      </div>

      <div className={styles.heroCard}>
        <div className={styles.heroGlow} />
        <div className={styles.profileIdentity}>
          <div className={styles.avatar} aria-hidden="true">{getInitials(name)}</div>
          <div className={styles.identityText}>
            {editing ? (
              <div className={styles.editRow}>
                <input
                  value={draftName}
                  maxLength={24}
                  autoFocus
                  onChange={(event) => setDraftName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") saveName();
                    if (event.key === "Escape") cancelEdit();
                  }}
                  aria-label="Profile name"
                />
                <button type="button" className={styles.smallAction} onClick={saveName} aria-label="Save profile name"><Check size={15} /></button>
                <button type="button" className={styles.smallActionGhost} onClick={cancelEdit} aria-label="Cancel editing"><X size={15} /></button>
              </div>
            ) : (
              <div className={styles.nameLine}>
                <h3>{name}</h3>
                <button type="button" className={styles.editButton} onClick={() => { setDraftName(name); setEditing(true); }} aria-label="Edit profile name">
                  <Edit3 size={14} /> Edit
                </button>
              </div>
            )}
            <p>Level {progress?.level} · {progress?.levelName}</p>
            <span className={styles.memberTag}><ShieldCheck size={13} /> VELooper Member</span>
          </div>
        </div>

        <div className={styles.levelPanel}>
          <div className={styles.levelTop}>
            <span>LEVEL {progress?.level}</span>
            <strong>{progress?.xp.toLocaleString()} / {progress?.requiredXP.toLocaleString()} XP</strong>
          </div>
          <div className={styles.progressTrack}>
            <span style={{ width: `${progressPct}%` }} />
          </div>
          <div className={styles.levelBottom}>
            <span>{progressPct}% to next level</span>
            <span>Next: {progress?.nextLevelName}</span>
          </div>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.cyan}`}><Zap size={18} /></div>
          <span>Total XP</span>
          <strong>{stats.totalXP.toLocaleString()}</strong>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.purple}`}><Trophy size={18} /></div>
          <span>Current Level</span>
          <strong>{progress?.level}</strong>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.green}`}><Flame size={18} /></div>
          <span>Day Streak</span>
          <strong>{boost?.streakDays || 0} days</strong>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.pink}`}><Gamepad2 size={18} /></div>
          <span>Game Activity</span>
          <strong>{stats.games}</strong>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>
            <div><Award size={17} /><span>Milestones</span></div>
            <span className={styles.countBadge}>{progress?.level || 0}/8</span>
          </div>
          <div className={styles.milestoneList}>
            <div className={`${styles.milestone} ${progress?.level >= 1 ? styles.unlocked : ""}`}>
              <span className={styles.milestoneIcon}><Check size={14} /></span>
              <div><strong>First Step</strong><small>Reach Level 1</small></div>
            </div>
            <div className={`${styles.milestone} ${progress?.level >= 4 ? styles.unlocked : ""}`}>
              <span className={styles.milestoneIcon}><Target size={14} /></span>
              <div><strong>Momentum Builder</strong><small>Reach Level 4</small></div>
            </div>
            <div className={`${styles.milestone} ${progress?.level >= 8 ? styles.unlocked : ""}`}>
              <span className={styles.milestoneIcon}><Trophy size={14} /></span>
              <div><strong>Legend Status</strong><small>Reach Level 8</small></div>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitle}>
            <div><ShieldCheck size={17} /><span>Preferences</span></div>
          </div>
          <button type="button" className={styles.preferenceRow} onClick={toggleSound}>
            <div className={styles.preferenceIcon}><Zap size={16} /></div>
            <div><strong>Game sounds</strong><small>{muted ? "Muted" : "Enabled"}</small></div>
            <span className={`${styles.toggle} ${!muted ? styles.toggleOn : ""}`}><span /></span>
          </button>
          <button type="button" className={styles.preferenceRow} onClick={playClick}>
            <div className={styles.preferenceIcon}><Bell size={16} /></div>
            <div><strong>Notifications</strong><small>Activity alerts are available</small></div>
            <ChevronRight size={17} className={styles.chevron} />
          </button>
          <div className={styles.preferenceRowStatic}>
            <div className={styles.preferenceIcon}><Sparkles size={16} /></div>
            <div><strong>Rewards collected</strong><small>{stats.totalVEs} VEs from recent activity</small></div>
          </div>
        </div>
      </div>

      <button type="button" className={styles.logoutButton} onClick={() => { playClick(); logout(); }}>
        Sign Out
      </button>

      <div className={styles.footerCard}>
        <div className={styles.footerIcon}><Sparkles size={18} /></div>
        <div>
          <strong>Keep leveling up.</strong>
          <p>Your next unlock is waiting at Level {progress?.nextLevel}.</p>
        </div>
        <span className={styles.footerXP}>+XP</span>
      </div>
    </section>
  );
}

export default Profile;
