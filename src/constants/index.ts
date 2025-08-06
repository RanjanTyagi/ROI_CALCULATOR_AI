export const APP_CONFIG = {
  name: 'ROI Campaign Tracker',
  description: 'Track and analyze your marketing campaign performance',
  version: '1.0.0',
} as const;

export const CHART_COLORS = {
  primary: '#2563eb',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#06b6d4',
} as const;

export const CURRENCY = {
  code: 'INR',
  symbol: '₹',
  locale: 'en-IN',
} as const;

export const DATE_FORMATS = {
  short: 'MMM dd, yyyy',
  long: 'MMMM dd, yyyy HH:mm',
  iso: 'yyyy-MM-dd',
} as const;