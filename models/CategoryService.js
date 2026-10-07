import { DataTypes } from "sequelize";
import db from "../config/database.js";

const CategoryService = db.define(
  "category_services",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "category_services",
    timestamps: true,
  }
);

export default CategoryService;
