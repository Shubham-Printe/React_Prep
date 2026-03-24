// Color utility functions for consistent theming
export const getTextColor = (mode: 'light' | 'dark') => ({
  primary: mode === 'dark' ? '#FFFFFF' : '#111827',
  secondary: mode === 'dark' ? '#B0B0B0' : '#4B5563',
  muted: mode === 'dark' ? '#9CA3AF' : '#6B7280',
  light: mode === 'dark' ? '#E5E7EB' : '#374151',
});

export const getBackgroundColor = (mode: 'light' | 'dark') => ({
  primary: mode === 'dark' ? '#0A0A0A' : '#FFFFFF',
  secondary: mode === 'dark' ? '#1A1A1A' : '#F8FAFC',
  card: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
  cardHover: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
});

export const getBorderColor = (mode: 'light' | 'dark') => ({
  light: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
  medium: mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
  strong: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
});

export const getAccentColor = (mode: 'light' | 'dark') => ({
  primary: mode === 'dark' ? '#8B5CF6' : '#2563EB',
  secondary: mode === 'dark' ? '#EC4899' : '#DC2626',
  hover: mode === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(37, 99, 235, 0.1)',
  text: mode === 'dark' ? '#E0E7FF' : '#1E40AF',
});
