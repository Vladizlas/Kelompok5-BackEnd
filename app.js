import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Endpoint tidak ditemukan.",
  });
});

export default app;
