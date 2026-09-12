import { Link } from 'react-router-dom';

function StoryCard({ story }) {
  return (
    <Link
      to={`/stories/${story.story_id}`}
      className="group block bg-gray-900 hover:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl border border-gray-800 hover:border-indigo-500 overflow-hidden transition-all hover:scale-105 transform"
    >
      {/* Placeholder gradient background */}
      <div className="h-40 bg-gradient-to-br from-indigo-900/50 to-blue-900/50 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-20">
          {story.category_name === 'Family' && '👨‍👩‍👧‍👦'}
          {story.category_name === 'Travel' && '✈️'}
          {story.category_name === 'Education' && '🎓'}
          {story.category_name === 'Career' && '💼'}
          {story.category_name === 'Achievements' && '🏆'}
          {story.category_name === 'Personal' && '✨'}
          {!story.category_name && '📖'}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Header with title and badges */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-bold text-white group-hover:text-indigo-400 transition flex-1 line-clamp-2 text-lg">
            {story.title}
          </h3>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {story.is_public ? (
              <span className="text-xs bg-blue-950/60 text-blue-400 px-2.5 py-1 rounded-full font-medium whitespace-nowrap border border-blue-800/50">🌍 Public</span>
            ) : (
              <span className="text-xs bg-gray-800 text-gray-300 px-2.5 py-1 rounded-full font-medium whitespace-nowrap border border-gray-700">🔒 Private</span>
            )}
            {story.is_favorite && (
              <span className="text-amber-500 text-lg" title="Favorite">★</span>
            )}
          </div>
        </div>

        {/* Date */}
        <p className="text-xs text-gray-500 mb-3 font-medium">
          {new Date(story.story_date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>

        {/* Category badge */}
        {story.category_name && (
          <span className="inline-block mb-3 text-xs bg-indigo-950/60 text-indigo-400 px-3 py-1.5 rounded-full font-semibold border border-indigo-800/50">
            {story.category_name}
          </span>
        )}

        {/* Preview text */}
        <p className="text-sm text-gray-400 mb-4 line-clamp-2 leading-relaxed">
          {story.description || 'No description'}
        </p>

        {/* Footer with read more */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-800">
          <span className="text-xs text-gray-500 font-medium">View story</span>
          <span className="text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </Link>
  );
}

export default StoryCard;
