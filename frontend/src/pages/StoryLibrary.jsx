import { useEffect, useMemo, useState } from 'react';
import { storyAPI, categoryAPI } from '../services/api.js';
import StoryCard from '../components/StoryCard.jsx';

function StoryLibrary() {
  const [allStories, setAllStories] = useState([]); // full list, used when no search query
  const [stories, setStories] = useState([]);        // what's actually rendered
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  // Initial load: stories + categories
  useEffect(() => {
    setLoading(true);
    Promise.all([storyAPI.getAll(), categoryAPI.getAll()])
      .then(([storiesRes, categoriesRes]) => {
        setAllStories(storiesRes.data);
        setCategories(categoriesRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Live search with debounce — fires 350ms after the user stops typing
  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      // No query: fall back to the full list (filters still apply client-side below)
      setStories(allStories);
      return;
    }

    setSearching(true);
    const timer = setTimeout(() => {
      storyAPI
        .search(trimmed)
        .then(({ data }) => setStories(data))
        .catch(() => setStories([]))
        .finally(() => setSearching(false));
    }, 350);

    return () => clearTimeout(timer);
  }, [query, allStories]);

  // Apply category + favorites filters client-side on top of the search/full results
  const visibleStories = useMemo(() => {
    return stories.filter((s) => {
      if (categoryFilter && String(s.category_id) !== String(categoryFilter)) return false;
      if (favoritesOnly && !s.is_favorite) return false;
      return true;
    });
  }, [stories, categoryFilter, favoritesOnly]);

  const clearSearch = () => setQuery('');
  const clearFilters = () => {
    setQuery('');
    setCategoryFilter('');
    setFavoritesOnly(false);
  };

  const hasActiveFilters = query || categoryFilter || favoritesOnly;

  return (
    <div>
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white">My Story Library</h1>
            <p className="text-gray-400 mt-2">Organize and explore all your memories</p>
          </div>
          {!loading && (
            <div className="bg-indigo-50 text-indigo-600 px-6 py-3 rounded-full font-semibold border border-indigo-200">
              {visibleStories.length} {visibleStories.length === 1 ? 'story' : 'stories'}
            </div>
          )}
        </div>

        {/* Search bar - Enhanced */}
        <div className="relative mb-6">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, description, or tag..."
            className="border-2 border-gray-800 hover:border-gray-700 focus:border-indigo-500 focus:outline-none rounded-lg px-4 pl-12 py-3 w-full text-gray-100 placeholder-gray-400 transition-colors"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {searching && <span className="text-xs text-gray-400 font-medium">Searching...</span>}
            {query && !searching && (
              <button
                type="button"
                onClick={clearSearch}
                className="text-gray-400 hover:text-gray-400 text-xl transition"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filters row - Enhanced */}
        <div className="flex flex-wrap items-center gap-3 pb-6 border-b border-gray-800">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border-2 border-gray-800 hover:border-gray-700 focus:border-indigo-500 rounded-lg px-4 py-2 text-sm text-gray-200 font-medium focus:outline-none transition-colors bg-gray-900"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.category_id} value={c.category_id}>
                {c.category_name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setFavoritesOnly((v) => !v)}
            className={`text-sm px-4 py-2 rounded-lg font-semibold border-2 transition-all ${
              favoritesOnly
                ? 'bg-amber-50 border-amber-300 text-amber-600'
                : 'border-gray-800 text-gray-400 hover:border-gray-700 hover:bg-gray-900/50'
            }`}
          >
            {favoritesOnly ? '★ Favorites only' : '☆ Favorites only'}
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold px-4 py-2 hover:bg-indigo-50 rounded-lg transition"
            >
              ✕ Clear all
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">Loading your memories...</p>
        </div>
      )}

      {!loading && visibleStories.length === 0 && (
        <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
          <p className="text-gray-400 text-lg">
            {hasActiveFilters
              ? '🔍 No stories match your search or filters.'
              : '📝 No stories yet — add your first memory!'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleStories.map((story) => (
          <StoryCard key={story.story_id} story={story} />
        ))}
      </div>
    </div>
  );
}

export default StoryLibrary;
