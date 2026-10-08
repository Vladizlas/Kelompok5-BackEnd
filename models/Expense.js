import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Expense = db.define(
  "expenses",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // tanggal pengeluaran (tanpa jam), format YYYY-MM-DD
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "expense_date",
    },

    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    // dalam rupiah
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "expenses",
    timestamps: true,
  }
);

export default Expense;