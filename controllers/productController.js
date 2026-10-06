import Product from "../models/productModel.js";


// ========================================
// VALIDASI PRODUCT
// ========================================
const validateProduct = (name, price, unit) => {
  // Validasi nama
  if (!name || typeof name !== "string" || name.trim() === "") {
    return "Nama product wajib diisi";
  }

  if (name.trim().length > 100) {
    return "Nama product maksimal 100 karakter";
  }

  // Validasi harga
  if (price === undefined || price === null || price === "") {
    return "Harga product wajib diisi";
  }

  if (!Number.isInteger(Number(price))) {
    return "Harga product harus berupa angka";
  }

  if (Number(price) < 0) {
    return "Harga product tidak boleh negatif";
  }

  // Validasi unit
  if (!unit || typeof unit !== "string" || unit.trim() === "") {
    return "Unit product wajib diisi";
  }

  if (unit.trim().length > 50) {
    return "Unit product maksimal 50 karakter";
  }

  return null;
};


// ========================================
// GET ALL PRODUCTS
// ========================================
export const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [["id", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Data product berhasil diambil",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ========================================
// GET PRODUCT BY ID
// ========================================
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: "Data product berhasil diambil",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ========================================
// CREATE PRODUCT
// ========================================
export const createProduct = async (req, res) => {
  try {
    const { name, price, unit } = req.body;

    const validationError = validateProduct(
      name,
      price,
      unit
    );

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const product = await Product.create({
      name: name.trim(),
      price: Number(price),
      unit: unit.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Product berhasil ditambahkan",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ========================================
// UPDATE PRODUCT
// ========================================
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, unit } = req.body;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product tidak ditemukan",
      });
    }

    const validationError = validateProduct(
      name,
      price,
      unit
    );

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    await product.update({
      name: name.trim(),
      price: Number(price),
      unit: unit.trim(),
    });

    res.status(200).json({
      success: true,
      message: "Product berhasil diupdate",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ========================================
// DELETE PRODUCT
// ========================================
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product tidak ditemukan",
      });
    }

    await product.destroy();

    res.status(200).json({
      success: true,
      message: "Product berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
