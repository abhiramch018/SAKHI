import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'low' | 'medium' | 'high' | 'info' | 'success' | 'warning' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = ''
}) => {
  const variants = {
    low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    high: 'bg-rose-50 text-rose-700 border-rose-200 font-bold animate-pulse',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-teal-50 text-teal-700 border-teal-200',
    warning: 'bg-orange-50 text-orange-700 border-orange-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 font-semibold rounded-full border
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

