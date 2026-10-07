import { DataTypes } from "sequelize";
import db from "../config/database.js"; // Sesuaikan dengan file database kamu

const Customer = db.define("customers", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  no_telp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  alamat: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

export default Customer;