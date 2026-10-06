import { Sequelize } from "sequelize";

// Sesuaikan nama database, username, dan password dengan MySQL milikmu
const db = new Sequelize("laundry", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;