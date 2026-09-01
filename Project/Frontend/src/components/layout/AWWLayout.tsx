import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Logo } from '../common/Logo';
import { OfflineBanner } from '../common/OfflineBanner';
import { LanguageToggle } from '../common/LanguageToggle';
import {
  LayoutDashboard,
  Users,
  HeartPulse,
  FileText,
  GraduationCap,
  Award,
  MessageSquareText,
  LogOut,
  Menu,
  X,
  HelpCircle,
  Bell,
  LucideIcon,
} from 'lucide-react';

type NavLabelKey = 'dashboard' | 'beneficiaries' | 'counselling' | 'reports' | 'learning' | 'milestones' | 'askAi';

interface NavItem {
  labelKey: NavLabelKey;
  to: string;
  icon: LucideIcon;
}

const navSections: { label: string; items: NavItem[] }[] = [
  {
    label: 'Field Operations',
    items: [
      { labelKey: 'dashboard', to: '/aww/dashboard', icon: LayoutDashboard },
      { labelKey: 'beneficiaries', to: '/aww/beneficiaries', icon: Users },
      { labelKey: 'counselling', to: '/aww/counselling/new', icon: HeartPulse },
      { labelKey: 'reports', to: '/aww/reports', icon: FileText },
    ],
  },
  {
    label: 'Learning & Support',
    items: [
      { labelKey: 'learning', to: '/aww/learning', icon: GraduationCap },
      { labelKey: 'milestones', to: '/aww/milestones', icon: Award },
      { labelKey: 'askAi', to: '/aww/ask', icon: MessageSquareText },
    ],
  },
];

const allNavItems: NavItem[] = navSections.flatMap((s) => s.items);

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      {navSections.map((section) => (
        <div key={section.label}>
          <div className="px-2 mb-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            {section.label}
          </div>
          <div className="space-y-0">
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-2 py-2 text-[13px] font-medium border-l-2 transition-colors ${
                      isActive
                        ? 'border-blue-900 bg-blue-50 text-blue-900'
                        : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{t(item.labelKey)}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function UserBlock({ user, onLogout }: { user: { name?: string; email?: string } | null; onLogout: () => void }) {
  const { t } = useLanguage();

  return (
    <div className="border-t border-slate-200 pt-3 space-y-2">
      <div className="px-2">
        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
          AWW Field Unit
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-900 text-white font-bold flex items-center justify-center text-xs shrink-0">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-bold text-slate-900 truncate">{user?.name || 'Anganwadi Worker'}</div>
            <div className="text-[10px] text-slate-500">Anganwadi Worker</div>
          </div>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-1.5 text-slate-600 hover:text-rose-700 hover:bg-rose-50 font-semibold text-[11px] py-1.5 border border-slate-200 transition-colors"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>{t('logout')}</span>
      </button>
    </div>
  );
}

export const AWWLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const isAssistantPage = location.pathname === '/aww/ask';

  return (
    <div className="h-screen bg-[#f4f6f8] flex flex-col overflow-hidden">
      <OfflineBanner />

      <header className="shrink-0 z-40 bg-white border-b border-slate-200">
        <div className="w-full px-4 sm:px-5 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 md:hidden shrink-0"
              aria-label="Toggle menu"
            >
              {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Logo size="md" to="/aww/dashboard" />
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <LanguageToggle minimal />
            <button
              type="button"
              className="hidden sm:flex p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="hidden sm:flex p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Help"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <div className="hidden sm:block w-px h-8 bg-slate-200" />
            <div className="hidden sm:flex items-center gap-2.5 pl-1">
              <div className="text-right">
                <div className="text-sm font-bold text-slate-900 leading-tight">{user?.name || 'AWW'}</div>
                <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
                  Anganwadi Worker
                </div>
              </div>
              <div className="w-9 h-9 bg-blue-900 text-white font-bold flex items-center justify-center text-sm">
                {user?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 min-h-0 w-full flex overflow-hidden">
        <aside className="hidden md:flex w-[240px] shrink-0 border-r border-slate-200 bg-white flex-col">
          <div className="shrink-0 px-4 py-2.5 border-b border-slate-100">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">AWW Portal</div>
          </div>
          <div className="flex-1 min-h-0 px-2 py-3 overflow-y-auto">
            <SidebarNav />
          </div>
          <div className="shrink-0 px-3 pb-3">
            <UserBlock user={user} onLogout={logout} />
          </div>
        </aside>

        <main
          className={`flex-1 min-w-0 min-h-0 flex flex-col ${
            isAssistantPage ? 'p-2 sm:p-3 overflow-hidden' : 'p-4 sm:p-6 overflow-auto'
          }`}
        >
          <Outlet />
        </main>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-1 py-1 flex items-center justify-around">
        {allNavItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center p-1.5 min-w-[52px] ${
                  isActive ? 'text-blue-900' : 'text-slate-500'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] mt-0.5 font-semibold line-clamp-1">{t(item.labelKey)}</span>
            </NavLink>
          );
        })}
      </nav>

      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-slate-900/40" onClick={() => setMobileDrawerOpen(false)} />
          <div className="fixed top-0 left-0 bottom-0 w-72 bg-white border-r border-slate-200 flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <Logo size="sm" to="/aww/dashboard" />
              <button onClick={() => setMobileDrawerOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              <SidebarNav onNavigate={() => setMobileDrawerOpen(false)} />
            </div>
            <div className="p-4">
              <UserBlock user={user} onLogout={logout} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
