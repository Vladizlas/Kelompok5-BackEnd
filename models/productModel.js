import db from "../config/database.js";

export const getAllProducts = async () => {
    const sql = "SELECT * FROM products ORDER BY id DESC";

    const [results] = await db.query(sql);

    return results;
};
