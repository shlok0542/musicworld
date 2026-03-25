import { Router } from "express";
import {
  search,
  songById,
  searchAlbumsController,
  searchPlaylistsController,
  searchArtistsController,
  searchGlobalController,
  playlistById
} from "../controllers/musicController.js";

const router = Router();

router.get("/search", search);
router.get("/search/albums", searchAlbumsController);
router.get("/search/playlists", searchPlaylistsController);
router.get("/search/artists", searchArtistsController);
router.get("/search/global", searchGlobalController);
router.get("/song/:id", songById);
router.get("/playlist/:id", playlistById);

export default router;
