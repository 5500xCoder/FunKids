import express from "express";
import { createContactMessage, getContactMessages } from "../controllers/contactController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", createContactMessage);
router.get("/", requireAuth, getContactMessages);

export default router;
