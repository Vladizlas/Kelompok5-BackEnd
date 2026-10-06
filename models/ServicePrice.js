import { DataTypes } from "sequelize";
import db from "../config/database.js";

const ServicePrice = db.define(
  "service_prices",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "service_id",
    },

    itemType: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "item_type",
    },

    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    unit: {
      type: DataTypes.ENUM("kg", "pcs"),
      allowNull: false,
    },
  },
  {
    tableName: "service_prices",
    timestamps: true,
  }
);

export default ServicePrice;
