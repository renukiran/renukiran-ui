import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    try {
      setLoading(true);
      setError(null);
      // const response = await authAPI.login({ email, password });
      // const { token, user } = response;
      // localStorage.setItem('jwtToken', token);
      // if (rememberMe) localStorage.setItem('rememberMe', 'true');
      // onLoginSuccess(user);
      console.log('Login with:', { email, password, rememberMe });
      // Mock login for development
      onLoginSuccess({ email, role: 'admin', name: 'Vijaya Adalath' });
    } catch (err) {
      setError('Invalid email or password. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-md px-6">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="14" cy="10" r="4.5" fill="#7CB518" />
              <path d="M14 16c-5 0-9 3-9 7v3h18v-3c0-4-4-7-9-7z" fill="#7CB518" opacity="0.8" />
              <circle cx="34" cy="10" r="4.5" fill="#2B5EA7" />
              <path d="M34 16c-5 0-9 3-9 7v3h18v-3c0-4-4-7-9-7z" fill="#2B5EA7" opacity="0.8" />
              <circle cx="24" cy="6" r="5" fill="#2B5EA7" />
              <path d="M24 13c-6 0-10 3.5-10 8v4h20v-4c0-4.5-4-8-10-8z" fill="#2B5EA7" opacity="0.6" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: '#7CB518' }}>Renukiran</h1>
          <p className="text-xs font-semibold tracking-widest text-blue-700 uppercase mt-1">Welfare Foundation</p>
          <p className="text-sm text-gray-500 mt-2">Learning Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-md px-8 py-9">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Sign In</h2>
          <p className="text-sm text-gray-500 mb-6">Enter your credentials to access the portal</p>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-3 rounded-lg mb-5">
              <span className="font-bold mt-0.5">!</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-900 mb-1.5" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full h-11 px-3.5 text-sm bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:bg-white transition"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-900 mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full h-11 px-3.5 pr-11 text-sm bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-700 rounded transition"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-blue-700 cursor-pointer"
                />
                Remember me
              </label>
              <button
                type="button"
                className="text-sm font-medium text-blue-700 hover:text-blue-900 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full h-11 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-md transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 px-4 py-3 bg-gray-100 rounded-md text-center text-xs text-gray-500 leading-relaxed">
            Staff accounts are created by the admin.<br />
            Contact your administrator for access.
          </div>
        </div>

        <p className="text-center mt-8 text-xs text-gray-400">Powered by RWF</p>
      </div>
    </div>
  );
};

export default Login;
