import express from "express";
import { getActiveChannels, getChannelById } from "../controllers/ytChannelController.js";

const router = express.Router();

router.get("/", getActiveChannels);
router.get("/:id", getChannelById);

export default router;
