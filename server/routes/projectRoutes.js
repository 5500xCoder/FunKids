import express from "express";
import { createProject, deleteProject, getProjects, updateProject } from "../controllers/projectController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getProjects);
router.post("/", requireAuth, createProject);
router.put("/:id", requireAuth, updateProject);
router.delete("/:id", requireAuth, deleteProject);

export default router;
