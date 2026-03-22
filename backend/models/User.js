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

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    likedSongs: { type: [SongSchema], default: [] },
    history: { type: [SongSchema], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
