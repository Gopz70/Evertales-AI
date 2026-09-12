import { useEffect, useState, useMemo } from 'react';
import { storyAPI } from '../services/api.js';

function TimelineView() {
  const [allStories, setAllStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    storyAPI
      .getAll()
      .then(({ data }) => {
        // Sort by date descending (newest first)
        const sorted = [...data].sort((a, b) => new Date(b.story_date) - new Date(a.story_date));
        setAllStories(sorted);
      })
      .catch(() => setAllStories([]))
      .finally(() => setLoading(false));
  }, []);

  // Group stories by year and month
  const groupedStories = useMemo(() => {
    const groups = {};
    allStories.forEach((story) => {
      const date = new Date(story.story_date);
      const year = date.getFullYear();
      const month = date.toLocaleString('default', { month: 'long' });
      const key = `${year}-${month}`;

      if (!groups[key]) {
        groups[key] = { year, month, stories: [], sortDate: date };
      }
      groups[key].stories.push(story);
    });

    // Sort groups by date descending
    return Object.values(groups).sort((a, b) => b.sortDate - a.sortDate);
  }, [allStories]);

  if (loading) return <p className="text-gray-500">Loading timeline...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-100 mb-2">Your Memory Timeline</h1>
      <p className="text-gray-400 mb-8">
        Explore your memories organized chronologically through time.
      </p>

      {allStories.length === 0 ? (
        <p className="text-gray-500 text-center py-16">
          No memories yet. Start creating stories to build your timeline! 📖
        </p>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-400 via-indigo-300 to-indigo-200"></div>

          {/* Timeline items */}
          <div className="space-y-12">
            {groupedStories.map((group) => (
              <div key={`${group.year}-${group.month}`} className="relative">
                {/* Timeline node */}
                <div className="absolute left-0 top-4 w-14 h-14 bg-gray-900 border-4 border-indigo-600 rounded-full flex items-center justify-center shadow-md">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                </div>

                {/* Month/Year header */}
                <div className="ml-24">
                  <h2 className="text-2xl font-bold text-indigo-600">
                    {group.month} {group.year}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {group.stories.length} {group.stories.length === 1 ? 'memory' : 'memories'}
                  </p>

                  {/* Stories in this month */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    {group.stories.map((story) => (
                      <a
                        key={story.story_id}
                        href={`/stories/${story.story_id}`}
                        className="group bg-gray-900 rounded-lg shadow-sm border border-gray-800 p-4 hover:shadow-lg hover:border-indigo-300 transition-all cursor-pointer"
                      >
                        {/* Favorite indicator */}
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-100 group-hover:text-indigo-600 transition flex-1 line-clamp-2">
                            {story.title}
                          </h3>
                          {story.is_favorite && (
                            <span className="text-amber-500 ml-2 text-lg" title="Favorite">
                              ★
                            </span>
                          )}
                        </div>

                        {/* Date */}
                        <p className="text-xs text-gray-500">
                          {new Date(story.story_date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>

                        {/* Category */}
                        {story.category_name && (
                          <span className="inline-block mt-2 text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded">
                            {story.category_name}
                          </span>
                        )}

                        {/* Preview text */}
                        <p className="text-sm text-gray-400 mt-3 line-clamp-3">
                          {story.description || 'No description'}
                        </p>

                        {/* Arrow indicator */}
                        <div className="mt-3 text-indigo-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                          View Story →
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TimelineView;
