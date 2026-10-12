import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Token tidak ditemukan",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Sesuaikan dengan struktur payload JWT saat login.
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token tidak valid atau sudah kedaluwarsa",
    });
  }
};

export const authMiddleware = verifyToken;

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const role = (req.user?.role || "").toLowerCase();

    if (!roles.includes(role)) {
      return res.status(403).json({
        message: "Kamu tidak memiliki akses ke fitur ini",
      });
    }

    next();
  };
};