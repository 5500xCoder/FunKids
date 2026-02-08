import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
  applyToJob,
  getApplications
} from "../controllers/jobController.js";

const router = express.Router();

router.get("/", getJobs);
router.post("/", requireAuth, createJob);
router.put("/:id", requireAuth, updateJob);
router.delete("/:id", requireAuth, deleteJob);
router.post("/:id/apply", applyToJob);
router.get("/applications/all", requireAuth, getApplications);

export default router;
