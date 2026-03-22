import mongoose from "mongoose";

const SongSchema = new mongoose.Schema(
  {
    songId: { type: String, required: true },
    title: { type: String, required: true },
    artist: { type: String, default: "" },
    image: { type: String, default: "" },
    duration: { type: Number, default: 0 },
    url: { type: String, default: "" }
  },
  { _id: false }
);

const PlaylistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    songs: { type: [SongSchema], default: [] },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Playlist", PlaylistSchema);
