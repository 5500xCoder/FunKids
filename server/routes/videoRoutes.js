import express from "express";
import { getVideos, getFeaturedVideo } from "../controllers/videoController.js";

const router = express.Router();

router.get("/", getVideos);
router.get("/featured", getFeaturedVideo);

export default router;
