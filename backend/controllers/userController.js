import User from "../models/User.js";

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const toggleLike = async (req, res, next) => {
  try {
    const { song } = req.body;
    if (!song || !song.songId) {
      return res.status(400).json({ message: "Song payload missing" });
    }
    const user = await User.findById(req.user.id);
    const exists = user.likedSongs.some((s) => s.songId === song.songId);
    if (exists) {
      user.likedSongs = user.likedSongs.filter((s) => s.songId !== song.songId);
    } else {
      user.likedSongs.push(song);
    }
    await user.save();
    res.json({ likedSongs: user.likedSongs });
  } catch (err) {
    next(err);
  }
};

export const addHistory = async (req, res, next) => {
  try {
    const { song } = req.body;
    if (!song || !song.songId) {
      return res.status(400).json({ message: "Song payload missing" });
    }
    const user = await User.findById(req.user.id);
    user.history = user.history.filter((s) => s.songId !== song.songId);
    user.history.unshift(song);
    user.history = user.history.slice(0, 50);
    await user.save();
    res.json({ history: user.history });
  } catch (err) {
    next(err);
  }
};
