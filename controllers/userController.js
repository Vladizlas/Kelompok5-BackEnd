import User from "../models/User.js";
import bcrypt from "bcrypt";

// 1. Ambil Semua Data User (GET /api/users)
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "createdAt", "updatedAt"], // Menyembunyikan password
      order: [["id", "DESC"]], // Urutkan dari data terbaru
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 2. Ambil Single User berdasarkan ID (GET /api/users/:id)
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id, {
      attributes: ["id", "name", "email", "role", "createdAt", "updatedAt"],
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 3. Tambah User Baru (POST /api/users)
export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validasi bidang wajib
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Nama, email, dan password wajib diisi" });
  }

  try {
    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah digunakan oleh user lain" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role, // Default role ke 'kasir' jika tidak diisi
    });

    // Sanitasi data response (hapus password dari payload balikan)
    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };

    return res.status(201).json({
      message: "User berhasil dibuat",
      data: userResponse,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 4. Update User (PUT /api/users/:id)
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, password } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // Cek jika email diubah dan email baru sudah dipakai user lain
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Email sudah digunakan oleh user lain" });
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    // Hanya update password jika dikirim dari frontend/form
    if (password && password.trim() !== "") {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    // Sanitasi response
    const updatedResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      updatedAt: user.updatedAt,
    };

    return res.status(200).json({
      message: "User berhasil diperbarui",
      data: updatedResponse,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 5. Hapus User (DELETE /api/users/:id)
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    await user.destroy();
    return res.status(200).json({ message: "User berhasil dihapus" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};