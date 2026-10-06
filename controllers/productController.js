import { getAllProducts } from "../models/productModel.js";

export const getProducts = async (req, res) => {
    try {
        const results = await getAllProducts();

        res.status(200).json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Gagal mengambil data produk",
            error: error.message
        });
    }
};
