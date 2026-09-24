import { useEffect, useState } from "react";
import LevelDashboard from "./pages/LevelDashboard/LevelDashboard.jsx";
import AuthPage from "./pages/Auth/AuthPage.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function App() {
  const { user, loading } = useAuth();
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (!loading && !user && path !== "/login" && path !== "/register") {
      window.history.replaceState({}, "", "/login");
      setPath("/login");
    }
  }, [loading, user, path]);

  if (loading) return <div className="auth-loading">Loading VELoop...</div>;
  if (!user) return <AuthPage />;
  if (path === "/login" || path === "/register") {
    window.history.replaceState({}, "", "/");
  }
  return <LevelDashboard />;
}

export default App;
