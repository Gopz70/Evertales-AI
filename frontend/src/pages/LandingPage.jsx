import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function LandingPage() {
  const { isAuthenticated, user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-950 to-black">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="mb-6 inline-block">
            <div className="text-6xl">📖</div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Preserve Your Life's <br />
            <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
              Meaningful Memories
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Turn your photos, voice recordings, and stories into an intelligently organized digital memory archive. 
            Share your journey with the world or keep it private—you're in control.
          </p>

          {/* CTA Buttons */}
          {loading ? null : isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Go to Dashboard
              </Link>
              <Link
                to="/explore"
                className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-indigo-400 rounded-lg font-semibold border-2 border-indigo-600 transition-all"
              >
                Explore Public Stories
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                to="/register"
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-indigo-400 rounded-lg font-semibold border-2 border-indigo-600 transition-all"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Public Explore for guests */}
          {!loading && !isAuthenticated && (
            <p className="text-gray-400">
              or <Link to="/explore" className="text-indigo-400 font-semibold hover:text-indigo-300">browse public memories</Link> without signing in
            </p>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {/* Feature 1 */}
          <div className="bg-gray-900 hover:bg-slate-750 border border-gray-800 hover:border-indigo-500 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="text-4xl mb-4">🎙️</div>
            <h3 className="text-xl font-bold text-white mb-3">Voice Memories</h3>
            <p className="text-gray-400">
              Record your memories in 30+ languages. We transcribe everything automatically.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-900 hover:bg-slate-750 border border-gray-800 hover:border-indigo-500 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-white mb-3">AI-Powered Tags</h3>
            <p className="text-gray-400">
              Smart automatic tagging makes finding your memories effortless.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-900 hover:bg-slate-750 border border-gray-800 hover:border-indigo-500 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-bold text-white mb-3">Share & Explore</h3>
            <p className="text-gray-400">
              Make memories public to inspire others, or keep them private.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-gray-900 hover:bg-slate-750 border border-gray-800 hover:border-indigo-500 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="text-4xl mb-4">📸</div>
            <h3 className="text-xl font-bold text-white mb-3">Multimedia Stories</h3>
            <p className="text-gray-400">
              Combine text, photos, and voice recordings in one beautiful story.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-gray-900 hover:bg-slate-750 border border-gray-800 hover:border-indigo-500 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-white mb-3">Timeline View</h3>
            <p className="text-gray-400">
              Explore your journey through an interactive timeline of memories.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-gray-900 hover:bg-slate-750 border border-gray-800 hover:border-indigo-500 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-white mb-3">Private & Secure</h3>
            <p className="text-gray-400">
              Your memories are encrypted and only you can access them.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-gradient-to-r from-indigo-600/20 to-blue-600/20 border border-indigo-500/30 rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-12">Start Preserving Your Memories Today</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">∞</div>
              <p className="text-gray-300">Unlimited Stories</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">30+</div>
              <p className="text-gray-300">Supported Languages</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <p className="text-gray-300">Private & Secure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
