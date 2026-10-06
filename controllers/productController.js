import { getAllProducts } from "../models/productModel.js";

export const getProducts = (req, res) => {
    getAllProducts((err, results) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Gagal mengambil data produk"
            });
        }

        res.status(200).json({
            success: true,
            data: results
        });
    });
};
