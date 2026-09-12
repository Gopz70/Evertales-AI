const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const mediaController = require('../controllers/mediaController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// PUBLIC ROUTES (no authentication required)
router.get('/public', storyController.getPublicStories);
router.get('/public/:id', storyController.getPublicStoryById);

// PROTECTED ROUTES (require authentication)
router.use(authMiddleware);

router.get('/search', storyController.searchStories); // must come before /:id
router.get('/', storyController.getStories);
router.get('/:id', storyController.getStoryById);
router.post('/', storyController.createStory);
router.put('/:id', storyController.updateStory);
router.delete('/:id', storyController.deleteStory);

router.post('/:storyId/media', upload.single('file'), mediaController.uploadMedia);
router.delete('/media/:mediaId', mediaController.deleteMedia);

module.exports = router;
