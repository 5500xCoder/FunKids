import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getAllChannels,
  lookupChannels,
  createChannel,
  updateChannel,
  deleteChannel,
  syncChannel
} from "../controllers/ytChannelController.js";

const router = express.Router();

router.get("/", requireAuth, getAllChannels);
router.post("/lookup", requireAuth, lookupChannels);
router.post("/", requireAuth, createChannel);
router.put("/:id", requireAuth, updateChannel);
router.delete("/:id", requireAuth, deleteChannel);
router.post("/:id/sync", requireAuth, syncChannel);

export default router;
