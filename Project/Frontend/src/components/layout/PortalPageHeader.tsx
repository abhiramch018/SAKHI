import React from 'react';
import { Link } from 'react-router-dom';

interface PortalPageHeaderProps {
  section: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  status?: { label: string; available: boolean };
}

export const PortalPageHeader: React.FC<PortalPageHeaderProps> = ({
  section,
  title,
  description,
  actions,
  status,
}) => {
  const crumbs = section.split('/').map((part) => part.trim()).filter(Boolean);

  return (
    <div className="border border-slate-200 bg-white">
      <div className="px-5 sm:px-6 py-4 border-b border-slate-100">
        <nav className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
          {crumbs.map((crumb, i) => (
            <span key={crumb}>
              {i > 0 && <span className="mx-2 text-slate-300">/</span>}
              {i < crumbs.length - 1 ? (
                <span>{crumb}</span>
              ) : (
                <span className="text-slate-600">{crumb}</span>
              )}
            </span>
          ))}
        </nav>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="space-y-2 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {title}
              </h1>
              {status && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600 border border-slate-200 px-2.5 py-1 bg-slate-50">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      status.available ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  {status.label}
                </span>
              )}
            </div>
            {description && (
              <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">{description}</p>
            )}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
        </div>
      </div>
    </div>
  );
};

export const PortalSection: React.FC<{
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}> = ({ title, subtitle, children, className = '', action }) => (
  <section className={`border border-slate-200 bg-white ${className}`}>
    {(title || action) && (
      <div className="px-5 sm:px-6 py-3 border-b border-slate-100 flex items-center justify-between gap-3">
        <div>
          {title && <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">{title}</h2>}
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
    )}
    <div className="p-5 sm:p-6">{children}</div>
  </section>
);

export const PortalLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <Link to={to} className="text-slate-500 hover:text-blue-900 transition-colors">
    {children}
  </Link>
);
