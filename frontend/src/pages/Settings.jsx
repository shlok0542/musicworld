import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { usePlayer } from "../context/PlayerContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { updateProfile } from "../services/userService.js";
import { useUI } from "../context/UIContext.jsx";

const Settings = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { quality, dataSaver, setQuality, setDataSaver } = usePlayer();
  const { theme } = useTheme();
  const { showToast } = useUI();
  const saveTimer = React.useRef(null);

  React.useEffect(() => {
    if (!token) {
      navigate("/auth");
    }
  }, [token]);

  React.useEffect(() => {
    if (!token) return;
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }
    saveTimer.current = setTimeout(async () => {
      try {
        const updated = await updateProfile({
          settings: { theme, quality, dataSaver }
        });
        localStorage.setItem("mw-user", JSON.stringify(updated));
        showToast({ type: "success", message: "Settings saved." });
      } catch {
        showToast({ type: "error", message: "Unable to save settings." });
      }
    }, 500);
    return () => clearTimeout(saveTimer.current);
  }, [theme, quality, dataSaver, token, showToast]);

  if (!token) return null;

  return (
    <div className="px-4 sm:px-6 lg:px-10 pb-36">
      <div className="glass rounded-3xl p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">Settings</p>
        <h2 className="text-2xl md:text-3xl font-semibold mt-2">Personalize your vibe</h2>

        <div className="mt-6 grid gap-4">
          <div className="glass rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Theme</p>
              <p className="text-xs text-white/60">Switch between dark and light modes.</p>
            </div>
            <ThemeToggle />
          </div>

          <div className="glass rounded-2xl p-4">
            <p className="text-sm font-semibold">Audio Quality</p>
            <p className="text-xs text-white/60 mt-1">Choose your preferred streaming quality.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["64kbps", "160kbps", "320kbps"].map((option) => (
                <button
                  key={option}
                  onClick={() => setQuality(option)}
                  className={`px-3 py-2 rounded-full text-xs uppercase tracking-[0.2em] border ${
                    quality === option
                      ? "border-emerald-300 text-emerald-200"
                      : "border-white/10 text-white/60 hover:text-white"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Data Saver</p>
              <p className="text-xs text-white/60">Reduce bandwidth usage when enabled.</p>
            </div>
            <button
              onClick={() => setDataSaver((prev) => !prev)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.2em] border ${
                dataSaver ? "border-emerald-300 text-emerald-200" : "border-white/10 text-white/60"
              }`}
            >
              {dataSaver ? "On" : "Off"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
