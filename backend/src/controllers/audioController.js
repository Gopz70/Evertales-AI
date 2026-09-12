const fs = require('fs');
const path = require('path');
const multer = require('multer');
const MediaModel = require('../models/mediaModel');
const { uploadAudioFile } = require('../utils/storage');

// Configure storage for audio files (temporary storage for multer)
const audioStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = path.join(__dirname, '../../uploads/audio');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function(req, file, cb) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    cb(null, `audio_${timestamp}_${random}.webm`);
  }
});

// File filter - only audio files
const audioFilter = function(req, file, cb) {
  const allowedMimes = ['audio/webm', 'audio/wav', 'audio/mpeg', 'audio/mp4', 'audio/ogg'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only audio files allowed'), false);
  }
};

// Create multer instance
const audioUpload = multer({
  storage: audioStorage,
  fileFilter: audioFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Upload handler - Now supports both local and cloud storage
const uploadAudio = async function(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No audio file provided' });
    }

    // Upload to either local storage (dev) or Cloudinary (production)
    const filePath = await uploadAudioFile(req.file);
    const fileSize = req.file.size;
    const duration = req.body.duration || null;
    const storyId = req.body.storyId || null;

    // If storyId provided, create media record in database
    if (storyId) {
      try {
        await MediaModel.create(storyId, 'audio', filePath);
      } catch (dbError) {
        console.error('Error creating media record:', dbError);
        // Don't fail the response - file is uploaded, just warn
      }
    }

    res.json({
      success: true,
      filePath: filePath,
      fileSize: fileSize,
      duration: duration,
      filename: req.file.filename,
      message: 'Audio uploaded successfully'
    });
  } catch (error) {
    console.error('Audio upload error:', error);
    res.status(500).json({ message: 'Error uploading audio' });
  }
};

// Export functions
module.exports = {
  audioUpload: audioUpload,
  uploadAudio: uploadAudio
};
