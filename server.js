import express from "express";
import db from "./src/config/database.js";
import productRoutes from "./src/routes/productRoutes.js";

const app = express();

const PORT = 3000;

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
