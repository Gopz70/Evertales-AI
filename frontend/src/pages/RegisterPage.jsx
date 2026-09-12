import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Password validation function
  const validatePassword = (pwd) => {
    return {
      minLength: pwd.length >= 8,
      hasUppercase: /[A-Z]/.test(pwd),
      hasLowercase: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
    };
  };

  const passwordStrength = validatePassword(form.password);
  const isPasswordValid = Object.values(passwordStrength).every(req => req);
  const strengthCount = Object.values(passwordStrength).filter(req => req).length;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isPasswordValid) {
      setError('Password does not meet all requirements');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const { data } = await authAPI.register(form);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-950 to-black flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">📖</div>
          <h1 className="text-3xl font-bold text-white">Join EverTales</h1>
          <p className="text-gray-400 mt-2">Start preserving your memories</p>
        </div>

        {error && (
          <div className="bg-red-950 border border-red-800 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Full Name</label>
            <input
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              className="w-full border-2 border-gray-700 hover:border-slate-500 focus:border-indigo-500 focus:outline-none rounded-lg px-4 py-3 bg-gray-950 text-white placeholder-gray-500 transition-colors"
              required
            />
          </div>

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
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className={`w-full border-2 rounded-lg px-4 py-3 pr-12 bg-gray-950 text-white placeholder-gray-500 transition-colors focus:outline-none ${
                  form.password === '' ? 'border-gray-700 hover:border-slate-500 focus:border-indigo-500' :
                  isPasswordValid ? 'border-green-600 focus:border-green-500' : 
                  'border-red-600 focus:border-red-500'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            {/* Password strength indicator */}
            {form.password && (
              <div className="mt-3 space-y-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded-full transition-colors ${
                        i <= strengthCount ? 'bg-green-500' : 'bg-gray-700'
                      }`}
                    />
                  ))}
                </div>

                <div className="space-y-1 text-xs">
                  <div className={`flex items-center gap-2 ${passwordStrength.minLength ? 'text-green-400' : 'text-gray-400'}`}>
                    <span>{passwordStrength.minLength ? '✓' : '○'}</span>
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordStrength.hasUppercase ? 'text-green-400' : 'text-gray-400'}`}>
                    <span>{passwordStrength.hasUppercase ? '✓' : '○'}</span>
                    <span>Uppercase letter (A-Z)</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordStrength.hasLowercase ? 'text-green-400' : 'text-gray-400'}`}>
                    <span>{passwordStrength.hasLowercase ? '✓' : '○'}</span>
                    <span>Lowercase letter (a-z)</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordStrength.hasNumber ? 'text-green-400' : 'text-gray-400'}`}>
                    <span>{passwordStrength.hasNumber ? '✓' : '○'}</span>
                    <span>Number (0-9)</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordStrength.hasSpecial ? 'text-green-400' : 'text-gray-400'}`}>
                    <span>{passwordStrength.hasSpecial ? '✓' : '○'}</span>
                    <span>Special character (!@#$%^&*)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !isPasswordValid}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold rounded-lg py-3 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 font-semibold hover:text-indigo-300">
              Sign in
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

export default RegisterPage;
