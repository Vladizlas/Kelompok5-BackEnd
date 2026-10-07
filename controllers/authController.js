import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET || "belajar-react-jwt-rahasia";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ================================
    // VALIDASI INPUT
    // ================================

    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Email dan password wajib diisi",
      });
    }

    // ================================
    // CARI USER BERDASARKAN EMAIL
    // ================================

    const user = await User.findOne({
      where: {
        email: email.trim(),
      },
    });

    // ================================
    // USER TIDAK DITEMUKAN
    // ================================

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Email atau password salah",
      });
    }

    // ================================
    // CEK PASSWORD DENGAN BCRYPT
    // ================================

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        status: "fail",
        message: "Email atau password salah.",
      });
    }

    // ================================
    // LOGIN BERHASIL
    // ================================

    return res.status(200).json({
      status: "success",
      message:
        "Login berhasil, selamat datang di Fanara Laundry!",
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, // Sertakan role jika ada
        },
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "role"],
    });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User tidak ditemukan",
      });
    }

    return res.status(200).json({ 
      status: "success",
      data: user 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan pada server",
    });
  }
};
