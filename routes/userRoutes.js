import express from "express";
import { getUsers, createUser, updateUser, deleteUser } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Terapkan authMiddleware ke semua rute user
router.get("/", authMiddleware, getUsers);
router.post("/", authMiddleware, createUser);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

export default router;