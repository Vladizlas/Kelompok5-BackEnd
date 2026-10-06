import User from "../models/User.js";

// GET ALL USERS
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role"],
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE USER
export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const newUser = await User.create({ name, email, password, role });
    res.status(201).json({ message: "User Berhasil Ditambahkan", data: newUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE USER
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    user.name = name || user.name;
    user.email = email || user.email;
    if (password) user.password = password;
    user.role = role || user.role;

    await user.save();
    res.status(200).json({ message: "User Berhasil Diperbarui" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    await user.destroy();
    res.status(200).json({ message: "User Berhasil Dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};