import Expense from "../models/Expense.js";

const MAX_AMOUNT = 2000000000;

// ========================================
// VALIDASI EXPENSE
// ========================================
const isValidDate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00Z`);

  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
};

const validateExpense = (date, category, description, amount) => {
  if (!isValidDate(date)) {
    return "Tanggal tidak valid (format YYYY-MM-DD)";
  }

  if (!category || typeof category !== "string" || category.trim() === "") {
    return "Kategori wajib diisi";
  }

  if (category.trim().length > 50) {
    return "Kategori maksimal 50 karakter";
  }

  if (description !== undefined && description !== null) {
    if (typeof description !== "string") {
      return "Keterangan harus berupa teks";
    }

    if (description.trim().length > 255) {
      return "Keterangan maksimal 255 karakter";
    }
  }

  const value = Number(amount);

  if (amount === "" || amount == null || !Number.isInteger(value) || value <= 0) {
    return "Jumlah harus berupa bilangan bulat lebih dari 0";
  }

  if (value > MAX_AMOUNT) {
    return "Jumlah terlalu besar";
  }

  return null;
};

// ========================================
// GET ALL
// ========================================
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      order: [
        ["date", "DESC"],
        ["id", "DESC"],
      ],
    });

    res.status(200).json({
      success: true,
      message: "Data pengeluaran berhasil diambil",
      data: expenses,
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
export const getExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findByPk(id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Pengeluaran tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: "Data pengeluaran berhasil diambil",
      data: expense,
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
export const createExpense = async (req, res) => {
  try {
    const { date, category, description, amount } = req.body;

    const validationError = validateExpense(
      date,
      category,
      description,
      amount
    );

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const expense = await Expense.create({
      date,
      category: category.trim(),
      description: description?.trim() || null,
      amount: Number(amount),
    });

    res.status(201).json({
      success: true,
      message: "Pengeluaran berhasil ditambahkan",
      data: expense,
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
export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, category, description, amount } = req.body;

    const expense = await Expense.findByPk(id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Pengeluaran tidak ditemukan",
      });
    }

    const validationError = validateExpense(
      date,
      category,
      description,
      amount
    );

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    await expense.update({
      date,
      category: category.trim(),
      description: description?.trim() || null,
      amount: Number(amount),
    });

    res.status(200).json({
      success: true,
      message: "Pengeluaran berhasil diupdate",
      data: expense,
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
export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findByPk(id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Pengeluaran tidak ditemukan",
      });
    }

    await expense.destroy();

    res.status(200).json({
      success: true,
      message: "Pengeluaran berhasil dihapus",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};