import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  addSongToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylists,
  removeSongFromPlaylist
} from "../controllers/playlistController.js";

const router = Router();

router.use(authMiddleware);
router.get("/", getPlaylists);
router.post("/", createPlaylist);
router.delete("/:id", deletePlaylist);
router.post("/:id/songs", addSongToPlaylist);
router.delete("/:id/songs/:songId", removeSongFromPlaylist);

export default router;
