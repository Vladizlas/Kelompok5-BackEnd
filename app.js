import express from "express";
import servicePriceRoutes from "./routes/servicePriceRoutes.js";
import categoryServiceRoutes from "./routes/categoryServiceRoutes.js";
import serviceRoute from "./routes/serviceRoute.js";

const app = express();

app.use(express.json());

app.use("/api/categories", categoryServiceRoutes);
app.use("/api/services", serviceRoute);
app.use("/api/service-prices", servicePriceRoutes);

export default app;
