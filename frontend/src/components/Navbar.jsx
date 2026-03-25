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

const MenuPanel = ({ onClose, isLoggedIn, onLogin, onLogout }) => (
  <div className="menu-panel absolute left-1 mt-3 w-64 rounded-2xl p-4 shadow-glass z-50 border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
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
    <div className="mt-[10rem] space-y-2">
      {isLoggedIn ? (
        <>
          <NavLink to="/" className="block rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/10">
            <span className="inline-flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-10.5z" />
              </svg>
              Home
            </span>
          </NavLink>
          <NavLink to="/playlists" className="block rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/10">
            <span className="inline-flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h10" />
              </svg>
              Library
            </span>
          </NavLink>
          <NavLink to="/history" className="block rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/10">
            <span className="inline-flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 1 0 3-6.7" />
                <path d="M3 3v6h6" />
                <path d="M12 7v5l3 3" />
              </svg>
              History
            </span>
          </NavLink>
          <NavLink to="/settings" className="block rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/10">
            <span className="inline-flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" />
                <path d="M19.4 15a7.8 7.8 0 0 0 .1-6l2-1.1-2-3.4-2.3 1a7.8 7.8 0 0 0-5.2-2L11 1H7l-.9 2.5a7.8 7.8 0 0 0-5.2 2l-2.3-1-2 3.4 2 1.1a7.8 7.8 0 0 0 .1 6L-3.4 16l2 3.4 2.3-1a7.8 7.8 0 0 0 5.2 2L7 23h4l.9-2.5a7.8 7.8 0 0 0 5.2-2l2.3 1 2-3.4-2-1.1z" />
              </svg>
              Settings
            </span>
          </NavLink>
          <button
            type="button"
            onClick={onLogout}
            className="w-full text-left rounded-xl px-3 py-2 text-sm text-rose-200 hover:bg-rose-500/10"
          >
            <span className="inline-flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 17l5-5-5-5" />
                <path d="M15 12H3" />
                <path d="M21 4v16" />
              </svg>
              Logout
            </span>
          </button>
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
            onLogout={() => {
              logout();
              setMenuOpen(false);
              navigate("/");
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
        <form
          onSubmit={handleSearch}
          className="nav-search hidden sm:flex items-center gap-3 rounded-full px-4 py-2 border border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 shadow-glow"
        >
          <div className="h-8 w-8 rounded-full bg-emerald-400/15 text-emerald-200 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search artists, playlists, moods"
            className="bg-transparent outline-none text-sm w-48 text-white/80 placeholder:text-white/40"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.3em] bg-emerald-400 text-slate-900 font-semibold"
          >
            Go
          </button>
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
          className="h-10 w-10 rounded-full border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center text-white/70 hover:text-white"
          aria-label="Profile"
        >
          {user?.avatar ? (
            <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c2-4 14-4 16 0" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
