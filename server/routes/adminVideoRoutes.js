import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { createVideo, deleteVideo } from "../controllers/videoController.js";

const router = express.Router();

router.post("/", requireAuth, createVideo);
router.delete("/:id", requireAuth, deleteVideo);

export default router;
