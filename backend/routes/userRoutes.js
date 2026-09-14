import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { addHistory, clearHistory, deleteHistorySong, getProfile, toggleLike, updateProfile } from "../controllers/userController.js";

const router = Router();

router.use(authMiddleware);
router.get("/me", getProfile);
router.patch("/me", updateProfile);
router.post("/likes", toggleLike);
router.post("/history", addHistory);
router.delete("/history/:songId", deleteHistorySong);
router.delete("/history", clearHistory);

export default router;
