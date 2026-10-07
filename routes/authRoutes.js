import express from "express";
import { login, getMe } from "../controllers/authController.js";
import { getUsers } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.get("/users", authMiddleware, getUsers); // Memanggil http://localhost:3000/api/auth/users

export default router;