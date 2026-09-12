import { useEffect, useState } from 'react';
import { storyAPI } from '../services/api.js';

function ExploreMemories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setLoading(true);
    storyAPI
      .getPublic()
      .then(({ data }) => setStories(data))
      .catch(() => setStories([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredStories = filter === 'all' 
    ? stories 
    : stories.filter(s => s.category_name === filter);

  const categories = [...new Set(stories.map(s => s.category_name).filter(Boolean))];

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-3">Explore Public Memories</h1>
        <p className="text-lg text-gray-400">
          Discover inspiring stories shared by our community members
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {stories.length} public {stories.length === 1 ? 'memory' : 'memories'} available
        </p>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-10 pb-6 border-b border-gray-800">
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              filter === 'all'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 hover:text-white'
            }`}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                filter === cat
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">Loading memories...</p>
        </div>
      )}

      {!loading && filteredStories.length === 0 && (
        <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
          <p className="text-gray-500 text-lg">
            {stories.length === 0 
              ? '🌟 No public memories yet. Be the first to share one!'
              : '📭 No memories in this category.'}
          </p>
        </div>
      )}

      {/* Public Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStories.map(story => (
          <a
            key={story.story_id}
            href={`/public/stories/${story.story_id}`}
            className="group bg-gray-900 rounded-2xl shadow-md hover:shadow-xl border border-slate-800 hover:border-indigo-200 overflow-hidden transition-all hover:scale-105 transform"
          >
            {/* Story card header with category gradient */}
            <div className="h-32 bg-gradient-to-br from-indigo-100 to-blue-100 relative overflow-hidden flex items-center justify-center text-5xl opacity-30">
              {story.category_name === 'Family' && '👨‍👩‍👧‍👦'}
              {story.category_name === 'Travel' && '✈️'}
              {story.category_name === 'Education' && '🎓'}
              {story.category_name === 'Career' && '💼'}
              {story.category_name === 'Achievements' && '🏆'}
              {story.category_name === 'Personal' && '✨'}
              {!story.category_name && '📖'}
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-bold text-white group-hover:text-indigo-600 transition flex-1 line-clamp-2 text-lg">
                  {story.title}
                </h3>
                {story.is_favorite && (
                  <span className="text-amber-500 text-xl">★</span>
                )}
              </div>

              {/* Date */}
              <p className="text-xs text-gray-500 mb-3 font-medium">
                {new Date(story.story_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>

              {/* Category */}
              {story.category_name && (
                <span className="inline-block mb-4 text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full font-semibold">
                  {story.category_name}
                </span>
              )}

              {/* Preview text */}
              <p className="text-sm text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                {story.description || 'No description'}
              </p>

              {/* Author and view link */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <span className="text-xs text-gray-500">
                  By <span className="font-semibold text-gray-200">{story.author_name || 'Anonymous'}</span>
                </span>
                <span className="text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default ExploreMemories;
