import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

import servicePriceRoutes from "./routes/servicePriceRoutes.js";
import categoryServiceRoutes from "./routes/categoryServiceRoutes.js";
import serviceRoute from "./routes/serviceRoute.js";
import userRoutes from "./routes/userRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import onlineOrderRoutes from "./routes/onlineOrderRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const app = express();

// =====================================================
// CORS
// =====================================================

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// =====================================================
// BODY PARSER
// =====================================================

app.use(express.json());

// =====================================================
// API ROUTES
// =====================================================

app.use(
  "/api/categories",
  categoryServiceRoutes
);

app.use(
  "/api/services",
  serviceRoute
);

app.use(
  "/api/service-prices",
  servicePriceRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/customers",
  customerRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/expenses",
  expenseRoutes
);

app.use(
  "/api/pesan-online",
   onlineOrderRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);


export default app;
