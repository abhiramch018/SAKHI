import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Logo } from '../common/Logo';
import { LanguageToggle } from '../common/LanguageToggle';
import {
  LayoutDashboard,
  Users,
  Sliders,
  FileCheck2,
  TrendingUp,
  Award,
  BookOpen,
  LogOut,
  ShieldAlert,
  Menu,
  X
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const adminNavItems = [
    { label: 'Admin Overview', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'AWW Monitoring', to: '/admin/awws', icon: Users },
    { label: 'Decision Rules', to: '/admin/rules', icon: Sliders },
    { label: 'Counselling Reports', to: '/admin/reports', icon: FileCheck2 },
    { label: 'Performance Analytics', to: '/admin/performance', icon: TrendingUp },
    { label: 'Milestones & Badges', to: '/admin/milestones', icon: Award },
    { label: 'Course Management', to: '/admin/learning', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white px-4 sm:px-8 h-16 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 lg:hidden"
          >
            {mobileDrawerOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <Logo size="sm" variant="light" to="/admin/dashboard" />
          <span className="hidden sm:inline-block text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-md uppercase tracking-wider">
            Admin Console
          </span>
        </div>

        <div className="flex items-center gap-4">
          <LanguageToggle minimal />

          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-700">
            <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-100">{user?.name || 'Administrator'}</span>
              <span className="text-[10px] text-teal-400 font-medium">FMCH Central Office</span>
            </div>
          </div>

          <button
            onClick={logout}
            title={t('logout')}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-1">
            <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Management Portal
            </div>

            {adminNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all
                    ${isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Quick Info Box */}
          <div className="bg-teal-900/10 border border-teal-700/20 rounded-2xl p-4 text-teal-950 space-y-2">
            <div className="flex items-center gap-1.5 text-teal-800 font-bold text-xs">
              <ShieldAlert className="w-4 h-4" />
              <span>FMCH Rule Engine</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Rules configured in the Decision Tree module directly dictate AWW field guidance algorithms and risk categorizations.
            </p>
          </div>
        </aside>

        {/* Main Admin Content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="fixed top-0 left-0 bottom-0 w-72 bg-white p-5 shadow-2xl z-10 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <Logo size="sm" />
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={({ isActive }) => `
                        flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all
                        ${isActive
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-700 hover:bg-slate-100'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 text-rose-600 bg-rose-50 hover:bg-rose-100 font-bold text-xs py-2.5 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

