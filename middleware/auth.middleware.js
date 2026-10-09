import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "belajar-react-jwt-rahasia";

// Middleware 1: Verifikasi Token JWT
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Token tidak tersedia",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Menyimpan payload user (id, email, role, dll) ke request
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token tidak valid atau sudah kedaluwarsa",
    });
  }
};

// Alias jika masih ada file lain yang memakai nama 'authMiddleware'
export const authMiddleware = verifyToken;

// Middleware 2: Otorisasi Berdasarkan Role (Role-Based Access Control)
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role?.toLowerCase())) {
      return res.status(403).json({
        message: `Akses ditolak. Rute ini hanya untuk role: ${allowedRoles.join(", ")}`,
      });
    }
    next();
  };
};