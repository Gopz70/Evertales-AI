const express = require('express');
const router = express.Router();
const { audioUpload, uploadAudio } = require('../controllers/audioController');
const authMiddleware = require('../middleware/authMiddleware');

// Upload audio file (protected route)
router.post('/upload', authMiddleware, audioUpload.single('audio'), uploadAudio);

module.exports = router;
