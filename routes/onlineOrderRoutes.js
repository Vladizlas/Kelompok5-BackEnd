import express from "express";

import {
  getOnlineOrders,
  createOnlineOrder,
  updateOnlineOrderStatus,
} from "../controllers/onlineOrderController.js";

const router = express.Router();

// publik: dipakai modal pesan via WhatsApp
router.post("/", createOnlineOrder);

// admin
router.get("/", getOnlineOrders);

router.patch("/:id/status", updateOnlineOrderStatus);

export default router;