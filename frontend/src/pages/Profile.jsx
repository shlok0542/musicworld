import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getProfile, updateProfile } from "../services/userService.js";
import { useUI } from "../context/UIContext.jsx";

const Profile = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast, startLoading, stopLoading } = useUI();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }
    getProfile()
      .then((data) => {
        setProfile(data);
        setName(data?.name || "");
        setAvatar(data?.avatar || "");
        setAvatarPreview(data?.avatar || "");
      })
      .catch(() => undefined);
  }, [token]);

  const handleSave = async () => {
    startLoading();
    try {
      const updated = await updateProfile({
        name,
        avatar: avatarPreview || avatar
      });
      setProfile(updated);
      setEditing(false);
      localStorage.setItem("mw-user", JSON.stringify(updated));
      showToast({ type: "success", message: "Profile updated." });
    } catch {
      showToast({ type: "error", message: "Failed to update profile." });
    } finally {
      stopLoading();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result?.toString() || "";
      setAvatarPreview(result);
    };
    reader.readAsDataURL(file);
  };

  if (!token) return null;

  return (
    <div className="px-4 sm:px-6 lg:px-10 pb-36">
      <div className="glass rounded-3xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">Profile</p>
            <h2 className="text-2xl md:text-3xl font-semibold mt-2">Welcome back</h2>
          </div>
          <button
            className="px-4 py-2 rounded-full text-xs uppercase tracking-[0.2em] border border-white/10 text-white/70 hover:text-white"
            onClick={() => setEditing((prev) => !prev)}
          >
            {editing ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="mt-6 grid md:grid-cols-[160px_1fr] gap-6 items-start">
          <div className="flex flex-col items-center gap-3">
            <img
              src={
                avatarPreview ||
                avatar ||
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80&auto=format"
              }
              alt="profile"
              className="h-36 w-36 rounded-full object-cover border border-white/20"
            />
            {editing && (
              <div className="w-full space-y-2">
                <label className="text-xs text-white/60">Choose from gallery</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-white/60"
                />
                <input
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="Or paste image URL"
                  className="w-full bg-transparent border border-white/10 rounded-2xl px-3 py-2 text-xs"
                />
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="glass rounded-2xl p-4">
              <p className="text-xs text-white/50 uppercase tracking-[0.3em]">Name</p>
              {editing ? (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full bg-transparent border border-white/10 rounded-xl px-3 py-2 text-sm"
                />
              ) : (
                <p className="text-lg font-semibold mt-2">{profile?.name || "User"}</p>
              )}
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
        </div>

        {editing && (
          <button
            className="mt-6 px-4 py-3 rounded-2xl bg-emerald-400 text-slate-900 font-semibold"
            onClick={handleSave}
          >
            Save Changes
          </button>
        )}

        <button
          className="mt-6 ml-3 px-4 py-3 rounded-2xl border border-white/10 text-white/70 hover:text-white"
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
