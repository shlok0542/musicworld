import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { login, signup } from "../services/authService.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useUI } from "../context/UIContext.jsx";

const Auth = () => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login: setSession } = useAuth();
  const { showToast, startLoading, stopLoading } = useUI();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    startLoading();
    try {
      const payload = mode === "login" ? await login(form) : await signup(form);
      setSession(payload);
      showToast({ type: "success", message: mode === "login" ? "Welcome back!" : "Account created." });
      navigate("/");
    } catch (err) {
      setError("Authentication failed. Please try again.");
      showToast({ type: "error", message: "Authentication failed." });
    } finally {
      setLoading(false);
      stopLoading();
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10 pb-36">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-6 md:gap-8 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">MusicWorlds</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mt-4">
            Your world. Your wave. One account.
          </h1>
          <p className="text-white/70 mt-4">
            Save playlists, sync likes, and jump back into your latest sessions across devices.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {["Stream personal rooms", "Build neon playlists", "Sync your history"].map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-full border border-white/10 text-xs uppercase tracking-[0.3em] text-white/60"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[32px] p-6"
        >
          <div className="flex items-center gap-3">
            <button
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.2em] border ${
                mode === "login" ? "border-emerald-300 text-emerald-200" : "border-white/10 text-white/60"
              }`}
              onClick={() => setMode("login")}
            >
              Login
            </button>
            <button
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.2em] border ${
                mode === "signup" ? "border-emerald-300 text-emerald-200" : "border-white/10 text-white/60"
              }`}
              onClick={() => setMode("signup")}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full name"
                className="w-full bg-transparent border border-white/10 rounded-2xl px-4 py-3"
              />
            )}
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full bg-transparent border border-white/10 rounded-2xl px-4 py-3"
            />
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full bg-transparent border border-white/10 rounded-2xl px-4 py-3"
            />

            {error && <p className="text-xs text-rose-300">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-5 py-3 rounded-2xl bg-emerald-400 text-slate-900 font-semibold"
            >
              {loading ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
