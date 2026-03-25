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
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-6 md:gap-10 items-center">
        <div className="hidden lg:block">
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
          className="rounded-[32px] p-[1px] bg-gradient-to-br from-emerald-400/40 via-cyan-400/10 to-slate-900/10 shadow-glow"
        >
          <div className="glass rounded-[32px] p-6">
            <div className="flex items-center gap-2 bg-slate-950/60 rounded-full p-1 border border-white/10 auth-tabs">
              <button
                className={`flex-1 px-4 py-2 rounded-full text-xs uppercase tracking-[0.2em] ${
                  mode === "login"
                    ? "bg-emerald-400 text-slate-900 font-semibold"
                    : "text-white/60 hover:text-white"
                }`}
                onClick={() => setMode("login")}
              >
                Login
              </button>
              <button
                className={`flex-1 px-4 py-2 rounded-full text-xs uppercase tracking-[0.2em] ${
                  mode === "signup"
                    ? "bg-emerald-400 text-slate-900 font-semibold"
                    : "text-white/60 hover:text-white"
                }`}
                onClick={() => setMode("signup")}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {mode === "signup" && (
                <label className="block">
                  <span className="text-xs uppercase tracking-[0.2em] text-white/50">Full name</span>
                  <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 auth-field">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-white/50" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c2-4 14-4 16 0" />
                    </svg>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full bg-transparent outline-none text-sm"
                    />
                  </div>
                </label>
              )}

              <label className="block">
                <span className="text-xs uppercase tracking-[0.2em] text-white/50">Email</span>
                <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 auth-field">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-white/50" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 6h16v12H4z" />
                    <path d="M4 7l8 6 8-6" />
                  </svg>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@email.com"
                    className="w-full bg-transparent outline-none text-sm"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-[0.2em] text-white/50">Password</span>
                <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 auth-field">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-white/50" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="4" y="10" width="16" height="10" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-transparent outline-none text-sm"
                  />
                </div>
              </label>

              {error && <p className="text-xs text-rose-300">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-5 py-3 rounded-2xl bg-emerald-400 text-slate-900 font-semibold"
              >
                {loading ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
              </button>
              <p className="text-xs text-white/50 text-center">
                By continuing, you agree to MusicWorlds terms and privacy.
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
