import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, UserRound, Zap } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./AuthPage.module.css";

function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState(() => window.location.pathname === "/register" ? "register" : "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const switchMode = (next) => {
    setMode(next);
    setError("");
    window.history.replaceState({}, "", next === "login" ? "/login" : "/register");
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "register") await register(name, email, password);
      else await login(email, password);
      window.history.replaceState({}, "", "/");
      window.dispatchEvent(new PopStateEvent("popstate"));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.glowOne} />
      <div className={styles.glowTwo} />
      <section className={styles.card}>
        <div className={styles.brand}><span className={styles.brandIcon}><Zap size={20} /></span> VELOOP</div>
        <p className={styles.kicker}>REWARDS & LEVEL-UP</p>
        <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
        <p className={styles.subtitle}>
          {mode === "login" ? "Sign in to continue your VELooper journey." : "Create your VELooper account and start leveling up."}
        </p>

        <form onSubmit={submit} className={styles.form}>
          {mode === "register" && (
            <label>
              <span>Name</span>
              <div className={styles.inputWrap}><UserRound size={17} /><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" required /></div>
            </label>
          )}
          <label>
            <span>Email</span>
            <div className={styles.inputWrap}><Mail size={17} /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required /></div>
          </label>
          <label>
            <span>Password</span>
            <div className={styles.inputWrap}>
              <LockKeyhole size={17} />
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 8 characters" minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"} required />
              <button type="button" className={styles.eye} onClick={() => setShowPassword((v) => !v)} aria-label="Toggle password visibility">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
            </div>
          </label>

          {error && <div className={styles.error}>{error}</div>}

          <button className={styles.submit} disabled={busy}>
            {busy ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className={styles.switch}>
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}
          <button type="button" onClick={() => switchMode(mode === "login" ? "register" : "login")}>
            {mode === "login" ? "Create one" : "Sign in"}
          </button>
        </div>
      </section>
    </main>
  );
}

export default AuthPage;
