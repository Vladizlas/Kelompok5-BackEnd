import { DataTypes } from "sequelize";
import db from "../config/database.js";

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
    // supaya order lama tidak berubah kalau harga layanan diedit
    unit: {
      type: DataTypes.ENUM("kg", "pcs"),
      allowNull: false,
    },

    pricePerUnit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "price_per_unit",
    },

    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "total_price",
    },

    paymentMethod: {
      type: DataTypes.ENUM("cash", "transfer"),
      allowNull: false,
      field: "payment_method",
    },
  },
  {
    tableName: "orders",
    timestamps: true,
  }
);

export default Order;