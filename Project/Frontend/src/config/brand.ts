/**
 * SAKHI brand configuration.
 *
 * To replace with an official logo asset later, update `logoMarkSrc`
 * to point at the new file (e.g. "/assets/brand/official-logo.svg")
 * and set `useBuiltInMark` to false.
 */
export const brandConfig = {
  name: 'SAKHI',
  tagline: 'Community Health Companion',
  /** Path to external logo mark image (used when useBuiltInMark is false) */
  logoMarkSrc: '/assets/brand/logo-mark.svg',
  /** When true, renders the built-in SVG mark; when false, uses logoMarkSrc */
  useBuiltInMark: true,
  faviconSrc: '/favicon.svg',
  themeColor: '#0f766e',
} as const;
