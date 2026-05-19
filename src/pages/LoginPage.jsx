import React, { useState } from 'react';
import { LogIn, UserPlus, Zap, AlertCircle } from 'lucide-react';
import { authAPI } from '../lib/api';

export default function LoginPage({ onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    companyName: '',
    websiteDomain: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const response = await authAPI.login(formData.email, formData.password);
        onLogin(response.token, response.user);
      } else {
        const response = await authAPI.register(formData);
        onLogin(response.token, response.user);
        setSuccess('Account created! Redirecting...');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              GTM + LinkedIn
            </h1>
          </div>
          <p className="text-slate-400">Interactive Setup & Tracking Application</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-8 backdrop-blur">
          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                mode === 'login'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <LogIn className="w-4 h-4 inline mr-2" />
              Login
            </button>
            <button
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                mode === 'register'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <UserPlus className="w-4 h-4 inline mr-2" />
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="your@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            {/* Register-only fields */}
            {mode === 'register' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    placeholder="Verkko.ai"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Website Domain</label>
                  <input
                    type="text"
                    name="websiteDomain"
                    value={formData.websiteDomain}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    placeholder="verkko.ai"
                  />
                </div>
              </>
            )}

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-2 text-red-400 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-8 border-t border-slate-700/50">
            <p className="text-xs text-slate-500 text-center mb-3">Demo Credentials (for testing)</p>
            <div className="bg-slate-900/50 rounded p-3 text-xs text-slate-400 space-y-1">
              <div><strong>Email:</strong> demo@example.com</div>
              <div><strong>Password:</strong> demo123456</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-8">
          Secure GTM + LinkedIn conversion tracking setup • Railway hosted
        </p>
      </div>
    </div>
  );
}
