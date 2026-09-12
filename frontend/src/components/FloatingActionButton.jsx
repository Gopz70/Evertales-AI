import { Link } from 'react-router-dom';

function FloatingActionButton() {
  return (
    <Link
      to="/stories/new"
      className="fixed bottom-8 right-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all font-semibold flex items-center gap-2 z-40 group border border-indigo-500/50 hover:border-indigo-400 hover:shadow-indigo-500/40"
      title="Add a new story"
    >
      <span className="text-lg transition-transform">✍️</span>
      Add Story
    </Link>
  );
}

export default FloatingActionButton;
