import express from "express";

import {
  getServicePrices,
  getServicePrice,
  createServicePrice,
  updateServicePrice,
  deleteServicePrice,
} from "../controllers/servicePriceController.js";

const router = express.Router();

router.get("/", getServicePrices);

router.get("/:id", getServicePrice);

router.post("/", createServicePrice);

router.put("/:id", updateServicePrice);

router.delete("/:id", deleteServicePrice);

export default router;
