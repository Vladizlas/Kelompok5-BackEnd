import { Customer, Order } from "../models/index.js";

// ========================================
// VALIDASI CUSTOMER
// ========================================
const validateCustomer = (name, phone, address) => {
  if (!name || typeof name !== "string" || name.trim() === "") {
    return "Nama customer wajib diisi";
  }

  if (name.trim().length > 100) {
    return "Nama customer maksimal 100 karakter";
  }

  if (!phone || typeof phone !== "string" || phone.trim() === "") {
    return "No telp wajib diisi";
  }

  if (!/^[0-9+\-\s]{8,20}$/.test(phone.trim())) {
    return "No telp tidak valid (8-20 karakter, hanya angka, +, - dan spasi)";
  }

  if (
    address !== undefined &&
    address !== null &&
    typeof address !== "string"
  ) {
    return "Alamat harus berupa teks";
  }

  return null;
};

// ========================================
// GET ALL
// ========================================
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      order: [["id", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Data customer berhasil diambil",
      data: customers,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// GET BY ID
// ========================================
export const getCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: "Data customer berhasil diambil",
      data: customer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// CREATE
// ========================================
export const createCustomer = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const validationError = validateCustomer(name, phone, address);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const customer = await Customer.create({
      name: name.trim(),
      phone: phone.trim(),
      address: address?.trim() || null,
    });

    res.status(201).json({
      success: true,
      message: "Customer berhasil ditambahkan",
      data: customer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// UPDATE
// ========================================
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, address } = req.body;

    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer tidak ditemukan",
      });
    }

    const validationError = validateCustomer(name, phone, address);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    await customer.update({
      name: name.trim(),
      phone: phone.trim(),
      address: address?.trim() || null,
    });

    res.status(200).json({
      success: true,
      message: "Customer berhasil diupdate",
      data: customer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// DELETE
// ========================================
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer tidak ditemukan",
      });
    }

    const orderCount = await Order.count({
      where: { customerId: id },
    });

    if (orderCount > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Customer tidak dapat dihapus karena sudah memiliki order.",
      });
    }

    await customer.destroy();

    res.status(200).json({
      success: true,
      message: "Customer berhasil dihapus",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};