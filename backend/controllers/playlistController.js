import Playlist from "../models/Playlist.js";

export const createPlaylist = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Playlist name required" });
    }
    const playlist = await Playlist.create({
      name,
      userId: req.user.id,
      songs: []
    });
    res.status(201).json(playlist);
  } catch (err) {
    next(err);
  }
};

export const getPlaylists = async (req, res, next) => {
  try {
    const playlists = await Playlist.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.json(playlists);
  } catch (err) {
    next(err);
  }
};

export const addSongToPlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const song = req.body.song;
    if (!song || !song.songId) {
      return res.status(400).json({ message: "Song payload missing" });
    }
    const playlist = await Playlist.findOne({ _id: id, userId: req.user.id });
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    const exists = playlist.songs.some((s) => s.songId === song.songId);
    if (!exists) {
      playlist.songs.push(song);
      await playlist.save();
    }
    res.json(playlist);
  } catch (err) {
    next(err);
  }
};

export const removeSongFromPlaylist = async (req, res, next) => {
  try {
    const { id, songId } = req.params;
    const playlist = await Playlist.findOne({ _id: id, userId: req.user.id });
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    playlist.songs = playlist.songs.filter((s) => s.songId !== songId);
    await playlist.save();
    res.json(playlist);
  } catch (err) {
    next(err);
  }
};

export const deletePlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const playlist = await Playlist.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    res.json({ message: "Playlist deleted", id });
  } catch (err) {
    next(err);
  }
};
