import { DataTypes } from "sequelize";
import db from "../config/database.js";

const OrderItem = db.define(
  "order_items",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "order_id",
    },

    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "category_id",
    },

    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "service_id",
    },

    servicePriceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "service_price_id",
    },

    // berat (kg) atau jumlah (pcs)
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    // disalin dari service_prices saat order dibuat,
    // supaya invoice lama tidak berubah kalau harga layanan diedit
    unit: {
      type: DataTypes.ENUM("kg", "pcs"),
      allowNull: false,
    },

    pricePerUnit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "price_per_unit",
    },

    subtotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "order_items",
    timestamps: true,
  }
);

export default OrderItem;
