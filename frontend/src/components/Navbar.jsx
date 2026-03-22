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

const MenuButton = ({ onClick, open }) => (
  <button
    type="button"
    aria-label="Open menu"
    onClick={onClick}
    className={`h-10 w-10 rounded-full flex items-center justify-center border ${
      open ? "border-emerald-300 text-emerald-200" : "border-white/10 text-white/70"
    } bg-white/5 hover:text-white hover:border-white/30`}
  >
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  </button>
);

const MenuPanel = ({ onClose, isLoggedIn, onLogin }) => (
  <div className="absolute right-0 mt-4 w-64 glass rounded-2xl p-4 shadow-glass z-50">
    <div className="flex items-center justify-between">
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Quick Menu</p>
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="text-white/60 hover:text-white"
      >
        ✕
      </button>
    </div>
    <div className="mt-4 space-y-2">
      {isLoggedIn ? (
        <>
          <NavLink to="/profile" className="block rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/10">
            Profile
          </NavLink>
          <NavLink to="/playlists" className="block rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/10">
            Playlists
          </NavLink>
          <NavLink to="/history" className="block rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/10">
            History
          </NavLink>
          <NavLink to="/settings" className="block rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/10">
            Settings
          </NavLink>
          <div className="rounded-xl px-3 py-2 text-sm text-white/80 bg-white/5">
            Theme
            <div className="mt-2">
              <ThemeToggle />
            </div>
          </div>
        </>
      ) : (
        <div className="grid gap-2">
          <button
            type="button"
            onClick={onLogin}
            className="w-full px-3 py-2 rounded-xl text-xs uppercase tracking-[0.2em] border border-white/10 text-white/70 hover:text-white"
          >
            Login
          </button>
          <button
            type="button"
            onClick={onLogin}
            className="w-full px-3 py-2 rounded-xl text-xs uppercase tracking-[0.2em] bg-emerald-400 text-slate-900 font-semibold"
          >
            Create Account
          </button>
        </div>
      )}
    </div>
  </div>
);

const Navbar = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    const handleClick = (event) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [menuOpen]);

  return (
    <header className="relative z-40 flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-4 sm:px-6 lg:px-10 py-4">
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
        {user && <NavItem to="/playlists" label="Playlists" />}
        <NavItem to="/player" label="Player" />
      </nav>
      <div ref={menuRef} className="flex flex-wrap items-center gap-3 relative">
        {user && token && (
          <button
            className="text-xs uppercase tracking-[0.2em] text-white/70 hover:text-white"
            onClick={logout}
          >
            Logout
          </button>
        )}
        <MenuButton open={menuOpen} onClick={() => setMenuOpen((prev) => !prev)} />
        {menuOpen && (
          <MenuPanel
            onClose={() => setMenuOpen(false)}
            isLoggedIn={!!user}
            onLogin={() => {
              setMenuOpen(false);
              navigate("/auth");
            }}
          />
        )}
      </div>
    </header>
  );
};

export default Navbar;
