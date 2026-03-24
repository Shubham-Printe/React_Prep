'use client';

import { IconButton, Tooltip } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ThemeToggle() {
  const { mode, toggleMode } = useTheme();
  const { t } = useLanguage();

  return (
    <Tooltip title={t('navigation.toggleTheme').replace('{mode}', mode === 'dark' ? 'light' : 'dark')}>
      <IconButton
        onClick={toggleMode}
        sx={{
          color: '#F8FAFC',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          width: 48,
          height: 48,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            transform: 'scale(1.05)',
            borderColor: 'rgba(255, 255, 255, 0.4)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        {mode === 'dark' ? <LightMode /> : <DarkMode />}
      </IconButton>
    </Tooltip>
  );
}
