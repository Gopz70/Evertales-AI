const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, storyController.getCategories);

module.exports = router;
