const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');

// Tag generation endpoint (speech-to-text now handled on frontend with Web Speech API)
router.post('/generate-tags', authMiddleware, aiController.generateTags);

module.exports = router;
