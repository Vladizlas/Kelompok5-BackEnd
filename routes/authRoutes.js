import express from "express";
import {
  login,
  getMe,
  updateProfile,
} from "../controllers/authController.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { getUsers } from "../controllers/userController.js";

const router = express.Router();

router.post("/login", login);
router.get("/me", authMiddleware, getMe);

// Profil akun yang sedang login
router.put("/profile", authMiddleware, updateProfile);

// Endpoint ini sebaiknya hanya tersedia untuk Owner.
// Idealnya gunakan verifyToken dan authorizeRoles("owner")
// sesuai middleware yang diterapkan pada route User.
router.get("/users", authMiddleware, getUsers);

export default router;