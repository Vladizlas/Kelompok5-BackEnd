import express from "express";

import {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  updateOrderStatus,
  trackOrder,
  deleteOrder,
} from "../controllers/orderController.js";

const router = express.Router();

// publik: cek status via nomor invoice (harus sebelum "/:id")
router.get("/track/:invoice", trackOrder);

router.get("/", getOrders);

router.get("/:id", getOrder);

router.post("/", createOrder);

router.put("/:id", updateOrder);

router.patch("/:id/status", updateOrderStatus);

router.delete("/:id", deleteOrder);

export default router;