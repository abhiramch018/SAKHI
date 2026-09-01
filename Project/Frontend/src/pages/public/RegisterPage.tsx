import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { authApi, otpApi } from '../../lib/api';
import { Logo } from '../../components/common/Logo';
import { Button } from '../../components/ui/Button';
import { UserPlus, Lock, Mail, User, ShieldCheck, KeyRound, AlertCircle, CheckCircle2, ArrowRight, Phone } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [step, setStep] = useState<'DETAILS' | 'OTP' | 'SUCCESS'>('DETAILS');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpSentMsg, setOtpSentMsg] = useState<string | null>(null);

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await authApi.register({ name, email, phone, password });
      if (res.success) {
        setOtpSentMsg(`A 6-digit verification code was sent to ${res.data?.email || email}. It is valid for 5 minutes.`);
        setStep('OTP');
      } else {
        setError(res.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the 6-digit verification OTP.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await otpApi.verifyOTP(email, otp);
      if (res.success) {
        setStep('SUCCESS');
      } else {
        setError(res.message || 'OTP verification failed.');
      }
    } catch (err: any) {
      setError(err.message || 'OTP verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl relative">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Create SAKHI Account
          </h2>
          <p className="text-xs text-slate-500">
            Register as an Anganwadi Worker to access counselling tools
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === 'DETAILS' && (
          <form className="space-y-4" onSubmit={handleDetailsSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. priya@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Create Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              size="lg"
              className="mt-2"
            >
              Continue to OTP Verification
            </Button>
          </form>
        )}

        {step === 'OTP' && (
          <form className="space-y-4" onSubmit={handleOtpVerify}>
            <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-xl text-xs text-blue-900">
              {otpSentMsg}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Enter 6-Digit OTP Code
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-base tracking-widest font-mono text-center focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="warm"
              fullWidth
              isLoading={isLoading}
              leftIcon={<ShieldCheck className="w-4 h-4" />}
              size="lg"
            >
              Verify & Complete Registration
            </Button>

            <button
              type="button"
              onClick={() => setStep('DETAILS')}
              className="w-full text-xs text-slate-500 hover:text-slate-900 py-1"
            >
              ← Back to Details
            </button>
          </form>
        )}

        {step === 'SUCCESS' && (
          <div className="text-center space-y-4 py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Account Created Successfully!</h3>
            <p className="text-xs text-slate-600">
              Your account has been verified. You can now log in and begin using SAKHI.
            </p>
            <Button
              onClick={() => navigate('/login')}
              variant="primary"
              fullWidth
              size="lg"
            >
              Go to Login
            </Button>
          </div>
        )}

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-blue-900 hover:underline">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};
