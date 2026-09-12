const MediaModel = require('../models/mediaModel');

async function uploadMedia(req, res) {
  try {
    const { storyId } = req.params;
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const mediaType = req.file.mimetype.startsWith('audio') ? 'audio' : 'image';
    const filePath = `/uploads/${req.file.filename}`;

    const mediaId = await MediaModel.create(storyId, mediaType, filePath);
    res.status(201).json({ media_id: mediaId, media_type: mediaType, file_path: filePath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error uploading media' });
  }
}

async function deleteMedia(req, res) {
  try {
    await MediaModel.delete(req.params.mediaId);
    res.json({ message: 'Media deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error deleting media' });
  }
}

module.exports = { uploadMedia, deleteMedia };
