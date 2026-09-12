import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authAPI.login(form);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-950 to-black flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">📖</div>
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-400 mt-2">Sign in to your memory archive</p>
        </div>

        {error && (
          <div className="bg-red-950 border border-red-800 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className="w-full border-2 border-gray-700 hover:border-slate-500 focus:border-indigo-500 focus:outline-none rounded-lg px-4 py-3 bg-gray-950 text-white placeholder-gray-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="w-full border-2 border-gray-700 hover:border-slate-500 focus:border-indigo-500 focus:outline-none rounded-lg px-4 py-3 bg-gray-950 text-white placeholder-gray-500 transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold rounded-lg py-3 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-400">
            No account?{' '}
            <Link to="/register" className="text-indigo-400 font-semibold hover:text-indigo-300">
              Create one
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link to="/explore" className="text-sm text-gray-500 hover:text-gray-400">
            Or browse public memories →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
