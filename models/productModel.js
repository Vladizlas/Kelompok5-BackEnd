import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Product = db.define(
  "products",
  {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    unit: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: "products",
  }
);

export default Product;
