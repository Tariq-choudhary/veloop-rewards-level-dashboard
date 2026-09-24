import { ArrowLeft, UserRound } from "lucide-react";
import Profile from "../../components/Profile/Profile.jsx";
import styles from "./ProfilePage.module.css";

function ProfilePage({ progress, activity, boost, onBack }) {
  return (
    <div className="container-page">
      <header className={styles.header}>
        <button type="button" className={styles.backButton} onClick={onBack}>
          <ArrowLeft size={17} />
          <span>Back to Home</span>
        </button>
        <div className={styles.pageTitle}>
          <UserRound size={16} />
          <span>PROFILE</span>
        </div>
      </header>

      <Profile progress={progress} activity={activity} boost={boost} />
    </div>
  );
}

export default ProfilePage;
