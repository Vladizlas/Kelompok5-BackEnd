import dotenv from "dotenv";
dotenv.config();

import db from "./config/database.js";
import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";

const app = express();

const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test API
app.get("/", (req, res) => {
    res.json({
        message: "Laundry API is running"
    });
});

// Product routes
app.use("/api/products", productRoutes);

// Database connection & start server
try {
    await db.authenticate();
    console.log("Database connected successfully!");

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
} catch (error) {
    console.error("Unable to connect to database:", error);
}
