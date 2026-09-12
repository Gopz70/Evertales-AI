const pool = require('../config/db');

const CategoryModel = {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM Categories ORDER BY category_name');
    return rows;
  },
};

module.exports = CategoryModel;
