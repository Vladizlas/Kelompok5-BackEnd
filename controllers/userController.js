import User from "../models/User.js";
import bcrypt from "bcrypt";

// ======================================================
// GET ALL USERS
// GET /api/users
// ======================================================

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "name",
        "email",
        "role",
        "createdAt",
        "updatedAt",
      ],
      order: [["id", "ASC"]],
    });

    return res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (error) {
    console.error("Get Users Error:", error);

    return res.status(500).json({
      status: "error",
      message: "Gagal mengambil data user.",
    });
  }
};

// =====================================================
// GET USER BY ID
// GET /api/users/:id
// =====================================================

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: [
        "id",
        "name",
        "email",
        "role",
        "createdAt",
        "updatedAt",
      ],
    });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User tidak ditemukan.",
      });
    }

    return res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    console.error("Get User Error:", error);

    return res.status(500).json({
      status: "error",
      message: "Gagal mengambil data user.",
    });
  }
};

// =====================================================
// CREATE USER
// POST /api/users
// =====================================================

export const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
    } = req.body;

    // Validasi
    if (!name || !email || !password) {
      return res.status(400).json({
        status: "fail",
        message:
          "Nama, email, dan password wajib diisi.",
      });
    }

    // Cek email
    const existingUser = await User.findOne({
      where: {
        email: email.trim(),
      },
    });

    if (existingUser) {
      return res.status(409).json({
        status: "fail",
        message: "Email sudah digunakan.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      name: name.trim(),
      email: email.trim(),
      password: hashedPassword,
      role: role || "staff",
    });

    return res.status(201).json({
      status: "success",
      message: "User berhasil ditambahkan.",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Create User Error:", error);

    return res.status(500).json({
      status: "error",
      message: "Gagal menambahkan user.",
    });
  }
};

// =====================================================
// UPDATE USER
// PUT /api/users/:id
// =====================================================

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      password,
      role,
    } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User tidak ditemukan.",
      });
    }

    // Update data dasar
    if (name !== undefined) {
      user.name = name.trim();
    }

    if (email !== undefined) {
      user.email = email.trim();
    }

    if (role !== undefined) {
      user.role = role;
    }

    // Jika password diubah,
    // hash password baru
    if (password && password.trim()) {
      user.password = await bcrypt.hash(
        password,
        10
      );
    }

    await user.save();

    return res.status(200).json({
      status: "success",
      message: "User berhasil diupdate.",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update User Error:", error);

    return res.status(500).json({
      status: "error",
      message: "Gagal mengupdate user.",
    });
  }
};

// =====================================================
// DELETE USER
// DELETE /api/users/:id
// =====================================================

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User tidak ditemukan.",
      });
    }

    await user.destroy();

    return res.status(200).json({
      status: "success",
      message: "User berhasil dihapus.",
    });
  } catch (error) {
    console.error("Delete User Error:", error);

    return res.status(500).json({
      status: "error",
      message: "Gagal menghapus user.",
    });
  }
};
