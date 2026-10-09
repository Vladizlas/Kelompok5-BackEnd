import db from "../config/database.js";

import {
  OnlineOrder,
  OnlineOrderItem,
  Service,
  ServicePrice,
} from "../models/index.js";

const PICKUP_TYPES = ["antar", "jemput"];
const STATUSES = ["menunggu", "dijemput", "diproses", "selesai", "dibatalkan"];
const MAX_ITEMS = 50;

const itemInclude = [
  {
    model: OnlineOrderItem,
    as: "items",
    include: [
      { model: Service, as: "service" },
      { model: ServicePrice, as: "servicePrice" },
    ],
  },
];

const itemSort = [[{ model: OnlineOrderItem, as: "items" }, "id", "ASC"]];

const capitalize = (text = "") =>
  text.charAt(0).toUpperCase() + text.slice(1);

// Bentuk data yang dibaca halaman PesanOnline.jsx
const serialize = (order) => ({
  id: order.id,
  kode: `PO-${String(order.id).padStart(4, "0")}`,
  nama: order.nama,
  pengambilan: order.pengambilan,
  alamat: order.alamat,
  catatan: order.catatan,
  total: order.totalPrice,
  status: capitalize(order.status),
  createdAt: order.createdAt,
  items: (order.items || []).map((item) => ({
    id: item.id,
    serviceName: item.service?.name,
    itemType: item.servicePrice?.itemType,
    quantity: Number(item.quantity),
    unit: item.unit,
  })),
});

// ========================================
// GET ALL (admin)
// ========================================
export const getOnlineOrders = async (req, res) => {
  try {
    const orders = await OnlineOrder.findAll({
      include: itemInclude,
      order: [["id", "DESC"], ...itemSort],
    });

    res.status(200).json({
      success: true,
      message: "Data pesanan online berhasil diambil",
      data: orders.map(serialize),
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
// CREATE (publik, dari modal WhatsApp)
// ========================================
export const createOnlineOrder = async (req, res) => {
  try {
    const { nama, pengambilan, alamat, catatan, items } = req.body;

    if (!String(nama || "").trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Nama wajib diisi" });
    }

    if (String(nama).trim().length > 100) {
      return res
        .status(400)
        .json({ success: false, message: "Nama maksimal 100 karakter" });
    }

    if (!PICKUP_TYPES.includes(pengambilan)) {
      return res.status(400).json({
        success: false,
        message: "Pengambilan harus antar atau jemput",
      });
    }

    if (pengambilan === "jemput" && !String(alamat || "").trim()) {
      return res.status(400).json({
        success: false,
        message: "Alamat penjemputan wajib diisi",
      });
    }

    if (String(alamat || "").length > 255 || String(catatan || "").length > 255) {
      return res.status(400).json({
        success: false,
        message: "Alamat dan catatan maksimal 255 karakter",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Minimal 1 item layanan" });
    }

    if (items.length > MAX_ITEMS) {
      return res.status(400).json({
        success: false,
        message: `Maksimal ${MAX_ITEMS} item per pesanan`,
      });
    }

    for (let i = 0; i < items.length; i++) {
      const { servicePriceId, quantity } = items[i] || {};
      const no = i + 1;
      const qty = Number(quantity);

      if (!servicePriceId || !Number.isInteger(Number(servicePriceId))) {
        return res.status(400).json({
          success: false,
          message: `Item ${no}: layanan / jenis item wajib dipilih`,
        });
      }

      if (quantity === "" || quantity == null || !Number.isFinite(qty) || qty <= 0) {
        return res.status(400).json({
          success: false,
          message: `Item ${no}: berat / jumlah harus lebih dari 0`,
        });
      }

      if (Math.round(qty * 100) / 100 !== qty) {
        return res.status(400).json({
          success: false,
          message: `Item ${no}: maksimal 2 angka di belakang koma`,
        });
      }
    }

    // Harga selalu diambil dari database, bukan dari browser
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
        return res.status(404).json({
          success: false,
          message: `Item ${no}: harga layanan tidak ditemukan`,
        });
      }

      if (servicePrice.unit === "pcs" && !Number.isInteger(qty)) {
        return res.status(400).json({
          success: false,
          message: `Item ${no}: jumlah pcs harus bilangan bulat`,
        });
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

    const orderId = await db.transaction(async (transaction) => {
      const created = await OnlineOrder.create(
        {
          nama: String(nama).trim(),
          pengambilan,
          alamat: pengambilan === "jemput" ? String(alamat).trim() : null,
          catatan: String(catatan || "").trim() || null,
          totalPrice,
        },
        { transaction }
      );

      await OnlineOrderItem.bulkCreate(
        itemRows.map((item) => ({ ...item, onlineOrderId: created.id })),
        { transaction }
      );

      return created.id;
    });

    const order = await OnlineOrder.findByPk(orderId, {
      include: itemInclude,
      order: itemSort,
    });

    res.status(201).json({
      success: true,
      message: "Pesanan online berhasil dibuat",
      data: serialize(order),
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
// UPDATE STATUS (admin)
// ========================================
export const updateOnlineOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const status = String(req.body.status || "").toLowerCase();

    if (!STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status harus salah satu dari: ${STATUSES.join(", ")}`,
      });
    }

    const order = await OnlineOrder.findByPk(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Pesanan tidak ditemukan",
      });
    }

    await order.update({ status });

    res.status(200).json({
      success: true,
      message: "Status pesanan berhasil diupdate",
      data: { id: order.id, status: capitalize(order.status) },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};