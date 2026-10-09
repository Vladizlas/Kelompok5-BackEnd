import { Op, fn, col } from "sequelize";

import {
  Order,
  OrderItem,
  Customer,
  Service,
} from "../models/index.js";

const STATUSES = ["diterima", "diproses", "selesai", "diambil"];

// ========================================
// GET DASHBOARD
// - ordersToday   : jumlah order yang dibuat hari ini
// - statusToday   : rincian status dari order hari ini
// - recentOrders  : 10 order terbaru (semua tanggal)
// "Hari ini" mengikuti zona waktu server.
// ========================================
export const getDashboard = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const todayWhere = {
      createdAt: {
        [Op.gte]: start,
        [Op.lt]: end,
      },
    };

    const [ordersToday, statusRows, recent] = await Promise.all([
      Order.count({ where: todayWhere }),

      Order.findAll({
        attributes: ["status", [fn("COUNT", col("id")), "total"]],
        where: todayWhere,
        group: ["status"],
        raw: true,
      }),

      Order.findAll({
        include: [
          { model: Customer, as: "customer", attributes: ["name"] },
          {
            model: OrderItem,
            as: "items",
            attributes: ["id"],
            include: [
              { model: Service, as: "service", attributes: ["name"] },
            ],
          },
        ],
        order: [["id", "DESC"]],
        limit: 10,
      }),
    ]);

    const statusToday = Object.fromEntries(STATUSES.map((s) => [s, 0]));

    statusRows.forEach((row) => {
      statusToday[row.status] = Number(row.total);
    });

    const recentOrders = recent.map((order) => ({
      id: order.id,
      invoice: `INV-${String(order.id).padStart(4, "0")}`,
      createdAt: order.createdAt,
      customerName: order.customer?.name || "-",
      // nama layanan unik, mis. ["Cuci Kiloan", "Handuk"]
      services: [
        ...new Set(order.items.map((i) => i.service?.name).filter(Boolean)),
      ],
      totalPrice: order.totalPrice,
      paymentMethod: order.paymentMethod,
      status: order.status,
    }));

    res.status(200).json({
      success: true,
      message: "Data dashboard berhasil diambil",
      data: {
        ordersToday,
        statusToday,
        recentOrders,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};