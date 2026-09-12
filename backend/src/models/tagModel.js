const pool = require('../config/db');

const TagModel = {
  async createMany(storyId, tagNames = []) {
    if (!tagNames.length) return;
    const values = tagNames.map((tag) => [storyId, tag]);
    await pool.query('INSERT INTO Tags (story_id, tag_name) VALUES ?', [values]);
  },

  async findByStory(storyId) {
    const [rows] = await pool.query('SELECT * FROM Tags WHERE story_id = ?', [storyId]);
    return rows;
  },

  async deleteByStory(storyId) {
    await pool.query('DELETE FROM Tags WHERE story_id = ?', [storyId]);
  },
};

module.exports = TagModel;
