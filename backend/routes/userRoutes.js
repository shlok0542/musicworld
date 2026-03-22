import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { addHistory, getProfile, toggleLike } from "../controllers/userController.js";

const router = Router();

router.use(authMiddleware);
router.get("/me", getProfile);
router.post("/likes", toggleLike);
router.post("/history", addHistory);

export default router;
