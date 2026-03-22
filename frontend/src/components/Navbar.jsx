import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const NavItem = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-2 rounded-full text-sm tracking-wide transition ${
        isActive
          ? "bg-white/15 text-white"
          : "text-white/70 hover:text-white hover:bg-white/10"
      }`
    }
  >
    {label}
  </NavLink>
);

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-4 sm:px-6 lg:px-10 py-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-glow" />
        <div>
          <p className="text-lg font-semibold">MusicWorld</p>
          <p className="text-xs text-white/60">Immersive streaming</p>
        </div>
      </div>
      <nav className="flex flex-wrap items-center gap-2 glass px-3 py-2 rounded-full">
        <NavItem to="/" label="Home" />
        <NavItem to="/search" label="Search" />
        <NavItem to="/playlists" label="Playlists" />
        <NavItem to="/player" label="Player" />
      </nav>
      <div className="flex flex-wrap items-center gap-3">
        <ThemeToggle />
        {user ? (
          <button
            className="text-xs uppercase tracking-[0.2em] text-white/70 hover:text-white"
            onClick={logout}
          >
            Logout
          </button>
        ) : (
          <>
            <button
              className="px-3 py-2 rounded-full text-xs uppercase tracking-[0.2em] border border-white/10 text-white/70 hover:text-white"
              onClick={() => navigate("/auth")}
            >
              Login
            </button>
            <button
              className="px-3 py-2 rounded-full text-xs uppercase tracking-[0.2em] bg-emerald-400 text-slate-900 font-semibold"
              onClick={() => navigate("/auth")}
            >
              Create Account
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
