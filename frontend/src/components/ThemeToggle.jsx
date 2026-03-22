import React from "react";
import { useTheme } from "../context/ThemeContext.jsx";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="px-3 py-2 rounded-full text-xs uppercase tracking-[0.2em] border border-white/15 text-white/70 hover:text-white"
    >
      {isDark ? "Light" : "Dark"}
    </button>
  );
};

export default ThemeToggle;
