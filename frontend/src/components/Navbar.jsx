import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle.jsx";
import { useAuth } from "../context/AuthContext.jsx";

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
  <div className="absolute left-0 mt-4 w-64 glass rounded-2xl p-4 shadow-glass z-50">
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
    <div className="mt-20 space-y-2">
      {isLoggedIn ? (
        <>
          <NavLink to="/" className="block rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/10">
            Home
          </NavLink>
          <NavLink to="/playlists" className="block rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/10">
            Library
          </NavLink>
          <NavLink to="/history" className="block rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/10">
            History
          </NavLink>
          <NavLink to="/settings" className="block rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/10">
            Settings
          </NavLink>
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
  const [search, setSearch] = React.useState("");
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/search?q=${encodeURIComponent(search.trim())}`);
  };

  const handleProfile = () => {
    if (user && token) {
      navigate("/profile");
    } else {
      navigate("/auth");
    }
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-10 py-4 backdrop-blur-xl bg-slate-950/70 border-b border-white/5">
      <div className="flex items-center gap-3" ref={menuRef}>
        <MenuButton open={menuOpen} onClick={() => setMenuOpen((prev) => !prev)} />
        {menuOpen && (
          <MenuPanel
            onClose={() => setMenuOpen(false)}
            isLoggedIn={!!user && !!token}
            onLogin={() => {
              setMenuOpen(false);
              navigate("/auth");
            }}
          />
        )}
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="MusicWorlds"
            className="h-10 w-10 rounded-2xl object-cover shadow-glow"
          />
          <div className="hidden sm:block">
            <p className="text-lg font-semibold">MusicWorlds</p>
            <p className="text-xs text-white/60">Immersive streaming</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <form onSubmit={handleSearch} className="hidden sm:flex items-center gap-2 glass rounded-full px-3 py-2">
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-white/60" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="bg-transparent outline-none text-sm w-44"
          />
        </form>
        <button
          type="button"
          onClick={() => navigate("/search")}
          className="sm:hidden h-10 w-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-white"
          aria-label="Search"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
        </button>
        <button
          type="button"
          onClick={handleProfile}
          className="h-10 w-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-white"
          aria-label="Profile"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c2-4 14-4 16 0" />
          </svg>
        </button>
        {user && token && (
          <button
            className="text-xs uppercase tracking-[0.2em] text-white/70 hover:text-white"
            onClick={logout}
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
