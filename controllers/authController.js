import User from "../models/User.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validasi input
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Email dan password wajib diisi.",
      });
    }

    // 2. Cari user berdasarkan email di database
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    // 3. Jika user tidak ditemukan atau password tidak cocok
    if (!user || user.password !== password) {
      return res.status(401).json({
        status: "fail",
        message: "Email atau password salah.",
      });
    }

    // 4. Respons sukses jika login berhasil
    return res.status(200).json({
      status: "success",
      message: "Login berhasil, selamat datang di Fanara Laundry!",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan pada server.",
    });
  }
};