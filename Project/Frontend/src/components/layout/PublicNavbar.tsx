import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { LanguageToggle } from '../common/LanguageToggle';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Menu, X, LogIn, UserCheck, LayoutDashboard } from 'lucide-react';
import { Button } from '../ui/Button';

export const PublicNavbar: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: t('navHome'), href: '#hero' },
    { label: t('navAbout'), href: '#challenge' },
    { label: t('navHowItWorks'), href: '#how-it-works' },
    { label: t('navForAWWs'), href: '#for-awws' },
    { label: t('navForFMCH'), href: '#for-fmch' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Logo size="md" />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-semibold text-slate-600 hover:text-blue-900 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageToggle />

          {isAuthenticated && user ? (
            <Link to={user.role === 'ADMIN' ? '/admin/dashboard' : '/aww/dashboard'}>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<LayoutDashboard className="w-4 h-4" />}
              >
                {t('dashboard')} ({user.role})
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" size="sm" leftIcon={<LogIn className="w-4 h-4" />}>
                  {t('login')}
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm" leftIcon={<UserCheck className="w-4 h-4" />}>
                  {t('register')}
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageToggle minimal />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-base font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-900 rounded-lg"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated && user ? (
              <Link
                to={user.role === 'ADMIN' ? '/admin/dashboard' : '/aww/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button fullWidth variant="primary" leftIcon={<LayoutDashboard className="w-4 h-4" />}>
                  {t('dashboard')} ({user.role})
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button fullWidth variant="outline" leftIcon={<LogIn className="w-4 h-4" />}>
                    {t('login')}
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button fullWidth variant="primary" leftIcon={<UserCheck className="w-4 h-4" />}>
                    {t('register')}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

