const pool = require('../config/db');

const UserModel = {
  async create({ name, email, hashedPassword }) {
    const [result] = await pool.query(
      'INSERT INTO Users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );
    return result.insertId;
  },

  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
    return rows[0];
  },

  async findById(userId) {
    const [rows] = await pool.query(
      'SELECT user_id, name, email, password, profile_image, created_at FROM Users WHERE user_id = ?',
      [userId]
    );
    return rows[0];
  },

  async updateProfile(userId, updateData) {
    // Build query dynamically based on what fields are provided
    const updates = [];
    const values = [];

    if (updateData.name !== undefined) {
      updates.push('name = ?');
      values.push(updateData.name);
    }

    if (updateData.profile_image !== undefined) {
      updates.push('profile_image = ?');
      values.push(updateData.profile_image);
    }

    if (updateData.password !== undefined) {
      updates.push('password = ?');
      values.push(updateData.password);
    }

    if (updates.length === 0) {
      return; // Nothing to update
    }

    const query = `UPDATE Users SET ${updates.join(', ')} WHERE user_id = ?`;
    values.push(userId);

    await pool.query(query, values);
  },
};

module.exports = UserModel;
