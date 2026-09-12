const cloudinary = require('cloudinary').v2;
const path = require('path');

// Configure Cloudinary
if (process.env.CLOUDINARY_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Upload audio file to either local storage (development) or Cloudinary (production)
 * @param {Object} file - Express file object from multer
 * @returns {Promise<string>} - File path or URL
 */
async function uploadAudioFile(file) {
  try {
    if (process.env.NODE_ENV === 'production') {
      // Production: Upload to Cloudinary
      if (!process.env.CLOUDINARY_NAME) {
        throw new Error('Cloudinary is not configured. Set CLOUDINARY_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.');
      }

      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: 'video', // Cloudinary treats audio as video
        folder: 'evertales-audio',
        format: 'webm', // Optional: specify format
      });

      // Delete the temporary file after upload
      const fs = require('fs').promises;
      try {
        await fs.unlink(file.path);
      } catch (err) {
        console.warn('Could not delete temp file:', file.path);
      }

      return result.secure_url; // Return HTTPS URL
    } else {
      // Development: Use local storage
      return `/uploads/audio/${file.filename}`;
    }
  } catch (err) {
    console.error('Error uploading audio:', err);
    throw err;
  }
}

/**
 * Delete audio file from either local storage (development) or Cloudinary (production)
 * @param {string} filePath - File path or URL
 * @returns {Promise<void>}
 */
async function deleteAudioFile(filePath) {
  try {
    if (process.env.NODE_ENV === 'production') {
      // Production: Delete from Cloudinary
      if (!filePath.includes('cloudinary')) {
        return; // Not a Cloudinary URL, skip
      }

      // Extract public ID from Cloudinary URL
      const matches = filePath.match(/\/evertales-audio\/([^/.]+)/);
      if (matches && matches[1]) {
        const publicId = `evertales-audio/${matches[1]}`;
        await cloudinary.uploader.destroy(publicId);
      }
    } else {
      // Development: Delete from local storage
      if (filePath.startsWith('/uploads/')) {
        const fs = require('fs').promises;
        const fullPath = path.join(__dirname, '../../..', filePath);
        try {
          await fs.unlink(fullPath);
        } catch (err) {
          console.warn('Could not delete local file:', fullPath);
        }
      }
    }
  } catch (err) {
    console.error('Error deleting audio file:', err);
    // Don't throw - file deletion failures shouldn't break the app
  }
}

module.exports = {
  uploadAudioFile,
  deleteAudioFile,
};
