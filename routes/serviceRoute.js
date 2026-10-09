import express from "express";

// Import Named Export dari controller
import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";

import { verifyToken, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

// GET: Akses Kasir, Admin, Owner
router.get(
  "/",
  verifyToken,
  authorizeRoles("kasir", "admin", "owner"),
  getServices
);

// GET BY ID: Akses Kasir, Admin, Owner
router.get(
  "/:id",
  verifyToken,
  authorizeRoles("kasir", "admin", "owner"),
  getService
);

// POST: Akses Admin & Owner
router.post(
  "/",
  verifyToken,
  authorizeRoles("admin", "owner"),
  createService
);

// PUT: Akses Admin & Owner
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "owner"),
  updateService
);

// DELETE: Akses Admin & Owner
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "owner"),
  deleteService
);

export default router;