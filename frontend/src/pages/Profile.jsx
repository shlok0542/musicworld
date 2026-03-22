import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getProfile } from "../services/userService.js";

const Profile = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }
    getProfile()
      .then(setProfile)
      .catch(() => undefined);
  }, [token]);

  if (!token) return null;

  return (
    <div className="px-4 sm:px-6 lg:px-10 pb-36">
      <div className="glass rounded-3xl p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">Profile</p>
        <h2 className="text-2xl md:text-3xl font-semibold mt-2">Welcome back</h2>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="glass rounded-2xl p-4">
            <p className="text-xs text-white/50 uppercase tracking-[0.3em]">Name</p>
            <p className="text-lg font-semibold mt-2">{profile?.name || "User"}</p>
          </div>
          <div className="glass rounded-2xl p-4">
            <p className="text-xs text-white/50 uppercase tracking-[0.3em]">Email</p>
            <p className="text-sm mt-2 break-all">{profile?.email || ""}</p>
          </div>
          <div className="glass rounded-2xl p-4">
            <p className="text-xs text-white/50 uppercase tracking-[0.3em]">Library</p>
            <p className="text-sm mt-2">Liked: {profile?.likedSongs?.length || 0}</p>
            <p className="text-sm">History: {profile?.history?.length || 0}</p>
          </div>
        </div>

        <button
          className="mt-6 px-4 py-3 rounded-2xl border border-white/10 text-white/70 hover:text-white"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;