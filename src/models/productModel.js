import db from "../config/database.js";

export const getAllProducts = (callback) => {
    const sql = "SELECT * FROM products ORDER BY id DESC";

    db.query(sql, callback);
};
