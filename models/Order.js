import { DataTypes } from "sequelize";
import db from "../config/database.js";

// Order = header invoice (1 pelanggan, 1 metode pembayaran, 1 total).
// Rincian layanan ada di tabel order_items (lihat OrderItem.js).
const Order = db.define(
  "orders",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "customer_id",
    },

    paymentMethod: {
      type: DataTypes.ENUM("cash", "transfer"),
      allowNull: false,
      field: "payment_method",
    },

    // jumlah seluruh subtotal item
    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "total_price",
    },
  },
  {
    tableName: "orders",
    timestamps: true,
  }
);

export default Order;
