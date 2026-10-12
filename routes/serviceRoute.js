import express from "express";

import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";

import {
  verifyToken,
  authorizeRoles,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// GET ALL SERVICES: Public
router.get("/", getServices);

// GET SERVICE BY ID: Public
router.get("/:id", getService);

// CREATE SERVICE: Admin & Owner
router.post(
  "/",
  verifyToken,
  authorizeRoles("admin", "owner"),
  createService
);

// UPDATE SERVICE: Admin & Owner
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "owner"),
  updateService
);

// DELETE SERVICE: Admin & Owner
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "owner"),
  deleteService
);

export default router;