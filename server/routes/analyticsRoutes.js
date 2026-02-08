import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { trackVideo, getAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

router.post("/track", trackVideo);
router.get("/", requireAuth, getAnalytics);

export default router;
