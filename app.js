import express from "express";
import cors from "cors";

import authRoute from "./routes/authRoutes.js";
import productRoute from "./routes/productRoutes.js";
import userRoute from "./routes/userRoutes.js"; // Import router user baru

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/users", userRoute); // Endpoint /api/users sudah aktif!

export default app;