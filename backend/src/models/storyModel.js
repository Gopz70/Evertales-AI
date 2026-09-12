const pool = require('../config/db');

const StoryModel = {
  async create(userId, { title, description, story_date, category_id, transcript, is_public }) {
    const [result] = await pool.query(
      `INSERT INTO Stories (user_id, title, description, story_date, category_id, transcript, is_public)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, title, description, story_date, category_id, transcript || null, is_public || false]
    );
    return result.insertId;
  },

  async findAllByUser(userId) {
    const [rows] = await pool.query(
      `SELECT s.*, c.category_name
       FROM Stories s
       LEFT JOIN Categories c ON s.category_id = c.category_id
       WHERE s.user_id = ?
       ORDER BY s.story_date DESC`,
      [userId]
    );
    return rows;
  },

  async findById(storyId, userId) {
    const [rows] = await pool.query(
      `SELECT s.*, c.category_name
       FROM Stories s
       LEFT JOIN Categories c ON s.category_id = c.category_id
       WHERE s.story_id = ? AND s.user_id = ?`,
      [storyId, userId]
    );
    return rows[0];
  },

  async update(storyId, userId, { title, description, story_date, category_id, is_favorite, is_public }) {
    await pool.query(
      `UPDATE Stories
       SET title = ?, description = ?, story_date = ?, category_id = ?, is_favorite = ?, is_public = ?
       WHERE story_id = ? AND user_id = ?`,
      [title, description, story_date, category_id, is_favorite, is_public, storyId, userId]
    );
  },

  async delete(storyId, userId) {
    await pool.query('DELETE FROM Stories WHERE story_id = ? AND user_id = ?', [storyId, userId]);
  },

  async search(userId, query) {
    const [rows] = await pool.query(
      `SELECT DISTINCT s.*
       FROM Stories s
       LEFT JOIN Tags t ON s.story_id = t.story_id
       WHERE s.user_id = ?
         AND (s.title LIKE ? OR s.description LIKE ? OR t.tag_name LIKE ?)
       ORDER BY s.story_date DESC`,
      [userId, `%${query}%`, `%${query}%`, `%${query}%`]
    );
    return rows;
  },

  async findPublic() {
    const [rows] = await pool.query(
      `SELECT s.story_id, s.user_id, s.title, s.description, s.story_date, 
              s.category_id, s.is_favorite, s.is_public, s.created_at,
              c.category_name, u.name as author_name
       FROM Stories s
       LEFT JOIN Categories c ON s.category_id = c.category_id
       LEFT JOIN Users u ON s.user_id = u.user_id
       WHERE s.is_public = TRUE
       ORDER BY s.story_date DESC`
    );
    return rows;
  },

  async findPublicById(storyId) {
    const [rows] = await pool.query(
      `SELECT s.story_id, s.user_id, s.title, s.description, s.story_date,
              s.category_id, s.is_favorite, s.is_public, s.created_at,
              c.category_name, u.name as author_name
       FROM Stories s
       LEFT JOIN Categories c ON s.category_id = c.category_id
       LEFT JOIN Users u ON s.user_id = u.user_id
       WHERE s.story_id = ? AND s.is_public = TRUE`,
      [storyId]
    );
    return rows[0];
  },
};

module.exports = StoryModel;
