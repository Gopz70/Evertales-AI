// AI Integration Module
// Speech-to-Text: Now handled entirely on frontend with Web Speech API (browser-based, free)
// Tag Generation: Local NLP-based keyword extraction (no API needed)

// Common English stop words to filter out
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of',
  'is', 'was', 'are', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
  'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it',
  'we', 'they', 'what', 'which', 'who', 'when', 'where', 'why', 'how',
  'my', 'your', 'his', 'her', 'its', 'our', 'their', 'as', 'from', 'by',
  'with', 'about', 'into', 'through', 'during', 'before', 'after', 'above',
  'below', 'up', 'down', 'out', 'off', 'over', 'under', 'again', 'further',
  'then', 'once', 'very', 'so', 'just', 'only', 'own', 'same', 'such', 'no',
  'not', 'if', 'because', 'while', 'although', 'too', 'more', 'most', 'some',
  'any', 'few', 'all', 'each', 'every', 'both', 'either', 'neither'
]);

async function generateTags(req, res) {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'text is required' });

    // Extract and clean words
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .split(/\s+/) // Split by whitespace
      .filter(word => word.length > 2) // Only words longer than 2 chars
      .filter(word => !STOP_WORDS.has(word)); // Remove stop words

    // Count word frequency
    const wordFreq = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    // Sort by frequency and take top 5-10 tags
    const tags = Object.entries(wordFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([word]) => word)
      .filter(tag => tag.length > 0);

    // If fewer than 3 tags, add some common category-based tags
    if (tags.length < 3) {
      const categoryTags = [];
      if (text.toLowerCase().includes('family') || text.toLowerCase().includes('mom') || text.toLowerCase().includes('dad')) {
        categoryTags.push('family');
      }
      if (text.toLowerCase().includes('travel') || text.toLowerCase().includes('trip') || text.toLowerCase().includes('visit')) {
        categoryTags.push('travel');
      }
      if (text.toLowerCase().includes('work') || text.toLowerCase().includes('job') || text.toLowerCase().includes('career')) {
        categoryTags.push('work');
      }
      if (text.toLowerCase().includes('friend') || text.toLowerCase().includes('celebration') || text.toLowerCase().includes('party')) {
        categoryTags.push('social');
      }
      tags.push(...categoryTags.slice(0, 3 - tags.length));
    }

    res.json({ tags: tags.slice(0, 10) });
  } catch (err) {
    console.error('Tag generation error:', err);
    res.status(500).json({ message: 'Server error generating tags' });
  }
}

module.exports = { generateTags };
