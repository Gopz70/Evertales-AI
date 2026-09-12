import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { storyAPI } from '../services/api.js';
import StoryCard from '../components/StoryCard.jsx';

function Dashboard() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storyAPI.getAll()
      .then(({ data }) => setStories(data.slice(0, 6))) // recent memories
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">Welcome to EverTales AI</h1>
        <p className="text-lg text-gray-400">Your personal digital memory archive</p>
      </div>

      {/* Quick action cards - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Browse Stories Card */}
        <Link
          to="/stories"
          className="group relative overflow-hidden bg-gradient-to-br from-indigo-600/90 to-purple-600/90 hover:from-indigo-500/90 hover:to-purple-500/90 rounded-2xl p-8 text-white shadow-lg hover:shadow-2xl transition-all transform border border-indigo-500/50 hover:border-indigo-400 hover:shadow-indigo-500/40"
        >
          <div className="absolute inset-0 bg-gray-900 opacity-0 group-hover:opacity-5 transition-opacity"></div>
          <div className="relative z-10">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-2xl font-bold mb-2">My Stories</h3>
            <p className="text-gray-200">Browse and search your library</p>
            <div className="mt-4 text-sm font-semibold flex items-center gap-2">
              Explore →
            </div>
          </div>
        </Link>

        {/* Timeline Card */}
        <Link
          to="/timeline"
          className="group relative overflow-hidden bg-gradient-to-br from-purple-600/90 to-amber-600/90 hover:from-purple-500/90 hover:to-amber-500/90 rounded-2xl p-8 text-white shadow-lg hover:shadow-2xl transition-all transform border border-purple-500/50 hover:border-purple-400 hover:shadow-purple-500/40"
        >
          <div className="absolute inset-0 bg-gray-900 opacity-0 group-hover:opacity-5 transition-opacity"></div>
          <div className="relative z-10">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-2xl font-bold mb-2">Timeline</h3>
            <p className="text-gray-200">View memories chronologically</p>
            <div className="mt-4 text-sm font-semibold flex items-center gap-2">
              Visualize →
            </div>
          </div>
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Your Recent Memories</h2>
            <p className="text-gray-400 text-sm mt-1">Latest stories you've created</p>
          </div>
          <Link to="/stories" className="text-indigo-400 hover:text-indigo-300 font-semibold text-sm">
            View All →
          </Link>
        </div>

      {loading && <p className="text-gray-500">Loading...</p>}
      {!loading && stories.length === 0 && (
        <p className="text-gray-500">No stories yet — start by adding your first memory.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <StoryCard key={story.story_id} story={story} />
        ))}
      </div>
      </div>
    </div>
  );
}

export default Dashboard;
