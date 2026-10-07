import express from "express";
import servicePriceRoutes from "./routes/servicePriceRoutes.js";
import categoryServiceRoutes from "./routes/categoryServiceRoutes.js";
import serviceRoute from "./routes/serviceRoute.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

app.use("/api/categories", categoryServiceRoutes);
app.use("/api/services", serviceRoute);
app.use("/api/service-prices", servicePriceRoutes);
app.use("/api/auth", authRoutes);

export default app;
