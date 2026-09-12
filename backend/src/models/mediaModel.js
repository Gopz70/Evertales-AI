const pool = require('../config/db');

const MediaModel = {
  async create(storyId, mediaType, filePath) {
    const [result] = await pool.query(
      'INSERT INTO Media (story_id, media_type, file_path) VALUES (?, ?, ?)',
      [storyId, mediaType, filePath]
    );
    return result.insertId;
  },

  async findByStory(storyId) {
    const [rows] = await pool.query('SELECT * FROM Media WHERE story_id = ?', [storyId]);
    return rows;
  },

  async delete(mediaId) {
    await pool.query('DELETE FROM Media WHERE media_id = ?', [mediaId]);
  },
};

module.exports = MediaModel;
