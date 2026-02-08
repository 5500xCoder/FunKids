import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  listAdmins,
  createAdmin,
  resetAdminPassword,
  deleteAdmin
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/", requireAuth, listAdmins);
router.post("/", requireAuth, createAdmin);
router.patch("/:id/password", requireAuth, resetAdminPassword);
router.delete("/:id", requireAuth, deleteAdmin);

export default router;
