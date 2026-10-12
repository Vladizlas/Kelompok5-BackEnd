import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

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
    // GENERATE JWT TOKEN
    // ================================
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role || "user" 
      },
      JWT_SECRET,
      { expiresIn: "1d" } // Token berlaku 1 hari
    );

    // ================================
    // LOGIN BERHASIL
    // ================================
    return res.status(200).json({
      status: "success",
      message: "Login berhasil, selamat datang di Fanara Laundry!",
      data: {
        token,
        user: {
          id: user.id,
          nama: user.nama || user.name, // Disesuaikan dengan field database
          email: user.email,
          role: user.role,
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
      attributes: ["id", "nama", "email", "role"],
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

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { nama, name, email, currentPassword, newPassword } = req.body;

    if (!userId) {
      return res.status(401).json({
        status: "fail",
        message: "Autentikasi tidak valid",
      });
    }

    // Cari akun berdasarkan ID dari token, bukan ID dari request.
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User tidak ditemukan",
      });
    }

    const updatedNama = (nama ?? name)?.trim();
    const updatedEmail = email?.trim();

    // Validasi nama dan email.
    if (!updatedNama || !updatedEmail) {
      return res.status(400).json({
        status: "fail",
        message: "Nama dan email wajib diisi",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatedEmail)) {
      return res.status(400).json({
        status: "fail",
        message: "Format email tidak valid",
      });
    }

    // Periksa apakah email sudah digunakan akun lain.
    const existingUser = await User.findOne({
      where: { email: updatedEmail },
    });

    if (existingUser && String(existingUser.id) !== String(user.id)) {
      return res.status(409).json({
        status: "fail",
        message: "Email sudah digunakan oleh akun lain",
      });
    }

    // Jika ingin mengganti password, verifikasi password saat ini.
    if (newPassword !== undefined && newPassword !== "") {
      if (!currentPassword) {
        return res.status(400).json({
          status: "fail",
          message: "Password saat ini wajib diisi",
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          status: "fail",
          message: "Password baru minimal 8 karakter",
        });
      }

      const passwordMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!passwordMatch) {
        return res.status(400).json({
          status: "fail",
          message: "Password saat ini salah",
        });
      }

      user.password = await bcrypt.hash(newPassword, 10);
    }

    // Perbarui profil. Role tidak bisa diubah melalui endpoint ini.
    user.nama = updatedNama;
    user.email = updatedEmail;

    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Profil berhasil diperbarui",
      data: {
        user: {
          id: user.id,
          nama: user.nama,
          name: user.nama,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    // Menangani email duplikat jika ada unique constraint di database.
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        status: "fail",
        message: "Email sudah digunakan oleh akun lain",
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan saat memperbarui profil",
    });
  }
};