import {
  Order,
  Customer,
  CategoryService,
  Service,
  ServicePrice,
} from "../models/index.js";

const PAYMENT_METHODS = ["cash", "transfer"];

const orderInclude = [
  { model: Customer, as: "customer" },
  { model: CategoryService, as: "category" },
  { model: Service, as: "service" },
  { model: ServicePrice, as: "servicePrice" },
];

// ========================================
// VALIDASI + HITUNG ORDER
// Kategori & layanan DIAMBIL dari servicePrice di server,
// harga total DIHITUNG di server (bukan percaya kiriman client).
// ========================================
const buildOrderData = async (body) => {
  const { customerId, servicePriceId, quantity, paymentMethod } = body;

  if (!customerId || !Number.isInteger(Number(customerId))) {
    return { status: 400, message: "Pelanggan wajib dipilih" };
  }

  if (!servicePriceId || !Number.isInteger(Number(servicePriceId))) {
    return { status: 400, message: "Layanan / jenis item wajib dipilih" };
  }

  if (!PAYMENT_METHODS.includes(paymentMethod)) {
    return {
      status: 400,
      message: "Metode pembayaran harus cash atau transfer",
    };
  }

  const qty = Number(quantity);

  if (quantity === "" || quantity == null || !Number.isFinite(qty) || qty <= 0) {
    return { status: 400, message: "Berat / jumlah harus lebih dari 0" };
  }

  const customer = await Customer.findByPk(customerId);

  if (!customer) {
    return { status: 404, message: "Pelanggan tidak ditemukan" };
  }

  const servicePrice = await ServicePrice.findByPk(servicePriceId, {
    include: [{ model: Service, as: "service" }],
  });

  if (!servicePrice) {
    return { status: 404, message: "Harga layanan tidak ditemukan" };
  }

  // pcs harus bilangan bulat, kg boleh desimal (maks 2 digit)
  if (servicePrice.unit === "pcs" && !Number.isInteger(qty)) {
    return { status: 400, message: "Jumlah pcs harus bilangan bulat" };
  }

  if (Math.round(qty * 100) / 100 !== qty) {
    return { status: 400, message: "Maksimal 2 angka di belakang koma" };
  }

  return {
    data: {
      customerId: Number(customerId),
      categoryId: servicePrice.service.categoryId,
      serviceId: servicePrice.serviceId,
      servicePriceId: servicePrice.id,
      quantity: qty,
      unit: servicePrice.unit,
      pricePerUnit: servicePrice.price,
      totalPrice: Math.round(servicePrice.price * qty),
      paymentMethod,
    },
  };
};

// ========================================
// GET ALL
// ========================================
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: orderInclude,
      order: [["id", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Data order berhasil diambil",
      data: orders,
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
export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      include: orderInclude,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: "Data order berhasil diambil",
      data: order,
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
export const createOrder = async (req, res) => {
  try {
    const result = await buildOrderData(req.body);

    if (!result.data) {
      return res.status(result.status).json({
        success: false,
        message: result.message,
      });
    }

    const created = await Order.create(result.data);

    const order = await Order.findByPk(created.id, {
      include: orderInclude,
    });

    res.status(201).json({
      success: true,
      message: "Order berhasil ditambahkan",
      data: order,
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
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order tidak ditemukan",
      });
    }

    const result = await buildOrderData(req.body);

    if (!result.data) {
      return res.status(result.status).json({
        success: false,
        message: result.message,
      });
    }

    await order.update(result.data);

    const updated = await Order.findByPk(id, {
      include: orderInclude,
    });

    res.status(200).json({
      success: true,
      message: "Order berhasil diupdate",
      data: updated,
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
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order tidak ditemukan",
      });
    }

    await order.destroy();

    res.status(200).json({
      success: true,
      message: "Order berhasil dihapus",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};