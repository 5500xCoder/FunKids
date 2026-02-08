import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { createOrder, getOrders } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/", requireAuth, getOrders);

export default router;
