import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import db from "./config/database.js";

import "./models/CategoryService.js";
import "./models/Service.js";
import "./models/ServicePrice.js";
import "./models/Customer.js";
import "./models/Order.js";
import "./models/OrderItem.js";
import "./models/Expense.js";

const PORT = process.env.PORT || 3000;

try {
  await db.authenticate();
  console.log("Database connected successfully!");

  await db.sync();
  console.log("Database berhasil disinkronkan!");

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
} catch (error) {
  console.error("Unable to start server:", error);
}