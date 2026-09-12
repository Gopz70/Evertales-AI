import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

function UserProfile() {
  const [form, setForm] = useState({ name: '', email: '', profile_image: '' });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    authAPI.getProfile()
      .then(({ data }) => setForm({ name: data.name, email: data.email, profile_image: data.profile_image || '' }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaved(false);
    try {
      await authAPI.updateProfile({ name: form.name, profile_image: form.profile_image });
      // keep the shared auth state (and therefore the Navbar) in sync immediately
      setUser((prev) => ({ ...prev, name: form.name, profile_image: form.profile_image }));
      setSaved(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-800 mb-6">
        <h2 className="text-2xl font-bold mb-6 text-white">Your Profile</h2>
        {saved && <p className="text-green-400 text-sm mb-4 bg-green-950 px-4 py-2 rounded border border-green-800">✓ Profile updated!</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Full Name</label>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border-2 border-gray-700 hover:border-slate-500 focus:border-indigo-500 focus:outline-none rounded-lg px-4 py-3 bg-gray-950 text-white placeholder-gray-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
            <input
              name="email"
              value={form.email}
              disabled
              className="w-full border-2 border-gray-700 rounded-lg px-4 py-3 bg-gray-800 text-gray-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Profile Image URL</label>
            <input
              name="profile_image"
              placeholder="https://example.com/image.jpg"
              value={form.profile_image}
              onChange={handleChange}
              className="w-full border-2 border-gray-700 hover:border-slate-500 focus:border-indigo-500 focus:outline-none rounded-lg px-4 py-3 bg-gray-950 text-white placeholder-gray-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold rounded-lg py-3 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Save Changes
          </button>
        </form>
      </div>

      {/* Change Password Section */}
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-800">
        <h3 className="text-xl font-bold mb-4 text-white">🔐 Security</h3>
        <p className="text-gray-400 mb-4">Manage your account security settings</p>
        <Link
          to="/change-password"
          className="inline-block bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white font-semibold rounded-lg px-6 py-3 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Change Password
        </Link>
      </div>
    </div>
  );
}

export default UserProfile;
