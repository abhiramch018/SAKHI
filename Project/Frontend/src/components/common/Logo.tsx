import React from 'react';
import { Link } from 'react-router-dom';
import { SakhiLogoMark } from './SakhiLogoMark';
import { brandConfig } from '../../config/brand';

interface LogoProps {
  variant?: 'default' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  to?: string;
  className?: string;
}

const markSizes = { sm: 32, md: 40, lg: 52 };

const textSizes = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
};

export const Logo: React.FC<LogoProps> = ({
  variant = 'default',
  size = 'md',
  showText = true,
  to = '/',
  className = '',
}) => {
  const isLight = variant === 'light';
  const isDark = variant === 'dark';

  const nameColor = isLight
    ? 'text-white'
    : isDark
    ? 'text-slate-100'
    : 'text-teal-900';

  const taglineColor = isLight
    ? 'text-teal-100'
    : isDark
    ? 'text-slate-400'
    : 'text-slate-500';

  const mark = brandConfig.useBuiltInMark ? (
    <SakhiLogoMark size={markSizes[size]} />
  ) : (
    <img
      src={brandConfig.logoMarkSrc}
      alt={`${brandConfig.name} logo`}
      width={markSizes[size]}
      height={markSizes[size]}
      className="object-contain"
    />
  );

  const content = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="shrink-0">{mark}</div>
      {showText && (
        <div className="flex flex-col text-left min-w-0">
          <span
            className={`font-bold tracking-tight font-sans leading-none ${textSizes[size]} ${nameColor}`}
          >
            {brandConfig.name}
          </span>
          <span
            className={`text-[10px] sm:text-xs font-medium leading-tight line-clamp-1 mt-0.5 ${taglineColor}`}
          >
            {brandConfig.tagline}
          </span>
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-block hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
};
