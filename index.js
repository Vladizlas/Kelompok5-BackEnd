import cors from "cors";

import db from "./config/database.js";
import User from "./models/User.js";
import authRoute from "./routes/authRoutes.js";
import express from "express";
import db from "./src/config/database.js";
import productRoutes from "./routes/productRoutes.js";

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Laundry API is running"
    });
});

app.use("/api/products", productRoutes);

db.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failed:");
        console.error(err);
        return;
    }

    console.log("Database connected successfully");

    connection.release();

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});


const app = express();
const PORT = 3000;

app.use(cors({ origin: "http://localhost:5173" })); // Mengizinkan akses dari Frontend Vite[cite: 6]
app.use(express.json());

// Check Server Status
app.get("/", (req, res) => {
    res.json({ message: "API Laundry aktif" });
});

// Endpoint Routes
app.use("/api/auth", authRoute);

// Start Server & Sync Database Laragon
const startServer = async () => {
    try {
        await db.authenticate();
        console.log("Database Laragon terhubung...");

        // Membuat tabel otomatis jika belum ada di database Laragon
        await db.sync();

        // Otomatis isi data dummy jika tabel masih kosong
        const count = await User.count();
        if (count === 0) {
            await User.create({
                name: "Admin Fanara Laundry",
                email: "admin@laundry.com",
                password: "password123", // Data dummy login[cite: 1]
                role: "admin",
            });
            console.log("Data dummy admin berhasil ditambahkan ke Laragon!");
        }

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Gagal menjalankan server:", error);
    }
};

startServer();
