import { DataTypes } from "sequelize";
import db from "../config/database.js";

const OnlineOrderItem = db.define(
  "online_order_items",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    onlineOrderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "online_order_id",
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

    // perkiraan berat (kg) atau jumlah (pcs)
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    // disalin dari service_prices saat pesanan dibuat
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
    tableName: "online_order_items",
    timestamps: true,
  }
);

export default OnlineOrderItem;