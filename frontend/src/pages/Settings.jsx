import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";

const Settings = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!token) {
      navigate("/auth");
    }
  }, [token]);

  if (!token) return null;

  return (
    <div className="px-4 sm:px-6 lg:px-10 pb-36">
      <div className="glass rounded-3xl p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">Settings</p>
        <h2 className="text-2xl md:text-3xl font-semibold mt-2">Personalize your vibe</h2>

        <div className="mt-6 glass rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Theme</p>
            <p className="text-xs text-white/60">Switch between dark and light modes.</p>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default Settings;