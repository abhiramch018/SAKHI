import React from 'react';

interface SakhiLogoMarkProps {
  size?: number;
  className?: string;
}

/**
 * Built-in SAKHI logo mark — human-centered embrace motif.
 * Replace via brandConfig when an official asset is provided.
 */
export const SakhiLogoMark: React.FC<SakhiLogoMarkProps> = ({
  size = 40,
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="SAKHI logo"
  >
    <rect x="1" y="1" width="46" height="46" rx="12" fill="#0f766e" />
    <rect
      x="1"
      y="1"
      width="46"
      height="46"
      rx="12"
      stroke="#0d9488"
      strokeWidth="1"
      fill="none"
    />
    {/* Protective embrace arcs */}
    <path
      d="M24 11 C17 11 12 17 12 24 C12 27 13 30 15 32"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M24 11 C31 11 36 17 36 24 C36 27 35 30 33 32"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M15 32 Q24 39 33 32"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    {/* Care center — warmth & community */}
    <circle cx="24" cy="25" r="4" fill="#fbbf24" />
    <circle cx="24" cy="25" r="2" fill="#fef3c7" opacity="0.6" />
  </svg>
);
