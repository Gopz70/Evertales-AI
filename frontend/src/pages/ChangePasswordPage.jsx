import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api.js';

function ChangePasswordPage() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const newPasswordStrength = validatePassword(form.newPassword);
  const isNewPasswordValid = Object.values(newPasswordStrength).every(req => req);
  const strengthCount = Object.values(newPasswordStrength).filter(req => req).length;
  const passwordsMatch = form.newPassword === form.confirmPassword && form.newPassword !== '';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccess('');
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!form.currentPassword) {
      setError('Current password is required');
      return;
    }

    if (!isNewPasswordValid) {
      setError('New password does not meet all requirements');
      return;
    }

    if (!passwordsMatch) {
      setError('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authAPI.changePassword({
        currentPassword: form.currentPassword,
        password: form.newPassword,
      });
      setSuccess('Password changed successfully!');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswords({ currentPassword: false, newPassword: false, confirmPassword: false });
      
      // Redirect to profile after 2 seconds
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-950 to-black flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🔐</div>
          <h1 className="text-3xl font-bold text-white">Change Password</h1>
          <p className="text-gray-400 mt-2">Update your account password</p>
        </div>

        {error && (
          <div className="bg-red-950 border border-red-800 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-950 border border-green-800 text-green-300 px-4 py-3 rounded-lg mb-6 text-sm font-medium">
            ✓ {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Current Password</label>
            <div className="relative">
              <input
                name="currentPassword"
                type={showPasswords.currentPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.currentPassword}
                onChange={handleChange}
                className="w-full border-2 border-gray-700 hover:border-slate-500 focus:border-indigo-500 focus:outline-none rounded-lg px-4 py-3 pr-12 bg-gray-950 text-white placeholder-gray-500 transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('currentPassword')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                {showPasswords.currentPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">New Password</label>
            <div className="relative">
              <input
                name="newPassword"
                type={showPasswords.newPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.newPassword}
                onChange={handleChange}
                className={`w-full border-2 rounded-lg px-4 py-3 pr-12 bg-gray-950 text-white placeholder-gray-500 transition-colors focus:outline-none ${
                  form.newPassword === '' ? 'border-gray-700 hover:border-slate-500 focus:border-indigo-500' :
                  isNewPasswordValid ? 'border-green-600 focus:border-green-500' : 
                  'border-red-600 focus:border-red-500'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('newPassword')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                {showPasswords.newPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            {/* Password strength indicator */}
            {form.newPassword && (
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
                  <div className={`flex items-center gap-2 ${newPasswordStrength.minLength ? 'text-green-400' : 'text-gray-400'}`}>
                    <span>{newPasswordStrength.minLength ? '✓' : '○'}</span>
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center gap-2 ${newPasswordStrength.hasUppercase ? 'text-green-400' : 'text-gray-400'}`}>
                    <span>{newPasswordStrength.hasUppercase ? '✓' : '○'}</span>
                    <span>Uppercase letter (A-Z)</span>
                  </div>
                  <div className={`flex items-center gap-2 ${newPasswordStrength.hasLowercase ? 'text-green-400' : 'text-gray-400'}`}>
                    <span>{newPasswordStrength.hasLowercase ? '✓' : '○'}</span>
                    <span>Lowercase letter (a-z)</span>
                  </div>
                  <div className={`flex items-center gap-2 ${newPasswordStrength.hasNumber ? 'text-green-400' : 'text-gray-400'}`}>
                    <span>{newPasswordStrength.hasNumber ? '✓' : '○'}</span>
                    <span>Number (0-9)</span>
                  </div>
                  <div className={`flex items-center gap-2 ${newPasswordStrength.hasSpecial ? 'text-green-400' : 'text-gray-400'}`}>
                    <span>{newPasswordStrength.hasSpecial ? '✓' : '○'}</span>
                    <span>Special character (!@#$%^&*)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Confirm New Password</label>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showPasswords.confirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                className={`w-full border-2 rounded-lg px-4 py-3 pr-12 bg-gray-950 text-white placeholder-gray-500 transition-colors focus:outline-none ${
                  form.confirmPassword === '' ? 'border-gray-700 hover:border-slate-500 focus:border-indigo-500' :
                  passwordsMatch ? 'border-green-600 focus:border-green-500' : 
                  'border-red-600 focus:border-red-500'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirmPassword')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                {showPasswords.confirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {form.confirmPassword && !passwordsMatch && (
              <p className="text-xs text-red-400 mt-2">Passwords do not match</p>
            )}
            {form.confirmPassword && passwordsMatch && (
              <p className="text-xs text-green-400 mt-2">✓ Passwords match</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !isNewPasswordValid || !passwordsMatch}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold rounded-lg py-3 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 mt-2"
          >
            {loading ? 'Updating password...' : 'Change Password'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-800 text-center">
          <button
            onClick={() => navigate('/profile')}
            className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
          >
            ← Back to Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordPage;
