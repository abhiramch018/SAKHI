import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Logo } from '../../components/common/Logo';
import { Button } from '../../components/ui/Button';
import { LogIn, Lock, Mail, AlertCircle, Sparkles, UserCheck, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/aww/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo Login Quick Fillers
  const fillDemo = (role: 'AWW' | 'ADMIN') => {
    if (role === 'AWW') {
      setEmail('shailaja.aww@fmch.org');
      setPassword('password123');
    } else {
      setEmail('admin@fmch.org');
      setPassword('admin123');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl relative">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome to SAKHI
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Sign in to access your counselling workflows & reports
          </p>
        </div>

        {/* Error alert */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email or Mobile
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@fmch.org or 9876543210"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <Link to="/register" className="text-xs font-semibold text-blue-900 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            leftIcon={<LogIn className="w-4 h-4" />}
            size="lg"
            className="mt-2"
          >
            {t('login')}
          </Button>
        </form>

        {/* Demo Fast Logins for Testing */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <div className="text-[11px] font-bold text-slate-400 text-center uppercase tracking-wider">
            ⚡ Quick Test Logins
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemo('AWW')}
              className="flex items-center justify-center gap-1.5 text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 py-2 px-2.5 rounded-xl transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Fill AWW User</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemo('ADMIN')}
              className="flex items-center justify-center gap-1.5 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 py-2 px-2.5 rounded-xl transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
              <span>Fill Admin User</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-500">
          New worker or supervisor?{' '}
          <Link to="/register" className="font-bold text-blue-900 hover:underline">
            Register for SAKHI
          </Link>
        </div>
      </div>
    </div>
  );
};

