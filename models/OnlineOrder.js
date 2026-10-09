import { DataTypes } from "sequelize";
import db from "../config/database.js";

// Pesanan dari pelanggan lewat website (modal pesan via WhatsApp).
// Terpisah dari Order karena pelanggan belum tentu terdaftar di tabel customers.
// Rincian layanan ada di tabel online_order_items (lihat OnlineOrderItem.js).
const OnlineOrder = db.define(
  "online_orders",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    nama: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    pengambilan: {
      type: DataTypes.ENUM("antar", "jemput"),
      allowNull: false,
    },

    // hanya terisi jika pengambilan = jemput
    alamat: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    catatan: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    // progres pesanan, diubah admin dari halaman Pesan Online
    status: {
      type: DataTypes.ENUM(
        "menunggu",
        "dijemput",
        "diproses",
        "selesai",
        "dibatalkan"
      ),
      allowNull: false,
      defaultValue: "menunggu",
    },

    // perkiraan total, dihitung ulang di backend dari service_prices
    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "total_price",
    },
  },
  {
    tableName: "online_orders",
    timestamps: true,
  }
);

export default OnlineOrder;