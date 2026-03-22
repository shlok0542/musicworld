import { Router } from "express";
import { search, songById } from "../controllers/musicController.js";

const router = Router();

router.get("/search", search);
router.get("/song/:id", songById);

export default router;
