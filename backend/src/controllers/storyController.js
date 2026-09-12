const StoryModel = require('../models/storyModel');
const MediaModel = require('../models/mediaModel');
const TagModel = require('../models/tagModel');
const CategoryModel = require('../models/categoryModel');

async function getStories(req, res) {
  try {
    const stories = await StoryModel.findAllByUser(req.userId);
    res.json(stories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching stories' });
  }
}

async function getStoryById(req, res) {
  try {
    const story = await StoryModel.findById(req.params.id, req.userId);
    if (!story) return res.status(404).json({ message: 'Story not found' });

    const [media, tags] = await Promise.all([
      MediaModel.findByStory(story.story_id),
      TagModel.findByStory(story.story_id),
    ]);

    res.json({ ...story, media, tags });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching story' });
  }
}

async function createStory(req, res) {
  try {
    const { title, description, story_date, category_id, transcript, tags, is_public } = req.body;
    if (!title) return res.status(400).json({ message: 'title is required' });

    // Set default date to today if not provided
    const finalDate = story_date && story_date.trim() ? story_date : new Date().toISOString().split('T')[0];

    const storyId = await StoryModel.create(req.userId, {
      title,
      description,
      story_date: finalDate,
      category_id,
      transcript,
      is_public,
    });

    // TODO (Phase 2): handle req.files here for photo/voice uploads via MediaModel.create
    // TODO (Phase 3): if no tags provided, call the AI tag-generation service instead
    if (Array.isArray(tags) && tags.length) {
      await TagModel.createMany(storyId, tags);
    }

    res.status(201).json({ story_id: storyId, message: 'Story created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating story' });
  }
}

async function updateStory(req, res) {
  try {
    const { title, description, story_date, category_id, is_favorite, is_public, tags } = req.body;
    
    // Set default date to today if not provided
    const finalDate = story_date && story_date.trim() ? story_date : new Date().toISOString().split('T')[0];
    
    await StoryModel.update(req.params.id, req.userId, {
      title,
      description,
      story_date: finalDate,
      category_id,
      is_favorite,
      is_public,
    });

    // Update tags if provided
    if (Array.isArray(tags) && tags.length) {
      await TagModel.deleteByStory(req.params.id); // Remove old tags
      await TagModel.createMany(req.params.id, tags); // Add new tags
    }

    res.json({ message: 'Story updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating story' });
  }
}

async function deleteStory(req, res) {
  try {
    await StoryModel.delete(req.params.id, req.userId);
    res.json({ message: 'Story deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error deleting story' });
  }
}

async function searchStories(req, res) {
  try {
    const q = req.query.q || '';
    const results = await StoryModel.search(req.userId, q);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error searching stories' });
  }
}

async function getCategories(req, res) {
  try {
    const categories = await CategoryModel.findAll();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching categories' });
  }
}

async function getPublicStories(req, res) {
  try {
    const stories = await StoryModel.findPublic();
    res.json(stories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching public stories' });
  }
}

async function getPublicStoryById(req, res) {
  try {
    const story = await StoryModel.findPublicById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Public story not found' });
    }
    
    // Fetch media and tags for the public story
    const [media, tags] = await Promise.all([
      MediaModel.findByStory(story.story_id),
      TagModel.findByStory(story.story_id),
    ]);
    
    res.json({ ...story, media, tags });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching public story' });
  }
}

module.exports = {
  getStories,
  getStoryById,
  createStory,
  updateStory,
  deleteStory,
  searchStories,
  getCategories,
  getPublicStories,
  getPublicStoryById,
};
