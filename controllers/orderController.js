import db from "../config/database.js";

import {
  Order,
  OrderItem,
  Customer,
  CategoryService,
  Service,
  ServicePrice,
} from "../models/index.js";

const PAYMENT_METHODS = ["cash", "transfer"];

const MAX_ITEMS = 50;

const orderInclude = [
  { model: Customer, as: "customer" },
  {
    model: OrderItem,
    as: "items",
    include: [
      { model: CategoryService, as: "category" },
      { model: Service, as: "service" },
      { model: ServicePrice, as: "servicePrice" },
    ],
  },
];

const orderSort = [
  ["id", "DESC"],
  [{ model: OrderItem, as: "items" }, "id", "ASC"],
];

// ========================================
// VALIDASI + HITUNG ORDER
// Kategori & layanan tiap item DIAMBIL dari servicePrice di server,
// subtotal & total DIHITUNG di server (bukan percaya kiriman client).
// ========================================
const buildOrderData = async (body) => {
  const { customerId, paymentMethod, items } = body;

  if (!customerId || !Number.isInteger(Number(customerId))) {
    return { status: 400, message: "Pelanggan wajib dipilih" };
  }

  if (!PAYMENT_METHODS.includes(paymentMethod)) {
    return {
      status: 400,
      message: "Metode pembayaran harus cash atau transfer",
    };
  }

  if (!Array.isArray(items) || items.length === 0) {
    return { status: 400, message: "Minimal 1 item layanan" };
  }

  if (items.length > MAX_ITEMS) {
    return { status: 400, message: `Maksimal ${MAX_ITEMS} item per order` };
  }

  // validasi bentuk tiap item
  for (let i = 0; i < items.length; i++) {
    const { servicePriceId, quantity } = items[i] || {};
    const no = i + 1;

    if (!servicePriceId || !Number.isInteger(Number(servicePriceId))) {
      return {
        status: 400,
        message: `Item ${no}: layanan / jenis item wajib dipilih`,
      };
    }

    const qty = Number(quantity);

    if (quantity === "" || quantity == null || !Number.isFinite(qty) || qty <= 0) {
      return {
        status: 400,
        message: `Item ${no}: berat / jumlah harus lebih dari 0`,
      };
    }

    if (Math.round(qty * 100) / 100 !== qty) {
      return {
        status: 400,
        message: `Item ${no}: maksimal 2 angka di belakang koma`,
      };
    }
  }

  const customer = await Customer.findByPk(customerId);

  if (!customer) {
    return { status: 404, message: "Pelanggan tidak ditemukan" };
  }

  // ambil semua harga yang dipakai dalam 1 query
  const priceIds = [...new Set(items.map((i) => Number(i.servicePriceId)))];

  const prices = await ServicePrice.findAll({
    where: { id: priceIds },
    include: [{ model: Service, as: "service" }],
  });

  const priceMap = new Map(prices.map((p) => [p.id, p]));

  const itemRows = [];
  let totalPrice = 0;

  for (let i = 0; i < items.length; i++) {
    const no = i + 1;
    const servicePrice = priceMap.get(Number(items[i].servicePriceId));
    const qty = Number(items[i].quantity);

    if (!servicePrice) {
      return {
        status: 404,
        message: `Item ${no}: harga layanan tidak ditemukan`,
      };
    }

    // pcs harus bilangan bulat, kg boleh desimal
    if (servicePrice.unit === "pcs" && !Number.isInteger(qty)) {
      return {
        status: 400,
        message: `Item ${no}: jumlah pcs harus bilangan bulat`,
      };
    }

    const subtotal = Math.round(servicePrice.price * qty);

    totalPrice += subtotal;

    itemRows.push({
      categoryId: servicePrice.service.categoryId,
      serviceId: servicePrice.serviceId,
      servicePriceId: servicePrice.id,
      quantity: qty,
      unit: servicePrice.unit,
      pricePerUnit: servicePrice.price,
      subtotal,
    });
  }

  return {
    header: {
      customerId: Number(customerId),
      paymentMethod,
      totalPrice,
    },
    items: itemRows,
  };
};

// ========================================
// GET ALL
// ========================================
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: orderInclude,
      order: orderSort,
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
      order: [[{ model: OrderItem, as: "items" }, "id", "ASC"]],
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

    if (!result.header) {
      return res.status(result.status).json({
        success: false,
        message: result.message,
      });
    }

    // header + item disimpan bersamaan: gagal satu, batal semua
    const orderId = await db.transaction(async (transaction) => {
      const created = await Order.create(result.header, { transaction });

      await OrderItem.bulkCreate(
        result.items.map((item) => ({ ...item, orderId: created.id })),
        { transaction }
      );

      return created.id;
    });

    const order = await Order.findByPk(orderId, {
      include: orderInclude,
      order: [[{ model: OrderItem, as: "items" }, "id", "ASC"]],
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
// item lama diganti seluruhnya dengan item yang dikirim
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

    if (!result.header) {
      return res.status(result.status).json({
        success: false,
        message: result.message,
      });
    }

    await db.transaction(async (transaction) => {
      await order.update(result.header, { transaction });

      await OrderItem.destroy({
        where: { orderId: order.id },
        transaction,
      });

      await OrderItem.bulkCreate(
        result.items.map((item) => ({ ...item, orderId: order.id })),
        { transaction }
      );
    });

    const updated = await Order.findByPk(id, {
      include: orderInclude,
      order: [[{ model: OrderItem, as: "items" }, "id", "ASC"]],
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

    await db.transaction(async (transaction) => {
      await OrderItem.destroy({
        where: { orderId: order.id },
        transaction,
      });

      await order.destroy({ transaction });
    });

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
